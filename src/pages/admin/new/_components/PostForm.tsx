import { useState } from "react";
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

    setStatus({
      message: getSuccessMessage(draft, isEditing),
      type: "success",
    });
    setTimeout(() => {
      window.location.href = "/admin";
    }, 2000);
  };

  let defaultContent = DEFAULT_CONTENT;
  if (isEditing) defaultContent = initialData.content;
  let submitLabel = "Publish";
  if (isEditing) submitLabel = "Update";
  const submitDraft = isEditing && isDraftContent(initialData.content);

  return (
      <form
        onSubmit={(e) => handleSubmit(e, submitDraft)}
        className="mt-8 space-y-4"
      >
        <div>
          <label className="block text-sm font-bold">Content (MDX)</label>
          <div className="mt-1">
            <MdxEditorField
              name="content"
              defaultValue={defaultContent}
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
