import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 排盤紀錄表
 * 儲存用戶的紫微斗數排盤歷史
 */
export const astrolabes = mysqlTable("astrolabes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  name: varchar("name", { length: 100 }),
  birthday: varchar("birthday", { length: 20 }).notNull(),
  birthTime: int("birthTime").notNull(),
  birthdayType: varchar("birthdayType", { length: 10 }).notNull(),
  gender: varchar("gender", { length: 10 }).notNull(),
  astroData: text("astroData").notNull(),
  aiInterpretation: text("aiInterpretation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Astrolabe = typeof astrolabes.$inferSelect;
export type InsertAstrolabe = typeof astrolabes.$inferInsert;

/**
 * 知識庫資料表
 * 儲存每個排盤的詳細宮位與星曜資訊
 */
export const knowledgeBase = mysqlTable("knowledge_base", {
  id: int("id").autoincrement().primaryKey(),
  astrolabeId: int("astrolabeId").references(() => astrolabes.id).notNull(),
  palaceName: varchar("palaceName", { length: 20 }).notNull(),
  palaceIndex: int("palaceIndex").notNull(),
  earthlyBranch: varchar("earthlyBranch", { length: 10 }),
  heavenlyStem: varchar("heavenlyStem", { length: 10 }),
  majorStars: text("majorStars"),
  minorStars: text("minorStars"),
  adjStars: text("adjStars"),
  changSheng12: varchar("changSheng12", { length: 20 }),
  boshi12: varchar("boshi12", { length: 20 }),
  jiangqian12: varchar("jiangqian12", { length: 20 }),
  suiqian12: varchar("suiqian12", { length: 20 }),
  decadal: text("decadal"),
  ages: text("ages"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type KnowledgeBase = typeof knowledgeBase.$inferSelect;
export type InsertKnowledgeBase = typeof knowledgeBase.$inferInsert;

/**
 * AI 問答紀錄表
 * 儲存用戶的提問與 AI 回答
 */
export const qaRecords = mysqlTable("qa_records", {
  id: int("id").autoincrement().primaryKey(),
  astrolabeId: int("astrolabeId").references(() => astrolabes.id).notNull(),
  userId: int("userId").references(() => users.id).notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QARecord = typeof qaRecords.$inferSelect;
export type InsertQARecord = typeof qaRecords.$inferInsert;