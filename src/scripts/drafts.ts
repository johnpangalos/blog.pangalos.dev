const list = document.getElementById("drafts-list")!;

function escapeHtml(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function loadDrafts() {
  const res = await fetch("/api/drafts");
  if (!res.ok) {
    list.innerHTML = '<p class="text-red-500">Failed to load drafts</p>';
    return;
  }

  const drafts = await res.json();

  if (drafts.length === 0) {
    list.innerHTML =
      '<p class="text-stone-500">No drafts yet. Start writing!</p>';
    return;
  }

  list.innerHTML = drafts
    .sort(
      (a: { updatedAt: string }, b: { updatedAt: string }) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .map(
      (d: { id: string; title: string; updatedAt: string }) => `
      <div class="flex items-center justify-between rounded border border-stone-300 p-3 dark:border-stone-600">
        <div>
          <a href="/write?draft=${d.id}" class="font-bold text-fuchsia-700 underline dark:text-fuchsia-500">
            ${escapeHtml(d.title)}
          </a>
          <p class="text-sm text-stone-500">${new Date(d.updatedAt).toLocaleDateString()}</p>
        </div>
        <button
          data-id="${d.id}"
          class="delete-btn text-sm text-red-500 underline"
        >
          Delete
        </button>
      </div>
    `,
    )
    .join("");

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this draft?")) return;
      const id = (btn as HTMLElement).dataset.id;
      await fetch(`/api/drafts/${id}`, { method: "DELETE" });
      loadDrafts();
    });
  });
}

loadDrafts();
