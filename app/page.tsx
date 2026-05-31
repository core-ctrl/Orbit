"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowRight, Database, KeyRound, Radar, ShieldCheck } from "lucide-react";

import { API_URL } from "@/lib/api";

type HealthState = "checking" | "online" | "offline";

const navItems = ["SDK", "INGEST", "REPLAY", "TRACES"];

function apiRoot(): string {
  return API_URL.replace(/\/api\/v1\/?$/, "");
}

export default function LandingPage(): JSX.Element {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [health, setHealth] = useState<HealthState>("checking");

  const healthLabel = useMemo(() => {
    if (health === "online") return "Core online";
    if (health === "offline") return "Backend offline";
    return "Checking core";
  }, [health]);

  useEffect(() => {
    let cancelled = false;

    const checkHealth = async (): Promise<void> => {
      try {
        const response = await fetch(`${apiRoot()}/health`, { cache: "no-store" });
        if (!cancelled) setHealth(response.ok ? "online" : "offline");
      } catch {
        if (!cancelled) setHealth("offline");
      }
    };

    void checkHealth();
    const timer = window.setInterval(checkHealth, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const parallaxStyle = {
    transform: `translate3d(${pointer.x * 16}px, ${pointer.y * 12}px, 0)`,
  };

  return (
    <main
      className="min-h-[100dvh] overflow-hidden bg-[#0b1715] p-2 text-white sm:p-4"
      onMouseMove={(event) => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        setPointer({ x, y });
      }}
    >
      <section className="relative mx-auto flex min-h-[calc(100dvh-16px)] max-w-[1500px] flex-col overflow-hidden rounded-[18px] border border-white/10 bg-[#05090a] shadow-[0_24px_110px_rgba(0,0,0,0.55)] sm:min-h-[calc(100dvh-32px)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_90%,rgba(26,214,171,0.18),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(79,70,229,0.26),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]" />
        <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
        <div className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />

        <header className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[-0.04em]">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-black">
              <Radar className="h-4 w-4" />
            </span>
            Orbit
          </Link>

          <nav className="hidden items-center gap-7 text-[9px] font-black uppercase tracking-[0.26em] text-white/70 md:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-white">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[-0.02em]">
            <Link
              href="/login"
              className="rounded-[5px] border border-white/20 bg-white px-3 py-2 text-black transition hover:bg-zinc-200"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-[5px] border border-white/15 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10"
            >
              Sign up
            </Link>
          </div>
        </header>

        <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-10 pt-4 sm:px-8">
          <div className="relative flex w-full max-w-6xl flex-col items-center text-center">
            <div
              className="absolute -left-6 top-20 hidden h-20 w-20 rounded-full border-[10px] border-[#f8d25c] bg-[#b98120] shadow-[inset_-10px_-12px_0_rgba(0,0,0,0.18),0_18px_40px_rgba(248,210,92,0.22)] lg:block"
              style={{ transform: `translate3d(${-pointer.x * 30}px, ${pointer.y * 26}px, 0) rotate(-18deg)` }}
            >
              <span className="grid h-full w-full place-items-center text-[10px] font-black text-[#fff4bc]">API</span>
            </div>

            <div
              className="absolute -right-2 top-14 hidden h-16 w-16 rounded-full border-[8px] border-[#ffe383] bg-[#c38a25] shadow-[inset_-8px_-9px_0_rgba(0,0,0,0.18),0_18px_40px_rgba(248,210,92,0.2)] md:block"
              style={{ transform: `translate3d(${pointer.x * 42}px, ${-pointer.y * 28}px, 0) rotate(16deg)` }}
            >
              <span className="grid h-full w-full place-items-center text-[9px] font-black text-[#fff6cb]">200</span>
            </div>

            <div
              className="absolute bottom-10 left-[8%] hidden h-28 w-28 rounded-full bg-[radial-gradient(circle_at_30%_28%,#7affd4,#0f9b9b_45%,#104b69_73%)] shadow-[0_24px_70px_rgba(27,214,177,0.35)] md:block"
              style={{ transform: `translate3d(${pointer.x * 24}px, ${pointer.y * 40}px, 0) rotate(${pointer.x * 24}deg)` }}
            >
              <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
              <span className="absolute left-8 top-4 h-3 w-3 rounded-full bg-white/80" />
              <span className="absolute bottom-5 right-5 h-5 w-5 rounded-full bg-[#f7cf57]" />
            </div>

            <div
              className="absolute bottom-12 right-[11%] hidden rotate-[-19deg] rounded-[8px] bg-[#a7ff2f] px-8 py-4 text-[10px] font-black uppercase text-black shadow-[0_18px_55px_rgba(167,255,47,0.3)] lg:block"
              style={{ transform: `translate3d(${pointer.x * 34}px, ${pointer.y * 24}px, 0) rotate(-19deg)` }}
            >
              dsn key
            </div>

            <div
              className="absolute bottom-[24%] right-[23%] hidden h-24 w-24 rounded-[28px] bg-[linear-gradient(135deg,#04d9ff,#7c3cff,#ff7fd4)] shadow-[0_20px_65px_rgba(86,107,255,0.34)] sm:block"
              style={parallaxStyle}
            >
              <div className="absolute inset-3 rounded-[20px] border border-white/25" />
              <Activity className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 text-white" />
            </div>

            <div
              className="absolute left-[15%] top-[34%] hidden h-10 w-10 rotate-45 rounded-[10px] bg-[#3efff0] shadow-[0_15px_40px_rgba(62,255,240,0.36)] sm:block"
              style={{ transform: `translate3d(${-pointer.x * 45}px, ${pointer.y * 20}px, 0) rotate(45deg)` }}
            />
            <div
              className="absolute right-[18%] top-[36%] hidden h-9 w-9 rotate-12 rounded-full bg-[#ff4fbe] shadow-[0_15px_35px_rgba(255,79,190,0.35)] sm:block"
              style={{ transform: `translate3d(${pointer.x * 50}px, ${-pointer.y * 20}px, 0) rotate(12deg)` }}
            />

            <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] ${
                  health === "online"
                    ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                    : health === "offline"
                      ? "border-red-400/25 bg-red-400/10 text-red-200"
                      : "border-white/15 bg-white/5 text-white/70"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {healthLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
                Self-hosted observability
              </span>
            </div>

            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.38em] text-white/45">
              Infrastructure plus application runtime
            </p>
            <h1 className="max-w-6xl select-none text-[clamp(3.7rem,13vw,12.5rem)] font-black uppercase leading-[0.76] tracking-[-0.095em] text-[#f4f4f1]">
              New Era
              <span className="block">Of Orbit</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm font-medium leading-6 text-white/62 sm:text-base">
              One clean command center for Docker, uptime, metrics, errors, traces, replay timelines,
              releases, and source maps. Clone it, configure it, deploy it yourself.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black uppercase tracking-[-0.02em] text-black transition hover:bg-[#a7ff2f]"
              >
                Open dashboard
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-black uppercase tracking-[-0.02em] text-white transition hover:bg-white/10"
              >
                Create admin
              </Link>
            </div>

            <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Core monitor", body: "Docker, CPU, uptime, SSL, databases." },
                { icon: KeyRound, title: "SDK ingest", body: "Errors, stack traces, release metadata." },
                { icon: Database, title: "Zero SaaS", body: "SQLite by default, Postgres when ready." },
              ].map((item) => (
                <div key={item.title} className="rounded-[18px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur">
                  <item.icon className="mb-4 h-5 w-5 text-white/80" />
                  <h2 className="text-xs font-black uppercase tracking-[0.14em] text-white">{item.title}</h2>
                  <p className="mt-2 text-xs leading-5 text-white/52">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
