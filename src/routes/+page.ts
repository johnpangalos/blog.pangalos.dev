import Button from "../components/Button.svelte";
export async function load({ fetch }) {
  const response = await fetch("/api/posts");

  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
  return {
    status: response.status,
    props: {
      posts: response.ok && (await response.json()),
    },
  };
}
