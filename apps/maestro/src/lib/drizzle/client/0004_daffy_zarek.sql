DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('deployed', 'pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "remote_interchain_tokens" ALTER COLUMN "axelar_chain_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "remote_interchain_tokens" ALTER COLUMN "deployment_status" SET DATA TYPE status;