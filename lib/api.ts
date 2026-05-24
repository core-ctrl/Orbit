import type {
  AlertItem,
  ConfigRead,
  ContainerMetric,
  DatabaseHealth,
  DockerStatus,
  EndpointHistoryPoint,
  EndpointMetric,
  SslCertificate,
  SystemMetric,
  TokenResponse
} from "@/types/orbit";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("orbit.token");
}

export function setToken(token: string): void {
  window.localStorage.setItem("orbit.token", token);
}

export function clearToken(): void {
  window.localStorage.removeItem("orbit.token");
}

async function request<T>(path: string, init?: RequestInit, authenticated = true): Promise<T> {
  const token = getToken();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (authenticated && token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    if (response.status === 401 && authenticated) clearToken();
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export const api = {
  login: (password: string) =>
    request<TokenResponse>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ password }) },
      false
    ),
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
    request<ConfigRead>("/config", { method: "PUT", body: JSON.stringify({ raw_yaml }) })
};

export function eventStreamUrl(path: string): string {
  const token = encodeURIComponent(getToken() ?? "");
  return `${API_URL}${path}?token=${token}`;
}
