<script lang="ts">
  import type { LayoutData } from "./$types";
  import { title } from "$lib/meta";

  export let data: LayoutData;
</script>

<svelte:head>
  <title>{data.title} - {title}</title>
</svelte:head>

<div class="prose prose-slate pt-10 pb-20 dark:prose-invert lg:prose-lg">
  <slot />
</div>
