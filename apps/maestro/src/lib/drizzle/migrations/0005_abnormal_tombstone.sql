ALTER TABLE "interchain_tokens" ALTER COLUMN "token_address" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "axelar_chain_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "deployment_message_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "deployer_address" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "token_manager_address" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "interchain_tokens" ALTER COLUMN "original_minter_address" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "remote_interchain_tokens" ALTER COLUMN "axelar_chain_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "remote_interchain_tokens" ALTER COLUMN "token_address" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "remote_interchain_tokens" ALTER COLUMN "token_manager_address" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "remote_interchain_tokens" ALTER COLUMN "deployment_message_id" SET DATA TYPE varchar;