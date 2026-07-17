import { useMemo } from "react";
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  Award, 
  ArrowRight,
  BookMarked
} from "lucide-react";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from "recharts";
import { ContentTopic, StudyActivity, CandidateSettings, MistakeRecord } from "../types";

interface DashboardProps {
  topics: ContentTopic[];
  activities: StudyActivity[];
  settings: CandidateSettings;
  mistakes: MistakeRecord[];
  onNavigate: (tab: string, arg?: string) => void;
}

export default function Dashboard({ topics, activities, settings, mistakes, onNavigate }: DashboardProps) {
  // 1. Calculate statistics
  const totalTopicsCount = topics.length;
  
  const completedTopicsCount = useMemo(() => {
    return topics.filter(t => t.status === "studied").length;
  }, [topics]);

  const studyingTopicsCount = useMemo(() => {
    return topics.filter(t => t.status === "studying" || t.status === "needs_review").length;
  }, [topics]);

  const strategicCoveragePercent = useMemo(() => {
    if (totalTopicsCount === 0) return 0;
    return Math.round((completedTopicsCount / totalTopicsCount) * 100);
  }, [completedTopicsCount, totalTopicsCount]);

  // Question stats
  const totalQuestionsSolved = useMemo(() => {
    return topics.reduce((sum, t) => sum + (t.totalQuestionsSolved || 0), 0);
  }, [topics]);

  const totalCorrectSolved = useMemo(() => {
    return topics.reduce((sum, t) => sum + (t.correctQuestionsSolved || 0), 0);
  }, [topics]);

  const hitRatePercent = useMemo(() => {
    if (totalQuestionsSolved === 0) return 0;
    return Math.round((totalCorrectSolved / totalQuestionsSolved) * 100);
  }, [totalCorrectSolved, totalQuestionsSolved]);

  // Exam Countdown
  const daysToExam = useMemo(() => {
    if (!settings.examDate) return 0;
    const examDateObj = new Date(settings.examDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    const diffTime = examDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [settings.examDate]);

  // Active Overdue tasks
  const overdueActivities = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return activities.filter(act => act.status === "planned" && act.scheduledDate < todayStr);
  }, [activities]);

  // Completed Activities count
  const completedActivitiesCount = useMemo(() => {
    return activities.filter(act => act.status === "completed").length;
  }, [activities]);

  // 2. Prepare chart data: Coverage by Subject
  const subjectChartData = useMemo(() => {
    const subjects = Array.from(new Set(topics.map(t => t.subject)));
    return subjects.map(sub => {
      const subTopics = topics.filter(t => t.subject === sub);
      const subTotal = subTopics.length;
      const subCompleted = subTopics.filter(t => t.status === "studied").length;
      const percent = subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0;
      return {
        subject: sub.length > 20 ? sub.substring(0, 18) + "..." : sub,
        "Cobertura %": percent,
        "Total": subTotal,
        "Concluídos": subCompleted
      };
    });
  }, [topics]);

  // 3. Prepare performance radar data
  const performanceChartData = useMemo(() => {
    const subjects = Array.from(new Set(topics.map(t => t.subject)));
    return subjects.map(sub => {
      const subTopics = topics.filter(t => t.subject === sub);
      const subTotalQs = subTopics.reduce((sum, t) => sum + (t.totalQuestionsSolved || 0), 0);
      const subCorrectQs = subTopics.reduce((sum, t) => sum + (t.correctQuestionsSolved || 0), 0);
      const hitRate = subTotalQs > 0 ? Math.round((subCorrectQs / subTotalQs) * 100) : 0;
      return {
        subject: sub.length > 20 ? sub.substring(0, 18) + "..." : sub,
        "Aproveitamento %": hitRate
      };
    });
  }, [topics]);
  // Colors for subjects matching PASSEI SEDUC logo
  const COLORS = ["#107C41", "#0B2240", "#F4B400", "#475569"];

  return (
    <div id="dashboard-container" className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-brand-green bg-brand-light-green border border-brand-green/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Plano Estratégico Pré-Edital
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-brand-navy tracking-tight font-display">
            Olá, Candidato(a)!
          </h2>
          <p className="text-xs text-slate-500 max-w-xl font-medium">
            Sua preparação inteligente está focada na <strong className="text-slate-800 font-bold">SEDUC-CE</strong> e na banca <strong className="text-slate-800 font-bold">{settings.examBoard}</strong>. Mantenha seu ritmo de estudos em dia.
          </p>
        </div>
        
        {/* Countdown Badge */}
        <div className="flex items-center gap-4 bg-brand-light-navy border border-brand-navy/5 px-5 py-3.5 rounded-2xl flex-shrink-0">
          <div className="p-3 bg-brand-navy rounded-xl text-white">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contagem Regressiva</p>
            <p className="text-base font-extrabold text-brand-navy font-display">
              {daysToExam} {daysToExam === 1 ? 'dia' : 'dias'} <span className="text-xs text-slate-400 font-semibold font-sans">para a prova</span>
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Strategic Coverage */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cobertura Estratégica</span>
            <div className="p-2 bg-brand-light-green text-brand-green rounded-lg">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-brand-navy font-display">{strategicCoveragePercent}%</p>
            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-green rounded-full" style={{ width: `${strategicCoveragePercent}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wide">
              {completedTopicsCount} de {totalTopicsCount} tópicos concluídos
            </p>
          </div>
        </div>

        {/* Stat 2: hit rate */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aproveitamento</span>
            <div className="p-2 bg-brand-light-navy text-brand-navy rounded-lg">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-brand-navy font-display">{hitRatePercent}%</p>
            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-navy rounded-full" style={{ width: `${hitRatePercent}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wide">
              {totalCorrectSolved} de {totalQuestionsSolved} acertos no simulador
            </p>
          </div>
        </div>

        {/* Stat 3: Study Hours / Streak */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ritmo de Estudos</span>
            <div className="p-2 bg-brand-light-amber text-brand-amber rounded-lg">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-brand-navy font-display">{completedActivitiesCount} <span className="text-xs text-slate-400 font-extrabold uppercase">Ciclos</span></p>
            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-amber rounded-full" style={{ width: `${Math.min(100, (completedActivitiesCount / 10) * 100)}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wide">
              Sessões concluídas com sucesso
            </p>
          </div>
        </div>

        {/* Stat 4: Mistakes or Overdue Tasks */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atrasos e Gargalos</span>
            <div className={`p-2 rounded-lg ${overdueActivities.length > 0 ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600"}`}>
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className={`text-2xl font-extrabold font-display ${overdueActivities.length > 0 ? "text-rose-600" : "text-brand-navy"}`}>
              {overdueActivities.length} <span className="text-xs text-slate-400 font-extrabold uppercase">Tarefas</span>
            </p>
            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${overdueActivities.length > 0 ? Math.min(100, (overdueActivities.length / 5) * 100) : 0}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wide">
              {overdueActivities.length > 0 ? "Assuntos pendentes de revisão" : "Nenhum atraso acumulado!"}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Content Coverage per Subject */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-brand-navy mb-0.5 font-display">Mapeamento de Cobertura</h3>
          <p className="text-[11px] text-slate-400 mb-4">Aproveitamento do edital previsto por área de conhecimento</p>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="subject" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ background: '#0B2240', borderRadius: '12px', border: 'none', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold', fontSize: 10 }}
                  itemStyle={{ fontSize: 10, color: '#F4B400' }}
                />
                <Bar dataKey="Cobertura %" radius={[6, 6, 0, 0]}>
                  {subjectChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Performance Radar */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-brand-navy mb-0.5 font-display">Análise de Rendimento</h3>
          <p className="text-[11px] text-slate-400 mb-4">Taxa de acertos (%) no simulador em cada área estratégica</p>
          
          <div className="h-64 flex items-center justify-center">
            {totalQuestionsSolved === 0 ? (
              <div className="text-center p-6 space-y-3">
                <p className="text-xs font-semibold text-slate-400">Sem dados de questões suficientes para traçar seu radar.</p>
                <button 
                  onClick={() => onNavigate("simulator")}
                  className="px-4 py-2 bg-brand-light-navy hover:bg-brand-navy/5 text-brand-navy transition-colors rounded-xl text-xs font-bold border border-brand-navy/10 cursor-pointer"
                >
                  Resolver Questões Agora
                </button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={performanceChartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#475569', fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                  <Radar name="Acertos %" dataKey="Aproveitamento %" stroke="#107C41" fill="#107C41" fillOpacity={0.12} />
                  <Tooltip contentStyle={{ background: '#0B2240', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Overdue Alert list & Strategic Advice panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Overdue Tasks or Upcoming study */}
        <div className="lg:col-span-7 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-brand-navy font-display">Próximos Passos Pedagógicos</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calendário</span>
            </div>
            
            {overdueActivities.length > 0 ? (
              <div className="space-y-3">
                <div className="p-3 bg-rose-50 border border-rose-100/50 text-rose-700 rounded-xl flex gap-2.5 items-start">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold block">Atenção ao Cronograma!</span>
                    <p className="text-[11px] leading-relaxed opacity-90">Você possui assuntos que deveriam ter sido estudados recentemente. Priorize colocar as matérias abaixo em dia antes de absorver novos conceitos.</p>
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  {overdueActivities.slice(0, 3).map((act) => (
                    <div key={act.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{act.subject}</span>
                        <p className="text-xs font-bold text-slate-700 line-clamp-1">{act.topicName}</p>
                        <p className="text-[10px] font-bold text-rose-500">Atrasado desde {act.scheduledDate}</p>
                      </div>
                      <button 
                        onClick={() => onNavigate("calendar")}
                        className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-600 transition-colors cursor-pointer"
                        title="Ir para o Calendário"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4 text-center">
                <div className="inline-flex p-3 bg-brand-light-green text-brand-green rounded-2xl">
                  <Award className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">Excelente! Cronograma em dia!</p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">Você não possui nenhuma atividade de estudo pendente ou atrasada no calendário. Parabéns pelo foco constante!</p>
                </div>
                <button 
                  onClick={() => onNavigate("calendar")}
                  className="px-4 py-2 bg-brand-navy hover:bg-brand-navy/90 text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                >
                  Planejar Novos Assuntos
                </button>
              </div>
            )}
          </div>

          {overdueActivities.length > 0 && (
            <button 
              onClick={() => onNavigate("calendar")}
              className="w-full text-center py-2.5 mt-4 hover:bg-brand-light-navy text-brand-navy text-[11px] font-bold border border-dashed border-brand-navy/10 rounded-xl transition-all cursor-pointer"
            >
              Ver Todas as Atividades no Calendário
            </button>
          )}
        </div>

        {/* Right Column: Strategic Quick Actions & Mistakes review - LIGHT PREMIUM SAAS THEME */}
        <div className="lg:col-span-5 bg-brand-light-navy/50 border border-brand-navy/10 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-[9px] font-bold text-brand-green uppercase tracking-widest block mb-1">Mapeamento FUNECE</span>
              <h3 className="text-sm font-bold text-brand-navy font-display">Conselho do Especialista</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                A banca <strong className="text-brand-navy font-bold">FUNECE / UECE</strong> é conhecida por exigir uma leitura apurada e literal da legislação educacional (especialmente alterações recentes da LDB) e o domínio absoluto de teorias didáticas.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3.5 bg-white border border-brand-navy/5 rounded-xl flex items-start gap-3">
                <BookMarked className="h-4.5 w-4.5 text-brand-green flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold block text-brand-navy">Caderno de Erros Ativo</span>
                  <p className="text-[11px] text-slate-500 leading-normal font-medium">
                    Você possui <strong className="text-brand-green font-bold">{mistakes.filter(m => !m.resolved).length}</strong> erros pendentes de revisão. O estudo reativo por meio de erros acelera em até 3x a sua aprovação.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate("mentor")}
            className="w-full mt-6 py-2.5 bg-brand-navy hover:bg-brand-navy/95 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Falar com Professor Mentor AI
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
