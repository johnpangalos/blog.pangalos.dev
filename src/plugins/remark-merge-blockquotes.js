/**
 * Remark plugin that merges consecutive blockquotes into a single blockquote.
 *
 * MDX Editor's quotePlugin doesn't support multi-paragraph blockquotes and
 * serializes them as separate `>` blocks with a blank line in between.
 * This plugin merges those back into one blockquote at render time.
 */
export default function remarkMergeBlockquotes() {
  return (tree) => {
    const children = tree.children;
    if (!children) return;

    let i = 0;
    while (i < children.length - 1) {
      const current = children[i];
      const next = children[i + 1];

      if (current.type === "blockquote" && next.type === "blockquote") {
        current.children = current.children.concat(next.children);
        children.splice(i + 1, 1);
      } else {
        i++;
      }
    }
  };
}
