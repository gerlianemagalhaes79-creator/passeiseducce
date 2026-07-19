import { StudyActivity, CandidateSettings, ContentTopic } from "../types";
import { CONTENT_HIERARCHY } from "../components/questionsBank";

// High-fidelity microcontents from SEDUC-CE syllabus mapped as actionable daily contents
export const SEDUC_CE_MICRO_SYLLABUS: Record<string, string[]> = {
  "Língua Portuguesa": [
    "Diferença entre compreensão (o que está escrito) e interpretação (conclusões fora do texto)",
    "Gêneros textuais contemporâneos e suas esferas de circulação social",
    "Coesão textual (mecanismos de referência e substituição) e Coerência semântica",
    "Acentuação de ditongos abertos (éi, ói, éu) e hiatos (i, u)",
    "Grafia de palavras homônimas, parônimas e expressões problemáticas (porquês, mal/mau, onde/aonde)",
    "Classes gramaticais: substantivo, adjetivo, pronome, artigo, numeral, verbo, advérbio, conjunção, preposição e interjeição",
    "Concordância Verbal com verbos impessoais (Haver e Fazer)",
    "Concordância Nominal: adjetivos modificando múltiplos substantivos, expressões como 'é proibido', 'anexo', 'meio', 'bastante'",
    "Substituição pronominal e o valor semântico dos conectivos",
    "Termos integrantes e essenciais da oração: sujeito, predicado, objeto direto, objeto indireto",
    "Termos acessórios da oração: adjunto adnominal, adjunto adverbial, aposto, vocativo",
    "Período Composto por Coordenação (orações assindéticas e sindéticas)",
    "Período Composto por Subordinação (orações substantivas, adjetivas e adverbiais)",
    "Regras de uso da vírgula: enumerações, adjuntos adverbiais deslocados, orações explicativas e vocativos",
    "Regência Verbal: verbos de regência problemática (assistir, aspirar, visar, querer, preferir)",
    "Regência Nominal: nomes que exigem preposições específicas",
    "O fenômeno da Crase: regras gerais de ocorrência (fusão da preposição A com o artigo feminino A)",
    "Casos obrigatórios, proibidos e facultativos de uso da crase",
    "Significação das palavras: sinônimos, antônimos, homônimos, parônimos e figuras de linguagem"
  ],
  "Didática": [
    "A pedagogia jesuítica e o Ratio Studiorum",
    "Tendências Pedagógicas Progressistas (Libertadora, Libertária, Crítico-Social dos Conteúdos)",
    "Princípios norteadores: igualdade, qualidade, gestão democrática, valorização do magistério e liberdade",
    "A articulação entre escola, família e comunidade local",
    "Os elementos do planejamento: objetivos, conteúdos, metodologias, recursos e avaliação",
    "A sala de aula como ambiente sociorrelacional e de mediação cultural",
    "Indisciplina escolar: causas, reflexões pedagógicas e formas de mediação de conflitos",
    "Comportamentalismo/Behaviorismo (Watson, Skinner): estímulo-resposta, reforço positivo e modelagem",
    "As bases empíricas, metodológicas e epistemológicas que diferenciam cada teoria",
    "Teoria Psicogenética de Henri Wallon: afetividade, inteligência, motricidade e pessoa",
    "Crítica ao conceito unilateral de Q.I. (Quociente de Inteligência)",
    "Implicações para o planejamento escolar: valorização das múltiplas potencialidades",
    "Aspectos Biológicos: maturação neurológica, alterações hormonais e desenvolvimento motor",
    "O papel protetivo do ambiente escolar no desenvolvimento saudável do jovem",
    "Acolhimento da diversidade de identidades de gênero e escolhas sexuais na escola",
    "Teorias Tradicionais do Currículo: eficiência, técnica, objetivos comportamentais, memorização",
    "Políticas de Acesso e Democratização da escola pública",
    "Avaliação da aprendizagem: características diagnóstica, formativa e somativa",
    "Avaliação Institucional participativa: autoavaliação e avaliação externa da escola",
    "A formação docente inicial e continuada no cenário contemporâneo",
    "Saberes docentes: saberes da experiência, profissionais, disciplinares e curriculares (Tardif)",
    "Profissionalização, valorização da carreira e saúde mental dos professores",
    "Políticas públicas de inclusão, diversidade, correção de fluxo e erradicação do analfabetismo",
    "Diretrizes Curriculares Nacionais para o Ensino Médio (DCNEM)",
    "A contextualização como estratégia para conectar o conteúdo à realidade vivida",
    "Avaliação formativa aplicada às competências do Ensino Médio",
    "Educação Inclusiva no Ensino Médio: adaptações de acessibilidade e Atendimento Especializado",
    "Protagonismo Juvenil e o Projeto de Vida como indutores da escolha consciente"
  ],
  "Indicadores": [
    "Análise de dados quantitativos de matrícula e taxas de cobertura",
    "Taxa de Escolarização Bruta versus Taxa de Escolarização Líquida",
    "A taxa de atendimento escolar nas diferentes regiões do Estado do Ceará",
    "Uso de indicadores sociais e demográficos aplicados à gestão das escolas",
    "Resolução de problemas que envolvem taxas de crescimento de matrículas",
    "Cálculo e interpretação da distorção idade-série (atraso escolar igual ou superior a 2 anos)",
    "Taxas de Rendimento Escolar: aprovação, reprovação e abandono temporário",
    "Impacto do rendimento no fluxo escolar global e na distorção idade-série",
    "Diferença teórica e metodológica entre 'abandono' e 'evasão escolar'",
    "Fatores associados ao fracasso e sucesso na transição entre etapas da educação",
    "SPAECE (Sistema Permanente de Avaliação da Educação Básica do Ceará) e escala de proficiência",
    "SAEB (Sistema de Avaliação da Educação Básica) e avaliação nacional",
    "ENEM (Exame Nacional do Ensino Médio): finalidades e leitura de matrizes de proficiência",
    "IDEB (Índice de Desenvolvimento da Educação Básica): fórmula de cálculo (fluxo x proficiência)",
    "PISA: avaliação comparada internacional de leitura, matemática e ciências",
    "Leitura crítica de dados tabulados e análise de cabeçalhos e fontes de dados",
    "Tipos de gráficos: colunas, barras, setores (pizza), linhas e gráficos de radar",
    "Resolução de problemas matemáticos envolvendo cálculos de porcentagem aplicados a indicadores",
    "Interpretação de infográficos, mapas temáticos educacionais e cartogramas",
    "Taxa de variação e cálculo de aumento ou desconto percentual de dados educacionais"
  ],
  "Legislação": [
    "BLOCO 1 - Conceito de Administração Pública, Servidor Público e Princípios do LIMPE",
    "BLOCO 1 - Direitos, deveres e as responsabilidades civil, penal e administrativa dos servidores públicos",
    "BLOCO 2 - Estatuto dos Funcionários Civis do Ceará (Lei nº 9.826/1974): Provimento de cargos (Cap. I ao IX)",
    "BLOCO 2 - Estatuto dos Funcionários Civis do Ceará (Lei nº 9.826/1974): Direitos, vantagens e autorizações (Cap. I ao VI)",
    "BLOCO 2 - Estatuto dos Funcionários Civis do Ceará (Lei nº 9.826/1974): Regime disciplinar (Título VI, Cap. I ao VII)",
    "BLOCO 2 - Lei nº 15.243/2012 (Disciplina o art. 3º da Lei nº 15.064/2011)",
    "BLOCO 2 - Estágio Probatório do Servidor Estadual (Leis nº 9.826/1974, nº 13.092/2001, nº 15.744/2014, nº 15.909/2015)",
    "BLOCO 3 - Carreira do Magistério do Ceará (Concurso, Provimento, Carga horária e Jornada): Leis nº 10.884/1984, nº 12.066/1993, nº 14.404/2009",
    "BLOCO 3 - Ampliação da carga horária de trabalho do Grupo MAG (Lei nº 15.451/2013 e Decreto nº 31.458/2014)",
    "BLOCO 3 - Promoção dos profissionais do Grupo MAG (Lei nº 15.901/2015 e Decreto nº 32.103/2016)",
    "BLOCO 3 - Sistema remuneratório dos profissionais MAG de nível superior (Leis nº 15.243/2012, nº 15.901/2015, nº 16.104/2016, nº 16.513/2018, nº 16.536/2018)",
    "BLOCO 4 - Lei de Diretrizes e Bases da Educação Nacional — LDB (Lei nº 9.394/1996 e alterações)",
    "BLOCO 4 - Estatuto da Criança e do Adolescente — ECA (Lei nº 8.069/1990 e alterações): Direito à Educação",
    "BLOCO 4 - Constituição Federal — Educação (Artigos 205 a 214)",
    "BLOCO 4 - Emenda Constitucional nº 53/2006 e Funcionamento/Funcionamento do FUNDEB (Lei nº 11.494/2007 e alterações)",
    "BLOCO 4 - Lei nº 11.114/2005 e Lei nº 11.274/2006 (Ensino fundamental obrigatório de 9 anos de duração)",
    "BLOCO 4 - Lei nº 13.415/2017 (Reforma do Ensino Médio)",
    "BLOCO 4 - Plano Nacional de Educação — PNE (Lei Federal nº 13.005/2014) e Plano Estadual de Educação do Ceará — PEE (Lei Estadual nº 16.025/2016)"
  ],
  "Biologia": [
    "Aspectos físicos, químicos e estruturais da célula",
    "Organelas",
    "Organização celular: seres procariontes, eucariontes e sem organização celular",
    "Funções celulares: síntese, transporte, eliminação de substâncias e processos de obtenção de energia (fermentação, fotossíntese e respiração celular)",
    "Ciclo celular",
    "Princípios de microscopia e sua utilização prática e didática",
    "Hipóteses sobre a origem da vida",
    "Teoria de Lamarck e teoria de Darwin",
    "Origem do homem",
    "Principais características dos representantes de cada domínio e de cada reino da natureza",
    "Regras de nomenclatura",
    "Biodiversidade no planeta e no Brasil",
    "Fisiologia dos sistemas biológicos (digestório)",
    "Respiratório",
    "Cardiovascular",
    "Urinário",
    "Nervoso",
    "Endócrino",
    "Imunológico",
    "Reprodutor e locomotor",
    "Fundamentos da hereditariedade: gene e código genético, cálculos com probabilidade",
    "Primeira e segunda leis de Mendel",
    "Aplicações da engenharia genética: clonagem",
    "Transgênicos",
    "Conceitos básicos em ecologia. Relações tróficas (cadeias e teias alimentares)",
    "Distribuição natural da matéria e da energia e concentração de pesticidas e de subprodutos radiativos. Relações ecológicas limitadoras do crescimento populacional. Ecossistemas do Brasil",
    "Ensino de Biologia: conhecimento científico e habilidade didática no ensino de Biologia",
    "A construção do conhecimento no ensino de Biologia: abordagens metodológicas",
    "Recursos didáticos utilizados em sala de aula e laboratório",
    "Incluindo conhecimentos básicos de técnicas",
    "Materiais e normas de segurança laboratoriais",
    "O ensino de Biologia e as novas tecnologias da informação e comunicação",
    "Avaliação de aprendizagem do conhecimento biológico",
    "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais do Ensino Médio para a Disciplina de Biologia"
  ]
};

