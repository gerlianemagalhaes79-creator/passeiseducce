import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  initAndSeedSupabase,
  checkSupabaseStatus,
  getCandidateSettings,
  updateCandidateSettings,
  getContentTopics,
  createContentTopic,
  updateContentTopic,
  deleteContentTopic,
  getStudyActivities,
  createStudyActivity,
  updateStudyActivity,
  deleteStudyActivity,
  getQuestions,
  getMistakeRecords,
  createMistakeRecord,
  updateMistakeRecord,
  deleteMistakeRecord,
} from "./src/db/supabaseService.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("GEMINI_API_KEY not found in environment. AI mentor capabilities will run in simulation mode.");
}

// API Routes

// Health check and Supabase status combined
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    aiEnabled: !!ai,
    supabase: checkSupabaseStatus()
  });
});

app.get("/api/supabase-status", (req, res) => {
  res.json(checkSupabaseStatus());
});

// Candidate Settings Endpoints
app.get("/api/settings", async (req, res) => {
  try {
    const data = await getCandidateSettings();
    return res.json(data);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    res.status(500).json({ error: "Failed to fetch candidate settings" });
  }
});

app.put("/api/settings", async (req, res) => {
  try {
    const updates = req.body;
    const data = await updateCandidateSettings(updates);
    return res.json(data);
  } catch (error) {
    console.error("Failed to update settings:", error);
    res.status(500).json({ error: "Failed to update candidate settings" });
  }
});

// Content Topics Endpoints
app.get("/api/topics", async (req, res) => {
  try {
    const data = await getContentTopics();
    return res.json(data);
  } catch (error) {
    console.error("Failed to fetch topics:", error);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

app.post("/api/topics", async (req, res) => {
  try {
    const newTopic = req.body;
    const data = await createContentTopic(newTopic);
    res.json(data);
  } catch (error) {
    console.error("Failed to create topic:", error);
    res.status(500).json({ error: "Failed to create topic" });
  }
});

app.put("/api/topics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const data = await updateContentTopic(id, updates);
    return res.json(data);
  } catch (error) {
    console.error("Failed to update topic:", error);
    res.status(500).json({ error: "Failed to update topic" });
  }
});

app.delete("/api/topics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteContentTopic(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete topic:", error);
    res.status(500).json({ error: "Failed to delete topic" });
  }
});

// Study Activities Endpoints
app.get("/api/activities", async (req, res) => {
  try {
    const data = await getStudyActivities();
    return res.json(data);
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

app.post("/api/activities", async (req, res) => {
  try {
    const newAct = req.body;
    const data = await createStudyActivity(newAct);
    res.json(data);
  } catch (error) {
    console.error("Failed to create activity:", error);
    res.status(500).json({ error: "Failed to create activity" });
  }
});

app.put("/api/activities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const data = await updateStudyActivity(id, updates);
    res.json(data);
  } catch (error) {
    console.error("Failed to update activity:", error);
    res.status(500).json({ error: "Failed to update activity" });
  }
});

app.delete("/api/activities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteStudyActivity(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete activity:", error);
    res.status(500).json({ error: "Failed to delete activity" });
  }
});

// Questions Endpoints
app.get("/api/questions", async (req, res) => {
  try {
    const data = await getQuestions();
    return res.json(data);
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// Mistake Records Endpoints
app.get("/api/mistakes", async (req, res) => {
  try {
    const data = await getMistakeRecords();
    return res.json(data);
  } catch (error) {
    console.error("Failed to fetch mistakes:", error);
    res.status(500).json({ error: "Failed to fetch mistakes" });
  }
});

app.post("/api/mistakes", async (req, res) => {
  try {
    const newMistake = req.body;
    const data = await createMistakeRecord(newMistake);
    res.json(newMistake);
  } catch (error) {
    console.error("Failed to create mistake:", error);
    res.status(500).json({ error: "Failed to create mistake" });
  }
});

app.put("/api/mistakes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const data = await updateMistakeRecord(id, updates);
    res.json(data);
  } catch (error) {
    console.error("Failed to update mistake:", error);
    res.status(500).json({ error: "Failed to update mistake" });
  }
});

app.delete("/api/mistakes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteMistakeRecord(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete mistake:", error);
    res.status(500).json({ error: "Failed to delete mistake" });
  }
});

