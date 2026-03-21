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

const GITHUB_REPO = "johnpangalos/blog.pangalos.dev";
const CONTENT_PATH = "src/content/blog";

function getGitHubToken(context: Context): string {
  const token = context.locals.runtime.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured");
  }
  return token;
}

async function githubApi(
  token: string,
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = endpoint.startsWith("https://")
    ? endpoint
    : `https://api.github.com/repos/${GITHUB_REPO}${endpoint}`;

  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildMdxContent(post: Omit<BlogPost, "slug">): string {
  const frontmatter = [
    "---",
    `author: "${post.author}"`,
    `title: "${post.title}"`,
    `date: "${post.date}"`,
    `description: "${post.description}"`,
    `tags: [${post.tags.map((t) => `"${t}"`).join(", ")}]`,
    `categories: [${post.categories.map((c) => `"${c}"`).join(", ")}]`,
    "---",
  ].join("\n");

  return `${frontmatter}\n\n${post.content}\n`;
}

export async function createPost(
  context: Context,
  post: BlogPost,
): Promise<void> {
  const token = getGitHubToken(context);
  const filePath = `${CONTENT_PATH}/${post.slug}.mdx`;
  const fileContent = buildMdxContent(post);
  const encodedContent = btoa(
    new TextEncoder()
      .encode(fileContent)
      .reduce((acc, byte) => acc + String.fromCharCode(byte), ""),
  );

  const response = await githubApi(token, `/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Add blog post: ${post.title}`,
      content: encodedContent,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `GitHub API error: ${(error as { message?: string }).message || response.statusText}`,
    );
  }
}

export async function listPosts(
  context: Context,
): Promise<{ name: string; slug: string; sha: string }[]> {
  const token = getGitHubToken(context);
  const response = await githubApi(token, `/contents/${CONTENT_PATH}`);

  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const files = (await response.json()) as {
    name: string;
    sha: string;
    type: string;
  }[];
  return files
    .filter((f) => f.type === "file" && f.name.endsWith(".mdx"))
    .map((f) => ({
      name: f.name.replace(/\.mdx$/, ""),
      slug: f.name.replace(/\.mdx$/, ""),
      sha: f.sha,
    }));
}

export async function deletePost(
  context: Context,
  slug: string,
): Promise<void> {
  const token = getGitHubToken(context);
  const filePath = `${CONTENT_PATH}/${slug}.mdx`;

  // Get the file SHA first
  const getResponse = await githubApi(token, `/contents/${filePath}`);
  if (!getResponse.ok) {
    throw new Error(`Post not found: ${slug}`);
  }

  const fileInfo = (await getResponse.json()) as { sha: string };

  const response = await githubApi(token, `/contents/${filePath}`, {
    method: "DELETE",
    body: JSON.stringify({
      message: `Delete blog post: ${slug}`,
      sha: fileInfo.sha,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `GitHub API error: ${(error as { message?: string }).message || response.statusText}`,
    );
  }
}

export async function postExists(
  context: Context,
  slug: string,
): Promise<boolean> {
  const token = getGitHubToken(context);
  const filePath = `${CONTENT_PATH}/${slug}.mdx`;
  const response = await githubApi(token, `/contents/${filePath}`);
  return response.ok;
}
