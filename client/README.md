# Scheduler Client

This folder contains the Next.js frontend for the Scheduler application. It powers the public booking experience, host dashboard, appointment forms, and scheduling-related UI.

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

## What you will find here

- booking pages for guests
- forms for capturing appointment details
- dashboard views for reviewing and managing bookings
- UI for availability management and booking actions
- integrations for calendar and email-related workflows

## Useful scripts

- npm run dev - start the local development server
- npm run build - build the app for production
- npm run start - run the production build locally
- npm run lint - run ESLint

## Notes

The client app expects its environment variables to be configured for Supabase, email delivery, and any AI or calendar features you enable locally.
