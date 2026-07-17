import { CONTENT_HIERARCHY } from "../components/questionsBank";

export interface SyllabusMicroTopic {
  id: string;
  name: string;
  relevance: 'crucial' | 'high' | 'medium' | 'low';
  importanceScore: number;
}

export interface SyllabusBlock {
  name: string;
  microTopics: SyllabusMicroTopic[];
}

export interface SyllabusSubject {
  id: string;
  displayName: string;
  subjectKey: string;
  blocks: SyllabusBlock[];
}

// 100% Complete static definition of Basic Subjects Syllabus as mapped in the Question Simulator
export const BASIC_SUBJECTS_SYLLABUS: SyllabusSubject[] = [
  {
    id: "eb",
    displayName: "Educação Brasileira",
    subjectKey: "Educação Brasileira — Temas Educacionais e Pedagógicos",
    blocks: [
      {
        name: "📚 BLOCO 1 — FUNDAMENTOS DA EDUCAÇÃO E ASPECTOS HISTÓRICOS",
        microTopics: [
          { id: "eb-1-1", name: "História do Pensamento Pedagógico Brasileiro e Correntes de Pensamento", relevance: "crucial", importanceScore: 95 },
          { id: "eb-1-2", name: "Políticas Públicas para a Educação Básica e Rumos do Ensino Médio", relevance: "high", importanceScore: 87 },
          { id: "eb-1-3", name: "Aspectos Legais e Políticos da Organização da Educação Brasileira", relevance: "high", importanceScore: 85 }
        ]
      },
      {
        name: "📚 BLOCO 2 — TEORIAS DA APRENDIZAGEM E DESENVOLVIMENTO",
        microTopics: [
          { id: "eb-2-1", name: "Jean Piaget: Desenvolvimento Cognitivo e Psicologia Escolar", relevance: "crucial", importanceScore: 92 },
          { id: "eb-2-2", name: "Lev Vygotsky: Mediação Sócio-Histórica e Zona de Desenvolvimento Proximal (ZDP)", relevance: "crucial", importanceScore: 94 },
          { id: "eb-2-3", name: "Henri Wallon: Afetividade, Movimento e Inteligência no Desenvolvimento Humano", relevance: "medium", importanceScore: 78 },
          { id: "eb-2-4", name: "Teoria das Inteligências Múltiplas (Gardner) e Psicogênese da Língua Escrita (Emília Ferreiro)", relevance: "high", importanceScore: 86 }
        ]
      },
      {
        name: "📚 BLOCO 3 — DIDÁTICA, PLANEJAMENTO E AVALIAÇÃO",
        microTopics: [
          { id: "eb-3-1", name: "Didática como Fundamento Epistemológico e Organização do Ensino", relevance: "high", importanceScore: 88 },
          { id: "eb-3-2", name: "Planejamento Didático: Objetivos, Conteúdos, Metodologias e Recursos", relevance: "crucial", importanceScore: 91 },
          { id: "eb-3-3", name: "Avaliação da Aprendizagem: Diagnóstica, Formativa e Somativa", relevance: "crucial", importanceScore: 96 },
          { id: "eb-3-4", name: "Tendências Pedagógicas na Prática Escolar: Liberais e Progressistas", relevance: "crucial", importanceScore: 95 }
        ]
      },
      {
        name: "📚 BLOCO 4 — GESTÃO ESCOLAR E TEMAS CONTEMPORÂNEOS",
        microTopics: [
          { id: "eb-4-1", name: "Projeto Político Pedagógico (PPP): Concepção, Elaboração e Avaliação", relevance: "high", importanceScore: 89 },
          { id: "eb-4-2", name: "Temas Contemporâneos: Bullying, Relações de Gênero, Família e Diversidade", relevance: "medium", importanceScore: 74 },
          { id: "eb-4-3", name: "Educação Inclusiva, AEE e os Desafios do Ensino Médio Integrado", relevance: "high", importanceScore: 84 }
        ]
      }
    ]
  },
  {
    id: "ap",
    displayName: "Administração Pública",
    subjectKey: "Administração Pública",
    blocks: [
      {
        name: "📚 BLOCO 1 — ADMINISTRAÇÃO PÚBLICA E SERVIDOR PÚBLICO",
        microTopics: [
          { id: "ap-1-1", name: "1. Conceito de Administração Pública", relevance: "high", importanceScore: 82 },
          { id: "ap-1-2", name: "2. Conceito de Servidor Público", relevance: "medium", importanceScore: 76 },
          { id: "ap-1-3", name: "3. Princípios da Administração Pública", relevance: "crucial", importanceScore: 96 },
          { id: "ap-1-4", name: "4. Direitos e deveres dos servidores públicos", relevance: "high", importanceScore: 88 },
          { id: "ap-1-5", name: "5. Responsabilidade dos servidores públicos", relevance: "medium", importanceScore: 75 }
        ]
      },
      {
        name: "📚 BLOCO 2 — SERVIDOR PÚBLICO ESTADUAL DO CEARÁ",
        microTopics: [
          { id: "ap-2-1", name: "6. Estatuto dos Funcionários Públicos Civis do Estado do Ceará (Lei nº 9.826/1974)", relevance: "crucial", importanceScore: 92 },
          { id: "ap-2-2", name: "6.1 Provimento dos cargos (Capítulo I ao X)", relevance: "high", importanceScore: 84 },
          { id: "ap-2-3", name: "6.2 Direitos, vantagens e autorizações (Capítulo I ao VI)", relevance: "high", importanceScore: 85 },
          { id: "ap-2-4", name: "6.3 Regime disciplinar (Título VI, Capítulo I ao VII)", relevance: "crucial", importanceScore: 90 },
          { id: "ap-2-5", name: "7. Lei nº 15.243/2012 (Disciplina o art. 3º da Lei nº 15.064/2011)", relevance: "medium", importanceScore: 78 },
          { id: "ap-2-6", name: "8. Estágio Probatório do Servidor Estadual (8.1 Lei nº 9.826/1974, 8.2 Lei nº 13.092/2001, 8.3 Lei nº 15.744/2014, 8.4 Lei nº 15.909/2015)", relevance: "high", importanceScore: 83 }
        ]
      },
      {
        name: "📚 BLOCO 3 — CARREIRA DO MAGISTÉRIO DO CEARÁ",
        microTopics: [
          { id: "ap-3-1", name: "9. Carreira do Magistério (Concurso, Provimento, Carga horária, Jornada) - Lei nº 10.884/1984, Lei nº 12.066/1993, Lei nº 14.404/2009", relevance: "crucial", importanceScore: 91 },
          { id: "ap-3-2", name: "10. Ampliação da carga horária de trabalho do Grupo MAG (Lei nº 15.451/2013, Decreto nº 31.458/2014)", relevance: "high", importanceScore: 84 },
          { id: "ap-3-3", name: "11. Promoção dos profissionais do Grupo MAG (Lei nº 15.901/2015, Decreto nº 32.103/2016)", relevance: "high", importanceScore: 86 },
          { id: "ap-3-4", name: "12. Sistema remuneratório dos profissionais MAG de nível superior (Lei nº 15.243/2012, Lei nº 15.901/2015, Lei nº 16.104/2016, Lei nº 16.513/2018, Lei nº 16.536/2018)", relevance: "high", importanceScore: 87 }
        ]
      },
      {
        name: "📚 BLOCO 4 — LEGISLAÇÃO BÁSICA DA EDUCAÇÃO",
        microTopics: [
          { id: "ap-4-1", name: "13. Lei de Diretrizes e Bases da Educação Nacional — LDB (Lei nº 9.394/1996 e alterações)", relevance: "crucial", importanceScore: 98 },
          { id: "ap-4-2", name: "14. Estatuto da Criança e do Adolescente — ECA (Lei nº 8.069/1990 e alterações)", relevance: "high", importanceScore: 87 },
          { id: "ap-4-3", name: "15. Constituição Federal — Educação (Artigos 205 a 214)", relevance: "crucial", importanceScore: 93 },
          { id: "ap-4-4", name: "16. Emenda Constitucional nº 53/2006", relevance: "medium", importanceScore: 72 },
          { id: "ap-4-5", name: "17. Lei nº 11.494/2007 e alterações", relevance: "high", importanceScore: 81 },
          { id: "ap-4-6", name: "18. Lei nº 11.114/2005", relevance: "low", importanceScore: 65 },
          { id: "ap-4-7", name: "19. Lei nº 11.274/2006", relevance: "low", importanceScore: 66 },
          { id: "ap-4-8", name: "20. Lei nº 13.415/2017", relevance: "high", importanceScore: 85 },
          { id: "ap-4-9", name: "21. Plano Nacional de Educação — PNE (Lei Federal nº 13.005/2014)", relevance: "high", importanceScore: 84 },
          { id: "ap-4-10", name: "22. Plano Estadual de Educação do Ceará — PEE (Lei Estadual nº 16.025/2016)", relevance: "high", importanceScore: 82 }
        ]
      }
    ]
  },
  {
    id: "lp",
    displayName: "Língua Portuguesa",
    subjectKey: "Língua Portuguesa",
    blocks: [
      {
        name: "📚 BLOCO 1 — LEITURA E COMPREENSÃO DE TEXTO",
        microTopics: [
          { id: "lp-1-1", name: "Compreensão e Interpretação de Textos Literários e Não-Literários", relevance: "crucial", importanceScore: 98 },
          { id: "lp-1-2", name: "Tipologia Textual, Gêneros Discursivos e Coesão/Coerência", relevance: "crucial", importanceScore: 95 }
        ]
      },
      {
        name: "📚 BLOCO 2 — MORFOSSINTAXE DA ORAÇÃO E DO PERÍODO",
        microTopics: [
          { id: "lp-2-1", name: "Emprego das Classes de Palavras (Substantivo, Pronome, Verbo, etc.)", relevance: "high", importanceScore: 88 },
          { id: "lp-2-2", name: "Sintaxe da Oração: Termos Essenciais, Integrantes e Acessórios", relevance: "high", importanceScore: 85 },
          { id: "lp-2-3", name: "Período Composto por Coordenação e Subordinação", relevance: "high", importanceScore: 86 }
        ]
      },
      {
        name: "📚 BLOCO 3 — CONCORDÂNCIA, REGÊNCIA E CRASE",
        microTopics: [
          { id: "lp-3-1", name: "Concordância Verbal e Nominal", relevance: "crucial", importanceScore: 92 },
          { id: "lp-3-2", name: "Regência Verbal e Nominal", relevance: "high", importanceScore: 89 },
          { id: "lp-3-3", name: "Uso do Sinal Indicativo de Crase", relevance: "crucial", importanceScore: 94 }
        ]
      },
      {
        name: "📚 BLOCO 4 — ORTOGRAFIA, PONTUAÇÃO E SEMÂNTICA",
        microTopics: [
          { id: "lp-4-1", name: "Ortografia Oficial, Acentuação Gráfica e Pontuação (Emprego da vírgula)", relevance: "high", importanceScore: 87 },
          { id: "lp-4-2", name: "Significação das palavras: Sinonímia, Antonímia, Homonímia, Paronímia", relevance: "medium", importanceScore: 78 }
        ]
      }
    ]
  },
  {
    id: "li",
    displayName: "Leitura e Interpretação de Dados e Indicadores",
    subjectKey: "Leitura e Interpretação de Dados e Indicadores Educacionais",
    blocks: [
      {
        name: "📚 BLOCO 1 — FLUXO ESCOLAR E MATRÍCULAS",
        microTopics: [
          { id: "li-1-1", name: "Indicadores de Matrícula, Taxa de Escolarização Bruta e Líquida", relevance: "high", importanceScore: 86 },
          { id: "li-1-2", name: "Taxas de Rendimento Escolar: Aprovação, Reprovação e Abandono/Evasão", relevance: "crucial", importanceScore: 95 },
          { id: "li-1-3", name: "Cálculo e Análise da Distorção Idade-Série no Ensino Médio", relevance: "high", importanceScore: 88 }
        ]
      },
      {
        name: "📚 BLOCO 2 — AVALIAÇÕES DO SISTEMA EDUCACIONAL",
        microTopics: [
          { id: "li-2-1", name: "SPAECE (Sistema Permanente de Avaliação do Ceará) e Escalas de Proficiência", relevance: "crucial", importanceScore: 94 },
          { id: "li-2-2", name: "Saeb, Prova Brasil, IDEB (Metodologia e Metas) e o PISA", relevance: "crucial", importanceScore: 96 }
        ]
      },
      {
        name: "📚 BLOCO 3 — ANÁLISE DE GRÁFICOS E TABELAS ESTATÍSTICAS",
        microTopics: [
          { id: "li-3-1", name: "Interpretação de Gráficos (Barras, Linhas, Setores) e Mapas Educacionais", relevance: "high", importanceScore: 89 },
          { id: "li-3-2", name: "Resolução de Problemas Matemáticos com Porcentagem sobre Indicadores", relevance: "high", importanceScore: 85 }
        ]
      }
    ]
  }
];

