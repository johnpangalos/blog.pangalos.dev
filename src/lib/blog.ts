import { env } from "cloudflare:workers";

type Context = {
  locals: App.Locals;
};

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

function getAppCredentials(): {
  appId: string;
  installationId: string;
  privateKey: string;
} {
  const appId = env.BLOG_GITHUB_APP_ID;
  const installationId = env.BLOG_GITHUB_APP_INSTALLATION_ID;
  const privateKey = env.BLOG_GITHUB_APP_PRIVATE_KEY;

  if (!appId || !installationId || !privateKey) {
    throw new Error(
      "GitHub App credentials not configured (BLOG_GITHUB_APP_ID, BLOG_GITHUB_APP_INSTALLATION_ID, BLOG_GITHUB_APP_PRIVATE_KEY)",
    );
  }

  return { appId, installationId, privateKey };
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/-----BEGIN RSA PRIVATE KEY-----/, "")
    .replace(/-----END RSA PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function base64url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function createGitHubJWT(
  appId: string,
  privateKeyPem: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(
    new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })),
  );
  const payload = base64url(
    new TextEncoder().encode(
      JSON.stringify({ iat: now - 60, exp: now + 600, iss: appId }),
    ),
  );

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(privateKeyPem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(`${header}.${payload}`),
  );

  return `${header}.${payload}.${base64url(signature)}`;
}

async function getInstallationToken(context: Context): Promise<string> {
  const { appId, installationId, privateKey } = getAppCredentials();
  const jwt = await createGitHubJWT(appId, privateKey);

  const res = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get installation token: ${error}`);
  }

  const data = (await res.json()) as { token: string };
  return data.token;
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
  const token = await getInstallationToken(context);
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
  const token = await getInstallationToken(context);
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
  const token = await getInstallationToken(context);
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
  const token = await getInstallationToken(context);
  const filePath = `${CONTENT_PATH}/${slug}.mdx`;
  const response = await githubApi(token, `/contents/${filePath}`);
  return response.ok;
}
