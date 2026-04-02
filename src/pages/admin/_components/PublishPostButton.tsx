import { actions } from "astro:actions";
import { Button } from "react-aria-components";

interface Props {
  slug: string;
}

export default function PublishPostButton({ slug }: Props) {
  const handlePublish = async () => {
    if (!confirm(`Publish "${slug}"? This will make it live after the site rebuilds.`))
      return;

    const { error } = await actions.blog.publish({ slug });
    if (error) {
      alert(`Error: ${error.message}`);
      return;
    }
    window.location.reload();
  };

  return (
    <Button
      onClick={handlePublish}
      className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
    >
      Publish
    </Button>
  );
}
