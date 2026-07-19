import { supabase } from "./supabase.ts";
import { db } from "./index.ts";
import { candidateSettings, contentTopics, studyActivities, questions, mistakeRecords } from "./schema.ts";
import { eq } from "drizzle-orm";
import { INITIAL_CONTENT_TOPICS, SEEDED_QUESTIONS } from "../data/strategicBase.ts";

let useSupabase = true;
let tablesMissing = false;

// SQL Script for setting up Supabase
export const SUPABASE_SETUP_SQL = `
-- COPY AND PASTE THIS SCRIPT INTO YOUR SUPABASE SQL EDITOR --

-- 1. Create table for Candidate Settings
CREATE TABLE IF NOT EXISTS candidate_settings (
  id TEXT PRIMARY KEY,
  target_exam TEXT NOT NULL,
  exam_board TEXT NOT NULL,
  specialty TEXT NOT NULL,
  exam_date TEXT NOT NULL,
  daily_study_hours INTEGER NOT NULL,
  candidate_name TEXT,
  is_already_teacher BOOLEAN,
  created_at TEXT NOT NULL
);

-- 2. Create table for Content Topics
CREATE TABLE IF NOT EXISTS content_topics (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  axis TEXT NOT NULL,
  name TEXT NOT NULL,
  relevance TEXT NOT NULL,
  importance_score INTEGER NOT NULL,
  status TEXT NOT NULL,
  last_studied_at TEXT,
  total_questions_solved INTEGER NOT NULL DEFAULT 0,
  correct_questions_solved INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL
);

-- 3. Create table for Study Activities
CREATE TABLE IF NOT EXISTS study_activities (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  completion_date TEXT,
  notes TEXT,
  duration_minutes INTEGER,
  theory_done BOOLEAN DEFAULT FALSE,
  questions_done BOOLEAN DEFAULT FALSE,
  revision_done BOOLEAN DEFAULT FALSE,
  created_at TEXT NOT NULL
);

-- 4. Create table for Questions
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  axis TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  exam_board TEXT NOT NULL,
  year INTEGER NOT NULL
);

-- 5. Create table for Mistake Records
CREATE TABLE IF NOT EXISTS mistake_records (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  selected_option_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  created_at TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  review_count INTEGER NOT NULL DEFAULT 0
);

-- 6. Enable Row Level Security (RLS) on all tables to prevent direct, unauthenticated API misuse
ALTER TABLE candidate_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mistake_records ENABLE ROW LEVEL SECURITY;

-- 7. Clean up existing policies (if re-running the script) to avoid duplicates
DROP POLICY IF EXISTS "Allow secure backend on candidate_settings" ON candidate_settings;
DROP POLICY IF EXISTS "Allow secure backend on content_topics" ON content_topics;
DROP POLICY IF EXISTS "Allow secure backend on study_activities" ON study_activities;
DROP POLICY IF EXISTS "Allow secure backend on questions" ON questions;
DROP POLICY IF EXISTS "Allow secure backend on mistake_records" ON mistake_records;

-- 8. Create secure access policies based on secret App Signature header
-- This allows our Node backend to execute database operations securely using the Anon Key
-- while blocking direct anonymous browser/cURL manipulation.
-- Note: 'default-secret-signature-123456' is the default signature.
-- You can customize it by setting SUPABASE_APP_SIGNATURE in your environment variables.
CREATE POLICY "Allow secure backend on candidate_settings" ON candidate_settings
  FOR ALL TO anon, authenticated
  USING (coalesce(current_setting('request.headers', true)::jsonb->>'x-app-signature', '') = 'default-secret-signature-123456')
  WITH CHECK (coalesce(current_setting('request.headers', true)::jsonb->>'x-app-signature', '') = 'default-secret-signature-123456');

CREATE POLICY "Allow secure backend on content_topics" ON content_topics
  FOR ALL TO anon, authenticated
  USING (coalesce(current_setting('request.headers', true)::jsonb->>'x-app-signature', '') = 'default-secret-signature-123456')
  WITH CHECK (coalesce(current_setting('request.headers', true)::jsonb->>'x-app-signature', '') = 'default-secret-signature-123456');

CREATE POLICY "Allow secure backend on study_activities" ON study_activities
  FOR ALL TO anon, authenticated
  USING (coalesce(current_setting('request.headers', true)::jsonb->>'x-app-signature', '') = 'default-secret-signature-123456')
  WITH CHECK (coalesce(current_setting('request.headers', true)::jsonb->>'x-app-signature', '') = 'default-secret-signature-123456');

CREATE POLICY "Allow secure backend on questions" ON questions
  FOR ALL TO anon, authenticated
  USING (coalesce(current_setting('request.headers', true)::jsonb->>'x-app-signature', '') = 'default-secret-signature-123456')
  WITH CHECK (coalesce(current_setting('request.headers', true)::jsonb->>'x-app-signature', '') = 'default-secret-signature-123456');

CREATE POLICY "Allow secure backend on mistake_records" ON mistake_records
  FOR ALL TO anon, authenticated
  USING (coalesce(current_setting('request.headers', true)::jsonb->>'x-app-signature', '') = 'default-secret-signature-123456')
  WITH CHECK (coalesce(current_setting('request.headers', true)::jsonb->>'x-app-signature', '') = 'default-secret-signature-123456');
`;

