ALTER TABLE "interchain_tokens" ALTER COLUMN "token_id" SET DATA TYPE varchar(66);--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "token_address" SET DATA TYPE varchar(42);--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "token_address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "token_name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "token_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "token_symbol" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "token_symbol" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "token_decimals" SET DATA TYPE smallint;--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "token_decimals" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "chain_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "axelar_chain_id" SET DATA TYPE varchar(66);--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "axelar_chain_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "deployment_tx_hash" SET DATA TYPE varchar(66);--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "deployer_address" SET DATA TYPE varchar(42);--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "salt" SET DATA TYPE varchar(66);--> statement-breakpoint
ALTER TABLE "remote_interchain_tokens" ALTER COLUMN "token_id" SET DATA TYPE varchar(66);--> statement-breakpoint
ALTER TABLE "remote_interchain_tokens" ALTER COLUMN "origin_token_id" SET DATA TYPE varchar(66);--> statement-breakpoint
ALTER TABLE "remote_interchain_tokens" ALTER COLUMN "address" SET DATA TYPE varchar(42);--> statement-breakpoint
ALTER TABLE "remote_interchain_tokens" ALTER COLUMN "deployment_tx_hash" SET DATA TYPE varchar(66);--> statement-breakpoint
ALTER TABLE "remote_interchain_tokens" ADD COLUMN "deployment_status" "status";--> statement-breakpoint
ALTER TABLE "remote_interchain_tokens" DROP COLUMN IF EXISTS "status";