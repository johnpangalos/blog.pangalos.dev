import { actions } from "astro:actions";
import { Button } from "@headlessui/react";

interface Post {
  name: string;
  slug: string;
  sha: string;
}

interface Props {
  posts: Post[];
  listError: string | null;
}

export default function AdminDashboard({ posts, listError }: Props) {
  const handleLogout = async () => {
    await actions.auth.logout({});
    window.location.href = "/admin/login";
  };

  const handleDelete = async (slug: string) => {
    if (
      !confirm(
        `Delete "${slug}"? This will commit a deletion to the repo.`,
      )
    )
      return;

    const { error } = await actions.blog.delete({ slug });
    if (error) {
      alert(`Error: ${error.message}`);
      return;
    }
    window.location.reload();
  };

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Admin</h1>
        <div className="flex gap-2">
          <a
            href="/admin/new"
            className="rounded bg-fuchsia-700 px-3 py-1 text-sm font-bold text-white hover:bg-fuchsia-800 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-700"
          >
            New Post
          </a>
          <Button
            onClick={handleLogout}
            className="rounded bg-stone-200 px-3 py-1 text-sm hover:bg-stone-300 dark:bg-stone-700 dark:hover:bg-stone-600"
          >
            Logout
          </Button>
        </div>
      </div>

      {listError && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          {listError}
        </p>
      )}

      {posts.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-bold">Blog Posts</h2>
          <ul className="mt-4 space-y-3">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="flex items-center justify-between rounded border border-stone-200 p-3 dark:border-stone-700"
              >
                <div>
                  <a
                    href={`/blog/${post.slug}`}
                    className="font-bold text-fuchsia-700 hover:underline dark:text-fuchsia-400"
                  >
                    {post.name}
                  </a>
                </div>
                <Button
                  onClick={() => handleDelete(post.slug)}
                  className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
