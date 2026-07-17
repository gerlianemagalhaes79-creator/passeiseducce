import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

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

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiEnabled: !!ai });
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
    // Elegant simulation mode when Gemini API Key is missing
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
