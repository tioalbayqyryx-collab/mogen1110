import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, astrolabes, Astrolabe, InsertAstrolabe, knowledgeBase, KnowledgeBase, InsertKnowledgeBase, qaRecords, QARecord, InsertQARecord } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createAstrolabe(data: InsertAstrolabe): Promise<Astrolabe> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(astrolabes).values(data);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(astrolabes).where(eq(astrolabes.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getUserAstrolabes(userId: number): Promise<Astrolabe[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(astrolabes).where(eq(astrolabes.userId, userId)).orderBy(desc(astrolabes.createdAt));
}

export async function getAstrolabeById(id: number): Promise<Astrolabe | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(astrolabes).where(eq(astrolabes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// 知識庫相關操作
export async function createKnowledgeBase(data: InsertKnowledgeBase): Promise<KnowledgeBase> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(knowledgeBase).values(data);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(knowledgeBase).where(eq(knowledgeBase.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getKnowledgeByAstrolabeId(astrolabeId: number): Promise<KnowledgeBase[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(knowledgeBase).where(eq(knowledgeBase.astrolabeId, astrolabeId));
}

// 問答紀錄相關操作
export async function createQARecord(data: InsertQARecord): Promise<QARecord> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(qaRecords).values(data);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(qaRecords).where(eq(qaRecords.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getQARecordsByAstrolabeId(astrolabeId: number): Promise<QARecord[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(qaRecords).where(eq(qaRecords.astrolabeId, astrolabeId)).orderBy(desc(qaRecords.createdAt));
}
