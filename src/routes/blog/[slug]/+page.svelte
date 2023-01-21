<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;
</script>

<article>
  <h1 class="!mb-0 pb-2">{data.title}</h1>
  <p class="font-bold pb-1 !m-0">{data.date}</p>
  <svelte:component this={data.content} />
</article>
