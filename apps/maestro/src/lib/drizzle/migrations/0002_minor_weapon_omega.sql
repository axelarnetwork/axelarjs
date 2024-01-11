DO $$ BEGIN
 CREATE TYPE "audit_log_event_kind" AS ENUM('unauthorized_access_attempt');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" varchar(66) PRIMARY KEY NOT NULL,
	"event_kind" "audit_log_event_kind" NOT NULL,
	"payload" varchar(2048) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
