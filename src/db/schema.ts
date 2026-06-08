import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
	image: text("image"),
	admin: integer("admin", { mode: "boolean" }).notNull().default(false),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
	age: integer("age"),
	weight: integer("weight"),
	height: integer("height")
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId").notNull().references(() => user.id)
}, (table) => [
	index("session_user_id_idx").on(table.userId),
]);

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId").notNull().references(() => user.id),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
	refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
}, (table) => [
	index("account_user_id_idx").on(table.userId),
]);

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const rateLimit = sqliteTable("rateLimit", {
	id: text("id").primaryKey(),
	key: text("key").notNull().unique(),
	count: integer("count").notNull(),
	lastRequest: integer("lastRequest").notNull(),
});

export const planRequests = sqliteTable("plan_requests", {
	id: text("id").primaryKey(),
	userId: text("userId").notNull().references(() => user.id),
	name: text("name").notNull(),
	age: integer("age").notNull(),
	weight: integer("weight").notNull(),
	height: integer("height").notNull(),
	trainingFrequency: integer("trainingFrequency").notNull(),
	trainingDays: text("trainingDays").notNull(),
	injuries: text("injuries"),
	equipment: text("equipment").notNull(),
	equipmentDetails: text("equipmentDetails"),
	failureExp: text("failureExp").notNull(),
	goals: text("goals").notNull(),
	weakPoints: text("weakPoints"),
	likedExercises: text("likedExercises"),
	dislikedExercises: text("dislikedExercises"),
	sex: text("sex"),
	steps: integer("steps"),
	jobType: text("jobType"),
	jobDescription: text("jobDescription"),
	hasCardio: text("hasCardio"),
	cardioDetails: text("cardioDetails"),
	status: text("status").notNull().default("pending_payment"),
	stripeSessionId: text("stripeSessionId"),
	pdfKey: text("pdfKey"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
}, (table) => [
	index("plan_requests_user_id_idx").on(table.userId),
	index("plan_requests_status_idx").on(table.status),
]);
