"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { ArrowRight, Github, Loader2, Radar } from "lucide-react";

import { api, getToken, oauthStartUrl, setToken, type OAuthProviderStatus } from "@/lib/api";

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("demo@orbit.local");
  const [password, setPassword] = useState("orbit-demo-password");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [oauthProviders, setOauthProviders] = useState<OAuthProviderStatus[]>([
    { provider: "google", enabled: false, label: "Google" },
    { provider: "github", enabled: false, label: "GitHub" },
  ]);

  useEffect(() => {
    if (getToken()) router.replace("/dashboard");
  }, [router]);

  useEffect(() => {
    api.oauthProviders()
      .then((response) => setOauthProviders(response.providers))
      .catch(() => {
        setOauthProviders([
          { provider: "google", enabled: false, label: "Google" },
          { provider: "github", enabled: false, label: "GitHub" },
        ]);
      });
  }, []);

  const completeLogin = (token: string): void => {
    setToken(token);
    router.replace("/dashboard");
  };

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const session = await api.login(email, password);
      completeLogin(session.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in. Check your backend and credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const useDemoWorkspace = async (): Promise<void> => {
    setDemoLoading(true);
    setError("");

    try {
      const session = await api.demo();
      completeLogin(session.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo workspace is not available yet.");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <main className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-[#07100f] p-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(59,130,246,0.24),transparent_24%),radial-gradient(circle_at_86%_78%,rgba(167,255,47,0.18),transparent_26%),linear-gradient(180deg,#081211,#020403)]" />
      <div className="absolute left-8 top-10 h-24 w-24 rounded-full border-[12px] border-[#f8d25c] bg-[#b98120] opacity-80 shadow-[0_20px_70px_rgba(248,210,92,0.22)]" />
      <div className="absolute bottom-16 right-10 hidden rotate-[-18deg] rounded-[10px] bg-[#a7ff2f] px-9 py-5 text-[10px] font-black uppercase text-black shadow-[0_18px_55px_rgba(167,255,47,0.25)] sm:block">
        jwt session
      </div>

      <section className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[24px] border border-white/10 bg-black/55 shadow-[0_24px_110px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:grid-cols-[1fr_440px]">
        <div className="hidden min-h-[620px] flex-col justify-between p-8 lg:flex">
          <Link href="/" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[-0.04em]">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-black">
              <Radar className="h-4 w-4" />
            </span>
            Orbit
          </Link>

          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.34em] text-white/45">Admin gateway</p>
            <h1 className="max-w-lg text-[clamp(3.8rem,8vw,6.8rem)] font-black uppercase leading-[0.78] tracking-[-0.09em] text-[#f4f4f1]">
              Enter
              <span className="block">Mission</span>
              <span className="block">Control</span>
            </h1>
          </div>

          <p className="max-w-sm text-sm leading-6 text-white/55">
            Use your Orbit Core account, or launch the seeded demo workspace to explore issues,
            traces, logs, infrastructure, and uptime without setup friction.
          </p>
        </div>

        <div className="border-l border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="mb-6 flex items-center gap-2 text-[11px] font-black uppercase tracking-[-0.04em]">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-black">
                <Radar className="h-4 w-4" />
              </span>
              Orbit
            </Link>
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">Secure login</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">Sessions persist for seven days using Orbit JWT auth.</p>

          <form className="mt-8 space-y-4" onSubmit={submit}>
            <label className="block text-xs font-black uppercase tracking-[0.18em] text-white/55">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-[14px] border border-white/10 bg-black/35 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-black/50"
                placeholder="you@company.com"
              />
            </label>

            <label className="block text-xs font-black uppercase tracking-[0.18em] text-white/55">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-[14px] border border-white/10 bg-black/35 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-black/50"
                placeholder="Your admin password"
              />
            </label>

            {error ? (
              <p className="rounded-[14px] border border-red-400/20 bg-red-400/10 p-3 text-sm leading-5 text-red-100">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting || demoLoading}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase text-black transition hover:bg-[#a7ff2f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sign in
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
          </form>

          <button
            type="button"
            disabled={submitting || demoLoading}
            onClick={useDemoWorkspace}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {demoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Use demo workspace
          </button>

          <div className="my-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
            <span className="h-px flex-1 bg-white/10" />
            OAuth
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {oauthProviders.map((provider) => {
              const disabled = !provider.enabled || submitting || demoLoading;
              return (
                <a
                  key={provider.provider}
                  href={provider.enabled ? oauthStartUrl(provider.provider) : "#"}
                  aria-disabled={disabled}
                  onClick={(event) => {
                    if (disabled) {
                      event.preventDefault();
                      setError(`${provider.label} OAuth is ready in the UI. Add the ${provider.label} keys to enable it.`);
                    }
                  }}
                  className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-xs font-black uppercase transition ${
                    provider.enabled
                      ? "border-white/15 bg-white/8 text-white hover:bg-white/12"
                      : "cursor-not-allowed border-white/8 bg-white/[0.03] text-white/32"
                  }`}
                >
                  {provider.provider === "github" ? (
                    <Github className="h-4 w-4" />
                  ) : (
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-white text-[10px] text-black">
                      G
                    </span>
                  )}
                  {provider.label}
                </a>
              );
            })}
          </div>

          <p className="mt-7 text-center text-sm text-white/48">
            Need a workspace?{" "}
            <Link href="/register" className="font-bold text-white transition hover:text-[#a7ff2f]">
              Create one
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
