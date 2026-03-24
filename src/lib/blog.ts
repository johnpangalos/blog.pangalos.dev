import { env } from "cloudflare:workers";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

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

const GITHUB_REPO_OWNER = "johnpangalos";
const GITHUB_REPO_NAME = "blog.pangalos.dev";
const CONTENT_PATH = "src/content/blog";

function getOctokit(): Octokit {
  const appId = env.BLOG_GITHUB_APP_CLIENT_ID;
  const installationId = env.BLOG_GITHUB_APP_INSTALLATION_ID;
  const privateKey = env.BLOG_GITHUB_APP_PRIVATE_KEY;

  if (!appId || !installationId || !privateKey) {
    throw new Error(
      "GitHub App credentials not configured (BLOG_GITHUB_APP_CLIENT_ID, BLOG_GITHUB_APP_INSTALLATION_ID, BLOG_GITHUB_APP_PRIVATE_KEY)",
    );
  }

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
      installationId,
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
  post: BlogPost,
): Promise<void> {
  const octokit = getOctokit();
  const filePath = `${CONTENT_PATH}/${post.slug}.mdx`;
  const fileContent = buildMdxContent(post);
  const encodedContent = btoa(
    new TextEncoder()
      .encode(fileContent)
      .reduce((acc, byte) => acc + String.fromCharCode(byte), ""),
  );

  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    path: filePath,
    message: `Add blog post: ${post.title}`,
    content: encodedContent,
  });
}

export async function listPosts(): Promise<
  { name: string; slug: string; sha: string }[]
> {
  const octokit = getOctokit();

  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_REPO_OWNER,
      repo: GITHUB_REPO_NAME,
      path: CONTENT_PATH,
    });

    if (!Array.isArray(data)) return [];

    return data
      .filter((f) => f.type === "file" && f.name.endsWith(".mdx"))
      .map((f) => ({
        name: f.name.replace(/\.mdx$/, ""),
        slug: f.name.replace(/\.mdx$/, ""),
        sha: f.sha,
      }));
  } catch (e: unknown) {
    if (e instanceof Error && "status" in e && (e as { status: number }).status === 404) return [];
    throw e;
  }
}

export async function deletePost(
  slug: string,
): Promise<void> {
  const octokit = getOctokit();
  const filePath = `${CONTENT_PATH}/${slug}.mdx`;

  const { data } = await octokit.repos.getContent({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    path: filePath,
  });

  if (Array.isArray(data)) {
    throw new Error(`Post not found: ${slug}`);
  }

  await octokit.repos.deleteFile({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    path: filePath,
    message: `Delete blog post: ${slug}`,
    sha: data.sha,
  });
}

export async function postExists(
  slug: string,
): Promise<boolean> {
  const octokit = getOctokit();
  const filePath = `${CONTENT_PATH}/${slug}.mdx`;

  try {
    await octokit.repos.getContent({
      owner: GITHUB_REPO_OWNER,
      repo: GITHUB_REPO_NAME,
      path: filePath,
    });
    return true;
  } catch {
    return false;
  }
}
