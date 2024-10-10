import { neon } from "@neondatabase/serverless";
import type { BatchItem as _BatchItem } from "drizzle-orm/batch";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const sql = neon(process.env.POSTGRES_URL!);

const dbClient = drizzle(sql, { schema });

export type DBClient = typeof dbClient;

export default dbClient;

export type BatchItem = _BatchItem<"pg">;
export type BatchItems = [BatchItem, ...BatchItem[]];

/**
 * Type-guard to check if drizzle batch is valid.
 *
 * @param batch - The batch to check
 * @returns true if the batch is valid
 */
export const isValidBatch = (batch: BatchItem[]): batch is BatchItems =>
  batch.length > 1;
