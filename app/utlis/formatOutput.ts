/**
 * Strips common AI preambles and keeps the main humanized content
 * (headings, lists, bold, etc.) for markdown rendering.
 */
export function cleanModelOutput(raw: string): string {
  if (!raw?.trim()) return "";

  let text = raw.trim();

  const preambleRegex =
    /here(?:'s| is) the (?:rewritten|humanized|revised) version:\s*/i;
  const match = text.match(preambleRegex);

  if (match?.index !== undefined) {
    text = text.slice(match.index + match[0].length);
  }

  text = text.replace(/^\*{3}\s*\n?/, "").trim();

  const headingStart = text.search(/^#{1,6}\s+/m);
  if (headingStart > 0) {
    const prefix = text.slice(0, headingStart).trim();
    if (prefix.length > 0 && prefix.length < 500) {
      text = text.slice(headingStart);
    }
  }

  return text.trim();
}
