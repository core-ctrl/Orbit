# Getting Started

## Prerequisites

- Docker Engine with Docker Compose
- A writable directory for Orbit's SQLite volume
- Docker socket access only if container monitoring is desired

## Local Installation

```bash
cp .env.example .env
# Edit .env with a strong ORBIT_SECRET and ORBIT_ADMIN_PASSWORD.
# Edit ../Orbit-Backend/orbit.config.yaml as needed.
docker compose up -d --build
```

The frontend listens at `http://localhost:3001` and the backend at `http://localhost:8000`.

The default configuration checks the Orbit backend itself. Empty endpoints, databases, and SSL domains are valid, so a fresh install starts without external dependencies.

## Backend On Another Host

Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` before building the frontend. The variables are included in the Next.js browser bundle at build time.

On the backend, set:

```dotenv
ORBIT_CORS_ORIGINS=https://your-frontend.example.com
ORBIT_SECRET=a-long-random-secret
ORBIT_ADMIN_PASSWORD=a-strong-password
```

## Persistence

By default metrics and alerts are stored in `orbit-data` as SQLite data. To use PostgreSQL, set `DATABASE_URL=postgresql://user:password@host/database`.
