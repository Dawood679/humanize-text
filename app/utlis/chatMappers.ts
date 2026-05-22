import { cleanModelOutput } from "./formatOutput";

export type ChatItem = {
  id: string;
  title: string;
  preview: string;
  input: string;
  output: string;
  updatedAt: number;
};

function titleFromText(text: string) {
  const line = text.trim().split("\n")[0] ?? "Untitled";
  return line.length > 42 ? `${line.slice(0, 42)}…` : line || "Untitled";
}

export function mapTextsToChats(
  texts: { id: string; input: string; output: string; updatedAt: Date }[]
): ChatItem[] {
  return texts.map((t) => {
    const cleaned = cleanModelOutput(t.output);
    return {
      id: t.id,
      title: titleFromText(t.input),
      preview:
        cleaned.slice(0, 80) + (cleaned.length > 80 ? "…" : "") || "Empty",
      input: t.input,
      output: t.output,
      updatedAt: new Date(t.updatedAt).getTime(),
    };
  });
}
