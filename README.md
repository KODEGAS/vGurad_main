# vGurad_main

[![Deno CI](https://github.com/Maleesha101/vGurad_main/actions/workflows/deno.yml/badge.svg)](https://github.com/Maleesha101/vGurad_main/actions/workflows/deno.yml)

A full‑stack monorepo featuring:
- Frontend: Vite + React + TypeScript with shadcn/ui, Radix UI, TanStack Query, and Three.js (react-three/fiber).
- Backend: Node.js + Express (v5) + TypeScript with MongoDB via Mongoose and Google Generative AI (Gemini) integration.

This README documents how to develop, run, build, and contribute to the project.

---

## Project Structure

```
.
├─ frontend/              # Vite React TypeScript app (shadcn/ui, Radix, TanStack Query, Three.js)
│  └─ package.json
├─ backend/               # Node/Express TypeScript API server (Mongoose, Gemini API)
│  └─ package.json
└─ .github/
   └─ workflows/
      └─ deno.yml         # Deno lint/test workflow (repository CI)
```

---

## Tech Stack

- Frontend:
  - React 18, TypeScript, Vite
  - shadcn/ui, Radix UI primitives
  - TanStack React Query
  - react-three/fiber and @react-three/drei for 3D
  - Additional: react-hook-form, lucide-react, next-themes, axios, etc.

- Backend:
  - Node.js, Express v5, TypeScript
  - Mongoose (MongoDB)
  - Google Generative AI (Gemini) via @google/generative-ai
  - axios, cors, dotenv, nodemon, ts-node, typescript

---

## Prerequisites

- Node.js 18+ (20 LTS recommended)
- npm (or yarn/pnpm) – examples below use npm
- A running MongoDB instance (local or hosted, e.g., MongoDB Atlas)
- (Optional, if used) Google Generative AI API key (Gemini)

---

## Environment Variables

Create a .env file in backend/ with the following values:

```
# backend/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vgurad
# Optional if Gemini features are used:
GEMINI_API_KEY=your_google_generative_ai_key
```

Adjust values as needed for your environment.

---

## Installation

Install dependencies for both apps:

```bash
# From repository root

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## Development

Run frontend and backend in separate terminals:

```bash
# Terminal 1: Backend (TypeScript via ts-node)
cd backend
npm run dev
# Starts Express server (reads backend/.env)

# Terminal 2: Frontend (Vite dev server)
cd frontend
npm run dev
# Opens Vite dev server with React app
```

- Backend key scripts:
  - npm run dev – nodemon + ts-node on src/app.ts
  - npm run build – compile TypeScript to dist/
  - npm run start – run compiled app via node dist/app.js
  - npm run seed – run src/seeder.ts to seed initial data (ensure DB connection)

- Frontend key scripts:
  - npm run dev – Vite dev server
  - npm run build – production build
  - npm run preview – preview production build
  - npm run lint – lint frontend codebase

---

## Building for Production

```bash
# Backend
cd backend
npm run build
npm run start   # serves compiled dist/app.js

# Frontend
cd ../frontend
npm run build
npm run preview # optional local preview of production build
```

Deploy the compiled backend (backend/dist) to your server environment and serve the frontend build (frontend/dist) via your preferred static host (or reverse proxy both behind a single domain).

---

## API

The backend is an Express v5 TypeScript server using Mongoose. Typical patterns include:

- Configuration via backend/.env
- CORS enabled for the frontend
- Axios for upstream calls
- Optional Google Generative AI usage via @google/generative-ai

Base URL (local example): http://localhost:5000 (or the PORT you set)

Note: Endpoints and request/response schemas depend on the implementation in src/. Check backend/src for routes and controllers. A common pattern is to include a health endpoint such as /health or /api/health.

---

## Database Seeding

A seeding script is available:

```bash
cd backend
npm run seed
```

Ensure MONGODB_URI is set and reachable before running.

---

## UI and Components

- shadcn/ui with Radix primitives for accessible and composable UI
- Three.js via react-three/fiber and @react-three/drei for 3D scenes and helpers
- Theming via next-themes
- Forms via react-hook-form and @hookform/resolvers
- Data fetching/caching via @tanstack/react-query

Refer to frontend/src for components, pages, and styles.

---

## Continuous Integration

This repository includes a workflow at .github/workflows/deno.yml which runs Deno lint and tests. While primarily a Node/React repo, the workflow can be used for Deno scripts or kept as a lint/test gate if applicable.

Badge: See the top of this README.

---

## Scripts Reference

- Backend:
  - dev: nodemon --exec ts-node src/app.ts
  - build: tsc
  - start: node dist/app.js
  - seed: ts-node src/seeder.ts

- Frontend:
  - dev: vite
  - build: vite build
  - build:dev: vite build --mode development
  - preview: vite preview
  - lint: eslint .

---

## Troubleshooting

- Ensure Node 18+ and a working MongoDB connection (MONGODB_URI).
- If Gemini features are used, set GEMINI_API_KEY and verify quota and access.
- For CORS issues in local development, verify backend CORS configuration and frontend dev server origin.

---

## Contributing

1. Fork the repository
2. Create a feature branch: git checkout -b feat/your-feature
3. Commit changes: git commit -m "feat: add your feature"
4. Push branch: git push origin feat/your-feature
5. Open a Pull Request

Please follow conventional commit messages where possible.

---

## License

No license file detected. If you plan to use or distribute this code, please add a LICENSE file to clarify terms.

---

## Acknowledgments

- React, Vite, TypeScript
- shadcn/ui, Radix UI
- TanStack React Query
- Three.js ecosystem: react-three/fiber, @react-three/drei
- Express, Mongoose
- Google Generative AI (Gemini)
- axios, dotenv, nodemon, ts-node, typescript