// Mentor Chat route with Gemini
app.post("/api/mentor", async (req, res) => {
  const { message, candidateState } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Mensagem do candidato é obrigatória." });
  }

  const {
    specialty = "Não especificado",
    examDate = "Não especificada",
    completedCount = 0,
    totalCount = 13,
    totalQuestions = 0,
    correctQuestions = 0,
    lastStudiedTopic = "Nenhum",
    recentActivities = [],
    highErrorTopics = [],
    atrasados = [],
    negligenciados = [],
    previstosHoje = []
  } = candidateState || {};

  if (!ai) {
    let responseText = `### Professor Mentor (Modo Simulação)\n\nOlá! Analisei seu estado atual de estudos para a **SEDUC-CE** (Especialidade: **${specialty}**).\n\nComo a chave do Gemini não está configurada localmente, estruturei uma orientação padrão com base no seu progresso real:\n\n* **Progresso do Edital:** Você cobriu **${completedCount}** de **${totalCount}** tópicos do mapa estratégico de preparação.\n* **Desempenho em Questões:** Resolveu **${totalQuestions}** questões com **${correctQuestions}** acertos (taxa de acerto de ${totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0}%).\n`;

    if (atrasados.length > 0) {
      responseText += `\n* ⚠️ **Atenção:** Você tem **${atrasados.length}** tópicos atrasados hoje, como: *${atrasados.join(", ")}*. Recomendo focar neles antes de avançar.`;
    } else {
      responseText += `\n* ✅ **Parabéns!** Você está em dia com seu calendário operacional.`;
    }

    if (negligenciados.length > 0) {
      responseText += `\n* 🔍 **Tópicos Negligenciados:** Vi que você ainda não dedicou tempo a: *${negligenciados.join(", ")}*. A FUNECE costuma cobrar muito esse conteúdo!`;
    }

    if (highErrorTopics.length > 0) {
      responseText += `\n* 📉 **Pontos de Dificuldade:** Seu caderno de erros aponta dificuldades em: *${highErrorTopics.join(", ")}*. Vale a pena fazer um ciclo focado de teoria e revisões ativas nessas áreas.`;
    }

    responseText += `\n\n* **Sua Pergunta:** "${message}"\n\n* **Recomendação Estratégica:** Faça do calendário sua prioridade operacional diária. Marque cada estudo como concluído para atualizar seu progresso automaticamente e continue alimentando seu Simulador e Caderno de Erros!`;

    return res.json({ response: responseText });
  }

  try {
    const prompt = `Você é o Professor Mentor, um mentor pedagógico de alto desempenho especializado em concursos públicos para professores no estado do Ceará, com foco na SEDUC-CE e na banca FUNECE/UECE.
Seu tom é motivador, extremamente pragmático, estratégico, amigável e direto. Você age como um assessor de estudos que conhece profundamente as táticas de estudo de alta performance.

Você NUNCA inventa dados fictícios sobre o progresso do aluno. Você analisa friamente os dados reais fornecidos a seguir e responde à dúvida ou desabafo do candidato.

DADOS REAIS DO CANDIDATO:
- Especialidade: ${specialty}
- Data Prevista da Prova: ${examDate}
- Cobertura do Mapa Estratégico de Conteúdos: ${completedCount} de ${totalCount} tópicos concluídos
- Histórico do Simulador: ${totalQuestions} questões resolvidas com ${correctQuestions} acertos (Aproveitamento: ${totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0}%)
- Último Tópico Estudado: ${lastStudiedTopic}
- Atividades Previstas para Hoje no Calendário: ${previstosHoje.length > 0 ? previstosHoje.join(", ") : "Nenhuma atividade prevista no calendário hoje"}
- Atividades Atrasadas no Calendário: ${atrasados.length > 0 ? atrasados.join(", ") : "Nenhuma atividade atrasada"}
- Tópicos Negligenciados (Zero ou quase nenhum estudo): ${negligenciados.length > 0 ? negligenciados.join(", ") : "Nenhum tópico negligenciado até agora"}
- Tópicos com Maior Índice de Erros no Caderno de Erros: ${highErrorTopics.length > 0 ? highErrorTopics.join(", ") : "Nenhum assunto crítico com baixo rendimento ainda"}
- Atividades Concluídas Recentemente: ${recentActivities.length > 0 ? recentActivities.join("; ") : "Nenhuma registrada recentemente"}

MENSAGEM DO CANDIDATO:
"${message}"

DIRETRIZES DE RESPOSTA:
1. Responda diretamente e naturalmente à mensagem do candidato, cruzando a dúvida dele com os dados reais acima.
2. Seja realista: se houver matérias atrasadas, aponte isso de forma construtiva ("Percebi que você está com LDB atrasado hoje, vamos resolver isso primeiro...").
3. Se ele perguntar o que estudar hoje, indique as atividades previstas para hoje ou prioridades claras (atrasados e negligenciados de maior relevância).
4. Forneça conselhos pedagógicos inteligentes para a banca FUNECE/UECE (que valoriza muito a literalidade da legislação e as tendências pedagógicas clássicas).
5. Responda de forma sucinta e bem estruturada usando Markdown (tópicos limpos e negritos estratégicos). Não exceda 4 parágrafos pequenos.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.error("Erro ao chamar o Gemini API para Mentoria:", error);
    res.status(500).json({ error: "Erro ao gerar resposta do Professor Mentor.", details: error.message });
  }
});

// Setup Vite or Static File Serving
async function setupServer() {
  // First seed database
  await initAndSeedSupabase();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});

