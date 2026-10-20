# 💻 Local Development Guide — VANTA Agency V2.0

Comprehensive manual for setting up, running, testing, and debugging the VANTA Agency development environment.

---

## 1. Prerequisites

- **Node.js**: `v18.0.0` or higher (`v20.x` LTS recommended).
- **Package Manager**: `npm` (v9+ or v10+).
- **Operating System**: Windows, macOS, or Linux.
- **Git**: Installed and configured.
- **Database (Optional for offline dev)**: Local PostgreSQL or cloud Supabase instance. When running offline or without database credentials, the frontend supports `VITE_USE_MOCK=true` or automatic fallback state.

---

## 2. Quick Start

### 2.1 Clone and Setup
```bash
git clone https://github.com/VantaSolution/vanta_agancy.git
cd vanta_agancy
```

### 2.2 Environment Configuration
```bash
# Backend Environment Setup
copy backend\.env.example backend\.env

# Frontend Environment Setup
copy frontend\.env.example frontend\.env
```

---

## 3. Backend Development

### 3.1 Install Dependencies
```bash
cd backend
npm install
```

### 3.2 Initialize Database (Local or Cloud)
```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Run Database Migrations
npm run migrate

# 3. Seed Initial Administrator & Default CMS Content
npm run seed
```

### 3.3 Start Backend Dev Server
```bash
npm run dev
```
The API server will listen on `http://localhost:5000`.

### 3.4 Key Backend Scripts
| Script | Command | Purpose |
|---|---|---|
| `dev` | `npm run dev` | Starts server with live reloads using `ts-node-dev` |
| `build` | `npm run build` | Cleans `dist/`, runs `prisma generate`, and compiles TypeScript |
| `start` | `npm run start` | Executes compiled `dist/server.js` |
| `migrate` | `npm run migrate` | Executes all pending `.sql` migrations in `src/db/migrations/` |
| `seed` | `npm run seed` | Creates default admin account and initial CMS content |
| `test:qa` | `npm run test:qa` | Executes 15 automated pre-launch integration tests |
| `add-admin`| `npm run add-admin` | Interactive CLI to provision new admin accounts |

---

## 4. Frontend Development

### 4.1 Install Dependencies
```bash
cd frontend
npm install
```

### 4.2 Start Frontend Dev Server
```bash
npm run dev
```
The Vite development server will start at `http://localhost:3000` (or `3001` if 3000 is occupied).

### 4.3 Key Frontend Scripts
| Script | Command | Purpose |
|---|---|---|
| `dev` | `npm run dev` | Starts Vite HMR dev server |
| `build` | `npm run build` | Runs `tsc` type check then compiles production bundle to `dist/` |
| `preview`| `npm run preview` | Serves local production build from `dist/` |

---

## 5. Running the QA & Test Suite

Run the full pre-launch verification suite:

```bash
# In backend/
npm run test:qa
```

This automated suite executes 15 tests covering:
1. `GET /health` service health check.
2. `GET /api/content` CMS query.
3. `GET /api/settings` agency settings.
4. `GET /api/services` active services.
5. `GET /api/projects` published portfolio items.
6. `POST /api/messages` validation (rejects invalid payload).
7. `POST /api/messages` validation (rejects empty/whitespace fields).
8. `POST /api/messages` validation (rejects invalid email formats).
9. `POST /api/auth/login` security (rejects invalid credentials with 401).
10. `POST /api/auth/login` rate limiting (enforces 10 req/15 min limit).
11. `GET /api/media` access control (rejects unauthenticated requests with 401).
12. `POST /api/media` access control (rejects unauthorized uploads with 401).
13. `PUT /api/content` access control (rejects unauthenticated CMS edits with 401).
14. Unknown route handling (returns structured 404 JSON).
15. Stack trace protection (verifies `stack` is redacted in production responses).

---

## 6. Common Development Issues & Solutions

### Issue 1: Windows PowerShell Execution Policy Error
**Symptom**: `File .../npm.ps1 cannot be loaded because running scripts is disabled on this system.`  
**Solution**: Use `npm.cmd` instead of `npm`, or run:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Issue 2: Port 5000 / 3000 Collision
**Symptom**: `EADDRINUSE: address already in use :::5000`  
**Solution**: Change `PORT=5001` in `backend/.env` and update `VITE_API_URL=http://localhost:5001/api` in `frontend/.env`.

### Issue 3: Working Completely Offline Without Database
**Solution**: Set `VITE_USE_MOCK=true` in `frontend/.env`. The frontend will use mock data stores with full interactive capabilities (login, CRUD simulation, contact form) without needing a database connection.
