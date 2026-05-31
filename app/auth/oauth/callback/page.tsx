"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Radar } from "lucide-react";

import { setToken } from "@/lib/api";

export default function OAuthCallbackPage(): JSX.Element {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const oauthError = params.get("error");

    if (token) {
      setToken(token);
      router.replace("/dashboard");
      return;
    }

    setError(oauthError || "OAuth finished without a session token.");
  }, [router]);

  return (
    <main className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-[#07100f] p-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.24),transparent_24%),radial-gradient(circle_at_80%_76%,rgba(167,255,47,0.16),transparent_28%),linear-gradient(180deg,#081211,#020403)]" />
      <section className="relative z-10 w-full max-w-md rounded-[24px] border border-white/10 bg-black/55 p-8 text-center shadow-[0_24px_110px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <Link href="/" className="mx-auto mb-8 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[-0.04em]">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-black">
            <Radar className="h-4 w-4" />
          </span>
          Orbit
        </Link>

        {error ? (
          <>
            <h1 className="text-2xl font-black tracking-[-0.04em]">OAuth needs attention</h1>
            <p className="mt-3 text-sm leading-6 text-white/55">{error}</p>
            <Link
              href="/login"
              className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black uppercase text-black transition hover:bg-[#a7ff2f]"
            >
              Back to login
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-white/70" />
            <h1 className="mt-5 text-2xl font-black tracking-[-0.04em]">Completing sign in</h1>
            <p className="mt-3 text-sm leading-6 text-white/55">Orbit is exchanging your provider session.</p>
          </>
        )}
      </section>
    </main>
  );
}
