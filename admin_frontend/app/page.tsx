export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center py-32 px-16">
        <div className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-5xl font-serif font-semibold tracking-tight text-foreground">
            Vibe Survey Admin
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted">
            System Admin Dashboard for managing campaigns, moderation, data control, compliance, and platform operations.
          </p>
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row mt-8">
            <a
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-white transition-colors hover:bg-primary-hover md:w-auto"
              href="/login"
            >
              Sign In
            </a>
            <a
              className="flex h-12 w-full items-center justify-center rounded-full border border-border px-6 transition-colors hover:bg-surface md:w-auto"
              href="/docs"
            >
              Documentation
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
