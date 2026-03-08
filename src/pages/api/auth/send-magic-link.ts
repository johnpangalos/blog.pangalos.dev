import type { APIRoute } from "astro";
import { Resend } from "resend";

const ALLOWED_EMAIL = "john@pangalos.dev";
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

  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "blog@pangalos.dev",
    to: email,
    subject: "Your magic login link",
    html: `
      <p>Click the link below to log in to the admin panel:</p>
      <p><a href="${magicLink}">${magicLink}</a></p>
      <p>This link expires in 10 minutes.</p>
    `,
  });

  if (error) {
    console.error("Failed to send magic link email:", error);
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