export function checkSupabaseStatus() {
  return {
    enabled: useSupabase,
    tablesMissing,
    setupSql: SUPABASE_SETUP_SQL
  };
}

// Check if a Supabase error represents a missing table (relation does not exist)
function isMissingTableError(error: any): boolean {
  if (!error) return false;
  const msg = error.message?.toLowerCase() || "";
  const code = error.code || "";
  return code === "42P01" || msg.includes("relation") && msg.includes("exist");
}

export async function initAndSeedSupabase() {
  console.log("[Supabase] Testing connectivity and schemas...");
  try {
    // Attempt a simple select to verify table existence
    const { error } = await supabase.from("candidate_settings").select("id").limit(1);
    
    if (error) {
      if (isMissingTableError(error)) {
        console.warn("\n=========================================================================");
        console.warn("⚠️  [SUPABASE INTEGRATION WARNING]:");
        console.warn("As tabelas correspondentes ainda não existem no seu projeto do Supabase!");
        console.warn("Para usufruir da persistência em nuvem, crie as tabelas executando o script SQL.");
        console.warn("O servidor continuará funcionando salvando os dados no banco de dados local.");
        console.warn("=========================================================================\n");
        tablesMissing = true;
        useSupabase = false;
        return;
      }
      throw error;
    }

    console.log("[Supabase] Connectivity verified. Starting database seeding check...");

    // 1. Seed Candidate Settings if empty
    const { data: settings, error: sErr } = await supabase.from("candidate_settings").select("*");
    if (!sErr && (!settings || settings.length === 0)) {
      console.log("[Supabase] Seeding default settings...");
      await supabase.from("candidate_settings").insert({
        id: "default-settings",
        target_exam: "SEDUC-CE (Ceará)",
        exam_board: "FUNECE / UECE",
        specialty: "Biologia",
        exam_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daily_study_hours: 4,
        created_at: new Date().toISOString()
      });
    }

    // 2. Seed Content Topics if empty
    const { data: topics, error: tErr } = await supabase.from("content_topics").select("id").limit(1);
    if (!tErr && (!topics || topics.length === 0)) {
      console.log("[Supabase] Seeding content topics...");
      const mappedTopics = INITIAL_CONTENT_TOPICS.map(t => ({
        id: t.id,
        subject: t.subject,
        axis: t.axis,
        name: t.name,
        relevance: t.relevance,
        importance_score: t.importanceScore,
        status: t.status,
        last_studied_at: t.lastStudiedAt || null,
        total_questions_solved: t.totalQuestionsSolved || 0,
        correct_questions_solved: t.correctQuestionsSolved || 0,
        notes: t.notes || null,
        created_at: t.createdAt || new Date().toISOString()
      }));
      // Batch inserts of 50 to avoid limits
      for (let i = 0; i < mappedTopics.length; i += 50) {
        const batch = mappedTopics.slice(i, i + 50);
        await supabase.from("content_topics").insert(batch);
      }
    }

    // 3. Seed Questions if empty
    const { data: qs, error: qErr } = await supabase.from("questions").select("id").limit(1);
    if (!qErr && (!qs || qs.length === 0)) {
      console.log("[Supabase] Seeding study questions database...");
      const mappedQs = SEEDED_QUESTIONS.map(q => ({
        id: q.id,
        subject: q.subject,
        axis: q.axis,
        topic_id: q.topicId,
        topic_name: q.topicName,
        text: q.text,
        options: q.options,
        correct_index: q.correctIndex,
        explanation: q.explanation,
        exam_board: q.examBoard,
        year: q.year
      }));
      for (let i = 0; i < mappedQs.length; i += 30) {
        const batch = mappedQs.slice(i, i + 30);
        await supabase.from("questions").insert(batch);
      }
    }

    console.log("[Supabase] Seeding checks completed successfully.");
  } catch (err) {
    console.error("[Supabase] Verification or seeding failed. Falling back to Local PostgreSQL:", err);
    useSupabase = false;
  }
}

