import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "./schema";

const dbClient = drizzle(sql, { schema });

export type DBClient = typeof dbClient;

export default dbClient;
