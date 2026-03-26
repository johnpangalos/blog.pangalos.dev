import { actions } from "astro:actions";
import { Button } from "@headlessui/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await actions.auth.logout({});
    window.location.href = "/admin/login";
  };

  return (
    <Button
      onClick={handleLogout}
      className="rounded bg-stone-200 px-3 py-1 text-sm hover:bg-stone-300 dark:bg-stone-700 dark:hover:bg-stone-600"
    >
      Logout
    </Button>
  );
}
