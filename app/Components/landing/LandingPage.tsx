import Header from "../layout/Header";
import HeroDemo from "./HeroDemo";
import LandingBackground from "./LandingBackground";

const features = [
  {
    title: "Natural flow",
    description:
      "Transform stiff AI drafts into warm, readable copy that sounds like you wrote it yourself.",
    gradient: "from-indigo-500/20 to-violet-500/20",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a2.25 2.25 0 0 1 1.816-3.064 48.12 48.12 0 0 0 5.232-2.01"
      />
    ),
  },
  {
    title: "Detector-friendly",
    description:
      "Refine tone and rhythm so your text passes common AI checks without losing your message.",
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      />
    ),
  },
  {
    title: "Fast & simple",
    description:
      "Paste your text, pick a style, and get humanized output in seconds — no complex setup.",
    gradient: "from-fuchsia-500/20 to-pink-500/20",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
      />
    ),
  },
];

const steps = [
  { num: "01", title: "Paste AI text", desc: "Drop in any ChatGPT or AI-generated draft." },
  { num: "02", title: "Pick your tone", desc: "Casual, academic, professional — your call." },
  { num: "03", title: "Get human copy", desc: "Download natural text in seconds." },
];

const marqueeItems = [
  "Essays",
  "Blog posts",
  "Emails",
  "Cover letters",
  "Reports",
  "Social captions",
  "Research papers",
  "Product copy",
];

const stats = [
  { value: "2s", label: "Avg. transform" },
  { value: "98%", label: "Readability boost" },
  { value: "∞", label: "Styles & tones" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <LandingBackground />
      <Header showSignIn fancy />

      <main className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        {/* Hero */}
        <section className="flex flex-col items-center text-center">
          <span className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--glass)] px-4 py-2 text-sm text-[var(--muted)] shadow-[var(--shadow-soft)] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            AI text → human-ready copy
          </span>

          <h1 className="animate-fade-up-delay-1 max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight text-[var(--foreground)] sm:text-5xl md:text-7xl">
            Make every word{" "}
            <span className="gradient-text-animated">sound human</span>
          </h1>

          <p className="animate-fade-up-delay-2 mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)] md:text-xl">
            Humanize Text turns robotic AI output into natural, engaging writing —
            perfect for essays, blogs, emails, and anything that needs a real voice.
          </p>

          <HeroDemo />
        </section>

        {/* Stats */}
        <section className="mt-20 grid grid-cols-3 gap-4 sm:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-[var(--card-border)] bg-[var(--glass)] px-4 py-6 text-center backdrop-blur-md transition-all hover:border-[var(--accent)] hover:shadow-[0_0_30px_var(--accent-glow)] sm:px-6"
            >
              <p className="text-3xl font-bold gradient-text-animated sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Marquee */}
        <div className="relative mt-16 overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--glass)] py-4 backdrop-blur-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--background)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--background)] to-transparent" />
          <div className="flex w-max animate-marquee gap-8">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex shrink-0 items-center gap-8 text-sm font-medium text-[var(--muted)]"
              >
                <span className="text-[var(--accent)]">✦</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <section id="features" className="mt-28 scroll-mt-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-[var(--foreground)]">
              Why Humanize Text?
            </h2>
            <p className="mt-3 text-[var(--muted)]">
              Everything you need to sound authentic, not artificial.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className={`card-shine group rounded-2xl border border-[var(--card-border)] bg-[var(--glass)] p-6 shadow-[var(--shadow-soft)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_var(--accent-glow)]`}
              >
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-[var(--accent)] ring-1 ring-[var(--card-border)] transition-all duration-300 group-hover:scale-110 group-hover:text-white group-hover:ring-[var(--accent)]`}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[var(--card)]/80 transition-colors group-hover:bg-[var(--accent)]">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      {feature.icon}
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mt-28 scroll-mt-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-[var(--foreground)]">
              How it works
            </h2>
            <p className="mt-3 text-[var(--muted)]">Three steps. Zero hassle.</p>
          </div>

          <div className="relative grid gap-6 md:grid-cols-3">
            <div className="pointer-events-none absolute top-1/2 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30 md:block" />

            {steps.map((step) => (
              <div
                key={step.num}
                className="relative rounded-2xl border border-[var(--card-border)] bg-[var(--glass)] p-8 text-center backdrop-blur-md transition-all hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow)]"
              >
                <span className="text-5xl font-black gradient-text-animated opacity-80">
                  {step.num}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative mt-28 overflow-hidden rounded-3xl border border-[var(--card-border)] p-10 text-center shadow-[var(--shadow-soft)] md:p-14">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-[var(--accent-3)]/10" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-20 blur-[80px]" />

          <div className="relative">
            <h2 className="text-3xl font-bold text-[var(--foreground)] md:text-4xl">
              Ready to humanize your text?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[var(--muted)]">
              Sign in from the header to start transforming AI-generated content in
              your dashboard — it takes less than 10 seconds.
            </p>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-[var(--card-border)] bg-[var(--glass)] py-10 text-center backdrop-blur-md">
        <p className="text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} Humanize Text · Crafted for writers who
          want to sound real
        </p>
      </footer>
    </div>
  );
}
