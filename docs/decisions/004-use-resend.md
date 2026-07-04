# ADR-004: Use Resend

## Status
Accepted

## Date
YYYY-MM-DD

## Context

Reliable transactional email delivery is required for booking workflows.

## Decision

Use Resend for email delivery.

## Alternatives Considered

- Nodemailer
- SMTP
- SendGrid
- Mailgun

## Consequences

### Advantages

- Excellent React Email integration
- Modern API
- Simple developer experience

### Trade-offs

- Third-party dependency
- Domain verification required

## Future Considerations

Can add analytics and email tracking later.