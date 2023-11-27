DO $$ BEGIN
 CREATE TYPE "token_kind" AS ENUM('canonical', 'interchain', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "deployment_status" AS ENUM('confirmed', 'pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interchain_tokens" (
	"token_id" varchar(66) PRIMARY KEY NOT NULL,
	"token_address" varchar(42) NOT NULL,
	"axelar_chain_id" varchar(66) NOT NULL,
	"token_name" varchar(100) NOT NULL,
	"token_symbol" varchar(100) NOT NULL,
	"token_decimals" smallint NOT NULL,
	"deployment_message_id" varchar(71) NOT NULL,
	"deployer_address" varchar(42) NOT NULL,
	"token_manager_address" varchar(42) NOT NULL,
	"original_distributor_address" varchar(42) NOT NULL,
	"kind" "token_kind" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"salt" varchar(66) DEFAULT '0x' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "remote_interchain_tokens" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"token_id" varchar(66) NOT NULL,
	"axelar_chain_id" varchar(66) NOT NULL,
	"token_address" varchar(42) NOT NULL,
	"token_manager_address" varchar(42),
	"deployment_message_id" varchar(71) NOT NULL,
	"deployment_status" "deployment_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "remote_interchain_tokens" ADD CONSTRAINT "remote_interchain_tokens_token_id_interchain_tokens_token_id_fk" FOREIGN KEY ("token_id") REFERENCES "interchain_tokens"("token_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