export const getMicroSyllabusForSpecialty = (spec: string): string[] => {
  if (SEDUC_CE_MICRO_SYLLABUS[spec]) {
    return SEDUC_CE_MICRO_SYLLABUS[spec];
  }
  
  const specData = CONTENT_HIERARCHY["Conhecimentos Específicos"]?.specialties?.[spec];
  if (specData && specData.topics) {
    const list: string[] = [];
    specData.topics.forEach(t => {
      t.subtopics.forEach(sub => {
        list.push(sub);
      });
    });
    if (list.length > 0) return list;
  }

  // Generic fallback if not fully populated
  return [
    `Fundamentos Teóricos e Conceituais de ${spec}`,
    `Planejamento e Práticas Pedagógicas aplicadas ao ensino de ${spec}`,
    `Metodologias Ativas e Tecnologias de Aprendizagem em ${spec}`,
    `Análise Crítica de Materiais Didáticos e Diretrizes de ${spec}`,
    `Resolução de Problemas e Abordagem de Temas Contemporâneos em ${spec}`,
    `Avaliação e Acompanhamento Escolar em ${spec}`,
    `Didática Geral e Transposição Didática em ${spec}`,
    `História e Epistemologia da ciência ${spec}`
  ];
};

export interface DayTemplate {
  subjects: string[];
  topicsMapKey: Array<'Língua Portuguesa' | 'Didática' | 'Indicadores' | 'Legislação' | 'Específico'>;
  isSimulado?: boolean;
  simuladoName?: string;
  simuladoNotes?: string;
  isRevisionFinal?: boolean;
  revisionName?: string;
  isConcurso?: boolean;
  customTime?: string;
}

