"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import ThemeToggle from "../theme/ThemeToggle";
import SignOutButton from "./SignOutButton";
import FormattedOutput from "./FormattedOutput";
import UpgradeModal from "./UpgradeModal";
import UpgradeButton from "./UpgradeButton";
import UpgradeBanner from "./UpgradeBanner";
import getUserRecentText from "@/app/utlis/getUserRecentText";
import { cleanModelOutput } from "@/app/utlis/formatOutput";
import { countWords } from "@/app/utlis/countWords";
import type { ChatItem } from "@/app/utlis/chatMappers";
import type { UserUsage } from "@/app/utlis/getUserUsage";
import { getMaxTries, getMaxWords } from "@/app/utlis/planLimits";

type DashboardShellProps = {
  userName?: string | null;
  userId: string;
  initialChats: ChatItem[];
  initialUsage: UserUsage;
};

function formatTime(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(ts).toLocaleDateString();
}

export default function DashboardShell({
  userName,
  userId,
  initialChats,
  initialUsage,
}: DashboardShellProps) {
  const workspaceRef = useRef<HTMLElement>(null);

  const [chats, setChats] = useState<ChatItem[]>(initialChats);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<UserUsage>(initialUsage);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<"tries" | "words">("tries");
  const [lastHumanizedInput, setLastHumanizedInput] = useState<string | null>(
    null
  );

  const wordCount = countWords(input);
  const overWordLimit = wordCount > usage.maxWords;
  const triesBlocked = !usage.canTry;

  const fetchChats = useCallback(async (): Promise<ChatItem[]> => {
    if (!userId) return [];
    setChatsLoading(true);
    try {
      const mapped = await getUserRecentText(userId);
      setChats(mapped);
      return mapped;
    } catch (error) {
      console.error("Failed to load chats:", error);
      return [];
    } finally {
      setChatsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const loadChat = (chat: ChatItem) => {
    setActiveChatId(chat.id);
    setInput(chat.input);
    setOutput(chat.output);
    setLoading(false);
    setLastHumanizedInput(
      chat.output.trim() ? chat.input.trim() : null
    );
    workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNewHumanize = () => {
    setActiveChatId(null);
    setInput("");
    setOutput("");
    setLoading(false);
    setLastHumanizedInput(null);
  };

  const openUpgrade = (reason: "tries" | "words") => {
    setUpgradeReason(reason);
    setUpgradeOpen(true);
  };

  const handleHumanize = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    if (triesBlocked) {
      openUpgrade("tries");
      return;
    }

    if (overWordLimit) {
      openUpgrade("words");
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.code === "TRY_LIMIT") {
          setUsage((u) => ({
            ...u,
            canTry: false,
            triesUsed: data.triesUsed ?? u.triesUsed,
            triesRemaining: 0,
          }));
          openUpgrade("tries");
          return;
        }
        if (data.code === "WORD_LIMIT") {
          openUpgrade("words");
          return;
        }
        throw new Error(data.error ?? "Request failed");
      }

      const generatedOutputText = (data.output as string) ?? "";
      setOutput(generatedOutputText);
      setLastHumanizedInput(trimmed);

      if (data.usage) {
        const triesUsed = data.usage.triesUsed as number;
        const plan = data.usage.plan as UserUsage["plan"];
        const maxTries = getMaxTries(plan);
        const maxWords = getMaxWords(plan);
        setUsage({
          plan,
          triesUsed,
          maxTries,
          maxWords,
          canTry: maxTries === null || triesUsed < maxTries,
          triesRemaining:
            maxTries === null ? null : Math.max(0, maxTries - triesUsed),
        });
      }

      await fetchChats();
      const refreshed = await getUserRecentText(userId);
      const match = refreshed.find(
        (c) => c.input === trimmed && c.output === generatedOutputText
      );
      if (match) {
        setActiveChatId(match.id);
      } else if (refreshed[0]) {
        setActiveChatId(refreshed[0].id);
      }
    } catch (error) {
      console.error(error);
      setOutput("Something went wrong. Please try again.");
      setLastHumanizedInput(null);
    } finally {
      setLoading(false);
    }
  };

  const displayOutput = cleanModelOutput(output);
  const isErrorOutput = output.startsWith("Something went wrong");
  const alreadyHumanized =
    !!lastHumanizedInput &&
    input.trim() === lastHumanizedInput &&
    !!output.trim() &&
    !isErrorOutput &&
    !loading;

  const humanizeDisabled =
    !input.trim() ||
    loading ||
    triesBlocked ||
    overWordLimit ||
    alreadyHumanized;

  return (
    <div className="flex h-screen flex-col bg-[var(--background)]">
      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        reason={upgradeReason}
      />

      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--card-border)] bg-[var(--glass)] px-4 backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <span className="hidden text-sm font-semibold text-[var(--foreground)] sm:inline">
            Humanize Text
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {usage.plan === "FREE" && usage.triesRemaining !== null && (
            <span className="hidden text-xs text-[var(--muted)] md:inline">
              {usage.triesRemaining} / {usage.maxTries} tries
            </span>
          )}
          <span
            className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
              usage.plan === "PAID"
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "bg-[var(--card)] text-[var(--muted)] ring-1 ring-[var(--card-border)]"
            }`}
          >
            {usage.plan === "PAID" ? "Pro" : "Free"}
          </span>
          {userName && (
            <span className="hidden max-w-[120px] truncate text-sm text-[var(--muted)] lg:inline xl:max-w-[180px]">
              {userName}
            </span>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--card-border)] bg-[var(--card)]/50 md:w-72">
          <div className="p-4">
            <button
              type="button"
              onClick={handleNewHumanize}
              className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_var(--accent-glow)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              New Humanize
            </button>
          </div>

          <div className="flex items-center justify-between px-4 pb-2">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
              Recent chats
            </p>
            {chats.length > 0 && (
              <span className="text-[10px] text-[var(--muted)]">
                {chats.length}
              </span>
            )}
          </div>

          <div className="soft-scrollbar flex-1 overflow-y-auto px-2 pb-2">
            {chatsLoading && chats.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-[var(--muted)]">
                Loading chats…
              </p>
            ) : chats.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-[var(--muted)]">
                No chats yet. Paste AI text and hit Humanize Text.
              </p>
            ) : (
              <ul className="space-y-1">
                {chats.map((chat) => (
                  <li key={chat.id}>
                    <button
                      type="button"
                      onClick={() => loadChat(chat)}
                      className={`w-full rounded-xl px-3 py-2.5 text-left transition-all ${
                        activeChatId === chat.id
                          ? "bg-[var(--accent-soft)] ring-1 ring-[var(--accent)]/30"
                          : "hover:bg-[var(--accent-soft)]/50"
                      }`}
                    >
                      <p className="truncate text-sm font-medium text-[var(--foreground)]">
                        {chat.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                        {chat.preview || "Empty"}
                      </p>
                      <p className="mt-1 text-[10px] text-[var(--muted)] opacity-70">
                        {formatTime(chat.updatedAt)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2 border-t border-[var(--card-border)] p-4">
            {usage.plan === "FREE" && (
              <UpgradeButton onError={(msg) => alert(msg)} />
            )}
            <SignOutButton />
          </div>
        </aside>

        <main
          ref={workspaceRef}
          className="flex min-w-0 flex-1 flex-col overflow-hidden"
        >
          <Suspense fallback={null}>
            <UpgradeBanner />
          </Suspense>
          <div className="border-b border-[var(--card-border)] px-6 py-4">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              {activeChatId
                ? chats.find((c) => c.id === activeChatId)?.title ?? "Humanize"
                : "New humanize"}
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Paste AI-generated text on the left — get natural copy on the right.
            </p>
          </div>

          {triesBlocked && (
            <div className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 md:mx-6">
              <p className="text-sm text-amber-200/90">
                Free limit reached — upgrade to keep humanizing.
              </p>
              <button
                type="button"
                onClick={() => openUpgrade("tries")}
                className="shrink-0 rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-3 py-1.5 text-xs font-semibold text-white"
              >
                Upgrade
              </button>
            </div>
          )}

          <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 md:p-6">
            <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-2">
              <div className="flex min-h-[280px] flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--glass)] shadow-[var(--shadow-soft)] backdrop-blur-md md:min-h-[360px]">
                <div className="flex items-center justify-between border-b border-[var(--card-border)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    Input
                  </span>
                  <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-400">
                    AI text
                  </span>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your AI-generated text here…"
                  className="soft-scrollbar min-h-0 flex-1 resize-none overflow-y-auto bg-transparent px-4 py-3 text-sm leading-relaxed text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
                />
                <div
                  className={`border-t border-[var(--card-border)] px-4 py-2 text-xs ${
                    overWordLimit ? "text-red-400" : "text-[var(--muted)]"
                  }`}
                >
                  {wordCount.toLocaleString()} / {usage.maxWords.toLocaleString()}{" "}
                  words
                  {overWordLimit && " — limit exceeded"}
                </div>
              </div>

              <div className="flex min-h-[280px] flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--glass)] shadow-[var(--shadow-soft)] backdrop-blur-md md:min-h-[360px]">
                <div className="flex items-center justify-between border-b border-[var(--card-border)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    Output
                  </span>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                    Humanized
                  </span>
                </div>
                <FormattedOutput content={output} loading={loading} />
                <div className="border-t border-[var(--card-border)] px-4 py-2 text-xs text-[var(--muted)]">
                  {displayOutput.length} characters
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 pb-2">
              <button
                type="button"
                onClick={handleHumanize}
                disabled={humanizeDisabled}
                className="btn-shine inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-10 py-3.5 text-base font-semibold text-white shadow-[0_4px_24px_var(--accent-glow)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Humanizing…
                  </>
                ) : triesBlocked ? (
                  "Upgrade to continue"
                ) : alreadyHumanized ? (
                  "Already humanized"
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
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
                    Humanize Text
                  </>
                )}
              </button>
              {alreadyHumanized && (
                <p className="text-xs text-[var(--muted)]">
                  Use <strong className="text-[var(--foreground)]">New Humanize</strong>{" "}
                  for another text, or edit input to humanize again.
                </p>
              )}
              {overWordLimit && !triesBlocked && !alreadyHumanized && (
                <button
                  type="button"
                  onClick={() => openUpgrade("words")}
                  className="text-xs text-[var(--accent)] hover:underline"
                >
                  Upgrade for more words
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
