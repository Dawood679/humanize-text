"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/app/actions/stripe";

type UpgradeButtonProps = {
  onError?: (message: string) => void;
  className?: string;
};

export default function UpgradeButton({
  onError,
  className = "",
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await createCheckoutSession();
      if (result.error) {
        onError?.(result.error);
        return;
      }
      if (result.url) window.location.href = result.url;
    } catch {
      onError?.("Failed to start checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={
        className ||
        "btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_var(--accent-glow)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
      }
    >
      <svg
        className="h-4 w-4"
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
      {loading ? "Loading…" : "Upgrade — $20/mo"}
    </button>
  );
}
