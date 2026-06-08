import type { APIRoute } from "astro";
import { z } from "astro/zod";
import { treeifyError } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@lib/db";
import { user as userTable, planRequests } from "@db/schema";
import { createAuth } from "@lib/auth";
import { createCheckoutSession } from "@lib/stripe";
import { env } from "cloudflare:workers";

export const prerender = false;

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email address").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  age: z.coerce.number().min(14, "Must be at least 14").max(100, "Must be 100 or under"),
  unitSystem: z.enum(["metric", "imperial"]),
  weight: z.coerce.number().min(1, "Weight is required"),
  height: z.coerce.number().min(1, "Height is required"),
  frequency: z.coerce.number().min(2, "Minimum 2 days").max(6, "Maximum 6 days"),
  trainingDays: z.string().min(1, "Please select your training days"),
  equipment: z.enum(["Gym", "Home"]),
  equipmentDetails: z.string().optional(),
  failureExp: z.string().min(1, "Please describe your experience"),
  goals: z.string().min(10, "Please provide more detail about your goals"),
  weakPoints: z.string().optional(),
  injuries: z.string().optional(),
  likedExercises: z.string().optional(),
  dislikedExercises: z.string().optional(),
  sex: z.enum(["Male", "Female"]),
  steps: z.coerce.number().min(0, "Steps is required").max(50000),
  jobType: z.enum([
    "Desk Job / Sedentary (Standard Hours)",
    "Desk Job / Sedentary (Shift/Irregular Hours)",
    "Standing / Light Activity (Standard Hours)",
    "Active Walking / Moderate Labor",
    "Heavy Manual Labor / Field Work",
    "Student / Flexible Schedule",
  ]),
  jobDescription: z.string().min(1, "Job description is required"),
  hasCardio: z.enum(["Yes", "No"]),
  cardioDetails: z.string().optional(),
  submitAction: z.enum(["pay", "save"]).optional().default("pay"),
});

export const POST: APIRoute = async (ctx) => {
  const { user: currentUser } = ctx.locals;
  const isLoggedIn = !!currentUser;

  try {
    const formData = await ctx.request.formData();
    const data = Object.fromEntries(formData.entries());
    const validated = formSchema.safeParse(data);

    if (!validated.success) {
      const errTree = treeifyError(validated.error);
      const errors: Record<string, string[]> = {};
      for (const [key, val] of Object.entries(errTree.properties ?? {})) {
        if (val) errors[key] = val.errors;
      }
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(errors)) {
        params.set(`err_${k}`, v[0]);
      }
      return ctx.redirect(`/custom-plans/apply?error=validation&${params.toString()}`);
    }

    if (!isLoggedIn && !validated.data.email) {
      return ctx.redirect("/custom-plans/apply?error=email_required");
    }
    if (!isLoggedIn && !validated.data.password) {
      return ctx.redirect("/custom-plans/apply?error=password_required");
    }
    if (validated.data.hasCardio === "Yes" && !validated.data.cardioDetails?.trim()) {
      return ctx.redirect("/custom-plans/apply?error=cardio_details");
    }

    const db = getDb(env);
    let userId: string;
    let sessionToken: string | null = null;

    if (isLoggedIn) {
      userId = currentUser!.id;
    } else {
      const dbUser = await db.select().from(userTable).where(eq(userTable.email, validated.data.email!)).get();
      if (dbUser) {
        return ctx.redirect("/custom-plans/apply?error=account_exists");
      }

      const auth = createAuth(env);
      const result = await auth.api.signUpEmail({
        body: {
          email: validated.data.email!,
          password: validated.data.password!,
          name: validated.data.name,
        },
        asResponse: false,
      });
      if (!result.user) {
        return ctx.redirect("/custom-plans/apply?error=signup_failed");
      }
      userId = result.user.id;
      sessionToken = result.token;
    }

    let weight = validated.data.weight;
    let height = validated.data.height;
    if (validated.data.unitSystem === "imperial") {
      weight = Math.round(weight * 0.453592);
      height = Math.round(height * 2.54);
    }

    const requestId = crypto.randomUUID();

    await db.insert(planRequests).values({
      id: requestId,
      userId: userId,
      name: validated.data.name,
      age: validated.data.age,
      weight: weight,
      height: height,
      trainingFrequency: validated.data.frequency,
      trainingDays: validated.data.trainingDays,
      equipment: validated.data.equipment,
      equipmentDetails: validated.data.equipmentDetails || null,
      failureExp: validated.data.failureExp,
      goals: validated.data.goals,
      injuries: validated.data.injuries || "",
      weakPoints: validated.data.weakPoints || "",
      likedExercises: validated.data.likedExercises || "",
      dislikedExercises: validated.data.dislikedExercises || "",
      sex: validated.data.sex,
      steps: validated.data.steps,
      jobType: validated.data.jobType,
      jobDescription: validated.data.jobDescription,
      hasCardio: validated.data.hasCardio,
      cardioDetails: validated.data.hasCardio === "Yes" ? validated.data.cardioDetails || "" : null,
      status: "pending_payment",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const redirectHeaders = new Headers();

    if (validated.data.submitAction === "save") {
      redirectHeaders.set("Location", "/dashboard?saved=1");
    } else {
      const checkoutUrl = await createCheckoutSession({
        stripeSecretKey: env.STRIPE_SECRET_KEY,
        requestId,
        customerEmail: isLoggedIn ? currentUser!.email! : validated.data.email!,
        siteUrl: ctx.url.origin,
        cancelUrl: `${ctx.url.origin}/custom-plans/apply`,
        env,
      });
      redirectHeaders.set("Location", checkoutUrl);
    }
    if (sessionToken) {
      const isSecure = env.BETTER_AUTH_URL?.startsWith("https://") ?? false;
      redirectHeaders.append(
        "Set-Cookie",
        `buffbook-session-token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax${isSecure ? "; Secure" : ""}; Max-Age=${7 * 24 * 60 * 60}`,
      );
    }
    return new Response(null, { status: 302, headers: redirectHeaders });
  } catch (err) {
    console.error("APPLY FORM ERROR:", err);
    return ctx.redirect("/custom-plans/apply?error=server&msg=An+unexpected+error+occurred.+Please+try+again.");
  }
};
