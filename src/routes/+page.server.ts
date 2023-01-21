import type { Actions } from "./$types";
import posts from "$lib/posts";
import { dev } from "$app/environment";

export async function load() {
  return {
    posts,
  };
}

export const actions: Actions = {
  "set-theme": async (event) => {
    const theme = event.cookies.get("theme");
    const newTheme = theme === "dark" ? "light" : "dark";
    event.cookies.set("theme", newTheme, {
      expires: new Date(new Date(Date.now() + 60 * 60 * 24 * 30)),
      httpOnly: !dev,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return {
      theme: newTheme,
    };
  },
};
