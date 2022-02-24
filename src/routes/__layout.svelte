<script lang="ts">
  import "../app.css";
  import { setTheme, theme } from "$lib/stores/theme";
</script>

<div class="m-auto h-full max-w-2xl">
  <nav class="flex items-center justify-between border-b-2 py-3">
    <div
      class="font-serif text-3xl font-extrabold text-fuchsia-700 dark:text-fuchsia-500"
    >
      blog.pangalos.dev
    </div>
    <div>
      <button
        on:click={() => {
          setTheme($theme === "dark" ? "light" : "dark");
          if ($theme === "light")
            document.documentElement.classList.add("dark");
          else document.documentElement.classList.remove("dark");
        }}>{$theme === "dark" ? "light" : "dark"}</button
      >
    </div>
  </nav>
  <main>
    <slot />
  </main>
</div>
