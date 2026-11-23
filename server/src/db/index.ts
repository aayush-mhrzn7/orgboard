import 'dotenv/config';
import {drizzle} from 'drizzle-orm/bun-sqlite';
const dbFileName = process.env.DB_FILE_NAME || 'mydb.sqlite';
const db = drizzle(dbFileName);

export default db;