import { actions } from "astro:actions";
import { Button } from "react-aria-components";

interface Props {
  slug: string;
}

export default function DeletePostButton({ slug }: Props) {
  const handleDelete = async () => {
    if (!confirm(`Delete "${slug}"? This will commit a deletion to the repo.`))
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
      className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
    >
      Delete
    </Button>
  );
}
