# Testing Guide

## Overview

Scheduler currently relies on a combination of **manual testing**, **integration tests**, and **local verification** to validate core booking functionality. The testing strategy focuses on ensuring that critical user workflows—including booking creation, appointment management, calendar integration, and notifications—work correctly before deployment.

As the project evolves, automated unit and end-to-end testing can be expanded to improve reliability and maintainability.

---

## Testing Strategy

| Test Type | Purpose |
|-----------|---------|
| Manual Testing | Verify complete user workflows through the UI |
| Integration Testing | Validate interactions between services such as calendar generation and notifications |
| API Testing | Verify server endpoints and request handling |
| Future E2E Testing | Validate complete booking flows across the application |

---

## Core Workflow Testing

The following booking lifecycle should be verified for every major release.

### Public Booking

- Public booking page loads successfully
- Available dates are displayed correctly
- Time slots are generated accurately
- Booking form validation works as expected
- Guests can successfully submit booking requests

---

### Host Dashboard

Verify that hosts can:

- View pending appointments
- Approve bookings
- Reject bookings
- Cancel appointments
- Reschedule meetings
- View updated booking statuses

---

### Appointment Lifecycle

Confirm that each booking state transition behaves correctly.

```text
Pending
   │
   ├──► Approved
   │
   ├──► Rejected
   │
   ├──► Cancelled
   │
   └──► Rescheduled
```

Each transition should:

- Update the database
- Refresh the dashboard
- Trigger appropriate notifications
- Generate calendar updates when applicable

---

## Calendar Integration Testing

Verify the following functionality:

- Google Calendar links open correctly
- Generated links contain the correct event information
- ICS files download successfully
- ICS files can be imported into calendar applications
- Calendar event dates and times are accurate

---

## Email Notification Testing

Validate notification delivery for:

- Booking request created
- Booking approved
- Booking rejected
- Booking cancelled
- Booking rescheduled

For each email, verify:

- Correct recipient
- Correct template
- Accurate booking details
- Proper formatting
- Functional calendar links

---

## AI Scheduling Testing

The AI scheduling utilities should be tested against multiple scenarios.

### Expected Behavior

- Generate valid available slots
- Respect host availability
- Avoid scheduling conflicts
- Handle timezone information correctly

### Edge Cases

- No available slots
- Invalid date ranges
- Missing availability data
- Overlapping appointments
- Empty scheduling requests

The AI service should fail gracefully and return meaningful responses for invalid inputs.

---

## Local Development Testing

### Frontend

Start the Next.js development server:

```bash
cd client
npm install
npm run dev
```

Verify:

- Public booking pages
- Host dashboard
- Appointment forms
- Status updates
- Responsive layouts
- Error handling
- Loading states

---

### Backend

Start the FastAPI server:

```bash
cd server
uvicorn main:app --reload
```

Verify:

- Health endpoint
- API responses
- Scheduling endpoints
- Error responses
- AI service endpoints (if applicable)

---

## Existing Test Coverage

The repository currently includes integration-style tests for:

- Google Calendar link generation
- ICS calendar generation
- Calendar utility functions

These tests validate core scheduling utilities independently of the frontend.

---

## Recommended Future Tests

To improve overall reliability, the following automated tests are recommended.

### Unit Tests

- Calendar utilities
- Booking validation logic
- Availability calculations
- Notification helpers
- AI scheduling functions

---

### Integration Tests

- Booking creation
- Appointment approval
- Appointment cancellation
- Email notification workflow
- Calendar generation
- Database operations

---

### End-to-End Tests

Using tools such as Playwright or Cypress:

- Complete booking flow
- Host approval workflow
- Rescheduling process
- Authentication flow
- Calendar generation
- Email notification verification

---

## Pre-Deployment Checklist

Before deploying a new release, verify:

- All environment variables are configured
- Database migrations have been applied
- Email service credentials are valid
- Calendar integrations are functioning
- Booking workflow completes successfully
- Dashboard operations behave correctly
- AI scheduling services respond as expected

Completing this checklist helps ensure the application is production-ready and reduces the likelihood of deployment-related issues.