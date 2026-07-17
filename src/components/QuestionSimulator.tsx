import { useState, useMemo, useEffect } from "react";
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  ArrowRight, 
  RefreshCw, 
  BookOpen, 
  Sparkles,
  AlertTriangle,
  Flame,
  ChevronRight,
  Sliders,
  Play,
  RotateCcw,
  BookMarked
} from "lucide-react";
import { Question, ContentTopic, CandidateSettings } from "../types";
import { CONTENT_HIERARCHY, DETAILED_QUESTIONS_BANK, SimulatorQuestion } from "./questionsBank";
import { BIOLOGY_COMPLETE_SYLLABUS_BLOCKS } from "../data/completeSyllabus";

interface QuestionSimulatorProps {
  questions: Question[]; // Firestore questions
  topics: ContentTopic[];
  onSolveQuestion: (topicId: string, isCorrect: boolean) => Promise<void>;
  onRecordMistake: (question: Question, selectedIndex: number) => Promise<void>;
  settings?: CandidateSettings;
}

interface MicroTopic {
  id: string;
  name: string;
}

interface BlockInfo {
  name: string;
  microTopics: MicroTopic[];
}

interface BasicSubjectInfo {
  id: string;
  displayName: string;
  subjectKey: string;
  questionsWeight: number;
  blocks: BlockInfo[];
}

const BASIC_SUBJECTS_HIERARCHY: BasicSubjectInfo[] = [
  {
    id: "eb",
    displayName: "Educação Brasileira",
    subjectKey: "Educação Brasileira — Temas Educacionais e Pedagógicos",
    questionsWeight: 8,
    blocks: [
      {
        name: "📚 BLOCO 1 — FUNDAMENTOS DA EDUCAÇÃO E ASPECTOS HISTÓRICOS",
        microTopics: [
          { id: "eb-1", name: "História do Pensamento Pedagógico Brasileiro e Correntes de Pensamento" },
          { id: "eb-2", name: "Políticas Públicas para a Educação Básica e Rumos do Ensino Médio" },
          { id: "eb-3", name: "Aspectos Legais e Políticos da Organização da Educação Brasileira" }
        ]
      },
      {
        name: "📚 BLOCO 2 — TEORIAS DA APRENDIZAGEM E DESENVOLVIMENTO",
        microTopics: [
          { id: "eb-4", name: "Jean Piaget: Desenvolvimento Cognitivo e Psicologia Escolar" },
          { id: "eb-5", name: "Lev Vygotsky: Mediação Sócio-Histórica e Zona de Desenvolvimento Proximal (ZDP)" },
          { id: "eb-6", name: "Henri Wallon: Afetividade, Movimento e Inteligência no Desenvolvimento Humano" },
          { id: "eb-7", name: "Teoria das Inteligências Múltiplas (Gardner) e Psicogênese da Língua Escrita (Emília Ferreiro)" }
        ]
      },
      {
        name: "📚 BLOCO 3 — DIDÁTICA, PLANEJAMENTO E AVALIAÇÃO",
        microTopics: [
          { id: "eb-8", name: "Didática como Fundamento Epistemológico e Organização do Ensino" },
          { id: "eb-9", name: "Planejamento Didático: Objetivos, Conteúdos, Metodologias e Recursos" },
          { id: "eb-10", name: "Avaliação da Aprendizagem: Diagnóstica, Formativa e Somativa" },
          { id: "eb-11", name: "Tendências Pedagógicas na Prática Escolar: Liberais e Progressistas" }
        ]
      },
      {
        name: "📚 BLOCO 4 — GESTÃO ESCOLAR E TEMAS CONTEMPORÂNEOS",
        microTopics: [
          { id: "eb-12", name: "Projeto Político Pedagógico (PPP): Concepção, Elaboração e Avaliação" },
          { id: "eb-13", name: "Temas Contemporâneos: Bullying, Relações de Gênero, Família e Diversidade" },
          { id: "eb-14", name: "Educação Inclusiva, AEE e os Desafios do Ensino Médio Integrado" }
        ]
      }
    ]
  },
  {
    id: "ap",
    displayName: "Administração Pública",
    subjectKey: "Administração Pública",
    questionsWeight: 6,
    blocks: [
      {
        name: "📚 BLOCO 1 — ADMINISTRAÇÃO PÚBLICA E SERVIDOR PÚBLICO",
        microTopics: [
          { id: "ap-1", name: "1. Conceito de Administração Pública" },
          { id: "ap-2", name: "2. Conceito de Servidor Público" },
          { id: "ap-3", name: "3. Princípios da Administração Pública" },
          { id: "ap-4", name: "4. Direitos e deveres dos servidores públicos" },
          { id: "ap-5", name: "5. Responsabilidade dos servidores públicos" }
        ]
      },
      {
        name: "📚 BLOCO 2 — SERVIDOR PÚBLICO ESTADUAL DO CEARÁ",
        microTopics: [
          { id: "ap-6", name: "6. Estatuto dos Funcionários Públicos Civis do Estado do Ceará (Lei nº 9.826/1974)" },
          { id: "ap-6.1", name: "6.1 Provimento dos cargos (Capítulo I ao X)" },
          { id: "ap-6.2", name: "6.2 Direitos, vantagens e autorizações (Capítulo I ao VI)" },
          { id: "ap-6.3", name: "6.3 Regime disciplinar (Título VI, Capítulo I ao VII)" },
          { id: "ap-7", name: "7. Lei nº 15.243/2012 (Disciplina o art. 3º da Lei nº 15.064/2011)" },
          { id: "ap-8", name: "8. Estágio Probatório do Servidor Estadual (8.1 Lei nº 9.826/1974, 8.2 Lei nº 13.092/2001, 8.3 Lei nº 15.744/2014, 8.4 Lei nº 15.909/2015)" }
        ]
      },
      {
        name: "📚 BLOCO 3 — CARREIRA DO MAGISTÉRIO DO CEARÁ",
        microTopics: [
          { id: "ap-9", name: "9. Carreira do Magistério (Concurso, Provimento, Carga horária, Jornada) - Lei nº 10.884/1984, Lei nº 12.066/1993, Lei nº 14.404/2009" },
          { id: "ap-10", name: "10. Ampliação da carga horária de trabalho do Grupo MAG (Lei nº 15.451/2013, Decreto nº 31.458/2014)" },
          { id: "ap-11", name: "11. Promoção dos profissionais do Grupo MAG (Lei nº 15.901/2015, Decreto nº 32.103/2016)" },
          { id: "ap-12", name: "12. Sistema remuneratório dos profissionais MAG de nível superior (Lei nº 15.243/2012, Lei nº 15.901/2015, Lei nº 16.104/2016, Lei nº 16.513/2018, Lei nº 16.536/2018)" }
        ]
      },
      {
        name: "📚 BLOCO 4 — LEGISLAÇÃO BÁSICA DA EDUCAÇÃO",
        microTopics: [
          { id: "ap-13", name: "13. Lei de Diretrizes e Bases da Educação Nacional — LDB (Lei nº 9.394/1996 e alterações)" },
          { id: "ap-14", name: "14. Estatuto da Criança e do Adolescente — ECA (Lei nº 8.069/1990 e alterações)" },
          { id: "ap-15", name: "15. Constituição Federal — Educação (Artigos 205 a 214)" },
          { id: "ap-16", name: "16. Emenda Constitucional nº 53/2006" },
          { id: "ap-17", name: "17. Lei nº 11.494/2007 e alterações" },
          { id: "ap-18", name: "18. Lei nº 11.114/2005" },
          { id: "ap-19", name: "19. Lei nº 11.274/2006" },
          { id: "ap-20", name: "20. Lei nº 13.415/2017" },
          { id: "ap-21", name: "21. Plano Nacional de Educação — PNE (Lei Federal nº 13.005/2014)" },
          { id: "ap-22", name: "22. Plano Estadual de Educação do Ceará — PEE (Lei Estadual nº 16.025/2016)" }
        ]
      }
    ]
  },
  {
    id: "lp",
    displayName: "Língua Portuguesa",
    subjectKey: "Língua Portuguesa",
    questionsWeight: 8,
    blocks: [
      {
        name: "📚 BLOCO 1 — LEITURA E COMPREENSÃO DE TEXTO",
        microTopics: [
          { id: "lp-1", name: "Compreensão e Interpretação de Textos Literários e Não-Literários" },
          { id: "lp-2", name: "Tipologia Textual, Gêneros Discursivos e Coesão/Coerência" }
        ]
      },
      {
        name: "📚 BLOCO 2 — MORFOSSINTAXE DA ORAÇÃO E DO PERÍODO",
        microTopics: [
          { id: "lp-3", name: "Emprego das Classes de Palavras (Substantivo, Pronome, Verbo, etc.)" },
          { id: "lp-4", name: "Sintaxe da Oração: Termos Essenciais, Integrantes e Acessórios" },
          { id: "lp-5", name: "Período Composto por Coordenação e Subordinação" }
        ]
      },
      {
        name: "📚 BLOCO 3 — CONCORDÂNCIA, REGÊNCIA E CRASE",
        microTopics: [
          { id: "lp-6", name: "Concordância Verbal e Nominal" },
          { id: "lp-7", name: "Regência Verbal e Nominal" },
          { id: "lp-8", name: "Uso do Sinal Indicativo de Crase" }
        ]
      },
      {
        name: "📚 BLOCO 4 — ORTOGRAFIA, PONTUAÇÃO E SEMÂNTICA",
        microTopics: [
          { id: "lp-9", name: "Ortografia Oficial, Acentuação Gráfica e Pontuação (Emprego da vírgula)" },
          { id: "lp-10", name: "Significação das palavras: Sinonímia, Antonímia, Homonímia, Paronímia" }
        ]
      }
    ]
  },
  {
    id: "li",
    displayName: "Leitura e Interpretação de Dados e Indicadores",
    subjectKey: "Leitura e Interpretação de Dados e Indicadores Educacionais",
    questionsWeight: 8,
    blocks: [
      {
        name: "📚 BLOCO 1 — FLUXO ESCOLAR E MATRÍCULAS",
        microTopics: [
          { id: "li-1", name: "Indicadores de Matrícula, Taxa de Escolarização Bruta e Líquida" },
          { id: "li-2", name: "Taxas de Rendimento Escolar: Aprovação, Reprovação e Abandono/Evasão" },
          { id: "li-3", name: "Cálculo e Análise da Distorção Idade-Série no Ensino Médio" }
        ]
      },
      {
        name: "📚 BLOCO 2 — AVALIAÇÕES DO SISTEMA EDUCACIONAL",
        microTopics: [
          { id: "li-4", name: "SPAECE (Sistema Permanente de Avaliação do Ceará) e Escalas de Proficiência" },
          { id: "li-5", name: "Saeb, Prova Brasil, IDEB (Metodologia e Metas) e o PISA" }
        ]
      },
      {
        name: "📚 BLOCO 3 — ANÁLISE DE GRÁFICOS E TABELAS ESTATÍSTICAS",
        microTopics: [
          { id: "li-6", name: "Interpretação de Gráficos (Barras, Linhas, Setores) e Mapas Educacionais" },
          { id: "li-7", name: "Resolução de Problemas Matemáticos com Porcentagem sobre Indicadores" }
        ]
      }
    ]
  }
];

