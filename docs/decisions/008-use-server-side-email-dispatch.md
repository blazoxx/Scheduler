# ADR-008: Use Server-Side Email Dispatch

## Status
Accepted

## Date
YYYY-MM-DD

## Context

Email providers require API keys that must remain secure.

## Decision

Send all transactional emails from server-side API routes.

## Alternatives Considered

- Client-side email sending
- Direct SMTP from frontend

## Consequences

### Advantages

- API keys remain secret
- Centralized email logic
- Easier auditing

### Trade-offs

- Slightly increased backend complexity

## Future Considerations

Move email sending to background jobs for improved scalability.