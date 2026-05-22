import Link from "next/link";
import SignIn from "../Login/login";
import ThemeToggle from "../theme/ThemeToggle";

type HeaderProps = {
  showSignIn?: boolean;
  userName?: string | null;
  fancy?: boolean;
};

export default function Header({
  showSignIn = true,
  userName,
  fancy = false,
}: HeaderProps) {
  return (
    <header
      className={
        fancy
          ? "fixed inset-x-0 top-0 z-50 border-b border-[var(--card-border)] bg-[var(--glass)]/90 backdrop-blur-2xl"
          : "fixed inset-x-0 top-0 z-50 border-b border-[var(--card-border)] bg-[var(--card)]/80 backdrop-blur-xl"
      }
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-sm font-bold text-white shadow-[0_4px_20px_var(--accent-glow)] transition-transform group-hover:scale-105">
            <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            H
          </span>
          <span className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
            Humanize Text
          </span>
        </Link>

        {fancy && (
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              How it works
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {userName ? (
            <span className="hidden text-sm text-[var(--muted)] sm:inline">
              {userName}
            </span>
          ) : showSignIn ? (
            <SignIn variant="header" label="Sign in" />
          ) : null}
        </div>
      </div>
    </header>
  );
}
