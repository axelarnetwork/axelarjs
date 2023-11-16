ALTER TABLE "interchain_tokens" ALTER COLUMN "salt" SET DEFAULT '0x';--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "salt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "remote_interchain_tokens" ALTER COLUMN "token_manager_address" DROP NOT NULL;