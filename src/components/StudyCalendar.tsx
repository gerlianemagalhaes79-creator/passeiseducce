import { useState, useMemo } from "react";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Check, 
  Trash2, 
  Clock, 
  Settings, 
  AlertTriangle,
  Sparkles,
  Printer,
  CalendarCheck,
  Sliders,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { StudyActivity, ContentTopic, CandidateSettings, EDUCATION_SPECIALTIES } from "../types";
import { CONTENT_HIERARCHY } from "./questionsBank";
import { generateFull74DaySchedule } from "../lib/calendarGenerator";

// High-fidelity microcontents from SEDUC-CE syllabus mapped as actionable daily contents
const SEDUC_CE_MICRO_SYLLABUS: Record<string, string[]> = {
  "Língua Portuguesa": [
    "Compreensão e interpretação de textos de variados gêneros",
    "Tipologia textual e gêneros discursivos",
    "Ortografia oficial e acentuação gráfica (Acordo Ortográfico)",
    "Emprego das classes de palavras (valor gramatical e estilístico)",
    "Emprego do sinal indicativo de crase",
    "Sintaxe da oração e do período (coordenação e subordinação)",
    "Pontuação: regras de emprego da vírgula e outros sinais",
    "Concordância nominal e verbal (regras gerais e casos especiais)",
    "Regência nominal e verbal (regras gerais e casos especiais)",
    "Significação das palavras: sinonímia, antonímia, homonímia, paronímia, campo semântico"
  ],
  "Educação Brasileira: Temas Educacionais e Pedagógicos": [
    "História do pensamento pedagógico brasileiro: correntes do pensamento pedagógico brasileiro",
    "Projeto político pedagógico: concepção, elaboração, implementação e avaliação escolar",
    "A didática e o processo de ensino e aprendizagem: organização do processo didático",
    "Planejamento didático: estratégias, metodologias ativas e avaliação formativa",
    "A sala de aula como espaço de aprendizagem, mediação e interação social",
    "A didática como fundamento epistemológico do fazer docente",
    "Teorias da aprendizagem: inatismo, comportamentalismo, behaviorismo",
    "Teorias da aprendizagem: interacionismo, cognitivismo e bases empíricas/epistemológicas",
    "Contribuições de Jean Piaget para o desenvolvimento cognitivo e a psicologia escolar",
    "Contribuições de Lev Vygotsky: mediação sócio-histórica e zona de desenvolvimento proximal",
    "Contribuições de Henri Wallon: a afetividade e o movimento no desenvolvimento humano",
    "Teoria das inteligências múltiplas de Howard Gardner e sua aplicação pedagógica",
    "Psicologia do desenvolvimento: aspectos históricos e biopsicossociais do adolescente",
    "Temas contemporâneos: bullying, cyberbullying e o papel preventivo da escola",
    "Temas contemporâneos: a escolha da profissão e transtornos alimentares na adolescência",
    "Temas contemporâneos: família, diversidade de escolhas sexuais e gênero na escola",
    "Teorias do currículo: tradicionais, críticas e pós-críticas",
    "Acesso, permanência e sucesso escolar do aluno na educação pública brasileira",
    "Gestão da aprendizagem: mediação docente e acompanhamento pedagógico contínuo",
    "Planejamento e gestão educacional de sistemas de ensino básico",
    "Avaliação institucional, de desempenho docente e avaliação da aprendizagem",
    "O Professor: processos de formação inicial e continuada e a identidade profissional",
    "A pesquisa na prática docente: professor pesquisador de sua própria ação",
    "A dimensão ética da profissão docente e as relações humanas na escola",
    "Aspectos legais e políticos da organização da educação brasileira",
    "Políticas educacionais para a educação básica: diretrizes e rumos do Ensino Médio",
    "Diretrizes, Parâmetros Curriculares do Ensino Médio, organização curricular e avaliação",
    "Interdisciplinaridade e contextualização metodológica no Ensino Médio",
    "Ensino Médio Integrado: fundamentação legal, bases curriculares e desafios",
    "Educação Inclusiva: princípios norteadores e atendimento educacional especializado (AEE)",
    "Educação, trabalho, formação profissional e as recentes transformações do Ensino Médio",
    "Protagonismo Juvenil, cidadania e práticas de emancipação social na escola"
  ],
  "Legislação Básica da Educação": [
    "Lei nº 9.394/1996 (LDB): Princípios, fins e organização da educação nacional (Artigos 1º ao 14º)",
    "Lei nº 9.394/1996 (LDB): Níveis e modalidades de educação e ensino (Artigos 21 ao 42)",
    "Lei nº 9.394/1996 (LDB): Os profissionais da educação e recursos financeiros (Artigos 58 ao 77)",
    "Lei nº 8.069/1990 (ECA): Do Direito à Educação, à Cultura, ao Esporte e ao Lazer (Artigos 53 a 59)",
    "Constituição da República Federativa do Brasil: Da Educação (Artigos 205 a 214)",
    "Emenda Constitucional nº 53/2006 (Criação do FUNDEB de forma constitucional)",
    "Lei nº 11.494/2007 e alterações: Regulamentação e funcionamento do FUNDEB",
    "Lei nº 11.114/2005: Ensino fundamental obrigatório com início aos 6 anos de idade",
    "Lei nº 11.274/2006: Ampliação do ensino fundamental para 9 anos de duração obrigatória",
    "Lei nº 13.415/2017: Reforma e novo formato do Ensino Médio e itinerários formativos",
    "Lei Federal Nº 13.005/2014: Plano Nacional de Educação (PNE) e suas 20 metas estratégicas",
    "Lei Estadual Nº 16.025/2016: Plano Estadual de Educação do Ceará (PEE-CE)"
  ],
  "Administração Pública": [
    "Conceito de administração pública: princípios, organização e estrutura estatal",
    "Conceito de servidor público: agentes públicos e cargo, emprego ou função",
    "Princípios expressos e implícitos da administração pública (Princípios LIMPE - Art. 37 da CF/88)",
    "Direitos, deveres e dever de probidade dos servidores públicos civis",
    "Responsabilidades administrativa, civil e penal do servidor público",
    "Servidor Estadual: Estatuto do Ceará (Lei nº 9.826/1974) - Do provimento de cargos (Cap. I a X)",
    "Servidor Estadual: Estatuto do Ceará (Lei nº 9.826/1974) - Dos direitos, vantagens e autorizações (Cap. I a VI)",
    "Servidor Estadual: Estatuto do Ceará (Lei nº 9.826/1974) - Do regime disciplinar (Título VI, Cap. I a VII)",
    "Lei Estadual nº 15.243/2012: Disciplina o Art. 3° da lei n° 15.064/2011",
    "Estágio Probatório do Servidor Estadual (Estatuto e Lei nº 13.092/2001)",
    "Estágio Probatório e Avaliação Especial de Desempenho (Leis Estaduais nº 15.744/2014 e nº 15.909/2015)",
    "Carreira do Magistério do Ceará: concurso, provimento, carga horária e jornada (Lei nº 10.884/1984 e Lei 12.066/1993)",
    "Carreira do Magistério do Ceará: evolução e regime jurídico (Lei estadual nº 14.404/2009)",
    "Ampliação da carga horária de trabalho do Grupo MAG (Lei nº 15.451/2013 e Decreto nº 31.458/2014)",
    "Promoção dos profissionais do Grupo MAG (Lei nº 15.901/2015 e Decreto nº 32.103/2016)",
    "Sistema Remuneratório do Grupo MAG: Leis nº 15.243/2012, nº 15.901/2015 e Lei nº 16.104/2016",
    "Sistema Remuneratório do Grupo MAG: Leis nº 16.513/2018 e nº 16.536/2018"
  ],
  "Leitura e Interpretação de Dados e Indicadores Educacionais": [
    "Indicadores educacionais de matrícula, taxas de atendimento escolar e de escolarização líquida/bruta",
    "Análise e cálculo da taxa de distorção idade-série no Ensino Médio",
    "Taxas de rendimento escolar: taxas de aprovação, reprovação e abandono escolar",
    "Resultados e escalas de proficiência do SPAECE (Sistema Permanente de Avaliação do Ceará)",
    "Resultados e estrutura do Saeb (Sistema de Avaliação da Educação Básica) e Prova Brasil",
    "Exame Nacional do Ensino Médio (ENEM): leitura de resultados e impactos educacionais",
    "Índice de Desenvolvimento da Educação Básica (IDEB): metodologia de cálculo e metas",
    "Programa Internacional de Avaliação de Alunos (PISA): eixos de avaliação e desempenho nacional",
    "Leitura e interpretação analítica de dados educacionais apresentados em tabelas estatísticas",
    "Leitura e interpretação analítica de dados educacionais em gráficos (barras, linhas, setores) e mapas",
    "Resolução de problemas matemáticos envolvendo cálculo de porcentagem com dados de fluxo e rendimento"
  ],
  "Biologia": [
    "Identidade dos seres vivos: Aspectos físicos, químicos e estruturais da célula",
    "Identidade dos seres vivos: Organelas citoplasmáticas e suas funções coordenadas",
    "Identidade dos seres vivos: Organização celular (procariontes, eucariontes e acionares)",
    "Identidade dos seres vivos: Funções celulares (síntese, transporte e eliminação de substâncias)",
    "Processos de obtenção de energia: fermentação, fotossíntese e respiração celular",
    "Divisão celular e Ciclo celular: mitose, meiose, regulação e variabilidade",
    "Noções básicas de microscopia óptica e eletrônica",
    "Origem da vida: Hipóteses sobre a origem dos primeiros seres e evolução biológica",
    "Evolução da vida: Teoria de Lamarck e Teoria de Darwin (seleção natural)",
    "Evolução da vida: Teoria Sintética da Evolução e Origem do homem",
    "Diversidade da vida: Regras de nomenclatura e características de domínios/reinos da natureza",
    "Biodiversidade no planeta e no Brasil: biomas e hotspots",
    "Fisiologia Humana: Sistemas digestório, respiratório, cardiovascular e excretor/urinário",
    "Fisiologia Humana: Sistemas nervoso, endócrino, imunológico, reprodutor e locomotor",
    "Transmissão da vida: Fundamentos da hereditariedade (gene, código genético e síntese proteica)",
    "Transmissão da vida: Primeira e segunda leis de Mendel, probabilidade e cruzamentos",
    "Aplicações da engenharia genética: clonagem, transgênicos, terapia gênica e biotecnologia",
    "Interação entre os seres vivos: Conceitos básicos em ecologia (população, comunidade, nicho)",
    "Relações tróficas: cadeias e teias alimentares, fluxo de matéria e energia",
    "Concentração de pesticidas, bioacumulação e subprodutos radiativos",
    "Relações ecológicas limitadoras do crescimento populacional (competição, predação, parasitismo)",
    "Ecossistemas do Brasil: Caatinga, Cerrado, Mata Atlântica, Amazônia, Pantanal e Pampa",
    "Ensino de Biologia: conhecimento científico, habilidade didática e abordagens metodológicas",
    "Recursos didáticos no ensino de Biologia: técnicas, materiais e normas de segurança em laboratórios",
    "O ensino de Biologia e as novas tecnologias da informação, comunicação e avaliação formativa",
    "Competências e habilidades propostas pelos PCN do Ensino Médio para a Disciplina de Biologia"
  ],
  "Arte-Educação": [
    "A arte na Educação para todos: LDB, PCN e Referenciais Curriculares da Educação Básica (RCB)",
    "Fundamentos e tendências pedagógicas históricas do ensino de Arte no Brasil",
    "A arte e o processo de construção da cidadania e emancipação crítica",
    "As diversas linguagens artísticas: Estética - conceitos, filosofias e contextos históricos",
    "Aspectos da cultura popular brasileira e as manifestações populares: formação e multiculturalismo",
    "A arte da pré-história brasileira e cearense (pinturas rupestres e sítios arqueológicos)",
    "Arte e cultura indígena: manifestações estéticas, grafismos e patrimônio",
    "Arte e cultura africana e afro-brasileira: formação histórica e influências expressivas",
    "As artes visuais no Brasil e no Ceará: do barroco colonial brasileiro aos movimentos dos dias atuais",
    "As artes audiovisuais: TV, cinema, fotografia, multimídia - novos recursos e novas linguagens",
    "A música no Brasil e a contribuição cearense, partindo do período colonial aos nossos dias",
    "O teatro no Brasil e no Ceará: história, dramaturgia, companhias e movimentos expressivos",
    "A dança no Brasil e no Ceará: danças dramáticas, folclóricas, de cunho popular e dança erudita",
    "Principais movimentos artísticos vanguardistas do século XX no cenário brasileiro",
    "Lei nº 11.769/2009: O Ensino e a aprendizagem obrigatória da Música na Escola básica",
    "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais (PCN) do Ensino Médio para Arte"
  ],
  "Educação Física": [
    "Histórico da Educação Física no Brasil e no mundo: tendências higienista, militarista e pedagógica",
    "Educação Física enquanto linguagem corporal e forma de leitura e expressão do mundo",
    "Processo de ensino-aprendizagem na Educação Física escolar: abordagens e práticas pedagógicas",
    "Construindo competências e habilidades corporais e esportivas em Educação Física",
    "Avaliação em Educação Física escolar: funções formativa, diagnóstica e autoavaliação",
    "Educação Física e sociedade: lazer, consumo, mídia e desigualdades sociais na cultura corporal",
    "Fundamentos didático-pedagógicos do movimento humano e as dimensões do conteúdo",
    "Atividade física, promoção da saúde, aptidão física e qualidade de vida na escola",
    "Crescimento físico, maturação biológica e desenvolvimento motor infantil e juvenil",
    "Aspectos do aprendizado motor: estágios de aprendizagem, feedback e prática motora",
    "Aspectos sócio-históricos das manifestações corporais, lutas, danças, ginásticas e esportes",
    "Política educacional, legislação de ensino e inserção curricular da Educação Física",
    "Cultura, pluralidade cultural e manifestações da cultura corporal de movimento",
    "Aspectos da competição, colaboração e cooperação pedagógica no cenário esportivo escolar",
    "Competências e habilidades propostas pelos PCN do Ensino Médio para a Disciplina de Educação Física"
  ],
  "Filosofia": [
    "A emergência da filosofia grega: a transição do mito à razão e a cosmologia presocrática",
    "Filosofia e a pólis grega: a constituição da cidade e a democracia ateniense",
    "Filosofia e a universalização da palavra na praça pública (ágora)",
    "Filosofia, verdade, argumentação sofística e o método maiêutico de Sócrates",
    "Filosofia e os conhecimentos tradicionais: narrativas míticas e consciência cotidiana",
    "Filosofia, estética, a arte e a construção do saber das ciências",
    "Filosofia e ação humana: moral, ética e política ao longo da história",
    "Filosofia, ética e busca pela felicidade: teorias de Platão, Aristóteles, Agostinho e Spinoza",
    "Ética deontológica, autonomia da razão prática e dignidade humana em Immanuel Kant",
    "Crítica aos valores morais, genealogia da moral e niilismo em Friedrich Nietzsche",
    "Filosofia e o conhecimento científico: Racionalismo cartesiano e o Empirismo de Francis Bacon",
    "Filosofia, Ciência e técnica na modernidade (Descartes, Bacon)",
    "Filosofia contemporânea e a crítica da técnica instrumental (Martin Heidegger, Walter Benjamin)",
    "Filosofia e experiência estética: Arte e absoluto em Hegel e a arte como afirmação da vida em Nietzsche",
    "Arte, verdade e sentido hermenêutico em Martin Heidegger e Hans-Georg Gadamer",
    "Arte, reprodutibilidade técnica e capitalismo: teorias de Benjamin, Adorno e Horkheimer",
    "O Ensino de Filosofia no Ensino Médio: determinações legais, LDB, diretrizes e BNCC",
    "Reflexões pedagógicas sobre o ensino de Filosofia, interdisciplinaridade e transposição didática",
    "Estratégias didáticas, leitura de textos originais e a seleção de conteúdos filosóficos na escola",
    "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais (PCN) de Filosofia"
  ],
  "Física": [
    "História e evolução das ideias da Física: Cosmologia antiga e a Física qualitativa de Aristóteles",
    "Origens da mecânica clássica (Galileu, Newton) e o surgimento da Relatividade e Teoria Quântica",
    "Mecânica: Cinemática escalar e vetorial e a dinâmica do movimento circular",
    "Mecânica: Leis de Newton, forças fundamentais e suas aplicações em situações cotidianas",
    "Mecânica: Trabalho, potência, energia, teoremas de conservação e transformações mecânicas",
    "Mecânica: Impulso, quantidade de movimento e leis de conservação em colisões",
    "Gravitação universal, leis de Kepler, estática de corpos rígidos e equilíbrio de sistemas",
    "Estática dos fluidos: densidade, pressão e os Princípios de Pascal, Arquimedes e Stevin",
    "Termodinâmica: Calor, temperatura, dilatação térmica, calor específico e trocas térmicas",
    "Termodinâmica: Mudança de fase, diagramas de fase, processos de propagação de calor",
    "Termodinâmica: Teoria cinética dos gases, energia interna, Lei de Joule e transformações gasosas",
    "Termodinâmica: Leis da termodinâmica, entropia, entalpia, máquinas térmicas e Ciclo de Carnot",
    "Eletromagnetismo: Eletrostática, campo elétrico, potencial elétrico e a Lei de Gauss",
    "Eletromagnetismo: Corrente elétrica, circuitos de corrente contínua, resistores e potência elétrica",
    "Eletromagnetismo: Campo magnético, fontes magnéticas, Lei de Ampère e indução de Faraday",
    "Eletromagnetismo: Propriedades elétricas e magnéticas dos materiais e as Equações de Maxwell",
    "Ondulatória: Movimento harmônico simples e oscilações livres, amortecidas e forçadas",
    "Ondulatória: Propagação de ondas sonoras e eletromagnéticas, ressonância e acústica",
    "Ondulatória: Ótica geométrica - leis da reflexão e refração da luz, espelhos e lentes",
    "Ondulatória: Ótica Física - fenômenos de interferência, difração e polarização da luz",
    "Física Moderna: Relatividade Especial, transformações de Lorentz e equivalência Massa-Energia",
    "Física Moderna: Natureza dual onda-partícula, radiação de corpo negro, efeito fotoelétrico",
    "Física Moderna: Teoria quântica da matéria, modelo atômico de Bohr, núcleo atômico e relatividade geral",
    "Ensino de Física: conhecimento científico, habilidade didática e abordagens metodológicas inovadoras",
    "Recursos didáticos no ensino de Física: experimentos laboratoriais, instrumentação e segurança",
    "O ensino de Física e as novas tecnologias digitais de informação, comunicação e metodologias de avaliação",
    "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais (PCN) de Física"
  ],
  "Geografia": [
    "Concepções do pensamento geográfico (determinismo, possibilismo, geografia crítica) e seu ensino",
    "Sociedade, espaço, lugar, paisagem e território como conceitos-chave no ensino da Geografia",
    "Currículo, cultura e territorialidade: diversidade sociocultural no ensino de Geografia",
    "Novas abordagens teóricas, metodologias ativas e cartografia escolar no ensino",
    "Uso de tecnologias de comunicação, informação e geotecnologias (SIG, imagens de satélite) no ensino",
    "Aspectos avaliativos no processo de ensino e aprendizagem geográfica",
    "Geopolítica e Economia: O espaço geográfico como produto histórico do trabalho humano",
    "O modo de produção capitalista: fases de desenvolvimento, acumulação e divisão internacional do trabalho",
    "Desenvolvimento, subdesenvolvimento, desigualdades socioespaciais e fluxos globais",
    "Economia mundial do pós-guerra, reestruturação produtiva, nova ordem mundial e globalização",
    "O Brasil na inserção da nova ordem mundial: economia agroexportadora, industrial e globalizada",
    "O comércio internacional contemporâneo, blocos econômicos regionais e o MERCOSUL",
    "A economia brasileira atual: endividamento externo, inflação, reformas e tendências",
    "Fontes de energia (renováveis e fósseis) e infraestrutura de transportes no Brasil e no mundo",
    "A questão agrária: agropecuária, modernização do campo, relações de produção e conflitos de terra",
    "O comércio, o setor de serviços, relações de trabalho, desemprego e exploração do trabalho humano",
    "A revolução técnico-científica-informacional e seus impactos na reorganização espacial do trabalho",
    "Geografia da população: teorias demográficas, dinâmica de crescimento e formas de ocupação do espaço",
    "A distribuição da população e os contrastes demográficos e econômicos regionais no Brasil",
    "Urbanização, metropolização, rede urbana e problemas socioambientais urbanos",
    "Ecologia e meio ambiente: ecossistemas naturais, biodiversidade e dinâmica climática global",
    "Impactos ambientais antrópicos (aquecimento global, poluição, desmatamento) e devastação histórica",
    "Recursos naturais, sustentabilidade, conservação, legislação e política ambiental no Brasil",
    "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais (PCN) de Geografia"
  ],
  "História": [
    "Concepções do pensamento histórico, dinâmica historiográfica contemporânea e ensino de História",
    "Memória, história oral, cultura, patrimônio e cotidiano como fontes metodológicas no ensino",
    "Currículo de História: abordagens de gênero, direitos humanos, meio ambiente e história local",
    "Diversidade étnico-racial (Lei nº 10.639/2003 e Lei nº 11.645/2008) no ensino de História",
    "Novas abordagens teóricas, recursos digitais de informação/comunicação e avaliação no ensino",
    "História Natural e História Social: hominização, Pré-história e povoamento da América e Ceará",
    "Formação das primeiras civilizações: Egito, Núbia, Kush, Méroe e a Mesopotâmia",
    "Antiguidade Oriental e Clássica: organização sócio-política na Palestina, Fenícia, Pérsia, Grécia e Roma",
    "A sociedade europeia medieval (séculos V ao XV): feudalismo, igreja, cultura e dinâmicas sociais",
    "Sociedade Oriental, expansão do Islamismo, islamização da Arábia e os reinos e impérios africanos",
    "A Europa na transição do feudalismo ao capitalismo (séc. XV ao XVIII): mercantilismo e absolutismo",
    "Civilizações pré-coloniais na África: Mali, Congo e Zimbabwe e a escravidão e diáspora atlântica",
    "As transformações sociais e revoluções na Europa e América do séc. XVIII à contemporaneidade",
    "Brasil e Ceará Colonial: exploração mercantil, escravidão e resistência indígena e negra",
    "Produção científica, artística e técnicas de mineração/cultivo trazidas pelos africanos escravizados",
    "Cultura, religiosidade e movimentos emancipacionistas de independência no Brasil e Ceará Colonial",
    "Brasil Império: Primeiro e Segundo Reinado, centralização política e a participação e revoltas no Ceará",
    "Revoluções e revoltas sociais imperiais e republicanas: Cabanagem, Balaiada, Farroupilha, Sabinada, Malês, Quebra Quilo",
    "Abolição da escravidão, Movimento Republicano, Primeira República e as oligarquias no Brasil e Ceará",
    "O Ceará na República: caldeirão da Santa Cruz do Deserto, coronelismo e movimentos messiânicos",
    "O Brasil contemporâneo: Era Vargas, Ditadura Militar, redemocratização e os dilemas atuais",
    "Atualidades geopolíticas internacionais, conflitos globais contemporâneos e direitos humanos",
    "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais (PCN) de História"
  ],
  "Libras": [
    "História da educação de surdos: trajetórias históricas, oralismo, comunicação total e bilinguismo",
    "Identidades surdas, diversidade cultural, cultura surda e comunidades surdas no Brasil",
    "Políticas educacionais de inclusão para surdos: decretos federais, LDB e a oficialização de Libras",
    "Fonologia da Língua Brasileira de Sinais: parâmetros das configurações de mão e pontos de articulação",
    "Morfologia da Libras: processos de formação de sinais, morfemas, flexão de gênero, número e tempo",
    "Sintaxe da Libras: ordem frasal, tipos de frases (afirmativas, negativas, interrogativas, exclamativas)",
    "Semântica e pragmática na Libras: interpretação de sentidos, contexto discursivo e expressividade",
    "Metodologia de ensino da Língua Brasileira de Sinais como primeira língua (L1) para surdos",
    "Metodologia de ensino da Língua Brasileira de Sinais como segunda língua (L2) para ouvintes",
    "Práticas pedagógicas e materiais didáticos aplicados ao ensino bilíngue de surdos"
  ],
  "Língua Espanhola": [
    "Leitura, interpretação e compreensão analítica de textos em espanhol de variados gêneros",
    "Tendências pedagógicas contemporâneas sobre o ensino de espanhol como língua estrangeira",
    "Uso e domínio consciente de estratégias de leitura (skimming, scanning, prediction)",
    "Identificação de palavras cognatas, falsos cognatos (heterosemánticos) e divergências léxicas",
    "Gramática espanhola: El alfabeto gráfico y oral e o sistema fonológico básico",
    "Morfologia do Espanhol: Artículos neutros (LO) e definidos/indefinidos, pronomes pessoais e tratamento",
    "Emprego de Verbos: Presente de indicativo (ser, estar, tener, verbos regulares e irregulares)",
    "Adjetivos e pronomes possessivos, demonstrativos, interrogativos e exclamativos",
    "Contracciones, combinaciones preposicionales, los numerales cardinales y ordinales",
    "Construções sintáticas: Perífrasis de futuro (ir a + infinitivo), adverbios e locuções de tempo",
    "Regras de formação do plural, vocabulário temático (lugares, transportes, família, cores, objetos)",
    "Divergências léxicas: Heterosemánticos, heterotónicos, heterogenéricos e o fenômeno de Apócope",
    "Relação sociocultural entre língua, cultura e sociedade e abordagem comunicativa intercultural",
    "O tratamento pedagógico da produção escrita como processo interativo (revisão, correção e reescrita)",
    "Análise e interpretação de textos literários e informativos de autores espanhóis e hispânicos modernos",
    "Avaliação e metodologias de ensino-aprendizagem de espanhol na educação básica",
    "Competências e habilidades propostas pelos PCN do Ensino Médio para a Língua Espanhola"
  ],
  "Língua Inglesa": [
    "Leitura, interpretação e compreensão analítica de textos em inglês de variados gêneros textuais",
    "Tendências pedagógicas contemporâneas sobre o ensino da Língua Inglesa na escola pública",
    "Prática de estratégias de leitura (skimming, scanning, prediction) e inferências contextuais",
    "Vocabulário temático compatível com a interpretação crítica de textos globais",
    "Morfossintaxe: Tempos e modos verbais básicos (verb to be, simple present, simple past)",
    "Verbos regulares e irregulares na construção discursiva do tempo passado",
    "Emprego dos tempos verbais contínuos: present continuous e past continuous",
    "Emprego dos tempos verbais perfeitos: present perfect, past perfect e perfect continuous",
    "Expressão de futuro em inglês: emprego dos auxiliares will e going to nas formas afirmativa/negativa/interrogativa",
    "Emprego do modo imperativo e dos verbos modais (can, could, should, must, have to, may)",
    "Voz passiva (passive voice) na estruturação de discursos jornalísticos e acadêmicos",
    "Uso funcional de preposições de tempo/lugar e conjunções coordenativas/subordinativas",
    "Processos de formação de palavras (afixação) e classificação gramatical de termos",
    "Pronomes em inglês: personal pronouns (subject/object), possessive pronouns e possessive adjectives",
    "Relative clauses: uso dos pronomes relativos (who, that, which, whose, whom, where)",
    "Graus de comparação dos adjetivos: comparativos e superlativos",
    "Caso genitivo (possessive case / Saxon genitive) e relações de posse no texto",
    "Relações interculturais entre língua, cultura, sociedade e o inglês como língua global",
    "Produção textual escrita como processo colaborativo e interativo (planejamento, revisão e reescrita)",
    "Análise de gêneros e compreensão de textos de autores modernos e contemporâneos de língua inglesa",
    "Avaliação processual e metodologias de ensino de inglês na escola básica",
    "Competências e habilidades propostas pelos PCN do Ensino Médio para a Língua Inglesa"
  ],
  "Matemática": [
    "Números: conjuntos numéricos, inteiros, divisibilidade, racionais, irracionais e reais",
    "Funções: conceito, igualdade de funções, determinação do domínio e imagem",
    "Tipos de funções: injetiva, sobrejetiva, bijetiva, inversa e a composição de funções",
    "Comportamento de funções: crescimento, decrescimento, paridade, zeros e determinação de sinal",
    "Funções elementares: linear, afim (1º grau), quadrática (2º grau), modulares, polinomiais, logarítmicas e exponenciais",
    "Equações, desigualdades numéricas e inequações associadas às funções elementares",
    "Geometria Plana: conceitos básicos, congruência, semelhança, áreas e relações métricas",
    "Geometria Espacial: prismas, pirâmides, cilindros, cones, esferas, volumes e áreas superficiais",
    "Geometria Analítica: ponto, reta, equações da reta e cônica (circunferência)",
    "Trigonometria: triângulo retângulo, ciclo trigonométrico, funções trigonométricas (seno, cosseno, tangente)",
    "Sequências numéricas: progressão aritmética (PA) e progressão geométrica (PG), recorrências e Fibonacci",
    "Álgebra Linear: matrizes, determinantes, propriedades e resolução de sistemas lineares",
    "Análise Combinatória: princípios de contagem, arranjos, combinações, permutações e Binômio de Newton",
    "Noções de Estatística: medidas de tendência central (média, mediana, moda)",
    "Medidas de dispersão (variância, desvio padrão), tabelas e representações gráficas de frequências",
    "Matemática Financeira: razão, proporção, porcentagem, juros simples e compostos, juros comerciais/exatos",
    "Sistemas de capitalização, desconto racional e desconto comercial bancário simples",
    "Taxa efetiva, equivalência de taxas e equivalência de capitais no tempo",
    "Cálculo de Probabilidade: espaço amostral, eventos, probabilidade condicional, independência de eventos",
    "Números Complexos: forma algébrica e trigonométrica, operações fundamentais e raízes",
    "Cálculo diferencial e integral para funções reais de uma variável real (limites, derivadas e integrais básicas)",
    "Noções de história da Matemática e o desenvolvimento dos conceitos ao longo do tempo",
    "Avaliação em educação matemática: formas, concepções e instrumentos formativos",
    "Metodologia do Ensino de Matemática: transposição didática, uso de material concreto e recursos digitais",
    "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais (PCN) de Matemática"
  ],
  "Química": [
    "História da Química: da Alquimia como precursora científica ao nascimento da Química moderna",
    "Química, tecnologia e sociedade: impactos industriais, ecológicos e éticos",
    "O mundo material e suas transformações: leis ponderais da química (Lavoisier, Proust, Dalton, Richter)",
    "Leis das reações gasosas de Gay-Lussac e a Hipótese de Avogadro (mol, molécula)",
    "Estequiometria química: cálculos estequiométricos de massa, volume, reagente limitante e pureza",
    "Natureza elétrica da matéria: as leis da eletrólise de Michael Faraday",
    "Ligações químicas: iônica, covalente, eletronegatividade, polaridade de ligações",
    "Repulsão dos pares eletrônicos da camada de valência (VSEPR) e a determinação da geometria molecular",
    "Teoria da Ligação de Valência (TLV), hibridização de orbitais (sp, sp2, sp3) e orbitais moleculares",
    "Estados físicos da matéria: sólidos, líquidos e gases ideais e reais no universo químico",
    "Propriedades físicas dos materiais, forças intermoleculares, diagramas de mudança de fase",
    "Estudo de Soluções: misturas homogêneas, classificação de soluções, solubilidade e curvas de solubilidade",
    "Unidades de concentração de soluções e cálculos envolvendo diluição e mistura de soluções",
    "Propriedades coligativas das soluções e o comportamento de eletrólitos/íons em solução aquosa",
    "Modelos atômicos: evolução histórica do modelo de Dalton ao modelo mecânico-quântico",
    "Estrutura atômica: propriedades dos átomos, dimensões, eletronegatividade e afinidade eletrônica",
    "Funções Químicas Inorgânicas: conceitos, nomenclatura, propriedades e aplicações de ácidos e bases",
    "Funções Químicas Inorgânicas: conceitos, nomenclatura, propriedades e aplicações de sais e óxidos",
    "Reações em solução aquosa: precipitação, ácido-base e reações de complexação",
    "Equilíbrio químico em solução aquosa: dissociação, constante de equilíbrio, produto de solubilidade",
    "Processos de hidrólise salina, indicadores ácido-base, volumetria de titulação e soluções tampão",
    "Tabela Periódica: histórico de sua construção, organização, classificação periódica dos elementos",
    "Química do Carbono: hibridização do carbono e características fundamentais dos compostos orgânicos",
    "Cinética Química: velocidade das reações, teoria das colisões, energia de ativação, catalisadores e lei de velocidade",
    "Nomenclatura orgânica: regras da IUPAC aplicadas às funções orgânicas fundamentais",
    "Funções Orgânicas: hidrocarbonetos, funções oxigenadas, nitrogenadas e halogenadas",
    "Reações orgânicas: adição, substituição, eliminação, oxidação e mecanismos reacionais básicos",
    "Ensino de Química: abordagens metodológicas para a construção do conhecimento científico escolar",
    "Recursos didáticos no ensino de Química: práticas de laboratório, manuseio de reagentes e segurança",
    "O ensino de Química, novas tecnologias digitais de informação, comunicação e avaliação",
    "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais (PCN) de Química"
  ],
  "Sociologia": [
    "Contexto histórico do surgimento da Sociologia: revolução industrial, revolução francesa e modernidade",
    "A constituição do saber sociológico como ciência e as regras do método nas ciências sociais",
    "Sociologia e sociedade: conceitos fundamentais, desenvolvimento e aplicabilidade social",
    "Condicionamentos sócio-culturais da personalidade do indivíduo: subjetividade e objetividade",
    "Estrutura social, organização social, controle social e o papel das instituições sociais",
    "Pensamento sociológico clássico: as teorias, conceitos e métodos de Émile Durkheim",
    "Pensamento sociológico clássico: a teoria crítica da sociedade e o materialismo histórico de Karl Marx",
    "Pensamento sociológico clássico: a sociologia compreensiva e a teoria da ação social de Max Weber",
    "Estrutificação social, classes sociais, desigualdade socioeconômica na visão clássica e contemporânea",
    "Classe social, consumo e estilos de vida diferenciados na sociedade ocidental atual",
    "Problemas sociais contemporâneos: exclusão social, pobreza, preconceito e discriminação de minorias",
    "A instituição escolar frente aos desafios contemporâneos: juventude, violência escolar e diversidade",
    "Movimentos sociais tradicionais (sindicalismo, lutas de terra) e os novos movimentos sociais",
    "Gênero, envelhecimento, desigualdades de gênero, violência contra a mulher e direitos das minorias",
    "Indústria cultural, cultura de massa, ideologia, alienação e meios de comunicação social",
    "Ética, cidadania, direitos civis, políticos e sociais e o processo de socialização do indivíduo",
    "Sociedade, mundo do trabalho, transformações produtivas, emprego, desemprego e flexibilização",
    "História do sindicalismo, lutas trabalhistas e movimentos de trabalhadores no cenário do Brasil",
    "Meio ambiente, sustentabilidade socioambiental, desenvolvimento tecnológico e sociedade de risco",
    "Globalização econômica, papel dos Estados nacionais, crise da soberania e fluxos transnacionais",
    "Metodologias de ensino da Sociologia na escola de nível médio",
    "Sociologia no Brasil: formação da identidade nacional, hibridismo e a questão racial",
    "Sociologia no Nordeste brasileiro: cultura regional, identidades plurais, religiosidade e movimentos sociais"
  ],
  "Pedagogia": [
    "História do pensamento pedagógico brasileiro: correntes do pensamento pedagógico brasileiro",
    "Projeto político pedagógico: concepção, elaboração, implementação e avaliação escolar",
    "A didática e o processo de ensino e aprendizagem: organização do processo didático",
    "Planejamento didático: estratégias, metodologias ativas e avaliação formativa",
    "A sala de aula como espaço de aprendizagem, mediação e interação social",
    "A didática como fundamento epistemológico do fazer docente",
    "Teorias da aprendizagem: inatismo, comportamentalismo, behaviorismo",
    "Teorias da aprendizagem: interacionismo, cognitivismo e bases empíricas/epistemológicas",
    "Contribuições de Jean Piaget para o desenvolvimento cognitivo e a psicologia escolar",
    "Contribuições de Lev Vygotsky: mediação sócio-histórica e zona de desenvolvimento proximal",
    "Contribuições de Henri Wallon: a afetividade e o movimento no desenvolvimento humano",
    "Teoria das inteligências múltiplas de Howard Gardner e sua aplicação pedagógica",
    "Psicologia do desenvolvimento: aspectos históricos e biopsicossociais do adolescente",
    "Temas contemporâneos: bullying, cyberbullying e o papel preventivo da escola",
    "Temas contemporâneos: a escolha da profissão e transtornos alimentares na adolescência",
    "Temas contemporâneos: família, diversidade de escolhas sexuais e gênero na escola",
    "Teorias do currículo: tradicionais, críticas e pós-críticas",
    "Acesso, permanência e sucesso escolar do aluno na educação pública brasileira",
    "Gestão da aprendizagem: mediação docente e acompanhamento pedagógico contínuo",
    "Planejamento e gestão educacional de sistemas de ensino básico",
    "Avaliação institucional, de desempenho docente e avaliação da aprendizagem",
    "O Professor: processos de formação inicial e continuada e a identidade profissional",
    "A pesquisa na prática docente: professor pesquisador de sua própria ação",
    "A dimensão ética da profissão docente e as relações humanas na escola",
    "Aspectos legais e políticos da organização da educação brasileira",
    "Políticas educacionais para a educação básica: diretrizes e rumos do Ensino Médio",
    "Diretrizes, Parâmetros Curriculares do Ensino Médio, organização curricular e avaliação",
    "Interdisciplinaridade e contextualização metodológica no Ensino Médio",
    "Ensino Médio Integrado: fundamentação legal, bases curriculares e desafios",
    "Educação Inclusiva: princípios norteadores e atendimento educacional especializado (AEE)",
    "Educação, trabalho, formação profissional e as recentes transformações do Ensino Médio",
    "Protagonismo Juvenil, cidadania e práticas de emancipação social na escola"
  ]
};

