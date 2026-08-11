# VANTA — Digital Studio (V2.0)

A high-performance agency website with a reactive private admin control panel, built using modern web standards and secure REST API backend.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Vite |
| **Backend** | Node.js, Express, TypeScript, Zod |
| **Database** | PostgreSQL |
| **Authentication** | JWT (Access & Refresh Tokens) with Bcrypt password hashing |
| **Security** | Helmet HTTP Headers, Express Rate Limiting, CORS |

---

## 📁 Repository Structure

```text
Agancy V 2.0/
├── frontend/             # React 19 SPA (Public Website + Admin Panel)
├── backend/              # Node.js Express REST API
├── .env.example          # Safe environment variable template
├── DEPLOYMENT.md         # Production deployment guide
└── SECURITY.md           # Security policies & production checklist
```

---

## ⚡ Local Development Setup

### 1. Environment Configuration
Copy environment templates to `.env`:

```bash
# Backend setup
cp backend/.env.example backend/.env

# Frontend setup
cp frontend/.env.example frontend/.env
```

Set your local database credentials and random `JWT_SECRET` keys inside `backend/.env`.

### 2. Backend Initialization
```bash
cd backend
npm install
npm run migrate      # Run database schema migrations
npm run seed         # Create initial admin user & default CMS data
npm run dev          # Starts server on http://localhost:5000
```

### 3. Frontend Initialization
```bash
cd frontend
npm install
npm run dev          # Starts Vite dev server on http://localhost:3000
```

---

## 🔐 Initial Admin Account Setup

Initial admin credentials are created when executing `npm run seed` based on the environment variables defined in `backend/.env`:
- `ADMIN_EMAIL` (default configured in `.env`)
- `ADMIN_PASSWORD` (set your strong secret password in `.env`)

---

## 🚀 Production Build Commands

```bash
# Compile backend TypeScript
cd backend
npm run build        # Outputs to dist/
npm start            # Runs production server

# Build frontend production bundle
cd frontend
npm run build        # Outputs to dist/
npm run preview      # Previews production SPA locally
```

---

## 📖 Additional Guides

- [DEPLOYMENT.md](file:///c:/Users/mostafa/Desktop/Agancy%20V%202.0/DEPLOYMENT.md) — Complete step-by-step production deployment instructions (Vercel/Render/PostgreSQL).
- [SECURITY.md](file:///c:/Users/mostafa/Desktop/Agancy%20V%202.0/SECURITY.md) — Security policies, rate limiting details, and production launch checklist.
