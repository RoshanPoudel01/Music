import { config } from "dotenv";
import { Client } from "pg";

config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT as unknown as number;

const db = new Client({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

try {
  db.connect();
  console.log("Database connected successfully!");
} catch (err) {
  console.error("Error connecting to database: ", err);
}

export default db;
