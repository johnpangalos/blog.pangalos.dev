import { useState } from "react";
import { actions } from "astro:actions";
import {
  Button,
  Field,
  Input,
  Label,
  Textarea,
} from "@headlessui/react";

export default function NewPostForm() {
  const [status, setStatus] = useState<{
    message: string;
    type: "idle" | "loading" | "success" | "error";
  }>({ message: "", type: "idle" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus({ message: "Publishing...", type: "loading" });

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

    const { error } = await actions.blog.create({
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      date: formData.get("date") as string,
      description: formData.get("description") as string,
      tags,
      categories,
      content: formData.get("content") as string,
    });

    if (error) {
      setStatus({ message: `Error: ${error.message}`, type: "error" });
      return;
    }

    setStatus({
      message:
        "Post committed to repo! It will be live after the site rebuilds.",
      type: "success",
    });
    setTimeout(() => {
      window.location.href = "/admin";
    }, 2000);
  };

  const inputClasses =
    "mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-white";

  return (
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Field>
          <Label className="block text-sm font-bold">Title</Label>
          <Input
            type="text"
            name="title"
            required
            className={inputClasses}
            placeholder="the.post.title"
          />
        </Field>

        <Field>
          <Label className="block text-sm font-bold">Author</Label>
          <Input
            type="text"
            name="author"
            required
            defaultValue="John Pangalos"
            className={inputClasses}
          />
        </Field>

        <Field>
          <Label className="block text-sm font-bold">Date</Label>
          <Input
            type="text"
            name="date"
            required
            className={inputClasses}
            placeholder="March 20, 2026"
          />
        </Field>

        <Field>
          <Label className="block text-sm font-bold">Description</Label>
          <Textarea
            name="description"
            required
            rows={2}
            className={inputClasses}
            placeholder="A short description of the post..."
          />
        </Field>

        <Field>
          <Label className="block text-sm font-bold">
            Tags (comma-separated)
          </Label>
          <Input
            type="text"
            name="tags"
            className={inputClasses}
            placeholder="web, javascript, blogging"
          />
        </Field>

        <Field>
          <Label className="block text-sm font-bold">
            Categories (comma-separated)
          </Label>
          <Input
            type="text"
            name="categories"
            className={inputClasses}
            placeholder="web"
          />
        </Field>

        <Field>
          <Label className="block text-sm font-bold">Content (MDX)</Label>
          <Textarea
            name="content"
            required
            rows={16}
            className={`${inputClasses} font-mono text-sm`}
            placeholder="Write your blog post in MDX..."
          />
        </Field>

        {status.type !== "idle" && (
          <div
            className={`text-sm ${
              status.type === "error"
                ? "text-red-600 dark:text-red-400"
                : status.type === "success"
                  ? "text-green-600 dark:text-green-400"
                  : "text-stone-500"
            }`}
          >
            {status.message}
          </div>
        )}

        <Button
          type="submit"
          className="rounded bg-fuchsia-700 px-4 py-2 font-bold text-white hover:bg-fuchsia-800 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-700"
        >
          Publish
        </Button>
      </form>
  );
}
