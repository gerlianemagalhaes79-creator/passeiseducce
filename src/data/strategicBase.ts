import { ContentTopic, Question } from "../types";

export const INITIAL_CONTENT_TOPICS: ContentTopic[] = [
  {
    id: "topic-lp-1",
    subject: "Língua Portuguesa",
    axis: "Leitura e Interpretação",
    name: "Compreensão e Interpretação de Textos de Variados Gêneros",
    relevance: "crucial",
    importanceScore: 98,
    status: "not_started",
    totalQuestionsSolved: 0,
    correctQuestionsSolved: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "topic-lp-2",
    subject: "Língua Portuguesa",
    axis: "Gramática e Sintaxe",
    name: "Sintaxe da Oração e do Período (Regência, Concordância e Crase)",
    relevance: "high",
    importanceScore: 88,
    status: "not_started",
    totalQuestionsSolved: 0,
    correctQuestionsSolved: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "topic-lp-3",
    subject: "Língua Portuguesa",
    axis: "Semântica e Estilística",
    name: "Coesão e Coerência Textual: Conectivos e Relações de Sentido",
    relevance: "high",
    importanceScore: 85,
    status: "not_started",
    totalQuestionsSolved: 0,
    correctQuestionsSolved: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "topic-did-1",
    subject: "Didática e Fundamentos da Educação",
    axis: "Teoria da Educação",
    name: "Tendências Pedagógicas na Prática Escolar Brasileira",
    relevance: "crucial",
    importanceScore: 95,
    status: "not_started",
    totalQuestionsSolved: 0,
    correctQuestionsSolved: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "topic-did-2",
    subject: "Didática e Fundamentos da Educação",
    axis: "Trabalho Pedagógico",
    name: "Planejamento de Ensino: Objetivos, Conteúdos, Métodos e Recursos",
    relevance: "high",
    importanceScore: 87,
    status: "not_started",
    totalQuestionsSolved: 0,
    correctQuestionsSolved: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "topic-did-3",
    subject: "Didática e Fundamentos da Educação",
    axis: "Prática Avaliativa",
    name: "Avaliação da Aprendizagem e suas Funções (Formativa, Somativa e Diagnóstica)",
    relevance: "crucial",
    importanceScore: 93,
    status: "not_started",
    totalQuestionsSolved: 0,
    correctQuestionsSolved: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "topic-leg-1",
    subject: "Legislação Educacional",
    axis: "Normas Nacionais",
    name: "LDB (Lei nº 9.394/1996): Princípios, Fins e Organização da Educação Nacional",
    relevance: "crucial",
    importanceScore: 97,
    status: "not_started",
    totalQuestionsSolved: 0,
    correctQuestionsSolved: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "topic-leg-2",
    subject: "Legislação Educacional",
    axis: "Níveis de Ensino",
    name: "LDB (Lei nº 9.394/1996): Diretrizes para o Ensino Médio e Educação Profissional",
    relevance: "high",
    importanceScore: 89,
    status: "not_started",
    totalQuestionsSolved: 0,
    correctQuestionsSolved: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "topic-leg-3",
    subject: "Legislação Educacional",
    axis: "Proteção e Direitos",
    name: "Estatuto da Criança e do Adolescente (ECA - Lei nº 8.069/1990): Direito à Educação",
    relevance: "medium",
    importanceScore: 72,
    status: "not_started",
    totalQuestionsSolved: 0,
    correctQuestionsSolved: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "topic-leg-4",
    subject: "Legislação Educacional",
    axis: "Constitucional",
    name: "Constituição Federal de 1988: Artigos 205 ao 214 (Da Educação)",
    relevance: "high",
    importanceScore: 86,
    status: "not_started",
    totalQuestionsSolved: 0,
    correctQuestionsSolved: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "topic-esp-1",
    subject: "Conhecimentos Específicos",
    axis: "Ecologia Geral",
    name: "Fluxo de Energia, Teias Alimentares e Ciclos Biogeoquímicos",
    relevance: "high",
    importanceScore: 84,
    status: "not_started",
    totalQuestionsSolved: 0,
    correctQuestionsSolved: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "topic-esp-2",
    subject: "Conhecimentos Específicos",
    axis: "Citologia",
    name: "Estruturas, Organelas Celulares e Divisão Celular (Mitose e Meiose)",
    relevance: "medium",
    importanceScore: 75,
    status: "not_started",
    totalQuestionsSolved: 0,
    correctQuestionsSolved: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "topic-esp-3",
    subject: "Conhecimentos Específicos",
    axis: "Genética",
    name: "Genética Mendeliana, Biologia Molecular e Engenharia Genética Básica",
    relevance: "high",
    importanceScore: 80,
    status: "not_started",
    totalQuestionsSolved: 0,
    correctQuestionsSolved: 0,
    createdAt: new Date().toISOString()
  }
];

