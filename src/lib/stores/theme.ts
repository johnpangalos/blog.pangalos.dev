import { session } from "$app/stores";
import { derived, type Writable } from "svelte/store";

export const theme = derived<Writable<{ theme: Theme }>, Theme>(
  session,
  ($session, set) => {
    set($session.theme);
  }
);

export const setTheme = async (theme: Theme) => {
  await fetch("/api/theme", { method: "PUT", body: JSON.stringify({ theme }) });
  session.update(($session) => ({ ...$session, theme }));
};
