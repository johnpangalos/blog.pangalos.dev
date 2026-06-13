import {
  realmPlugin,
  createActiveEditorSubscription$,
  insertMarkdown$,
} from "@mdxeditor/editor";
import { COMMAND_PRIORITY_CRITICAL, PASTE_COMMAND } from "lexical";

const MARKDOWN_LINK = /\[[^\]\n]+\]\(\S+(?:\s+"[^"]*")?\)/;
const HTML_ANCHOR = /<a[\s>]/i;

/**
 * Decides whether a paste should go through the markdown importer instead of
 * the default plain/rich text paste. Lexical pastes plain text literally, so
 * markdown link syntax would be kept as text and escaped (`\[text]\(url)`)
 * when the document is serialized back to markdown.
 */
export function shouldImportPasteAsMarkdown(
  text: string,
  html: string,
): boolean {
  if (!MARKDOWN_LINK.test(text)) {
    return false;
  }
  // Clipboard already carries real anchors (e.g. copied from a web page);
  // the default rich text paste preserves those links correctly.
  if (HTML_ANCHOR.test(html)) {
    return false;
  }
  return true;
}

/**
 * Intercepts pastes that contain markdown link syntax and runs them through
 * MDXEditor's markdown importer, so `[text](url)` becomes a real link node.
 */
export const pasteMarkdownPlugin = realmPlugin({
  init(realm) {
    realm.pub(createActiveEditorSubscription$, (editor) => {
      return editor.registerCommand(
        PASTE_COMMAND,
        (event) => {
          if (!(event instanceof ClipboardEvent)) {
            return false;
          }
          const clipboardData = event.clipboardData;
          if (clipboardData === null) {
            return false;
          }
          const text = clipboardData.getData("text/plain");
          const html = clipboardData.getData("text/html");
          if (!shouldImportPasteAsMarkdown(text, html)) {
            return false;
          }
          event.preventDefault();
          realm.pub(insertMarkdown$, text);
          return true;
        },
        COMMAND_PRIORITY_CRITICAL,
      );
    });
  },
});
