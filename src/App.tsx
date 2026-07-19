import { useState, useEffect, useMemo } from "react";
import { 
  LayoutDashboard, 
  BookOpen, 
  CalendarDays, 
  HelpCircle, 
  AlertTriangle, 
  Sparkles, 
  Database,
  GraduationCap,
  Flame,
  Award,
  BookMarked,
  User,
  Users,
  LogOut,
  ShieldAlert
} from "lucide-react";
import { ContentTopic, StudyActivity, Question, CandidateSettings, MistakeRecord } from "./types";
import { generateFull74DaySchedule } from "./lib/calendarGenerator";
import { getCompleteSyllabusSubjects } from "./data/completeSyllabus";
// Components
import Dashboard from "./components/Dashboard";
import ContentMap from "./components/ContentMap";
import StudyCalendar from "./components/StudyCalendar";
import QuestionSimulator from "./components/QuestionSimulator";
import MistakesNotebook from "./components/MistakesNotebook";
import ProfessorMentor from "./components/ProfessorMentor";
import IdentificationTab from "./components/IdentificationTab";
import UserManagement from "./components/UserManagement";

interface LoginFormProps {
  handleEmailSignIn: (email: string) => Promise<void>;
  authError: string | null;
}

function LoginForm({ handleEmailSignIn, authError }: LoginFormProps) {
  const [emailInput, setEmailInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await handleEmailSignIn(emailInput);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-light-navy/25 flex flex-col font-sans text-slate-800 antialiased py-12 px-4 sm:px-6 lg:px-8 justify-center items-center">
      <div className="max-w-md w-full space-y-6 bg-white border border-slate-100 p-8 rounded-2xl shadow-lg">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center border border-brand-navy/5 text-white shadow-md">
            <GraduationCap className="w-10 h-10 text-brand-green" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight font-display">
              Aprova <span className="text-brand-green">Professor</span>
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Plataforma Preparatória SEDUC-CE</p>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-600 font-semibold leading-relaxed text-center">
          Bem-vindo ao portal de estudos preparatórios premium. Esta plataforma é de uso exclusivo para candidatos autorizados.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label htmlFor="login-email" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Seu E-mail Cadastrado
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="nome@exemplo.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              disabled={submitting}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
            />
          </div>

          {authError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-bold border border-red-100 text-left leading-relaxed">
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-navy hover:bg-brand-navy/95 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed block"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0"></div>
                <span>Verificando Acesso...</span>
              </>
            ) : (
              <span>Entrar na Plataforma</span>
            )}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Atalho Rápido</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        <button
          onClick={async () => {
            setSubmitting(true);
            setEmailInput("gerlianemagalhaes79@gmail.com");
            await handleEmailSignIn("gerlianemagalhaes79@gmail.com");
            setSubmitting(false);
          }}
          disabled={submitting}
          className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider rounded-xl border border-emerald-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Entrar como Administrador Principal
        </button>

        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2 border-t border-slate-50">
          Acesso Restrito. Em caso de dúvidas, contate o administrador.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [supabaseStatus, setSupabaseStatus] = useState<{ enabled: boolean; tablesMissing: boolean; setupSql: string } | null>(null);
  const [showSqlSetup, setShowSqlSetup] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Authentication and Authorization states
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Core Educational States
  const [topics, setTopics] = useState<ContentTopic[]>([]);
  const [activities, setActivities] = useState<StudyActivity[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [settings, setSettings] = useState<CandidateSettings>({
    id: "default-settings",
    targetExam: "SEDUC-CE (Ceará)",
    examBoard: "FUNECE / UECE",
    specialty: "Biologia",
    examDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dailyStudyHours: 4,
    createdAt: new Date().toISOString()
  });

  // Dynamically merge 100% of the syllabus subjects (basic + chosen specialty) with database state
  const mergedTopics = useMemo(() => {
    const syllabusSubjects = getCompleteSyllabusSubjects(settings.specialty || "Biologia");
    const list: ContentTopic[] = [];

    syllabusSubjects.forEach(subject => {
      subject.blocks.forEach(block => {
        block.microTopics.forEach(micro => {
          // Match by ID or Name
          const matchingDbTopic = topics.find(t => t.id === micro.id || t.name === micro.name);
          if (matchingDbTopic) {
            list.push({
              ...matchingDbTopic,
              id: micro.id, // standardize ID
              subject: subject.displayName,
              axis: block.name, // block name as axis
              name: micro.name,
              relevance: micro.relevance,
              importanceScore: micro.importanceScore
            });
          } else {
            list.push({
              id: micro.id,
              subject: subject.displayName,
              axis: block.name,
              name: micro.name,
              relevance: micro.relevance,
              importanceScore: micro.importanceScore,
              status: "not_started",
              totalQuestionsSolved: 0,
              correctQuestionsSolved: 0,
              createdAt: new Date().toISOString()
            });
          }
        });
      });
    });

    // Also include any user-created topics that aren't in standard syllabus
    topics.forEach(dbTopic => {
      if (dbTopic.id.startsWith("topic-custom-")) {
        list.push(dbTopic);
      }
    });

    return list;
  }, [topics, settings.specialty]);

  // Auth local recovery on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("aprova_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsAuthorized(true);
      } catch (err) {
        console.error("Failed to parse stored auth user:", err);
      }
    }
    setAuthLoading(false);
  }, []);

  const handleEmailSignIn = async (email: string) => {
    setAuthError(null);
    setCheckingAuth(true);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setAuthError("Por favor, insira um e-mail válido.");
      setCheckingAuth(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail })
      });
      if (!res.ok) throw new Error("Connection failed");
      const data = await res.json();
      if (data.authorized && data.user) {
        setUser(data.user);
        setIsAuthorized(true);
        localStorage.setItem("aprova_user", JSON.stringify(data.user));
      } else {
        setAuthError("Este e-mail não possui permissão de acesso. Solicite a liberação ao administrador.");
      }
    } catch (err) {
      console.error("Login verification failed:", err);
      setAuthError("Falha ao conectar com o servidor para autenticar.");
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem("aprova_user");
    setUser(null);
    setIsAuthorized(false);
  };

  // Initialize from REST API
  useEffect(() => {
    if (!isAuthorized) {
      setIsLoading(false);
      return;
    }

    const initializeData = async () => {
      try {
        setIsLoading(true);
        const [settingsRes, topicsRes, activitiesRes, questionsRes, mistakesRes, statusRes] = await Promise.all([
          fetch("/api/settings").then(r => r.json()),
          fetch("/api/topics").then(r => r.json()),
          fetch("/api/activities").then(r => r.json()),
          fetch("/api/questions").then(r => r.json()),
          fetch("/api/mistakes").then(r => r.json()),
          fetch("/api/supabase-status").then(r => r.json()).catch(() => null),
        ]);

        setSettings(settingsRes);
        // Sort topics by priority/weight
        const sortedTopics = [...topicsRes].sort((a, b) => b.importanceScore - a.importanceScore);
        setTopics(sortedTopics);
        setActivities(activitiesRes);
        setQuestions(questionsRes);
        // Sort mistakes by newest
        const sortedMistakes = [...mistakesRes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setMistakes(sortedMistakes);

        if (statusRes) {
          setSupabaseStatus(statusRes);
        }

        if (!settingsRes.candidateName) {
          setActiveTab("identification");
        }
      } catch (err) {
        console.error("Erro geral na inicialização:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Content Mapping operations
  const handleAddTopic = async (newTopic: Omit<ContentTopic, "id" | "createdAt">) => {
    const randomId = "topic-custom-" + Math.random().toString(36).substring(2, 9);
    try {
      const fullData = {
        id: randomId,
        ...newTopic,
        createdAt: new Date().toISOString()
      };
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullData)
      });
      const saved = await res.json();
      setTopics(prev => [...prev, saved]);
    } catch (error) {
      console.error("Erro ao salvar tópico:", error);
    }
  };

  const handleUpdateTopic = async (id: string, updates: Partial<ContentTopic>) => {
    try {
      const existingTopic = mergedTopics.find(t => t.id === id);
      const fullTopicData = existingTopic ? { ...existingTopic, ...updates } : updates;

      const res = await fetch(`/api/topics/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullTopicData)
      });
      const saved = await res.json();
      setTopics(prev => prev.map(t => t.id === id ? saved : t));
    } catch (error) {
      console.error("Erro ao atualizar tópico:", error);
    }
  };

  const handleDeleteTopic = async (id: string) => {
    try {
      await fetch(`/api/topics/${id}`, { method: "DELETE" });
      setTopics(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Erro ao deletar tópico:", error);
    }
  };

  // Study Activities / Calendário operations
  const handleAddActivity = async (newAct: Omit<StudyActivity, "id" | "createdAt">) => {
    const randomId = "act-" + Math.random().toString(36).substring(2, 9);
    try {
      const fullData = {
        id: randomId,
        ...newAct,
        createdAt: new Date().toISOString()
      };
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullData)
      });
      const saved = await res.json();
      setActivities(prev => [...prev, saved]);
    } catch (error) {
      console.error("Erro ao criar atividade:", error);
    }
  };

  const handleUpdateActivity = async (id: string, updates: Partial<StudyActivity>) => {
    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      const saved = await res.json();
      setActivities(prev => prev.map(act => act.id === id ? saved : act));
    } catch (error) {
      console.error("Erro ao atualizar atividade:", error);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      await fetch(`/api/activities/${id}`, { method: "DELETE" });
      setActivities(prev => prev.filter(act => act.id !== id));
    } catch (error) {
      console.error("Erro ao deletar atividade:", error);
    }
  };

  // Global settings update
  const handleUpdateSettings = async (updates: Partial<CandidateSettings>) => {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      const saved = await res.json();
      setSettings(saved);
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
    }
  };

  const handleRebuildSchedule = async (startDate: string, updatedSettings?: CandidateSettings) => {
    try {
      const activeSettings = updatedSettings || settings;
      // 1. Clear all current activities on server and locally
      await Promise.all(activities.map(act => fetch(`/api/activities/${act.id}`, { method: "DELETE" })));
      
      // 2. Generate strategic 74-day activities
      const newActivities = generateFull74DaySchedule(startDate, activeSettings, topics);
      const savedActivities: StudyActivity[] = [];
      for (const act of newActivities) {
        const randomId = "act-" + Math.random().toString(36).substring(2, 9);
        const fullData = {
          id: randomId,
          ...act,
          createdAt: new Date().toISOString()
        };
        const res = await fetch("/api/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fullData)
        });
        const saved = await res.json();
        savedActivities.push(saved);
      }
      setActivities(savedActivities);
    } catch (err) {
      console.error("Erro ao reconstruir cronograma:", err);
    }
  };

  // Feed topic state when question solved in simulator
  const handleSolveQuestion = async (topicId: string, isCorrect: boolean) => {
    const topic = mergedTopics.find(t => t.id === topicId);
    if (!topic) return;

    const totalSolved = (topic.totalQuestionsSolved || 0) + 1;
    const correctSolved = (topic.correctQuestionsSolved || 0) + (isCorrect ? 1 : 0);

    await handleUpdateTopic(topicId, {
      totalQuestionsSolved: totalSolved,
      correctQuestionsSolved: correctSolved
    });
  };

  // Record a mistake in Caderno de Erros
  const handleRecordMistake = async (question: Question, selectedIndex: number) => {
    const randomId = "mistake-" + Math.random().toString(36).substring(2, 9);
    try {
      const newMistake: MistakeRecord = {
        id: randomId,
        questionId: question.id,
        topicId: question.topicId,
        topicName: question.topicName,
        subject: question.subject,
        questionText: question.text,
        options: question.options,
        correctIndex: question.correctIndex,
        selectedOptionIndex: selectedIndex,
        explanation: question.explanation,
        createdAt: new Date().toISOString(),
        resolved: false,
        reviewCount: 0
      };
      const res = await fetch("/api/mistakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMistake)
      });
      const saved = await res.json();
      setMistakes(prev => [saved, ...prev]);
    } catch (error) {
      console.error("Erro ao registrar erro:", error);
    }
  };

  const handleResolveMistake = async (id: string, resolved: boolean) => {
    try {
      const res = await fetch(`/api/mistakes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolved })
      });
      const saved = await res.json();
      setMistakes(prev => prev.map(m => m.id === id ? saved : m));
    } catch (error) {
      console.error("Erro ao resolver erro:", error);
    }
  };

  const handleDeleteMistake = async (id: string) => {
    try {
      await fetch(`/api/mistakes/${id}`, { method: "DELETE" });
      setMistakes(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error("Erro ao deletar erro:", error);
    }
  };

  // Quick helper to change tabs from dashboard links
  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard 
            topics={mergedTopics}
            activities={activities}
            settings={settings}
            mistakes={mistakes}
            onNavigate={navigateToTab}
          />
        );
      case "identification":
        return (
          <IdentificationTab 
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onRebuildSchedule={handleRebuildSchedule}
            onNavigate={navigateToTab}
          />
        );
      case "content-map":
        return (
          <ContentMap 
            topics={mergedTopics}
            specialty={settings.specialty}
            onAddTopic={handleAddTopic}
            onUpdateTopic={handleUpdateTopic}
            onDeleteTopic={handleDeleteTopic}
          />
        );
      case "calendar":
        return (
          <StudyCalendar 
            activities={activities}
            topics={mergedTopics}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onAddActivity={handleAddActivity}
            onUpdateActivity={handleUpdateActivity}
            onDeleteActivity={handleDeleteActivity}
            onUpdateTopicStatus={(topicId, status, date) => handleUpdateTopic(topicId, { status, lastStudiedAt: date })}
          />
        );
      case "simulator":
        return (
          <QuestionSimulator 
            questions={questions}
            topics={mergedTopics}
            onSolveQuestion={handleSolveQuestion}
            onRecordMistake={handleRecordMistake}
            settings={settings}
          />
        );
      case "mistakes":
        return (
          <MistakesNotebook 
            mistakes={mistakes}
            onResolveMistake={handleResolveMistake}
            onDeleteMistake={handleDeleteMistake}
          />
        );
      case "mentor":
        return (
          <ProfessorMentor 
            topics={mergedTopics}
            activities={activities}
            settings={settings}
            mistakes={mistakes}
          />
        );
      case "users":
        return (
          <UserManagement />
        );
      default:
        return (
          <Dashboard 
            topics={mergedTopics}
            activities={activities}
            settings={settings}
            mistakes={mistakes}
            onNavigate={navigateToTab}
          />
        );
    }
  };

  // 1. Loading state for Auth
  if (authLoading || (user && checkingAuth)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-3 font-sans text-slate-800 antialiased">
        <div className="relative flex h-8 w-8">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
          <span className="relative inline-flex rounded-full h-8 w-8 bg-brand-navy"></span>
        </div>
        <p className="text-xs font-bold text-slate-400">Verificando credenciais e permissões de acesso...</p>
      </div>
    );
  }

  // 2. Gate: Unauthenticated User
  if (!user) {
    return <LoginForm handleEmailSignIn={handleEmailSignIn} authError={authError} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-3 font-sans text-slate-800 antialiased">
        <div className="relative flex h-8 w-8">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
          <span className="relative inline-flex rounded-full h-8 w-8 bg-brand-navy"></span>
        </div>
        <p className="text-xs font-bold text-slate-400">Mapeando base estratégica e iniciando mentor...</p>
      </div>
    );
  }

  // Full-screen onboarding gate before entering the system
  if (!settings.candidateName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-light-navy/20 flex flex-col font-sans text-slate-800 antialiased py-12 px-4 sm:px-6 lg:px-8 justify-center">
        <div className="max-w-2xl mx-auto w-full space-y-8">
          {/* Logo / Welcome Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 bg-brand-navy rounded-2xl flex items-center justify-center border border-brand-navy/5 text-white shadow-md">
              <GraduationCap className="w-8 h-8 text-brand-green" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight font-display leading-none">
              Aprova <span className="text-brand-green">Professor</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
              Seja muito bem-vindo ao seu ambiente preparatório premium para o concurso da <strong>SEDUC-CE 2026</strong>.
            </p>
            <div className="inline-flex items-center gap-2 bg-brand-light-green border border-brand-green/10 px-3.5 py-1 rounded-full">
              <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></div>
              <span className="text-[10px] font-extrabold text-brand-green tracking-wide uppercase">Onboarding Inicial Obrigatório</span>
            </div>
          </div>

          {/* Form */}
          <IdentificationTab 
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onRebuildSchedule={handleRebuildSchedule}
            onNavigate={(tab) => {
              navigateToTab(tab);
            }}
          />

          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Aprova Professor — Todos os seus dados de progresso e simulações são salvos com segurança em nuvem.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-green/10">
      {/* Top Navbar Header */}
      <nav className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-light-navy rounded-xl flex items-center justify-center border border-brand-navy/5 text-brand-navy">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-brand-navy leading-none font-display">
              Aprova <span className="text-brand-green">Professor</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
              Plataforma Premium SEDUC-CE
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-brand-light-green border border-brand-green/10 px-3.5 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-brand-green rounded-full"></div>
            <span className="text-[11px] font-bold text-brand-green tracking-wide">Foco: Banca FUNECE/UECE</span>
          </div>
          <div className="hidden sm:flex gap-4">
            {supabaseStatus ? (
              supabaseStatus.enabled ? (
                <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-[11px] font-bold text-emerald-700">
                  <Database className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Supabase Sincronizado</span>
                </div>
              ) : supabaseStatus.tablesMissing ? (
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 text-[11px] font-bold text-amber-700 animate-pulse">
                  <Database className="h-3.5 w-3.5 text-amber-500" />
                  <span>Tabelas Supabase Ausentes</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-brand-light-navy px-3 py-1.5 rounded-lg border border-brand-navy/5 text-[11px] font-bold text-slate-500">
                  <Database className="h-3.5 w-3.5 text-brand-green" />
                  <span>Sincronização Local</span>
                </div>
              )
            ) : (
              <div className="flex items-center gap-1.5 bg-brand-light-navy px-3 py-1.5 rounded-lg border border-brand-navy/5 text-[11px] font-bold text-slate-500">
                <Database className="h-3.5 w-3.5 text-brand-green" />
                <span>Sincronização Local</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        {/* Responsive Side Menu Drawer/Nav rail */}
        <aside className="lg:w-64 flex-shrink-0 flex flex-col gap-6">
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-5 sticky top-22">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">Painel de Estudo</p>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveTab("dashboard"); }}
                  className={`w-full flex items-center gap-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === "dashboard" 
                      ? "bg-brand-light-navy text-brand-navy border-l-4 border-brand-green pl-3" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent pl-3"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Painel de Controle</span>
                </button>

                <button
                  onClick={() => { setActiveTab("content-map"); }}
                  className={`w-full flex items-center gap-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === "content-map" 
                      ? "bg-brand-light-navy text-brand-navy border-l-4 border-brand-green pl-3" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent pl-3"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Mapa de Conteúdos</span>
                </button>

                <button
                  onClick={() => { setActiveTab("calendar"); }}
                  className={`w-full flex items-center gap-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === "calendar" 
                      ? "bg-brand-light-navy text-brand-navy border-l-4 border-brand-green pl-3" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent pl-3"
                  }`}
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>Calendário de Estudos</span>
                </button>

                <button
                  onClick={() => { setActiveTab("simulator"); }}
                  className={`w-full flex items-center gap-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === "simulator" 
                      ? "bg-brand-light-navy text-brand-navy border-l-4 border-brand-green pl-3" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent pl-3"
                  }`}
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Simulador de Provas</span>
                </button>

                <button
                  onClick={() => { setActiveTab("mistakes"); }}
                  className={`w-full flex items-center gap-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === "mistakes" 
                      ? "bg-brand-light-navy text-brand-navy border-l-4 border-brand-green pl-3" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent pl-3"
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Caderno de Erros</span>
                  {mistakes.filter(m => !m.resolved).length > 0 && (
                    <span className="ml-auto bg-brand-green text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                      {mistakes.filter(m => !m.resolved).length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => { setActiveTab("mentor"); }}
                  className={`w-full flex items-center gap-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === "mentor" 
                      ? "bg-brand-light-navy text-brand-navy border-l-4 border-brand-green pl-3" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent pl-3"
                  }`}
                >
                  <Sparkles className="h-4 w-4 text-brand-green" />
                  <span>Professor Mentor AI</span>
                </button>

                <button
                  onClick={() => { setActiveTab("users"); }}
                  className={`w-full flex items-center gap-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === "users" 
                      ? "bg-brand-light-navy text-brand-navy border-l-4 border-brand-green pl-3" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent pl-3"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Gerenciar Usuários</span>
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2"></div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Suporte Ativo</p>
              <button 
                onClick={() => navigateToTab("simulator")}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-green hover:bg-brand-green/95 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
              >
                <HelpCircle className="h-3.5 w-3.5" /> Treinar Questões
              </button>
            </div>

            <div className={`p-3.5 bg-white border border-slate-200/80 rounded-xl relative overflow-hidden transition-all ${
              activeTab === "identification" ? "ring-2 ring-brand-green/20 border-brand-green" : ""
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Candidato(a)</p>
                  <p className="text-xs font-bold text-slate-700 truncate max-w-[130px]">{settings.candidateName}</p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-medium text-slate-500 gap-1">
                  <span className="truncate">Especialidade: <strong className="text-slate-700 font-bold">{settings.specialty}</strong></span>
                  <span className="text-brand-green font-bold shrink-0">
                    {topics.length > 0 ? Math.round((topics.filter(t => t.status === "studied").length / topics.length) * 100) : 0}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-green" style={{ width: `${topics.length > 0 ? Math.round((topics.filter(t => t.status === "studied").length / topics.length) * 100) : 0}%` }}></div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab("identification")}
                className="mt-3 w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 active:scale-[0.98] text-slate-600 rounded-lg text-[9px] font-extrabold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Editar Perfil
              </button>

              <button
                onClick={handleSignOut}
                className="mt-1.5 w-full py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 active:scale-[0.98] rounded-lg text-[9px] font-extrabold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Sair da Conta
              </button>
            </div>
          </div>
        </aside>

        {/* Dynamic Screen View */}
        <main className="flex-1 min-w-0 space-y-4">
          {supabaseStatus && supabaseStatus.tablesMissing && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Conexão Supabase Detectada — Tabelas Ausentes</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Seu projeto do Supabase foi configurado com sucesso! No entanto, as tabelas necessárias ainda não foram criadas no banco de dados. 
                    Por segurança e robustez, a plataforma está salvando seu progresso em um banco local temporário para você não perder dados.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowSqlSetup(!showSqlSetup)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {showSqlSetup ? "Ocultar Instruções SQL" : "Visualizar Instruções e SQL"}
                </button>
                
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(supabaseStatus.setupSql);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 3000);
                    } catch (err) {
                      console.error("Falha ao copiar:", err);
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {copiedSql ? "✓ Copiado!" : "Copiar Script SQL"}
                </button>
              </div>

              {showSqlSetup && (
                <div className="bg-slate-900 text-slate-100 rounded-xl p-4 mt-3 font-mono text-[11px] overflow-auto max-h-60 border border-slate-800">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Script SQL de Configuração</span>
                    <span className="text-[10px] text-amber-400">Execute no SQL Editor do Supabase</span>
                  </div>
                  <pre className="whitespace-pre-wrap">{supabaseStatus.setupSql}</pre>
                </div>
              )}
            </div>
          )}

          {renderActiveTab()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>Aprova Professor — Preparatório Inteligente para Concurso SEDUC-CE</span>
          <div className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-green"></span>
            <span>Estudos Sincronizados em Nuvem</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
