# Scheduler

> A modern, full-stack appointment scheduling platform for managing meetings from request to confirmation.

Scheduler combines a public booking experience, a host dashboard, automated email notifications, calendar integration, and AI-assisted scheduling into one streamlined workflow.

![Status](https://img.shields.io/badge/status-MVP-yellow)
![Next.js](https://img.shields.io/badge/frontend-Next.js-black)
![FastAPI](https://img.shields.io/badge/backend-FastAPI-009688)
![License](https://img.shields.io/badge/license-unlicensed-lightgrey)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Project Status](#project-status)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### 📅 Public Booking Experience
- View a host's public booking page
- Select an available date and time slot
- Enter contact information
- Add a meeting title or description
- Submit booking requests
- Confirm rescheduled appointments

### 🖥️ Host Dashboard
- View upcoming appointments
- Review pending booking requests
- Approve or reject bookings
- Cancel or reschedule meetings
- Manage availability
- Monitor booking status

### ✉️ Notifications
Automated email notifications are sent for:
| Event | Trigger |
|---|---|
| Booking request | Guest submits a new request |
| Booking approval | Host approves a request |
| Booking rejection | Host rejects a request |
| Booking cancellation | Either party cancels |
| Booking reschedule | Host or guest changes the time |

Email delivery is powered by **Resend** using reusable templates.

### 🗓️ Calendar Integration
- Google Calendar event links
- ICS file generation (Apple Calendar & Outlook compatible)
- Secure calendar token handling

### 🤖 AI-Assisted Scheduling
Powered by the **Gemini API**, the platform can:
- Generate available meeting slots
- Suggest scheduling options
- Optimize availability planning

The AI module is designed to be extensible for future scheduling enhancements.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python |
| Database & Auth | Supabase |
| Email | Resend |
| Calendar | Google Calendar API, ICS files |
| AI | Gemini API |

---

## Project Structure

```text
Scheduler/
├── client/                # Next.js frontend
│   ├── app/                # App Router pages/routes
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── lib/             # Client-side libraries/helpers
│       ├── utils/           # Utility functions
│       └── styles/          # Global styles
│
├── server/                # FastAPI backend
│   ├── main.py              # Application entrypoint
│   └── ai/                  # AI scheduling utilities
│
├── tests/                 # Integration & unit tests
├── docs/                  # Architecture & design docs
└── README.md
```

---

## Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18+ recommended |
| npm | Latest |
| Python | 3.10+ |
| Git | Any recent version |

### 1. Clone the repository

```bash
git clone <repository-url>
cd Scheduler
```

### 2. Set up the backend

```bash
cd server

python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

The API will be available at **http://127.0.0.1:8000** (interactive docs at `/docs`).

### 3. Set up the frontend

```bash
cd client

npm install
npm run dev
```

The app will be available at **http://localhost:3000**.

> 💡 **Tip:** Run the backend and frontend in separate terminal windows/tabs. Start the backend first so API calls from the frontend don't fail on load.

---

## Environment Variables

Copy the example files and fill in your own values before starting the app:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

| Variable | Used By | Description |
|---|---|---|
| `SUPABASE_URL` | Backend & Frontend | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Frontend | Public Supabase API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend | Privileged Supabase API key (keep secret) |
| `CALENDAR_JWT_SECRET` | Backend | Secret used to sign calendar tokens |
| `RESEND_API_KEY` | Backend | API key for sending email via Resend |
| `EMAIL_SENDER_ADDRESS` | Backend | "From" address for outgoing emails |
| `GEMINI_API_KEY` | Backend | API key for Gemini-powered scheduling features |

> ⚠️ Never commit `.env` files. Double-check `.gitignore` covers them before pushing.

---

## Running Tests

```bash
cd tests
pytest
```

Refer to `docs/testing-guide.md` for details on the integration test suite for calendar utilities.

---

## Project Status

Scheduler is currently a **feature-complete MVP** with:

- ✅ Public booking workflow
- ✅ Host dashboard
- ✅ Appointment lifecycle management
- ✅ Email notifications
- ✅ Calendar integration
- ✅ AI-assisted scheduling
- ✅ Integration testing for calendar utilities

**In progress:**
- 🔄 Expanded automated testing
- 🔄 Production deployment
- 🔄 Performance improvements
- 🔄 Additional AI scheduling features

---

## Documentation

Additional docs live in the [`docs/`](./docs) directory:

- [Architecture](./docs/architecture.md)
- [Testing Guide](./docs/testing-guide.md)
- [Design Decisions](./docs/design-decisions.md)
- [Future Enhancements](./docs/future-enhancements.md)

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository and create a feature branch (`git checkout -b feature/my-feature`)
2. Make your changes and add tests where applicable
3. Ensure the test suite passes (`pytest`)
4. Submit a pull request describing your changes

Please open an issue first for major changes so we can discuss the approach.

---

## License

This repository does not currently include a license.

If you intend to distribute or open-source the project, consider adding an appropriate license such as **MIT**, **Apache 2.0**, or **GPL**.