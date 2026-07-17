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
  User
} from "lucide-react";
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, seedFirestoreIfEmpty, handleFirestoreError, OperationType } from "./lib/firebase";
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

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  // Dynamically merge 100% of the syllabus subjects (basic + chosen specialty) with Firestore state
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

  // Initialize and Seed Firestore, then bind real-time listeners
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        // Seed database if empty
        await seedFirestoreIfEmpty();

        // 1. Listen for Strategic Content Topics
        const topicsUnsubscribe = onSnapshot(collection(db, "content_topics"), (snapshot) => {
          const list: ContentTopic[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as ContentTopic);
          });
          // Sort topics by priority / weight
          list.sort((a, b) => b.importanceScore - a.importanceScore);
          setTopics(list);
          setIsLoading(false);
        }, (error) => {
          console.error("Erro ao escutar tópicos:", error);
          setIsLoading(false);
          handleFirestoreError(error, OperationType.LIST, "content_topics");
        });

        // 2. Listen for Study Activities (Calendar)
        const activitiesUnsubscribe = onSnapshot(collection(db, "study_activities"), (snapshot) => {
          const list: StudyActivity[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as StudyActivity);
          });
          setActivities(list);
        }, (error) => {
          console.error("Erro ao escutar calendário:", error);
          handleFirestoreError(error, OperationType.LIST, "study_activities");
        });

        // 3. Listen for Seeded Questions
        const questionsUnsubscribe = onSnapshot(collection(db, "questions"), (snapshot) => {
          const list: Question[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as Question);
          });
          setQuestions(list);
        }, (error) => {
          console.error("Erro ao escutar simulador:", error);
          handleFirestoreError(error, OperationType.LIST, "questions");
        });

        // 4. Listen for Mistake Records (Caderno de Erros)
        const mistakesUnsubscribe = onSnapshot(collection(db, "mistake_records"), (snapshot) => {
          const list: MistakeRecord[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as MistakeRecord);
          });
          // Sort by newest
          list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
          setMistakes(list);
        }, (error) => {
          console.error("Erro ao escutar caderno de erros:", error);
          handleFirestoreError(error, OperationType.LIST, "mistake_records");
        });

        // 5. Listen for Candidate Settings
        const settingsUnsubscribe = onSnapshot(collection(db, "candidate_settings"), (snapshot) => {
          if (!snapshot.empty) {
            const firstDoc = snapshot.docs[0];
            const data = firstDoc.data() as CandidateSettings;
            setSettings({ id: firstDoc.id, ...data } as CandidateSettings);
            if (!data.candidateName) {
              setActiveTab("identification");
            }
          }
        }, (error) => {
          console.error("Erro ao escutar configurações do candidato:", error);
          handleFirestoreError(error, OperationType.LIST, "candidate_settings");
        });

        return () => {
          topicsUnsubscribe();
          activitiesUnsubscribe();
          questionsUnsubscribe();
          mistakesUnsubscribe();
          settingsUnsubscribe();
        };
      } catch (err) {
        console.error("Erro geral na inicialização:", err);
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Handlers for Firestore operations

  // Content Mapping operations
  const handleAddTopic = async (newTopic: Omit<ContentTopic, "id" | "createdAt">) => {
    const randomId = "topic-custom-" + Math.random().toString(36).substring(2, 9);
    const docRef = doc(db, "content_topics", randomId);
    try {
      const fullData = {
        id: randomId,
        ...newTopic,
        createdAt: new Date().toISOString()
      };
      const cleanData = Object.fromEntries(
        Object.entries(fullData).filter(([_, v]) => v !== undefined)
      );
      await setDoc(docRef, cleanData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `content_topics/${randomId}`);
    }
  };

  const handleUpdateTopic = async (id: string, updates: Partial<ContentTopic>) => {
    const docRef = doc(db, "content_topics", id);
    try {
      // Find default fields from our merged list in case the document doesn't exist yet in Firestore
      const existingTopic = mergedTopics.find(t => t.id === id);
      const fullTopicData = existingTopic ? { ...existingTopic, ...updates } : updates;
      
      const cleanData = Object.fromEntries(
        Object.entries(fullTopicData).filter(([_, v]) => v !== undefined)
      );
      await setDoc(docRef, cleanData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `content_topics/${id}`);
    }
  };

  const handleDeleteTopic = async (id: string) => {
    const docRef = doc(db, "content_topics", id);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `content_topics/${id}`);
    }
  };

  // Study Activities / Calendário operations
  const handleAddActivity = async (newAct: Omit<StudyActivity, "id" | "createdAt">) => {
    const randomId = "act-" + Math.random().toString(36).substring(2, 9);
    const docRef = doc(db, "study_activities", randomId);
    try {
      const fullData = {
        id: randomId,
        ...newAct,
        createdAt: new Date().toISOString()
      };
      const cleanData = Object.fromEntries(
        Object.entries(fullData).filter(([_, v]) => v !== undefined)
      );
      await setDoc(docRef, cleanData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `study_activities/${randomId}`);
    }
  };

  const handleUpdateActivity = async (id: string, updates: Partial<StudyActivity>) => {
    const docRef = doc(db, "study_activities", id);
    try {
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );
      await updateDoc(docRef, cleanUpdates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `study_activities/${id}`);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    const docRef = doc(db, "study_activities", id);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `study_activities/${id}`);
    }
  };

  // Global settings update
  const handleUpdateSettings = async (updates: Partial<CandidateSettings>) => {
    const docRef = doc(db, "candidate_settings", settings.id);
    try {
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );
      await updateDoc(docRef, cleanUpdates);
      // Update local state directly to ensure downstream generators get it immediately
      setSettings(prev => ({ ...prev, ...updates }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `candidate_settings/${settings.id}`);
    }
  };

  const handleRebuildSchedule = async (startDate: string, updatedSettings?: CandidateSettings) => {
    try {
      const activeSettings = updatedSettings || settings;
      // 1. Clear all current activities
      for (const act of activities) {
        await handleDeleteActivity(act.id);
      }
      // 2. Generate strategic 74-day activities
      const newActivities = generateFull74DaySchedule(startDate, activeSettings);
      for (const act of newActivities) {
        await handleAddActivity(act);
      }
    } catch (err) {
      console.error("Erro ao reconstruir cronograma:", err);
    }
  };

  // Feed topic state when question solved in simulator
  const handleSolveQuestion = async (topicId: string, isCorrect: boolean) => {
    const topic = topics.find(t => t.id === topicId);
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
    const docRef = doc(db, "mistake_records", randomId);
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
      const cleanMistake = Object.fromEntries(
        Object.entries(newMistake).filter(([_, v]) => v !== undefined)
      );
      await setDoc(docRef, cleanMistake);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `mistake_records/${randomId}`);
    }
  };

  const handleResolveMistake = async (id: string, resolved: boolean) => {
    const docRef = doc(db, "mistake_records", id);
    try {
      await updateDoc(docRef, { resolved });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `mistake_records/${id}`);
    }
  };

  const handleDeleteMistake = async (id: string) => {
    const docRef = doc(db, "mistake_records", id);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `mistake_records/${id}`);
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
            <div className="flex items-center gap-1.5 bg-brand-light-navy px-3 py-1.5 rounded-lg border border-brand-navy/5 text-[11px] font-bold text-slate-500">
              <Database className="h-3.5 w-3.5 text-brand-green" />
              <span>Sincronização Ativa</span>
            </div>
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
            </div>
          </div>
        </aside>

        {/* Dynamic Screen View */}
        <main className="flex-1 min-w-0">
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
