DO $$ BEGIN
 CREATE TYPE "deployment_status" AS ENUM('deployed', 'pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "remote_interchain_tokens" ALTER COLUMN "deployment_status" SET DATA TYPE deployment_status;