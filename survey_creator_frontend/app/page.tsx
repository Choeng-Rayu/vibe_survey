export default function Home() {
  const features = [
    {
      title: "Build surveys that feel curated",
      description:
        "Shape each campaign with a calm editorial interface that keeps the focus on quality and clarity.",
      icon: "01",
      align: "left",
    },
    {
      title: "Target audiences without the noise",
      description:
        "Match campaigns to the right users with soft signal-based targeting and real-time audience estimates.",
      icon: "02",
      align: "right",
    },
    {
      title: "Track performance with restraint",
      description:
        "Read campaign health, responses, and conversion flow in a dashboard that stays calm under pressure.",
      icon: "03",
      align: "left",
    },
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "For early experiments and polished demos.",
      features: ["1 active campaign", "Basic analytics", "Email support"],
      highlight: false,
    },
    {
      name: "Pro",
      price: "$29",
      description: "For teams shipping premium survey funnels.",
      features: ["Unlimited campaigns", "Audience targeting", "Priority support"],
      highlight: true,
    },
    {
      name: "Team",
      price: "$79",
      description: "For multi-seat workflows and deeper collaboration.",
      features: ["Shared workspaces", "Approval flows", "Advanced reporting"],
      highlight: false,
    },
  ];

  const testimonials = [
    {
      quote:
        "The interface feels more like a luxury product than a survey tool. It makes the whole experience look deliberate.",
      author: "Sokha V.",
      role: "Growth Lead",
    },
    {
      quote:
        "We launched faster because the page already communicates trust. The design does half the selling.",
      author: "Mina T.",
      role: "Product Marketing",
    },
    {
      quote:
        "Everything from the hero to the pricing section feels quiet, premium, and easy to understand.",
      author: "Dara P.",
      role: "Founder",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_50%_10%,rgba(124,158,138,0.14),transparent_40%),radial-gradient(circle_at_25%_20%,rgba(196,149,106,0.12),transparent_28%)]" />
      <main className="relative mx-auto flex w-full max-w-7xl flex-col px-6 pb-24 pt-6 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between rounded-full border border-black/5 bg-[rgba(242,237,229,0.72)] px-5 py-3 backdrop-blur-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Soft Luxury Studio
            </p>
          </div>
          <div className="hidden items-center gap-8 text-sm text-[var(--muted)] md:flex">
            <a href="#features" className="transition-colors hover:text-[var(--text)]">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-[var(--text)]">
              Pricing
            </a>
            <a href="#testimonials" className="transition-colors hover:text-[var(--text)]">
              Stories
            </a>
          </div>
          <a
            href="#signup"
            className="rounded-full border border-[rgba(124,158,138,0.22)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] transition-colors hover:border-[var(--primary)] hover:bg-[rgba(124,158,138,0.1)]"
          >
            Request access
          </a>
        </header>

        <section className="mx-auto flex w-full max-w-4xl flex-col items-center pt-20 text-center sm:pt-28 lg:pt-32">
          <p className="mb-6 text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
            Premium SaaS landing page
          </p>
          <h1 className="max-w-4xl text-5xl font-medium leading-[0.95] text-[var(--text)] sm:text-6xl lg:text-7xl">
            Calm software for teams that want to feel expensive.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            A warm luxury interface for launching surveys, shaping campaigns, and presenting
            a product with quiet confidence.
          </p>

          <form
            id="signup"
            className="mt-10 flex w-full max-w-xl flex-col gap-3 rounded-[24px] border border-[var(--border)] bg-[rgba(242,237,229,0.85)] p-3 shadow-[0_12px_40px_rgba(28,28,26,0.04)] sm:flex-row"
          >
            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="h-14 flex-1 rounded-full border border-transparent bg-transparent px-5 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
            />
            <button
              type="submit"
              className="h-14 rounded-full bg-[var(--primary)] px-7 text-sm font-medium text-[#fbf8f4] transition-colors hover:bg-[var(--primary-h)]"
            >
              Start for free
            </button>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
            <span>Notion</span>
            <span>Figma</span>
            <span>Shopify</span>
            <span>Stripe</span>
            <span>Linear</span>
          </div>
        </section>

        <section className="mt-24 grid gap-4 rounded-[28px] border border-[var(--border)] bg-[rgba(242,237,229,0.8)] p-5 sm:grid-cols-5 sm:items-center sm:px-8 sm:py-7">
          {["Acme Labs", "Northstar", "Studio 21", "Mosaic", "Beryl Works"].map((logo) => (
            <div
              key={logo}
              className="text-center text-sm font-medium tracking-[0.24em] text-black/40 grayscale"
            >
              {logo}
            </div>
          ))}
        </section>

        <section id="features" className="mt-24 space-y-8 sm:mt-32">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={`grid items-center gap-8 rounded-[28px] border border-[var(--border)] bg-[rgba(242,237,229,0.72)] p-6 md:grid-cols-2 md:p-10 ${
                feature.align === "right" ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="space-y-5">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(124,158,138,0.18)] bg-[rgba(124,158,138,0.1)] text-sm font-medium text-[var(--primary)]">
                  {feature.icon}
                </div>
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                    Feature 0{index + 1}
                  </p>
                  <h2 className="text-3xl font-medium leading-tight sm:text-4xl">
                    {feature.title}
                  </h2>
                </div>
                <p className="max-w-xl text-base leading-8 text-[var(--muted)]">
                  {feature.description}
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[24px] border border-[rgba(124,158,138,0.16)] bg-[linear-gradient(180deg,rgba(250,247,242,0.9),rgba(242,237,229,0.95))] p-4">
                <div className="aspect-[4/3] rounded-[20px] border border-[rgba(124,158,138,0.12)] bg-[radial-gradient(circle_at_top,rgba(124,158,138,0.24),transparent_38%),radial-gradient(circle_at_70%_20%,rgba(196,149,106,0.18),transparent_24%),linear-gradient(180deg,rgba(250,247,242,0.92),rgba(242,237,229,0.98))] p-5">
                  <div className="flex h-full flex-col justify-between rounded-[18px] border border-black/5 bg-[rgba(250,247,242,0.64)] p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.26em] text-[var(--muted)]">
                      <span>Live preview</span>
                      <span className="rounded-full border border-[rgba(124,158,138,0.22)] px-3 py-1 text-[var(--primary)]">
                        Ready
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-[16px] bg-[rgba(124,158,138,0.12)] p-4 text-left">
                        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                          Match score
                        </p>
                        <p className="mt-3 text-3xl font-medium">93%</p>
                      </div>
                      <div className="rounded-[16px] bg-[rgba(196,149,106,0.12)] p-4 text-left">
                        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                          Conversion
                        </p>
                        <p className="mt-3 text-3xl font-medium">+18%</p>
                      </div>
                    </div>
                    <div className="rounded-[16px] border border-black/5 bg-white/40 p-4">
                      <div className="h-2 w-2/3 rounded-full bg-[var(--primary)]" />
                      <div className="mt-3 h-2 w-1/2 rounded-full bg-[rgba(28,28,26,0.1)]" />
                      <div className="mt-3 h-2 w-5/6 rounded-full bg-[rgba(28,28,26,0.08)]" />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section id="pricing" className="mt-24 sm:mt-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Pricing</p>
            <h2 className="mt-4 text-4xl font-medium sm:text-5xl">Simple plans with a calm hierarchy.</h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-[28px] border p-6 sm:p-7 ${
                  plan.highlight
                    ? "border-[rgba(124,158,138,0.35)] bg-[rgba(124,158,138,0.1)] shadow-[0_18px_50px_rgba(124,158,138,0.1)]"
                    : "border-[var(--border)] bg-[rgba(242,237,229,0.78)]"
                }`}
              >
                <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">{plan.name}</p>
                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-medium">{plan.price}</span>
                  <span className="pb-1 text-sm text-[var(--muted)]">/mo</span>
                </div>
                <p className="mt-4 text-base leading-7 text-[var(--muted)]">{plan.description}</p>
                <ul className="mt-6 space-y-3 text-sm text-[var(--text)]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#signup"
                  className={`mt-8 inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors ${
                    plan.highlight
                      ? "bg-[var(--primary)] text-[#fbf8f4] hover:bg-[var(--primary-h)]"
                      : "border border-[rgba(28,28,26,0.12)] bg-transparent text-[var(--text)] hover:border-[var(--primary)] hover:bg-[rgba(124,158,138,0.08)]"
                  }`}
                >
                  Choose {plan.name}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="testimonials" className="mt-24 sm:mt-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Testimonials</p>
            <h2 className="mt-4 text-4xl font-medium sm:text-5xl">Quiet confidence from the teams using it.</h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote
                key={item.author}
                className="rounded-[28px] border border-[var(--border)] bg-[rgba(242,237,229,0.8)] p-6 sm:p-7"
              >
                <p className="text-lg leading-8 text-[var(--text)]">“{item.quote}”</p>
                <footer className="mt-8 border-t border-[rgba(28,28,26,0.08)] pt-5">
                  <p className="font-medium text-[var(--text)]">{item.author}</p>
                  <p className="text-sm text-[var(--muted)]">{item.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="mt-24 sm:mt-32">
          <div className="rounded-[32px] border border-[rgba(124,158,138,0.22)] bg-[linear-gradient(135deg,rgba(124,158,138,0.14),rgba(242,237,229,0.98))] px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Footer CTA</p>
                <h2 className="mt-4 text-4xl font-medium sm:text-5xl">Start for free today.</h2>
                <p className="mt-4 max-w-xl text-base leading-8 text-[var(--muted)]">
                  Bring the softness of a premium product page to your launch, without losing clarity or conversion.
                </p>
              </div>

              <form className="flex flex-col gap-3 rounded-[24px] border border-[rgba(28,28,26,0.08)] bg-[rgba(250,247,242,0.7)] p-3 sm:flex-row">
                <label className="sr-only" htmlFor="footer-email">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Your email address"
                  className="h-14 flex-1 rounded-full border border-transparent bg-transparent px-5 text-sm outline-none placeholder:text-[var(--muted)]"
                />
                <button
                  type="submit"
                  className="h-14 rounded-full bg-[var(--primary)] px-7 text-sm font-medium text-[#fbf8f4] transition-colors hover:bg-[var(--primary-h)]"
                >
                  Get started
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
