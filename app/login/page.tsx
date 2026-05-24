"use client";

import { Waypoints } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { api, getToken, setToken } from "@/lib/api";

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace("/");
  }, [router]);

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const session = await api.login(password);
      setToken(session.access_token);
      router.replace("/");
    } catch {
      setError("Unable to sign in. Verify your password and backend URL.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="panel w-full max-w-md p-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-orbit/10 text-orbit">
            <Waypoints />
          </span>
          <div>
            <p className="font-semibold tracking-[0.28em]">ORBIT</p>
            <p className="text-sm text-muted">Self-hosted monitoring</p>
          </div>
        </div>
        <h1 className="text-2xl font-semibold">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Use the password configured in <span className="text-ink">ORBIT_ADMIN_PASSWORD</span>.
        </p>
        <form className="mt-8 space-y-4" onSubmit={submit}>
          <label className="block text-sm text-muted">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none ring-orbit/40 transition focus:ring-2"
            />
          </label>
          {error && <p className="rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</p>}
          <button
            disabled={submitting}
            className="w-full rounded-xl bg-orbit px-4 py-3 font-medium text-canvas transition hover:bg-orbit/90 disabled:opacity-60"
          >
            {submitting ? "Connecting..." : "Enter command center"}
          </button>
        </form>
      </div>
    </main>
  );
}
