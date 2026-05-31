"use client";

import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";
import { ArrowRight, Check, Loader2, Radar } from "lucide-react";

import { api } from "@/lib/api";

function passwordScore(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export default function RegisterPage(): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => passwordScore(password), [password]);
  const strengthLabel = ["Start typing", "Weak", "Fair", "Strong", "Launch-ready"][strength];

  const handleRegister = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.register({ name, email, password });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-[#07100f] p-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_84%,rgba(167,255,47,0.18),transparent_24%),radial-gradient(circle_at_88%_16%,rgba(59,130,246,0.26),transparent_28%),linear-gradient(180deg,#081211,#020403)]" />
      <div className="absolute right-8 top-10 h-20 w-20 rounded-full border-[10px] border-[#f8d25c] bg-[#b98120] opacity-80 shadow-[0_20px_70px_rgba(248,210,92,0.22)]" />
      <div className="absolute bottom-10 left-10 hidden h-28 w-28 rounded-full bg-[radial-gradient(circle_at_30%_28%,#7affd4,#0f9b9b_45%,#104b69_73%)] shadow-[0_24px_70px_rgba(27,214,177,0.35)] sm:block" />

      <section className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[24px] border border-white/10 bg-black/55 shadow-[0_24px_110px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:grid-cols-[440px_1fr]">
        <div className="border-r border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <Link href="/" className="mb-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-[-0.04em]">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-black">
              <Radar className="h-4 w-4" />
            </span>
            Orbit
          </Link>

          {success ? (
            <div className="flex min-h-[470px] flex-col justify-center text-center">
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#a7ff2f] text-black">
                <Check className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-black tracking-[-0.04em]">Verify your email</h1>
              <p className="mt-3 text-sm leading-6 text-white/55">
                Orbit created the workspace shell for <span className="font-bold text-white">{email}</span>.
                Complete email verification, then sign in.
              </p>
              <Link
                href="/login"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black uppercase text-black transition hover:bg-[#a7ff2f]"
              >
                Return to login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">Create admin</p>
              <h1 className="mt-3 text-3xl font-black tracking-[-0.04em]">Start your Orbit</h1>
              <p className="mt-2 text-sm leading-6 text-white/55">
                One account owns the first organization. You can add projects and SDK keys inside the dashboard.
              </p>

              <form onSubmit={handleRegister} className="mt-8 space-y-4">
                <label className="block text-xs font-black uppercase tracking-[0.18em] text-white/55">
                  Name
                  <input
                    type="text"
                    className="mt-2 w-full rounded-[14px] border border-white/10 bg-black/35 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-black/50"
                    placeholder="Ada Lovelace"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </label>

                <label className="block text-xs font-black uppercase tracking-[0.18em] text-white/55">
                  Email
                  <input
                    type="email"
                    className="mt-2 w-full rounded-[14px] border border-white/10 bg-black/35 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-black/50"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>

                <label className="block text-xs font-black uppercase tracking-[0.18em] text-white/55">
                  Password
                  <input
                    type="password"
                    className="mt-2 w-full rounded-[14px] border border-white/10 bg-black/35 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-black/50"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={8}
                  />
                </label>

                <div>
                  <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                    <span>Password strength</span>
                    <span>{strengthLabel}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((index) => (
                      <span
                        key={index}
                        className={`h-1.5 rounded-full transition ${
                          index < strength ? "bg-[#a7ff2f]" : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <label className="block text-xs font-black uppercase tracking-[0.18em] text-white/55">
                  Confirm password
                  <input
                    type="password"
                    className="mt-2 w-full rounded-[14px] border border-white/10 bg-black/35 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-black/50"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                  />
                </label>

                {error ? (
                  <p className="rounded-[14px] border border-red-400/20 bg-red-400/10 p-3 text-sm leading-5 text-red-100">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase text-black transition hover:bg-[#a7ff2f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Create workspace
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-white/48">
                Already have access?{" "}
                <Link href="/login" className="font-bold text-white transition hover:text-[#a7ff2f]">
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>

        <div className="hidden min-h-[680px] flex-col justify-between p-8 lg:flex">
          <div className="flex justify-end gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
              SQLite first
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
              Docker optional
            </span>
          </div>

          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.34em] text-white/45">Self-host the stack</p>
            <h2 className="max-w-lg text-[clamp(4rem,8vw,7rem)] font-black uppercase leading-[0.78] tracking-[-0.09em] text-[#f4f4f1]">
              Own
              <span className="block">Your</span>
              <span className="block">Signals</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-white/55">
            Core monitoring works without SDKs. The observability layer turns on when your apps install
            Orbit Browser, Next.js, Node, or Python SDK packages.
          </p>
        </div>
      </section>
    </main>
  );
}
