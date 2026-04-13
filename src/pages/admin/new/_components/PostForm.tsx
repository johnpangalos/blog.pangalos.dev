import { useState, useRef, useEffect, useCallback } from "react";
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

const AUTOSAVE_INTERVAL_MS = 30_000;

function getLoadingMessage(draft: boolean, isEditing: boolean) {
  if (draft) return "Saving draft...";
  if (isEditing) return "Updating...";
  return "Publishing...";
}

function getSuccessMessage(draft: boolean, isEditing: boolean) {
  if (draft) return "Draft saved to repo!";
  if (isEditing) return "Post updated! It will be live after the site rebuilds.";
  return "Post committed to repo! It will be live after the site rebuilds.";
}

function getStatusColorClass(type: string) {
  if (type === "error") return "text-red-600 dark:text-red-400";
  if (type === "success") return "text-green-600 dark:text-green-400";
  return "text-stone-500";
}

function parseDraftFlag(content: string): boolean {
  const match = content.match(/^draft:\s*(true|false)\s*$/m);
  if (match) {
    return match[1] === "true";
  }
  return true;
}

export default function PostForm({
  initialData,
}: {
  initialData?: PostFormData;
}) {
  const isEditing = !!initialData;

  const [status, setStatus] = useState<{
    message: string;
    type: "idle" | "loading" | "success" | "error";
  }>({ message: "", type: "idle" });

  const [autosaveStatus, setAutosaveStatus] = useState("");

  const contentRef = useRef(isEditing ? initialData.content : DEFAULT_CONTENT);
  const shaRef = useRef(initialData?.sha ?? "");
  const lastSavedContentRef = useRef(
    isEditing ? initialData.content : DEFAULT_CONTENT,
  );
  const savingRef = useRef(false);

  const handleContentChange = useCallback((newContent: string) => {
    contentRef.current = newContent;
  }, []);

  useEffect(() => {
    if (!isEditing) return;

    const interval = setInterval(async () => {
      const content = contentRef.current;

      if (content === lastSavedContentRef.current) return;
      if (savingRef.current) return;

      savingRef.current = true;
      setAutosaveStatus("Saving...");

      const draft = parseDraftFlag(content);

      const result = await actions.blog.update({
        slug: initialData.slug,
        sha: shaRef.current,
        content,
        draft,
      });

      savingRef.current = false;

      if (result.error) {
        setAutosaveStatus(`Autosave failed: ${result.error.message}`);
        return;
      }

      lastSavedContentRef.current = content;
      if (result.data?.sha) {
        shaRef.current = result.data.sha;
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setAutosaveStatus(`Saved at ${timeStr}`);
    }, AUTOSAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isEditing, initialData]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    draft: boolean,
  ) => {
    e.preventDefault();

    if (savingRef.current) {
      setStatus({
        message: "Please wait, save in progress...",
        type: "loading",
      });
      return;
    }

    savingRef.current = true;

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
        sha: shaRef.current,
        content,
        draft,
      });
    } else {
      result = await actions.blog.create({ content, draft });
    }

    savingRef.current = false;

    if (result.error) {
      setStatus({ message: `Error: ${result.error.message}`, type: "error" });
      return;
    }

    if (isEditing && result.data?.sha) {
      shaRef.current = result.data.sha;
      lastSavedContentRef.current = content;
    }

    setStatus({
      message: getSuccessMessage(draft, isEditing),
      type: "success",
    });
    setTimeout(() => {
      window.location.href = "/admin";
    }, 2000);
  };

  let defaultContent = DEFAULT_CONTENT;
  if (isEditing) {
    defaultContent = initialData.content;
  }

  let submitLabel = "Publish";
  if (isEditing) {
    submitLabel = "Update";
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e, false)}
      className="mt-8 space-y-4"
    >
      <div>
        <label className="block text-sm font-bold">Content (MDX)</label>
        <div className="mt-1">
          <MdxEditorField
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

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          className="rounded bg-fuchsia-700 px-4 py-2 font-bold text-white hover:bg-fuchsia-800 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-700"
        >
          {submitLabel}
        </Button>
        <Button
          type="button"
          onPress={(e) => {
            const form = (e.target as HTMLElement).closest("form");
            if (form && form.reportValidity()) {
              handleSubmit(
                {
                  preventDefault: () => {},
                  currentTarget: form,
                } as React.FormEvent<HTMLFormElement>,
                true,
              );
            }
          }}
          className="rounded border border-stone-300 bg-white px-4 py-2 font-bold text-stone-700 hover:bg-stone-100 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
        >
          Save as Draft
        </Button>
        {isEditing && autosaveStatus && (
          <span className="text-sm text-stone-500 dark:text-stone-400">
            {autosaveStatus}
          </span>
        )}
      </div>
    </form>
  );
}
