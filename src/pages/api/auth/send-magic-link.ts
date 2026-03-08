import type { APIRoute } from "astro";
import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

const ALLOWED_EMAIL = "john@pangalos.dev";
const FROM_EMAIL = "admin@notify.pangalos.dev";
const TOKEN_TTL_SECONDS = 600; // 10 minutes

export const POST: APIRoute = async ({ request, locals }) => {
  const { env } = locals.runtime;

  const formData = await request.formData();
  const email = formData.get("email")?.toString().trim().toLowerCase();

  if (!email || email !== ALLOWED_EMAIL) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/admin/login?error=invalid" },
    });
  }

  const token = crypto.randomUUID();
  await env.AUTH_STORE.put(`magic:${token}`, email, {
    expirationTtl: TOKEN_TTL_SECONDS,
  });

  const siteUrl = env.SITE_URL || new URL(request.url).origin;
  const magicLink = `${siteUrl}/api/auth/verify?token=${token}`;

  const msg = createMimeMessage();
  msg.setSender({ name: "Blog Admin", addr: FROM_EMAIL });
  msg.setRecipient(email);
  msg.setSubject("Your magic login link");
  msg.addMessage({
    contentType: "text/html",
    data: `
      <p>Click the link below to log in to the admin panel:</p>
      <p><a href="${magicLink}">${magicLink}</a></p>
      <p>This link expires in 10 minutes.</p>
    `,
  });

  try {
    const message = new EmailMessage(FROM_EMAIL, email, msg.asRaw());
    await env.SEND_EMAIL.send(message);
  } catch (e) {
    console.error("Failed to send magic link email:", e);
    return new Response(null, {
      status: 303,
      headers: { Location: "/admin/login?error=send-failed" },
    });
  }

  return new Response(null, {
    status: 303,
    headers: { Location: "/admin/login?sent=true" },
  });
};