// ==========================================
// DATA ACCESS LAYER (DAL) WITH FALLBACKS
// ==========================================

// 1. CANDIDATE SETTINGS
export async function getCandidateSettings() {
  if (useSupabase) {
    try {
      const { data, error } = await supabase.from("candidate_settings").select("*");
      if (error) throw error;
      
      if (!data || data.length === 0) {
        const defaultSettings = {
          id: "default-settings",
          target_exam: "SEDUC-CE (Ceará)",
          exam_board: "FUNECE / UECE",
          specialty: "Biologia",
          exam_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          daily_study_hours: 4,
          created_at: new Date().toISOString()
        };
        await supabase.from("candidate_settings").insert(defaultSettings);
        return {
          id: defaultSettings.id,
          targetExam: defaultSettings.target_exam,
          examBoard: defaultSettings.exam_board,
          specialty: defaultSettings.specialty,
          examDate: defaultSettings.exam_date,
          dailyStudyHours: defaultSettings.daily_study_hours,
          candidateName: null,
          isAlreadyTeacher: null,
          createdAt: defaultSettings.created_at
        };
      }
      const s = data[0];
      return {
        id: s.id,
        targetExam: s.target_exam,
        examBoard: s.exam_board,
        specialty: s.specialty,
        examDate: s.exam_date,
        dailyStudyHours: s.daily_study_hours,
        candidateName: s.candidate_name || null,
        isAlreadyTeacher: s.is_already_teacher || false,
        createdAt: s.created_at
      };
    } catch (err) {
      console.error("[Supabase] Failed to fetch settings, falling back:", err);
    }
  }

  // Fallback to Drizzle PostgreSQL
  const list = await db.select().from(candidateSettings);
  if (list.length === 0) {
    const defaultSettings = {
      id: "default-settings",
      targetExam: "SEDUC-CE (Ceará)",
      examBoard: "FUNECE / UECE",
      specialty: "Biologia",
      examDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dailyStudyHours: 4,
      createdAt: new Date().toISOString()
    };
    await db.insert(candidateSettings).values(defaultSettings);
    return defaultSettings;
  }
  return list[0];
}

