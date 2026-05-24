# Contributing to Orbit

Thanks for helping make self-hosted monitoring more approachable.

## Development

1. Copy `.env.example` to `.env` and configure local credentials.
2. Start both applications with `docker compose up --build`.
3. Keep frontend TypeScript strict and avoid untyped values.
4. Add Pydantic response schemas for new API responses.
5. Keep Docker support optional and preserve empty/offline UI states.

## Pull Requests

- Keep changes focused and document new configuration keys.
- Run frontend type checks/build and compile or test Python changes.
- Never commit production passwords, API keys, webhook URLs, or database URIs.

By contributing, you agree that your contribution is licensed under the MIT License.
