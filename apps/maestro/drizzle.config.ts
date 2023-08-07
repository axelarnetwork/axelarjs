import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config({ path: ".env.local" });

export default {
  schema: "./src/lib/drizzle/schema",
  out: "./src/lib/drizzle/client",
  driver: "pg",
  dbCredentials: {
    connectionString: `${process.env.POSTGRES_URL}?sslmode=require`,
  },
} satisfies Config;
