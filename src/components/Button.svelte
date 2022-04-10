<script lang="ts">
  export let to: string;
</script>

<a
  href={to}
  type="button"
  class="flex justify-end rounded border-2 border-fuchsia-700 py-1 px-3 text-lg font-bold text-fuchsia-700 hover:bg-gray-100 dark:border-fuchsia-400 dark:text-fuchsia-400 dark:hover:bg-stone-800"
>
  <slot />
</a>
