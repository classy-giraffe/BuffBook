PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_rateLimit` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`count` integer NOT NULL,
	`lastRequest` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_rateLimit`("id", "key", "count", "lastRequest") SELECT "id", "key", "count", "lastRequest" FROM `rateLimit`;--> statement-breakpoint
DROP TABLE `rateLimit`;--> statement-breakpoint
ALTER TABLE `__new_rateLimit` RENAME TO `rateLimit`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `rateLimit_key_unique` ON `rateLimit` (`key`);