"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, setToken } from "@/lib/api";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("No verification token found in URL.");
      return;
    }

    const verifyToken = async () => {
      try {
        const data = await api.verify(token);
        setToken(data.access_token);
        setStatus("success");
        // Automatically redirect after 2 seconds
        setTimeout(() => {
          router.push("/onboarding");
        }, 2000);
      } catch (err: unknown) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Verification failed");
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="glass-card-elevated p-8 text-center">
      {status === "loading" && (
        <div className="py-8">
          <div className="w-12 h-12 rounded-full border-2 border-border border-t-accent animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-medium text-text-primary">Verifying your email...</h2>
        </div>
      )}

      {status === "success" && (
        <div className="py-6">
          <div className="w-16 h-16 rounded-full bg-success/20 text-success mx-auto flex items-center justify-center mb-6 animate-scale-in">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-xl font-medium text-text-primary mb-2">Email Verified!</h2>
          <p className="text-text-secondary text-sm mb-6">
            Your account is ready. Redirecting you to onboarding...
          </p>
          <button 
            onClick={() => router.push("/onboarding")}
            className="btn-gradient px-6 py-2.5 text-sm inline-block"
          >
            Continue Now
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="py-6">
          <div className="w-16 h-16 rounded-full bg-danger/20 text-danger mx-auto flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-xl font-medium text-text-primary mb-2">Verification Failed</h2>
          <p className="text-text-secondary text-sm mb-6">{errorMsg}</p>
          <Link href="/login" className="btn-glass px-6 py-2.5 text-sm inline-block">
            Back to Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-[var(--accent)]/5 blur-[120px]" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-[var(--info)]/5 blur-[100px]" />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 transition-transform hover:scale-105">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-white shadow-glow">O</div>
            <span className="text-xl font-semibold tracking-tight text-text-primary">Orbit</span>
          </Link>
        </div>

        <Suspense fallback={<div className="text-center p-8 text-text-secondary">Loading...</div>}>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