export async function updateCandidateSettings(updates: any) {
  const dbFields: any = {};
  if (updates.targetExam !== undefined) dbFields.target_exam = updates.targetExam;
  if (updates.examBoard !== undefined) dbFields.exam_board = updates.examBoard;
  if (updates.specialty !== undefined) dbFields.specialty = updates.specialty;
  if (updates.examDate !== undefined) dbFields.exam_date = updates.examDate;
  if (updates.dailyStudyHours !== undefined) dbFields.daily_study_hours = updates.dailyStudyHours;
  if (updates.candidateName !== undefined) dbFields.candidate_name = updates.candidateName;
  if (updates.isAlreadyTeacher !== undefined) dbFields.is_already_teacher = updates.isAlreadyTeacher;

  if (useSupabase) {
    try {
      const { data: current } = await supabase.from("candidate_settings").select("id");
      if (current && current.length > 0) {
        const { error } = await supabase.from("candidate_settings").update(dbFields).eq("id", current[0].id);
        if (!error) {
          const { data } = await supabase.from("candidate_settings").select("*").eq("id", current[0].id);
          if (data && data.length > 0) {
            const s = data[0];
            return {
              id: s.id,
              targetExam: s.target_exam,
              examBoard: s.exam_board,
              specialty: s.specialty,
              examDate: s.exam_date,
              dailyStudyHours: s.daily_study_hours,
              candidateName: s.candidate_name,
              isAlreadyTeacher: s.is_already_teacher,
              createdAt: s.created_at
            };
          }
        }
      } else {
        const fullInsert = {
          id: "default-settings",
          target_exam: updates.targetExam || "SEDUC-CE (Ceará)",
          exam_board: updates.examBoard || "FUNECE / UECE",
          specialty: updates.specialty || "Biologia",
          exam_date: updates.examDate || new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          daily_study_hours: updates.dailyStudyHours || 4,
          candidate_name: updates.candidateName || null,
          is_already_teacher: updates.isAlreadyTeacher || false,
          created_at: new Date().toISOString()
        };
        await supabase.from("candidate_settings").insert(fullInsert);
        return {
          id: fullInsert.id,
          targetExam: fullInsert.target_exam,
          examBoard: fullInsert.exam_board,
          specialty: fullInsert.specialty,
          examDate: fullInsert.exam_date,
          dailyStudyHours: fullInsert.daily_study_hours,
          candidateName: fullInsert.candidate_name,
          isAlreadyTeacher: fullInsert.is_already_teacher,
          createdAt: fullInsert.created_at
        };
      }
    } catch (err) {
      console.error("[Supabase] Failed to update settings, falling back:", err);
    }
  }

  // Fallback to Drizzle PostgreSQL
  const list = await db.select().from(candidateSettings);
  if (list.length === 0) {
    const newSettings = {
      id: "default-settings",
      targetExam: "SEDUC-CE (Ceará)",
      examBoard: "FUNECE / UECE",
      specialty: "Biologia",
      examDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dailyStudyHours: 4,
      createdAt: new Date().toISOString(),
      ...updates
    };
    await db.insert(candidateSettings).values(newSettings);
    return newSettings;
  } else {
    const targetId = list[0].id;
    await db.update(candidateSettings).set(updates).where(eq(candidateSettings.id, targetId));
    const updated = await db.select().from(candidateSettings).where(eq(candidateSettings.id, targetId));
    return updated[0];
  }
}

// 2. CONTENT TOPICS
export async function getContentTopics() {
  if (useSupabase) {
    try {
      const { data, error } = await supabase.from("content_topics").select("*");
      if (error) throw error;
      return (data || []).map(t => ({
        id: t.id,
        subject: t.subject,
        axis: t.axis,
        name: t.name,
        relevance: t.relevance,
        importanceScore: t.importance_score,
        status: t.status,
        lastStudiedAt: t.last_studied_at,
        totalQuestionsSolved: t.total_questions_solved,
        correctQuestionsSolved: t.correct_questions_solved,
        notes: t.notes,
        createdAt: t.created_at
      }));
    } catch (err) {
      console.error("[Supabase] Failed to fetch content topics, falling back:", err);
    }
  }

  return await db.select().from(contentTopics);
}

export async function createContentTopic(topic: any) {
  if (useSupabase) {
    try {
      const dbField = {
        id: topic.id,
        subject: topic.subject,
        axis: topic.axis,
        name: topic.name,
        relevance: topic.relevance,
        importance_score: topic.importanceScore,
        status: topic.status,
        last_studied_at: topic.lastStudiedAt || null,
        total_questions_solved: topic.totalQuestionsSolved || 0,
        correct_questions_solved: topic.correctQuestionsSolved || 0,
        notes: topic.notes || null,
        created_at: topic.createdAt || new Date().toISOString()
      };
      const { error } = await supabase.from("content_topics").insert(dbField);
      if (!error) return topic;
    } catch (err) {
      console.error("[Supabase] Failed to create topic, falling back:", err);
    }
  }

  await db.insert(contentTopics).values(topic);
  return topic;
}

