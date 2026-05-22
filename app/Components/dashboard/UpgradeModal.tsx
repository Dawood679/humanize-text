"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/app/actions/stripe";

type UpgradeModalProps = {
  open: boolean;
  onClose: () => void;
  reason?: "tries" | "words";
};

export default function UpgradeModal({
  open,
  onClose,
  reason = "tries",
}: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const title =
    reason === "tries"
      ? "You've used all 5 free tries"
      : "Text exceeds your word limit";

  const description =
    reason === "tries"
      ? "Upgrade to Pro for unlimited humanizations, up to 10,000 words per request, and priority processing."
      : "Free accounts are limited to 1,000 words. Upgrade to Pro to humanize up to 10,000 words at once.";

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await createCheckoutSession();
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[0_24px_80px_var(--accent-glow)]">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
            />
          </svg>
        </div>

        <h2
          id="upgrade-title"
          className="text-xl font-bold text-[var(--foreground)]"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {description}
        </p>

        <div className="mt-4 rounded-xl border border-[var(--card-border)] bg-[var(--accent-soft)]/30 px-4 py-3">
          <p className="text-lg font-bold text-[var(--foreground)]">
            Pro — $20
            <span className="text-sm font-normal text-[var(--muted)]">/month</span>
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Secure payment via Stripe. Cancel anytime.
          </p>
        </div>

        <ul className="mt-4 space-y-2 text-sm text-[var(--foreground)]">
          <li className="flex items-center gap-2">
            <span className="text-[var(--accent)]">✓</span>
            Unlimited humanize tries
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[var(--accent)]">✓</span>
            Up to 10,000 words per request
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[var(--accent)]">✓</span>
            Full chat history
          </li>
        </ul>

        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={loading}
            className="btn-shine flex-1 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_var(--accent-glow)] transition-transform hover:scale-[1.02] disabled:opacity-60"
            onClick={handleUpgrade}
          >
            {loading ? "Redirecting…" : "Pay $20/month with Stripe"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-[var(--card-border)] px-4 py-3 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)] disabled:opacity-60"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
