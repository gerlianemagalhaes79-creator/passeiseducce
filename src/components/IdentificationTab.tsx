import { useState, useEffect } from "react";
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Calendar, 
  Check, 
  ArrowRight,
  Sparkles,
  School
} from "lucide-react";
import { CandidateSettings, EDUCATION_SPECIALTIES } from "../types";

interface IdentificationTabProps {
  settings: CandidateSettings;
  onUpdateSettings: (updates: Partial<CandidateSettings>) => Promise<void>;
  onRebuildSchedule: (startDate: string) => Promise<void>;
  onNavigate: (tab: string) => void;
}

export default function IdentificationTab({
  settings,
  onUpdateSettings,
  onRebuildSchedule,
  onNavigate
}: IdentificationTabProps) {
  const [candidateName, setCandidateName] = useState(settings.candidateName || "");
  const [isAlreadyTeacher, setIsAlreadyTeacher] = useState<boolean>(settings.isAlreadyTeacher ?? false);
  const [specialty, setSpecialty] = useState(settings.specialty || "Biologia");
  const [dailyStudyHours, setDailyStudyHours] = useState<number>(settings.dailyStudyHours || 4);
  const [examDate, setExamDate] = useState(settings.examDate || "2026-09-26");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      if (settings.candidateName) setCandidateName(settings.candidateName);
      if (settings.isAlreadyTeacher !== undefined) setIsAlreadyTeacher(settings.isAlreadyTeacher);
      if (settings.specialty) setSpecialty(settings.specialty);
      if (settings.dailyStudyHours) setDailyStudyHours(settings.dailyStudyHours);
      if (settings.examDate) setExamDate(settings.examDate);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) {
      alert("Por favor, preencha o seu nome completo para prosseguir.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveSuccess(false);

      // 1. Update Candidate Settings in Firestore
      await onUpdateSettings({
        candidateName: candidateName.trim(),
        isAlreadyTeacher,
        specialty,
        dailyStudyHours,
        examDate
      });

      // 2. Automatically rebuild the strategic calendar to match the new specialty
      const todayStr = new Date().toISOString().split('T')[0];
      await onRebuildSchedule(todayStr);

      setSaveSuccess(true);
      setIsSaving(false);
      
      // Short delay for user satisfaction before auto navigating to calendar
      setTimeout(() => {
        onNavigate("calendar");
      }, 1500);

    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro ao salvar as configurações. Verifique a conexão com a nuvem.");
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden max-w-2xl mx-auto">
      {/* Premium Header */}
      <div className="bg-brand-navy p-6 text-white relative">
        <div className="absolute right-6 top-6 opacity-10">
          <GraduationCap className="h-24 w-24" />
        </div>
        <span className="text-[10px] font-extrabold text-brand-amber uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-full">
          Onboarding & Configuração
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-3 font-display">
          Sua Ficha de Identificação & Foco
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-md">
          Personalize o aplicativo com seu nome e especialidade para receber o cronograma de estudos oficial adaptado e altamente estratégico.
        </p>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        
        {/* Name input */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Nome do Estudante / Candidato(a)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="h-4.5 w-4.5" />
            </div>
            <input
              type="text"
              required
              placeholder="Digite seu nome completo..."
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
            />
          </div>
        </div>

        {/* Teacher status input (radio boxes) */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Você já é professor(a) na rede pública ou privada?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsAlreadyTeacher(true)}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isAlreadyTeacher 
                  ? "bg-brand-light-green/30 border-brand-green text-brand-navy" 
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600"
              }`}
            >
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${isAlreadyTeacher ? "border-brand-green bg-brand-green text-white" : "border-slate-300 bg-white"}`}>
                {isAlreadyTeacher && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
              <div>
                <span className="text-xs font-bold block">Sim, já leciono</span>
                <span className="text-[10px] text-slate-400">Já atuo em sala de aula de ensino básico</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsAlreadyTeacher(false)}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                !isAlreadyTeacher 
                  ? "bg-brand-light-navy/50 border-brand-navy/30 text-brand-navy" 
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600"
              }`}
            >
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${!isAlreadyTeacher ? "border-brand-navy bg-brand-navy text-white" : "border-slate-300 bg-white"}`}>
                {!isAlreadyTeacher && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
              <div>
                <span className="text-xs font-bold block">Não, estou iniciando</span>
                <span className="text-[10px] text-slate-400">Estou estudando para meu primeiro cargo</span>
              </div>
            </button>
          </div>
        </div>

        {/* Specialty input */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Sua Especialidade de Ensino
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <School className="h-4.5 w-4.5" />
            </div>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-10 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all appearance-none cursor-pointer"
            >
              {EDUCATION_SPECIALTIES.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
              <ArrowRight className="h-4 w-4 rotate-90" />
            </div>
          </div>
        </div>

        {/* Daily Study Hours & Exam Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Meta Diária de Estudos
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <select
                value={dailyStudyHours}
                onChange={(e) => setDailyStudyHours(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all appearance-none cursor-pointer"
              >
                <option value={2}>2 Horas Diárias (Ideal)</option>
                <option value={3}>3 Horas Diárias</option>
                <option value={4}>4 Horas Diárias</option>
                <option value={5}>5 Horas Diárias</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Data Prevista do Concurso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="h-4.5 w-4.5" />
              </div>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
              />
            </div>
          </div>
        </div>

        {/* Strategic info panel */}
        <div className="p-4 bg-brand-light-navy/50 border border-brand-navy/5 rounded-xl space-y-2">
          <div className="flex gap-2 items-center text-brand-navy">
            <Sparkles className="h-4 w-4 text-brand-green" />
            <span className="text-xs font-bold">Geração Automática Ativa</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Ao salvar, seu calendário será completamente substituído por uma trilha estratégica de 10 semanas (74 dias) baseada no peso das matérias (conforme a UECE/FUNECE). O conteúdo programático da sua especialidade (<span className="text-brand-green font-bold">{specialty}</span>) será injetado perfeitamente em slots específicos do cronograma diário!
          </p>
        </div>

        {/* Feedback / Save button */}
        <div className="pt-2">
          {saveSuccess ? (
            <div className="p-3 bg-brand-light-green/30 border border-brand-green/20 rounded-xl text-center text-xs font-bold text-brand-green animate-pulse">
              ✓ Dados salvos com sucesso! Redirecionando para o seu cronograma personalizado de {specialty}...
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 px-5 bg-brand-green hover:bg-brand-green/95 disabled:bg-slate-300 text-white font-extrabold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSaving ? "Construindo Seu Planejamento Inteligente..." : "Salvar Perfil e Gerar Cronograma Estratégico!"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
