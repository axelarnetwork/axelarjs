import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const AUDIT_EVENT_KINDS = [
  "unauthorized_access_attempt",
  // add more event kinds here
] as const;

export type AuditLogEventKind = (typeof AUDIT_EVENT_KINDS)[number];

export type EVENT_KIND_MAP = {
  unauthorized_access_attempt: {
    accountAddress: string;
    ip: string;
    userAgent: string;
  };
  // add more event types here
};

export type AuditLogEvent<K extends AuditLogEventKind> = {
  kind: K;
  payload: EVENT_KIND_MAP[K];
};

export const auditLogEventKind = pgEnum(
  "audit_log_event_kind",
  AUDIT_EVENT_KINDS
);

/**
 * Audit Logs Table
 *
 * This table is used to store audit logs.
 */
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventKind: auditLogEventKind("event_kind").notNull(),
  payload: varchar("payload", { length: 2048 }).notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

/**
 * CRUD Schemas
 *
 * These schemas are used to validate the input and output of CRUD operations.
 */
export const auditLogsZodSchemas = {
  insert: createInsertSchema(auditLogs),
  select: createSelectSchema(auditLogs),
};

export type AuditLog = InferSelectModel<typeof auditLogs>;
export type NewAuditLog = InferInsertModel<typeof auditLogs>;
