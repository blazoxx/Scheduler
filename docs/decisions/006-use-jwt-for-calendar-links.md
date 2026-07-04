# ADR-006: Use JWT for Calendar Download Links

## Status
Accepted

## Date
YYYY-MM-DD

## Context

Calendar downloads should work without authentication while preventing users from accessing other appointments.

## Decision

Generate signed JWT tokens containing the appointment identifier.

## Alternatives Considered

- Appointment ID in URL
- Database-stored random tokens

## Consequences

### Advantages

- Stateless verification
- Secure downloads
- Token expiration
- No additional database tables

### Trade-offs

- Secret management
- Token verification overhead

## Future Considerations

Support one-time-use tokens if required.