export const SEEDED_QUESTIONS: Question[] = [
  {
    id: "q-001",
    subject: "Legislação Educacional",
    axis: "Normas Nacionais",
    topicId: "topic-leg-1",
    topicName: "LDB (Lei nº 9.394/1996): Princípios, Fins e Organização da Educação Nacional",
    text: "Segundo o Artigo 3º da LDB (Lei nº 9.394/1996), o ensino será ministrado com base em diversos princípios. Qual das seguintes alternativas NÃO constitui um princípio previsto no referido artigo?",
    options: [
      "Igualdade de condições para o acesso e permanência na escola.",
      "Liberdade de aprender, ensinar, pesquisar e divulgar a cultura, o pensamento, a arte e o saber.",
      "Pluralismo de ideias e de concepções pedagógicas.",
      "Unicidade de concepções e métodos pedagógicos na rede nacional de ensino."
    ],
    correctIndex: 3,
    explanation: "O Artigo 3º, inciso III da LDB preconiza expressamente o 'pluralismo de ideias e de concepções pedagógicas', o que é o oposto diametral da 'unicidade de concepções e métodos'. Portanto, a Unicidade é a alternativa incorreta.",
    examBoard: "FUNECE",
    year: 2024
  },
  {
    id: "q-002",
    subject: "Didática e Fundamentos da Educação",
    axis: "Teoria da Educação",
    topicId: "topic-did-1",
    topicName: "Tendências Pedagógicas na Prática Escolar Brasileira",
    text: "Na tendência pedagógica Libertadora, popularizada por pensadores como Paulo Freire, a educação assume um papel transformador e crítico. Qual é o papel principal dos conteúdos de ensino nesta tendência?",
    options: [
      "Conteúdos são verdades científicas inquestionáveis transmitidas pelo professor de forma hierárquica.",
      "Conteúdos são habilidades práticas comportamentais prontas para o mercado de trabalho.",
      "Conteúdos são temas geradores extraídos da prática de vida dos educandos, analisados criticamente.",
      "Conteúdos são saberes universais clássicos da humanidade selecionados de forma estática."
    ],
    correctIndex: 2,
    explanation: "Na pedagogia progressista libertadora de Paulo Freire, os conteúdos são chamados de 'Temas Geradores'. Eles não são transmitidos de cima para baixo; em vez disso, são decorrentes de um diálogo pedagógico a partir da realidade vivida pelos próprios alunos.",
    examBoard: "FUNECE",
    year: 2023
  },
  {
    id: "q-003",
    subject: "Língua Portuguesa",
    axis: "Gramática e Sintaxe",
    topicId: "topic-lp-2",
    topicName: "Sintaxe da Oração e do Período (Regência, Concordância e Crase)",
    text: "Assinale a alternativa em que o emprego da crase ocorre em inteira conformidade com as normas gramaticais da Língua Portuguesa padrão.",
    options: [
      "Após o curso preparatório, o professor passou a ensinar à distância.",
      "Entregamos as cartilhas de didática diretamente à todas as escolas do município.",
      "O edital da SEDUC foi favorável à candidata que estudou com antecedência.",
      "Ele preferiu responder à caneta todas as questões discursivas da prova de redação."
    ],
    correctIndex: 2,
    explanation: "Na alternativa C, o adjetivo 'favorável' exige a preposição 'a' (favorável a algo) e 'a candidata' possui artigo feminino 'a'. Ocorre fusão: à candidata. Nas outras opções: 'ensinar a distância' (sem crase se não determinada), 'à todas' (antes de pronome indefinido no plural não há crase), 'à caneta' (instrumento, crase opcional ou inadequada dependendo da regência, mas a C é inquestionavelmente correta).",
    examBoard: "UECE",
    year: 2024
  },
  {
    id: "q-004",
    subject: "Legislação Educacional",
    axis: "Constitucional",
    topicId: "topic-leg-4",
    topicName: "Constituição Federal de 1988: Artigos 205 ao 214 (Da Educação)",
    text: "De acordo com o Artigo 206 da Constituição Federal de 1988, a educação brasileira deve assegurar o princípio da 'gestão democrática do ensino público, na forma da lei'. Esse princípio visa prioritariamente garantir:",
    options: [
      "A privatização parcial do ensino secundário para aliviar despesas.",
      "A participação da comunidade escolar (professores, pais, alunos) nas decisões pedagógicas e administrativas.",
      "O poder absoluto dos diretores de escola na aplicação de penalidades disciplinares.",
      "O controle centralizado e exclusivo do Ministério da Educação sobre os currículos estaduais."
    ],
    correctIndex: 1,
    explanation: "A gestão democrática do ensino público garante a descentralização das decisões e a participação direta da comunidade escolar (profissionais, pais e estudantes) na formulação do projeto político-pedagógico e na administração geral da escola.",
    examBoard: "FUNECE",
    year: 2025
  },
  {
    id: "q-005",
    subject: "Didática e Fundamentos da Educação",
    axis: "Prática Avaliativa",
    topicId: "topic-did-3",
    topicName: "Avaliação da Aprendizagem e suas Funções (Formativa, Somativa e Diagnóstica)",
    text: "Um professor do Ensino Médio aplica uma avaliação no início do ano letivo para identificar os conhecimentos prévios e lacunas dos alunos, direcionando o planejamento de suas aulas. Esse tipo de avaliação classifica-se como:",
    options: [
      "Avaliação Somativa",
      "Avaliação Formativa",
      "Avaliação Diagnóstica",
      "Avaliação Qualitativa Terminal"
    ],
    correctIndex: 2,
    explanation: "A avaliação realizada no início de um processo de ensino com o intuito de verificar os pré-requisitos, necessidades e mapear o perfil da turma é classificada como Avaliação Diagnóstica.",
    examBoard: "UECE",
    year: 2024
  },
  {
    id: "q-006",
    subject: "Conhecimentos Específicos",
    axis: "Ecologia Geral",
    topicId: "topic-esp-1",
    topicName: "Fluxo de Energia, Teias Alimentares e Ciclos Biogeoquímicos",
    text: "Em um ecossistema terrestre equilibrado, a quantidade de energia disponível diminui progressivamente ao longo dos níveis tróficos. Esse fenômeno é explicado pela:",
    options: [
      "Primeira Lei da Termodinâmica, que diz que a energia se multiplica a cada nível.",
      "Segunda Lei da Termodinâmica, pois parte da energia é dissipada em forma de calor nos processos metabólicos.",
      "Capacidade adaptativa dos decompositores em acumular toda a energia do ecossistema.",
      "Fotossíntese reversa que ocorre nos consumidores primários sob condições de sombra."
    ],
    correctIndex: 1,
    explanation: "O fluxo de energia é unidirecional e decrescente. De acordo com a Segunda Lei da Termodinâmica, a energia útil se dissipa na forma de calor em cada transferência de nível trófico, reduzindo a energia disponível para o nível seguinte.",
    examBoard: "FUNECE",
    year: 2023
  }
];
