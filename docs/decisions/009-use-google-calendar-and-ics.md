# ADR-009: Support Google Calendar and ICS

## Status
Accepted

## Date
YYYY-MM-DD

## Context

Users rely on different calendar ecosystems including Google Calendar, Outlook, Apple Calendar, and Thunderbird.

## Decision

Provide both Google Calendar links and downloadable ICS files.

## Alternatives Considered

- Google Calendar only
- ICS only

## Consequences

### Advantages

- Cross-platform compatibility
- Better user experience
- Standards-based calendar integration

### Trade-offs

- Additional implementation effort
- Two integration paths to maintain

## Future Considerations

Support Outlook Calendar, Microsoft Graph, Apple Calendar deep links, and automatic Google Meet creation.