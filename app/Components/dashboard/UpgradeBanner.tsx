"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function UpgradeBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<{
    type: "success" | "cancel";
    text: string;
  } | null>(null);

  useEffect(() => {
    const upgrade = searchParams.get("upgrade");
    if (upgrade === "success") {
      setMessage({
        type: "success",
        text: "Payment successful! Welcome to Pro — unlimited humanizing is now active.",
      });
      router.replace("/dashboard");
      router.refresh();
    } else if (upgrade === "cancelled") {
      setMessage({
        type: "cancel",
        text: "Checkout cancelled. You can upgrade anytime from the sidebar.",
      });
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  if (!message) return null;

  return (
    <div
      className={`mx-4 mt-4 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 md:mx-6 ${
        message.type === "success"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-[var(--card-border)] bg-[var(--card)] text-[var(--muted)]"
      }`}
    >
      <p className="text-sm">{message.text}</p>
      <button
        type="button"
        onClick={() => setMessage(null)}
        className="shrink-0 text-sm opacity-70 hover:opacity-100"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
