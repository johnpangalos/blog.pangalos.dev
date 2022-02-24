import type { Handle, RequestEvent } from "@sveltejs/kit";

export function getSession(event: RequestEvent): App.Session {
  const cookie = event.request.headers.get("cookie");
  if (cookie?.includes("dark"))
    return {
      theme: "dark",
    };

  return {
    theme: "light",
  };
}

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event, {
    transformPage: ({ html }) => {
      const isDark = event.request.headers.get("cookie").includes("dark");
      return html.replace("###theme-class###", isDark ? "dark" : "");
    },
  });

  return response;
};
