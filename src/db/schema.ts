import { pgTable, text, integer, boolean, jsonb } from "drizzle-orm/pg-core";

// Table: candidate_settings
export const candidateSettings = pgTable("candidate_settings", {
  id: text("id").primaryKey(),
  targetExam: text("target_exam").notNull(),
  examBoard: text("exam_board").notNull(),
  specialty: text("specialty").notNull(),
  examDate: text("exam_date").notNull(),
  dailyStudyHours: integer("daily_study_hours").notNull(),
  candidateName: text("candidate_name"),
  isAlreadyTeacher: boolean("is_already_teacher"),
  createdAt: text("created_at").notNull(),
});

// Table: content_topics
export const contentTopics = pgTable("content_topics", {
  id: text("id").primaryKey(),
  subject: text("subject").notNull(),
  axis: text("axis").notNull(),
  name: text("name").notNull(),
  relevance: text("relevance").notNull(), // 'crucial' | 'high' | 'medium' | 'low'
  importanceScore: integer("importance_score").notNull(),
  status: text("status").notNull(), // 'not_started' | 'studying' | 'studied' | 'needs_review'
  lastStudiedAt: text("last_studied_at"),
  totalQuestionsSolved: integer("total_questions_solved").notNull().default(0),
  correctQuestionsSolved: integer("correct_questions_solved").notNull().default(0),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
});

// Table: study_activities
export const studyActivities = pgTable("study_activities", {
  id: text("id").primaryKey(),
  topicId: text("topic_id").notNull(),
  topicName: text("topic_name").notNull(),
  subject: text("subject").notNull(),
  type: text("type").notNull(), // 'theory' | 'exercise' | 'revision'
  status: text("status").notNull(), // 'planned' | 'completed' | 'skipped'
  scheduledDate: text("scheduled_date").notNull(),
  completionDate: text("completion_date"),
  notes: text("notes"),
  durationMinutes: integer("duration_minutes"),
  theoryDone: boolean("theory_done").default(false),
  questionsDone: boolean("questions_done").default(false),
  revisionDone: boolean("revision_done").default(false),
  createdAt: text("created_at").notNull(),
});

// Table: questions
export const questions = pgTable("questions", {
  id: text("id").primaryKey(),
  subject: text("subject").notNull(),
  axis: text("axis").notNull(),
  topicId: text("topic_id").notNull(),
  topicName: text("topic_name").notNull(),
  text: text("text").notNull(),
  options: jsonb("options").notNull(), // JSON array of options string[]
  correctIndex: integer("correct_index").notNull(),
  explanation: text("explanation").notNull(),
  examBoard: text("exam_board").notNull(),
  year: integer("year").notNull(),
});

// Table: mistake_records
export const mistakeRecords = pgTable("mistake_records", {
  id: text("id").primaryKey(),
  questionId: text("question_id").notNull(),
  topicId: text("topic_id").notNull(),
  topicName: text("topic_name").notNull(),
  subject: text("subject").notNull(),
  questionText: text("question_text").notNull(),
  options: jsonb("options").notNull(), // JSON array of options string[]
  correctIndex: integer("correct_index").notNull(),
  selectedOptionIndex: integer("selected_option_index").notNull(),
  explanation: text("explanation").notNull(),
  createdAt: text("created_at").notNull(),
  resolved: boolean("resolved").notNull().default(false),
  reviewCount: integer("review_count").notNull().default(0),
});
