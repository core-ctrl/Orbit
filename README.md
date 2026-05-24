# ORBIT

Orbit is an open-source, self-hosted monitoring dashboard for applications, endpoints, databases, TLS certificates, servers, and Docker containers. It combines uptime checks, host telemetry, container controls, log streaming, and alerts in one configurable interface.

## Features

- One YAML configuration file with hot reload
- FastAPI backend with JWT admin authentication and Socket.IO live updates
- Host CPU, memory, disk, and network telemetry
- Optional Docker socket integration with stats, redacted environment values, actions, events, and SSE log tailing
- HTTP endpoint latency/history, database pings, and SSL expiry checks
- Draggable/resizable dashboard widgets saved in the browser
- SQLite storage by default; PostgreSQL via `DATABASE_URL`
- Next.js responsive UI with graceful offline and Docker-disabled states

## Repository Layout

This checkout uses sibling folders so the frontend and backend can be deployed independently:

```text
C:\Orbit              # frontend, Compose, docs
C:\Orbit-Backend      # FastAPI backend and orbit.config.yaml
```

In a public Git repository, these can also be placed under one parent directory and the Compose build contexts adjusted accordingly.

## Quick Start

```bash
git clone https://github.com/yourname/orbit.git
cd orbit
cp .env.example .env
# Set ORBIT_SECRET and ORBIT_ADMIN_PASSWORD in .env.
# Edit ../Orbit-Backend/orbit.config.yaml for your services.
docker compose up -d --build
```

Open [http://localhost:3001](http://localhost:3001), then sign in with `ORBIT_ADMIN_PASSWORD`.

Docker monitoring is optional. On Linux, the Compose file mounts `/var/run/docker.sock`. Remove that mount or set `docker.enabled: false` when it is unavailable; Orbit hides container navigation and continues monitoring configured targets.

For local evaluation, Compose can boot without an `.env` file using the password `orbit`; always create `.env` with strong credentials before binding Orbit beyond localhost.

## Separate Deployment

The frontend and backend do not need to share a host. Build the frontend with:

```dotenv
NEXT_PUBLIC_API_URL=https://monitor-api.example.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://monitor-api.example.com
```

Deploy the backend with `ORBIT_CORS_ORIGINS` set to the frontend origin, for example `https://monitor.example.com`, plus strong values for `ORBIT_SECRET` and `ORBIT_ADMIN_PASSWORD`.

## Configuration

Edit `C:\Orbit-Backend\orbit.config.yaml` (or the mounted `/app/orbit.config.yaml`). Changes are detected automatically, or may be saved through the Settings page.

See [Getting Started](docs/getting-started.md), [Configuration Reference](docs/config-reference.md), [Docker Setup](docs/docker-setup.md), and [API Reference](docs/api-reference.md).

## Stack

Frontend: Next.js 15 App Router, strict TypeScript, Tailwind CSS, Recharts, react-grid-layout, Socket.IO client, Zustand, TanStack Query. Orbit uses the patched 15.x release line because current security advisories are not remediated in Next.js 14.

Backend: Python 3.11, FastAPI, python-socketio, Docker SDK, psutil, httpx, SQLAlchemy async, APScheduler, PyYAML, and JWT authentication.

## Security Notes

- Change the default password and secret before exposing Orbit.
- Mounting the Docker socket gives Orbit privileged control over the Docker host. Restrict network access and run only trusted images.
- Secrets in displayed container environment variables are redacted by common sensitive key names; do not treat this as a general secret scanner.

## License

MIT. See [LICENSE](LICENSE).
