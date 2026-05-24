# Docker Setup

Orbit talks directly to Docker Engine through the Docker SDK. For a Linux Docker host, mount the socket into the backend container:

```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock
```

When the socket is not mounted or `docker.enabled` is `false`, the API remains available and the frontend suppresses container navigation.

## Collected Container Data

Orbit reports image, state, health, CPU, memory, network and block I/O counters, restart count, start time, published ports, and environment entries. Environment variables with names containing `password`, `secret`, `token`, `key`, or `credential` are redacted in responses.

## Security

Access to the Docker socket is effectively administrative access to the host. Limit who can access Orbit, use a strong admin password, secure the frontend/backend network paths, and never expose the backend API publicly without TLS and suitable perimeter controls.
