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

<svelte:head>
  <title>{$$props.slug}</title>
</svelte:head>

<div class="prose prose-slate pt-10 pb-20 dark:prose-invert lg:prose-lg">
  <slot />
</div>
