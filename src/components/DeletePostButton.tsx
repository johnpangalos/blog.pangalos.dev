import { actions } from "astro:actions";
import { Button } from "@headlessui/react";

interface Props {
  slug: string;
}

export default function DeletePostButton({ slug }: Props) {
  const handleDelete = async () => {
    if (
      !confirm(
        `Delete "${slug}"? This will commit a deletion to the repo.`,
      )
    )
      return;

    const { error } = await actions.blog.delete({ slug });
    if (error) {
      alert(`Error: ${error.message}`);
      return;
    }
    window.location.reload();
  };

  return (
    <Button
      onClick={handleDelete}
      className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
    >
      Delete
    </Button>
  );
}
