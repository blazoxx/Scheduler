# ADR-010: Use a Layered Email Template Architecture

## Status
Accepted

## Date
YYYY-MM-DD

## Context

The Scheduler application sends multiple transactional emails throughout the booking lifecycle, including:

- Booking Requested
- Booking Approved
- Booking Rejected
- Booking Cancelled
- Booking Rescheduled

Without a structured architecture, each email template would duplicate common elements such as branding, typography, appointment details, headers, and footers. This duplication would increase maintenance effort and make visual consistency difficult to maintain as the application grows.

## Decision

Adopt a layered email architecture with clear separation of responsibilities.

```
Notification Service
        │
        ▼
Email Templates
        │
        ▼
Shared Layout
        │
        ▼
Reusable Components
```

The responsibilities are divided as follows:

- **notifications.ts**
  - Determines which email should be sent.
  - Passes the required data to the appropriate template.
  - Contains no presentation logic.

- **Email Templates**
  - Define the content for each email type.
  - Compose reusable components.
  - Do not perform business logic.

- **Shared Layout**
  - Provides consistent branding.
  - Defines typography, spacing, footer, and overall structure.

- **Reusable Components**
  - Encapsulate repeated UI such as appointment details, buttons, badges, and future shared elements.

## Alternatives Considered

### Independent HTML templates

- Simple initially
- High code duplication
- Difficult to maintain

### Single monolithic email component

- Minimal file count
- Poor separation of concerns
- Hard to extend for new email types

### Template inheritance using string replacement

- Familiar approach
- Less type-safe
- Reduced component reusability

## Consequences

### Advantages

- Consistent branding across all emails
- Reduced code duplication
- Reusable components
- Easier maintenance
- Better scalability as new notification types are introduced
- Strong separation between business logic and presentation

### Trade-offs

- Slightly more files
- Initial architectural overhead
- Requires maintaining shared component interfaces

## Future Considerations

Potential future enhancements include:

- Theme support (light/dark branding)
- Localization and multi-language emails
- Shared CTA components
- Email analytics
- Calendar action buttons
- Dynamic branding for white-label deployments