<script lang="ts">
  import type { PageData } from "./$types";
  import Button from "$lib/components/Button.svelte";
  import { title } from "$lib/meta";

  export let data: PageData;
  let { posts } = data;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<h2
  class="font-display text-amber-600 dark:text-amber-500 pt-6 pb-4 text-4xl font-bold"
>
  Articles
</h2>
<ul class="space-y-1 pb-8">
  {#each posts as post}
    <li>
      <h3
        class="pb-2 text-2xl font-bold font-display text-amber-600 dark:text-amber-500"
      >
        {post.title}
      </h3>
      <p class="pb-1 font-bold">{post.date}</p>
      <p class="pb-2">{post.description}</p>
      <div class="flex justify-end">
        <Button to={`blog/${post.slug}`}>Go to article</Button>
      </div>
    </li>
  {/each}
</ul>
