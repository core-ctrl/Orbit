"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Settings2 } from "lucide-react";
import { api } from "@/lib/api";
import type { Project } from "@/types/orbit";

export default function ProjectsSettingsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.organizations()
      .then(orgs => {
        if (orgs && orgs.length > 0) {
          return api.projects(orgs[0].id);
        }
        return [];
      })
      .then(data => setProjects(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8 border-b border-[var(--glass-border)] pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Projects</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Manage all projects within this organization.</p>
        </div>
        <Link href="/onboarding" className="bg-text-primary text-bg-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Create Project
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-8 text-center text-text-secondary text-sm animate-pulse">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm">No projects found.</div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="p-4 flex items-center justify-between hover:bg-secondary/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-sm" style={{ background: 'var(--gradient-accent)' }}>
                    {project.name[0]?.toUpperCase() || "O"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{project.name}</h3>
                    <div className="flex gap-2 text-xs text-text-muted mt-1">
                      <span>Platform: <span className="capitalize text-text-secondary font-medium">{project.platform}</span></span>
                      <span>·</span>
                      <span>Environment: <span className="capitalize text-text-secondary font-medium">{project.environment}</span></span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/dashboard/${project.id}/issues`} className="text-xs text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-lg border border-border hover:bg-secondary transition-colors">
                    Dashboard
                  </Link>
                  <Link href={`/settings/organization/projects/${project.id}`} className="text-xs bg-secondary border border-border text-text-primary px-3 py-1.5 rounded-lg hover:bg-hover transition-colors flex items-center gap-1">
                    <Settings2 className="w-3.5 h-3.5" /> Settings
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
