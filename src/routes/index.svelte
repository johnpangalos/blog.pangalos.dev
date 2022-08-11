<script context="module" lang="ts">
  import Button from "../components/Button.svelte";
  export async function load({ fetch }) {
    const response = await fetch("/api/posts");

    return {
      status: response.status,
      props: {
        posts: response.ok && (await response.json()),
      },
    };
  }
</script>

<h2 class="pt-6 pb-4 text-4xl font-bold">Articles</h2>
<ul class="space-y-1 pb-8">
  {#each $$props.posts as post}
    <li>
      <h3 class="pb-2 text-2xl font-bold">{post.meta.title}</h3>
      <p class="pb-1 font-bold">{post.meta.date}</p>
      <p class="pb-2">{post.meta.description}</p>
      <div class="flex justify-end">
        <Button to={post.path}>Go to article</Button>
      </div>
    </li>
  {/each}
</ul>
