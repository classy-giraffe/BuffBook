CREATE INDEX `account_user_id_idx` ON `account` (`userId`);--> statement-breakpoint
CREATE INDEX `plan_requests_user_id_idx` ON `plan_requests` (`userId`);--> statement-breakpoint
CREATE INDEX `plan_requests_status_idx` ON `plan_requests` (`status`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`userId`);