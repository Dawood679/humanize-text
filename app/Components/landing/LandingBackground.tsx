export default function LandingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, var(--gradient-from) 0%, var(--gradient-via) 45%, var(--gradient-to) 100%)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 70%)",
        }}
      />

      <div
        className="animate-float absolute -left-20 top-32 h-[28rem] w-[28rem] rounded-full blur-[100px]"
        style={{ background: "var(--hero-blob-1)" }}
      />
      <div
        className="animate-float-delay absolute -right-16 top-48 h-80 w-80 rounded-full blur-[90px]"
        style={{ background: "var(--hero-blob-2)" }}
      />
      <div
        className="animate-float-slow absolute left-1/2 top-[55%] h-72 w-72 -translate-x-1/2 rounded-full blur-[80px]"
        style={{ background: "var(--hero-blob-3)" }}
      />

      <div className="absolute left-1/2 top-[38%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2">
        <div
          className="animate-spin-slow absolute inset-0 rounded-full border border-[var(--card-border)] opacity-30"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, var(--accent-glow), transparent, var(--accent-glow), transparent)",
          }}
        />
        <div className="absolute inset-8 rounded-full border border-dashed border-[var(--card-border)] opacity-20" />
      </div>

      <div className="absolute left-[12%] top-[22%] h-2 w-2 rounded-full bg-[var(--accent)] opacity-60 animate-pulse" />
      <div className="absolute right-[18%] top-[30%] h-1.5 w-1.5 rounded-full bg-[var(--accent-2)] opacity-50" />
      <div className="absolute left-[28%] bottom-[35%] h-1 w-1 rounded-full bg-[var(--accent-3)] opacity-40" />
      <div className="absolute right-[32%] top-[18%] h-2 w-2 rounded-full bg-[var(--accent-3)] opacity-30 animate-pulse" />
    </div>
  );
}
