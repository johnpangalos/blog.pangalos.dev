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

<h2 class="py-4 text-4xl font-bold">Articles</h2>
<ul class="pb-8">
  {#each $$props.posts as post}
    <li>
      <h3 class="pb-2 text-2xl font-bold">{post.meta.title}</h3>
      <p class="pb-1 font-bold">
        {new Date(post.meta.date).toLocaleDateString(undefined, {
          weekday: undefined,
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      <p class="pb-2">{post.meta.description}</p>
      <div
        class="flex justify-end text-lg text-fuchsia-600 underline dark:text-fuchsia-400"
      >
        <a href={post.path}>go.to.article</a>
      </div>
    </li>
  {/each}
</ul>
