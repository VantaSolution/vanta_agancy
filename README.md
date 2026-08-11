# VANTA — Digital Studio (V2.0)

A high-performance agency website with a reactive private admin control panel, built using modern web standards, Express REST API, Prisma ORM, and Supabase PostgreSQL.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Vite |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM |
| **Database** | Supabase PostgreSQL |
| **Authentication** | JWT (Access & Refresh Tokens) with Bcrypt password hashing |
| **Security** | Helmet HTTP Headers, Express Rate Limiting, CORS |

---

## 📁 Repository Structure

```text
vanta-agency/
├── frontend/             # Vercel Project 1 (Root Directory: frontend)
│   ├── package.json
│   ├── vercel.json       # SPA client route rewrites
│   ├── src/
│   └── ...
├── backend/              # Vercel Project 2 (Root Directory: backend)
│   ├── package.json
│   ├── vercel.json       # Serverless function entrypoint route
│   ├── api/index.ts      # Vercel serverless function entrypoint
│   ├── prisma/           # Schema & migrations
│   ├── src/
│   └── ...
├── .gitignore
├── DEPLOYMENT.md
├── SECURITY.md
└── README.md
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

### 2. Backend Initialization
```bash
cd backend
npm install
npx prisma generate  # Generate Prisma Client
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

## 🚀 Two-Vercel-Project Deployment Workflow

This single GitHub repository (`VantaSolution/vanta_agancy`) is deployed to Vercel as **two independent Vercel projects**.

---

### Project 1: VANTA Backend API

1. Go to [Vercel Dashboard → New Project](https://vercel.com/new).
2. Select repository: `VantaSolution/vanta_agancy`.
3. Configure Project Settings:
   - **Project Name**: `vanta-backend`
   - **Framework Preset**: `Other`
   - **Root Directory**: `backend` *(Click Edit and select `backend`)*
   - **Build Command**: `prisma generate && tsc`
4. Add **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=postgresql://postgres.your-ref:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
   DIRECT_URL=postgresql://postgres.your-ref:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:5432/postgres
   JWT_SECRET=your_long_random_jwt_access_secret_min_16_chars
   JWT_REFRESH_SECRET=your_long_random_jwt_refresh_secret_min_16_chars
   CORS_ORIGIN=https://vanta-frontend.vercel.app
   ADMIN_EMAIL=admin@vanta.studio
   ADMIN_PASSWORD=your_strong_admin_password
   ```
5. Click **Deploy**.
6. Copy your deployed backend URL (e.g. `https://vanta-backend.vercel.app`).

---

### Project 2: VANTA Frontend Application

1. Go to [Vercel Dashboard → New Project](https://vercel.com/new).
2. Select repository: `VantaSolution/vanta_agancy`.
3. Configure Project Settings:
   - **Project Name**: `vanta-frontend`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` *(Click Edit and select `frontend`)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables**:
   ```env
   VITE_API_URL=https://vanta-backend.vercel.app/api
   VITE_USE_MOCK=false
   ```
5. Click **Deploy**.

---

## 🧪 Live API Verification

Verify your live backend deployment with Node.js:

```bash
node -e "fetch('https://vanta-backend.vercel.app/api/content').then(async r => console.log('Live Vercel API Status:', r.status, await r.json()))"
```

---

## 📖 Additional Guides

- [DEPLOYMENT.md](file:///c:/Users/mostafa/Desktop/Agancy%20V%202.0/DEPLOYMENT.md) — Production architecture & verification checklist.
- [SECURITY.md](file:///c:/Users/mostafa/Desktop/Agancy%20V%202.0/SECURITY.md) — Security policies & go-live security checklist.
