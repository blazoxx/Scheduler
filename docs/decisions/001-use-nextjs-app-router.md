# ADR-001: Use Next.js App Router

## Status
Accepted

## Date
YYYY-MM-DD

## Context

The Scheduler application requires server-rendered pages, API endpoints, server components, and seamless deployment on Vercel.

## Decision

Use Next.js App Router as the primary application framework.

## Alternatives Considered

### React + Express

- More configuration
- Separate frontend and backend
- Manual API integration

### Next.js Pages Router

- Mature ecosystem
- Older routing model
- Less aligned with modern Next.js features

## Consequences

### Advantages

- Unified frontend and backend
- Server Components
- Route Handlers
- Optimized deployment on Vercel

### Trade-offs

- App Router learning curve
- Rapidly evolving ecosystem

## Future Considerations

Can migrate individual features without changing application architecture.