export async function updateContentTopic(id: string, updates: any) {
  const dbField: any = {};
  if (updates.subject !== undefined) dbField.subject = updates.subject;
  if (updates.axis !== undefined) dbField.axis = updates.axis;
  if (updates.name !== undefined) dbField.name = updates.name;
  if (updates.relevance !== undefined) dbField.relevance = updates.relevance;
  if (updates.importanceScore !== undefined) dbField.importance_score = updates.importanceScore;
  if (updates.status !== undefined) dbField.status = updates.status;
  if (updates.lastStudiedAt !== undefined) dbField.last_studied_at = updates.lastStudiedAt;
  if (updates.totalQuestionsSolved !== undefined) dbField.total_questions_solved = updates.totalQuestionsSolved;
  if (updates.correctQuestionsSolved !== undefined) dbField.correct_questions_solved = updates.correctQuestionsSolved;
  if (updates.notes !== undefined) dbField.notes = updates.notes;

  if (useSupabase) {
    try {
      const { error } = await supabase.from("content_topics").update(dbField).eq("id", id);
      if (!error) {
        const { data } = await supabase.from("content_topics").select("*").eq("id", id);
        if (data && data.length > 0) {
          const t = data[0];
          return {
            id: t.id,
            subject: t.subject,
            axis: t.axis,
            name: t.name,
            relevance: t.relevance,
            importanceScore: t.importance_score,
            status: t.status,
            lastStudiedAt: t.last_studied_at,
            totalQuestionsSolved: t.total_questions_solved,
            correctQuestionsSolved: t.correct_questions_solved,
            notes: t.notes,
            createdAt: t.created_at
          };
        }
      }
    } catch (err) {
      console.error("[Supabase] Failed to update topic, falling back:", err);
    }
  }

  // Fallback
  const existing = await db.select().from(contentTopics).where(eq(contentTopics.id, id));
  if (existing.length === 0) {
    const fullData = {
      id,
      subject: updates.subject || "Conhecimentos Específicos",
      axis: updates.axis || "Bloco Único",
      name: updates.name || "Tópico de Estudo",
      relevance: updates.relevance || "medium",
      importanceScore: updates.importanceScore || 50,
      status: updates.status || "not_started",
      totalQuestionsSolved: updates.totalQuestionsSolved || 0,
      correctQuestionsSolved: updates.correctQuestionsSolved || 0,
      notes: updates.notes || null,
      lastStudiedAt: updates.lastStudiedAt || null,
      createdAt: new Date().toISOString(),
      ...updates
    };
    await db.insert(contentTopics).values(fullData);
    return fullData;
  } else {
    await db.update(contentTopics).set(updates).where(eq(contentTopics.id, id));
    const updated = await db.select().from(contentTopics).where(eq(contentTopics.id, id));
    return updated[0];
  }
}

export async function deleteContentTopic(id: string) {
  if (useSupabase) {
    try {
      const { error } = await supabase.from("content_topics").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.error("[Supabase] Failed to delete topic, falling back:", err);
    }
  }
  await db.delete(contentTopics).where(eq(contentTopics.id, id));
  return true;
}

// 3. STUDY ACTIVITIES
export async function getStudyActivities() {
  if (useSupabase) {
    try {
      const { data, error } = await supabase.from("study_activities").select("*");
      if (error) throw error;
      return (data || []).map(act => ({
        id: act.id,
        topicId: act.topic_id,
        topicName: act.topic_name,
        subject: act.subject,
        type: act.type,
        status: act.status,
        scheduledDate: act.scheduled_date,
        completionDate: act.completion_date,
        notes: act.notes,
        durationMinutes: act.duration_minutes,
        theoryDone: act.theory_done,
        questionsDone: act.questions_done,
        revisionDone: act.revision_done,
        createdAt: act.created_at
      }));
    } catch (err) {
      console.error("[Supabase] Failed to fetch activities, falling back:", err);
    }
  }

  return await db.select().from(studyActivities);
}

