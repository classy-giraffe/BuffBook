import { env } from "cloudflare:workers";

/**
 * Email sending via Resend HTTP API.
 * Falls back to console.log if RESEND_API_KEY is not configured.
 */

const RESEND_API = "https://api.resend.com/emails";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(opts: EmailOptions): Promise<void> {
  const apiKey = env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[EMAIL] Not configured. Would send to ${opts.to}:`, opts.subject);
    console.log(`[EMAIL] Body: ${opts.html}`);
    return;
  }

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BuffBook <noreply@buffbook.org>",
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`[EMAIL] Resend API error ${res.status}: ${errBody}`);
    }
  } catch (err) {
    console.error("[EMAIL] Failed to send:", err);
  }
}
