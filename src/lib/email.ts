import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM_EMAIL ?? "Briv <hello@usebriv.com>";

const resend = apiKey ? new Resend(apiKey) : null;

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, html, replyTo }: SendArgs) {
  if (!resend) {
    console.warn("[email] Resend not configured — skipping send", { to, subject });
    return { id: null, skipped: true } as const;
  }
  const result = await resend.emails.send({
    from,
    to,
    subject,
    html,
    replyTo,
  });
  return { id: result.data?.id ?? null, skipped: false } as const;
}
