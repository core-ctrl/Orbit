export type StatusValue = "up" | "down" | "degraded" | "unknown";

export interface SystemMetric {
  timestamp: string;
  cpu_percent: number;
  cpu_per_core: number[];
  cpu_count: number;
  cpu_freq_mhz: number | null;
  memory_percent: number;
  memory_used: number;
  memory_total: number;
  memory_available: number;
  disk_percent: number;
  disk_used: number;
  disk_total: number;
  network_rx: number;
  network_tx: number;
  network_rx_bps: number;
  network_tx_bps: number;
  boot_time: string;
  uptime_seconds: number;
  uptime_str: string;
  hostname: string;
  os_platform: string;
  load_1m: number | null;
  load_5m: number | null;
  load_15m: number | null;
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

// ════════════════════════════════════════════
// API Response Types
// ════════════════════════════════════════════

export interface Organization {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan: string;
  created_at: string;
}

export interface Project {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  platform: string;
  dsn_key: string;
  ingest_token: string;
  timezone: string;
  environment: string;
  created_at: string;
}

export interface Issue {
  id: string;
  project_id: string;
  fingerprint: string;
  title: string;
  culprit: string;
  type: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  status: 'unresolved' | 'resolved' | 'ignored';
  first_seen: string;
  last_seen: string;
  times_seen: number;
  users_affected: number;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface ErrorEvent {
  id: string;
  project_id: string;
  issue_id: string;
  environment: string;
  fingerprint: string;
  type: string;
  message: string;
  stack_trace: StackFrame[];
  platform: string;
  level: string;
  url: string | null;
  user_id: string | null;
  user_email: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  release_version: string | null;
  tags: Record<string, string> | null;
  extra: Record<string, unknown> | null;
  received_at: string;
  breadcrumbs?: Breadcrumb[];
}

export interface StackFrame {
  filename: string | null;
  function: string | null;
  lineno: number | null;
  colno: number | null;
  context_line: string | null;
  pre_context: string[] | null;
  post_context: string[] | null;
}

export interface Breadcrumb {
  id: string;
  error_id: string;
  type: string;
  category: string | null;
  message: string | null;
  level: string | null;
  data: Record<string, unknown> | null;
  timestamp: string | null;
}

export interface Incident {
  id: string;
  project_id: string;
  title: string;
  status: 'open' | 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  owner_id: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  updates?: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  incident_id: string;
  user_id: string;
  status: string;
  message: string;
  created_at: string;
}

export interface Deployment {
  id: string;
  project_id: string;
  version: string;
  environment: string;
  status: 'deploying' | 'deployed' | 'failed';
  commit_sha: string | null;
  commit_message: string | null;
  author_name: string | null;
  created_at: string;
}

export interface CustomMetric {
  id: number;
  project_id: string;
  name: string;
  type: 'counter' | 'gauge' | 'histogram';
  value: number;
  timestamp: string;
}

export interface Transaction {
  id: string;
  project_id: string;
  name: string;
  type: 'request' | 'page-load';
  duration_ms: number;
  status_code: number | null;
  timestamp: string;
  web_vitals: {
    lcp?: number;
    fid?: number;
    cls?: number;
  } | null;
}

export interface AppLog {
  id: string;
  project_id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  source: string;
  message: string;
  timestamp: string;
  extra: Record<string, unknown> | null;
}

export interface Integration {
  id: string;
  project_id: string;
  provider: 'slack' | 'discord';
  webhook_url: string;
  is_active: boolean;
  created_at: string;
}

export interface ApiKeyItem {
  id: string;
  org_id: string;
  name: string;
  key_prefix: string;
  key_hash?: string;
  created_at: string;
  expires_at: string | null;
  // Only present on creation response
  raw_key?: string;
}

export interface AuditLogEntry {
  id: string;
  org_id: string;
  user_id: string;
  action: string;
  target_type: string;
  target_id: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface StatusPageConfig {
  id: string;
  org_id: string;
  slug: string;
  title: string;
  is_public: boolean;
  created_at: string;
}

export interface ApmStats {
  apdex: number;
  avg_latency_ms: number;
  throughput: number;
  error_rate: number;
  slowest_transactions: Transaction[];
  web_vitals: {
    lcp: number | null;
    fid: number | null;
    cls: number | null;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  plan: string;
  created_at: string;
}

export interface PublicStatusData {
  title: string;
  slug: string;
  overall_status: StatusValue;
  endpoints: EndpointMetric[];
  incidents: Incident[];
}
