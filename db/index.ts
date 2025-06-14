import { Pool } from "pg";
import _dotenv from "dotenv/config";

const DB_PORT = process.env.DB_PORT || 5432

const pool = new Pool({
  host: "localhost",
  user: process.env.DATABASE_USERNAME,
  database: "top_users",
  password: process.env.DATABASE_PASSWORD,
  port: +DB_PORT,
});

export const query = (text: string, params: any = {}) => pool.query(text, params);
