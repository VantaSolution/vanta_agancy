# VANTA — Digital Studio (V2.0)

A high-performance digital agency platform engineered with React 19, Vite, Tailwind CSS v4, Express REST API, Prisma ORM, and Supabase PostgreSQL.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Vite |
| **Backend API** | Node.js, Express, TypeScript, Vercel Serverless Function |
| **Database** | PostgreSQL (Supabase / Managed Postgres) via `pg.Pool` & Prisma ORM |
| **Storage** | Supabase Storage (`vanta-media` bucket) via `@supabase/supabase-js` |
| **Authentication**| JWT (Access & Refresh Tokens) with Bcrypt password hashing |
| **Security** | Helmet HTTP Headers, Express Rate Limiting, CORS, Input Sanitization |
| **Design & Typography** | Modern dark theme with Cairo Google Font & Egyptian Arabic localization |

---

## 📁 Repository Structure

```text
vanta_agancy/
├── frontend/                     # Project 1: Vite + React 19 SPA
│   ├── public/                   # Static assets, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── api/                  # Axios HTTP client & API endpoints
│   │   ├── components/           # Public section components (Hero, Services, Portfolio...)
│   │   ├── context/              # AuthContext & WebsiteContext (Reactive CMS Binding)
│   │   ├── data/                 # Default Egyptian Arabic fallback content
│   │   ├── pages/                # Public HomePage, LoginPage, & 7 Admin Pages
│   │   └── styles/               # CSS Design System
│   ├── package.json
│   ├── package-lock.json
│   ├── vercel.json               # Security headers & SPA client routing rewrites
│   └── vite.config.ts
├── backend/                      # Project 2: Express + TypeScript REST API
│   ├── api/                      # Vercel serverless function entrypoint (index.ts)
│   ├── prisma/                   # Prisma ORM schema & configuration
│   ├── scripts/                  # Pre-launch QA automated suite & Admin tools
│   ├── src/
│   │   ├── config/               # Zod env parser & PostgreSQL connection pool
│   │   ├── db/                   # SQL migrations & database seed scripts
│   │   ├── middlewares/          # JWT auth, rate limiters, error handling
│   │   ├── routes/               # Modular REST routes (auth, content, projects...)
│   │   ├── utils/                # Password hashing, JWT utils, Winston logger
│   │   ├── app.ts                # Express application configuration
│   │   └── server.ts             # Standalone HTTP server for local development
│   ├── package.json
│   ├── package-lock.json
│   ├── vercel.json               # Serverless function routing rules
│   └── tsconfig.json
├── docs/                         # Project Documentation
│   ├── ARCHITECTURE.md           # System topology, data flow, resilience models
│   ├── DEVELOPMENT.md            # Local development, environment setup, testing
│   ├── DEPLOYMENT.md             # Vercel two-project deployment & environment matrix
│   └── PRODUCTION_CHECKLIST.md   # Pre-launch sign-off matrix & launch criteria
├── .env.example                  # Environment template with harmless placeholders
├── .gitignore                    # Git tracking rules (excludes secrets & build outputs)
├── SECURITY.md                   # Security guidelines & vulnerability policies
└── README.md                     # Project overview and index
```

---

## ⚡ Quick Start

### 1. Environment Setup
```bash
# Backend setup
copy backend\.env.example backend\.env

# Frontend setup
copy frontend\.env.example frontend\.env
```

### 2. Backend Initialization
```bash
cd backend
npm install
npx prisma generate
npm run dev
# Server listens at http://localhost:5000
```

### 3. Frontend Initialization
```bash
cd frontend
npm install
npm run dev
# Client runs at http://localhost:3000
```

---

## 🧪 Automated Testing

Run the full pre-launch integration test suite:

```bash
cd backend
npm run test:qa
```
*Executes 15 integration tests verifying health checks, CMS queries, rate limiters, input validation, authentication guards, and stack trace suppression.*

---

## 📖 Documentation Index

For in-depth operational and architectural details, refer to the documents in `docs/`:

- [docs/ARCHITECTURE.md](file:///c:/Users/mostafa/Desktop/Agancy%20V%202.0/docs/ARCHITECTURE.md) — Comprehensive architectural blueprint, middleware pipeline, and data flow.
- [docs/DEVELOPMENT.md](file:///c:/Users/mostafa/Desktop/Agancy%20V%202.0/docs/DEVELOPMENT.md) — Local development workflow, common issues, and test automation.
- [docs/DEPLOYMENT.md](file:///c:/Users/mostafa/Desktop/Agancy%20V%202.0/docs/DEPLOYMENT.md) — Step-by-step Vercel deployment, environment variable matrix, and rollback strategy.
- [docs/PRODUCTION_CHECKLIST.md](file:///c:/Users/mostafa/Desktop/Agancy%20V%202.0/docs/PRODUCTION_CHECKLIST.md) — Pre-launch verification matrix and production sign-off criteria.
- [SECURITY.md](file:///c:/Users/mostafa/Desktop/Agancy%20V%202.0/SECURITY.md) — Vulnerability reporting policy and security hardening measures.
