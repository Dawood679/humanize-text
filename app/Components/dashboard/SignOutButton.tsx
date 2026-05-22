import { signOutAction } from "@/app/actions/auth";

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:border-red-300 hover:text-red-500 dark:hover:border-red-800"
      >
        Sign out
      </button>
    </form>
  );
}
