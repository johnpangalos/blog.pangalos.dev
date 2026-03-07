const editor = document.getElementById("editor") as HTMLTextAreaElement;
const titleInput = document.getElementById("fm-title") as HTMLInputElement;
const descInput = document.getElementById(
  "fm-description",
) as HTMLTextAreaElement;
const tagsInput = document.getElementById("fm-tags") as HTMLInputElement;
const catsInput = document.getElementById("fm-categories") as HTMLInputElement;
const saveBtn = document.getElementById("save-btn")!;
const publishBtn = document.getElementById("publish-btn")!;
const status = document.getElementById("status")!;

let currentDraftId = new URL(window.location.href).searchParams.get("draft");

function getFrontmatter() {
  return {
    author: "John Pangalos",
    title: titleInput.value || "Untitled",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    description: descInput.value || "",
    tags: tagsInput.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    categories: catsInput.value
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
  };
}

// Load existing draft if editing
if (currentDraftId) {
  fetch(`/api/drafts/${currentDraftId}`)
    .then((r) => r.json())
    .then((data) => {
      editor.value = data.content || "";
      if (data.frontmatter) {
        titleInput.value = data.frontmatter.title || "";
        descInput.value = data.frontmatter.description || "";
        tagsInput.value = (data.frontmatter.tags || []).join(", ");
        catsInput.value = (data.frontmatter.categories || []).join(", ");
      }
    })
    .catch(() => {
      status.textContent = "Failed to load draft";
    });
}

// Auto-save every 30 seconds
let autoSaveTimer: ReturnType<typeof setTimeout>;
editor.addEventListener("input", () => {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => saveDraft(true), 30000);
});

async function saveDraft(silent = false) {
  const res = await fetch("/api/drafts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: currentDraftId,
      title: titleInput.value || "Untitled",
      content: editor.value,
      frontmatter: getFrontmatter(),
    }),
  });

  if (res.ok) {
    const data = await res.json();
    currentDraftId = data.id;
    const url = new URL(window.location.href);
    url.searchParams.set("draft", currentDraftId);
    history.replaceState(null, "", url);
    if (!silent) {
      status.textContent = "Draft saved!";
      setTimeout(() => (status.textContent = ""), 2000);
    }
  } else {
    status.textContent = "Failed to save draft";
  }
}

saveBtn.addEventListener("click", () => saveDraft(false));

publishBtn.addEventListener("click", async () => {
  if (!titleInput.value) {
    status.textContent = "Please set a title before publishing";
    return;
  }

  if (!confirm("Create a PR for this post?")) return;

  await saveDraft(true);

  status.textContent = "Publishing...";
  const res = await fetch(`/api/drafts/${currentDraftId}/publish`, {
    method: "POST",
  });

  if (res.ok) {
    const data = await res.json();
    status.innerHTML = `PR created! <a href="${data.pr_url}" target="_blank" class="underline text-fuchsia-700 dark:text-fuchsia-500">View pull request</a>`;
  } else {
    const err = await res.json();
    status.textContent = `Publish failed: ${err.error}`;
  }
});
