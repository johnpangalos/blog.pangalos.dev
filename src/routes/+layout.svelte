<script lang="ts">
  import { enhance } from "$app/forms";
  import type { LayoutData } from "./$types";
  import "../app.css";

  export let data: LayoutData;
  let theme = data.theme ?? "light";
</script>

<div class="m-auto h-full max-w-2xl px-4 md:px-0">
  <nav class="flex items-center justify-between border-b-2 pt-4 lg:pt-10">
    <a
      href="/"
      class="font-display text-2xl font-extrabold text-fuchsia-700 dark:text-fuchsia-500"
    >
      blog.pangalos.dev
    </a>
    <form
      method="POST"
      action="/?/set-theme"
      use:enhance={() => {
        return async ({ result }) => {
          if (result.type !== "success") return;

          if (result.data.theme === "dark")
            document.documentElement.classList.add("dark");
          else document.documentElement.classList.remove("dark");
          theme = result.data.theme;
        };
      }}
    >
      <button>{theme}</button>
    </form>
  </nav>
  <main>
    <slot />
  </main>
</div>
