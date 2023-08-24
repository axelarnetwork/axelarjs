DO $$ BEGIN
 CREATE TYPE "kind" AS ENUM('canonical', 'standardized');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('deployed', 'pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interchain_tokens" (
	"token_id" varchar(66) PRIMARY KEY NOT NULL,
	"token_address" varchar(42) NOT NULL,
	"token_name" varchar(100) NOT NULL,
	"token_symbol" varchar(100) NOT NULL,
	"token_decimals" smallint NOT NULL,
	"chain_id" integer NOT NULL,
	"axelar_chain_id" varchar(66) NOT NULL,
	"deployment_tx_hash" varchar(66),
	"deployer_address" varchar(42) NOT NULL,
	"kind" "kind" NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"salt" varchar(66)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "remote_interchain_tokens" (
	"token_id" varchar(66) PRIMARY KEY NOT NULL,
	"origin_token_id" varchar(66),
	"chain_id" integer,
	"axelar_chain_id" varchar,
	"address" varchar(42),
	"deployment_tx_hash" varchar(66),
	"deployment_log_index" integer,
	"deployment_status" "status",
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
