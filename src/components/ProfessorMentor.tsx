import { useState, useMemo } from "react";
import { 
  Sparkles, 
  Send, 
  User, 
  Trash2, 
  Info,
  BookOpen,
  HelpCircle,
  AlertOctagon,
  Award,
  BookMarked,
  Brain
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ContentTopic, StudyActivity, CandidateSettings, MistakeRecord } from "../types";

interface ProfessorMentorProps {
  topics: ContentTopic[];
  activities: StudyActivity[];
  settings: CandidateSettings;
  mistakes: MistakeRecord[];
}

interface Message {
  sender: "user" | "mentor";
  text: string;
}

export default function ProfessorMentor({ topics, activities, settings, mistakes }: ProfessorMentorProps) {
  // Compute state of the candidate to send to the AI
  const candidateState = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    const completedCount = topics.filter(t => t.status === "studied").length;
    const totalCount = topics.length;

    const totalQuestions = topics.reduce((sum, t) => sum + (t.totalQuestionsSolved || 0), 0);
    const correctQuestions = topics.reduce((sum, t) => sum + (t.correctQuestionsSolved || 0), 0);

    // Latest studied topic
    const completedActs = [...activities]
      .filter(a => a.status === "completed")
      .sort((a, b) => (b.completionDate || "").localeCompare(a.completionDate || ""));
    const lastStudiedTopic = completedActs.length > 0 ? completedActs[0].topicName : "Nenhum ainda";

    const recentActivities = completedActs.slice(0, 3).map(a => `${a.type.toUpperCase()} sobre "${a.topicName}"`);

    // High error topics from mistakes
    const errorTopicsMap: { [key: string]: number } = {};
    mistakes.filter(m => !m.resolved).forEach(m => {
      errorTopicsMap[m.topicName] = (errorTopicsMap[m.topicName] || 0) + 1;
    });
    const highErrorTopics = Object.entries(errorTopicsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);

    // Atrasados
    const atrasados = activities
      .filter(a => a.status === "planned" && a.scheduledDate < todayStr)
      .map(a => a.topicName);

    // Negligenciados (Zero questions, not studied)
    const negligenciados = topics
      .filter(t => t.status === "not_started" && t.totalQuestionsSolved === 0)
      .slice(0, 3)
      .map(t => t.name);

    // Previstos hoje
    const previstosHoje = activities
      .filter(a => a.status === "planned" && a.scheduledDate === todayStr)
      .map(a => a.topicName);

    return {
      specialty: settings.specialty,
      examDate: settings.examDate,
      completedCount,
      totalCount,
      totalQuestions,
      correctQuestions,
      lastStudiedTopic,
      recentActivities,
      highErrorTopics,
      atrasados,
      negligenciados,
      previstosHoje
    };
  }, [topics, activities, settings, mistakes]);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "mentor",
      text: `Olá! Eu sou o seu **Professor Mentor AI**, o seu consultor pedagógico focado no concurso da **SEDUC-CE**. 
      
Eu analiso em tempo real seu progresso, suas horas de estudo, seu histórico no simulador e os registros do seu caderno de erros para formular conselhos táticos.

Como posso ajudar sua preparação hoje? Você pode clicar nas sugestões ao lado ou digitar sua dúvida!`
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { sender: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          candidateState
        }),
      });

      const data = await response.json();
      if (response.ok && data.response) {
        setMessages(prev => [...prev, { sender: "mentor", text: data.response }]);
      } else {
        setMessages(prev => [...prev, { 
          sender: "mentor", 
          text: "Desculpe, ocorreu um erro ao consultar o Professor Mentor. Verifique se o servidor está ativo." 
        }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        sender: "mentor", 
        text: "Houve um problema de conexão. Verifique se o servidor backend está online." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "mentor",
        text: "Conversa redefinida. Como posso ajudar com sua preparação para o concurso de professores hoje?"
      }
    ]);
  };

  const suggestionPrompts = [
    {
      title: "O que estudar hoje?",
      prompt: "Com base no meu progresso real e pendências no calendário, o que eu deveria priorizar estudar hoje?",
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      title: "Análise de fraquezas",
      prompt: "Analise meu caderno de erros e minhas taxas de acerto e me diga onde estão meus maiores gargalos e como superá-los.",
      icon: <Brain className="h-4 w-4" />
    },
    {
      title: "Dica para a FUNECE",
      prompt: "Quais são as principais características da banca FUNECE/UECE na cobrança de Legislação e Didática, e como devo ler a LDB?",
      icon: <BookMarked className="h-4 w-4" />
    }
  ];

  return (
    <div id="mentor-chat-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[500px] animate-fade-in">
      
      {/* Suggestions column */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 flex flex-col justify-between h-full">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-brand-navy font-display uppercase tracking-wider">Análise de Dados Ativa</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium leading-relaxed">Use as sugestões abaixo para obter orientações pedagógicas exclusivas sobre seu estado de estudos</p>
          </div>

          <div className="space-y-3">
            {suggestionPrompts.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug.prompt)}
                disabled={isLoading}
                className="w-full text-left p-3.5 rounded-xl border border-slate-100 hover:border-brand-green/20 hover:bg-brand-light-green/30 transition-all flex items-start gap-3 group text-xs font-semibold text-slate-700 disabled:opacity-50 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-brand-light-navy text-brand-navy group-hover:bg-brand-navy group-hover:text-white flex-shrink-0 transition-colors">
                  {sug.icon}
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-brand-navy block">{sug.title}</span>
                  <p className="font-medium text-slate-400 line-clamp-2 leading-relaxed">{sug.prompt}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-brand-light-navy/50 rounded-2xl border border-brand-navy/5 text-[11px] text-slate-400 flex gap-2 items-start font-medium leading-relaxed">
          <Info className="h-4 w-4 text-brand-navy flex-shrink-0 mt-0.5" />
          <p>
            O Professor Mentor interpreta seus cliques e acertos reais. Ele não inventa cronogramas paralelos e age sempre como um reflexo estatístico do seu esforço.
          </p>
        </div>
      </div>

      {/* Main Chat box */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full justify-between">
        {/* Chat header */}
        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-navy text-white rounded-xl shadow-xs">
              <Sparkles className="h-4 w-4 text-brand-amber" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider font-display">Professor Mentor AI</h3>
              <p className="text-[10px] text-brand-green font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse"></span>
                Sincronizado com seu Edital e Desempenho
              </p>
            </div>
          </div>
          <button 
            onClick={clearChat}
            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
            title="Limpar histórico"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Chat Messages flow */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[500px]">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex items-start gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div className={`p-2 rounded-xl flex-shrink-0 ${msg.sender === "user" ? "bg-brand-light-green text-brand-green" : "bg-brand-navy text-white"}`}>
                {msg.sender === "user" ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
              </div>
              <div className={`p-4 rounded-2xl shadow-xs text-xs leading-relaxed space-y-2 markdown-body ${msg.sender === "user" ? "bg-brand-navy text-white rounded-tr-none font-semibold" : "bg-brand-light-navy/30 text-slate-700 rounded-tl-none border border-brand-navy/5 font-medium"}`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3 mr-auto max-w-[85%]">
              <div className="p-2 bg-brand-navy text-white rounded-xl flex-shrink-0">
                <Brain className="h-4 w-4 animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl bg-brand-light-navy/30 text-slate-400 rounded-tl-none border border-brand-navy/5 text-xs font-semibold flex items-center gap-2">
                <span>Analisando suas métricas de estudo e formulando orientação...</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce delay-200"></span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input form */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
          className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3"
        >
          <input
            type="text"
            disabled={isLoading}
            placeholder="Pergunte ao Professor Mentor sobre seu cronograma..."
            className="flex-1 px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green disabled:opacity-50 font-semibold text-slate-700"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 bg-brand-navy hover:bg-brand-navy/95 disabled:bg-brand-light-navy disabled:text-slate-400 text-white rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
