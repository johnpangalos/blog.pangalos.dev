<script context="module" lang="ts">
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

<ul>
  {#each $$props.posts as post}
    <li><a href={post.path}>{post.meta.title}</a></li>
  {/each}
</ul>
