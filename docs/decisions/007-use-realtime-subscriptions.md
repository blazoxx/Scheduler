# ADR-007: Use Supabase Realtime

## Status
Accepted

## Date
YYYY-MM-DD

## Context

Hosts should immediately see booking updates without refreshing the dashboard.

## Decision

Use Supabase Realtime subscriptions.

## Alternatives Considered

- Polling
- WebSockets
- Manual refresh

## Consequences

### Advantages

- Instant updates
- Better UX
- Reduced polling

### Trade-offs

- Subscription lifecycle management
- Additional client complexity

## Future Considerations

Realtime analytics and notifications.