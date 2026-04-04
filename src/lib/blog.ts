import { env } from "cloudflare:workers";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

export interface RawPost {
  slug: string;
  sha: string;
  content: string;
}

const GITHUB_REPO_OWNER = "johnpangalos";
const GITHUB_REPO_NAME = "blog.pangalos.dev";
const CONTENT_PATH = "src/content/blog";

function derLength(length: number): number[] {
  if (length < 0x80) return [length];
  const bytes: number[] = [];
  let temp = length;
  while (temp > 0) {
    bytes.unshift(temp & 0xff);
    temp >>= 8;
  }
  return [0x80 | bytes.length, ...bytes];
}

function wrapDer(tag: number, content: Uint8Array): Uint8Array {
  const len = derLength(content.length);
  const result = new Uint8Array(1 + len.length + content.length);
  result[0] = tag;
  result.set(len, 1);
  result.set(content, 1 + len.length);
  return result;
}

/**
 * Convert a PKCS#1 PEM private key to PKCS#8 format.
 * universal-github-app-jwt v2 only supports PKCS#8.
 */
function convertPkcs1ToPkcs8(pem: string): string {
  const base64 = pem
    .replace(/-----BEGIN RSA PRIVATE KEY-----/, "")
    .replace(/-----END RSA PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const pkcs1Der = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  // PrivateKeyInfo SEQUENCE { version INTEGER 0, AlgorithmIdentifier, OCTET STRING }
  const version = new Uint8Array([0x02, 0x01, 0x00]);
  // AlgorithmIdentifier: SEQUENCE { OID rsaEncryption (1.2.840.113549.1.1.1), NULL }
  const algoId = wrapDer(
    0x30,
    new Uint8Array([
      0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05,
      0x00,
    ]),
  );
  const octetString = wrapDer(0x04, pkcs1Der);

  const inner = new Uint8Array(
    version.length + algoId.length + octetString.length,
  );
  inner.set(version, 0);
  inner.set(algoId, version.length);
  inner.set(octetString, version.length + algoId.length);

  const pkcs8Der = wrapDer(0x30, inner);
  const pkcs8Base64 = btoa(
    pkcs8Der.reduce((s, b) => s + String.fromCharCode(b), ""),
  );
  const lines = pkcs8Base64.match(/.{1,64}/g) || [];
  return `-----BEGIN PRIVATE KEY-----\n${lines.join("\n")}\n-----END PRIVATE KEY-----`;
}

function ensurePkcs8(pem: string): string {
  if (pem.includes("-----BEGIN RSA PRIVATE KEY-----")) {
    return convertPkcs1ToPkcs8(pem);
  }
  return pem;
}

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
      privateKey: ensurePkcs8(privateKey),
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

function addAstroDirectives(content: string): string {
  return content.replace(
    /<Tooltip(?![^>]*client:visible)/g,
    "<Tooltip client:visible",
  );
}

export function extractTitle(content: string): string {
  const dq = content.match(/title:\s*"(.+?)"/);
  if (dq) return dq[1];
  const sq = content.match(/title:\s*'(.+?)'/);
  if (sq) return sq[1];
  const uq = content.match(/title:\s*(.+)/);
  if (uq) return uq[1].trim();
  return "";
}

export function setDraftFlag(content: string, draft: boolean): string {
  const replaced = content.replace(
    /^(---\s*\n[\s\S]*?)draft:\s*(true|false)\s*$/m,
    `$1draft: ${draft}`,
  );
  if (replaced !== content) return replaced;
  return content.replace(/^(---\s*\n)/m, `$1draft: ${draft}\n`);
}

function prepareContent(content: string, draft: boolean): string {
  const withDraft = setDraftFlag(content, draft);
  return addAstroDirectives(withDraft);
}

export async function createPost(
  slug: string,
  content: string,
  draft: boolean,
): Promise<void> {
  const octokit = getOctokit();
  const filePath = `${CONTENT_PATH}/${slug}.mdx`;
  const fileContent = prepareContent(content, draft);
  const title = extractTitle(content);
  const encodedContent = btoa(
    new TextEncoder()
      .encode(fileContent)
      .reduce((acc, byte) => acc + String.fromCharCode(byte), ""),
  );

  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    path: filePath,
    message: `Add blog post: ${title}`,
    content: encodedContent,
  });
}

export async function listPosts(): Promise<
  { name: string; slug: string; sha: string; draft: boolean }[]
> {
  const octokit = getOctokit();

  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_REPO_OWNER,
      repo: GITHUB_REPO_NAME,
      path: CONTENT_PATH,
    });

    if (!Array.isArray(data)) return [];

    const files = data.filter(
      (f) => f.type === "file" && f.name.endsWith(".mdx"),
    );

    const posts = await Promise.all(
      files.map(async (f) => {
        let draft = false;
        try {
          const { data: fileData } = await octokit.repos.getContent({
            owner: GITHUB_REPO_OWNER,
            repo: GITHUB_REPO_NAME,
            path: f.path,
          });
          if (!Array.isArray(fileData) && "content" in fileData && fileData.content) {
            const content = atob(fileData.content.replace(/\n/g, ""));
            const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
            if (match) {
              draft = /^draft:\s*true\s*$/m.test(match[1]);
            }
          }
        } catch {
          // If we can't read the file, assume not a draft
        }
        return {
          name: f.name.replace(/\.mdx$/, ""),
          slug: f.name.replace(/\.mdx$/, ""),
          sha: f.sha,
          draft,
        };
      }),
    );

    return posts;
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

export async function publishPost(slug: string): Promise<void> {
  const octokit = getOctokit();
  const filePath = `${CONTENT_PATH}/${slug}.mdx`;

  const { data } = await octokit.repos.getContent({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    path: filePath,
  });

  if (Array.isArray(data) || !("content" in data) || !data.content) {
    throw new Error(`Post not found: ${slug}`);
  }

  const content = atob(data.content.replace(/\n/g, ""));
  const updatedContent = content.replace(
    /^(---\s*\n[\s\S]*?)draft:\s*true\s*\n([\s\S]*?---)/m,
    "$1draft: false\n$2",
  );

  const encodedContent = btoa(
    new TextEncoder()
      .encode(updatedContent)
      .reduce((acc, byte) => acc + String.fromCharCode(byte), ""),
  );

  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    path: filePath,
    message: `Publish blog post: ${slug}`,
    content: encodedContent,
    sha: data.sha,
  });
}

export async function getPost(
  slug: string,
): Promise<RawPost | null> {
  const octokit = getOctokit();
  const filePath = `${CONTENT_PATH}/${slug}.mdx`;

  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_REPO_OWNER,
      repo: GITHUB_REPO_NAME,
      path: filePath,
    });

    if (Array.isArray(data) || !("content" in data) || !data.content) {
      return null;
    }

    const content = new TextDecoder().decode(
      Uint8Array.from(atob(data.content.replace(/\n/g, "")), (c) =>
        c.charCodeAt(0),
      ),
    );

    return { slug, sha: data.sha, content };
  } catch {
    return null;
  }
}

export async function updatePost(
  slug: string,
  content: string,
  draft: boolean,
  sha: string,
): Promise<void> {
  const octokit = getOctokit();
  const filePath = `${CONTENT_PATH}/${slug}.mdx`;
  const fileContent = prepareContent(content, draft);
  const title = extractTitle(content);
  const encodedContent = btoa(
    new TextEncoder()
      .encode(fileContent)
      .reduce((acc, byte) => acc + String.fromCharCode(byte), ""),
  );

  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    path: filePath,
    message: `Update blog post: ${title}`,
    content: encodedContent,
    sha,
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
