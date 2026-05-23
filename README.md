# DevPulse

DevPulse — Internal Tech Issue & Feature Tracker

Live / Demo URL

- Repository / project page: https://github.com/tanjim-rahat/NLWD-Assignment-2#readme

Project Overview
-- DevPulse is a lightweight issue and feature tracker for internal teams. It supports user registration and authentication, issue creation and management, and role-based access controls.

Key Features

- User signup & login with password hashing (bcrypt)
- Create, view, update, and delete issues
- Role-based restrictions for sensitive operations
- PostgreSQL persistence with automatic table initialization

Tech Stack

- Node.js + TypeScript
- Express 5
- PostgreSQL (`pg`)
- Authentication: `bcrypt`, `jsonwebtoken`
- Dev runner: `tsx`

Quick Setup

1. Clone the repo
   ```bash
   git clone https://github.com/tanjim-rahat/NLWD-Assignment-2.git
   cd NLWD-Assignment-2
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Configure environment
   - Create `src/.env.local` (or `.env`) and set:
     ```env
     DATABASE_URL=postgresql://user:password@host:5432/dbname
     ```
4. Run in development
   ```bash
   npm run dev
   ```

API Endpoints

- Authentication (`/api/auth`)
  - `POST /api/auth/signup` — register a new user
    - Body: `{ name, email, password, role }`
  - `POST /api/auth/login` — authenticate and receive a token
    - Body: `{ email, password }`

- Issues (`/api/issues`)
  - `GET /api/issues` — list issues (supports optional query filters)
  - `GET /api/issues/:id` — get a single issue by id
  - `POST /api/issues` — create an issue (requires auth)
    - Body: `{ title, description, type }` — returns the created row
  - `PATCH /api/issues/:id` — update an issue (requires auth)
  - `DELETE /api/issues/:id` — delete an issue (requires auth and role guard)

Database Schema (summary)

- `users` table
  - `id` SERIAL PRIMARY KEY
  - `name` VARCHAR(255) NOT NULL
  - `email` VARCHAR(255) NOT NULL UNIQUE
  - `password` VARCHAR(255) NOT NULL
  - `role` VARCHAR(50) NOT NULL
  - `created_at`, `updated_at` TIMESTAMP

- `issues` table
  - `id` SERIAL PRIMARY KEY
  - `title` VARCHAR(255) NOT NULL
  - `description` TEXT
  - `type` VARCHAR(50) NOT NULL
  - `status` VARCHAR(50) NOT NULL DEFAULT 'open'
  - `reporter_id` INTEGER REFERENCES users(id)
  - `created_at`, `updated_at` TIMESTAMP

Notes & Recommendations

- `src/database/connection.ts` runs `initDB()` on startup to create tables if missing. Review this behavior before running against a production database.
- TypeScript alias `@` maps to `src/` (see `tsconfig.json`). For runtime resolution when running compiled code, use `tsconfig-paths` or `module-alias` and register it at startup.

Relevant Files

- `src/server.ts` — application entry and route mounting
- `src/modules/auth` — auth routes and controllers
- `src/modules/issues` — issue routes and controllers
- `src/database/connection.ts` — DB pool and initialization

Contact / Repo

- https://github.com/tanjim-rahat/NLWD-Assignment-2
