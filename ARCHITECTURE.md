# Architecture

## Overview

Scheduler is a full-stack appointment scheduling platform built around **Next.js**, **Supabase**, and a lightweight **FastAPI** service. The system follows a modular architecture where the frontend handles the user experience, API routes orchestrate business logic, Supabase manages persistent data, and dedicated services provide notifications, calendar integration, and AI-assisted scheduling.

The architecture is designed with the following goals:

- Modular service separation
- Reusable business logic
- Secure server-side operations
- Extensibility for future AI capabilities
- Independent deployment of services

---

## System Architecture

```text
                Guest / Host
                     │
                     ▼
        Next.js Frontend (App Router)
                     │
                     ▼
      Next.js API Route Handlers
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   Supabase     Email Service   Calendar Service
(Database/Auth)    (Resend)     (Google / ICS)
                     │
                     ▼
               Notification Flow

                     │
                     ▼
              FastAPI AI Services
```

---

## Core Components

### 1. Frontend

The frontend is built using **Next.js App Router** and React.

Its responsibilities include:

- Public booking pages
- Host dashboard
- Appointment management
- Availability management
- Authentication flows
- Booking status updates
- Email template previews
- Calendar interactions

Key directories:

```text
client/
├── app/
├── src/
│   ├── components/
│   ├── lib/
│   └── utils/
```

---

### 2. API Layer

Business operations are exposed through **Next.js Route Handlers** located under:

```text
client/app/api/
```

These endpoints coordinate the application's core business logic, including:

- Creating appointments
- Updating booking status
- Retrieving available time slots
- Generating calendar information
- Triggering email notifications

Keeping business logic inside server-side route handlers prevents privileged operations from being exposed to the client.

---

### 3. FastAPI Service

The project includes a lightweight **FastAPI** backend located in:

```text
server/
```

It currently serves as the foundation for AI-powered scheduling utilities and future backend services.

Planned responsibilities include:

- AI slot generation
- Scheduling recommendations
- Availability optimization
- External integrations

Separating AI services from the frontend keeps computational workloads isolated and allows independent scaling.

---

### 4. Data Layer

Persistent storage is managed by **Supabase**.

The platform stores:

- Appointments
- Availability records
- Host profiles
- Authentication data
- Scheduling metadata

Two Supabase clients are used:

- **Client SDK** for authenticated frontend operations
- **Admin SDK** for privileged server-side actions

This separation ensures sensitive database operations remain secure.

---

### 5. Notification Service

Email notifications are centralized through a dedicated service layer using **Resend**.

Templates are available for:

- Booking requested
- Booking approved
- Booking rejected
- Booking cancelled
- Booking rescheduled

This abstraction keeps email delivery independent from business logic and promotes template reuse.

---

### 6. Calendar Service

Calendar integration is handled through a dedicated service responsible for:

- Google Calendar link generation
- ICS file generation
- JWT-based calendar token handling
- Meeting link support

These features allow users to easily import confirmed appointments into their preferred calendar applications.

---

### 7. AI Scheduling Module

Scheduler includes AI-assisted scheduling utilities that enhance the booking experience.

Current and planned capabilities include:

- Intelligent slot generation
- Scheduling recommendations
- Availability optimization
- Conversational scheduling assistance

The AI module is intentionally isolated so new models or providers can be introduced without modifying the core booking workflow.

---

## Request Lifecycle

A typical booking request follows this sequence:

1. A guest selects an available time slot.
2. The frontend submits the booking request to a Next.js API route.
3. The API validates the request.
4. Appointment data is stored in Supabase.
5. Availability is updated accordingly.
6. Notification emails are sent to both the host and guest.
7. Calendar links or ICS files are generated if applicable.
8. The booking status is returned to the frontend.

---

## Project Structure

```text
Scheduler
│
├── client/
│   ├── app/
│   │   ├── api/
│   │   └── ...
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── utils/
│   └── ...
│
├── server/
│   ├── main.py
│   └── ai/
│
└── supabase/
```

---

## Deployment Architecture

| Component | Deployment |
|-----------|------------|
| Frontend | Vercel |
| API Routes | Vercel Serverless Functions |
| FastAPI Service | Render / Railway / Fly.io |
| Database & Authentication | Supabase |
| Email Service | Resend |
| Calendar Integration | Google Calendar + ICS |

The services are designed to be deployed independently, allowing each layer to scale according to demand.

---

## Design Principles

The architecture follows several core principles:

- **Separation of Concerns** – UI, business logic, data access, notifications, calendar integration, and AI services are isolated into dedicated layers.
- **Security** – Privileged operations execute only on trusted server environments.
- **Modularity** – Components are organized as reusable services with clearly defined responsibilities.
- **Extensibility** – New integrations and AI capabilities can be added without restructuring the application.
- **Scalability** – Frontend, backend, AI services, and supporting infrastructure can be deployed and scaled independently.