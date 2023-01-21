import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => {
      const isDark = event.cookies.get("theme")?.includes("dark");
      return html.replace("###theme-class###", isDark ? "dark" : "");
    },
  });

  return response;
};
