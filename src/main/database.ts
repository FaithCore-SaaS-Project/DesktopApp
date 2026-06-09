import initSqlJs from 'sql.js';
import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

let db: any = null;
let dbPath: string = '';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  joinedDate: string;
  status: string;
  tenantId: string;
  syncStatus: 'synced' | 'pending';
}

export interface FinanceRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  tenantId: string;
  method?: string;
  receipt?: string;
  syncStatus: 'synced' | 'pending';
}

export async function initDatabase(): Promise<any> {
  if (db) return db;

  // Initialize WebAssembly SQL.js
  const SQL = await initSqlJs();

  // Resolve DB file path inside standard Electron App Data folder
  dbPath = app.isPackaged
    ? path.join(app.getPath('userData'), 'fc-church-management.db')
    : path.join(process.cwd(), 'fc-church-management.db');

  console.log(`[Database] Initializing SQLite (sql.js WebAssembly) at: ${dbPath}`);

  let fileBuffer: Buffer | null = null;
  if (fs.existsSync(dbPath)) {
    try {
      fileBuffer = fs.readFileSync(dbPath);
    } catch (e) {
      console.error('[Database] Failed to read database file, initializing empty:', e);
    }
  }

  // Load database from file or create an empty in-memory DB
  db = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();

  // Establish table structures
  db.run(`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      role TEXT,
      joinedDate TEXT,
      status TEXT,
      tenantId TEXT,
      syncStatus TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS finance (
      id TEXT PRIMARY KEY,
      type TEXT CHECK(type IN ('income', 'expense')),
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      description TEXT,
      tenantId TEXT,
      method TEXT,
      receipt TEXT,
      syncStatus TEXT DEFAULT 'pending'
    );
  `);

  // Migrate columns in case the DB existed before they were added
  try {
    db.run("ALTER TABLE finance ADD COLUMN method TEXT;");
  } catch (e) {
    // Column might already exist
  }
  try {
    db.run("ALTER TABLE finance ADD COLUMN receipt TEXT;");
  } catch (e) {
    // Column might already exist
  }


  if (!fileBuffer) {
    saveDatabase();
  }

  return db;
}

// Write the compiled database memory bytes into the local file
function saveDatabase() {
  if (!db || !dbPath) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (err) {
    console.error('[Database] Failed to save database to disk:', err);
  }
}

// Helper to query rows and map columns to key-value objects
function getRows(sql: string, params: any[] = []): any[] {
  if (!db) throw new Error('Database not initialized');
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// Helper to run query mutations and persist changes
function runQuery(sql: string, params: any[] = []): void {
  if (!db) throw new Error('Database not initialized');
  db.run(sql, params);
  saveDatabase();
}

// Database CRUD operations API for Main process handling
export const dbOperations = {
  // --- Members CRUD ---
  getMembers: (tenantId: string): Member[] => {
    return getRows('SELECT * FROM members WHERE tenantId = ?', [tenantId]) as Member[];
  },

  saveMember: (member: Member): void => {
    runQuery(
      `INSERT OR REPLACE INTO members (id, name, email, phone, role, joinedDate, status, tenantId, syncStatus)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        member.id,
        member.name,
        member.email,
        member.phone,
        member.role,
        member.joinedDate,
        member.status,
        member.tenantId,
        member.syncStatus || 'pending',
      ]
    );
  },

  deleteMember: (id: string): void => {
    runQuery('DELETE FROM members WHERE id = ?', [id]);
  },

  // --- Finance CRUD ---
  getFinanceRecords: (tenantId: string): FinanceRecord[] => {
    return getRows('SELECT * FROM finance WHERE tenantId = ? ORDER BY date DESC', [tenantId]) as FinanceRecord[];
  },

  saveFinanceRecord: (record: FinanceRecord): void => {
    runQuery(
      `INSERT OR REPLACE INTO finance (id, type, category, amount, date, description, tenantId, method, receipt, syncStatus)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.type,
        record.category,
        record.amount,
        record.date,
        record.description,
        record.tenantId,
        record.method || 'Cash',
        record.receipt || '',
        record.syncStatus || 'pending',
      ]
    );
  },

  deleteFinanceRecord: (id: string): void => {
    runQuery('DELETE FROM finance WHERE id = ?', [id]);
  }
};
