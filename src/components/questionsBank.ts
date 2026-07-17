import { Question } from "../types";

export interface SimulatorQuestion extends Question {
  specialty?: string;
}

export interface SubtopicInfo {
  name: string;
  subtopics: string[];
}

export interface SpecialtyHierarchy {
  [specialtyName: string]: {
    topics: SubtopicInfo[];
  };
}

export interface Hierarchy {
  [subjectName: string]: {
    hasSpecialties: boolean;
    specialties?: SpecialtyHierarchy;
    topics?: SubtopicInfo[];
  };
}

// Hierarchical definition of contents based on SEDUC-CE program and FUNECE standards
export const CONTENT_HIERARCHY: Hierarchy = {
  "Educação Brasileira — Temas Educacionais e Pedagógicos": {
    hasSpecialties: false,
    topics: [
      {
        name: "Teorias da Aprendizagem",
        subtopics: [
          "Piaget, Vygotsky e Wallon",
          "Psicogênese da Língua Escrita"
        ]
      },
      {
        name: "Tendências Pedagógicas",
        subtopics: [
          "Tendências Liberais vs Progressistas",
          "Didática de Paulo Freire"
        ]
      },
      {
        name: "Planejamento e Avaliação",
        subtopics: [
          "Planejamento de Ensino e Currículo",
          "Avaliação da Aprendizagem (Formativa, Somativa, Diagnóstica)"
        ]
      }
    ]
  },
  "Administração Pública": {
    hasSpecialties: false,
    topics: [
      {
        name: "Princípios Constitucionais",
        subtopics: [
          "Princípios Limpe (Artigo 37 da CF/88)",
          "Deveres dos Servidores Públicos"
        ]
      },
      {
        name: "Atos Administrativos",
        subtopics: [
          "Requisitos e Atributos dos Atos",
          "Anulação e Revogação de Atos"
        ]
      },
      {
        name: "Lei de Diretrizes Orçamentárias",
        subtopics: [
          "Noções de Orçamento Público",
          "PPA, LDO e LOA"
        ]
      }
    ]
  },
  "Língua Portuguesa": {
    hasSpecialties: false,
    topics: [
      {
        name: "Literatura",
        subtopics: [
          "Modernismo Brasileiro",
          "Romantismo e Realismo"
        ]
      },
      {
        name: "Gramática",
        subtopics: [
          "Sintaxe de Regência e Concordância",
          "Uso do Sinal Indicativo de Crase"
        ]
      },
      {
        name: "Compreensão de Texto",
        subtopics: [
          "Coesão e Coerência Textual",
          "Tipologia e Gêneros Textuais"
        ]
      }
    ]
  },
  "Leitura e Interpretação de Dados e Indicadores Educacionais": {
    hasSpecialties: false,
    topics: [
      {
        name: "Indicadores Nacionais",
        subtopics: [
          "IDEB e Taxas de Fluxo (Aprovação, Reprovação, Abandono)",
          "Saeb e Prova Brasil"
        ]
      },
      {
        name: "Análise Estatística",
        subtopics: [
          "Leitura de Gráficos e Tabelas do Censo Escolar",
          "Média, Mediana e Porcentagens Educacionais"
        ]
      }
    ]
  },
  "Conhecimentos Específicos": {
    hasSpecialties: true,
    specialties: {
      "Biologia": {
        topics: [
          {
            name: "Genética",
            subtopics: [
              "Primeira e Segunda Leis de Mendel",
              "Biotecnologia e DNA Recombinante"
            ]
          },
          {
            name: "Ecologia",
            subtopics: [
              "Fluxos de Energia e Ciclos Biogeoquímicos",
              "Biomas Brasileiros e Impactos Ambientais"
            ]
          }
        ]
      },
      "Arte-Educação": {
        topics: [
          {
            name: "História da Arte",
            subtopics: [
              "História da Arte no Brasil",
              "Modernismo e a Semana de 22"
            ]
          },
          {
            name: "Ensino da Arte",
            subtopics: [
              "Abordagem Triangular de Ana Mae Barbosa",
              "Parâmetros Curriculares de Arte"
            ]
          }
        ]
      },
      "Educação Física": {
        topics: [
          {
            name: "Fisiologia e Esporte",
            subtopics: [
              "Fisiologia do Exercício",
              "Dimensões Conceitual, Procedimental e Atitudinal"
            ]
          },
          {
            name: "Cultura Corporal",
            subtopics: [
              "Jogos, Brinquedos e Brincadeiras na Escola",
              "Dança e Expressão Corporal"
            ]
          }
        ]
      },
      "Filosofia": {
        topics: [
          {
            name: "Ética e Política",
            subtopics: [
              "Contratualismo (Hobbes, Locke, Rousseau)",
              "Ética Aristotélica e Kantiana"
            ]
          },
          {
            name: "Epistemologia",
            subtopics: [
              "Racionalismo e Empirismo",
              "Filosofia da Ciência Contemporânea"
            ]
          }
        ]
      },
      "Física": {
        topics: [
          {
            name: "Mecânica",
            subtopics: [
              "Cinemática e Leis de Newton",
              "Trabalho e Energia"
            ]
          },
          {
            name: "Termodinâmica",
            subtopics: [
              "Leis da Termodinâmica",
              "Óptica Geométrica"
            ]
          }
        ]
      },
      "Geografia": {
        topics: [
          {
            name: "Geografia Física",
            subtopics: [
              "Climas e Domínios Morfoclimáticos do Brasil",
              "Cartografia e Escalas"
            ]
          },
          {
            name: "Geografia Humana",
            subtopics: [
              "Urbanização e Industrialização no Brasil",
              "Geografia do Ceará: Clima e Economia"
            ]
          }
        ]
      },
      "História": {
        topics: [
          {
            name: "Brasil Colônia e Império",
            subtopics: [
              "Economia Açucareira e Escravidão",
              "Independência e Segundo Reinado"
            ]
          },
          {
            name: "Brasil República",
            subtopics: [
              "Era Vargas e Ditadura Militar",
              "História do Ceará: Movimento Abolicionista e Caldeirão"
            ]
          }
        ]
      },
      "Libras": {
        topics: [
          {
            name: "Gramática de Libras",
            subtopics: [
              "Parâmetros de Libras (Configuração de Mão, Ponto de Articulação)",
              "Classificadores e Sintaxe"
            ]
          },
          {
            name: "Legislação e História",
            subtopics: [
              "Decreto nº 5.626/2005",
              "História da Educação de Surdos no Brasil"
            ]
          }
        ]
      },
      "Língua Espanhola": {
        topics: [
          {
            name: "Comprensión Lectora",
            subtopics: [
              "Análisis de Textos y Cohesión",
              "Heterosemánticos y Falsos Amigos"
            ]
          },
          {
            name: "Gramática y Léxico",
            subtopics: [
              "Uso de Pronombres y Tildación",
              "Tiempos del Modo Subjuntivo"
            ]
          }
        ]
      },
      "Língua Inglesa": {
        topics: [
          {
            name: "Reading Comprehension",
            subtopics: [
              "Text Interpretation and Discourse Markers",
              "Skimming and Scanning Techniques"
            ]
          },
          {
            name: "Grammar and Vocabulary",
            subtopics: [
              "Modal Verbs and Conditional Sentences",
              "Verb Tenses in Context"
            ]
          }
        ]
      },
      "Língua Portuguesa": {
        topics: [
          {
            name: "Análise Linguística",
            subtopics: [
              "Morfossintaxe da Oração",
              "Semântica e Pragmática"
            ]
          },
          {
            name: "Teoria Literária",
            subtopics: [
              "Estilística e Figuras de Linguagem",
              "Gêneros Literários Clássicos"
            ]
          }
        ]
      },
      "Matemática": {
        topics: [
          {
            name: "Álgebra e Funções",
            subtopics: [
              "Funções de 1º e 2º Graus",
              "Progressões Aritméticas e Geométricas"
            ]
          },
          {
            name: "Geometria e Probabilidade",
            subtopics: [
              "Geometria Espacial (Prismas, Cilindros, Esferas)",
              "Análise Combinatória e Probabilidade"
            ]
          }
        ]
      },
      "Química": {
        topics: [
          {
            name: "Química Geral",
            subtopics: [
              "Modelos Atômicos e Tabela Periódica",
              "Ligações Químicas e Geometria Molecular"
            ]
          },
          {
            name: "Físico-Química",
            subtopics: [
              "Termoquímica e Lei de Hess",
              "Equilíbrio Químico e pH"
            ]
          }
        ]
      },
      "Sociologia": {
        topics: [
          {
            name: "Clássicos da Sociologia",
            subtopics: [
              "Fato Social e Divisão do Trabalho (Durkheim)",
              "Ação Social e Ética Protestante (Weber)",
              "Luta de Classes e Materialismo Histórico (Marx)"
            ]
          },
          {
            name: "Sociologia Brasileira",
            subtopics: [
              "Cultura e Identidade Nacional",
              "Movimentos Sociais e Desigualdade no Ceará"
            ]
          }
        ]
      }
    }
  }
};

