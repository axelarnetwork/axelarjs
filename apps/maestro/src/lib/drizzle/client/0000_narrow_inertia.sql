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
	"token_id" varchar(64) PRIMARY KEY NOT NULL,
	"token_address" varchar(40),
	"token_name" text,
	"token_symbol" text,
	"token_decimals" integer,
	"chain_id" integer,
	"axelar_chain_id" varchar(48),
	"deployment_tx_hash" varchar(64),
	"deployer_address" varchar(40) NOT NULL,
	"kind" "kind" NOT NULL,
	"salt" varchar(64),
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "remote_interchain_tokens" (
	"token_id" varchar(64) PRIMARY KEY NOT NULL,
	"origin_token_id" varchar(64),
	"chain_id" integer,
	"axelar_chain_id" varchar,
	"address" varchar(40),
	"status" "status",
	"deployment_tx_hash" varchar(64),
	"deployment_log_index" integer,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
