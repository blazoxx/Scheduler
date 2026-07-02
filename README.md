# Appointment Scheduler

Appointment Scheduler is a full-featured appointment booking platform designed for service providers, consultants, and creators who want a simple way to let clients book time without the friction of back-and-forth messages. The application combines a polished booking experience, a host dashboard, and automated email notifications to support the full lifecycle of an appointment.

## What this project does

This project allows a host to share a booking page where guests can:

- choose a date and available time slot
- enter their name and email
- provide a meeting title
- submit a booking request or confirm a reschedule

On the host side, the app provides a dashboard where the host can:

- view upcoming and pending appointments
- review booking requests
- approve or reject requests
- cancel or reschedule existing appointments
- manage booking links and availability

The platform also sends email updates at each important stage so both the guest and host stay informed.

## How it works

### 1. Guest booking flow

A guest visits a public booking page, selects a date and slot, and submits their details. The booking request is processed through the client application and saved through the backend integration layer. If the appointment is being rescheduled, the existing booking is linked so the system can preserve context.

### 2. Host management flow

The host uses a dashboard to review and manage appointments. From there, they can approve a request, reject it, cancel it, or reschedule it. These actions update the appointment state and trigger the appropriate email notifications.

### 3. Email communication

The app uses email templates for key events such as:

- booking request received
- booking approved
- booking rejected
- booking cancelled
- booking rescheduled

These templates are built for both the guest and host experience and are routed through the email delivery layer.

### 4. AI-assisted scheduling support

The project also includes AI-related helpers for identifying suitable time slots and generating scheduling suggestions based on availability logic. This makes the booking experience more intelligent and reduces manual effort when planning availability.

## Project structure

- `client/` - Next.js frontend with the booking pages, dashboard, forms, shared UI components, and email templates
- `server/` - FastAPI backend services and API endpoints that support scheduling workflows
- `docs/` - project notes and supporting documentation

## Current progress

The current build includes:

- public booking flow for guests with date and time selection
- host dashboard and booking management views
- appointment creation, rescheduling, and cancellation workflows
- email notifications for booking requests, approvals, rejections, cancellations, and reschedules
- AI-assisted scheduling support for suggested availability and slot generation
- signup/login UI and booking history experience

## Tech stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Backend: FastAPI, Python
- Integrations: Supabase-style data access, email delivery, AI scheduling helpers
- Tooling: ESLint, PostCSS, TypeScript, uvicorn

## Local setup

### 1. Start the backend

```bash
cd server
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

### 2. Start the frontend

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## Development scripts

### Client

- `npm run dev` - start the Next.js dev server
- `npm run build` - build the production bundle
- `npm run start` - run the production build
- `npm run lint` - run ESLint

### Server

- `uvicorn main:app --reload` - start the FastAPI dev server

## Upcoming work

The next milestones for the project are:

- 📅 Google Calendar + `.ics`
- 🎨 Email layout and templates polish
- 💬 Toasts, dialogs, and loading states
- 📱 Responsive UI
- 🌍 Domain setup, Resend verification, and Vercel deployment
- 🧪 End-to-end testing and bug fixing

## Status

The project is now in a feature-rich MVP stage, with the core scheduling experience implemented and several polish and deployment improvements planned next.

## License

MIT License if one is added to the repository.