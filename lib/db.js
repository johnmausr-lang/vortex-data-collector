import { Pool } from 'pg';

let conn;

if (!conn) {
  conn = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
}

export const db = conn;
