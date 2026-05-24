# Configuration Reference

Orbit reads `orbit.config.yaml` on startup and checks for changes every two seconds.

```yaml
orbit:
  name: "My Server"
  theme: dark
  refresh_interval: 10

docker:
  enabled: true
  socket: /var/run/docker.sock

apps:
  - name: "Website"
    url: https://example.com
    health_endpoint: /health
    ping_interval: 30
    expected_status: 200
    tags: [production]

endpoints:
  - name: "Search"
    url: https://example.com/api/search
    method: GET
    ping_interval: 30
    alert_on_latency_ms: 1500

databases:
  - name: "Cache"
    type: redis
    uri: redis://redis:6379
    ping_interval: 30

ssl:
  domains:
    - domain: example.com
  check_interval: 3600
  warn_days_before: 14

alerts:
  webhook_url:
  email:
```

## Keys

`apps` are HTTP health checks assembled from `url` and `health_endpoint`. `endpoints` monitor an exact URL and may define `method`, expected response status, and a latency warning threshold.

`databases[].type` accepts `mongodb`, `redis`, or `postgres`. URIs remain on the backend and are never returned by the API.

`ssl.domains` contains TLS hostnames and optional `port` values. A certificate becomes degraded at `warn_days_before`.

`docker.enabled: false` disables Docker initialization entirely.

`alerts.webhook_url` receives JSON alert notifications when an endpoint changes to down or Docker reports a critical event. The `email` field is retained for configuration compatibility; email delivery requires a future SMTP/provider integration.
