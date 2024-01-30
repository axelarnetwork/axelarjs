DO $$ BEGIN
 CREATE TYPE "token_manager_type" AS ENUM('MIN_BURN', 'MINT_BURN_FROM', 'LOCK_UNLOCK', 'LOCK_UNLOCK_FEE', 'GATEWAY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "interchain_tokens" ADD COLUMN "token_manager_type" "token_manager_type";--> statement-breakpoint
ALTER TABLE "remote_interchain_tokens" ADD COLUMN "token_manager_type" "token_manager_type";