// Extractor of microcontents for other specialties dynamically from Content Hierarchy
const getMicroSyllabusForSpecialty = (spec: string): string[] => {
  if (SEDUC_CE_MICRO_SYLLABUS[spec]) {
    return SEDUC_CE_MICRO_SYLLABUS[spec];
  }
  
  const specData = CONTENT_HIERARCHY["Conhecimentos Específicos"]?.specialties?.[spec];
  if (specData && specData.topics) {
    const list: string[] = [];
    specData.topics.forEach(t => {
      t.subtopics.forEach(sub => {
        list.push(`${t.name}: ${sub}`);
      });
    });
    if (list.length > 0) return list;
  }

  // Fallback if the specialty doesn't have detailed lists
  return [
    `Fundamentos Teóricos e Conceituais de ${spec}`,
    `Planejamento e Práticas Pedagógicas aplicadas ao ensino de ${spec}`,
    `Metodologias Ativas e Tecnologias de Aprendizagem em ${spec}`,
    `Análise Crítica de Materiais Didáticos e Diretrizes de ${spec}`,
    `Resolução de Problemas e Abordagem de Temas Contemporâneos em ${spec}`,
    `Avaliação e Acompanhamento Escolar em ${spec}`
  ];
};

interface StudyCalendarProps {
  activities: StudyActivity[];
  topics: ContentTopic[];
  settings: CandidateSettings;
  onUpdateSettings: (updates: Partial<CandidateSettings>) => Promise<void>;
  onAddActivity: (act: Omit<StudyActivity, "id" | "createdAt">) => Promise<void>;
  onUpdateActivity: (id: string, updates: Partial<StudyActivity>) => Promise<void>;
  onDeleteActivity: (id: string) => Promise<void>;
  onUpdateTopicStatus: (topicId: string, status: 'not_started' | 'studying' | 'studied' | 'needs_review', date?: string) => Promise<void>;
}