export async function createStudyActivity(act: any) {
  if (useSupabase) {
    try {
      const dbField = {
        id: act.id,
        topic_id: act.topicId,
        topic_name: act.topicName,
        subject: act.subject,
        type: act.type,
        status: act.status,
        scheduled_date: act.scheduledDate,
        completion_date: act.completionDate || null,
        notes: act.notes || null,
        duration_minutes: act.durationMinutes || null,
        theory_done: act.theoryDone || false,
        questions_done: act.questionsDone || false,
        revision_done: act.revisionDone || false,
        created_at: act.createdAt || new Date().toISOString()
      };
      const { error } = await supabase.from("study_activities").insert(dbField);
      if (!error) return act;
    } catch (err) {
      console.error("[Supabase] Failed to create activity, falling back:", err);
    }
  }

  await db.insert(studyActivities).values(act);
  return act;
}

export async function updateStudyActivity(id: string, updates: any) {
  const dbField: any = {};
  if (updates.topicId !== undefined) dbField.topic_id = updates.topicId;
  if (updates.topicName !== undefined) dbField.topic_name = updates.topicName;
  if (updates.subject !== undefined) dbField.subject = updates.subject;
  if (updates.type !== undefined) dbField.type = updates.type;
  if (updates.status !== undefined) dbField.status = updates.status;
  if (updates.scheduledDate !== undefined) dbField.scheduled_date = updates.scheduledDate;
  if (updates.completionDate !== undefined) dbField.completion_date = updates.completionDate;
  if (updates.notes !== undefined) dbField.notes = updates.notes;
  if (updates.durationMinutes !== undefined) dbField.duration_minutes = updates.durationMinutes;
  if (updates.theoryDone !== undefined) dbField.theory_done = updates.theoryDone;
  if (updates.questionsDone !== undefined) dbField.questions_done = updates.questionsDone;
  if (updates.revisionDone !== undefined) dbField.revision_done = updates.revisionDone;

  if (useSupabase) {
    try {
      const { error } = await supabase.from("study_activities").update(dbField).eq("id", id);
      if (!error) {
        const { data } = await supabase.from("study_activities").select("*").eq("id", id);
        if (data && data.length > 0) {
          const act = data[0];
          return {
            id: act.id,
            topicId: act.topic_id,
            topicName: act.topic_name,
            subject: act.subject,
            type: act.type,
            status: act.status,
            scheduledDate: act.scheduled_date,
            completionDate: act.completion_date,
            notes: act.notes,
            durationMinutes: act.duration_minutes,
            theoryDone: act.theory_done,
            questionsDone: act.questions_done,
            revisionDone: act.revision_done,
            createdAt: act.created_at
          };
        }
      }
    } catch (err) {
      console.error("[Supabase] Failed to update activity, falling back:", err);
    }
  }

  // Fallback
  await db.update(studyActivities).set(updates).where(eq(studyActivities.id, id));
  const updated = await db.select().from(studyActivities).where(eq(studyActivities.id, id));
  return updated[0];
}

export async function deleteStudyActivity(id: string) {
  if (useSupabase) {
    try {
      const { error } = await supabase.from("study_activities").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.error("[Supabase] Failed to delete activity, falling back:", err);
    }
  }
  await db.delete(studyActivities).where(eq(studyActivities.id, id));
  return true;
}

// 4. QUESTIONS
export async function getQuestions() {
  if (useSupabase) {
    try {
      const { data, error } = await supabase.from("questions").select("*");
      if (error) throw error;
      return (data || []).map(q => ({
        id: q.id,
        subject: q.subject,
        axis: q.axis,
        topicId: q.topic_id,
        topicName: q.topic_name,
        text: q.text,
        options: q.options,
        correctIndex: q.correct_index,
        explanation: q.explanation,
        examBoard: q.exam_board,
        year: q.year
      }));
    } catch (err) {
      console.error("[Supabase] Failed to fetch questions, falling back:", err);
    }
  }

  return await db.select().from(questions);
}

