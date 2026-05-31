import type {
  AlertItem,
  ApiKeyItem,
  ApmStats,
  AuditLogEntry,
  ConfigRead,
  ContainerMetric,
  CustomMetric,
  DatabaseHealth,
  Deployment,
  DockerStatus,
  EndpointHistoryPoint,
  EndpointMetric,
  ErrorEvent,
  Incident,
  IncidentUpdate,
  Integration,
  Issue,
  AppLog,
  Organization,
  Project,
  PublicStatusData,
  SslCertificate,
  StatusPageConfig,
  SystemMetric,
  TokenResponse,
  UserProfile,
} from "@/types/orbit";

// ── Base URL ──
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// ── Token Management ──
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("orbit.token");
}

export function setToken(token: string): void {
  window.localStorage.setItem("orbit.token", token);
  document.cookie = `orbit.token=${token}; path=/; max-age=2592000; SameSite=Lax`;
}

export function clearToken(): void {
  window.localStorage.removeItem("orbit.token");
  document.cookie = `orbit.token=; path=/; max-age=0; SameSite=Lax`;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export type OAuthProvider = "google" | "github";

export interface OAuthProviderStatus {
  provider: OAuthProvider;
  enabled: boolean;
  label: string;
}

export interface OAuthProvidersResponse {
  providers: OAuthProviderStatus[];
}

// ── Core Request Helper ──
async function request<T>(
  path: string,
  init?: RequestInit,
  authenticated = true
): Promise<T> {
  const token = getToken();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (authenticated && token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (!response.ok) {
    if (response.status === 401 && authenticated) {
      clearToken();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

// ── Convenience for auth headers ──
export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── API Client ──
export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<TokenResponse>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
      false
    ),
  register: (data: RegisterPayload) =>
    request<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }, false),
  verify: (token: string) =>
    request<TokenResponse>("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    }, false),
  demo: () =>
    request<TokenResponse>("/auth/demo", { method: "POST" }, false),
  oauthProviders: () =>
    request<OAuthProvidersResponse>("/auth/oauth/providers", undefined, false),
  me: () => request<UserProfile>("/auth/me"),

  // Organizations
  organizations: () => request<Organization[]>("/organizations"),
  createOrganization: (name: string, slug: string) =>
    request<Organization>("/organizations", {
      method: "POST",
      body: JSON.stringify({ name, slug }),
    }),

  // Projects
  projects: (orgId: string) =>
    request<Project[]>(`/projects?org_id=${orgId}`),
  project: (projectId: string) =>
    request<Project>(`/projects/${projectId}`),
  createProject: (data: { org_id: string; name: string; platform: string; slug: string }) =>
    request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProject: (projectId: string, data: Partial<Project>) =>
    request<Project>(`/projects/${projectId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteProject: (projectId: string) =>
    request<{ message: string }>(`/projects/${projectId}`, { method: "DELETE" }),

  // Issues
  issues: (projectId: string, params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    return request<Issue[]>(`/projects/${projectId}/issues${qs ? `?${qs}` : ""}`);
  },
  issue: (projectId: string, issueId: string) =>
    request<Issue>(`/projects/${projectId}/issues/${issueId}`),
  updateIssue: (projectId: string, issueId: string, data: Partial<Issue>) =>
    request<Issue>(`/projects/${projectId}/issues/${issueId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  bulkUpdateIssues: (projectId: string, issueIds: string[], status: string) =>
    request<{ updated: number }>(`/projects/${projectId}/issues`, {
      method: "PATCH",
      body: JSON.stringify({ issue_ids: issueIds, status }),
    }),
  issueEvents: (projectId: string, issueId: string) =>
    request<ErrorEvent[]>(`/projects/${projectId}/issues/${issueId}/events`),
  issueAiInsights: (projectId: string, issueId: string) =>
    request<{ analysis?: string; insight?: string; provider?: string }>(`/projects/${projectId}/issues/${issueId}/ai-insights`),
  healIssue: (projectId: string, issueId: string) =>
    request<{ status: string; patch: string; pr: any }>(`/projects/${projectId}/issues/${issueId}/heal`, { method: "POST" }),

  // Incidents
  incidents: (projectId: string) =>
    request<Incident[]>(`/projects/${projectId}/p-data`),
  incident: (projectId: string, incidentId: string) =>
    request<Incident>(`/projects/${projectId}/p-data/${incidentId}`),
  createIncident: (projectId: string, data: { title: string; severity: string }) =>
    request<Incident>(`/projects/${projectId}/p-data`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateIncident: (projectId: string, incidentId: string, data: Partial<Incident>) =>
    request<Incident>(`/projects/${projectId}/p-data/${incidentId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  addIncidentUpdate: (projectId: string, incidentId: string, data: { status: string; message: string }) =>
    request<IncidentUpdate>(`/projects/${projectId}/p-data/${incidentId}/updates`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Deployments
  deployments: (projectId: string) =>
    request<Deployment[]>(`/projects/${projectId}/deployments`),

  // Metrics
  metrics: (projectId: string) =>
    request<CustomMetric[]>(`/projects/${projectId}/metrics`),

  // Performance / APM
  apm: (projectId: string) =>
    request<ApmStats>(`/projects/${projectId}/performance/apm`),

  // Logs
  logs: (projectId: string, params?: { level?: string; source?: string; search?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.level) query.set("level", params.level);
    if (params?.source) query.set("source", params.source);
    if (params?.search) query.set("search", params.search);
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return request<AppLog[]>(`/projects/${projectId}/logs${qs ? `?${qs}` : ""}`);
  },

  // Integrations
  integrations: (projectId: string) =>
    request<Integration[]>(`/projects/${projectId}/integrations`),
  createIntegration: (projectId: string, data: { provider: string; webhook_url: string }) =>
    request<Integration>(`/projects/${projectId}/integrations`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteIntegration: (projectId: string, integrationId: string) =>
    request<{ message: string }>(`/projects/${projectId}/integrations/${integrationId}`, {
      method: "DELETE",
    }),

  // API Keys
  apiKeys: (orgId: string) =>
    request<ApiKeyItem[]>(`/organizations/${orgId}/keys`),
  createApiKey: (orgId: string, name: string) =>
    request<ApiKeyItem>(`/organizations/${orgId}/keys`, {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  revokeApiKey: (orgId: string, keyId: string) =>
    request<{ message: string }>(`/organizations/${orgId}/keys/${keyId}`, {
      method: "DELETE",
    }),

  // Audit Logs
  auditLogs: (orgId: string) =>
    request<AuditLogEntry[]>(`/organizations/${orgId}/audit-logs`),

  // Status Pages
  statusPageConfig: (orgId: string) =>
    request<StatusPageConfig>(`/organizations/${orgId}/status`),
  updateStatusPage: (orgId: string, data: Partial<StatusPageConfig>) =>
    request<StatusPageConfig>(`/organizations/${orgId}/status`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  publicStatus: (slug: string) =>
    request<PublicStatusData>(`/status/${slug}`, undefined, false),

  // Reports & Backups
  report: (projectId: string, format: "json" | "html" = "json") =>
    request<Record<string, unknown>>(`/projects/${projectId}/reports?format=${format}`),
  exportBackup: (projectId: string) =>
    request<Record<string, unknown>>(`/projects/${projectId}/export`),
  importBackup: (projectId: string, payload: Record<string, unknown>) =>
    request<{ status: string; issues_processed: number; performance_processed: number }>(`/projects/${projectId}/import`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // ── Infrastructure (existing) ──
  system: () => request<SystemMetric>("/system"),
  dockerStatus: () => request<DockerStatus>("/docker/status"),
  containers: () => request<ContainerMetric[]>("/docker/containers"),
  containerAction: (id: string, action: "start" | "stop" | "restart") =>
    request<{ message: string }>(`/docker/containers/${id}/${action}`, { method: "POST" }),
  endpoints: () => request<EndpointMetric[]>("/endpoints"),
  endpointHistory: (name: string) =>
    request<EndpointHistoryPoint[]>(`/endpoints/${encodeURIComponent(name)}/history`),
  databases: () => request<DatabaseHealth[]>("/databases"),
  ssl: () => request<SslCertificate[]>("/ssl"),
  alerts: () => request<AlertItem[]>("/alerts"),
  config: () => request<ConfigRead>("/config"),
  updateConfig: (raw_yaml: string) =>
    request<ConfigRead>("/config", { method: "PUT", body: JSON.stringify({ raw_yaml }) }),
};

export function oauthStartUrl(provider: OAuthProvider): string {
  const redirectTo =
    typeof window === "undefined" ? "" : `${window.location.origin}/auth/oauth/callback`;
  const query = redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : "";
  return `${API_URL}/auth/oauth/${provider}/start${query}`;
}

// ── Public Ingest Helpers (no auth) ──
export const ingest = {
  error: (dsnKey: string, payload: Record<string, unknown>) =>
    request<{ id: string; status: string }>(`/ingest/${dsnKey}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, false),
  metrics: (dsnKey: string, payload: Record<string, unknown>) =>
    request<{ id: string; status: string }>(`/ingest/metrics/${dsnKey}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, false),
  performance: (dsnKey: string, payload: Record<string, unknown>) =>
    request<{ id: string; status: string }>(`/ingest/performance/${dsnKey}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, false),
  logs: (dsnKey: string, payload: Record<string, unknown>) =>
    request<{ id: string; status: string }>(`/ingest/logs/${dsnKey}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, false),
};

// ── SSE / Event Stream URL ──
export function eventStreamUrl(path: string): string {
  const token = encodeURIComponent(getToken() ?? "");
  return `${API_URL}${path}?token=${token}`;
}
