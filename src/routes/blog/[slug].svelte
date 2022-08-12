<script context="module">
  // TODO should use a shadow endpoint instead, need to fix a bug first
  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const res = await fetch(`/blog/${params.slug}.json`);
    const { prev, next, section } = await res.json();

    return {
      props: {
        prev,
        next,
        section,
      },
    };
  }
</script>

<svelte:head>
  <title>{section.title} • blog.pangalos.dev</title>

  <meta name="twitter:title" content="blog.pangalos.dev" />
  <meta
    name="twitter:description"
    content="{section.title} • blog.pangalos.dev"
  />
  <meta name="Description" content="{section.title} • blog.pangalos.dev" />
</svelte:head>
