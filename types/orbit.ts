export type StatusValue = "up" | "down" | "degraded" | "unknown";

export interface SystemMetric {
  timestamp: string;
  cpu_percent: number;
  memory_percent: number;
  memory_used: number;
  memory_total: number;
  disk_percent: number;
  disk_used: number;
  disk_total: number;
  network_rx: number;
  network_tx: number;
  boot_time: string;
}

export interface PortMapping {
  private_port: string;
  public_bindings: string[];
}

export interface ContainerMetric {
  id: string;
  name: string;
  image: string;
  status: string;
  health: string | null;
  cpu_percent: number;
  memory_usage: number;
  memory_limit: number;
  memory_percent: number;
  network_rx: number;
  network_tx: number;
  block_read: number;
  block_write: number;
  restart_count: number;
  started_at: string | null;
  uptime_seconds: number | null;
  environment: string[];
  ports: PortMapping[];
}

export interface DockerStatus {
  enabled: boolean;
  available: boolean;
  error: string | null;
}

export interface ContainerUpdate {
  status: DockerStatus;
  containers: ContainerMetric[];
}

export interface EndpointMetric {
  name: string;
  url: string;
  method: string;
  status: StatusValue;
  status_code: number | null;
  latency_ms: number | null;
  checked_at: string;
  error: string | null;
  tags: string[];
}

export interface EndpointHistoryPoint {
  timestamp: string;
  latency_ms: number | null;
  status: StatusValue;
}

export interface DatabaseHealth {
  name: string;
  type: string;
  status: StatusValue;
  latency_ms: number | null;
  checked_at: string;
  error: string | null;
}

export interface SslCertificate {
  domain: string;
  status: StatusValue;
  expires_at: string | null;
  days_remaining: number | null;
  checked_at: string;
  error: string | null;
}

export interface AlertItem {
  id: number;
  severity: "info" | "warning" | "critical";
  source: string;
  title: string;
  message: string;
  created_at: string;
  acknowledged: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ConfigRead {
  raw_yaml: string;
}

export interface LogEntry {
  timestamp: string;
  source: string;
  message: string;
}