// 5. MISTAKE RECORDS
export async function getMistakeRecords() {
  if (useSupabase) {
    try {
      const { data, error } = await supabase.from("mistake_records").select("*");
      if (error) throw error;
      return (data || []).map(mr => ({
        id: mr.id,
        questionId: mr.question_id,
        topicId: mr.topic_id,
        topicName: mr.topic_name,
        subject: mr.subject,
        questionText: mr.question_text,
        options: mr.options,
        correctIndex: mr.correct_index,
        selectedOptionIndex: mr.selected_option_index,
        explanation: mr.explanation,
        createdAt: mr.created_at,
        resolved: mr.resolved,
        reviewCount: mr.review_count
      }));
    } catch (err) {
      console.error("[Supabase] Failed to fetch mistakes, falling back:", err);
    }
  }

  return await db.select().from(mistakeRecords);
}

export async function createMistakeRecord(mr: any) {
  if (useSupabase) {
    try {
      const dbField = {
        id: mr.id,
        question_id: mr.questionId,
        topic_id: mr.topicId,
        topic_name: mr.topicName,
        subject: mr.subject,
        question_text: mr.questionText,
        options: mr.options,
        correct_index: mr.correctIndex,
        selected_option_index: mr.selectedOptionIndex,
        explanation: mr.explanation,
        created_at: mr.createdAt || new Date().toISOString(),
        resolved: mr.resolved || false,
        review_count: mr.reviewCount || 0
      };
      const { error } = await supabase.from("mistake_records").insert(dbField);
      if (!error) return mr;
    } catch (err) {
      console.error("[Supabase] Failed to create mistake, falling back:", err);
    }
  }

  await db.insert(mistakeRecords).values(mr);
  return mr;
}

export async function updateMistakeRecord(id: string, updates: any) {
  const dbField: any = {};
  if (updates.questionId !== undefined) dbField.question_id = updates.questionId;
  if (updates.topicId !== undefined) dbField.topic_id = updates.topicId;
  if (updates.topicName !== undefined) dbField.topic_name = updates.topicName;
  if (updates.subject !== undefined) dbField.subject = updates.subject;
  if (updates.questionText !== undefined) dbField.question_text = updates.questionText;
  if (updates.options !== undefined) dbField.options = updates.options;
  if (updates.correctIndex !== undefined) dbField.correct_index = updates.correctIndex;
  if (updates.selectedOptionIndex !== undefined) dbField.selected_option_index = updates.selectedOptionIndex;
  if (updates.explanation !== undefined) dbField.explanation = updates.explanation;
  if (updates.resolved !== undefined) dbField.resolved = updates.resolved;
  if (updates.reviewCount !== undefined) dbField.review_count = updates.reviewCount;

  if (useSupabase) {
    try {
      const { error } = await supabase.from("mistake_records").update(dbField).eq("id", id);
      if (!error) {
        const { data } = await supabase.from("mistake_records").select("*").eq("id", id);
        if (data && data.length > 0) {
          const r = data[0];
          return {
            id: r.id,
            questionId: r.question_id,
            topicId: r.topic_id,
            topicName: r.topic_name,
            subject: r.subject,
            questionText: r.question_text,
            options: r.options,
            correctIndex: r.correct_index,
            selectedOptionIndex: r.selected_option_index,
            explanation: r.explanation,
            createdAt: r.created_at,
            resolved: r.resolved,
            reviewCount: r.review_count
          };
        }
      }
    } catch (err) {
      console.error("[Supabase] Failed to update mistake, falling back:", err);
    }
  }

  // Fallback
  await db.update(mistakeRecords).set(updates).where(eq(mistakeRecords.id, id));
  const updated = await db.select().from(mistakeRecords).where(eq(mistakeRecords.id, id));
  return updated[0];
}

export async function deleteMistakeRecord(id: string) {
  if (useSupabase) {
    try {
      const { error } = await supabase.from("mistake_records").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.error("[Supabase] Failed to delete mistake, falling back:", err);
    }
  }
  await db.delete(mistakeRecords).where(eq(mistakeRecords.id, id));
  return true;
}
