# ADR-002: Use Supabase

## Status
Accepted

## Date
YYYY-MM-DD

## Context

The project requires authentication, PostgreSQL, realtime updates, and secure row-level access while minimizing backend infrastructure.

## Decision

Use Supabase as the backend platform.

## Alternatives Considered

- Firebase
- MongoDB + Express
- PostgreSQL + Prisma

## Consequences

### Advantages

- Managed PostgreSQL
- Authentication
- Realtime subscriptions
- Row Level Security
- Minimal backend code

### Trade-offs

- Vendor dependency
- Requires understanding RLS policies

## Future Considerations

Can migrate to self-hosted PostgreSQL if needed.