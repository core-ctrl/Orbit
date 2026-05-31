"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Loader2, RadioTower } from "lucide-react";

import { api } from "@/lib/api";
import type { Issue, Project } from "@/types/orbit";

export default function GlobalErrorsPage(): JSX.Element {
  const [project, setProject] = useState<Project | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async (): Promise<void> => {
      setLoading(true);
      setError("");

      try {
        const orgs = await api.organizations();
        const firstOrg = orgs[0];
        if (!firstOrg) {
          setProject(null);
          setIssues([]);
          return;
        }

        const projects = await api.projects(firstOrg.id);
        const firstProject = projects[0];
        if (!firstProject) {
          setProject(null);
          setIssues([]);
          return;
        }

        setProject(firstProject);
        setIssues(await api.issues(firstProject.id, { status: "unresolved" }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load errors.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const stats = useMemo(() => {
    const critical = issues.filter((issue) => issue.level === "error").length;
    const affectedUsers = issues.reduce((total, issue) => total + issue.users_affected, 0);
    const events = issues.reduce((total, issue) => total + issue.times_seen, 0);
    return { critical, affectedUsers, events };
  }, [issues]);

  return (
    <main className="min-h-screen bg-primary p-4 text-text-primary sm:p-6 lg:p-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 overflow-hidden rounded-[26px] border border-white/10 bg-[#05090a] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/40">Realtime error command</p>
              <h1 className="mt-3 text-4xl font-black uppercase leading-[0.86] tracking-[-0.07em] text-white sm:text-6xl">
                Error
                <span className="block">Tracking</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
                A global entry point for SDK-captured issues. It opens the first available project, so
                single-project installs get a clean Sentry-style error board immediately.
              </p>
            </div>

            {project ? (
              <Link
                href={`/dashboard/${project.id}/issues`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase text-black transition hover:bg-[#a7ff2f]"
              >
                Project issue board
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Open issues", value: issues.length },
            { label: "Error level", value: stats.critical },
            { label: "Affected users", value: stats.affectedUsers },
          ].map((item) => (
            <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/38">{item.label}</p>
              <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04]">
          {loading ? (
            <div className="grid min-h-[320px] place-items-center">
              <div className="flex items-center gap-3 text-white/50">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading issues
              </div>
            </div>
          ) : error ? (
            <div className="grid min-h-[320px] place-items-center p-6 text-center">
              <div>
                <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-red-300" />
                <h2 className="text-xl font-black">Could not load errors</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/50">{error}</p>
              </div>
            </div>
          ) : issues.length === 0 ? (
            <div className="grid min-h-[320px] place-items-center p-6 text-center">
              <div>
                <RadioTower className="mx-auto mb-4 h-8 w-8 text-white/45" />
                <h2 className="text-xl font-black">No unresolved errors yet</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/50">
                  Install an Orbit SDK in an app, send events to the ingest endpoint, and issues will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="border-b border-white/10 text-[10px] uppercase tracking-[0.22em] text-white/38">
                  <tr>
                    <th className="px-5 py-4">Issue</th>
                    <th className="px-5 py-4">Level</th>
                    <th className="px-5 py-4">Events</th>
                    <th className="px-5 py-4">Users</th>
                    <th className="px-5 py-4">Last seen</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue.id} className="border-b border-white/5 transition hover:bg-white/[0.04]">
                      <td className="px-5 py-4">
                        <Link
                          href={`/dashboard/${issue.project_id}/issues/${issue.id}`}
                          className="group block"
                        >
                          <span className="block max-w-[420px] truncate text-sm font-bold text-white group-hover:text-[#a7ff2f]">
                            {issue.title}
                          </span>
                          <span className="mt-1 block max-w-[420px] truncate text-xs text-white/40">
                            {issue.culprit || issue.fingerprint}
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full border border-red-300/20 bg-red-400/10 px-3 py-1 text-xs font-bold uppercase text-red-100">
                          {issue.level}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-white/62">{issue.times_seen}</td>
                      <td className="px-5 py-4 text-sm text-white/62">{issue.users_affected}</td>
                      <td className="px-5 py-4 text-sm text-white/62">
                        {new Date(issue.last_seen).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-right text-xs text-white/35">
          Total captured events across this view: {stats.events}
        </p>
      </section>
    </main>
  );
}
