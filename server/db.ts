import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";
import * as dotenv from "dotenv";

dotenv.config();

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_Hbt2YfLMWx1Q@ep-tiny-leaf-a21e34je-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const pool = new Pool({
  connectionString: DATABASE_URL,
});
export const db = drizzle({ client: pool, schema });
