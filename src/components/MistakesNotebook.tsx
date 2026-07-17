import { useState, useMemo } from "react";
import { 
  AlertTriangle, 
  Check, 
  Trash2, 
  HelpCircle, 
  BookMarked, 
  CheckCircle2, 
  TrendingUp, 
  Info,
  RotateCcw
} from "lucide-react";
import { MistakeRecord, EDUCATION_SUBJECTS } from "../types";

interface MistakesNotebookProps {
  mistakes: MistakeRecord[];
  onResolveMistake: (id: string, resolved: boolean) => Promise<void>;
  onDeleteMistake: (id: string) => Promise<void>;
}

export default function MistakesNotebook({ mistakes, onResolveMistake, onDeleteMistake }: MistakesNotebookProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [showResolved, setShowResolved] = useState<boolean>(false);

  // Filter mistakes
  const filteredMistakes = useMemo(() => {
    return mistakes.filter(m => {
      const matchSubject = selectedSubject === "All" || m.subject === selectedSubject;
      const matchStatus = showResolved ? m.resolved : !m.resolved;
      return matchSubject && matchStatus;
    });
  }, [mistakes, selectedSubject, showResolved]);

  // Statistics: High error rate topics
  const errorStatsByTopic = useMemo(() => {
    const stats: { [key: string]: { name: string; count: number; subject: string } } = {};
    mistakes.forEach(m => {
      if (!m.resolved) {
        if (!stats[m.topicId]) {
          stats[m.topicId] = { name: m.topicName, count: 0, subject: m.subject };
        }
        stats[m.topicId].count += 1;
      }
    });
    return Object.values(stats).sort((a, b) => b.count - a.count);
  }, [mistakes]);

  return (
    <div id="mistakes-notebook-container" className="space-y-6 animate-fade-in">
      
      {/* Informative Header */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-brand-light-navy text-brand-navy rounded-xl border border-brand-navy/5">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-brand-navy font-display uppercase tracking-wider">Seu Caderno de Erros Ativo</h3>
            <p className="text-xs text-slate-400 leading-relaxed mt-1 font-medium">
              Erros são as maiores pistas do seu caminho rumo à aprovação. Quando você responde incorretamente uma questão no simulador, ela é enviada automaticamente para cá. Use este caderno para <strong className="text-slate-600 font-bold">revisar, entender o motivo do erro e sanar sua dúvida teórica</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Top Filter & Status Toggle Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Subjects list filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedSubject("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
              selectedSubject === "All" 
                ? "bg-brand-green text-white border-brand-green shadow-xs" 
                : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
            }`}
          >
            Todos ({mistakes.filter(m => showResolved ? m.resolved : !m.resolved).length})
          </button>
          {EDUCATION_SUBJECTS.map(sub => {
            const count = mistakes.filter(m => m.subject === sub && (showResolved ? m.resolved : !m.resolved)).length;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedSubject === sub 
                    ? "bg-brand-green text-white border-brand-green shadow-xs" 
                    : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
                }`}
              >
                {sub} ({count})
              </button>
            );
          })}
        </div>

        {/* Toggle between pending and resolved mistakes */}
        <button
          onClick={() => setShowResolved(!showResolved)}
          className={`px-4 py-2 text-xs font-bold border rounded-xl transition-all cursor-pointer ${
            showResolved 
              ? "bg-brand-light-green text-brand-green border-brand-green/20" 
              : "bg-brand-light-navy text-brand-navy border-brand-navy/10 hover:bg-brand-light-navy/70"
          }`}
        >
          {showResolved ? "Ver Erros Pendentes" : "Ver Erros Resolvidos"}
        </button>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Mistakes List */}
        <div className="lg:col-span-8 space-y-4">
          {filteredMistakes.length === 0 ? (
            <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm text-center space-y-3">
              <div className="inline-flex p-3.5 bg-brand-light-green text-brand-green border border-brand-green/10 rounded-full">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-brand-navy font-display">
                {showResolved ? "Você ainda não resolveu nenhum erro." : "Nenhum erro pendente! Excelente aproveitamento!"}
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto font-medium">
                Continue respondendo as provas simuladas para mapear seus pontos fracos de forma inteligente.
              </p>
            </div>
          ) : (
            filteredMistakes.map((record) => {
              const wrongLetter = String.fromCharCode(65 + record.selectedOptionIndex);
              const correctLetter = String.fromCharCode(65 + record.correctIndex);

              return (
                <div 
                  key={record.id} 
                  className={`bg-white border rounded-2xl p-5 shadow-sm space-y-4 transition-all ${
                    record.resolved ? "border-slate-100 opacity-75" : "border-rose-100/50 hover:border-rose-200/50"
                  }`}
                >
                  {/* Card Metadata Header */}
                  <div className="flex justify-between items-start gap-4 pb-3 border-b border-slate-50">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">{record.subject}</span>
                      <p className="text-[11px] font-bold text-slate-500 line-clamp-1">Tópico: {record.topicName}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          await onResolveMistake(record.id, !record.resolved);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                          record.resolved 
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200" 
                            : "bg-brand-light-green hover:bg-brand-light-green/90 text-brand-green border-brand-green/10"
                        }`}
                        title={record.resolved ? "Reabrir erro" : "Marcar como resolvido"}
                      >
                        {record.resolved ? (
                          <>
                            <RotateCcw className="h-3 w-3" /> Reabrir
                          </>
                        ) : (
                          <>
                            <Check className="h-3.5 w-3.5" /> Resolver
                          </>
                        )}
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm("Remover permanentemente este registro de erro?")) {
                            await onDeleteMistake(record.id);
                          }
                        }}
                        className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remover Registro"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question text */}
                  <div className="space-y-2 text-xs font-semibold">
                    <p className="text-slate-800 leading-relaxed font-bold">{record.questionText}</p>
                  </div>

                  {/* Selected / Correct visual comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                    <div className="p-3 bg-rose-50/40 border border-rose-100/50 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider block">Sua Resposta</span>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        <strong className="text-rose-600">Opção {wrongLetter}:</strong> {record.options[record.selectedOptionIndex]}
                      </p>
                    </div>

                    <div className="p-3 bg-brand-light-green/40 border border-brand-green/10 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold text-brand-green uppercase tracking-wider block">Gabarito Oficial</span>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        <strong className="text-brand-green">Opção {correctLetter}:</strong> {record.options[record.correctIndex]}
                      </p>
                    </div>
                  </div>

                  {/* Explanation commentary */}
                  <div className="p-3.5 bg-brand-light-navy/30 border border-brand-navy/5 rounded-xl space-y-1 text-xs">
                    <span className="text-[9px] font-bold text-brand-navy uppercase tracking-wider block">Análise Pedagógica</span>
                    <p className="text-slate-500 leading-relaxed font-semibold">{record.explanation}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Error stats and priority review list */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Priority Topics List */}
          <div className="bg-brand-light-navy/70 border border-brand-navy/10 p-5 rounded-2xl shadow-sm space-y-4">
            <div>
              <span className="text-[9px] font-bold text-brand-green uppercase tracking-widest block mb-1">Gargalos de Aprendizagem</span>
              <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider font-display">Tópicos Críticos</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                Tópicos com maior incidência de erros não resolvidos. Dedique revisões ativas imediatas a estes temas.
              </p>
            </div>

            {errorStatsByTopic.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold py-2">Nenhum assunto crítico pendente.</p>
            ) : (
              <div className="space-y-3.5 mt-4">
                {errorStatsByTopic.slice(0, 4).map((stat, i) => (
                  <div key={i} className="p-3 bg-white border border-brand-navy/5 rounded-xl flex justify-between items-center gap-3">
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-brand-green block truncate uppercase">{stat.subject}</span>
                      <p className="text-xs font-bold text-brand-navy truncate">{stat.name}</p>
                    </div>
                    <div className="px-2.5 py-1 bg-rose-50 border border-rose-100 text-rose-600 font-extrabold text-[10px] rounded-lg flex-shrink-0">
                      {stat.count} {stat.count === 1 ? 'erro' : 'erros'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Study Tip for errors */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-brand-amber">
              <TrendingUp className="h-4 w-4" />
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-navy font-display">Dica de Fixação</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Não tente apenas memorizar a opção correta. Releia o artigo da LDB ou o trecho do livro de Didática citado na justificativa. Faça anotações e re-avalie o erro marcando como <strong className="text-slate-600 font-bold">✓ Resolvido</strong> para limpar suas lacunas!
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
