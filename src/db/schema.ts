import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
	image: text("image"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
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
});

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
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const planRequests = sqliteTable("plan_requests", {
	id: text("id").primaryKey(),
	userId: text("userId").notNull().references(() => user.id),
	name: text("name").notNull(),
	age: integer("age").notNull(),
	weight: integer("weight").notNull(), // in kg/lbs
	height: integer("height").notNull(), // in cm/inches
	trainingFrequency: integer("trainingFrequency").notNull(),
	trainingDays: text("trainingDays").notNull(),
	injuries: text("injuries"),
	equipment: text("equipment").notNull(), // "Gym", "Home", or "Other"
	equipmentDetails: text("equipmentDetails"), // free text when equipment is "Other"
	failureExp: text("failureExp").notNull(),
	goals: text("goals").notNull(),
	weakPoints: text("weakPoints"),
	likedExercises: text("likedExercises"),
	dislikedExercises: text("dislikedExercises"),
	status: text("status").notNull().default("pending_payment"), // pending_payment, paid, delivered
	stripeSessionId: text("stripeSessionId"),
	pdfKey: text("pdfKey"), // R2 bucket key once delivered
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});