// Replicate the exact 10-week, 74-day structure of the PDF
export const strategic74DayTemplate: DayTemplate[] = [
  // WEEK 1
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "INDICADORES"], topicsMapKey: ["Língua Portuguesa", "Didática", "Indicadores"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["DIDÁTICA", "INDICADORES", "ESPECÍFICO"], topicsMapKey: ["Didática", "Indicadores", "Específico"] },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Simulado Geral Temático de Sábado", simuladoNotes: "Resolver questões no modelo FUNECE das disciplinas estudadas nos últimos dias.", customTime: "09:00 - 12:00" },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Análise ativa do simulado e descanso restaurador", simuladoNotes: "Corrigir os erros do simulado de sábado e revisar as anotações do caderno de erros.", customTime: "10:00 - 12:00" },
  
  // WEEK 2
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "ESPECÍFICO"], topicsMapKey: ["Língua Portuguesa", "Didática", "Específico"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "INDICADORES"], topicsMapKey: ["Língua Portuguesa", "Didática", "Indicadores"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["DIDÁTICA", "INDICADORES", "ESPECÍFICO"], topicsMapKey: ["Didática", "Indicadores", "Específico"] },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Simulado Geral Temático de Sábado", simuladoNotes: "Praticar com questões focadas da banca FUNECE/UECE.", customTime: "09:00 - 12:00" },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Análise ativa do simulado e descanso restaurador", simuladoNotes: "Revisar as pegadinhas da FUNECE e guardar os erros no caderno.", customTime: "10:00 - 12:00" },

  // WEEK 3
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "ESPECÍFICO"], topicsMapKey: ["Língua Portuguesa", "Didática", "Específico"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "INDICADORES"], topicsMapKey: ["Língua Portuguesa", "Didática", "Indicadores"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["DIDÁTICA", "INDICADORES", "ESPECÍFICO"], topicsMapKey: ["Didática", "Indicadores", "Específico"] },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Simulado Geral Temático de Sábado", simuladoNotes: "Simulado focado em consolidar o ritmo de prova.", customTime: "09:00 - 12:00" },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Análise ativa do simulado e descanso restaurador", simuladoNotes: "Identificação de lacunas teóricas e descanso proativo.", customTime: "10:00 - 12:00" },

  // WEEK 4
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "ESPECÍFICO"], topicsMapKey: ["Língua Portuguesa", "Didática", "Específico"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "INDICADORES"], topicsMapKey: ["Língua Portuguesa", "Didática", "Indicadores"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["DIDÁTICA", "INDICADORES", "ESPECÍFICO"], topicsMapKey: ["Didática", "Indicadores", "Específico"] },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Simulado Geral Temático de Sábado", simuladoNotes: "Avaliar o progresso após 4 semanas de cronograma contínuo.", customTime: "09:00 - 12:00" },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Análise ativa do simulado e descanso restaurador", simuladoNotes: "Organizar resumos e focar na redução de erros frequentes.", customTime: "10:00 - 12:00" },

  // WEEK 5
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "ESPECÍFICO"], topicsMapKey: ["Língua Portuguesa", "Didática", "Específico"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "INDICADORES"], topicsMapKey: ["Língua Portuguesa", "Didática", "Indicadores"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["DIDÁTICA", "INDICADORES", "ESPECÍFICO"], topicsMapKey: ["Didática", "Indicadores", "Específico"] },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Simulado Geral Temático de Sábado", simuladoNotes: "Simulado de meia-jornada para consolidação do conteúdo.", customTime: "09:00 - 12:00" },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Análise ativa do simulado e descanso restaurador", simuladoNotes: "Mapear o rendimento para recalibrar o mentor.", customTime: "10:00 - 12:00" },

  // WEEK 6
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "ESPECÍFICO"], topicsMapKey: ["Língua Portuguesa", "Didática", "Específico"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "INDICADORES"], topicsMapKey: ["Língua Portuguesa", "Didática", "Indicadores"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["DIDÁTICA", "INDICADORES", "ESPECÍFICO"], topicsMapKey: ["Didática", "Indicadores", "Específico"] },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Simulado Geral Temático de Sábado", simuladoNotes: "Praticar velocidade de leitura com enunciados longos.", customTime: "09:00 - 12:00" },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Análise ativa do simulado e descanso restaurador", simuladoNotes: "Avaliar o tempo gasto por questão no simulado.", customTime: "10:00 - 12:00" },

  // WEEK 7
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "ESPECÍFICO"], topicsMapKey: ["Língua Portuguesa", "Didática", "Específico"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "INDICADORES"], topicsMapKey: ["Língua Portuguesa", "Didática", "Indicadores"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["DIDÁTICA", "INDICADORES", "ESPECÍFICO"], topicsMapKey: ["Didática", "Indicadores", "Específico"] },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Simulado Geral Temático de Sábado", simuladoNotes: "Medir desempenho em conteúdos de Legislação.", customTime: "09:00 - 12:00" },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Análise ativa do simulado e descanso restaurador", simuladoNotes: "Revisar as pegadinhas da banca e descansar a mente.", customTime: "10:00 - 12:00" },

  // WEEK 8
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "ESPECÍFICO"], topicsMapKey: ["Língua Portuguesa", "Didática", "Específico"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "INDICADORES"], topicsMapKey: ["Língua Portuguesa", "Didática", "Indicadores"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["DIDÁTICA", "INDICADORES", "ESPECÍFICO"], topicsMapKey: ["Didática", "Indicadores", "Específico"] },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Simulado Geral Temático de Sábado", simuladoNotes: "Treinar sob condições reais de pressão e barulho.", customTime: "09:00 - 12:00" },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Análise ativa do simulado e descanso restaurador", simuladoNotes: "Foco total em reverter os erros graves de conteúdo.", customTime: "10:00 - 12:00" },

  // WEEK 9
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "ESPECÍFICO"], topicsMapKey: ["Língua Portuguesa", "Didática", "Específico"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "INDICADORES"], topicsMapKey: ["Língua Portuguesa", "Didática", "Indicadores"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["DIDÁTICA", "INDICADORES", "ESPECÍFICO"], topicsMapKey: ["Didática", "Indicadores", "Específico"] },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Simulado Geral Temático de Sábado", simuladoNotes: "Último simulado temático antes da revisão geral.", customTime: "09:00 - 12:00" },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Análise ativa do simulado e descanso restaurador", simuladoNotes: "Garantir que nenhum erro seja repetido no caderno de erros.", customTime: "10:00 - 12:00" },

  // WEEK 10
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "ESPECÍFICO"], topicsMapKey: ["Língua Portuguesa", "Didática", "Específico"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["PORTUGUÊS", "DIDÁTICA", "INDICADORES"], topicsMapKey: ["Língua Portuguesa", "Didática", "Indicadores"] },
  { subjects: ["LEGISLAÇÃO", "ESPECÍFICO"], topicsMapKey: ["Legislação", "Específico"] },
  { subjects: ["DIDÁTICA", "INDICADORES", "ESPECÍFICO"], topicsMapKey: ["Didática", "Indicadores", "Específico"] },

  // FINAL REVISION & TESTING WEEK
  { subjects: ["REVISÃO / DESCANSO"], topicsMapKey: [], isRevisionFinal: true, revisionName: "Revisão Ativa: Temas Educacionais e Pedagógicos" },
  { subjects: ["REVISÃO / DESCANSO"], topicsMapKey: [], isRevisionFinal: true, revisionName: "Revisão Ativa: Administração Pública e Legislação Básica" },
  { subjects: ["REVISÃO / DESCANSO"], topicsMapKey: [], isRevisionFinal: true, revisionName: "Revisão Ativa: Língua Portuguesa Básica" },
  { subjects: ["REVISÃO / DESCANSO"], topicsMapKey: [], isRevisionFinal: true, revisionName: "Revisão Ativa: Leitura e Interpretação de Dados e Indicadores" },
  { subjects: ["REVISÃO / DESCANSO"], topicsMapKey: [], isRevisionFinal: true, revisionName: "Revisão Ativa: Conhecimentos Específicos" },
  { subjects: ["SIMULADO GERAL"], topicsMapKey: [], isSimulado: true, simuladoName: "Simulado Final Completo Seduc-CE", simuladoNotes: "80 questões simulando as condições de tempo e conteúdo exatas da prova FUNECE.", customTime: "08:00 - 12:00" },
  { subjects: ["REVISÃO / DESCANSO"], topicsMapKey: [], isRevisionFinal: true, revisionName: "Sem estudos: Descanso absoluto e controle de ansiedade", simuladoNotes: "Dia reservado para repouso mental completo e controle de ansiedade pré-prova.", customTime: "Livre" },
  { subjects: ["CONCURSO"], topicsMapKey: [], isConcurso: true, customTime: "08:00 - 13:00" }
];