// Comprehensive 100% complete syllabus blocks for BIOLOGY (Biologia) as requested by the user
export const BIOLOGY_COMPLETE_SYLLABUS_BLOCKS: SyllabusBlock[] = [
  {
    name: "🧬 BLOCO 1 — IDENTIDADE DOS SERES VIVOS E BIOLOGIA CELULAR",
    microTopics: [
      { id: "bio-1-1", name: "1. Identidade dos seres vivos", relevance: "crucial", importanceScore: 95 },
      { id: "bio-1-2", name: "1.1 Aspectos físicos, químicos e estruturais da célula", relevance: "crucial", importanceScore: 94 },
      { id: "bio-1-3", name: "Composição química da célula", relevance: "high", importanceScore: 88 },
      { id: "bio-1-4", name: "Água e sais minerais", relevance: "medium", importanceScore: 78 },
      { id: "bio-1-5", name: "Carboidratos", relevance: "high", importanceScore: 85 },
      { id: "bio-1-6", name: "Lipídios", relevance: "high", importanceScore: 84 },
      { id: "bio-1-7", name: "Proteínas", relevance: "crucial", importanceScore: 92 },
      { id: "bio-1-8", name: "Ácidos nucleicos", relevance: "crucial", importanceScore: 96 },
      { id: "bio-1-9", name: "Estrutura celular", relevance: "high", importanceScore: 87 },
      { id: "bio-1-10", name: "Membrana plasmática", relevance: "crucial", importanceScore: 93 },
      { id: "bio-1-11", name: "Citoplasma", relevance: "high", importanceScore: 82 },
      { id: "bio-1-12", name: "Material genético", relevance: "crucial", importanceScore: 95 },
      { id: "bio-1-13", name: "1.2 Organelas celulares", relevance: "crucial", importanceScore: 94 },
      { id: "bio-1-14", name: "Ribossomos", relevance: "high", importanceScore: 89 },
      { id: "bio-1-15", name: "Retículo endoplasmático", relevance: "high", importanceScore: 85 },
      { id: "bio-1-16", name: "Complexo golgiense", relevance: "high", importanceScore: 88 },
      { id: "bio-1-17", name: "Lisossomos", relevance: "crucial", importanceScore: 91 },
      { id: "bio-1-18", name: "Peroxissomos", relevance: "medium", importanceScore: 75 },
      { id: "bio-1-19", name: "Mitocôndrias", relevance: "crucial", importanceScore: 96 },
      { id: "bio-1-20", name: "Cloroplastos", relevance: "high", importanceScore: 89 },
      { id: "bio-1-21", name: "Centríolos", relevance: "medium", importanceScore: 74 },
      { id: "bio-1-22", name: "Vacúolos", relevance: "medium", importanceScore: 72 },
      { id: "bio-1-23", name: "Citoesqueleto", relevance: "high", importanceScore: 81 },
      { id: "bio-1-24", name: "1.3 Organização celular", relevance: "high", importanceScore: 86 },
      { id: "bio-1-25", name: "Seres procariontes", relevance: "crucial", importanceScore: 90 },
      { id: "bio-1-26", name: "Seres eucariontes", relevance: "crucial", importanceScore: 91 },
      { id: "bio-1-27", name: "Seres acelulares/sem organização celular", relevance: "high", importanceScore: 87 },
      { id: "bio-1-28", name: "1.4 Funções celulares", relevance: "high", importanceScore: 85 },
      { id: "bio-1-29", name: "1.4.1 Síntese de substâncias", relevance: "high", importanceScore: 88 },
      { id: "bio-1-30", name: "Síntese proteica", relevance: "crucial", importanceScore: 95 },
      { id: "bio-1-31", name: "Transcrição", relevance: "crucial", importanceScore: 92 },
      { id: "bio-1-32", name: "Tradução", relevance: "crucial", importanceScore: 93 },
      { id: "bio-1-33", name: "1.4.2 Transporte de substâncias", relevance: "crucial", importanceScore: 94 },
      { id: "bio-1-34", name: "Transporte passivo", relevance: "high", importanceScore: 89 },
      { id: "bio-1-35", name: "Difusão", relevance: "high", importanceScore: 84 },
      { id: "bio-1-36", name: "Osmose", relevance: "crucial", importanceScore: 92 },
      { id: "bio-1-37", name: "Transporte ativo", relevance: "crucial", importanceScore: 91 },
      { id: "bio-1-38", name: "Endocitose", relevance: "medium", importanceScore: 78 },
      { id: "bio-1-39", name: "Fagocitose", relevance: "high", importanceScore: 85 },
      { id: "bio-1-40", name: "Pinocitose", relevance: "medium", importanceScore: 74 },
      { id: "bio-1-41", name: "Exocitose", relevance: "medium", importanceScore: 76 },
      { id: "bio-1-42", name: "1.4.3 Eliminação de substâncias", relevance: "medium", importanceScore: 73 },
      { id: "bio-1-43", name: "1.4.4 Obtenção de energia", relevance: "crucial", importanceScore: 96 },
      { id: "bio-1-44", name: "Fermentação", relevance: "high", importanceScore: 85 },
      { id: "bio-1-45", name: "Fotossíntese", relevance: "crucial", importanceScore: 94 },
      { id: "bio-1-46", name: "Respiração celular", relevance: "crucial", importanceScore: 96 },
      { id: "bio-1-47", name: "1.5 Ciclo celular", relevance: "crucial", importanceScore: 93 },
      { id: "bio-1-48", name: "Interfase", relevance: "high", importanceScore: 85 },
      { id: "bio-1-49", name: "Mitose", relevance: "crucial", importanceScore: 95 },
      { id: "bio-1-50", name: "Meiose", relevance: "crucial", importanceScore: 96 },
      { id: "bio-1-51", name: "Controle do ciclo celular", relevance: "high", importanceScore: 84 }
    ]
  },
  {
    name: "🔬 BLOCO 2 — MICROSCOPIA",
    microTopics: [
      { id: "bio-2-1", name: "2. Noções básicas de microscopia", relevance: "high", importanceScore: 81 },
      { id: "bio-2-2", name: "2.1 Tipos de microscopia", relevance: "medium", importanceScore: 74 },
      { id: "bio-2-3", name: "2.2 Microscópio óptico", relevance: "high", importanceScore: 83 },
      { id: "bio-2-4", name: "2.3 Partes e funções do microscópio", relevance: "high", importanceScore: 85 },
      { id: "bio-2-5", name: "2.4 Aumento e resolução", relevance: "medium", importanceScore: 78 },
      { id: "bio-2-6", name: "2.5 Preparação de lâminas", relevance: "medium", importanceScore: 75 },
      { id: "bio-2-7", name: "2.6 Observação e interpretação de imagens microscópicas", relevance: "high", importanceScore: 82 }
    ]
  },
  {
    name: "🌎 BLOCO 3 — ORIGEM E EVOLUÇÃO DA VIDA",
    microTopics: [
      { id: "bio-3-1", name: "3. Origem e evolução da vida", relevance: "crucial", importanceScore: 94 },
      { id: "bio-3-2", name: "3.1 Hipóteses sobre a origem da vida", relevance: "high", importanceScore: 89 },
      { id: "bio-3-3", name: "Abiogênese", relevance: "high", importanceScore: 86 },
      { id: "bio-3-4", name: "Biogênese", relevance: "high", importanceScore: 88 },
      { id: "bio-3-5", name: "Panspermia", relevance: "medium", importanceScore: 72 },
      { id: "bio-3-6", name: "Evolução química", relevance: "high", importanceScore: 87 },
      { id: "bio-3-7", name: "Experimentos relacionados à origem da vida", relevance: "crucial", importanceScore: 91 },
      { id: "bio-3-8", name: "3.2 Teorias evolutivas", relevance: "crucial", importanceScore: 96 },
      { id: "bio-3-9", name: "3.2.1 Teoria de Lamarck", relevance: "high", importanceScore: 85 },
      { id: "bio-3-10", name: "Lei do uso e desuso", relevance: "medium", importanceScore: 79 },
      { id: "bio-3-11", name: "Herança dos caracteres adquiridos", relevance: "medium", importanceScore: 78 },
      { id: "bio-3-12", name: "3.2.2 Teoria de Darwin", relevance: "crucial", importanceScore: 97 },
      { id: "bio-3-13", name: "Seleção natural", relevance: "crucial", importanceScore: 98 },
      { id: "bio-3-14", name: "Variabilidade", relevance: "high", importanceScore: 89 },
      { id: "bio-3-15", name: "Adaptação", relevance: "high", importanceScore: 88 },
      { id: "bio-3-16", name: "3.3 Origem do homem", relevance: "high", importanceScore: 85 },
      { id: "bio-3-17", name: "Evolução humana", relevance: "high", importanceScore: 86 },
      { id: "bio-3-18", name: "Principais hominídeos", relevance: "medium", importanceScore: 75 },
      { id: "bio-3-19", name: "Processo de hominização", relevance: "medium", importanceScore: 78 },
      { id: "bio-3-20", name: "Relações evolutivas do gênero Homo", relevance: "high", importanceScore: 84 }
    ]
  },
  {
    name: "🦠 BLOCO 4 — DIVERSIDADE DA VIDA E BIODIVERSIDADE",
    microTopics: [
      { id: "bio-4-1", name: "4. Diversidade da vida", relevance: "high", importanceScore: 88 },
      { id: "bio-4-2", name: "4.1 Domínios da vida", relevance: "high", importanceScore: 85 },
      { id: "bio-4-3", name: "Bacteria", relevance: "medium", importanceScore: 79 },
      { id: "bio-4-4", name: "Archaea", relevance: "low", importanceScore: 68 },
      { id: "bio-4-5", name: "Eukarya", relevance: "medium", importanceScore: 78 },
      { id: "bio-4-6", name: "4.2 Reinos da natureza", relevance: "crucial", importanceScore: 93 },
      { id: "bio-4-7", name: "Monera", relevance: "high", importanceScore: 87 },
      { id: "bio-4-8", name: "Protista", relevance: "high", importanceScore: 85 },
      { id: "bio-4-9", name: "Fungi", relevance: "high", importanceScore: 86 },
      { id: "bio-4-10", name: "Plantae", relevance: "crucial", importanceScore: 92 },
      { id: "bio-4-11", name: "Animalia", relevance: "crucial", importanceScore: 94 },
      { id: "bio-4-12", name: "4.3 Características dos grupos biológicos", relevance: "high", importanceScore: 88 },
      { id: "bio-4-13", name: "Estrutura celular", relevance: "medium", importanceScore: 78 },
      { id: "bio-4-14", name: "Nutrição", relevance: "high", importanceScore: 84 },
      { id: "bio-4-15", name: "Reprodução", relevance: "high", importanceScore: 85 },
      { id: "bio-4-16", name: "Organização corporal", relevance: "medium", importanceScore: 76 },
      { id: "bio-4-17", name: "Principais representantes", relevance: "high", importanceScore: 84 },
      { id: "bio-4-18", name: "4.4 Regras de nomenclatura biológica", relevance: "crucial", importanceScore: 95 },
      { id: "bio-4-19", name: "Nomenclatura binomial", relevance: "crucial", importanceScore: 96 },
      { id: "bio-4-20", name: "Regras de escrita dos nomes científicos", relevance: "crucial", importanceScore: 96 },
      { id: "bio-4-21", name: "Categorias taxonômicas", relevance: "high", importanceScore: 89 },
      { id: "bio-4-22", name: "4.5 Biodiversidade no planeta", relevance: "high", importanceScore: 85 },
      { id: "bio-4-23", name: "Conceito de biodiversidade", relevance: "medium", importanceScore: 78 },
      { id: "bio-4-24", name: "Importância da biodiversidade", relevance: "high", importanceScore: 83 },
      { id: "bio-4-25", name: "Ameaças à biodiversidade", relevance: "high", importanceScore: 85 },
      { id: "bio-4-26", name: "Conservação", relevance: "high", importanceScore: 82 },
      { id: "bio-4-27", name: "4.6 Biodiversidade no Brasil", relevance: "high", importanceScore: 88 },
      { id: "bio-4-28", name: "Diversidade biológica brasileira", relevance: "high", importanceScore: 86 },
      { id: "bio-4-29", name: "Principais biomas", relevance: "crucial", importanceScore: 94 },
      { id: "bio-4-30", name: "Espécies endêmicas", relevance: "medium", importanceScore: 75 },
      { id: "bio-4-31", name: "Ameaças e conservação da biodiversidade", relevance: "high", importanceScore: 84 }
    ]
  },
  {
    name: "🫀 BLOCO 5 — ANATOMIA E FISIOLOGIA HUMANA",
    microTopics: [
      { id: "bio-5-1", name: "5. Características anatômicas e fisiológicas do homem", relevance: "crucial", importanceScore: 92 },
      { id: "bio-5-2", name: "5.1 Sistema digestório", relevance: "high", importanceScore: 89 },
      { id: "bio-5-3", name: "Órgãos", relevance: "medium", importanceScore: 78 },
      { id: "bio-5-4", name: "Digestão", relevance: "high", importanceScore: 88 },
      { id: "bio-5-5", name: "Absorção de nutrientes", relevance: "high", importanceScore: 86 },
      { id: "bio-5-6", name: "5.2 Sistema respiratório", relevance: "high", importanceScore: 87 },
      { id: "bio-5-7", name: "Órgãos", relevance: "medium", importanceScore: 75 },
      { id: "bio-5-8", name: "Ventilação pulmonar", relevance: "high", importanceScore: 82 },
      { id: "bio-5-9", name: "Hematose", relevance: "crucial", importanceScore: 93 },
      { id: "bio-5-10", name: "Transporte de gases", relevance: "high", importanceScore: 88 },
      { id: "bio-5-11", name: "5.3 Sistema cardiovascular", relevance: "crucial", importanceScore: 94 },
      { id: "bio-5-12", name: "Coração", relevance: "high", importanceScore: 89 },
      { id: "bio-5-13", name: "Vasos sanguíneos", relevance: "medium", importanceScore: 79 },
      { id: "bio-5-14", name: "Circulação", relevance: "crucial", importanceScore: 92 },
      { id: "bio-5-15", name: "Sangue", relevance: "high", importanceScore: 85 },
      { id: "bio-5-16", name: "5.4 Sistema urinário", relevance: "high", importanceScore: 86 },
      { id: "bio-5-17", name: "Rins", relevance: "medium", importanceScore: 77 },
      { id: "bio-5-18", name: "Néfrons", relevance: "high", importanceScore: 88 },
      { id: "bio-5-19", name: "Formação da urina", relevance: "crucial", importanceScore: 91 },
      { id: "bio-5-20", name: "Excreção", relevance: "high", importanceScore: 83 },
      { id: "bio-5-21", name: "Regulação hídrica", relevance: "high", importanceScore: 87 },
      { id: "bio-5-22", name: "5.5 Sistema nervoso", relevance: "crucial", importanceScore: 95 },
      { id: "bio-5-23", name: "Organização do sistema nervoso", relevance: "high", importanceScore: 89 },
      { id: "bio-5-24", name: "Neurônios", relevance: "high", importanceScore: 86 },
      { id: "bio-5-25", name: "Impulso nervoso", relevance: "crucial", importanceScore: 94 },
      { id: "bio-5-26", name: "Sinapses", relevance: "crucial", importanceScore: 93 },
      { id: "bio-5-27", name: "Sistema nervoso central e periférico", relevance: "high", importanceScore: 88 },
      { id: "bio-5-28", name: "5.6 Sistema endócrino", relevance: "crucial", importanceScore: 91 },
      { id: "bio-5-29", name: "Glândulas", relevance: "high", importanceScore: 84 },
      { id: "bio-5-30", name: "Hormônios", relevance: "crucial", importanceScore: 92 },
      { id: "bio-5-31", name: "Regulação hormonal", relevance: "high", importanceScore: 86 },
      { id: "bio-5-32", name: "5.7 Sistema imunológico", relevance: "crucial", importanceScore: 96 },
      { id: "bio-5-33", name: "Imunidade", relevance: "high", importanceScore: 87 },
      { id: "bio-5-34", name: "Antígenos e anticorpos", relevance: "high", importanceScore: 89 },
      { id: "bio-5-35", name: "Imunidade inata e adquirida", relevance: "crucial", importanceScore: 94 },
      { id: "bio-5-36", name: "Vacinas e soros", relevance: "crucial", importanceScore: 97 },
      { id: "bio-5-37", name: "5.8 Sistema reprodutor", relevance: "high", importanceScore: 88 },
      { id: "bio-5-38", name: "Anatomia dos sistemas reprodutores", relevance: "medium", importanceScore: 78 },
      { id: "bio-5-39", name: "Gametogênese", relevance: "high", importanceScore: 87 },
      { id: "bio-5-40", name: "Ciclo menstrual", relevance: "crucial", importanceScore: 92 },
      { id: "bio-5-41", name: "Fecundação", relevance: "high", importanceScore: 86 },
      { id: "bio-5-42", name: "Reprodução humana", relevance: "high", importanceScore: 85 },
      { id: "bio-5-43", name: "5.9 Sistema locomotor", relevance: "medium", importanceScore: 76 },
      { id: "bio-5-44", name: "Sistema ósseo", relevance: "low", importanceScore: 68 },
      { id: "bio-5-45", name: "Sistema muscular", relevance: "medium", importanceScore: 75 },
      { id: "bio-5-46", name: "Articulações", relevance: "low", importanceScore: 65 },
      { id: "bio-5-47", name: "Movimento", relevance: "medium", importanceScore: 72 }
    ]
  },
  {
    name: "🧬 BLOCO 6 — TRANSMISSÃO DA VIDA E GENÉTICA",
    microTopics: [
      { id: "bio-6-1", name: "6. Transmissão da vida", relevance: "crucial", importanceScore: 96 },
      { id: "bio-6-2", name: "6.1 Fundamentos da hereditariedade", relevance: "crucial", importanceScore: 95 },
      { id: "bio-6-3", name: "Gene", relevance: "high", importanceScore: 89 },
      { id: "bio-6-4", name: "Alelos", relevance: "high", importanceScore: 88 },
      { id: "bio-6-5", name: "Cromossomos", relevance: "high", importanceScore: 87 },
      { id: "bio-6-6", name: "Genótipo", relevance: "crucial", importanceScore: 91 },
      { id: "bio-6-7", name: "Fenótipo", relevance: "crucial", importanceScore: 92 },
      { id: "bio-6-8", name: "Código genético", relevance: "crucial", importanceScore: 96 },
      { id: "bio-6-9", name: "6.2 Probabilidade aplicada à genética", relevance: "high", importanceScore: 88 },
      { id: "bio-6-10", name: "Conceitos básicos de probabilidade", relevance: "medium", importanceScore: 78 },
      { id: "bio-6-11", name: "Regra da adição", relevance: "high", importanceScore: 84 },
      { id: "bio-6-12", name: "Regra da multiplicação", relevance: "high", importanceScore: 86 },
      { id: "bio-6-13", name: "Probabilidade em cruzamentos genéticos", relevance: "high", importanceScore: 87 },
      { id: "bio-6-14", name: "6.3 Primeira Lei de Mendel", relevance: "crucial", importanceScore: 98 },
      { id: "bio-6-15", name: "Segregação dos alelos", relevance: "high", importanceScore: 89 },
      { id: "bio-6-16", name: "Cruzamentos mono-híbridos", relevance: "crucial", importanceScore: 94 },
      { id: "bio-6-17", name: "6.4 Segunda Lei de Mendel", relevance: "crucial", importanceScore: 95 },
      { id: "bio-6-18", name: "Segregação independente", relevance: "high", importanceScore: 88 },
      { id: "bio-6-19", name: "Cruzamentos di-híbridos", relevance: "crucial", importanceScore: 93 },
      { id: "bio-6-20", name: "6.5 Engenharia genética", relevance: "high", importanceScore: 88 },
      { id: "bio-6-21", name: "6.5.1 Clonagem", relevance: "medium", importanceScore: 78 },
      { id: "bio-6-22", name: "6.5.2 Organismos transgênicos", relevance: "high", importanceScore: 86 },
      { id: "bio-6-23", name: "6.5.3 Aplicações da engenharia genética", relevance: "high", importanceScore: 85 }
    ]
  },
  {
    name: "🌱 BLOCO 7 — ECOLOGIA E INTERAÇÃO ENTRE OS SERES VIVOS",
    microTopics: [
      { id: "bio-7-1", name: "7. Interação entre os seres vivos", relevance: "crucial", importanceScore: 96 },
      { id: "bio-7-2", name: "7.1 Conceitos básicos de Ecologia", relevance: "crucial", importanceScore: 95 },
      { id: "bio-7-3", name: "Organismo", relevance: "medium", importanceScore: 76 },
      { id: "bio-7-4", name: "População", relevance: "high", importanceScore: 84 },
      { id: "bio-7-5", name: "Comunidade", relevance: "high", importanceScore: 85 },
      { id: "bio-7-6", name: "Ecossistema", relevance: "crucial", importanceScore: 92 },
      { id: "bio-7-7", name: "Biosfera", relevance: "high", importanceScore: 87 },
      { id: "bio-7-8", name: "Habitat", relevance: "high", importanceScore: 88 },
      { id: "bio-7-9", name: "Nicho ecológico", relevance: "crucial", importanceScore: 93 },
      { id: "bio-7-10", name: "Fatores bióticos e abióticos", relevance: "high", importanceScore: 82 },
      { id: "bio-7-11", name: "7.2 Relações tróficas", relevance: "crucial", importanceScore: 97 },
      { id: "bio-7-12", name: "7.2.1 Cadeias alimentares", relevance: "high", importanceScore: 89 },
      { id: "bio-7-13", name: "7.2.2 Teias alimentares", relevance: "high", importanceScore: 88 },
      { id: "bio-7-14", name: "7.2.3 Níveis tróficos", relevance: "high", importanceScore: 86 },
      { id: "bio-7-15", name: "7.2.4 Fluxo de energia", relevance: "crucial", importanceScore: 94 },
      { id: "bio-7-16", name: "7.2.5 Ciclos da matéria", relevance: "crucial", importanceScore: 95 },
      { id: "bio-7-17", name: "7.2.6 Concentração de pesticidas", relevance: "high", importanceScore: 87 },
      { id: "bio-7-18", name: "Bioacumulação", relevance: "high", importanceScore: 88 },
      { id: "bio-7-19", name: "Biomagnificação", relevance: "crucial", importanceScore: 95 },
      { id: "bio-7-20", name: "7.2.7 Subprodutos radioativos e concentração na cadeia alimentar", relevance: "medium", importanceScore: 74 },
      { id: "bio-7-21", name: "7.3 Relações ecológicas limitadoras do crescimento populacional", relevance: "crucial", importanceScore: 94 },
      { id: "bio-7-22", name: "Competição", relevance: "high", importanceScore: 88 },
      { id: "bio-7-23", name: "Predação", relevance: "high", importanceScore: 87 },
      { id: "bio-7-24", name: "Parasitismo", relevance: "high", importanceScore: 85 },
      { id: "bio-7-25", name: "Mutualismo", relevance: "crucial", importanceScore: 91 },
      { id: "bio-7-26", name: "Relações ecológicas e dinâmica populacional", relevance: "high", importanceScore: 86 },
      { id: "bio-7-27", name: "Capacidade de suporte", relevance: "high", importanceScore: 84 },
      { id: "bio-7-28", name: "7.4 Ecossistemas do Brasil", relevance: "crucial", importanceScore: 97 },
      { id: "bio-7-29", name: "Amazônia", relevance: "high", importanceScore: 89 },
      { id: "bio-7-30", name: "Cerrado", relevance: "high", importanceScore: 88 },
      { id: "bio-7-31", name: "Caatinga", relevance: "crucial", importanceScore: 96 },
      { id: "bio-7-32", name: "Mata Atlântica", relevance: "high", importanceScore: 87 },
      { id: "bio-7-33", name: "Pantanal", relevance: "high", importanceScore: 85 },
      { id: "bio-7-34", name: "Pampa", relevance: "medium", importanceScore: 72 },
      { id: "bio-7-35", name: "Características e impactos ambientais", relevance: "high", importanceScore: 88 }
    ]
  },
  {
    name: "👩‍🏫 BLOCO 8 — ENSINO DE BIOLOGIA E CONHECIMENTO CIENTÍFICO",
    microTopics: [
      { id: "bio-8-1", name: "8. Ensino de Biologia", relevance: "high", importanceScore: 86 },
      { id: "bio-8-2", name: "8.1 Conhecimento científico", relevance: "medium", importanceScore: 78 },
      { id: "bio-8-3", name: "8.2 Natureza da ciência", relevance: "medium", importanceScore: 76 },
      { id: "bio-8-4", name: "8.3 Alfabetização científica", relevance: "high", importanceScore: 84 },
      { id: "bio-8-5", name: "8.4 Habilidade didática no ensino de Biologia", relevance: "high", importanceScore: 85 },
      { id: "bio-8-6", name: "9. Construção do conhecimento no ensino de Biologia", relevance: "high", importanceScore: 87 },
      { id: "bio-8-7", name: "9.1 Abordagens metodológicas", relevance: "high", importanceScore: 83 },
      { id: "bio-8-8", name: "9.2 Metodologias de ensino de Biologia", relevance: "crucial", importanceScore: 91 },
      { id: "bio-8-9", name: "9.3 Ensino investigativo", relevance: "crucial", importanceScore: 92 },
      { id: "bio-8-10", name: "9.4 Aprendizagem significativa", relevance: "crucial", importanceScore: 94 },
      { id: "bio-8-11", name: "9.5 Relação entre conhecimento prévio e conhecimento científico", relevance: "high", importanceScore: 88 }
    ]
  },
  {
    name: "🧪 BLOCO 9 — RECURSOS DIDÁTICOS E LABORATÓRIO",
    microTopics: [
      { id: "bio-9-1", name: "10. Recursos didáticos no ensino de Biologia", relevance: "high", importanceScore: 85 },
      { id: "bio-9-2", name: "10.1 Recursos didáticos utilizados em sala de aula", relevance: "medium", importanceScore: 78 },
      { id: "bio-9-3", name: "10.2 Recursos didáticos utilizados em laboratório", relevance: "high", importanceScore: 84 },
      { id: "bio-9-4", name: "10.3 Técnicas básicas de laboratório", relevance: "high", importanceScore: 83 },
      { id: "bio-9-5", name: "10.4 Materiais laboratoriais", relevance: "medium", importanceScore: 75 },
      { id: "bio-9-6", name: "10.5 Normas de segurança laboratorial", relevance: "high", importanceScore: 87 },
      { id: "bio-9-7", name: "10.6 Biossegurança no ensino de Biologia", relevance: "crucial", importanceScore: 91 }
    ]
  },
  {
    name: "💻 BLOCO 10 — TECNOLOGIAS NO ENSINO DE BIOLOGIA",
    microTopics: [
      { id: "bio-10-1", name: "11. Ensino de Biologia e novas tecnologias", relevance: "high", importanceScore: 84 },
      { id: "bio-10-2", name: "11.1 Tecnologias da Informação e Comunicação — TICs", relevance: "high", importanceScore: 85 },
      { id: "bio-10-3", name: "11.2 Recursos digitais no ensino de Biologia", relevance: "medium", importanceScore: 79 },
      { id: "bio-10-4", name: "11.3 Tecnologias educacionais", relevance: "high", importanceScore: 82 },
      { id: "bio-10-5", name: "11.4 Uso pedagógico das novas tecnologias", relevance: "high", importanceScore: 86 }
    ]
  },
  {
    name: "📝 BLOCO 11 — AVALIAÇÃO DA APRENDIZAGEM EM BIOLOGIA",
    microTopics: [
      { id: "bio-11-1", name: "12. Avaliação da aprendizagem do conhecimento biológico", relevance: "crucial", importanceScore: 93 },
      { id: "bio-11-2", name: "12.1 Conceito de avaliação", relevance: "medium", importanceScore: 76 },
      { id: "bio-11-3", name: "12.2 Avaliação diagnóstica", relevance: "high", importanceScore: 85 },
      { id: "bio-11-4", name: "12.3 Avaliação formativa", relevance: "crucial", importanceScore: 94 },
      { id: "bio-11-5", name: "12.4 Avaliação somativa", relevance: "high", importanceScore: 88 },
      { id: "bio-11-6", name: "12.5 Instrumentos de avaliação", relevance: "high", importanceScore: 87 },
      { id: "bio-11-7", name: "12.6 Avaliação da aprendizagem em Biologia", relevance: "crucial", importanceScore: 92 }
    ]
  },
  {
    name: "📘 BLOCO 12 — PCN E ENSINO DE BIOLOGIA",
    microTopics: [
      { id: "bio-12-1", name: "13. Competências e habilidades dos PCNEM para Biologia", relevance: "high", importanceScore: 85 },
      { id: "bio-12-2", name: "13.1 Competências propostas pelos PCNEM", relevance: "medium", importanceScore: 74 },
      { id: "bio-12-3", name: "13.2 Habilidades propostas pelos PCNEM", relevance: "medium", importanceScore: 75 },
      { id: "bio-12-4", name: "13.3 Competências relacionadas ao conhecimento biológico", relevance: "high", importanceScore: 82 },
      { id: "bio-12-5", name: "13.4 Habilidades de investigação e análise científica", relevance: "high", importanceScore: 86 },
      { id: "bio-12-6", name: "13.5 Relação entre Biologia, tecnologia e sociedade", relevance: "crucial", importanceScore: 91 }
    ]
  }
];

