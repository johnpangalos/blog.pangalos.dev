import type { RequestEvent } from "@sveltejs/kit";

export function getSession(event: RequestEvent): App.Session {
  const cookie = event.request.headers.get("cookie");
  if (cookie?.includes("theme=light"))
    return {
      theme: "light",
    };
  if (cookie?.includes("theme=dark"))
    return {
      theme: "dark",
    };
  return { theme: null };
}
