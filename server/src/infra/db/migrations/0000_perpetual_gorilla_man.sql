CREATE TABLE "links" (
	"id" text PRIMARY KEY NOT NULL,
	"original" text NOT NULL,
	"encurtado" text NOT NULL,
	"acesso" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
