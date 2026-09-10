import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { FlockMark } from "@/components/app-chrome";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <FlockMark />
      <p className="mt-4 text-xs font-medium tracking-widest text-subtle uppercase">The lodge</p>
      <h1 className="mt-2 font-display text-3xl text-fg">Sign in to post</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Cut a handle, pin your marsh, and tell the flyway what you saw. Google or X — same desk
        either way.
      </p>
      {authEnabled ? (
        <div className="mt-6 flex flex-col gap-2">
          {GROK_PROVIDERS.map((p) => (
            <button
              key={p.providerId}
              type="button"
              onClick={() => signIn(p.providerId, { callbackURL: "/community" })}
              className="flex h-11 items-center justify-center rounded-md bg-sage px-4 text-sm font-medium text-sage-fg hover:bg-sage/90"
            >
              Continue with {p.label}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>
      )}
      <Link to="/" className="mt-6 text-sm text-sage hover:underline">
        Back to the brief
      </Link>
    </main>
  );
}