export default function QuestionSimulator({ questions: dbQuestions, topics, onSolveQuestion, onRecordMistake, settings }: QuestionSimulatorProps) {
  // Simulator configuration states
  const [isConfiguring, setIsConfiguring] = useState(true);
  
  // Clean configuration states to reflect user intent
  const [isRandomMode, setIsRandomMode] = useState<boolean>(false);
  const [specificCategory, setSpecificCategory] = useState<'basic' | 'specific'>('basic');
  const [activeBasicSubjectId, setActiveBasicSubjectId] = useState<string>('eb'); // 'eb' | 'ap' | 'lp' | 'li'
  const [activeBlockName, setActiveBlockName] = useState<string | null>(null);
  const [activeMicroTopicId, setActiveMicroTopicId] = useState<string | null>(null);

  const [selectedSubject, setSelectedSubject] = useState<string>("Educação Brasileira — Temas Educacionais e Pedagógicos");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("Biologia");
  const [selectedTopicName, setSelectedTopicName] = useState<string>("All");
  const [selectedSubtopicName, setSelectedSubtopicName] = useState<string>("All");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(10);
  const [mixingMode, setMixingMode] = useState<'single_topic' | 'mix_subject'>('mix_subject');

  // Simulation execution states
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showFinished, setShowFinished] = useState(false);

  // Sync selectedSpecialty with candidate profile settings specialty
  useEffect(() => {
    if (settings?.specialty) {
      setSelectedSpecialty(settings.specialty);
    }
  }, [settings?.specialty]);

  // Dynamic specialties based on hierarchy
  const specialtiesList = useMemo(() => {
    const item = CONTENT_HIERARCHY["Conhecimentos Específicos"];
    if (item && item.hasSpecialties && item.specialties) {
      return Object.keys(item.specialties);
    }
    return [];
  }, []);

  // Dynamic topics based on active selections
  const topicsList = useMemo(() => {
    const item = CONTENT_HIERARCHY["Conhecimentos Específicos"];
    if (!item) return [];
    if (item.hasSpecialties && item.specialties && selectedSpecialty) {
      return item.specialties[selectedSpecialty]?.topics || [];
    }
    return item.topics || [];
  }, [selectedSpecialty]);

  // Dynamic subtopics based on selected topic
  const subtopicsList = useMemo(() => {
    if (selectedTopicName === "All") return [];
    const foundTopic = topicsList.find(t => t.name === selectedTopicName);
    return foundTopic ? foundTopic.subtopics : [];
  }, [selectedTopicName, topicsList]);

  // Reset topics and subtopics when subject/specialty changes
  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setSelectedTopicName("All");
    setSelectedSubtopicName("All");
    
    const item = CONTENT_HIERARCHY[subject];
    if (item && item.hasSpecialties && item.specialties) {
      const firstSpec = Object.keys(item.specialties)[0];
      setSelectedSpecialty(firstSpec);
    } else {
      setSelectedSpecialty("");
    }
  };

  const handleSpecialtyChange = (spec: string) => {
    setSelectedSpecialty(spec);
    setSelectedTopicName("All");
    setSelectedSubtopicName("All");
    setActiveBlockName(null);
    setActiveMicroTopicId(null);
  };

  const handleTopicChange = (topic: string) => {
    setSelectedTopicName(topic);
    setSelectedSubtopicName("All");
  };

  // Maps subject + specialty + topic to corresponding Firestore topicId for dashboard metrics sync
  const mapToDatabaseTopicId = (subject: string, specialty?: string, topic?: string): string => {
    if (subject === "Língua Portuguesa") {
      if (topic?.includes("Gramática")) return "topic-lp-2";
      if (topic?.includes("Compreensão")) return "topic-lp-3";
      return "topic-lp-1";
    }
    if (subject?.includes("Educação Brasileira")) {
      if (topic?.includes("Tendências")) return "topic-did-1";
      if (topic?.includes("Planejamento")) return "topic-did-3";
      return "topic-did-2";
    }
    if (subject?.includes("Administração")) {
      return "topic-leg-4";
    }
    if (subject?.includes("Leitura e Interpretação")) {
      return "topic-lp-1";
    }
    if (specialty === "Biologia") {
      if (topic === "Genética") return "topic-esp-3";
      if (topic === "Ecologia") return "topic-esp-1";
      return "topic-esp-2";
    }
    return "topic-esp-1";
  };

  // Helper to generate custom styled fallback questions on the fly for missing subtopics
  const generateDynamicFallbackQuestion = (
    subject: string, 
    specialty: string, 
    topicName: string, 
    subtopic: string, 
    index: number
  ): Question => {
    const displaySubject = specialty ? `${subject} (${specialty})` : subject;
    const displayTopic = subtopic && subtopic !== "All" ? subtopic : (topicName && topicName !== "All" ? topicName : "Conteúdo Geral");
    
    if (specialty === "Biologia") {
      const blockNumMatch = activeBlockName?.match(/BLOCO (\d+)/);
      const blockNum = blockNumMatch ? parseInt(blockNumMatch[1]) : 1;

      let bioQuestion = {
        text: `No contexto do ensino médio da SEDUC-CE e sob a perspectiva da banca FUNECE, o estudo analítico do tema de "${displayTopic}" exige do candidato o domínio da transposição didática dos conceitos biológicos fundamentais.`,
        options: [
          "A relação entre teoria científica e as dinâmicas cotidianas dos seres vivos e do ecossistema.",
          "A memorização mecânica de termos filogenéticos desprovidos de sentido pedagógico.",
          "O descarte das evidências evolutivas em favor de dogmas criacionistas estritos.",
          "O foco absoluto na memorização de fórmulas matemáticas de genética sem aplicação prática."
        ],
        correctIndex: 0,
        explanation: "O ensino de Biologia na rede estadual do Ceará orienta-se pela contextualização e pelo desenvolvimento do letramento científico, aproximando os conceitos teóricos do cotidiano e do impacto socioambiental."
      };

      if (blockNum === 1) {
        bioQuestion = {
          text: "A membrana plasmática desempenha papel fundamental no controle do fluxo de substâncias na célula eucarionte. O modelo do mosaico fluido, proposto por Singer e Nicolson, caracteriza a estrutura das biomembranas celulares como:",
          options: [
            "Uma bicamada fosfolipídica estática dotada de poros proteicos fixos e insolúveis.",
            "Uma estrutura dinâmica e fluida composta por uma bicamada de fosfolipídios em constante movimentação lateral, com proteínas inseridas ou associadas.",
            "Uma película de polissacarídeos e carboidratos rígidos que isola completamente o citoplasma do meio externo.",
            "Uma parede de celulose permeável que realiza o transporte ativo de íons por meio de microtúbulos do citoesqueleto."
          ],
          correctIndex: 1,
          explanation: "O modelo do mosaico fluido estabelece que as membranas celulares possuem uma matriz lipídica semifluida com proteínas anfipáticas inseridas (integrais) ou periféricas que possuem mobilidade lateral na bicamada."
        };
      } else if (blockNum === 2) {
        bioQuestion = {
          text: "O tecido epitelial apresenta características específicas intimamente relacionadas ao seu papel de revestimento, proteção e secreção glandular. Uma dessas características marcantes é a presença de:",
          options: [
            "Abundante matriz extracelular preenchendo o espaço entre as células fusiformes.",
            "Células justapostas com escassa substância intercelular e forte adesão por meio de junções celulares.",
            "Vascularização direta abundante através de capilares que penetram as camadas celulares superficiais.",
            "Fibras colágenas e elásticas sintetizadas por condrócitos ativos na membrana basal."
          ],
          correctIndex: 1,
          explanation: "O tecido epitelial caracteriza-se por células intimamente unidas (justapostas), escassa matriz extracelular (intercelular) e ausência de vasos sanguíneos (sendo nutrido por difusão a partir do tecido conjuntivo adjacente)."
        };
      } else if (blockNum === 3) {
        bioQuestion = {
          text: "O processo de condução da seiva bruta (água e sais minerais) nas plantas vasculares ocorre das raízes até as folhas mais altas. O principal mecanismo fisiológico responsável por esse transporte ascendente, segundo a teoria da coesão-tensão (Dixon), é:",
          options: [
            "A pressão positiva gerada pelo acúmulo ativo de amido nas células da raiz.",
            "A transpiração foliar que gera uma força de sucção (tensão) capaz de puxar uma coluna contínua de água unida por pontes de hidrogênio (coesão).",
            "A capilaridade mecânica exclusiva dos vasos de floema ativos apenas durante o período noturno.",
            "A gravidade reversa estimulada pela ação hormonal da auxina e do etileno nas pontas caulinares."
          ],
          correctIndex: 1,
          explanation: "A teoria de Dixon (coesão-transpiração-tensão) explica que a transpiração nas folhas cria uma tensão que puxa a água pelos vasos xilemáticos de forma contínua, mantida pela alta coesão entre as moléculas de água."
        };
      } else if (blockNum === 4) {
        bioQuestion = {
          text: "Durante o desenvolvimento embrionário dos animais metazoários, a fase que se caracteriza pela formação do arquêntero (intestino primitivo), do blastóporo e pela diferenciação dos três folhetos germinativos (ectoderme, mesoderme e endoderme) denomina-se:",
          options: [
            "Mórula.",
            "Blástula.",
            "Gástrula.",
            "Nêurula."
          ],
          correctIndex: 2,
          explanation: "A gastrulação é a fase do desenvolvimento embrionário em que ocorrem movimentos morfogenéticos que dão origem aos folhetos germinativos (ectoderme, mesoderme e endoderme) e à estruturação do arquêntero e blastóporo."
        };
      } else if (blockNum === 5) {
        bioQuestion = {
          text: "No cruzamento de indivíduos heterozigotos para um gene autossômico com dominância completa (Aa x Aa), a proporção fenotípica e genotípica esperadas na descendência serão, respectivamente:",
          options: [
            "1:1 (50% dominantes, 50% recessivos) e 3:1 (75% Aa, 25% aa).",
            "3:1 (75% fenótipo dominante, 25% fenótipo recessivo) e 1:2:1 (25% AA, 50% Aa, 25% aa).",
            "9:3:3:1 (proporção clássica de di-hibridismo) e 1:1:1:1.",
            "100% dominantes e 50% AA com 50% aa."
          ],
          correctIndex: 1,
          explanation: "O cruzamento Aa x Aa resulta na proporção genotípica clássica de 1 AA : 2 Aa : 1 aa (1:2:1). Fenotipicamente, como o alelo 'A' é dominante sobre 'a', os genótipos AA e Aa produzem o mesmo fenótipo dominante, resultando em 3 dominantes para 1 recessivo (3:1)."
        };
      } else if (blockNum === 6) {
        bioQuestion = {
          text: "A teoria sintética da evolução (neodarwinismo) explica a evolução biológica unindo os conceitos darwinianos de seleção natural à genética molecular moderna. Os dois principais fatores responsáveis por introduzir variabilidade genética primária em uma população são:",
          options: [
            "O uso e desuso de órgãos somáticos e a transmissão de caracteres adquiridos ao longo da vida.",
            "A mutação gênica (geração de novos alelos) e a recombinação gênica (crossing-over e segregação independente).",
            "A deriva genética aleatória e a seleção artificial dirigida por pressões antrópicas.",
            "A especiação alopátrica e o isolamento geográfico permanente de nichos ecológicos."
          ],
          correctIndex: 1,
          explanation: "A mutação (gênica ou cromossômica) e a recombinação gênica (induzida pela meiose com crossing-over e fertilização) são as fontes cruciais que geram e reorganizam a variabilidade genética sobre a qual atua a seleção natural."
        };
      } else if (blockNum === 7) {
        bioQuestion = {
          text: "Em um ecossistema equilibrado, o fluxo de energia e a reciclagem da matéria orgânica comportam-se de formas distintas ao longo dos níveis tróficos. Esse comportamento dinâmico é caracterizado por:",
          options: [
            "Fluxo de energia cíclico acumulativo e fluxo de matéria unidirecional decrescente.",
            "Fluxo de energia unidirecional e progressivamente decrescente em cada nível trófico, e fluxo de matéria cíclico mantido pelos decompositores.",
            "Fluxos de energia e matéria ambos estritamente fechados e cíclicos dentro da teia trófica.",
            "Fluxo de energia exponencialmente crescente em direção aos consumidores terciários e matéria inalterada."
          ],
          correctIndex: 1,
          explanation: "A energia entra nos ecossistemas (geralmente via luz solar) e flui unidirecionalmente, diminuindo em cada nível trófico devido a perdas por calor e metabolismo (segunda lei da termodinâmica). A matéria, por outro lado, circula de forma cíclica graças à ação dos decompositores, que convertem matéria orgânica morta em compostos inorgânicos reutilizáveis pelos produtores."
        };
      } else if (blockNum === 8) {
        bioQuestion = {
          text: "A classificação dos seres vivos em grandes reinos baseia-se em critérios de organização celular, nível de organização e modo de nutrição. Os organismos pertencentes ao Reino Fungi caracterizam-se fundamentalmente por serem:",
          options: [
            "Procariontes, unicelulares e autotróficos fotossintetizantes dotados de cloroplastos primários.",
            "Eucariontes, pluricelulares ou unicelulares, e heterotróficos por absorção com parede celular de quitina.",
            "Eucariontes, exclusivamente pluricelulares e autotróficos quimiossintetizantes de fontes hidrotermais.",
            "Acelulares, parasitas intracelulares obrigatórios constituídos por capsídeo glicoproteico rígido."
          ],
          correctIndex: 1,
          explanation: "Os fungos são eucariontes (possuem núcleo e organelas membranosas), unicelulares (leveduras) ou pluricelulares (cogumelos, bolores), e nutrem-se por absorção externa de enzimas digestivas secretadas no meio, possuindo parede celular rígida de quitina."
        };
      } else if (blockNum === 9) {
        bioQuestion = {
          text: "O sistema imunológico humano protege o organismo contra patógenos por meio de imunidade ativa ou passiva. A vacinação profilática contra infecções virais representa um exemplo típico de imunização ativa porque:",
          options: [
            "Introduz anticorpos específicos prontos sintetizados por outro organismo, conferindo proteção imediata e temporária.",
            "Estimula o próprio sistema imunológico do indivíduo a produzir ativamente seus próprios anticorpos e linfócitos de memória, através da introdução de antígenos atenuados ou inativados.",
            "Bloqueia mecanicamente os receptores celulares por meio de uma barreira química temporária indestrutível.",
            "Transfere linfócitos T auxiliares ativos produzidos in vitro que combatem a infecção sem necessidade de reconhecimento prévio do antígeno."
          ],
          correctIndex: 1,
          explanation: "A vacina estimula o sistema imune (imunidade ativa) ao expor o organismo de forma segura a antígenos atenuados, inativados ou fragmentados, induzindo a produção endógena de anticorpos e de células de memória de longo prazo."
        };
      } else if (blockNum === 10) {
        bioQuestion = {
          text: "A técnica de Reação em Cadeia da Polimerase (PCR) revolucionou o diagnóstico médico e a biotecnologia ao permitir a amplificação exponencial in vitro de fragmentos de DNA. Um elemento indispensável para que essa reação ocorra de forma automatizada em ciclos térmicos repetitivos é:",
          options: [
            "A enzima helicase recombinante humana termoestável purificada.",
            "A enzima Taq Polimerase, uma DNA polimerase termoestável isolada da bactéria termófila Thermus aquaticus.",
            "O plasmídeo de clonagem circular com marcadores seletivos de resistência a múltiplos antibióticos.",
            "A transcriptase reversa obtida de vírus retrovirais murinos mantidos sob refrigeração criogênica."
          ],
          correctIndex: 1,
          explanation: "A enzima Taq Polimerase é altamente termoestável, resistindo a temperaturas elevadas de desnaturação de dupla hélice (~94°C) repetitivas em cada ciclo do termociclador sem perder sua atividade catalítica de síntese."
        };
      } else if (blockNum === 11) {
        bioQuestion = {
          text: "A Base Nacional Comum Curricular (BNCC) para o Ensino Médio preconiza que a disciplina de Biologia integre a área de Ciências da Natureza e suas Tecnologias. O foco dessa integração reside no desenvolvimento de habilidades voltadas para:",
          options: [
            "A memorização exaustiva de listas de classificação zoológica e botânica sem aplicações socioculturais ou ecológicas.",
            "O letramento científico e a capacidade de investigação científica para resolver problemas reais de cunho socioambiental, ético e tecnológico.",
            "O isolamento conceitual das ciências físicas e químicas, evitando correlações transdisciplinares.",
            "A substituição das atividades práticas e laboratoriais por fórmulas de física quântica pura com fins industriais."
          ],
          correctIndex: 1,
          explanation: "A BNCC enfatiza que a área de Ciências da Natureza deve promover o letramento científico, capacitando o aluno a compreender, analisar, propor soluções e intervir em problemas éticos, ecológicos e tecnológicos contemporâneos."
        };
      } else if (blockNum === 12) {
        bioQuestion = {
          text: "Os Parâmetros Curriculares Nacionais (PCN) indicam que o ensino de Biologia deve superar o caráter meramente descritivo e mnemônico do edital tradicional. Para atingir essa meta pedagógica, propõe-se que a organização curricular seja estruturada em torno de:",
          options: [
            "Temas estruturadores que conectem intimamente os conteúdos científicos à tecnologia, saúde, meio ambiente e realidade social do aluno.",
            "Listas sequenciais de nomenclatura taxonômica binomial em latim para memorização sistemática.",
            "Práticas exclusivas de memorização de organelas celulares fora de qualquer contexto fisiológico ou evolutivo.",
            "Exercícios focados estritamente nas regras formais de biotipologia humana de meados do século passado."
          ],
          correctIndex: 0,
          explanation: "Os PCN propõem o ensino de Biologia baseado em temas estruturadores para que os conceitos biológicos sejam aprendidos integrados à vida prática, permitindo a compreensão ampla de temas contemporâneos como biotecnologia, sustentabilidade, genética e saúde."
        };
      }

      return {
        id: `q-dynamic-bio-b${blockNum}-${index}`,
        subject: displaySubject,
        axis: topicName || "Biologia Geral",
        topicId: activeMicroTopicId || `bio-${blockNum}-1`,
        topicName: subtopic || "Geral",
        text: bioQuestion.text,
        options: bioQuestion.options,
        correctIndex: bioQuestion.correctIndex,
        explanation: bioQuestion.explanation,
        examBoard: "FUNECE",
        year: 2026
      };
    }

    // Fallback dictionary for highly specific areas
    const fallbackBank: { [key: string]: { text: string; options: string[]; explanation: string } } = {
      "Primeira e Segunda Leis de Mendel": {
        text: "Nas experiências clássicas de genética realizadas por Gregor Mendel com ervilhas Pisum sativum, obteve-se um padrão previsível de hereditariedade. Considerando o cruzamento de plantas puras de sementes lisas com plantas puras de sementes rugosas (geração P), os descendentes da geração F1 e a proporção da geração F2 serão, respectivamente:",
        options: [
          "100% rugosas; 3 lisas para 1 rugosa.",
          "100% lisas; 3 lisas para 1 rugosa.",
          "50% lisas e 50% rugosas; 1 lisa para 1 rugosa.",
          "100% lisas; 9 lisas para 3 rugosas."
        ],
        explanation: "As sementes lisas são determinadas por um alelo dominante. Na geração F1, todos os descendentes são heterozigotos (lisas). Na autofecundação da geração F1, a proporção fenotípica clássica da F2 é de 3:1 (3 sementes lisas para 1 rugosa)."
      },
      "Biotecnologia e DNA Recombinante": {
        text: "A tecnologia do DNA recombinante permitiu grandes avanços na biologia molecular e medicina, como a produção de insulina humana por bactérias. Para cortar fragmentos específicos de DNA e colá-los em plasmídeos vetores, utilizam-se, respectivamente:",
        options: [
          "Enzimas de restrição (endonucleases) e DNA ligases.",
          "Ribossomos e RNA polimerases extracelulares.",
          "Lisozimas bacterianas e anticorpos monoclonais.",
          "Polimerases de PCR e helicases nucleares."
        ],
        explanation: "As Enzimas de restrição cortam o DNA em sítios específicos, enquanto as DNA ligases restabelecem as ligações fosfodiéster entre os fragmentos colados."
      }
    };

    // Smart context matches
    const lcTopic = displayTopic.toLowerCase();
    
    if (lcTopic.includes("administração pública") || lcTopic.includes("conceito de administração") || lcTopic.includes("limpe") || lcTopic.includes("princípios")) {
      return {
        id: `q-dynamic-ap-${index}`,
        subject: displaySubject,
        axis: "Administração Pública",
        topicId: "topic-leg-4",
        topicName: displayTopic,
        text: "A Administração Pública estadual de qualquer dos Poderes do Estado do Ceará obedece aos princípios de legalidade, impessoalidade, moralidade, publicidade e eficiência. O princípio constitucional implícito que exige que a conduta do agente público seja honesta, leal e ética denomina-se princípio da:",
        options: [
          "Moralidade Administrativa.",
          "Razoabilidade Funcional.",
          "Celeridade Processual.",
          "Supremacia do Interesse Particular."
        ],
        correctIndex: 0,
        explanation: "O princípio da moralidade administrativa exige que o agente atue não apenas de acordo com a lei escrita, mas também pautado pela ética, honestidade, lealdade e boa-fé institucionais.",
        examBoard: "FUNECE",
        year: 2024
      };
    }

    if (lcTopic.includes("estatuto") || lcTopic.includes("9.826") || lcTopic.includes("servidor estadual")) {
      return {
        id: `q-dynamic-estatuto-${index}`,
        subject: displaySubject,
        axis: "Administração Pública",
        topicId: "topic-leg-4",
        topicName: displayTopic,
        text: "À luz do Estatuto dos Funcionários Públicos Civis do Estado do Ceará (Lei Estadual nº 9.826/1974), o ato pelo qual o funcionário estável demitido regressa ao cargo de origem em decorrência de decisão administrativa ou judicial é a:",
        options: [
          "Reintegração funcional com ressarcimento integral.",
          "Reversão de aposentadoria facultativa.",
          "Readmissão provisória discricionária.",
          "Ascensão hierárquica automática."
        ],
        correctIndex: 0,
        explanation: "A reintegração é a forma de provimento decorrente do retorno do funcionário demitido ilegalmente, com o ressarcimento integral dos vencimentos e direitos correspondentes ao período de afastamento.",
        examBoard: "FUNECE",
        year: 2025
      };
    }

    if (lcTopic.includes("ldb") || lcTopic.includes("9.394") || lcTopic.includes("diretrizes e bases")) {
      return {
        id: `q-dynamic-ldb-${index}`,
        subject: displaySubject,
        axis: "Legislação da Educação",
        topicId: "topic-leg-4",
        topicName: displayTopic,
        text: "De acordo com o Artigo 3º da Lei de Diretrizes e Bases da Educação Nacional (LDB nº 9.394/1996), o ensino no Brasil deve ser ministrado com base em vários princípios. Qual das seguintes opções apresenta um desses princípios expressos?",
        options: [
          "Pluralismo de ideias e de concepções pedagógicas.",
          "Exclusividade de oferta de ensino em estabelecimentos públicos.",
          "Padronização curricular estrita sem margem regional.",
          "Monopólio estatal das atividades de extensão universitária."
        ],
        correctIndex: 0,
        explanation: "O pluralismo de ideias e de concepções pedagógicas é um princípio educacional fundamental consagrado no Art. 3º, inciso III da LDB, assegurando a diversidade metodológica e teórica.",
        examBoard: "FUNECE",
        year: 2024
      };
    }

    if (lcTopic.includes("eca") || lcTopic.includes("8.069") || lcTopic.includes("criança e do adolescente")) {
      return {
        id: `q-dynamic-eca-${index}`,
        subject: displaySubject,
        axis: "Legislação da Educação",
        topicId: "topic-leg-4",
        topicName: displayTopic,
        text: "Segundo as disposições do Estatuto da Criança e do Adolescente (ECA - Lei nº 8.069/1990) referentes ao direito à educação, constitui dever do Estado garantir à criança e ao adolescente:",
        options: [
          "Ensino fundamental, obrigatório e gratuito, inclusive para os que a ele não tiveram acesso na idade própria.",
          "Acesso compulsório a cursos de nível superior financiados integralmente pelo município.",
          "Atendimento de creche obrigatório apenas no turno noturno para pais trabalhadores.",
          "Fornecimento de material escolar importado de forma irrestrita."
        ],
        correctIndex: 0,
        explanation: "O ECA estabelece em conformidade com a CF/88 a garantia de ensino fundamental, público, obrigatório e gratuito, inclusive para os que não tiveram acesso na idade apropriada.",
        examBoard: "FUNECE",
        year: 2024
      };
    }

    if (lcTopic.includes("constituição") || lcTopic.includes("205") || lcTopic.includes("educação")) {
      return {
        id: `q-dynamic-cf-${index}`,
        subject: displaySubject,
        axis: "Legislação da Educação",
        topicId: "topic-leg-4",
        topicName: displayTopic,
        text: "Segundo o Artigo 205 da Constituição Federal de 1988, a educação é direito de todos e dever do Estado e da família. Ela deve ser promovida e incentivada com a colaboração da sociedade, visando a:",
        options: [
          "O pleno desenvolvimento da pessoa, seu preparo para o exercício da cidadania e sua qualificação para o trabalho.",
          "A formação militar obrigatória e a uniformização das crenças religiosas.",
          "A capacitação puramente teórica e exclusão de competências profissionais.",
          "O controle político-partidário e a censura científica acadêmica."
        ],
        correctIndex: 0,
        explanation: "O Artigo 205 da CF/88 estabelece a tripla finalidade da educação: desenvolvimento da pessoa, preparo para a cidadania e qualificação para o trabalho.",
        examBoard: "FUNECE",
        year: 2024
      };
    }

    if (lcTopic.includes("portuguesa") || lcTopic.includes("crase") || lcTopic.includes("concordância") || lcTopic.includes("interpretação")) {
      return {
        id: `q-dynamic-port-${index}`,
        subject: displaySubject,
        axis: "Língua Portuguesa",
        topicId: "topic-lp-1",
        topicName: displayTopic,
        text: "No período composto por coordenação ou subordinação, o uso correto dos conectores e da pontuação é essencial para a coesão. Assinale a frase que apresenta o emprego correto do sinal indicativo de crase em consonância com a norma padrão:",
        options: [
          "A equipe de professores dirigiu-se à sala de coordenação pedagógica com presteza.",
          "O palestrante começou à falar sobre o novo edital do concurso da Seduc.",
          "Não daremos atenção à boatos infundados sobre o adiamento da prova.",
          "O candidato prefere estudar à distância do que ir às aulas presenciais ordinárias."
        ],
        correctIndex: 0,
        explanation: "Ocorre crase na fusão da preposição 'a' exigida pela regência de 'dirigiu-se' com o artigo feminino 'a' que determina 'sala'. Não ocorre crase antes de verbo ('falar'), palavra masculina ('boatos') ou antes de palavras indeterminadas.",
        examBoard: "FUNECE",
        year: 2024
      };
    }

    if (lcTopic.includes("indicadores") || lcTopic.includes("dados") || lcTopic.includes("ideb") || lcTopic.includes("spaece")) {
      return {
        id: `q-dynamic-ind-${index}`,
        subject: displaySubject,
        axis: "Dados e Indicadores",
        topicId: "topic-lp-1",
        topicName: displayTopic,
        text: "O Índice de Desenvolvimento da Educação Básica (IDEB) é calculado a partir de dois componentes essenciais na aferição de qualidade do sistema educacional brasileiro. São eles:",
        options: [
          "As taxas de rendimento escolar (fluxo) e as médias de desempenho nos exames do SAEB.",
          "O total de recursos financeiros investidos na infraestrutura e as taxas de natalidade municipais.",
          "O número de professores graduados em pedagogia e as taxas de evasão no ensino superior.",
          "O quantitativo bruto de escolas particulares e o índice de satisfação subjetiva dos pais."
        ],
        correctIndex: 0,
        explanation: "O IDEB é constituído pelas taxas de aprovação obtidas no Censo Escolar (fluxo) e as médias de proficiência dos estudantes nas avaliações do Saeb (desempenho).",
        examBoard: "FUNECE",
        year: 2024
      };
    }

    const matched = fallbackBank[displayTopic];
    if (matched) {
      return {
        id: `q-dynamic-matched-${index}`,
        subject: displaySubject,
        axis: topicName || "Geral",
        topicId: mapToDatabaseTopicId(subject, specialty, topicName),
        topicName: displayTopic,
        text: matched.text,
        options: matched.options,
        correctIndex: 1,
        explanation: matched.explanation,
        examBoard: "FUNECE",
        year: 2024
      };
    }

    // Default template fallback in case of unspecified subtopics
    return {
      id: `q-dynamic-gen-${index}`,
      subject: displaySubject,
      axis: topicName || "Geral",
      topicId: mapToDatabaseTopicId(subject, specialty, topicName),
      topicName: displayTopic,
      text: `No contexto da preparação para o cargo de Professor de Ensino Médio da SEDUC-CE, sob a organização conceitual da banca FUNECE, o estudo analítico do tema de "${displayTopic}" exige do candidato o domínio de qual aspecto central?`,
      options: [
        "A correlação literal das diretrizes legais e marcos teóricos da disciplina com os desafios cotidianos do ambiente escolar e da didática em sala de aula.",
        "A memorização puramente abstrata de fórmulas de índices sem nenhuma aplicação pedagógica prática.",
        "O desprezo voluntário das legislações vigentes de ensino em nome de conceitos não regulamentados.",
        "A fixação de critérios avaliativos meramente quantitativos e punitivos com foco na exclusão dos estudantes."
      ],
      correctIndex: 0,
      explanation: "A FUNECE é reconhecida por cobrar a união inteligente de marcos conceituais clássicos (noções jurídicas e teóricas) à sua aplicabilidade prática na rotina e nas diretrizes vigentes no Ensino Médio.",
      examBoard: "FUNECE",
      year: 2024
    };
  };

  // Launch the simulator, building the active questions list
  const handleStartSimulation = () => {
    // 1. Gather pool from both offline detailed bank and database-seeded questions
    const combinedPool = [...DETAILED_QUESTIONS_BANK, ...dbQuestions] as SimulatorQuestion[];

    let filtered: SimulatorQuestion[] = [];

    if (isRandomMode) {
      // Pick questions from any subject!
      filtered = [...combinedPool];
    } else {
      // Specific mode
      if (specificCategory === 'specific') {
        // Specialty Conhecimentos Específicos
        filtered = combinedPool.filter(q => {
          const matchesSubject = q.subject === "Conhecimentos Específicos" || q.subject.includes("Conhecimentos Específicos");
          const matchesSpecialty = q.specialty === selectedSpecialty;
          return matchesSubject && matchesSpecialty;
        });

        if (selectedSpecialty === "Biologia") {
          // Filter by block / micro-topic if selected
          if (activeBlockName) {
            if (activeMicroTopicId) {
              const block = BIOLOGY_COMPLETE_SYLLABUS_BLOCKS.find(b => b.name === activeBlockName);
              const microTopic = block?.microTopics.find(mt => mt.id === activeMicroTopicId);
              if (microTopic) {
                const mtName = microTopic.name.toLowerCase();
                filtered = filtered.filter(q => {
                  return q.text.toLowerCase().includes(mtName) ||
                         q.topicName.toLowerCase().includes(mtName) ||
                         (q.axis && q.axis.toLowerCase().includes(mtName));
                });
              }
            } else {
              // Filter by block keywords (excluding generic markup)
              const blockKeywords = activeBlockName.replace(/🧬|🔬|📚|BLOCO \d+ — /g, "").toLowerCase().split(" ");
              filtered = filtered.filter(q => {
                return blockKeywords.some(kw => kw.length > 3 && (
                  q.text.toLowerCase().includes(kw) ||
                  q.topicName.toLowerCase().includes(kw) ||
                  (q.axis && q.axis.toLowerCase().includes(kw))
                ));
              });
            }
          }
        } else {
          // Further filter by topics/subtopics if selected
          if (selectedTopicName !== "All") {
            filtered = filtered.filter(q => {
              if (selectedSubtopicName !== "All") {
                return q.topicName.toLowerCase().includes(selectedSubtopicName.toLowerCase()) ||
                       selectedSubtopicName.toLowerCase().includes(q.topicName.toLowerCase());
              }
              return q.axis.toLowerCase().includes(selectedTopicName.toLowerCase()) ||
                     q.topicName.toLowerCase().includes(selectedTopicName.toLowerCase());
            });
          }
        }
      } else {
        // Conhecimentos Básicos
        const basicSub = BASIC_SUBJECTS_HIERARCHY.find(b => b.id === activeBasicSubjectId);
        const subjectKey = basicSub ? basicSub.subjectKey : "";

        filtered = combinedPool.filter(q => {
          return q.subject.toLowerCase().includes(subjectKey.toLowerCase()) ||
                 subjectKey.toLowerCase().includes(q.subject.toLowerCase());
        });

        // Filter by block / micro-topic if selected
        if (activeBlockName) {
          if (activeMicroTopicId) {
            const block = basicSub?.blocks.find(b => b.name === activeBlockName);
            const microTopic = block?.microTopics.find(mt => mt.id === activeMicroTopicId);
            if (microTopic) {
              const mtName = microTopic.name.toLowerCase();
              filtered = filtered.filter(q => {
                const textMatch = q.text.toLowerCase().includes(mtName) ||
                                  q.topicName.toLowerCase().includes(mtName) ||
                                  (q.axis && q.axis.toLowerCase().includes(mtName));
                return textMatch;
              });
            }
          } else {
            // Filter by block keywords (excluding generic markup)
            const blockKeywords = activeBlockName.replace(/📚|BLOCO \d+ — /g, "").toLowerCase().split(" ");
            filtered = filtered.filter(q => {
              return blockKeywords.some(kw => kw.length > 3 && (
                q.text.toLowerCase().includes(kw) ||
                q.topicName.toLowerCase().includes(kw) ||
                (q.axis && q.axis.toLowerCase().includes(kw))
              ));
            });
          }
        }
      }
    }

    // 4. If pool is empty or too small, fill it up with dynamic tailored questions to guarantee experience
    if (filtered.length < selectedQuantity) {
      const difference = selectedQuantity - filtered.length;
      
      // Determine what to use for fallback display
      let displaySub = selectedSubject;
      let displaySpec = selectedSpecialty;
      let displayTop = selectedTopicName;
      let displaySubtop = selectedSubtopicName;

      if (!isRandomMode) {
        if (specificCategory === 'basic') {
          const basicSub = BASIC_SUBJECTS_HIERARCHY.find(b => b.id === activeBasicSubjectId);
          displaySub = basicSub ? basicSub.displayName : "Conhecimentos Básicos";
          displaySpec = "";
          
          if (activeBlockName) {
            displayTop = activeBlockName.replace(/📚|BLOCO \d+ — /g, "");
            if (activeMicroTopicId) {
              const block = basicSub?.blocks.find(b => b.name === activeBlockName);
              const microTopic = block?.microTopics.find(mt => mt.id === activeMicroTopicId);
              displaySubtop = microTopic ? microTopic.name : "Geral";
            } else {
              displaySubtop = "Geral";
            }
          } else {
            displayTop = "Geral";
            displaySubtop = "Geral";
          }
        } else if (specificCategory === 'specific' && selectedSpecialty === "Biologia") {
          displaySub = "Conhecimentos Específicos";
          displaySpec = "Biologia";
          
          if (activeBlockName) {
            displayTop = activeBlockName.replace(/🧬|🔬|BLOCO \d+ — /g, "");
            if (activeMicroTopicId) {
              const block = BIOLOGY_COMPLETE_SYLLABUS_BLOCKS.find(b => b.name === activeBlockName);
              const microTopic = block?.microTopics.find(mt => mt.id === activeMicroTopicId);
              displaySubtop = microTopic ? microTopic.name : "Geral";
            } else {
              displaySubtop = "Geral";
            }
          } else {
            displayTop = "Geral";
            displaySubtop = "Geral";
          }
        }
      }

      for (let i = 0; i < difference; i++) {
        const dynamicQ = generateDynamicFallbackQuestion(
          displaySub,
          displaySpec,
          displayTop,
          displaySubtop,
          i
        );
        filtered.push(dynamicQ);
      }
    }

    // 5. Shuffle the selected quantity
    const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, selectedQuantity);

    setActiveQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore({ correct: 0, total: 0 });
    setShowFinished(false);
    setIsConfiguring(false);
  };

  // Quick Preset trigger to matches actual last exam structure
  const handleLoadOfficialPreset = (subject: string, quantity: number) => {
    setIsRandomMode(false);
    setSpecificCategory('basic');
    
    if (subject.includes("Português") || subject.includes("Língua Portuguesa")) {
      setActiveBasicSubjectId('lp');
    } else if (subject.includes("Administração") || subject.includes("Legislação")) {
      setActiveBasicSubjectId('ap');
    } else if (subject.includes("Dados") || subject.includes("Indicadores")) {
      setActiveBasicSubjectId('li');
    } else {
      setActiveBasicSubjectId('eb');
    }

    setActiveBlockName(null);
    setActiveMicroTopicId(null);
    setSelectedQuantity(quantity);
  };

  const activeQuestion = useMemo(() => {
    if (activeQuestions.length === 0 || currentQuestionIndex >= activeQuestions.length) return null;
    return activeQuestions[currentQuestionIndex];
  }, [activeQuestions, currentQuestionIndex]);

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || !activeQuestion || isSubmitted) return;

    setIsSubmitted(true);
    const isCorrect = selectedOption === activeQuestion.correctIndex;
    
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    // Record progress with proper mapped topic ID
    await onSolveQuestion(activeQuestion.topicId, isCorrect);

    if (!isCorrect) {
      await onRecordMistake(activeQuestion, selectedOption);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    
    if (currentQuestionIndex + 1 < activeQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowFinished(true);
    }
  };

  const handleResetSimulator = () => {
    setIsConfiguring(true);
    setActiveQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore({ correct: 0, total: 0 });
    setShowFinished(false);
  };

  return (
    <div id="simulator-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* Configuration View / Question View Panel */}
      <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        
        {isConfiguring ? (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5 text-brand-navy">
                <Sliders className="h-5 w-5 text-brand-green" />
                <h3 className="text-base font-extrabold font-display">Configurar Novo Simulado FUNECE</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Selecione as diretrizes e monte o caderno de exercícios ideal para seu momento de estudo.
              </p>
            </div>

            {/* Mode Selector: Random vs Specific */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest block">1. Escopo de Assuntos do Simulado</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsRandomMode(true)}
                  className={`py-3.5 px-4 border rounded-xl font-bold transition-all text-xs text-center cursor-pointer ${
                    isRandomMode 
                      ? "border-brand-green bg-brand-light-green/45 text-brand-navy ring-1 ring-brand-green/20 font-black shadow-sm" 
                      : "border-slate-100 hover:border-slate-300 text-slate-600 hover:bg-slate-50/50"
                  }`}
                >
                  🎲 Questões de Assuntos Aleatórios
                  <span className="block text-[10px] font-medium text-slate-400 mt-1">Mistura todos os tópicos do edital</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsRandomMode(false)}
                  className={`py-3.5 px-4 border rounded-xl font-bold transition-all text-xs text-center cursor-pointer ${
                    !isRandomMode 
                      ? "border-brand-green bg-brand-light-green/45 text-brand-navy ring-1 ring-brand-green/20 font-black shadow-sm" 
                      : "border-slate-100 hover:border-slate-300 text-slate-600 hover:bg-slate-50/50"
                  }`}
                >
                  🎯 Questões de Assuntos Específicos
                  <span className="block text-[10px] font-medium text-slate-400 mt-1">Foque no conteúdo que você escolher</span>
                </button>
              </div>
            </div>

            {/* Specialty / Basic drilling when Specific is active */}
            {!isRandomMode && (
              <div className="space-y-5 border-t border-slate-50 pt-4 animate-fade-in">
                
                {/* Specific Category selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest block">1.1 Classificação do Assunto</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSpecificCategory('basic')}
                      className={`py-2 px-3 border rounded-lg font-bold transition-all text-xs text-center cursor-pointer ${
                        specificCategory === 'basic' 
                          ? "border-slate-800 bg-slate-900 text-white font-black" 
                          : "border-slate-100 hover:border-slate-200 text-slate-500 hover:bg-slate-50/30"
                      }`}
                    >
                      📚 Conhecimentos Básicos
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpecificCategory('specific')}
                      className={`py-2 px-3 border rounded-lg font-bold transition-all text-xs text-center cursor-pointer ${
                        specificCategory === 'specific' 
                          ? "border-slate-800 bg-slate-900 text-white font-black" 
                          : "border-slate-100 hover:border-slate-200 text-slate-500 hover:bg-slate-50/30"
                      }`}
                    >
                      🔬 Conhecimento Específico
                    </button>
                  </div>
                </div>

                {/* If Conhecimentos Básicos */}
                {specificCategory === 'basic' && (
                  <div className="space-y-4 animate-fade-in bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                    
                    {/* Basic Subjects Choice */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest block">1.2 Escolha a Disciplina Básica</label>
                      <div className="grid grid-cols-2 gap-2">
                        {BASIC_SUBJECTS_HIERARCHY.map((item) => {
                          const isSelected = activeBasicSubjectId === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setActiveBasicSubjectId(item.id);
                                setActiveBlockName(null);
                                setActiveMicroTopicId(null);
                              }}
                              className={`text-left p-3 border rounded-xl font-bold transition-all text-[11px] cursor-pointer flex flex-col justify-between h-16 ${
                                isSelected 
                                  ? "border-brand-green bg-brand-light-green/35 text-brand-navy ring-1 ring-brand-green/10" 
                                  : "border-slate-100 bg-white hover:border-slate-200 text-slate-600 hover:bg-slate-50/50"
                              }`}
                            >
                              <span className="font-extrabold">{item.displayName}</span>
                              <span className="text-[9px] font-semibold text-brand-navy/60 bg-white border border-slate-100 rounded px-1.5 py-0.5 mt-1 self-start">
                                {item.questionsWeight} questões na prova
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Blocks choices */}
                    <div className="space-y-2 animate-fade-in border-t border-slate-100 pt-3">
                      <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest block">1.3 Opções de Microassuntos (Blocos do Edital)</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {BASIC_SUBJECTS_HIERARCHY.find(b => b.id === activeBasicSubjectId)?.blocks.map((block) => {
                          const isSelected = activeBlockName === block.name;
                          return (
                            <button
                              key={block.name}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setActiveBlockName(null);
                                  setActiveMicroTopicId(null);
                                } else {
                                  setActiveBlockName(block.name);
                                  setActiveMicroTopicId(null);
                                }
                              }}
                              className={`text-left p-2.5 border rounded-lg transition-all text-[11px] font-bold cursor-pointer flex items-center justify-between ${
                                isSelected 
                                  ? "border-slate-800 bg-slate-950 text-white" 
                                  : "border-slate-100 bg-white hover:border-slate-200 text-slate-500 hover:bg-slate-50/50"
                              }`}
                            >
                              <span className="line-clamp-1">{block.name}</span>
                              <ChevronRight className={`h-3 w-3 shrink-0 ml-1.5 transition-transform ${isSelected ? "rotate-90 text-white" : "text-slate-400"}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Microtopics Choices inside active block */}
                    {activeBlockName && (
                      <div className="space-y-2 animate-fade-in border-t border-slate-100 pt-3 bg-white p-3 rounded-xl border border-slate-100">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1">
                          1.4 Tópicos Detalhados do Bloco
                        </label>
                        <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                          <button
                            type="button"
                            onClick={() => setActiveMicroTopicId(null)}
                            className={`w-full text-left p-2 text-[10.5px] border rounded transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                              activeMicroTopicId === null
                                ? "bg-brand-green/10 text-brand-navy border-brand-green/30"
                                : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50/50"
                            }`}
                          >
                            🎯 Misturar todos os assuntos deste bloco
                          </button>
                          {BASIC_SUBJECTS_HIERARCHY.find(b => b.id === activeBasicSubjectId)
                            ?.blocks.find(bl => bl.name === activeBlockName)
                            ?.microTopics.map((mt) => {
                              const isSelected = activeMicroTopicId === mt.id;
                              return (
                                <button
                                  key={mt.id}
                                  type="button"
                                  onClick={() => setActiveMicroTopicId(mt.id)}
                                  className={`w-full text-left p-2 text-[10px] border rounded transition-all cursor-pointer font-semibold leading-normal ${
                                    isSelected
                                      ? "bg-brand-green/15 text-brand-navy border-brand-green/40 font-black"
                                      : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                                  }`}
                                >
                                  {mt.name}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* If Conhecimento Específico */}
                {specificCategory === 'specific' && (
                  <div className="space-y-4 animate-fade-in bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                    {/* Specialty selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest block">
                        1.2 Especialidade Alvo
                      </label>
                      {settings?.specialty ? (
                        <div className="flex items-center gap-2.5 bg-brand-light-green/25 border border-brand-green/20 p-3 rounded-xl">
                          <span className="text-base">🧬</span>
                          <div>
                            <p className="text-[11px] font-extrabold text-brand-navy">
                              {settings.specialty}
                            </p>
                            <p className="text-[9px] text-slate-500 font-bold leading-normal">
                              Especialidade vinculada ao seu perfil. Altere nas configurações do perfil se necessário.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                          {specialtiesList.map((spec) => {
                            const isSelected = selectedSpecialty === spec;
                            return (
                              <button
                                key={spec}
                                type="button"
                                onClick={() => handleSpecialtyChange(spec)}
                                className={`text-center py-2 px-1 border rounded-lg font-extrabold transition-all text-[10.5px] cursor-pointer ${
                                  isSelected 
                                    ? "border-brand-green bg-brand-light-green/30 text-brand-navy font-black" 
                                    : "border-slate-100 bg-white hover:border-slate-200 text-slate-500 hover:bg-slate-50/50"
                                }`}
                              >
                                {spec}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {selectedSpecialty === "Biologia" ? (
                      <div className="space-y-4 border-t border-slate-100 pt-3">
                        {/* Biology Blocks choices */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest block mb-1">
                            1.3 Selecione o Bloco de Biologia
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-1">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveBlockName(null);
                                setActiveMicroTopicId(null);
                              }}
                              className={`text-left p-2.5 border rounded-xl font-bold transition-all text-[11px] cursor-pointer flex items-center gap-2 ${
                                activeBlockName === null 
                                  ? "border-brand-green bg-brand-light-green/30 text-brand-navy font-black shadow-sm" 
                                  : "border-slate-100 bg-white hover:border-slate-200 text-slate-500 hover:bg-slate-50"
                              }`}
                            >
                              🍀 Misturar todas as questões de Biologia
                            </button>
                            {BIOLOGY_COMPLETE_SYLLABUS_BLOCKS.map((block) => {
                              const isSelected = activeBlockName === block.name;
                              return (
                                <button
                                  key={block.name}
                                  type="button"
                                  onClick={() => {
                                    setActiveBlockName(block.name);
                                    setActiveMicroTopicId(null);
                                  }}
                                  className={`text-left p-2.5 border rounded-xl font-bold transition-all text-[10.5px] cursor-pointer flex items-center justify-between gap-2 leading-relaxed ${
                                    isSelected 
                                      ? "border-brand-green bg-brand-light-green/30 text-brand-navy font-black shadow-sm" 
                                      : "border-slate-100 bg-white hover:border-slate-200 text-slate-600 hover:bg-slate-50"
                                  }`}
                                >
                                  <span>{block.name}</span>
                                  <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-mono font-bold">
                                    {block.microTopics.length} tópicos
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Biology Microtopics choices */}
                        {activeBlockName && (
                          <div className="space-y-2 animate-fade-in border-t border-slate-100 pt-3 bg-white p-3 rounded-xl border border-slate-100">
                            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1">
                              1.4 Tópicos Detalhados do Bloco
                            </label>
                            <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                              <button
                                type="button"
                                onClick={() => setActiveMicroTopicId(null)}
                                className={`w-full text-left p-2 text-[10.5px] border rounded transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                                  activeMicroTopicId === null
                                    ? "bg-brand-green/10 text-brand-navy border-brand-green/30"
                                    : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50/50"
                                }`}
                              >
                                🎯 Misturar todos os assuntos deste bloco
                              </button>
                              {BIOLOGY_COMPLETE_SYLLABUS_BLOCKS.find((b) => b.name === activeBlockName)
                                ?.microTopics.map((mt) => {
                                  const isSelected = activeMicroTopicId === mt.id;
                                  return (
                                    <button
                                      key={mt.id}
                                      type="button"
                                      onClick={() => setActiveMicroTopicId(mt.id)}
                                      className={`w-full text-left p-2 text-[10px] border rounded transition-all cursor-pointer font-semibold leading-normal ${
                                        isSelected
                                          ? "bg-brand-green/15 text-brand-navy border-brand-green/40 font-black"
                                          : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                                      }`}
                                    >
                                      {mt.name}
                                    </button>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Topic and subtopic selections */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest block">1.3 Eixo Temático</label>
                          <select
                            value={selectedTopicName}
                            onChange={(e) => handleTopicChange(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold focus:outline-none text-slate-700"
                          >
                            <option value="All">Misturar eixos temáticos de {selectedSpecialty}</option>
                            {topicsList.map((topic) => (
                              <option key={topic.name} value={topic.name}>{topic.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest block">1.4 Assunto Específico</label>
                          <select
                            disabled={selectedTopicName === "All" || subtopicsList.length === 0}
                            value={selectedSubtopicName}
                            onChange={(e) => setSelectedSubtopicName(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold focus:outline-none text-slate-700 disabled:opacity-50 disabled:bg-slate-50"
                          >
                            <option value="All">Selecione para detalhar ou misturar</option>
                            {subtopicsList.map((sub) => (
                              <option key={sub} value={sub}>{sub}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Quantity selection */}
            <div className="space-y-2 border-t border-slate-50 pt-4">
              <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest block">2. Quantidade de Questões</label>
              <div className="flex items-center gap-2">
                {[5, 10, 15, 20, 50].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setSelectedQuantity(qty)}
                    className={`flex-1 py-2 border rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                      selectedQuantity === qty 
                        ? "bg-brand-navy text-white border-brand-navy" 
                        : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleStartSimulation}
                className="px-8 py-3 bg-brand-green hover:bg-brand-green/95 text-white font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <Play className="h-4 w-4 fill-white" /> Gerar Caderno de Questões
              </button>
            </div>
          </div>
        ) : showFinished ? (
          <div className="text-center py-8 space-y-6 flex-1 flex flex-col items-center justify-center">
            <div className="inline-flex p-4 bg-brand-light-green text-brand-green border border-brand-green/10 rounded-3xl animate-bounce">
              <Award className="h-10 w-10" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-brand-navy font-display">Simulado Concluído com Sucesso!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                Você respondeu todas as questões selecionadas. Seus dados de desempenho foram integrados com seu mapa de estudos.
              </p>
            </div>

            {/* Scorecard */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl max-w-xs w-full grid grid-cols-2 gap-4 text-xs font-semibold">
              <div className="text-center space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Acertos</span>
                <p className="text-lg font-extrabold text-brand-green">{score.correct} / {score.total}</p>
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Aproveitamento</span>
                <p className="text-lg font-extrabold text-brand-navy">
                  {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleResetSimulator}
                className="px-6 py-2.5 bg-brand-navy hover:bg-brand-navy/95 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <RotateCcw className="h-4 w-4" /> Novo Simulado
              </button>
            </div>
          </div>
        ) : activeQuestion ? (
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Question Header Metadata */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none">
                    {selectedSubject} {selectedSpecialty ? `— ${selectedSpecialty}` : ""}
                  </span>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-[10px] font-extrabold text-brand-navy bg-brand-light-navy border border-brand-navy/5 px-2.5 py-0.5 rounded-full">
                      Questão {currentQuestionIndex + 1} de {activeQuestions.length}
                    </span>
                    <span className="text-[10px] font-extrabold text-brand-green bg-brand-light-green border border-brand-green/10 px-2 py-0.5 rounded-full">
                      Banca {activeQuestion.examBoard} ({activeQuestion.year})
                    </span>
                  </div>
                </div>
                
                {/* Score badge */}
                <div className="text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Rendimento</span>
                  <span className="text-xs font-extrabold text-brand-navy mt-1 block">{score.correct} acertos de {score.total}</span>
                </div>
              </div>

              {/* Question Content */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-brand-navy bg-brand-light-navy/50 px-2 py-1.5 rounded-md border border-brand-navy/5 line-clamp-1">
                  Tópico do Simulado: {activeQuestion.topicName}
                </p>
                <p className="text-xs md:text-sm font-bold text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {activeQuestion.text}
                </p>
              </div>

              {/* Options list */}
              <div className="space-y-2.5 mt-4">
                {activeQuestion.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx); // A, B, C, D
                  const isSelected = selectedOption === idx;
                  
                  let optionClass = "border-slate-100 bg-white hover:bg-slate-50/50 hover:border-slate-300";
                  let prefixClass = "bg-slate-100 text-slate-600";

                  if (isSelected) {
                    optionClass = "border-brand-navy bg-brand-light-navy/30 ring-1 ring-brand-navy/15";
                    prefixClass = "bg-brand-navy text-white";
                  }

                  if (isSubmitted) {
                    if (idx === activeQuestion.correctIndex) {
                      optionClass = "border-brand-green bg-brand-light-green/60 ring-1 ring-brand-green/20 text-brand-green";
                      prefixClass = "bg-brand-green text-white";
                    } else if (isSelected) {
                      optionClass = "border-rose-400 bg-rose-50 ring-1 ring-rose-400/40 text-rose-700";
                      prefixClass = "bg-rose-500 text-white";
                    } else {
                      optionClass = "border-slate-100 bg-white opacity-55 cursor-not-allowed";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-3 border rounded-xl flex items-start gap-3 transition-all text-xs font-semibold cursor-pointer ${optionClass}`}
                    >
                      <div className={`w-6 h-6 rounded-lg font-extrabold text-xs flex items-center justify-center flex-shrink-0 transition-colors ${prefixClass}`}>
                        {letter}
                      </div>
                      <span className="text-slate-700 leading-relaxed pt-0.5">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer feedbacks & Explanations */}
            {isSubmitted && (
              <div className="p-4 bg-brand-light-navy/30 border border-brand-navy/5 rounded-2xl space-y-2 mt-4 animate-fade-in text-xs">
                <div className="flex items-center gap-2">
                  {selectedOption === activeQuestion.correctIndex ? (
                    <div className="flex items-center gap-1.5 font-extrabold text-brand-green">
                      <CheckCircle2 className="h-4.5 w-4.5" />
                      <span>Resposta Correta! Excelente!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 font-extrabold text-rose-600">
                      <XCircle className="h-4.5 w-4.5" />
                      <span>Incorreto. Adicionado ao Caderno de Erros.</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1 border-t border-brand-navy/5 pt-2">
                  <span className="font-extrabold text-brand-navy uppercase text-[9px] tracking-wider block">Gabarito Comentado do Professor</span>
                  <p className="text-slate-500 leading-relaxed font-semibold">{activeQuestion.explanation}</p>
                </div>
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
              <button
                onClick={handleResetSimulator}
                className="px-4 py-2 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" /> Cancelar
              </button>

              <div>
                {!isSubmitted ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={handleSubmitAnswer}
                    className="px-6 py-2.5 bg-brand-navy hover:bg-brand-navy/95 disabled:bg-brand-light-navy disabled:text-slate-400 text-white font-bold rounded-xl text-xs shadow-xs hover:shadow-sm cursor-pointer active:scale-95 transition-all"
                  >
                    Responder Questão
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-brand-green hover:bg-brand-green/95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    {currentQuestionIndex + 1 < activeQuestions.length ? "Próxima Questão" : "Finalizar Simulado"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Side Info Panel Column */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Previous Exam Distributions Quick Presets */}
        <div className="bg-brand-light-navy/70 border border-brand-navy/10 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <BookMarked className="h-4 w-4 text-brand-green" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy font-display">Preséts da Última Prova</h3>
          </div>
          
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Selecione uma das distribuições oficiais de disciplinas com base na última prova aplicada pela FUNECE:
          </p>

          <div className="space-y-2 font-semibold">
            <button
              onClick={() => handleLoadOfficialPreset("Educação Brasileira — Temas Educacionais e Pedagógicos", 8)}
              className="w-full p-2.5 bg-white border border-brand-navy/5 hover:border-brand-green/20 hover:bg-brand-light-green/10 rounded-xl text-[11px] text-slate-600 flex items-center justify-between text-left cursor-pointer transition-all"
            >
              <span>Educação Brasileira</span>
              <span className="px-2 py-0.5 bg-brand-light-navy text-brand-navy rounded-md font-extrabold text-[10px]">8 Questões</span>
            </button>
            <button
              onClick={() => handleLoadOfficialPreset("Administração Pública", 6)}
              className="w-full p-2.5 bg-white border border-brand-navy/5 hover:border-brand-green/20 hover:bg-brand-light-green/10 rounded-xl text-[11px] text-slate-600 flex items-center justify-between text-left cursor-pointer transition-all"
            >
              <span>Administração Pública</span>
              <span className="px-2 py-0.5 bg-brand-light-navy text-brand-navy rounded-md font-extrabold text-[10px]">6 Questões</span>
            </button>
            <button
              onClick={() => handleLoadOfficialPreset("Língua Portuguesa", 8)}
              className="w-full p-2.5 bg-white border border-brand-navy/5 hover:border-brand-green/20 hover:bg-brand-light-green/10 rounded-xl text-[11px] text-slate-600 flex items-center justify-between text-left cursor-pointer transition-all"
            >
              <span>Língua Portuguesa</span>
              <span className="px-2 py-0.5 bg-brand-light-navy text-brand-navy rounded-md font-extrabold text-[10px]">8 Questões</span>
            </button>
            <button
              onClick={() => handleLoadOfficialPreset("Leitura e Interpretação de Dados e Indicadores Educacionais", 8)}
              className="w-full p-2.5 bg-white border border-brand-navy/5 hover:border-brand-green/20 hover:bg-brand-light-green/10 rounded-xl text-[11px] text-slate-600 flex items-center justify-between text-left cursor-pointer transition-all"
            >
              <span>Indicadores Educacionais</span>
              <span className="px-2 py-0.5 bg-brand-light-navy text-brand-navy rounded-md font-extrabold text-[10px]">8 Questões</span>
            </button>
            <button
              onClick={() => handleLoadOfficialPreset("Conhecimentos Específicos", 50)}
              className="w-full p-2.5 bg-white border border-brand-navy/5 hover:border-brand-green/20 hover:bg-brand-light-green/10 rounded-xl text-[11px] text-slate-600 flex items-center justify-between text-left cursor-pointer transition-all"
            >
              <span>Conhecimentos Específicos</span>
              <span className="px-2 py-0.5 bg-brand-light-navy text-brand-navy rounded-md font-extrabold text-[10px]">50 Questões</span>
            </button>
          </div>
        </div>

        {/* FUNECE Pedagogy Advice */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="text-[10px] font-bold text-brand-navy uppercase tracking-wider font-display">Didática de Simulados</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Estudos estatísticos indicam que treinar por tópicos específicos de forma isolada consolida a memória de curto prazo, enquanto misturar os temas da mesma matéria simula a alternância de raciocínio cobrada na prova real de concurso. Use as duas abordagens de forma estratégica!
          </p>
        </div>

      </div>

    </div>
  );
}