export default function StudyCalendar({
  activities,
  topics,
  settings,
  onUpdateSettings,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onUpdateTopicStatus
}: StudyCalendarProps) {
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states for manual activity agendamento
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0]?.id || "");
  const [selectedType, setSelectedType] = useState<'theory' | 'exercise' | 'revision'>("theory");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [activityNotes, setActivityNotes] = useState("");

  // Settings form states
  const [targetExam, setTargetExam] = useState(settings.targetExam || "SEDUC-CE (Professor)");
  const [specialty, setSpecialty] = useState(settings.specialty || "Biologia");
  const [examDate, setExamDate] = useState(settings.examDate || "");
  const [dailyStudyHours, setDailyStudyHours] = useState(settings.dailyStudyHours || 4);

  // Generator settings states
  const [genStartDate, setGenStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [genEndDate, setGenEndDate] = useState(settings.examDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [genDailyHours, setGenDailyHours] = useState(settings.dailyStudyHours || 4);
  const [genStudyPeriod, setGenStudyPeriod] = useState("Noite (19:00 - 23:00)");
  const [genStudyDays, setGenStudyDays] = useState<number[]>([1, 2, 3, 4, 5, 6]); // Segunda to Sábado as default

  // Sort activities chronologically by date for study progression
  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
  }, [activities]);

  const todayStr = new Date().toISOString().split('T')[0];

  const [calendarViewMode, setCalendarViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(todayStr);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (activities.length > 0) {
      const sorted = [...activities].sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
      return new Date(sorted[0].scheduledDate + "T00:00:00");
    }
    return new Date();
  });

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: Array<{ dateStr: string; isCurrentMonth: boolean; dayNum: number }> = [];

    // Trailing days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, isCurrentMonth: false, dayNum: d });
    }

    // Days of current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, isCurrentMonth: true, dayNum: d });
    }

    // Remaining slots to complete a full 6-row (42 cells) grid
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, isCurrentMonth: false, dayNum: d });
    }

    return days;
  }, [currentMonth]);

  const selectedDateActivities = useMemo(() => {
    return activities.filter(act => act.scheduledDate === selectedCalendarDate);
  }, [activities, selectedCalendarDate]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings({
      targetExam,
      specialty,
      examDate,
      dailyStudyHours: Number(dailyStudyHours)
    });
    // Update the generator end date to match the new exam date automatically
    setGenEndDate(examDate);
    setShowSettingsForm(false);
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    const topic = topics.find(t => t.id === selectedTopicId);
    if (!topic) return;

    await onAddActivity({
      topicId: selectedTopicId,
      topicName: topic.name,
      subject: topic.subject,
      type: selectedType,
      status: "planned",
      scheduledDate,
      durationMinutes,
      notes: activityNotes,
      theoryDone: false,
      questionsDone: false,
      revisionDone: false
    });

    setActivityNotes("");
    setIsAddingActivity(false);
  };

  // Strategic Generator Function following user requirements and weights of SEDUC-CE
  const handleGenerateSchedule = async () => {
    if (!confirm("Isso irá deletar todas as atividades de estudo agendadas atualmente para criar um novo cronograma estratégico, distribuído em 3 blocos diários de diferentes assuntos até o dia da prova que você inseriu. Deseja prosseguir?")) {
      return;
    }

    try {
      setIsGenerating(true);

      // 1. Clear all current activities from Firestore
      for (const act of activities) {
        await onDeleteActivity(act.id);
      }

      // 2. Generate strategic activities up to the exam date using candidate settings
      const newActivities = generateFull74DaySchedule(genStartDate, settings, topics, {
        studyDays: genStudyDays,
        dailyHours: genDailyHours,
        examDate: genEndDate
      });
      for (const act of newActivities) {
        await onAddActivity(act);
      }

      setShowGenerator(false);
      alert("Seu Cronograma Inteligente SEDUC-CE foi gerado e distribuído no seu calendário com sucesso (3 blocos de estudo diários organizados até a data da prova)!");
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar cronograma de estudos.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Separate TQR Progress Tracking with immediate DB update & Content Map feedback
  const handleToggleTQR = async (act: StudyActivity, marker: 'T' | 'Q' | 'R') => {
    const updates: Partial<StudyActivity> = {};
    
    const isTheoryDone = marker === 'T' ? !act.theoryDone : !!act.theoryDone;
    const isQuestionsDone = marker === 'Q' ? !act.questionsDone : !!act.questionsDone;
    const isRevisionDone = marker === 'R' ? !act.revisionDone : !!act.revisionDone;

    if (marker === 'T') updates.theoryDone = isTheoryDone;
    if (marker === 'Q') updates.questionsDone = isQuestionsDone;
    if (marker === 'R') updates.revisionDone = isRevisionDone;

    const allCompleted = isTheoryDone && isQuestionsDone && isRevisionDone;
    updates.status = allCompleted ? 'completed' : 'planned';
    updates.completionDate = allCompleted ? new Date().toISOString().split('T')[0] : undefined;

    // Save to Firestore
    await onUpdateActivity(act.id, updates);

    // Dynamic feed-back to Content Map (Tópicos do Edital)
    const topicIds = act.topicId.split(',');
    for (const id of topicIds) {
      const trimmedId = id.trim();
      if (!trimmedId) continue;
      if (allCompleted) {
        await onUpdateTopicStatus(trimmedId, 'studied', new Date().toISOString().split('T')[0]);
      } else if (isTheoryDone || isQuestionsDone || isRevisionDone) {
        await onUpdateTopicStatus(trimmedId, 'studying');
      } else {
        await onUpdateTopicStatus(trimmedId, 'not_started');
      }
    }
  };

  // Professional printing template
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printSyllabusRows = sortedActivities.map(act => {
      const dateObj = new Date(act.scheduledDate + "T00:00:00");
      const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const dayOfWeek = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
      const dayOfWeekCapitalized = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
      
      const durationHours = act.durationMinutes ? Math.floor(act.durationMinutes / 60) : settings.dailyStudyHours;

      return `
        <tr>
          <td><strong>${formattedDate}</strong></td>
          <td>${dayOfWeekCapitalized}</td>
          <td><span class="badge">${act.subject}</span></td>
          <td>
            <div style="font-weight: 700; color: #1e293b; margin-bottom: 2px;">${act.topicName}</div>
            <div style="font-size: 10px; color: #64748b; font-style: italic;">${act.notes || ''}</div>
          </td>
          <td>${durationHours} Horas (${genStudyPeriod})</td>
          <td>
            <div class="tqr-indicator">
              <span class="tqr-item ${act.theoryDone ? 'active' : ''}">T</span>
              <span class="tqr-item ${act.questionsDone ? 'active' : ''}">Q</span>
              <span class="tqr-item ${act.revisionDone ? 'active' : ''}">R</span>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Plano de Estudos SEDUC-CE - ${settings.specialty}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');
            body { font-family: 'Inter', sans-serif; color: #1e293b; margin: 30px; padding: 0; line-height: 1.4; }
            .header-container { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: -0.5px; }
            p.subtitle { font-size: 13px; color: #64748b; margin: 0; font-weight: 500; }
            .meta-grid { display: grid; grid-template-cols: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
            .meta-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; text-align: center; }
            .meta-card span { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 3px; }
            .meta-card p { font-size: 12px; font-weight: 700; color: #1e293b; margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th { background-color: #0f172a; color: white; text-transform: uppercase; font-size: 9px; font-weight: 700; letter-spacing: 0.5px; padding: 12px 10px; text-align: left; }
            td { border-bottom: 1px solid #e2e8f0; padding: 12px 10px; text-align: left; vertical-align: top; }
            tr:nth-child(even) td { background-color: #f8fafc; }
            .badge { background-color: #f1f5f9; color: #334155; font-size: 9px; font-weight: 700; padding: 3px 6px; border-radius: 4px; border: 1px solid #e2e8f0; display: inline-block; }
            .tqr-indicator { display: flex; gap: 8px; }
            .tqr-item { font-size: 9px; font-weight: 800; border: 1px solid #cbd5e1; color: #94a3b8; width: 18px; height: 18px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; }
            .tqr-item.active { background-color: #10b981; color: white; border-color: #10b981; }
            @media print {
              body { margin: 15px; }
              th { background-color: #000 !important; color: #fff !important; -webkit-print-color-adjust: exact; }
              .meta-card { background: #fff !important; border: 1px solid #ccc !important; }
              tr:nth-child(even) td { background-color: #fcfcfc !important; }
            }
          </style>
        </head>
        <body>
          <div class="header-container">
            <h1>Aprova Professor - Cronograma Oficial de Estudos</h1>
            <p class="subtitle">Planejamento Estratégico Preparatório SEDUC-CE</p>
          </div>
          
          <div class="meta-grid">
            <div class="meta-card">
              <span>Especialidade</span>
              <p>${settings.specialty}</p>
            </div>
            <div class="meta-card">
              <span>Banca Examinadora</span>
              <p>${settings.examBoard}</p>
            </div>
            <div class="meta-card">
              <span>Metas de Tempo</span>
              <p>${settings.dailyStudyHours} Horas/Dia</p>
            </div>
            <div class="meta-card">
              <span>Data da Prova</span>
              <p>${settings.examDate ? new Date(settings.examDate + "T00:00:00").toLocaleDateString('pt-BR') : 'Não agendada'}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 10%;">Data</th>
                <th style="width: 12%;">Dia da Semana</th>
                <th style="width: 20%;">Área / Disciplina</th>
                <th style="width: 38%;">Conteúdo Programático Detalhado</th>
                <th style="width: 12%;">Horário</th>
                <th style="width: 8%;">Progresso</th>
              </tr>
            </thead>
            <tbody>
              ${printSyllabusRows}
            </tbody>
          </table>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  return (
    <div id="calendar-planning-container" className="space-y-6">
      
      {/* Settings Summary & Edit block */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-light-navy text-brand-navy rounded-xl border border-brand-navy/5">
              <Settings className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-brand-navy font-display uppercase tracking-wider font-sans">Seu Planejamento Pessoal</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 font-sans">Metas e Foco Definidos</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setShowGenerator(!showGenerator);
                setShowSettingsForm(false);
              }}
              className="text-xs font-bold text-brand-green hover:bg-brand-light-green/60 px-3.5 py-1.5 bg-brand-light-green border border-brand-green/10 rounded-lg transition-all cursor-pointer"
            >
              {showGenerator ? "Ocultar Gerador" : "Gerador Inteligente"}
            </button>
            <button
              onClick={() => {
                setShowSettingsForm(!showSettingsForm);
                setShowGenerator(false);
              }}
              className="text-xs font-bold text-brand-navy hover:bg-brand-light-navy/50 px-3.5 py-1.5 bg-brand-light-navy border border-brand-navy/10 rounded-lg transition-all cursor-pointer"
            >
              {showSettingsForm ? "Ocultar Ajustes" : "Ajustar Planejamento"}
            </button>
          </div>
        </div>

        {showSettingsForm && (
          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-sans">Cargo / Concurso</label>
              <input
                type="text"
                required
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-green font-sans"
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-sans">Disciplina (Especifica)</label>
              <select
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-green font-sans"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              >
                {EDUCATION_SPECIALTIES.map(esp => (
                  <option key={esp} value={esp}>{esp}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-sans">Data da Prova</label>
              <input
                type="date"
                required
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-sans"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-sans">Horas Diárias de Estudo</label>
              <div className="flex gap-2 font-sans">
                <input
                  type="number"
                  min="1"
                  max="16"
                  required
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-sans"
                  value={dailyStudyHours}
                  onChange={(e) => setDailyStudyHours(Number(e.target.value))}
                />
                <button
                  type="submit"
                  className="px-4.5 bg-brand-green text-white font-bold text-xs rounded-xl hover:bg-brand-green/95 cursor-pointer shadow-sm transition-all"
                >
                  Salvar
                </button>
              </div>
            </div>
          </form>
        )}

        {showGenerator && (
          <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 pb-1 border-b border-emerald-100/60">
              <Sparkles className="h-4.5 w-4.5 text-brand-green" />
              <h4 className="text-xs font-extrabold text-brand-navy font-display uppercase tracking-wider font-sans">Gerador de Cronograma Inteligente SEDUC-CE</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase font-sans">Início do Cronograma</label>
                <input
                  type="date"
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-sans"
                  value={genStartDate}
                  onChange={(e) => setGenStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase font-sans">Término (Data da Prova)</label>
                <input
                  type="date"
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-sans"
                  value={genEndDate}
                  onChange={(e) => setGenEndDate(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase font-sans">Carga Diária (Horas)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-sans"
                  value={genDailyHours}
                  onChange={(e) => setGenDailyHours(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase font-sans">Período / Horário</label>
                <input
                  type="text"
                  placeholder="Ex: Noite (19:00 - 23:00)"
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-sans"
                  value={genStudyPeriod}
                  onChange={(e) => setGenStudyPeriod(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase block font-sans">Dias da semana disponíveis para estudar:</label>
              <div className="flex flex-wrap gap-3 font-sans">
                {[1, 2, 3, 4, 5, 6, 0].map(dayNum => {
                  const isChecked = genStudyDays.includes(dayNum);
                  return (
                    <label key={dayNum} className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        className="rounded text-brand-green focus:ring-brand-green h-3.5 w-3.5 border-slate-300"
                        onChange={() => {
                          if (isChecked) {
                            setGenStudyDays(genStudyDays.filter(d => d !== dayNum));
                          } else {
                            setGenStudyDays([...genStudyDays, dayNum].sort());
                          }
                        }}
                      />
                      {dayNames[dayNum]}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2 border-t border-emerald-100/60 font-sans">
              <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-brand-amber shrink-0 animate-pulse" />
                A distribuição estratégica considerará o peso exato de Conhecimentos Específicos (~62.5% do edital).
              </div>
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateSchedule}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-brand-green hover:bg-brand-green/95 text-white rounded-xl text-xs font-extrabold cursor-pointer disabled:opacity-50 shadow-sm transition-all uppercase tracking-wide font-sans"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Gerando...
                  </>
                ) : (
                  <>
                    <Sliders className="h-3.5 w-3.5" /> Gerar Meu Cronograma Oficial
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {!showSettingsForm && !showGenerator && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
            <div className="p-3 bg-slate-50/55 border border-slate-100 rounded-xl space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase font-sans">Especialidade</span>
              <p className="font-extrabold text-brand-navy font-sans">{settings.specialty}</p>
            </div>
            <div className="p-3 bg-slate-50/55 border border-slate-100 rounded-xl space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase font-sans">Banca Examinadora</span>
              <p className="font-extrabold text-brand-navy font-sans">{settings.examBoard}</p>
            </div>
            <div className="p-3 bg-slate-50/55 border border-slate-100 rounded-xl space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase font-sans">Data Estimada</span>
              <p className="font-extrabold text-brand-navy font-sans">
                {settings.examDate ? new Date(settings.examDate + "T00:00:00").toLocaleDateString('pt-BR') : "Não agendada"}
              </p>
            </div>
            <div className="p-3 bg-slate-50/55 border border-slate-100 rounded-xl space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase font-sans">Carga Horária</span>
              <p className="font-extrabold text-brand-navy font-sans">{settings.dailyStudyHours} horas/dia</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Agenda Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Agenda List - Microcontents Study Table */}
        <div className="lg:col-span-9 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
          {/* Tabs for Calendar vs List */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex gap-2">
              <button
                onClick={() => setCalendarViewMode('calendar')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  calendarViewMode === 'calendar'
                    ? "bg-brand-navy text-white border-brand-navy shadow-sm"
                    : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
                }`}
              >
                <CalendarIcon className="h-3.5 w-3.5" /> Calendário Mensal
              </button>
              <button
                onClick={() => setCalendarViewMode('list')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  calendarViewMode === 'list'
                    ? "bg-brand-navy text-white border-brand-navy shadow-sm"
                    : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
                }`}
              >
                <CalendarCheck className="h-3.5 w-3.5" /> Lista Cronológica ({sortedActivities.length})
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 px-4 py-2 bg-brand-light-navy hover:bg-brand-light-navy/70 text-brand-navy border border-brand-navy/10 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs font-sans"
              >
                <Printer className="h-3.5 w-3.5" /> Imprimir Cronograma
              </button>
              <button
                onClick={() => {
                  setScheduledDate(selectedCalendarDate);
                  setIsAddingActivity(true);
                }}
                className="flex items-center gap-1 px-4 py-2 bg-brand-green hover:bg-brand-green/95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs font-sans"
              >
                <Plus className="h-3.5 w-3.5" /> Agendar Ciclo Manual
              </button>
            </div>
          </div>

          {/* Form to schedule a new study activity manually */}
          {isAddingActivity && (
            <form onSubmit={handleCreateActivity} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4 animate-fade-in font-sans">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-[10px] font-extrabold text-brand-navy uppercase tracking-wide">Agendar Novo Ciclo Manual</span>
                <button
                  type="button"
                  onClick={() => setIsAddingActivity(false)}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Fechar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Assunto do Edital</label>
                  <select
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none"
                    value={selectedTopicId}
                    onChange={(e) => setSelectedTopicId(e.target.value)}
                  >
                    {topics.map(t => (
                      <option key={t.id} value={t.id}>[{t.subject.substring(0, 15)}...] {t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Tipo de Estudo</label>
                  <select
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as any)}
                  >
                    <option value="theory">Teoria / Leitura</option>
                    <option value="exercise">Resolução de Exercícios</option>
                    <option value="revision">Revisão Periódica</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Data de Execução</label>
                  <input
                    type="date"
                    required
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Duração Esperada (minutos)</label>
                  <input
                    type="number"
                    min="15"
                    max="600"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Meta ou Foco Específico</label>
                <input
                  type="text"
                  placeholder="Ex: Ler capítulo de organelas e resolver 15 questões."
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none"
                  value={activityNotes}
                  onChange={(e) => setActivityNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-green hover:bg-brand-green/95 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Gravar Atividade no Calendário
              </button>
            </form>
          )}

          {calendarViewMode === 'calendar' ? (
            <div className="space-y-6">
              {/* Month Navigation Header */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <h4 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider font-sans">
                    Navegação por Mês de Estudos
                  </h4>
                  <p className="text-[14px] font-extrabold text-brand-green uppercase tracking-wide mt-1">
                    {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 cursor-pointer"
                    title="Mês Anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 cursor-pointer"
                    title="Próximo Mês"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 bg-slate-50/30 p-4 rounded-2xl border border-slate-100">
                {/* Weekdays */}
                {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(day => (
                  <div key={day} className="text-center text-[10px] font-extrabold text-slate-400 py-1.5 uppercase tracking-wider font-sans">
                    {day}
                  </div>
                ))}

                {/* Days */}
                {calendarDays.map(({ dateStr, isCurrentMonth, dayNum }) => {
                  const dayActs = activities.filter(act => act.scheduledDate === dateStr);
                  const isSelected = dateStr === selectedCalendarDate;
                  const isToday = dateStr === todayStr;
                  const hasActs = dayActs.length > 0;
                  
                  let bgClass = "bg-white hover:bg-slate-50 text-slate-700";
                  let borderClass = "border-slate-100";
                  let textClass = isCurrentMonth ? "text-slate-800 font-bold" : "text-slate-300 font-medium";

                  if (hasActs) {
                    const completedCount = dayActs.filter(act => act.status === 'completed').length;
                    const isFullyCompleted = completedCount === dayActs.length;
                    const someStarted = dayActs.some(act => act.theoryDone || act.questionsDone || act.revisionDone);

                    if (isFullyCompleted) {
                      bgClass = "bg-emerald-50 hover:bg-emerald-100/70 text-emerald-800";
                      borderClass = "border-emerald-100";
                      textClass = "text-emerald-800 font-extrabold";
                    } else if (someStarted) {
                      bgClass = "bg-blue-50/50 hover:bg-blue-50 text-blue-800";
                      borderClass = "border-blue-100";
                      textClass = "text-blue-800 font-extrabold";
                    } else {
                      bgClass = "bg-brand-light-navy/35 hover:bg-brand-light-navy/50 text-brand-navy";
                      borderClass = "border-brand-navy/10";
                      textClass = "text-brand-navy font-extrabold";
                    }
                  }

                  if (isSelected) {
                    borderClass = "border-brand-green border-2 ring-2 ring-brand-green/15";
                  }

                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedCalendarDate(dateStr)}
                      className={`relative min-h-[50px] aspect-square p-1.5 border rounded-xl flex flex-col justify-between items-start transition-all cursor-pointer ${bgClass} ${borderClass}`}
                    >
                      <span className={`text-[11px] leading-none ${textClass}`}>
                        {dayNum}
                      </span>

                      {isToday && (
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-green rounded-full"></span>
                      )}

                      {hasActs && (
                        <div className="w-full flex items-center justify-between mt-auto">
                          <span className={`text-[8px] font-extrabold leading-none px-1.5 py-0.5 rounded-md ${
                            dayActs.every(act => act.status === 'completed')
                              ? "bg-emerald-500 text-white"
                              : "bg-brand-navy text-white"
                          }`}>
                            {dayActs.length} {dayActs.length === 1 ? 'eixo' : 'eixos'}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Day's Activities Detail Panel */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4 animate-fade-in font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4.5 w-4.5 text-brand-navy" />
                    <div>
                      <h4 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider font-display">
                        Dia selecionado: {new Date(selectedCalendarDate + "T12:00:00").toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', weekday: 'long' })}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Microconteúdos Mapeados do Edital</p>
                    </div>
                  </div>
                  {selectedDateActivities.length > 0 && (
                    <span className="text-[10px] font-extrabold text-slate-500 bg-white border border-slate-100 px-2.5 py-1 rounded-lg">
                      {selectedDateActivities.filter(a => a.status === 'completed').length} de {selectedDateActivities.length} concluídos
                    </span>
                  )}
                </div>

                {selectedDateActivities.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs font-semibold">
                    <p>Nenhum conteúdo agendado para este dia.</p>
                    <button
                      onClick={() => {
                        setScheduledDate(selectedCalendarDate);
                        setIsAddingActivity(true);
                      }}
                      className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-brand-navy hover:bg-brand-navy/95 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Agendar Ciclo para este dia
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateActivities.map(act => {
                      const totalProgressCount = (act.theoryDone ? 1 : 0) + (act.questionsDone ? 1 : 0) + (act.revisionDone ? 1 : 0);
                      const progressPercent = Math.round((totalProgressCount / 3) * 100);

                      return (
                        <div key={act.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-2xs space-y-3.5">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                                act.subject.includes("Conhecimentos Específicos")
                                  ? "bg-brand-light-navy text-brand-navy border-brand-navy/10"
                                  : act.subject.includes("Simulado")
                                  ? "bg-brand-light-amber text-brand-navy border-brand-amber/15"
                                  : act.subject.includes("Revisão")
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}>
                                {act.subject}
                              </span>
                              <h5 className={`font-bold text-[12px] leading-snug ${act.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                {act.topicName}
                              </h5>
                              {act.notes && (
                                <p className="text-[10px] text-slate-400 italic leading-relaxed">
                                  {act.notes}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mr-2 whitespace-nowrap">
                                <Clock className="h-3.5 w-3.5" />
                                {act.durationMinutes ? `${act.durationMinutes} min` : `${settings.dailyStudyHours}h`}
                              </span>

                              <button
                                onClick={async () => {
                                  if (confirm("Remover esta linha de estudo?")) {
                                    await onDeleteActivity(act.id);
                                  }
                                }}
                                className="p-1 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-md transition-colors cursor-pointer"
                                title="Remover"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Progress TQR check row */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metodologia de Estudos (TQR):</span>
                            
                            <div className="flex items-center gap-2">
                              {/* T = Teoria */}
                              <button 
                                onClick={() => handleToggleTQR(act, 'T')}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
                                  act.theoryDone 
                                    ? "bg-emerald-500 border-emerald-600 text-white shadow-xs" 
                                    : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                                }`}
                              >
                                {act.theoryDone && <Check className="h-3 w-3" />}
                                Teoria (T)
                              </button>

                              {/* Q = Questões */}
                              <button 
                                onClick={() => handleToggleTQR(act, 'Q')}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
                                  act.questionsDone 
                                    ? "bg-brand-navy border-brand-navy/60 text-white shadow-xs" 
                                    : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                                }`}
                              >
                                {act.questionsDone && <Check className="h-3 w-3" />}
                                Questões (Q)
                              </button>

                              {/* R = Revisão */}
                              <button 
                                onClick={() => handleToggleTQR(act, 'R')}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
                                  act.revisionDone 
                                    ? "bg-amber-500 border-amber-600 text-white shadow-xs" 
                                    : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                                }`}
                              >
                                {act.revisionDone && <Check className="h-3 w-3" />}
                                Revisão (R)
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left text-xs font-medium">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="py-3.5 px-4 font-bold text-slate-500 uppercase tracking-wider w-[12%] font-sans">Data</th>
                    <th className="py-3.5 px-4 font-bold text-slate-500 uppercase tracking-wider w-[13%] font-sans">Dia</th>
                    <th className="py-3.5 px-4 font-bold text-slate-500 uppercase tracking-wider w-[22%] font-sans">Área / Disciplina</th>
                    <th className="py-3.5 px-4 font-bold text-slate-500 uppercase tracking-wider w-[35%] font-sans">Conteúdo Programático Detalhado</th>
                    <th className="py-3.5 px-4 font-bold text-slate-500 uppercase tracking-wider w-[10%] font-sans">Horário</th>
                    <th className="py-3.5 px-4 font-bold text-slate-500 uppercase tracking-wider w-[12%] font-sans text-center">Progresso</th>
                    <th className="py-3.5 px-4 font-bold text-slate-500 uppercase tracking-wider w-[6%] font-sans text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedActivities.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 text-xs font-semibold font-sans">
                        <div className="flex flex-col items-center gap-2">
                          <AlertTriangle className="h-6 w-6 text-slate-300" />
                          <span>Nenhum cronograma de estudos gerado. Utilize o "Gerador Inteligente" acima!</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedActivities.map((act) => {
                      const dateObj = new Date(act.scheduledDate + "T00:00:00");
                      const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                      const dayOfWeek = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
                      const dayOfWeekCapitalized = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

                      const isToday = act.scheduledDate === todayStr;
                      const isOverdue = act.status === "planned" && act.scheduledDate < todayStr;
                      const durationHrs = act.durationMinutes ? Math.floor(act.durationMinutes / 60) : settings.dailyStudyHours;

                      const totalProgressCount = (act.theoryDone ? 1 : 0) + (act.questionsDone ? 1 : 0) + (act.revisionDone ? 1 : 0);
                      const progressPercent = Math.round((totalProgressCount / 3) * 100);

                      return (
                        <tr 
                          key={act.id} 
                          className={`transition-colors font-sans ${
                            act.status === "completed" 
                              ? "bg-slate-50/40 text-slate-400" 
                              : isToday 
                              ? "bg-emerald-50/30 text-slate-800 font-semibold" 
                              : isOverdue 
                              ? "bg-rose-50/10 text-slate-800" 
                              : "bg-white hover:bg-slate-50/30 text-slate-700"
                          }`}
                        >
                          {/* DATA */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                              isToday 
                                ? "bg-brand-navy text-white" 
                                : isOverdue 
                                ? "bg-rose-100 text-rose-700 border border-rose-200" 
                                : "bg-slate-100 text-slate-700 border border-slate-200/60"
                            }`}>
                              {formattedDate}
                            </span>
                          </td>

                          {/* DIA DA SEMANA */}
                          <td className="py-4 px-4 whitespace-nowrap text-[11px] font-bold text-slate-500">
                            {dayOfWeekCapitalized}
                            {isToday && (
                              <span className="block text-[8px] text-brand-green uppercase font-bold tracking-wider animate-pulse mt-0.5">
                                Hoje
                              </span>
                            )}
                          </td>

                          {/* ÁREA / DISCIPLINA */}
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                              act.subject.includes("Conhecimentos Específicos")
                                ? "bg-brand-light-navy text-brand-navy border-brand-navy/10"
                                : act.subject.includes("Simulado")
                                ? "bg-brand-light-amber text-brand-navy border-brand-amber/15"
                                : act.subject.includes("Revisão")
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}>
                              {act.subject}
                            </span>
                          </td>

                          {/* CONTEÚDO PROGRAMÁTICO DETALHADO */}
                          <td className="py-4 px-4">
                            <p className={`font-bold text-[11.5px] leading-tight ${act.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                              {act.topicName}
                            </p>
                            {act.notes && (
                              <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed mt-1">
                                {act.notes}
                              </p>
                            )}
                          </td>

                          {/* HORÁRIO */}
                          <td className="py-4 px-4 whitespace-nowrap text-slate-500 font-bold">
                            <span className="flex items-center gap-1 text-[11px]">
                              <Clock className="h-3 w-3 text-slate-400" />
                              {durationHrs}h ({genStudyPeriod.split(' ')[0]})
                            </span>
                          </td>

                          {/* PROGRESSO TQR CHECKBOXES */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              {/* T = Teoria */}
                              <label 
                                onClick={() => handleToggleTQR(act, 'T')}
                                className={`w-7 h-7 flex items-center justify-center rounded-lg border text-[10px] font-extrabold cursor-pointer transition-all ${
                                  act.theoryDone 
                                    ? "bg-emerald-500 border-emerald-600 text-white shadow-xs" 
                                    : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                                }`}
                                title="Teoria Estudada"
                              >
                                T
                              </label>

                              {/* Q = Questões */}
                              <label 
                                onClick={() => handleToggleTQR(act, 'Q')}
                                className={`w-7 h-7 flex items-center justify-center rounded-lg border text-[10px] font-extrabold cursor-pointer transition-all ${
                                  act.questionsDone 
                                    ? "bg-brand-navy border-brand-navy/60 text-white shadow-xs" 
                                    : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                                }`}
                                title="Questões Resolvidas"
                              >
                                Q
                              </label>

                              {/* R = Revisão */}
                              <label 
                                onClick={() => handleToggleTQR(act, 'R')}
                                className={`w-7 h-7 flex items-center justify-center rounded-lg border text-[10px] font-extrabold cursor-pointer transition-all ${
                                  act.revisionDone 
                                    ? "bg-amber-500 border-amber-600 text-white shadow-xs" 
                                    : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                                }`}
                                title="Revisão Concluída"
                              >
                                R
                              </label>
                            </div>
                            {progressPercent > 0 && (
                              <div className="w-full bg-slate-100 rounded-full h-1 mt-2 overflow-hidden">
                                <div 
                                  className={`h-1 rounded-full transition-all duration-300 ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-brand-navy'}`}
                                  style={{ width: `${progressPercent}%` }}
                                ></div>
                              </div>
                            )}
                          </td>

                          {/* DELETE ACTION */}
                          <td className="py-4 px-4 whitespace-nowrap text-center">
                            <button
                              onClick={async () => {
                                if (confirm("Remover esta linha de estudo do seu cronograma?")) {
                                  await onDeleteActivity(act.id);
                                }
                              }}
                              className="p-1.5 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                              title="Remover Registro"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Sidebar - Strategy Indicators */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Active Performance Indicator */}
          <div className="bg-brand-light-navy/70 border border-brand-navy/10 rounded-2xl p-5 shadow-sm space-y-4 font-sans">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-brand-green" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy font-display">TQR Integrado</h3>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              O acompanhamento do seu edital SEDUC-CE é feito por etapas de aprendizagem para cada microconteúdo:
            </p>
            
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 flex items-center justify-center shrink-0 rounded bg-emerald-500 text-white font-extrabold text-[9px]">T</span>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-700 uppercase">Teoria Estudada</h4>
                  <p className="text-[9.5px] text-slate-400 font-medium">Leitura ativa de PDF, resumos ou videoaulas doutrinárias.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 flex items-center justify-center shrink-0 rounded bg-brand-navy text-white font-extrabold text-[9px]">Q</span>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-700 uppercase">Questões Resolvidas</h4>
                  <p className="text-[9.5px] text-slate-400 font-medium">Bateria de exercícios práticos da banca FUNECE no simulador.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 flex items-center justify-center shrink-0 rounded bg-amber-500 text-white font-extrabold text-[9px]">R</span>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-700 uppercase">Revisão Realizada</h4>
                  <p className="text-[9.5px] text-slate-400 font-medium">Revisões periódicas agendadas para consolidação de longo prazo.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FUNECE Weight Stats */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 font-sans">
            <div className="flex items-center gap-2 text-brand-green">
              <TrendingUp className="h-4 w-4" />
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-navy font-display">Peso da Última Prova</h4>
            </div>
            
            <div className="space-y-2.5 pt-1 text-[11px] font-semibold text-slate-500">
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span>Conhecimentos Específicos</span>
                <span className="text-brand-navy font-bold">50 Questões (62.5%)</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span>Língua Portuguesa</span>
                <span className="text-brand-navy font-bold">8 Questões (10%)</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span>Temas Educacionais</span>
                <span className="text-brand-navy font-bold">8 Questões (10%)</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span>Indicadores de Dados</span>
                <span className="text-brand-navy font-bold">8 Questões (10%)</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span>Administração Pública</span>
                <span className="text-brand-navy font-bold">6 Questões (7.5%)</span>
              </div>
            </div>
            <p className="text-[9.5px] text-slate-400 italic leading-normal text-center pt-1 font-medium">
              Sua distribuição estratégica de estudo segue exatamente essa proporção da FUNECE.
            </p>
          </div>

          {/* Quick Study Advice for Teachers */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 font-sans">
            <div className="flex items-center gap-2 text-brand-amber">
              <AlertTriangle className="h-4 w-4" />
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-navy font-display">Método Pró-Professor</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
              Ao marcar todas as 3 etapas (<strong className="text-emerald-600 font-bold">T</strong>, <strong className="text-brand-navy font-bold">Q</strong>, <strong className="text-amber-500 font-bold">R</strong>) de um dia, a matéria correspondente será atualizada como <strong className="text-slate-600">Estudada</strong> no seu painel geral do Aprova Professor.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
