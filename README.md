# Appointment Scheduler

Scheduler is a work-in-progress appointment scheduling app with a Next.js frontend and a FastAPI backend. The current codebase is a lightweight scaffold: the frontend shows a backend status message, and the backend exposes a simple root endpoint for local development.

## What’s in the repo

- `client/` - Next.js app router frontend built with TypeScript, Tailwind CSS, and Axios
- `server/` - FastAPI backend with CORS configured for local development
- `docs/` - project notes and supporting documentation

## Current behavior

- The frontend loads `http://127.0.0.1:8000/` on startup and displays the backend response
- The backend responds at `/` with `{ "message": "AI Scheduler Backend Running" }`
- CORS currently allows requests from `http://localhost:3000`

## Tech stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Backend: FastAPI, Python, Pydantic, SQLAlchemy-ready environment
- Tooling: ESLint, PostCSS, uvicorn

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

## Project status

The repository is currently a foundation for a scheduling product. The README and code can grow together as features land, such as authentication, appointment CRUD, availability rules, calendar sync, reminders, and AI-assisted slot suggestions.

## Next steps

1. Add environment variable examples for the client and server.
2. Document the API routes as they are added.
3. Replace the placeholder frontend with the first real scheduling flow.

## License

MIT License if one is added to the repository.