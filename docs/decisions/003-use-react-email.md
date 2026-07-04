# ADR-003: Use React Email

## Status
Accepted

## Date
YYYY-MM-DD

## Context

The application sends multiple transactional emails with shared layouts and reusable components.

## Decision

Build email templates using React Email.

## Alternatives Considered

- HTML templates
- MJML
- Handwritten email strings

## Consequences

### Advantages

- Component reuse
- Type safety
- Shared layouts
- Easier maintenance

### Trade-offs

- Additional dependency
- Learning React Email APIs

## Future Considerations

Shared branding can evolve without rewriting every email.