export function generateFull74DaySchedule(
  startDateStr: string, 
  settings: CandidateSettings,
  topics: ContentTopic[],
  options?: {
    studyDays?: number[];
    dailyHours?: number;
    examDate?: string;
  }
): Omit<StudyActivity, "id" | "createdAt">[] {
  const result: Omit<StudyActivity, "id" | "createdAt">[] = [];
  const start = new Date(startDateStr + "T00:00:00");
  const spec = settings.specialty || "Biologia";

  const studyDays = options?.studyDays !== undefined ? options.studyDays : [1, 2, 3, 4, 5, 6]; // Segunda a Sábado as default
  const dailyHours = options?.dailyHours !== undefined ? options.dailyHours : (settings.dailyStudyHours || 4);
  const examDateStr = options?.examDate || settings.examDate || "";
  
  // 1. Group the real content topics by subject
  const subjectGroups: Record<string, ContentTopic[]> = {
    "Língua Portuguesa": [],
    "Educação Brasileira": [],
    "Administração Pública": [],
    "Leitura e Interpretação de Dados e Indicadores": [],
    "Conhecimentos Específicos": []
  };

  topics.forEach(t => {
    const s = t.subject;
    if (subjectGroups[s]) {
      subjectGroups[s].push(t);
    } else {
      // Fallback/loose mapping
      if (s.includes("Português") || s.includes("Portuguesa")) {
        subjectGroups["Língua Portuguesa"].push(t);
      } else if (s.includes("Educação") || s.includes("Didática") || s.includes("Temas Educacionais")) {
        subjectGroups["Educação Brasileira"].push(t);
      } else if (s.includes("Administração") || s.includes("Legislação") || s.includes("Pública")) {
        subjectGroups["Administração Pública"].push(t);
      } else if (s.includes("Leitura") || s.includes("Indicadores") || s.includes("Dados")) {
        subjectGroups["Leitura e Interpretação de Dados e Indicadores"].push(t);
      } else {
        subjectGroups["Conhecimentos Específicos"].push(t);
      }
    }
  });

  // 2. Sort each group by axis (block) and then importanceScore (descending)
  const sortTopicsByBlock = (list: ContentTopic[]) => {
    return [...list].sort((a, b) => {
      const numA = parseInt(a.axis?.match(/BLOCO\s+(\d+)/)?.[1] || "99");
      const numB = parseInt(b.axis?.match(/BLOCO\s+(\d+)/)?.[1] || "99");
      if (numA !== numB) return numA - numB;
      return (b.importanceScore || 0) - (a.importanceScore || 0);
    });
  };

  const sortedGroups: Record<string, ContentTopic[]> = {
    "Língua Portuguesa": sortTopicsByBlock(subjectGroups["Língua Portuguesa"]),
    "Educação Brasileira": sortTopicsByBlock(subjectGroups["Educação Brasileira"]),
    "Administração Pública": sortTopicsByBlock(subjectGroups["Administração Pública"]),
    "Leitura e Interpretação de Dados e Indicadores": sortTopicsByBlock(subjectGroups["Leitura e Interpretação de Dados e Indicadores"]),
    "Conhecimentos Específicos": sortTopicsByBlock(subjectGroups["Conhecimentos Específicos"])
  };

  let currentDate = new Date(start);
  
  // Calculate difference in calendar days up to the exam date
  const end = examDateStr ? new Date(examDateStr + "T00:00:00") : new Date(start.getTime() + 74 * 24 * 60 * 60 * 1000);
  const diffTime = end.getTime() - start.getTime();
  let totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive of exam day
  if (totalDays <= 0 || totalDays < 5) {
    totalDays = 74; // Safe fallback
  }

  const subjectKeys = [
    "Língua Portuguesa", 
    "Educação Brasileira", 
    "Administração Pública", 
    "Leitura e Interpretação de Dados e Indicadores", 
    "Conhecimentos Específicos"
  ];

  // 3. Pre-calculate active slot counts for each subject dynamically in the final schedule range
  const subjectSlotCounts: Record<string, number> = {
    "Língua Portuguesa": 0,
    "Educação Brasileira": 0,
    "Administração Pública": 0,
    "Leitura e Interpretação de Dados e Indicadores": 0,
    "Conhecimentos Específicos": 0
  };

  let simDate = new Date(start);
  for (let i = 0; i < totalDays; i++) {
    const year = simDate.getFullYear();
    const month = String(simDate.getMonth() + 1).padStart(2, '0');
    const day = String(simDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const isExamDay = (dateStr === examDateStr) || (i === totalDays - 1);
    const isDayBeforeExam = (i === totalDays - 2);

    if (!isExamDay && !isDayBeforeExam) {
      const dayOfWeek = simDate.getDay();
      const isStudyDay = studyDays.includes(dayOfWeek);
      if (isStudyDay) {
        const numTopicsForDay = dailyHours >= 4 ? 4 : 3;
        const startIdx = (i * numTopicsForDay) % subjectKeys.length;
        for (let s = 0; s < numTopicsForDay; s++) {
          const idx = (startIdx + s) % subjectKeys.length;
          const subj = subjectKeys[idx];
          if (subjectSlotCounts[subj] !== undefined) {
            subjectSlotCounts[subj]++;
          }
        }
      }
    }
    simDate.setDate(simDate.getDate() + 1);
  }

  // Helper to chunk topics evenly to match slots and guarantee 100% coverage
  function getChunksForSubject(arr: ContentTopic[], numChunks: number): ContentTopic[][] {
    if (numChunks <= 0) return [];
    if (arr.length === 0) return [];

    const chunks: ContentTopic[][] = [];

    if (arr.length <= numChunks) {
      // More slots than topics: cycle list to fill all slots
      for (let i = 0; i < numChunks; i++) {
        chunks.push([arr[i % arr.length]]);
      }
    } else {
      // More topics than slots: group/chunk topics to fit slots exactly (100% coverage)
      const minSize = Math.floor(arr.length / numChunks);
      const extra = arr.length % numChunks;

      let index = 0;
      for (let i = 0; i < numChunks; i++) {
        const size = minSize + (i < extra ? 1 : 0);
        chunks.push(arr.slice(index, index + size));
        index += size;
      }
    }

    return chunks;
  }

  // Pre-generate chunks for all subjects
  const subjectChunks: Record<string, ContentTopic[][]> = {
    "Língua Portuguesa": getChunksForSubject(sortedGroups["Língua Portuguesa"], subjectSlotCounts["Língua Portuguesa"]),
    "Educação Brasileira": getChunksForSubject(sortedGroups["Educação Brasileira"], subjectSlotCounts["Educação Brasileira"]),
    "Administração Pública": getChunksForSubject(sortedGroups["Administração Pública"], subjectSlotCounts["Administração Pública"]),
    "Leitura e Interpretação de Dados e Indicadores": getChunksForSubject(sortedGroups["Leitura e Interpretação de Dados e Indicadores"], subjectSlotCounts["Leitura e Interpretação de Dados e Indicadores"]),
    "Conhecimentos Específicos": getChunksForSubject(sortedGroups["Conhecimentos Específicos"], subjectSlotCounts["Conhecimentos Específicos"])
  };

  const chunkPointers: Record<string, number> = {
    "Língua Portuguesa": 0,
    "Educação Brasileira": 0,
    "Administração Pública": 0,
    "Leitura e Interpretação de Dados e Indicadores": 0,
    "Conhecimentos Específicos": 0
  };

  const getNextChunkFromSubject = (subj: string): ContentTopic[] | null => {
    const chunks = subjectChunks[subj];
    if (!chunks || chunks.length === 0) return null;
    const idx = chunkPointers[subj];
    chunkPointers[subj] = idx + 1;
    return chunks[idx % chunks.length] || null;
  };

  // Helper to determine question targets per FUNECE blueprint
  const getQuestionsCountForSubject = (subj: string): number => {
    if (subj.includes("Português") || subj.includes("Portuguesa")) return 8;
    if (subj.includes("Educação") || subj.includes("Didática") || subj.includes("Temas Educacionais")) return 8;
    if (subj.includes("Administração") || subj.includes("Pública")) return 6;
    if (subj.includes("Leitura") || subj.includes("Indicadores") || subj.includes("Dados")) return 8;
    if (subj.includes("Específicos") || subj.includes("Específico")) return 50;
    return 10; // Default fallback
  };

  currentDate = new Date(start);

  for (let i = 0; i < totalDays; i++) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const isExamDay = (dateStr === examDateStr) || (i === totalDays - 1);
    const isDayBeforeExam = (i === totalDays - 2);
    
    if (isExamDay) {
      // Exam Day
      result.push({
        topicId: "concurso-oficial",
        topicName: `GRANDE DIA DA SUA APROVAÇÃO! PROVA OFICIAL SEDUC-CE (${spec})`,
        subject: "CONCURSO SELEÇÃO",
        type: "exercise",
        status: "planned",
        scheduledDate: dateStr,
        durationMinutes: 300,
        notes: "Eu assumo o compromisso de seguir este planejamento com determinação, ética e foco. Cada dia concluído me aproxima de vestir o crachá de servidor público do Estado do Ceará.",
        theoryDone: false,
        questionsDone: false,
        revisionDone: false
      });
    } else if (isDayBeforeExam) {
      // Final Revision Day
      result.push({
        topicId: `revision-day-${i + 1}`,
        topicName: "Revisão de Véspera e Descanso Mental Absoluto",
        subject: "Revisão de Véspera",
        type: "revision",
        status: "planned",
        scheduledDate: dateStr,
        durationMinutes: 120,
        notes: "Dia reservado para repouso mental completo e controle de ansiedade pré-prova. Confie na sua trajetória de preparação!",
        theoryDone: false,
        questionsDone: false,
        revisionDone: false
      });
    } else {
      const dayOfWeek = currentDate.getDay(); // 0 is Sunday, 6 is Saturday
      const isStudyDay = studyDays.includes(dayOfWeek);

      if (!isStudyDay) {
        // Rest Day if not selected as study day
        result.push({
          topicId: `rest-day-${i + 1}`,
          topicName: "Descanso Planejado e Equilíbrio Emocional",
          subject: "Descanso",
          type: "revision",
          status: "planned",
          scheduledDate: dateStr,
          durationMinutes: 60,
          notes: "Consolidação de memória e descanso proativo. Recupere as energias física e mental para os próximos ciclos de alto rendimento.",
          theoryDone: false,
          questionsDone: false,
          revisionDone: false
        });
      } else {
        // Study day - schedule 3 to 4 unique subjects based on available study hours
        const numTopicsForDay = dailyHours >= 4 ? 4 : 3;
        
        const activeSubjectsForDay: string[] = [];
        const startIdx = (i * numTopicsForDay) % subjectKeys.length;
        for (let s = 0; s < numTopicsForDay; s++) {
          const idx = (startIdx + s) % subjectKeys.length;
          activeSubjectsForDay.push(subjectKeys[idx]);
        }
        
        const dailyTimeMinutes = dailyHours * 60;
        const timePerActivity = Math.round(dailyTimeMinutes / activeSubjectsForDay.length);

        activeSubjectsForDay.forEach(subj => {
          const chunk = getNextChunkFromSubject(subj);
          if (chunk && chunk.length > 0) {
            const questionsCount = getQuestionsCountForSubject(subj);
            const topicId = chunk.map(t => t.id).join(",");
            const topicName = chunk.map(t => t.name).join(" + ");
            
            const notesText = chunk.length === 1 
              ? `[${chunk[0].axis}] Estudo minucioso e sequencial do edital. Resolver exatamente ${questionsCount} questões focadas deste assunto para fixar o aprendizado.`
              : `[Bloco Combinado] Estudo consolidado de microtópicos para garantir cobertura de 100% do edital:\n` + 
                chunk.map((t, idx) => `   ${idx + 1}. [${t.axis}] ${t.name}`).join("\n") +
                `\n👉 Resolver no mínimo ${questionsCount} questões focadas destes assuntos no simulador para fixar.`;

            result.push({
              topicId: topicId,
              topicName: topicName,
              subject: chunk[0].subject,
              type: "theory",
              status: "planned",
              scheduledDate: dateStr,
              durationMinutes: timePerActivity,
              notes: notesText,
              theoryDone: false,
              questionsDone: false,
              revisionDone: false
            });
          }
        });
      }
    }

    // Advance 1 day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}
