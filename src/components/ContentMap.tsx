import { useState, useMemo } from "react";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  TrendingUp, 
  CheckCircle, 
  Circle, 
  BookMarked,
  Info,
  CalendarDays,
  ChevronDown
} from "lucide-react";
import { ContentTopic } from "../types";

interface ContentMapProps {
  topics: ContentTopic[];
  specialty?: string;
  onAddTopic: (topic: Omit<ContentTopic, "id" | "createdAt">) => Promise<void>;
  onUpdateTopic: (id: string, updates: Partial<ContentTopic>) => Promise<void>;
  onDeleteTopic: (id: string) => Promise<void>;
}

const SYLLABUS_SUBJECTS = [
  "Educação Brasileira",
  "Administração Pública",
  "Língua Portuguesa",
  "Leitura e Interpretação de Dados e Indicadores",
  "Conhecimentos Específicos"
];

export default function ContentMap({ topics, specialty = "Biologia", onAddTopic, onUpdateTopic, onDeleteTopic }: ContentMapProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  
  // States for expandable accordion sections
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({});

  const toggleSubject = (subjectName: string) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectName]: !prev[subjectName]
    }));
  };

  const toggleBlock = (blockKey: string) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [blockKey]: !prev[blockKey]
    }));
  };
  
  // New topic form fields
  const [newSubject, setNewSubject] = useState<string>("Língua Portuguesa");
  const [newAxis, setNewAxis] = useState("");
  const [newName, setNewName] = useState("");
  const [newRelevance, setNewRelevance] = useState<'crucial' | 'high' | 'medium' | 'low'>("medium");
  const [newImportanceScore, setNewImportanceScore] = useState<number>(75);

  const filteredTopics = useMemo(() => {
    if (selectedSubject === "All") return topics;
    return topics.filter(t => t.subject === selectedSubject);
  }, [topics, selectedSubject]);

  // Group topics by Block (axis) within each Subject
  const blockGroupedTopics = useMemo(() => {
    // Structure: { [subjectName]: { [blockName]: ContentTopic[] } }
    const groups: { [subject: string]: { [block: string]: ContentTopic[] } } = {};
    
    filteredTopics.forEach(t => {
      const sub = t.subject;
      const block = t.axis || "📚 OUTROS TÓPICOS";
      
      if (!groups[sub]) {
        groups[sub] = {};
      }
      if (!groups[sub][block]) {
        groups[sub][block] = [];
      }
      groups[sub][block].push(t);
    });
    
    // Sort blocks structurally so they appear in sequence (BLOCO 1, BLOCO 2, BLOCO 3, etc.)
    const sortedGroups: { [subject: string]: { [block: string]: ContentTopic[] } } = {};
    Object.keys(groups).forEach(sub => {
      sortedGroups[sub] = {};
      const sortedBlockNames = Object.keys(groups[sub]).sort((a, b) => {
        const numA = parseInt(a.match(/BLOCO\s+(\d+)/)?.[1] || "99");
        const numB = parseInt(b.match(/BLOCO\s+(\d+)/)?.[1] || "99");
        return numA - numB;
      });
      sortedBlockNames.forEach(block => {
        sortedGroups[sub][block] = groups[sub][block];
      });
    });

    return sortedGroups;
  }, [filteredTopics]);

  const handleCreateTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAxis.trim()) {
      alert("Por favor, preencha o nome do tópico e o bloco.");
      return;
    }
    
    await onAddTopic({
      subject: newSubject,
      axis: newAxis,
      name: newName,
      relevance: newRelevance,
      importanceScore: Number(newImportanceScore),
      status: "not_started",
      totalQuestionsSolved: 0,
      correctQuestionsSolved: 0
    });

    // Reset form
    setNewAxis("");
    setNewName("");
    setNewRelevance("medium");
    setNewImportanceScore(75);
    setIsAddingTopic(false);
  };

  const getRelevanceBadgeClass = (relevance: string) => {
    switch (relevance) {
      case "crucial":
        return "bg-rose-50 text-rose-700 border-rose-100/60";
      case "high":
        return "bg-amber-50 text-amber-700 border-amber-100/60";
      case "medium":
        return "bg-blue-50 text-blue-700 border-blue-100/60";
      default:
        return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "studied":
        return "border-brand-green bg-brand-green text-white";
      case "studying":
        return "border-brand-navy bg-brand-light-navy text-brand-navy";
      case "needs_review":
        return "border-amber-500 bg-amber-500 text-white animate-pulse";
      default:
        return "border-slate-300 text-slate-400 hover:border-brand-green hover:bg-slate-50";
    }
  };

  return (
    <div id="content-map-container" className="space-y-6">
      
      {/* Strategic Info Banner */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-brand-light-navy text-brand-navy rounded-xl border border-brand-navy/5">
            <Info className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-brand-navy font-display uppercase tracking-wider">Edital Esquematizado 100% Completo</h3>
            <p className="text-xs text-slate-400 leading-relaxed mt-1 font-medium">
              Abaixo está o mapeamento completo do conteúdo programático do edital <strong className="text-slate-600 font-bold">SEDUC-CE (Banca FUNECE/UECE)</strong>, perfeitamente estruturado em <strong className="text-slate-600 font-bold">Blocos Didáticos</strong> e <strong className="text-slate-600 font-bold">Micro-tópicos</strong>. Acompanhe sua cobertura de forma limpa, objetiva e inteligente.
            </p>
          </div>
        </div>
      </div>

      {/* Top Controls & Filters */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        {/* Horizontal scrollable subjects bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedSubject("All")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedSubject === "All" 
                ? "bg-brand-green text-white border-brand-green shadow-xs" 
                : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
            }`}
          >
            Todos os Tópicos ({topics.length})
          </button>
          {SYLLABUS_SUBJECTS.map(sub => {
            const count = topics.filter(t => t.subject === sub).length;
            const displayName = sub === "Conhecimentos Específicos" ? `Específica: ${specialty}` : sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedSubject === sub 
                    ? "bg-brand-green text-white border-brand-green shadow-xs" 
                    : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
                }`}
              >
                {displayName} ({count})
              </button>
            );
          })}
        </div>

        {/* Add Customized Topic */}
        <button
          onClick={() => setIsAddingTopic(true)}
          className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-brand-navy hover:bg-brand-navy/95 text-white font-bold rounded-xl text-xs shadow-sm hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> Personalizar Conteúdo
        </button>
      </div>

      {/* Add Topic Overlay Modal */}
      {isAddingTopic && (
        <div className="fixed inset-0 bg-brand-navy/30 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-brand-navy font-display">Adicionar Tópico Personalizado</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Customizar seu mapeamento de estudos</p>
              </div>
              <button 
                onClick={() => setIsAddingTopic(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
            </div>

            <form onSubmit={handleCreateTopicSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Matéria / Assunto</label>
                  <select
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  >
                    {SYLLABUS_SUBJECTS.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Bloco Didático (Eixo)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: BLOCO 1 — FUNDAMENTOS"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newAxis}
                    onChange={(e) => setNewAxis(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Nome do Micro-tópico</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Estudo da crase nas orações adjetivas"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Cobrança na Banca</label>
                  <select
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newRelevance}
                    onChange={(e) => setNewRelevance(e.target.value as any)}
                  >
                    <option value="crucial">Crucial (Presença Garantida)</option>
                    <option value="high">Alta Frequência</option>
                    <option value="medium">Média Frequência</option>
                    <option value="low">Baixa Cobrança</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Score de Relevância (1-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newImportanceScore}
                    onChange={(e) => setNewImportanceScore(Number(e.target.value))}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-green hover:bg-brand-green/95 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Gravar Tópico
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Structured Edital Display */}
      <div className="space-y-8">
        {Object.keys(blockGroupedTopics).length === 0 ? (
          <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm text-center">
            <p className="text-xs font-bold text-slate-400">Nenhum conteúdo estratégico corresponde aos filtros.</p>
          </div>
        ) : (
          Object.entries(blockGroupedTopics).map(([subjectName, blocksMap]) => {
            const allSubTopics = Object.values(blocksMap).flat();
            const completedCount = allSubTopics.filter(t => t.status === "studied").length;
            const progressPercent = allSubTopics.length > 0 ? Math.round((completedCount / allSubTopics.length) * 100) : 0;
            const subjectHeaderName = subjectName === "Conhecimentos Específicos" ? `Conhecimentos Específicos — ${specialty}` : subjectName;

            const isSubjectExpanded = expandedSubjects[subjectName] ?? false;

            return (
              <div key={subjectName} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
                
                {/* Subject Block Header */}
                <div 
                  onClick={() => toggleSubject(subjectName)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-light-navy text-brand-navy rounded-xl border border-brand-navy/5 group-hover:scale-105 transition-transform">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-brand-navy font-display group-hover:text-brand-green transition-colors flex items-center gap-2">
                        {subjectHeaderName}
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isSubjectExpanded ? "rotate-180 text-brand-green" : ""}`} />
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        Syllabus de Estudos • Clique para {isSubjectExpanded ? "recolher" : "expandir"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Badge */}
                  <div className="flex items-center gap-3 bg-brand-light-green border border-brand-green/10 px-3 py-1.5 rounded-xl self-start sm:self-auto" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[9px] font-bold text-brand-green uppercase tracking-widest">Estudado</span>
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-green rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <span className="text-xs font-extrabold text-brand-green">{progressPercent}%</span>
                  </div>
                </div>

                {/* Blocks separation */}
                {isSubjectExpanded && (
                  <div className="space-y-6 animate-fade-in">
                    {Object.entries(blocksMap).map(([blockName, blockTopics]) => {
                      const blockCompletedCount = blockTopics.filter(t => t.status === "studied").length;
                      const blockProgressPercent = blockTopics.length > 0 ? Math.round((blockCompletedCount / blockTopics.length) * 100) : 0;
                      const blockKey = `${subjectName}-${blockName}`;
                      const isBlockExpanded = expandedBlocks[blockKey] ?? false;

                      return (
                        <div key={blockName} className="border border-slate-100 rounded-xl overflow-hidden shadow-2xs">
                          
                          {/* Sub-Header block name banner */}
                          <div 
                            onClick={() => toggleBlock(blockKey)}
                            className="bg-slate-50/60 border-b border-slate-100 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none hover:bg-slate-100/80 transition-all group"
                          >
                            <h4 className="text-xs font-extrabold text-brand-navy font-display uppercase tracking-wider flex items-center gap-2 group-hover:text-brand-green transition-colors">
                              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 ${isBlockExpanded ? "rotate-180 text-brand-green" : ""}`} />
                              {blockName}
                            </h4>
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider hidden sm:inline mr-2">
                                Clique para {isBlockExpanded ? "fechar" : "abrir"}
                              </span>
                              <span className="text-[10px] text-slate-500 font-bold bg-white border border-slate-100 px-2 py-0.5 rounded-md">
                                {blockCompletedCount}/{blockTopics.length} concluídos ({blockProgressPercent}%)
                              </span>
                            </div>
                          </div>

                          {/* Micro-topics container */}
                          {isBlockExpanded && (
                            <div className="divide-y divide-slate-100 px-4 bg-white animate-fade-in">
                              {blockTopics.map((topic) => {
                                const hitRate = topic.totalQuestionsSolved > 0 
                                  ? Math.round((topic.correctQuestionsSolved / topic.totalQuestionsSolved) * 100) 
                                  : null;

                                return (
                                  <div key={topic.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    
                                    {/* Status + Topic Info */}
                                    <div className="flex items-start gap-3 md:max-w-2xl">
                                      <button
                                        onClick={async () => {
                                          // Toggle status cyclical or binary
                                          let newStatus: 'not_started' | 'studying' | 'studied' | 'needs_review' = "not_started";
                                          if (topic.status === "not_started") newStatus = "studying";
                                          else if (topic.status === "studying") newStatus = "studied";
                                          else if (topic.status === "studied") newStatus = "needs_review";
                                          else newStatus = "not_started";

                                          await onUpdateTopic(topic.id, { 
                                            status: newStatus,
                                            lastStudiedAt: newStatus === "studied" ? new Date().toISOString().split('T')[0] : topic.lastStudiedAt
                                          });
                                        }}
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all flex-shrink-0 mt-0.5 ${getStatusClass(topic.status)}`}
                                        title="Clique para alternar o status (Não Iniciado -> Estudando -> Concluído -> Revisar)"
                                      >
                                        {topic.status === "studied" ? (
                                          <CheckCircle className="h-3 w-3" />
                                        ) : topic.status === "studying" ? (
                                          <span className="w-1.5 h-1.5 bg-brand-navy rounded-full"></span>
                                        ) : topic.status === "needs_review" ? (
                                          <span className="text-[9px] font-bold leading-none">!</span>
                                        ) : (
                                          <Circle className="h-3 w-3 text-transparent hover:text-slate-300" />
                                        )}
                                      </button>

                                      <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                          <span className={`text-[9px] font-bold px-1.5 py-0.5 border rounded uppercase tracking-wider ${getRelevanceBadgeClass(topic.relevance)}`}>
                                            {topic.relevance === "crucial" ? "Presença Crucial" : topic.relevance === "high" ? "Alta Relevância" : topic.relevance === "medium" ? "Média Relevância" : "Foco Secundário"} ({topic.importanceScore}%)
                                          </span>
                                          
                                          {/* Status Label badge */}
                                          <span className={`text-[9px] font-bold px-1.5 py-0.5 border rounded uppercase tracking-wider ${
                                            topic.status === "studied" 
                                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                              : topic.status === "studying" 
                                                ? "bg-brand-light-navy text-brand-navy border-brand-navy/10" 
                                                : topic.status === "needs_review" 
                                                  ? "bg-amber-50 text-amber-700 border-amber-100" 
                                                  : "bg-slate-50 text-slate-400 border-slate-100"
                                          }`}>
                                            {topic.status === "studied" ? "Estudado" : topic.status === "studying" ? "Estudando" : topic.status === "needs_review" ? "Revisar" : "Não Iniciado"}
                                          </span>
                                        </div>
                                        
                                        <p className="text-xs font-bold text-slate-700 leading-snug">{topic.name}</p>
                                        
                                        {topic.lastStudiedAt && (
                                          <p className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                                            <CalendarDays className="h-3 w-3 text-slate-300" />
                                            Interagido em: {new Date(topic.lastStudiedAt + "T12:00:00").toLocaleDateString('pt-BR')}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Actions / Stats */}
                                    <div className="flex items-center justify-end gap-3 self-end md:self-auto">
                                      {/* Performance rate badge if has solved simulated questions */}
                                      {hitRate !== null && (
                                        <div className="text-right flex items-center gap-1.5 bg-brand-light-navy border border-brand-navy/5 px-2.5 py-1 rounded-xl">
                                          <TrendingUp className="h-3.5 w-3.5 text-brand-navy" />
                                          <div className="text-left">
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Simulado</span>
                                            <span className="text-[9px] font-extrabold text-brand-navy leading-none">{hitRate}% acertos</span>
                                          </div>
                                        </div>
                                      )}

                                      {/* Add Study Notes */}
                                      <button
                                        onClick={() => {
                                          const noteInput = prompt("Anotações de estudos para este tópico:", topic.notes || "");
                                          if (noteInput !== null) {
                                            onUpdateTopic(topic.id, { notes: noteInput });
                                          }
                                        }}
                                        className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                                          topic.notes 
                                            ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" 
                                            : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50"
                                        }`}
                                        title={topic.notes ? `Nota: ${topic.notes}` : "Adicionar anotação de estudos"}
                                      >
                                        <BookMarked className="h-3.5 w-3.5" />
                                        {topic.notes && <span className="text-[10px] text-amber-700 font-bold">Anotação</span>}
                                      </button>

                                      {/* Delete custom topic if starting with custom- */}
                                      {topic.id.startsWith("topic-custom-") && (
                                        <button
                                          onClick={async () => {
                                            if (confirm("Remover este tópico personalizado do seu edital?")) {
                                              await onDeleteTopic(topic.id);
                                            }
                                          }}
                                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 border border-rose-100/40 transition-colors cursor-pointer"
                                          title="Remover Tópico"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      )}
                                    </div>

                                  </div>
                                );
                              })}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
