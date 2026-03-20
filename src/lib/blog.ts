import type { AstroGlobal } from "astro";
import type { APIContext } from "astro";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Context =
  | AstroGlobal
  | APIContext
  | { locals: any; session: any; request: any };

export interface BlogPost {
  slug: string;
  author: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  categories: string[];
  content: string;
}

const POST_PREFIX = "post:";

function getKV(context: Context): KVNamespace {
  const kv = context.locals.runtime.env.BLOG_PANGALOS_AUTH_KV;
  if (!kv) {
    throw new Error("BLOG_PANGALOS_AUTH_KV binding is not configured");
  }
  return kv;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function savePost(
  context: Context,
  post: BlogPost
): Promise<void> {
  const kv = getKV(context);
  await kv.put(`${POST_PREFIX}${post.slug}`, JSON.stringify(post));
}

export async function getPost(
  context: Context,
  slug: string
): Promise<BlogPost | null> {
  const kv = getKV(context);
  const data = await kv.get(`${POST_PREFIX}${slug}`);
  return data ? JSON.parse(data) : null;
}

export async function listPosts(context: Context): Promise<BlogPost[]> {
  const kv = getKV(context);
  const keys = await kv.list({ prefix: POST_PREFIX });
  const posts: BlogPost[] = [];

  for (const key of keys.keys) {
    const data = await kv.get(key.name);
    if (data) {
      posts.push(JSON.parse(data));
    }
  }

  return posts;
}

export async function deletePost(
  context: Context,
  slug: string
): Promise<void> {
  const kv = getKV(context);
  await kv.delete(`${POST_PREFIX}${slug}`);
}