// Returns a SyllabusSubject representation for the candidate's custom selected specialty
export function getSpecialtySyllabus(specialtyName: string): SyllabusSubject {
  if (specialtyName === "Biologia") {
    return {
      id: "esp",
      displayName: "Conhecimentos Específicos",
      subjectKey: "Conhecimentos Específicos",
      blocks: BIOLOGY_COMPLETE_SYLLABUS_BLOCKS
    };
  }

  // General fallback for other specialties
  const specificHierarchy = CONTENT_HIERARCHY["Conhecimentos Específicos"];
  const specialtyInfo = specificHierarchy?.specialties && specificHierarchy.specialties[specialtyName];
  const blocks: SyllabusBlock[] = [];
  
  if (specialtyInfo && specialtyInfo.topics) {
    specialtyInfo.topics.forEach((topic, index) => {
      blocks.push({
        name: `📚 BLOCO ${index + 1} — ${topic.name.toUpperCase()}`,
        microTopics: topic.subtopics.map((subtopic, subIndex) => ({
          id: `esp-${specialtyName.toLowerCase().replace(/\s+/g, "-")}-${index + 1}-${subIndex + 1}`,
          name: subtopic,
          relevance: index === 0 ? "high" : "medium",
          importanceScore: index === 0 ? 85 - (subIndex * 5) : 75 - (subIndex * 5)
        }))
      });
    });
  } else {
    // Default fallback in case specialty is not found
    blocks.push({
      name: "📚 BLOCO 1 — CONHECIMENTOS ESPECÍFICOS GERAIS",
      microTopics: [
        { id: `esp-${specialtyName.toLowerCase().replace(/\s+/g, "-")}-1-1`, name: `Fundamentos Básicos de ${specialtyName}`, relevance: "high", importanceScore: 85 },
        { id: `esp-${specialtyName.toLowerCase().replace(/\s+/g, "-")}-1-2`, name: `Aplicações Práticas de ${specialtyName}`, relevance: "medium", importanceScore: 75 }
      ]
    });
  }

  return {
    id: "esp",
    displayName: "Conhecimentos Específicos",
    subjectKey: "Conhecimentos Específicos",
    blocks
  };
}

// Returns a complete list of SyllabusSubject objects (all basic + the chosen specialty)
export function getCompleteSyllabusSubjects(specialtyName: string): SyllabusSubject[] {
  return [
    ...BASIC_SUBJECTS_SYLLABUS,
    getSpecialtySyllabus(specialtyName)
  ];
}
