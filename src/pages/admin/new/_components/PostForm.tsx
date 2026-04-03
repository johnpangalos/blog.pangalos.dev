import { useState } from "react";
import { actions } from "astro:actions";
import {
  Button,
  TextField,
  Input,
  Label,
  TextArea,
} from "react-aria-components";
import MdxEditorField from "./MdxEditorField";

export interface PostFormData {
  slug: string;
  sha: string;
  title: string;
  author: string;
  date: string;
  description: string;
  tags: string;
  categories: string;
  content: string;
  draft: boolean;
}

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
    const tagsRaw = (formData.get("tags") as string) || "";
    const categoriesRaw = (formData.get("categories") as string) || "";

    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const categories = categoriesRaw
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const payload = {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      date: formData.get("date") as string,
      description: formData.get("description") as string,
      tags,
      categories,
      content: formData.get("content") as string,
      draft,
    };

    let result;
    if (isEditing) {
      result = await actions.blog.update({
        slug: initialData.slug,
        sha: initialData.sha,
        ...payload,
      });
    } else {
      result = await actions.blog.create(payload);
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

  const inputClasses =
    "mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-white";

  let titleClassName = inputClasses;
  if (isEditing) {
    titleClassName += " opacity-60";
  }

  const authorDefault = initialData?.author || "John Pangalos";
  const submitLabel = isEditing ? "Update" : "Publish";

  return (
      <form
        onSubmit={(e) => handleSubmit(e, false)}
        className="mt-8 space-y-4"
      >
        <TextField defaultValue={initialData?.title} isReadOnly={isEditing} isRequired>
          <Label className="block text-sm font-bold">Title</Label>
          <Input
            type="text"
            name="title"
            className={titleClassName}
            placeholder="the.post.title"
          />
        </TextField>

        <TextField defaultValue={authorDefault} isRequired>
          <Label className="block text-sm font-bold">Author</Label>
          <Input
            type="text"
            name="author"
            className={inputClasses}
          />
        </TextField>

        <TextField defaultValue={initialData?.date} isRequired>
          <Label className="block text-sm font-bold">Date</Label>
          <Input
            type="text"
            name="date"
            className={inputClasses}
            placeholder="March 20, 2026"
          />
        </TextField>

        <TextField defaultValue={initialData?.description} isRequired>
          <Label className="block text-sm font-bold">Description</Label>
          <TextArea
            name="description"
            rows={2}
            className={inputClasses}
            placeholder="A short description of the post..."
          />
        </TextField>

        <TextField defaultValue={initialData?.tags}>
          <Label className="block text-sm font-bold">
            Tags (comma-separated)
          </Label>
          <Input
            type="text"
            name="tags"
            className={inputClasses}
            placeholder="web, javascript, blogging"
          />
        </TextField>

        <TextField defaultValue={initialData?.categories}>
          <Label className="block text-sm font-bold">
            Categories (comma-separated)
          </Label>
          <Input
            type="text"
            name="categories"
            className={inputClasses}
            placeholder="web"
          />
        </TextField>

        <div>
          <label className="block text-sm font-bold">Content (MDX)</label>
          <div className="mt-1">
            <MdxEditorField
              name="content"
              defaultValue={initialData?.content}
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
        </div>
      </form>
  );
}
