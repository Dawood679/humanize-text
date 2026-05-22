"use client";

import { useEffect, useState } from "react";

const samples = [
  {
    before:
      "The utilization of artificial intelligence facilitates the optimization of written content.",
    after:
      "AI helps you polish your writing so it reads naturally — like you wrote it yourself.",
  },
  {
    before:
      "It is imperative to acknowledge that the aforementioned methodology yields superior outcomes.",
    after:
      "Simply put, this approach works better and sounds way more human.",
  },
];

export default function HeroDemo() {
  const [index, setIndex] = useState(0);
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    const cycle = setInterval(() => {
      setShowAfter((prev) => {
        if (prev) {
          setIndex((i) => (i + 1) % samples.length);
          return false;
        }
        return true;
      });
    }, 4000);
    return () => clearInterval(cycle);
  }, []);

  const sample = samples[index];

  return (
    <div className="relative mx-auto mt-14 w-full max-w-2xl animate-fade-up-delay-3">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent-3)] opacity-20 blur-xl transition-opacity duration-500" />

      <div className="relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--glass)] p-1 shadow-[var(--shadow-soft)] backdrop-blur-2xl">
        <div className="flex items-center gap-2 border-b border-[var(--card-border)] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          <span className="ml-2 text-xs font-medium text-[var(--muted)]">
            humanize-preview
          </span>
        </div>

        <div className="grid gap-0 sm:grid-cols-2">
          <div className="border-b border-[var(--card-border)] p-5 sm:border-b-0 sm:border-r">
            <span className="mb-2 inline-block rounded-md bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
              AI input
            </span>
            <p
              className={`mt-2 text-sm leading-relaxed text-[var(--muted)] transition-opacity duration-500 ${showAfter ? "opacity-40" : "opacity-100"}`}
            >
              {sample.before}
            </p>
          </div>
          <div className="p-5">
            <span className="mb-2 inline-block rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              Humanized
            </span>
            <p
              className={`mt-2 text-sm leading-relaxed text-[var(--foreground)] transition-all duration-500 ${showAfter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
            >
              {sample.after}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--card-border)] bg-[var(--accent-soft)]/30 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs text-[var(--muted)]">Live preview</span>
          </div>
          <span className="text-xs font-medium text-[var(--accent)]">
            ~2s transform
          </span>
        </div>
      </div>
    </div>
  );
}
