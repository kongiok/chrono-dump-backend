import pkg from "pg";
const { Pool } = pkg;
import { config } from "dotenv";
import { env } from "process";
config();

export const poolData = new Pool({
  connectionString: `postgres://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}`,
  idleTimeoutMillis: 30000,
});
