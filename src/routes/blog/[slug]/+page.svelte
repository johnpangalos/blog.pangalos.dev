<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;
</script>

<article>
  <h1 class="!mb-0 pb-2">{data.title}</h1>
  <p class="!m-0 pb-1 font-bold">{data.date}</p>
  <svelte:component this={data.content} />
</article>
