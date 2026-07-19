import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  initializeFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  getDocFromServer,
  query,
  where
} from "firebase/firestore";
import { ContentTopic, StudyActivity, Question, CandidateSettings } from "../types";
import { INITIAL_CONTENT_TOPICS, SEEDED_QUESTIONS } from "../data/strategicBase";

// Firebase Config from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyDnl5RW0h7IFFJoBgS-RlwxOZ3yqpCexgI",
  authDomain: "hip-catbird-d07pf.firebaseapp.com",
  projectId: "hip-catbird-d07pf",
  storageBucket: "hip-catbird-d07pf.firebasestorage.app",
  messagingSenderId: "700389246375",
  appId: "1:700389246375:web:568aad5b77ef351fcd2282"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firestore with specific database ID if provided
const db = initializeFirestore(app, {}, "ai-studio-gestodearcondici-987332c2-b615-4015-a20c-da5d35a46e6b");

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

// Pre-seeded initial study activities
const initialStudyActivities: StudyActivity[] = [
  {
    id: "act-001",
    topicId: "topic-lp-1",
    topicName: "Compreensão e Interpretação de Textos de Variados Gêneros",
    subject: "Língua Portuguesa",
    type: "theory",
    status: "completed",
    scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    durationMinutes: 90,
    notes: "Leitura teórica aprofundada dos principais gêneros (narrativo, descritivo, dissertativo). Elaboração de resumos focados no perfil da FUNECE.",
    createdAt: new Date().toISOString()
  },
  {
    id: "act-002",
    topicId: "topic-did-1",
    topicName: "Tendências Pedagógicas na Prática Escolar Brasileira",
    subject: "Didática e Fundamentos da Educação",
    type: "theory",
    status: "completed",
    scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    durationMinutes: 120,
    notes: "Análise profunda das tendências Liberais e Progressistas. Foco especial em Libâneo, Paulo Freire e Demerval Saviani.",
    createdAt: new Date().toISOString()
  },
  {
    id: "act-003",
    topicId: "topic-leg-1",
    topicName: "LDB (Lei nº 9.394/1996): Princípios, Fins e Organização da Educação Nacional",
    subject: "Legislação Educacional",
    type: "theory",
    status: "planned",
    scheduledDate: new Date().toISOString().split('T')[0], // Today
    notes: "Estudar Artigos 1º ao 14º da LDB. Focar nas competências da União, Estados e Municípios.",
    createdAt: new Date().toISOString()
  },
  {
    id: "act-004",
    topicId: "topic-lp-2",
    topicName: "Sintaxe da Oração e do Período (Regência, Concordância e Crase)",
    subject: "Língua Portuguesa",
    type: "exercise",
    status: "planned",
    scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    notes: "Resolver no mínimo 15 questões de provas anteriores da UECE sobre regência verbal e crase.",
    createdAt: new Date().toISOString()
  }
];

// Seed Firestore with new educational schema
export async function seedFirestoreIfEmpty() {
  try {
    // 1. Seed Content Topics
    let topicSnap;
    try {
      topicSnap = await getDocs(collection(db, "content_topics"));
    } catch (e) {
      console.log("Creando colección content_topics...");
    }

    if (!topicSnap || topicSnap.empty) {
      console.log("Seeding Content Topics into Firestore...");
      for (const topic of INITIAL_CONTENT_TOPICS) {
        await setDoc(doc(db, "content_topics", topic.id), topic);
      }
    }

    // 2. Seed Study Activities
    let activitySnap;
    try {
      activitySnap = await getDocs(collection(db, "study_activities"));
    } catch (e) {
      console.log("Creando colección study_activities...");
    }

    if (!activitySnap || activitySnap.empty) {
      console.log("Seeding Study Activities into Firestore...");
      for (const act of initialStudyActivities) {
        await setDoc(doc(db, "study_activities", act.id), act);
      }
    }

    // 3. Seed Questions
    let questionSnap;
    try {
      questionSnap = await getDocs(collection(db, "questions"));
    } catch (e) {
      console.log("Creando colección questions...");
    }

    if (!questionSnap || questionSnap.empty) {
      console.log("Seeding UECE/FUNECE Questions into Firestore...");
      for (const question of SEEDED_QUESTIONS) {
        await setDoc(doc(db, "questions", question.id), question);
      }
    }

    // 4. Seed Candidate Settings if Empty
    let settingsSnap;
    try {
      settingsSnap = await getDocs(collection(db, "candidate_settings"));
    } catch (e) {
      console.log("Creando colección candidate_settings...");
    }

    if (!settingsSnap || settingsSnap.empty) {
      console.log("Seeding Default Candidate Settings...");
      const defaultSettings: CandidateSettings = {
        id: "default-settings",
        targetExam: "SEDUC-CE (Ceará)",
        examBoard: "FUNECE / UECE",
        specialty: "Biologia",
        examDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 120 dias a partir de hoje
        dailyStudyHours: 4,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, "candidate_settings", defaultSettings.id), defaultSettings);
    }

  } catch (error) {
    console.error("Error seeding initial educational data:", error);
  }
}

export { db, auth };
