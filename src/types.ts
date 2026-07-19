export interface ContentTopic {
  id: string;
  subject: string; // ex: "Língua Portuguesa", "Didática e Fundamentos", "Legislação Educacional", "Conhecimentos Específicos"
  axis: string; // ex: "Gramática e Sintaxe", "Planejamento e Avaliação", "Normativas Nacionais"
  name: string; // ex: "Lei de Diretrizes e Bases da Educação - LDB (Lei nº 9.394/1996)"
  relevance: 'crucial' | 'high' | 'medium' | 'low'; // Evidência/Frequência de cobrança (FUNECE/UECE)
  importanceScore: number; // Índice de relevância de 0 a 100 baseado no perfil da banca
  status: 'not_started' | 'studying' | 'studied' | 'needs_review';
  lastStudiedAt?: string; // YYYY-MM-DD
  totalQuestionsSolved: number;
  correctQuestionsSolved: number;
  notes?: string;
  createdAt: string;
}

export interface StudyActivity {
  id: string;
  topicId: string;
  topicName: string;
  subject: string;
  type: 'theory' | 'exercise' | 'revision';
  status: 'planned' | 'completed' | 'skipped';
  scheduledDate: string; // YYYY-MM-DD
  completionDate?: string; // YYYY-MM-DD
  notes?: string;
  durationMinutes?: number;
  createdAt: string;
  theoryDone?: boolean;
  questionsDone?: boolean;
  revisionDone?: boolean;
}

export interface Question {
  id: string;
  subject: string;
  axis: string;
  topicId: string;
  topicName: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  examBoard: string; // ex: "FUNECE" ou "UECE"
  year: number;
}

export interface MistakeRecord {
  id: string;
  questionId: string;
  topicId: string;
  topicName: string;
  subject: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  selectedOptionIndex: number;
  explanation: string;
  createdAt: string;
  resolved: boolean;
  reviewCount: number;
}

export interface CandidateSettings {
  id: string;
  targetExam: string; // ex: "SEDUC-CE (Professor de Ensino Médio)"
  examBoard: string; // ex: "FUNECE / UECE"
  specialty: string; // ex: "Biologia", "Língua Portuguesa", "História", "Geografia", "Matemática"
  examDate: string; // Data prevista (YYYY-MM-DD)
  dailyStudyHours: number;
  createdAt: string;
  candidateName?: string;
  isAlreadyTeacher?: boolean;
}

export interface AuthorizedUser {
  email: string;
  role: 'admin' | 'user';
  addedBy?: string;
  createdAt: string;
}

export const EDUCATION_SUBJECTS = [
  "Língua Portuguesa",
  "Didática e Fundamentos da Educação",
  "Legislação Educacional",
  "Conhecimentos Específicos"
];

export const EDUCATION_SPECIALTIES = [
  "Biologia",
  "Língua Portuguesa",
  "História",
  "Geografia",
  "Matemática",
  "Física",
  "Química",
  "Educação Física",
  "Sociologia",
  "Filosofia",
  "Arte-Educação",
  "Língua Espanhola",
  "Língua Inglesa",
  "Libras",
  "Pedagogia"
];
