import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config({ path: ".env.local" });

const CONNECTION_STRING = `${process.env.POSTGRES_URL}?sslmode=require`;

export default {
  schema: "./src/lib/drizzle/schema",
  out: "./src/lib/drizzle/client",
  driver: "pg",
  dbCredentials: {
    connectionString: CONNECTION_STRING,
  },
} satisfies Config;
