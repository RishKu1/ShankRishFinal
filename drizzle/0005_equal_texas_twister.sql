CREATE TABLE IF NOT EXISTS "connected_banks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text NOT NULL,
	"item_id" text NOT NULL,
	CONSTRAINT "connected_banks_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
DROP TABLE "notifications";--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "balance" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "type" text DEFAULT 'depository' NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "subtype" text DEFAULT 'checking' NOT NULL;