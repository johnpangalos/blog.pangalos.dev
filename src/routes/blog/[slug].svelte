<script context="module">
  /** @type {import('./__types/[slug]').Load} */
  export async function load({ params, fetch, session, stuff }) {
    return {
      status: response.status,
      props: {
        slug: response.ok && params.slug,
      },
    };
  }
</script>

<script>
  export let section;
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
