import { useState, useEffect, useRef } from "react";
import { actions } from "astro:actions";
import { Button } from "react-aria-components";
import MdxEditorField from "./MdxEditorField";

export interface PostFormData {
  slug: string;
  sha: string;
  content: string;
}

const DEFAULT_CONTENT = `---
author: "John Pangalos"
title: ""
date: ""
description: ""
tags: []
categories: []
draft: true
---

`;

function getStorageKey(slug?: string): string {
  if (slug) return `admin-article-edit-${slug}`;
  return "admin-article-new";
}

function getLoadingMessage(draft: boolean, isEditing: boolean) {
  if (isEditing) return "Updating...";
  if (draft) return "Saving draft...";
  return "Publishing...";
}

function getSuccessMessage(draft: boolean, isEditing: boolean) {
  if (isEditing) return "Post updated! It will be live after the site rebuilds.";
  if (draft) return "Draft saved to repo!";
  return "Post committed to repo! It will be live after the site rebuilds.";
}

function isDraftContent(content: string): boolean {
  return /^draft:\s*true\s*$/m.test(content);
}

function getStatusColorClass(type: string) {
  if (type === "error") return "text-red-600 dark:text-red-400";
  if (type === "success") return "text-green-600 dark:text-green-400";
  return "text-stone-500";
}

function formatSavedTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString();
  } catch {
    return "";
  }
}

export default function PostForm({
  initialData,
}: {
  initialData?: PostFormData;
}) {
  const isEditing = !!initialData;
  const storageKey = getStorageKey(initialData?.slug);

  const [status, setStatus] = useState<{
    message: string;
    type: "idle" | "loading" | "success" | "error";
  }>({ message: "", type: "idle" });

  const [localSavedAt, setLocalSavedAt] = useState<string | null>(null);
  const [localContent, setLocalContent] = useState<string | null>(null);
  const [contentReady, setContentReady] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as { content: string; savedAt: string };
        setLocalContent(parsed.content);
        setLocalSavedAt(parsed.savedAt);
      }
    } catch {
      // ignore parse errors
    }
    setContentReady(true);
  }, [storageKey]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const handleContentChange = (content: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      try {
        const savedAt = new Date().toISOString();
        localStorage.setItem(storageKey, JSON.stringify({ content, savedAt }));
        setLocalSavedAt(savedAt);
      } catch {
        // ignore storage errors
      }
    }, 1000);
  };

  const clearLocalDraft = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setLocalSavedAt(null);
    setLocalContent(null);
    setEditorKey((k) => k + 1);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    draft: boolean,
  ) => {
    e.preventDefault();

    setStatus({
      message: getLoadingMessage(draft, isEditing),
      type: "loading",
    });

    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;

    let result;
    if (isEditing) {
      result = await actions.blog.update({
        slug: initialData.slug,
        sha: initialData.sha,
        content,
        draft,
      });
    } else {
      result = await actions.blog.create({ content, draft });
    }

    if (result.error) {
      setStatus({ message: `Error: ${result.error.message}`, type: "error" });
      return;
    }

    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setLocalSavedAt(null);

    setStatus({
      message: getSuccessMessage(draft, isEditing),
      type: "success",
    });
    setTimeout(() => {
      window.location.href = "/admin";
    }, 2000);
  };

  const serverContent = isEditing ? initialData.content : DEFAULT_CONTENT;
  let defaultContent = serverContent;
  if (localContent !== null) defaultContent = localContent;

  let submitLabel = "Publish";
  if (isEditing) submitLabel = "Update";
  const submitDraft = isEditing && isDraftContent(initialData.content);

  if (!contentReady) return null;

  return (
    <form
      onSubmit={(e) => handleSubmit(e, submitDraft)}
      className="mt-8 space-y-4"
    >
      {localSavedAt && (
        <div className="flex items-center gap-3 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm dark:border-amber-700 dark:bg-amber-950">
          <span className="text-amber-800 dark:text-amber-200">
            Local draft saved at {formatSavedTime(localSavedAt)}
          </span>
          <button
            type="button"
            onClick={clearLocalDraft}
            className="text-amber-600 underline hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
          >
            Discard
          </button>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold">Content (MDX)</label>
        <div className="mt-1">
          <MdxEditorField
            key={editorKey}
            name="content"
            defaultValue={defaultContent}
            onChange={handleContentChange}
          />
        </div>
      </div>

      {status.type !== "idle" && (
        <div className={`text-sm ${getStatusColorClass(status.type)}`}>
          {status.message}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          className="rounded bg-fuchsia-700 px-4 py-2 font-bold text-white hover:bg-fuchsia-800 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-700"
        >
          {submitLabel}
        </Button>
        {!isEditing && (
          <Button
            type="button"
            onPress={(e) => {
              const form = (e.target as HTMLElement).closest("form");
              if (form && form.reportValidity()) {
                handleSubmit(
                  { preventDefault: () => {}, currentTarget: form } as React.FormEvent<HTMLFormElement>,
                  true,
                );
              }
            }}
            className="rounded border border-stone-300 bg-white px-4 py-2 font-bold text-stone-700 hover:bg-stone-100 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
          >
            Save as Draft
          </Button>
        )}
      </div>
    </form>
  );
}
