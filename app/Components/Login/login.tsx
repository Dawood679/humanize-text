import { signInWithGoogle } from "@/app/actions/auth";

type SignInProps = {
  variant?: "primary" | "secondary" | "header";
  size?: "default" | "large";
  label?: string;
};

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function SignIn({
  variant = "primary",
  size = "default",
  label = "Continue with Google",
}: SignInProps) {
  const isPrimary = variant === "primary";
  const isHeader = variant === "header";
  const isLarge = size === "large";

  return (
    <form action={signInWithGoogle}>
      <button
        type="submit"
        className={
          isHeader
            ? "btn-shine rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-4 py-2 text-sm font-medium text-white shadow-[0_4px_20px_var(--accent-glow)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            : isPrimary
              ? `btn-shine inline-flex items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--glass)] font-medium text-[var(--foreground)] shadow-[var(--shadow-soft)] backdrop-blur-md transition-all hover:scale-[1.03] hover:border-[var(--accent)] hover:shadow-[0_8px_40px_var(--accent-glow)] active:scale-[0.98] ${isLarge ? "px-10 py-4 text-base" : "px-8 py-3.5 text-sm"}`
              : `btn-shine inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] font-medium text-white shadow-[0_4px_24px_var(--accent-glow)] transition-all hover:scale-[1.03] hover:shadow-[0_8px_40px_var(--accent-glow)] active:scale-[0.98] ${isLarge ? "px-10 py-4 text-base" : "px-8 py-3.5 text-sm"}`
        }
      >
        {!isHeader && <GoogleIcon />}
        {label}
      </button>
    </form>
  );
}