// Rich, high-fidelity mock questions representing each subtopic
export const DETAILED_QUESTIONS_BANK: SimulatorQuestion[] = [
  // --- Educação Brasileira — Temas Educacionais e Pedagógicos ---
  {
    id: "eb-the-ped-001",
    subject: "Educação Brasileira — Temas Educacionais e Pedagógicos",
    axis: "Teorias da Aprendizagem",
    topicId: "eb-the-ped-tp1",
    topicName: "Piaget, Vygotsky e Wallon",
    text: "De acordo com Lev Vygotsky e sua Teoria Histórico-Cultural, o desenvolvimento cognitivo do estudante é mediado por instrumentos e signos inseridos socialmente. O conceito fundamental definido como o espaço entre o nível de desenvolvimento real (o que a criança faz sozinha) e o nível de desenvolvimento potencial (o que faz com ajuda) é a:",
    options: [
      "Zona de Desenvolvimento Proximal (ZDP).",
      "Assimilação Cognitiva.",
      "Estágio das Operações Formais.",
      "Mediação Afetiva Pura."
    ],
    correctIndex: 0,
    explanation: "A Zona de Desenvolvimento Proximal (ZDP) é o conceito-chave de Vygotsky para caracterizar a distância entre as realizações autônomas do sujeito (nível real) e aquelas possíveis mediante a ajuda e mediação externa (nível potencial).",
    examBoard: "FUNECE",
    year: 2024
  },
  {
    id: "eb-the-ped-002",
    subject: "Educação Brasileira — Temas Educacionais e Pedagógicos",
    axis: "Teorias da Aprendizagem",
    topicId: "eb-the-ped-tp2",
    topicName: "Psicogênese da Língua Escrita",
    text: "Emília Ferreiro e Ana Teberosky, ao proporem a Psicogênese da Língua Escrita, identificaram estágios sucessivos de conceituação. No estágio silábico-alfabético, a criança se caracteriza pedagógica e cognitivamente por:",
    options: [
      "Escrever desenhando garatujas sem correspondência sonora.",
      "Perceber que a escrita representa os sons, alternando a escrita de uma letra para cada sílaba com a escrita de uma letra para cada fonema.",
      "Escrever utilizando estritamente um caractere para cada fonema pronunciado com perfeição ortográfica.",
      "Negar o valor sonoro das letras, organizando a leitura apenas pelo tamanho global da palavra escrita."
    ],
    correctIndex: 1,
    explanation: "No estágio silábico-alfabético, ocorre uma transição em que o aluno começa a superar a hipótese silábica pura, passando a atribuir valor fonético completo às letras em algumas partes da palavra, alternando as duas hipóteses.",
    examBoard: "FUNECE",
    year: 2024
  },
  {
    id: "eb-the-ped-003",
    subject: "Educação Brasileira — Temas Educacionais e Pedagógicos",
    axis: "Tendências Pedagógicas",
    topicId: "eb-the-ped-tp3",
    topicName: "Tendências Liberais vs Progressistas",
    text: "No contexto da prática escolar brasileira descrita por Libâneo, as tendências pedagógicas se dividem em Liberais e Progressistas. Assinale a alternativa que descreve corretamente a Tendência Progressista Crítico-Social dos Conteúdos:",
    options: [
      "Foca na memorização sistemática e no adestramento técnico para o mercado fabril.",
      "Preconiza que os conteúdos são universais clássicos, mantidos imutáveis pelo professor transmissor.",
      "Entende que a escola deve promover a apropriação dos conteúdos científicos universais de forma indissociável de sua realidade social e histórica.",
      "Elimina qualquer atuação do professor, descentralizando a totalidade das decisões pedagógicas no espontaneísmo do aluno."
    ],
    correctIndex: 2,
    explanation: "A pedagogia crítico-social dos conteúdos defende que a escola pública deve assegurar a difusão dos conteúdos vivos e universais, indissociáveis da realidade social, como ferramenta de emancipação das classes populares.",
    examBoard: "FUNECE",
    year: 2024
  },
  {
    id: "eb-the-ped-004",
    subject: "Educação Brasileira — Temas Educacionais e Pedagógicos",
    axis: "Tendências Pedagógicas",
    topicId: "eb-the-ped-tp4",
    topicName: "Didática de Paulo Freire",
    text: "Na didática freireana, contida na Pedagogia do Oprimido, o processo educativo deve romper com a chamada 'educação bancária'. Para tanto, Paulo Freire defende:",
    options: [
      "A imposição de manuais pedagógicos estrangeiros para modernizar as salas de aula.",
      "A pedagogia dialógica baseada nos temas geradores, onde educador e educando aprendem juntos mediatizados pelo mundo.",
      "A exclusão de qualquer debate social para focar unicamente na memorização das regras ortográficas.",
      "O uso do silêncio absoluto do estudante como pressuposto ético do respeito à autoridade docente."
    ],
    correctIndex: 1,
    explanation: "A educação problematizadora de Paulo Freire fundamenta-se no diálogo dialético mediado pelo mundo, utilizando 'temas geradores' retirados do contexto real dos educandos para desvelar a opressão.",
    examBoard: "FUNECE",
    year: 2023
  },
  {
    id: "eb-the-ped-005",
    subject: "Educação Brasileira — Temas Educacionais e Pedagógicos",
    axis: "Planejamento e Avaliação",
    topicId: "eb-the-ped-tp5",
    topicName: "Planejamento de Ensino e Currículo",
    text: "No planejamento de ensino, a seleção de conteúdos curriculares deve obedecer a critérios pedagógicos consistentes. Segundo a didática contemporânea, o currículo oculto se conceitua como:",
    options: [
      "O conjunto de matérias opcionais oferecidas no turno da noite pelas escolas estaduais.",
      "O plano de curso guardado pela equipe diretiva que não é divulgado aos pais dos alunos.",
      "As influências, atitudes e valores transmitidos tacitamente pelas práticas escolares que não constam no currículo formal.",
      "Os conteúdos programáticos exclusivos para alunos em recuperação contínua."
    ],
    correctIndex: 2,
    explanation: "O currículo oculto refere-se a todos os aprendizados implícitos, comportamentos, normas e valores construídos na rotina da vivência escolar que não estão formalizados em documentos escritos.",
    examBoard: "UECE",
    year: 2025
  },
  {
    id: "eb-the-ped-006",
    subject: "Educação Brasileira — Temas Educacionais e Pedagógicos",
    axis: "Planejamento e Avaliação",
    topicId: "eb-the-ped-tp6",
    topicName: "Avaliação da Aprendizagem (Formativa, Somativa, Diagnóstica)",
    text: "A avaliação formativa desempenha um papel crucial no cotidiano escolar regulando o processo de ensino-aprendizagem. Sua principal característica pedagógica é:",
    options: [
      "Ocorrer ao final do ano de forma punitiva para classificar e reprovar os alunos de baixo rendimento.",
      "Acompanhar continuamente o processo pedagógico de forma processual, servindo como feedback tanto para a autorregulação do aluno quanto para o redirecionamento didático do professor.",
      "Ser totalmente quantitativa, visando apenas o preenchimento de planilhas de notas e diários estatais.",
      "Concentrar-se exclusivamente em testes de múltipla escolha administrados de forma isolada."
    ],
    correctIndex: 1,
    explanation: "A avaliação formativa tem caráter processual e contínuo, focando no diagnóstico do andamento da aprendizagem e gerando feedbacks ativos para correção de rumos antes do encerramento de ciclos.",
    examBoard: "FUNECE",
    year: 2024
  },

  // --- Administração Pública ---
  {
    id: "ap-001",
    subject: "Administração Pública",
    axis: "Princípios Constitucionais",
    topicId: "ap-tp1",
    topicName: "Princípios Limpe (Artigo 37 da CF/88)",
    text: "O Artigo 37, caput da Constituição Federal do Brasil de 1988 estabelece expressamente os princípios que regem a Administração Pública direta e indireta. Qual alternativa apresenta apenas princípios expressos constantes no referido texto constitucional?",
    options: [
      "Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência.",
      "Proporcionalidade, Razoabilidade, Celeridade, Supremacia e Moralidade.",
      "Legalidade, Transparência, Supremacia do Interesse Público, Publicidade e Economicidade.",
      "Autotutela, Eficiência, Continuidade do Serviço Público, Impessoalidade e Boa-Fé."
    ],
    correctIndex: 0,
    explanation: "Os princípios constitucionais explícitos na redação do caput do Artigo 37 da CF/88 formam o famoso acrônimo LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência.",
    examBoard: "FUNECE",
    year: 2024
  },
  {
    id: "ap-002",
    subject: "Administração Pública",
    axis: "Princípios Constitucionais",
    topicId: "ap-tp2",
    topicName: "Deveres dos Servidores Públicos",
    text: "No contexto da ética e dos deveres funcionais do servidor público estadual do Ceará, constitui conduta obrigatória decorrente de sua atuação:",
    options: [
      "Priorizar interesses de grupos específicos ou partidários no atendimento ao balcão público.",
      "Desempenhar as atribuições do cargo público com presteza, zelo, urbanidade e obediência estrita às ordens de superiores hierárquicos, exceto quando manifestamente ilegais.",
      "Exigir presentes ou gratificações financeiras adicionais de cidadãos sob alegação de acelerar trâmites.",
      "Omitir-se diante de irregularidades funcionais graves sob a justificativa de manter a harmonia no setor."
    ],
    correctIndex: 1,
    explanation: "Os servidores públicos têm deveres éticos e de lealdade administrativa, devendo acatar determinações superiores, ressalvadas as hipóteses de ordens flagrantemente ilegais.",
    examBoard: "FUNECE",
    year: 2023
  },
  {
    id: "ap-003",
    subject: "Administração Pública",
    axis: "Atos Administrativos",
    topicId: "ap-tp3",
    topicName: "Requisitos e Atributos dos Atos",
    text: "Os atos administrativos possuem requisitos essenciais de validade (elementos). Qual das alternativas aponta corretamente a totalidade dos cinco elementos formadores do ato administrativo segundo a doutrina clássica?",
    options: [
      "Sujeito, Objeto, Causa, Motivação e Fins.",
      "Competência, Forma, Motivo, Objeto e Finalidade.",
      "Iniciativa, Prerrogativa, Celeridade, Forma e Conteúdo.",
      "Competência, Moralidade, Impessoalidade, Objeto e Eficácia."
    ],
    correctIndex: 1,
    explanation: "Os cinco requisitos (ou elementos) de validade do ato administrativo são: Competência (ou Sujeito Competente), Forma, Motivo, Objeto e Finalidade.",
    examBoard: "FUNECE",
    year: 2024
  },
  {
    id: "ap-004",
    subject: "Administração Pública",
    axis: "Atos Administrativos",
    topicId: "ap-tp4",
    topicName: "Anulação e Revogação de Atos",
    text: "O princípio da Autotutela Administrativa, consolidado pelas Súmulas 346 e 473 do STF, autoriza que a Administração Pública exerça controle sobre seus próprios atos. Diante disso, é correto afirmar:",
    options: [
      "A Administração Pública revoga atos ilegais com efeitos ex tunc.",
      "A Administração Pública anula atos eivados de vícios de legalidade e revoga atos inconvenientes ou inoportunos por razões de interesse público (efeitos ex nunc).",
      "O Poder Judiciário pode revogar atos convenientes do Poder Executivo em prol da celeridade.",
      "Atos administrativos válidos e que geraram direitos adquiridos podem ser anulados arbitrariamente a qualquer momento."
    ],
    correctIndex: 1,
    explanation: "A anulação incide sobre atos inválidos (ilegais) e retroage (efeito ex tunc), enquanto a revogação se dá sobre atos válidos, mas não mais oportunos ou convenientes, operando efeitos prospectivos (ex nunc).",
    examBoard: "FUNECE",
    year: 2024
  },
  {
    id: "ap-005",
    subject: "Administração Pública",
    axis: "Lei de Diretrizes Orçamentárias",
    topicId: "ap-tp5",
    topicName: "Noções de Orçamento Público",
    text: "O orçamento público materializa o planejamento financeiro estatal. O princípio orçamentário clássico da Unidade preconiza que:",
    options: [
      "Cada órgão federativo deve possuir múltiplos orçamentos para controle descentralizado.",
      "O orçamento do Estado deve conter todas as receitas e despesas estruturadas em um único documento consolidado.",
      "O orçamento só pode conter matérias de previsão de receita e fixação de despesas (exceção para créditos suplementares).",
      "O orçamento é elaborado anualmente com duração exatamente semestral."
    ],
    correctIndex: 1,
    explanation: "O princípio da unidade dita que o orçamento público deve ser único para cada ente governamental, englobando todas as receitas e despesas num documento consolidado por exercício financeiro.",
    examBoard: "UECE",
    year: 2023
  },
  {
    id: "ap-006",
    subject: "Administração Pública",
    axis: "Lei de Diretrizes Orçamentárias",
    topicId: "ap-tp6",
    topicName: "PPA, LDO e LOA",
    text: "A Constituição Federal estabelece três instrumentos fundamentais de planejamento orçamentário articulados entre si. Qual alternativa define corretamente o papel da Lei de Diretrizes Orçamentárias (LDO)?",
    options: [
      "Fixar os objetivos de longo prazo (oito anos) de desenvolvimento socioeconômico regional.",
      "Orientar a elaboração da Lei Orçamentária Anual (LOA), dispor sobre alterações na legislação tributária e estabelecer a política de aplicação das agências financeiras de fomento.",
      "Executar diretamente as obras públicas aprovadas pelo Poder Legislativo sem prévio planejamento.",
      "Garantir a total isenção fiscal para qualquer atividade de interesse político imediato."
    ],
    correctIndex: 1,
    explanation: "A LDO serve como elo de ligação entre o PPA (Plano Plurianual) e a LOA (Lei Orçamentária Anual), estabelecendo metas financeiras de curto prazo e as regras básicas para a LOA.",
    examBoard: "FUNECE",
    year: 2025
  },

  // --- Língua Portuguesa ---
  {
    id: "lp-001",
    subject: "Língua Portuguesa",
    axis: "Literatura",
    topicId: "lp-tp1",
    topicName: "Modernismo Brasileiro",
    text: "A Semana de Arte Moderna de 1922 foi o marco inicial do Modernismo no Brasil, rompendo com as estéticas tradicionais do Parnasianismo e do Academicismo. Qual dos seguintes poetas e intelectuais foi responsável pela leitura do emblemático poema 'Os Sapos' (crítica caricata aos parnasianos) e pela redação do 'Manifesto Antropófago'?",
    options: [
      "Machado de Assis.",
      "Castro Alves.",
      "Oswald de Andrade (Manifesto) e Manuel Bandeira (autor do poema).",
      "Casimiro de Abreu."
    ],
    correctIndex: 2,
    explanation: "O poema 'Os Sapos' foi escrito por Manuel Bandeira e lido na Semana de 22 por Ronald de Carvalho, zombando abertamente da meticulosidade parnasiana. Oswald de Andrade idealizou a antropofagia cultural.",
    examBoard: "UECE",
    year: 2024
  },
  {
    id: "lp-002",
    subject: "Língua Portuguesa",
    axis: "Literatura",
    topicId: "lp-tp2",
    topicName: "Romantismo e Realismo",
    text: "Machado de Assis consolidou o Realismo brasileiro em 1881. A obra inaugural desse período, caracterizada pela inovação de um narrador defunto, ironia fina e análise psicológica profunda da hipocrisia burguesa carioca, é:",
    options: [
      "O Guarani.",
      "Memórias Póstumas de Brás Cubas.",
      "Iracema.",
      "A Moreninha."
    ],
    correctIndex: 1,
    explanation: "A publicação de 'Memórias Póstumas de Brás Cubas' inaugurou formalmente o Realismo no Brasil. A narrativa irônica do 'defunto autor' analisa as mazelas humanas com cinismo de classe.",
    examBoard: "UECE",
    year: 2024
  },
  {
    id: "lp-003",
    subject: "Língua Portuguesa",
    axis: "Gramática",
    topicId: "lp-tp3",
    topicName: "Sintaxe de Regência e Concordância",
    text: "O estudo da regência verbal analisa a relação de subordinação entre o verbo e seus complementos. De acordo com a norma-padrão da língua, assinale a alternativa com a regência CORRETA para o verbo 'assistir' no sentido de 'presenciar/ver':",
    options: [
      "Nós assistimos o jogo do Fortaleza no Castelão ontem à noite.",
      "Nós assistimos ao jogo do Ceará no Castelão ontem à noite.",
      "Os alunos sempre assistem os gabaritos da banca sem questionar.",
      "Ele assistiu o debate dos candidatos com profunda indiferença."
    ],
    correctIndex: 1,
    explanation: "O verbo 'assistir', no sentido de ver/presenciar, é transitivo indireto, exigindo obrigatoriamente a preposição 'a'. Portanto, 'assistimos ao jogo' está formalmente correto.",
    examBoard: "UECE",
    year: 2024
  },
  {
    id: "lp-004",
    subject: "Língua Portuguesa",
    axis: "Gramática",
    topicId: "lp-tp4",
    topicName: "Uso do Sinal Indicativo de Crase",
    text: "A crase é a fusão da preposição 'a' com outro 'a' (geralmente artigo definido ou pronome demonstrativo). Assinale a única alternativa que apresenta o uso CORRETO do acento grave indicador de crase:",
    options: [
      "O professor entregou as anotações pedagógicas à uma aluna atenta.",
      "Refiro-me àquilo que foi combinado no planejamento pedagógico de ontem.",
      "Os docentes começaram à redigir as novas questões simuladas da banca.",
      "Fomos caminhar à pé pelas praias desertas da Região Metropolitana de Fortaleza."
    ],
    correctIndex: 1,
    explanation: "O verbo 'referir-se' exige a preposição 'a' (quem se refere, refere-se A algo). O pronome demonstrativo 'aquilo' inicia-se com a letra 'a'. Ocorre crase obrigatória: àquilo.",
    examBoard: "FUNECE",
    year: 2025
  },
  {
    id: "lp-005",
    subject: "Língua Portuguesa",
    axis: "Compreensão de Texto",
    topicId: "lp-tp5",
    topicName: "Coesão e Coerência Textual",
    text: "Elementos coesivos conectam partes do texto garantindo a fluidez da leitura. No período: 'Estudou de forma árdua para o concurso da SEDUC, contudo não obteve a classificação na primeira tentativa', a conjunção sublinhada ('contudo') estabelece relação semântica de:",
    options: [
      "Conclusão e encerramento de raciocínio lógico.",
      "Adição e enriquecimento argumentativo.",
      "Oposição, adversidade ou contrariedade em relação ao enunciado anterior.",
      "Causa e efeito direto da ação verbal de estudar."
    ],
    correctIndex: 2,
    explanation: "'Contudo' é uma conjunção coordenativa adversativa (assim como mas, porém, todavia, entretanto), que marca contraste e quebra de expectativa entre as orações.",
    examBoard: "UECE",
    year: 2024
  },

  // --- Leitura e Interpretação de Dados e Indicadores Educacionais ---
  {
    id: "lidi-001",
    subject: "Leitura e Interpretação de Dados e Indicadores Educacionais",
    axis: "Indicadores Nacionais",
    topicId: "lidi-tp1",
    topicName: "IDEB e Taxas de Fluxo (Aprovação, Reprovação, Abandono)",
    text: "O Índice de Desenvolvimento da Educação Básica (IDEB) é calculado a partir de dois componentes essenciais coletados pelo Inep. Quais são esses dois componentes orquestradores de sua nota final?",
    options: [
      "O rendimento escolar (taxa de aprovação dos alunos) e as médias de desempenho nos exames do Saeb.",
      "O orçamento anual gasto pela escola pública e a taxa de evasão do ensino superior local.",
      "A qualificação física dos banheiros escolares e a quantidade total de computadores conectados por sala de aula.",
      "A média de idade dos professores de Didática e a quantidade de greves anuais registradas."
    ],
    correctIndex: 0,
    explanation: "A fórmula do IDEB pondera o fluxo escolar (obtido pelas taxas de aprovação do Censo Escolar) e o aprendizado acadêmico medido pelas proficiências em Língua Portuguesa e Matemática no Saeb.",
    examBoard: "FUNECE",
    year: 2024
  },
  {
    id: "lidi-002",
    subject: "Leitura e Interpretação de Dados e Indicadores Educacionais",
    axis: "Indicadores Nacionais",
    topicId: "lidi-tp2",
    topicName: "Saeb e Prova Brasil",
    text: "O Sistema de Avaliação da Educação Básica (Saeb) avalia em larga escala o ensino nacional. Na interpretação pedagógica de seus relatórios estatísticos oficiais, a proficiência dos estudantes é expressa em uma escala baseada em:",
    options: [
      "Conceitos qualitativos de 'A' a 'E' emitidos individualmente pelos professores da rede.",
      "Escalas numéricas de proficiência (escalas de resposta ao item - TRI) que indicam o conjunto de competências e habilidades dominadas.",
      "Porcentagem direta de acertos em provas de redação argumentativa do ENEM.",
      "Tempo médio em segundos que o aluno leva para ler uma página impressa de texto legal."
    ],
    correctIndex: 1,
    explanation: "O Saeb utiliza a Teoria de Resposta ao Item (TRI) para construir escalas de proficiência cumulativas, permitindo comparar resultados ao longo do tempo independentemente do caderno de prova específico.",
    examBoard: "FUNECE",
    year: 2024
  },
  {
    id: "lidi-003",
    subject: "Leitura e Interpretação de Dados e Indicadores Educacionais",
    axis: "Análise Estatística",
    topicId: "lidi-tp3",
    topicName: "Leitura de Gráficos e Tabelas do Censo Escolar",
    text: "Uma tabela do Censo Escolar do Ceará indica que o Ensino Médio de uma escola apresentou, nos últimos três anos, as seguintes taxas de abandono: Ano 1: 12%, Ano 2: 8%, Ano 3: 5%. A interpretação analítica e correta desse indicador aponta para:",
    options: [
      "Um aumento na evasão escolar exigindo intervenção urgente da comunidade escolar.",
      "Uma tendência contínua de melhoria da permanência dos estudantes, evidenciada pela redução gradativa na taxa de abandono.",
      "Uma estabilidade completa dos indicadores sem variações estatisticamente relevantes.",
      "Um erro grosseiro de cálculo que anula o censo."
    ],
    correctIndex: 1,
    explanation: "A diminuição de 12% para 5% na taxa de abandono demonstra aumento da retenção e melhoria nos indicadores de permanência escolar dos alunos.",
    examBoard: "FUNECE",
    year: 2025
  },

  // --- Conhecimentos Específicos - Biologia ---
  {
    id: "esp-bio-001",
    subject: "Conhecimentos Específicos",
    specialty: "Biologia",
    axis: "Genética",
    topicId: "esp-bio-tp1",
    topicName: "Primeira e Segunda Leis de Mendel",
    text: "De acordo com a Primeira Lei de Mendel (Segregação dos Fatores), cada caráter é determinado por um par de genes que se separam durante a formação dos gametas. Cruzando-se duas plantas de ervilha heterozigotas para a cor da semente (Vv, sendo V amarelo dominante e v verde recessivo), a proporção fenotípica esperada na descendência é de:",
    options: [
      "100% de sementes verdes.",
      "50% amarelas e 50% verdes.",
      "75% amarelas (3/4) e 25% verdes (1/4).",
      "9:3:3:1 de variação de cores."
    ],
    correctIndex: 2,
    explanation: "No cruzamento monohíbrido Vv x Vv, obtém-se 1 VV (amarelo), 2 Vv (amarelos) e 1 vv (verde). A proporção genotípica é 1:2:1 e a proporção fenotípica é 3 amarelas para 1 verde (75% x 25%).",
    examBoard: "UECE",
    year: 2024
  },
  {
    id: "esp-bio-002",
    subject: "Conhecimentos Específicos",
    specialty: "Biologia",
    axis: "Genética",
    topicId: "esp-bio-tp2",
    topicName: "Biotecnologia e DNA Recombinante",
    text: "A tecnologia do DNA recombinante permitiu grandes avanços na biologia molecular e medicina, como a produção de insulina humana por bactérias. Para cortar fragmentos específicos de DNA e colá-los em plasmídeos vetores, utilizam-se, respectivamente:",
    options: [
      "Enzimas de restrição (endonucleases) e DNA ligases.",
      "Ribossomos e RNA polimerases extracelulares.",
      "Lisozimas bacterianas e anticorpos monoclonais.",
      "Polimerases de PCR e helicases nucleares."
    ],
    correctIndex: 0,
    explanation: "As enzimas de restrição cortam o DNA em sítios específicos (sequências palindrômicas), enquanto as DNA ligases restabelecem as ligações fosfodiéster entre os fragmentos colados.",
    examBoard: "UECE",
    year: 2023
  },
  {
    id: "esp-bio-003",
    subject: "Conhecimentos Específicos",
    specialty: "Biologia",
    axis: "Ecologia",
    topicId: "esp-bio-tp3",
    topicName: "Fluxos de Energia e Ciclos Biogeoquímicos",
    text: "No ciclo biogeoquímico do nitrogênio, as bactérias desempenham papel fundamental. O processo de conversão do íon amônio (NH4+) em nitrito (NO2-) e deste em nitrato (NO3-) é denominado:",
    options: [
      "Amortização.",
      "Nitrificação (composta pelas subetapas de nitrosação e nitratação).",
      "Desnitrificação gasosa.",
      "Fixação simbiótica por rizóbios."
    ],
    correctIndex: 1,
    explanation: "A nitrificação é um processo aeróbico quimiossintético realizado por bactérias nitrificantes, dividido em nitrosação (amônia a nitrito pelas Nitrosomonas) e nitratação (nitrito a nitrato pelas Nitrobacter).",
    examBoard: "FUNECE",
    year: 2024
  },

  // --- Conhecimentos Específicos - Outras Especialidades (Banca FUNECE/UECE) ---
  {
    id: "esp-art-001",
    subject: "Conhecimentos Específicos",
    specialty: "Arte-Educação",
    axis: "Ensino da Arte",
    topicId: "esp-art-tp1",
    topicName: "Abordagem Triangular de Ana Mae Barbosa",
    text: "A Abordagem Triangular revolucionou o ensino das artes visuais no Brasil a partir do fim dos anos 1980. Quais são os três pilares metodológicos propostos por Ana Mae Barbosa que sustentam essa prática?",
    options: [
      "O fazer artístico, a leitura da obra de arte e a contextualização histórica.",
      "O desenho geométrico, a cópia de modelos e o estudo da perspectiva.",
      "A pintura livre, a argila abstrata e a audição musical de clássicos.",
      "O teatro grego, as danças folclóricas e a mímica corporal."
    ],
    correctIndex: 0,
    explanation: "A Abordagem Triangular sistematizada por Ana Mae Barbosa baseia-se em três ações: ler a obra de arte (análise estética), fazer arte (produção) e contextualizar (história e conexões culturais).",
    examBoard: "UECE",
    year: 2024
  },
  {
    id: "esp-edf-001",
    subject: "Conhecimentos Específicos",
    specialty: "Educação Física",
    axis: "Fisiologia e Esporte",
    topicId: "esp-edf-tp1",
    topicName: "Dimensões Conceitual, Procedimental e Atitudinal",
    text: "Na perspectiva dos Parâmetros Curriculares e das teorias críticas da Educação Física escolar, os conteúdos de ensino devem ir além do mero executar técnico dos esportes. Assim, a dimensão atitudinal da aprendizagem envolve:",
    options: [
      "O domínio muscular do drible de handebol.",
      "A compreensão histórica das regras táticas das Olimpíadas.",
      "O respeito ao adversário, a cooperação coletiva e a inclusão de todos os colegas de classe na atividade corporal.",
      "O cálculo matemático do índice de massa corporal (IMC) dos estudantes."
    ],
    correctIndex: 2,
    explanation: "A dimensão atitudinal relaciona-se ao desenvolvimento de valores morais, éticos, respeito mútuo, cooperação e solidariedade durante as práticas corporais coletivas.",
    examBoard: "FUNECE",
    year: 2024
  },
  {
    id: "esp-fil-001",
    subject: "Conhecimentos Específicos",
    specialty: "Filosofia",
    axis: "Ética e Política",
    topicId: "esp-fil-tp1",
    topicName: "Contratualismo (Hobbes, Locke, Rousseau)",
    text: "Thomas Hobbes, autor do clássico 'Leviatã', defende um modelo político contratualista onde o Estado de Natureza do homem se caracteriza por uma:",
    options: [
      "Harmonia pacífica fundamentada no respeito mútuo espontâneo.",
      "Guerra de todos contra todos, onde o homem é o lobo do homem (homo homini lupus), exigindo um pacto de submissão a um soberano absoluto para garantir a paz e segurança.",
      "Cooperação agrária baseada na igualdade de posses comunistas primordiais.",
      "Fuga sistemática de qualquer interação social para viver isolado em cavernas."
    ],
    correctIndex: 1,
    explanation: "Para Hobbes, a ausência de um poder civil forte gera desconfiança absoluta e egoísmo desenfreado, resultando em um estado de guerra contínua. Para cessar o medo da morte violenta, os homens renunciam à sua liberdade natural em favor de um pacto social com o soberano.",
    examBoard: "UECE",
    year: 2024
  },
  {
    id: "esp-fis-001",
    subject: "Conhecimentos Específicos",
    specialty: "Física",
    axis: "Mecânica",
    topicId: "esp-fis-tp1",
    topicName: "Cinemática e Leis de Newton",
    text: "A Primeira Lei de Newton, conhecida como Princípio da Inércia, afirma que um corpo tende a manter seu estado de repouso ou de movimento retilíneo uniforme (MRU) caso a força resultante sobre ele seja nula. Esse princípio implica conceitualmente que:",
    options: [
      "Corpos com maior massa tendem a possuir menor inércia para frear.",
      "A velocidade de um corpo em queda livre independe da gravidade.",
      "Inércia é a propriedade intrínseca da matéria que resiste à alteração em seu estado de movimento.",
      "Força é uma propriedade de corpos pesados em alta velocidade."
    ],
    correctIndex: 2,
    explanation: "A inércia é a resistência intrínseca que qualquer corpo material oferece à alteração de seu vetor velocidade (seja saindo do repouso ou mudando de direção/módulo no movimento).",
    examBoard: "FUNECE",
    year: 2024
  },
  {
    id: "esp-geo-001",
    subject: "Conhecimentos Específicos",
    specialty: "Geografia",
    axis: "Geografia Humana",
    topicId: "esp-geo-tp1",
    topicName: "Geografia do Ceará: Clima e Economia",
    text: "O território cearense é caracterizado pela forte presença do domínio semiárido no sertão. No entanto, o relevo cearense apresenta áreas com maior pluviosidade e umidade, denominadas de:",
    options: [
      "Sertões de depressão periférica assolados por secas constantes.",
      "Brejos de altitude ou serras úmidas (como Baturité, Ibiapaba e Meruoca), que barram ventos úmidos e propiciam vegetação florestada por chuvas orográficas.",
      "Planícies costeiras de manguezais puros sem topografia expressiva.",
      "Cuestas de chapadas rochosas totalmente áridas sem nascentes d'água."
    ],
    correctIndex: 1,
    explanation: "Os 'brejos de altitude' representam verdadeiros enclaves de umidade e vegetação atlântica no semiárido do Nordeste, decorrentes das chuvas de relevo (orográficas) geradas pela elevação de serras como Baturité e Ibiapaba.",
    examBoard: "UECE",
    year: 2024
  },
  {
    id: "esp-his-001",
    subject: "Conhecimentos Específicos",
    specialty: "História",
    axis: "Brasil República",
    topicId: "esp-his-tp1",
    topicName: "História do Ceará: Movimento Abolicionista e Caldeirão",
    text: "O estado do Ceará desempenhou pioneirismo histórico na abolição da escravidão no Brasil, libertando seus escravizados em 25 de março de 1884, quatro anos antes da Lei Áurea. Um dos movimentos mais expressivos liderados por jangadeiros no porto de Fortaleza contra o tráfico de escravizados foi chefiado por:",
    options: [
      "Padre Cícero.",
      "Francisco José do Nascimento, conhecido popularmente como o 'Dragão do Mar'.",
      "Antônio Conselheiro.",
      "Bárbara de Alencar."
    ],
    correctIndex: 1,
    explanation: "O jangadeiro Francisco José do Nascimento, o 'Dragão do Mar', liderou o fechamento do porto de Fortaleza ao tráfico interprovincial de escravizados, impulsionando a campanha abolicionista cearense.",
    examBoard: "UECE",
    year: 2024
  },
  {
    id: "esp-lib-001",
    subject: "Conhecimentos Específicos",
    specialty: "Libras",
    axis: "Gramática de Libras",
    topicId: "esp-lib-tp1",
    topicName: "Parâmetros de Libras (Configuração de Mão, Ponto de Articulação)",
    text: "A Língua Brasileira de Sinais (Libras) é uma língua de modalidade gestual-visual estruturada por parâmetros fonológicos específicos. Qual das seguintes alternativas apresenta os cinco parâmetros fundamentais descritos na gramática da Libras?",
    options: [
      "Configuração de mão, ponto de articulação, movimento, orientação/direcionalidade e expressão facial-corporal (marcações não manuais).",
      "Sinalização de voz, datilologia, bilinguismo puro, mímica e postura ereta.",
      "Vocabulário visual, tom vocal, gestualidade corporal, silenciamento e pontuação labial.",
      "Configuração espacial, soletração, velocidade, ritmo manual e sotaque regional."
    ],
    correctIndex: 0,
    explanation: "A estrutura dos sinais em Libras é constituída por cinco parâmetros clássicos: Configuração de Mão (CM), Ponto de Articulação (PA), Movimento (M), Orientação (O) e as Expressões Não Manuais (ENM).",
    examBoard: "FUNECE",
    year: 2024
  },
  {
    id: "esp-esp-001",
    subject: "Conhecimentos Específicos",
    specialty: "Língua Espanhola",
    axis: "Comprensión Lectora",
    topicId: "esp-esp-tp1",
    topicName: "Heterosemánticos y Falsos Amigos",
    text: "En la lengua española, existen vocablos cuya forma escrita es idéntica o muy semejante a palabras del portugués, pero con significados totalmente distintos. En la frase: 'El profesor preparó una exquisita cena para sus colegas', la palabra destacada 'exquisita' significa:",
    options: [
      "Esquisita, extraña, rara o de mal gusto.",
      "Deliciosa, sabrosa o de excelente calidad gastronómica.",
      "Fria y desabrida debido a la falta de cocción.",
      "Costosa o extremadamente cara."
    ],
    correctIndex: 1,
    explanation: "El término 'exquisito' es un clásico falso amigo (heterosemántico). En español se utiliza para calificar algo delicado, sabroso o de gran refinamiento (delicioso), a diferencia del portugués donde significa 'estranho'.",
    examBoard: "UECE",
    year: 2024
  },
  {
    id: "esp-ing-001",
    subject: "Conhecimentos Específicos",
    specialty: "Língua Inglesa",
    axis: "Reading Comprehension",
    topicId: "esp-ing-tp1",
    topicName: "Text Interpretation and Discourse Markers",
    text: "Analyze the use of the discourse marker 'ALTHOUGH' in the sentence: 'Although the new school curriculum was extremely challenging, the students showed outstanding academic improvements.' The transition word 'although' indicates:",
    options: [
      "An addition of arguments or points.",
      "A contrast, concession or unexpected opposition between two ideas.",
      "A chronological consequence of physical actions.",
      "A comparison between identical processes."
    ],
    correctIndex: 1,
    explanation: "The conjunction 'although' translates as 'embora' or 'apesar de', establishing a relationship of concession or contrast between the subordinating clause and the main clause.",
    examBoard: "UECE",
    year: 2024
  },
  {
    id: "esp-por-001",
    subject: "Conhecimentos Específicos",
    specialty: "Língua Portuguesa",
    axis: "Análise Linguística",
    topicId: "esp-por-tp1",
    topicName: "Morfossintaxe da Oração",
    text: "Na estrutura sintática do período simples, o termo acessório que qualifica, especifica ou determina um substantivo, ligando-se diretamente a ele sem mediação de preposição, é denominado:",
    options: [
      "Adjunto adnominal.",
      "Objeto direto preposicionado.",
      "Aposto explicativo isolado por parênteses.",
      "Complemento nominal passivo."
    ],
    correctIndex: 0,
    explanation: "O adjunto adnominal é o termo de valor adjetivo que se junta imediatamente ao nome (substantivo) para determinar ou qualificar seu significado.",
    examBoard: "UECE",
    year: 2024
  },
  {
    id: "esp-mat-001",
    subject: "Conhecimentos Específicos",
    specialty: "Matemática",
    axis: "Álgebra e Funções",
    topicId: "esp-mat-tp1",
    topicName: "Funções de 1º e 2º Graus",
    text: "Uma função quadrática f(x) = ax² + bx + c possui um gráfico parabólico. Se o coeficiente 'a' é estritamente negativo (a < 0), é correto afirmar que a parábola possui:",
    options: [
      "Concavidade voltada para cima e um ponto mínimo global.",
      "Concavidade voltada para baixo e um ponto de máximo representado pelo seu vértice (V).",
      "Duas raízes imaginárias conjugadas puras necessariamente.",
      "Gráfico retilíneo decrescente na totalidade do eixo real."
    ],
    correctIndex: 1,
    explanation: "Quando o coeficiente 'a' do termo quadrático é negativo, a concavidade da parábola está voltada para baixo, possuindo um ponto máximo no vértice V(xv, yv).",
    examBoard: "UECE",
    year: 2024
  },
  {
    id: "esp-qui-001",
    subject: "Conhecimentos Específicos",
    specialty: "Química",
    axis: "Química Geral",
    topicId: "esp-qui-tp1",
    topicName: "Modelos Atômicos e Tabela Periódica",
    text: "O modelo atômico que propôs pela primeira vez a quantização da energia das órbitas eletrônicas, no qual os elétrons giram ao redor do núcleo em níveis de energia permitidos e emitem ou absorvem fótons ao saltarem entre órbitas, é o de:",
    options: [
      "John Dalton.",
      "Niels Bohr.",
      "Ernest Rutherford puramente.",
      "J.J. Thomson."
    ],
    correctIndex: 1,
    explanation: "Niels Bohr aprimorou o modelo de Rutherford introduzindo os postulados de quantização de energia de Planck, descrevendo órbitas circulares estacionárias definidas para a eletrosfera.",
    examBoard: "UECE",
    year: 2024
  },
  {
    id: "esp-soc-001",
    subject: "Conhecimentos Específicos",
    specialty: "Sociologia",
    axis: "Clássicos da Sociologia",
    topicId: "esp-soc-tp1",
    topicName: "Fato Social e Divisão do Trabalho (Durkheim)",
    text: "Émile Durkheim postulou que o objeto de estudo central da Sociologia são os 'Fatos Sociais'. Para que um fenômeno seja considerado um fato social, ele deve apresentar três características definidoras clássicas, que são:",
    options: [
      "Individualidade, subversão interna e religiosidade.",
      "Coercitividade, exterioridade e generalidade.",
      "Subjetividade, historicidade mutável e aceitação pessoal.",
      "Conflito de classes, alienação produtiva e dominação carismática."
    ],
    correctIndex: 1,
    explanation: "Os fatos sociais caracterizam-se por: Coercitividade (força imposta sobre o indivíduo), Exterioridade (existem antes e de forma independente do indivíduo) e Generalidade (são comuns a todos os membros da sociedade).",
    examBoard: "UECE",
    year: 2024
  }
];
