"use client";

import ReactMarkdown from "react-markdown";
import { cleanModelOutput } from "@/app/utlis/formatOutput";

type FormattedOutputProps = {
  content: string;
  loading?: boolean;
};

export default function FormattedOutput({
  content,
  loading = false,
}: FormattedOutputProps) {
  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-8">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]" />
        <p className="text-sm text-[var(--muted)]">Humanizing your text…</p>
      </div>
    );
  }

  const cleaned = cleanModelOutput(content);

  if (!cleaned) {
    return (
      <p className="px-4 py-3 text-sm text-[var(--muted)]">
        Humanized text will appear here…
      </p>
    );
  }

  return (
    <div className="humanize-output soft-scrollbar flex-1 overflow-y-auto px-4 py-3">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-1 text-xl font-bold text-[var(--foreground)]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-4 text-lg font-bold text-[var(--foreground)]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-base font-semibold text-[var(--foreground)]">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-2 mt-3 text-sm font-semibold text-[var(--foreground)]">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-sm leading-relaxed text-[var(--foreground)]">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-[var(--foreground)]">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[var(--muted)]">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 ml-4 list-disc space-y-1.5 text-sm text-[var(--foreground)]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 ml-4 list-decimal space-y-1.5 text-sm text-[var(--foreground)]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          hr: () => (
            <hr className="my-4 border-[var(--card-border)]" />
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-[var(--accent)] pl-4 text-sm italic text-[var(--muted)]">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-[var(--accent-soft)] px-1.5 py-0.5 text-xs text-[var(--accent)]">
              {children}
            </code>
          ),
        }}
      >
        {cleaned}
      </ReactMarkdown>
    </div>
  );
}
