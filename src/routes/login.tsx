import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  return (
    <main className="grid min-h-svh place-items-center bg-canvas px-4 py-10">
      <section className="w-full max-w-md rounded-3xl bg-paper p-7 shadow-border sm:p-9">
        <Link to="/" className="flex items-center gap-3">
          <img src="/scnhs-logo.png?v=20260929" alt="SCNHS seal" className="size-12 rounded-lg object-contain" />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Sta Catalina National High School</span>
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-sky-dark">Office access</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Sign in to your school account</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Use the same authorized office account on each gate device to keep attendance and parent contacts in sync.
        </p>
        <div className="mt-6 grid gap-3">
          {authEnabled ? GROK_PROVIDERS.map((provider) => (
            <button
              key={provider.providerId}
              type="button"
              onClick={() => void signIn(provider.providerId, { callbackURL: "/" })}
              className="min-h-12 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg transition-colors hover:bg-primary-dark"
            >
              Continue with {provider.label}
            </button>
          )) : <p className="rounded-xl bg-canvas p-4 text-sm text-muted">Sign-in is not enabled for this build.</p>}
        </div>
        <p className="mt-6 text-xs leading-5 text-muted">
          Only the school’s authorized office account should be used here. Parent alerts are sent to each student’s linked contacts.
        </p>
      </section>
    </main>
  );
}
