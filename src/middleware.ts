import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only protect /admin routes (but not /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const cookieHeader = context.request.headers.get("cookie") || "";
    const sessionMatch = cookieHeader.match(/session=([^;]+)/);
    const sessionId = sessionMatch?.[1];

    if (!sessionId) {
      return context.redirect("/admin/login", 303);
    }

    const { env } = (context.locals as any).runtime;
    const email = await env.AUTH_STORE.get(`session:${sessionId}`);

    if (!email) {
      return context.redirect("/admin/login", 303);
    }
  }

  return next();
});
