# API Reference

All `/api/v1` endpoints except login require `Authorization: Bearer <jwt>`. Login sessions expire after seven days.

## Authentication

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/v1/auth/login` | Exchange the configured admin password for a JWT |

## Monitoring

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/v1/system` | CPU, memory, disk, network, and boot time |
| GET | `/api/v1/docker/status` | Docker enabled/available status |
| GET | `/api/v1/docker/containers` | Container inventory and stats |
| GET | `/api/v1/docker/containers/{id}` | Container detail |
| POST | `/api/v1/docker/containers/{id}/start` | Start a container |
| POST | `/api/v1/docker/containers/{id}/stop` | Stop a container |
| POST | `/api/v1/docker/containers/{id}/restart` | Restart a container |
| GET | `/api/v1/docker/containers/{id}/logs` | SSE container log stream; accepts `token` query for EventSource |
| GET | `/api/v1/endpoints` | Latest HTTP target checks |
| GET | `/api/v1/endpoints/{name}/history` | Stored latency samples |
| GET | `/api/v1/databases` | Latest database health checks |
| GET | `/api/v1/ssl` | Certificate expiry checks |
| GET | `/api/v1/alerts` | Recent alerts |
| GET | `/api/v1/logs/stream` | SSE unified event stream; accepts `token` query for EventSource |
| GET | `/api/v1/config` | Current YAML configuration |
| PUT | `/api/v1/config` | Replace YAML configuration and hot reload |

## Realtime

Socket.IO uses the `/ws/socket.io` path and requires the JWT in the connection `auth.token` value. Events include `system:update`, `containers:update`, `endpoints:update`, `alert:new`, `container:event`, and `config:update`.

The unauthenticated health probe is `GET /health`.
