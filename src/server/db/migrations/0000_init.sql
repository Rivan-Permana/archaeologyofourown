CREATE TABLE `artefact` (
	`id` text PRIMARY KEY NOT NULL,
	`inventory_number` text NOT NULL,
	`year` text,
	`category` text NOT NULL,
	`contributor_credit` text,
	`source_contribution_id` text,
	`is_placeholder` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `artefact_translation` (
	`id` text PRIMARY KEY NOT NULL,
	`artefact_id` text NOT NULL,
	`lang` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`provenance` text DEFAULT '' NOT NULL,
	`published_title` text,
	`published_provenance` text,
	`published_at` text,
	`revision` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`artefact_id`) REFERENCES `artefact`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `artefact_translation_artefact_lang` ON `artefact_translation` (`artefact_id`,`lang`);--> statement-breakpoint
CREATE TABLE `article` (
	`id` text PRIMARY KEY NOT NULL,
	`series` text NOT NULL,
	`author` text NOT NULL,
	`date` text,
	`is_placeholder` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `article_translation` (
	`id` text PRIMARY KEY NOT NULL,
	`article_id` text NOT NULL,
	`lang` text NOT NULL,
	`slug` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`standfirst` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '[]' NOT NULL,
	`published_title` text,
	`published_standfirst` text,
	`published_body` text,
	`published_at` text,
	`revision` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `article_translation_lang_slug` ON `article_translation` (`lang`,`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `article_translation_article_lang` ON `article_translation` (`article_id`,`lang`);--> statement-breakpoint
CREATE TABLE `media_asset` (
	`id` text PRIMARY KEY NOT NULL,
	`mime` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`variants` text DEFAULT '[]' NOT NULL,
	`tint_light` text,
	`tint_dark` text,
	`status` text DEFAULT 'uploading' NOT NULL,
	`is_placeholder` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media_ref` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text NOT NULL,
	`owner_type` text NOT NULL,
	`owner_id` text NOT NULL,
	`role` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`asset_id`) REFERENCES `media_asset`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `media_ref_owner` ON `media_ref` (`owner_type`,`owner_id`);--> statement-breakpoint
CREATE INDEX `media_ref_asset` ON `media_ref` (`asset_id`);--> statement-breakpoint
CREATE TABLE `media_ref_translation` (
	`id` text PRIMARY KEY NOT NULL,
	`media_ref_id` text NOT NULL,
	`lang` text NOT NULL,
	`alt` text DEFAULT '' NOT NULL,
	`caption` text,
	`credit` text,
	FOREIGN KEY (`media_ref_id`) REFERENCES `media_ref`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_ref_translation_ref_lang` ON `media_ref_translation` (`media_ref_id`,`lang`);--> statement-breakpoint
CREATE TABLE `site_state` (
	`id` text PRIMARY KEY NOT NULL,
	`content_version` integer DEFAULT 0 NOT NULL
);

--> statement-breakpoint
INSERT INTO site_state (id, content_version) VALUES ('site', 0);
