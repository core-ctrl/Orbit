"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Box, Check, Copy, KeyRound, Loader2, Radar, ShieldAlert, Terminal } from "lucide-react";
import { api } from "@/lib/api";

export default function OnboardingPage(): JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [platform, setPlatform] = useState("nextjs");
  const [dsn, setDsn] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
      const orgData = await api.createOrganization(orgName, orgSlug);

      const projSlug = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
      const projData = await api.createProject({
        org_id: orgData.id,
        name: projectName,
        slug: projSlug,
        platform,
      });

      setDsn(`https://ingest.orbit.dev/api/ingest/${projData.dsn_key}`);
      setStep(3);
    } catch (err) {
      console.error("Onboarding error:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(dsn);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#07100f] px-4 py-12 text-white">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_84%,rgba(167,255,47,0.15),transparent_30%),radial-gradient(circle_at_88%_16%,rgba(59,130,246,0.15),transparent_35%),linear-gradient(180deg,#081211,#020403)]" />

      {/* Floating Elements */}
      <div className="absolute right-[10%] top-[15%] hidden h-24 w-24 rounded-[30px] bg-[linear-gradient(135deg,#04d9ff,#7c3cff)] opacity-60 shadow-[0_20px_65px_rgba(86,107,255,0.34)] sm:block" style={{ transform: 'rotate(-12deg)' }} />
      <div className="absolute bottom-[10%] left-[10%] hidden h-32 w-32 rounded-full border-[12px] border-[#a7ff2f]/20 shadow-[0_0_80px_rgba(167,255,47,0.2)] sm:block" />

      <div className="relative z-10 w-full max-w-[640px]">
        {/* Header Logo */}
        <div className="mb-12 flex justify-center">
          <Link href="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-[-0.04em]">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.4)]">
              <Radar className="h-5 w-5" />
            </span>
            <span className="text-xl">Orbit</span>
          </Link>
        </div>

        {/* Cinematic Frame */}
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/60 shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          
          {/* STEP 1: Organization */}
          {step === 1 && (
            <div className="p-10 sm:p-14">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-white/5 border border-white/10 text-white">
                  <Box className="h-7 w-7" />
                </div>
                <h1 className="text-[clamp(2rem,5vw,3rem)] font-black uppercase leading-[0.85] tracking-[-0.04em]">Create Org</h1>
                <p className="mt-4 text-sm font-medium leading-6 text-white/55 max-w-sm mx-auto">
                  Your organization represents your company. You can invite team members to it later.
                </p>
              </div>

              <form onSubmit={() => setStep(2)} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-white/55 mb-2 pl-1">
                    Organization Name
                  </label>
                  <input
                    required
                    autoFocus
                    type="text"
                    className="w-full rounded-[16px] border border-white/10 bg-black/40 px-5 py-4 text-base font-bold text-white outline-none transition placeholder:text-white/20 focus:border-white/30 focus:bg-black/60"
                    placeholder="Acme Corporation"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                </div>
                
                <button type="submit" className="group flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.1em] text-black transition hover:bg-[#a7ff2f]">
                  Continue
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Project & Platform */}
          {step === 2 && (
            <div className="p-10 sm:p-14">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-white/5 border border-white/10 text-white">
                  <Terminal className="h-7 w-7" />
                </div>
                <h1 className="text-[clamp(2rem,5vw,3rem)] font-black uppercase leading-[0.85] tracking-[-0.04em]">Add Project</h1>
                <p className="mt-4 text-sm font-medium leading-6 text-white/55 max-w-sm mx-auto">
                  Where are you tracking errors? Create your first project to generate an API key.
                </p>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-white/55 mb-2 pl-1">
                    Project Name
                  </label>
                  <input
                    required
                    autoFocus
                    type="text"
                    className="w-full rounded-[16px] border border-white/10 bg-black/40 px-5 py-4 text-base font-bold text-white outline-none transition placeholder:text-white/20 focus:border-white/30 focus:bg-black/60"
                    placeholder="Frontend Dashboard"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-white/55 mb-2 pl-1">
                    Platform Framework
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none rounded-[16px] border border-white/10 bg-black/40 px-5 py-4 text-base font-bold text-white outline-none transition focus:border-white/30 focus:bg-black/60"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                    >
                      <option value="nextjs">Next.js</option>
                      <option value="python">Python (FastAPI)</option>
                      <option value="docker">Docker Agent</option>
                      <option value="other">Vanilla JS / Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center">
                      <ArrowRight className="h-4 w-4 rotate-90 text-white/40" />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setStep(1)} className="rounded-full border border-white/10 px-6 py-4 text-sm font-black uppercase tracking-[0.1em] text-white/60 transition hover:bg-white/5 hover:text-white">
                    Back
                  </button>
                  <button type="submit" disabled={loading} className="group flex flex-1 items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.1em] text-black transition hover:bg-[#a7ff2f] disabled:opacity-50">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Generate Key"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: API Key & Snippet */}
          {step === 3 && (
            <div className="p-8 sm:p-12">
              <div className="mb-8 text-left">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#a7ff2f]/20 border border-[#a7ff2f]/40 text-[#a7ff2f]">
                  <KeyRound className="h-7 w-7" />
                </div>
                <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-black uppercase leading-[0.85] tracking-[-0.04em]">
                  SDK Ready
                </h1>
                <p className="mt-4 text-sm font-medium leading-6 text-white/55">
                  Insert this snippet into your application to start monitoring instantly.
                </p>
              </div>

              {/* DSN Copy Box */}
              <div className="mb-8 relative overflow-hidden rounded-[16px] border border-[#a7ff2f]/30 bg-[#a7ff2f]/5 p-5">
                <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.18em] text-[#a7ff2f]">
                  <span>Your DSN Key</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <code className="truncate font-mono text-sm text-white">
                    {dsn}
                  </code>
                  <button onClick={copyToClipboard} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-black">
                    {copied ? <Check className="h-4 w-4 text-[#a7ff2f] hover:text-black" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="mb-10 overflow-hidden rounded-[16px] border border-white/10 bg-black">
                <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="ml-2 text-[10px] font-mono text-white/40">app.tsx</span>
                </div>
                <div className="p-5 font-mono text-xs leading-relaxed text-white/80 overflow-x-auto">
                  <div className="text-[#a7ff2f]">import <span className="text-white">{`{ initOrbit }`}</span> from <span className="text-[#04d9ff]">{"'@orbit-sdk/" + platform + "'"}</span>;</div>
                  <br />
                  <div className="text-white">initOrbit{`({`}</div>
                  <div className="pl-4 text-white/50">dsn: <span className="text-[#a7ff2f]">{`'${dsn}'`}</span>,</div>
                  <div className="pl-4 text-white/50">environment: <span className="text-[#a7ff2f]">'production'</span>,</div>
                  <div className="text-white">{`});`}</div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button onClick={() => router.push("/dashboard")} className="text-[11px] font-black uppercase tracking-[0.1em] text-white/40 hover:text-white transition">
                  Skip to Dashboard
                </button>
                <button onClick={() => router.push("/dashboard")} className="group flex items-center justify-center gap-3 rounded-full bg-[#a7ff2f] px-8 py-4 text-sm font-black uppercase tracking-[0.1em] text-black transition hover:bg-white shadow-[0_0_40px_rgba(167,255,47,0.3)]">
                  Enter Orbit
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Progress Dots */}
        <div className="mt-8 flex justify-center gap-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 rounded-full transition-all duration-300 ${s === step ? "w-8 bg-[#a7ff2f]" : "w-2 bg-white/10"}`} />
          ))}
        </div>
      </div>
    </main>
  );
}
