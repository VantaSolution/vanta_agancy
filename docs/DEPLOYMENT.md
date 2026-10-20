# 🚀 Production Deployment Manual — VANTA Agency V2.0

Comprehensive operations manual for deploying VANTA Agency V2.0 across Vercel, Supabase PostgreSQL, and Supabase Storage.

---

## 1. Hosting Architecture Overview

VANTA Agency V2.0 is structured as a monorepo containing two distinct deployable applications deployed to **Vercel** as two isolated projects:

1. **Vercel Project 1 — Frontend SPA (`vanta-agency-frontend`)**:
   - Framework: React 19 + Vite.
   - Root Directory: `frontend`.
   - Output Directory: `dist`.
   - Build Command: `npm run build`.

2. **Vercel Project 2 — Backend API (`vanta-backend`)**:
   - Framework: Node.js + Express (Serverless Adapter).
   - Root Directory: `backend`.
   - Entry Point: `api/index.ts`.
   - Build Command: `prisma generate && tsc`.

---

## 2. Environment Variables Matrix

| Variable | Application | Secret? | Required? | Purpose & Example | Redeploy Required? |
|---|---|---|---|---|---|
| `NODE_ENV` | Backend | Public | Yes | Set to `production` | Yes |
| `PORT` | Backend | Public | Yes | Set to `5000` | Yes |
| `DATABASE_URL` | Backend | **SECRET** | Yes | Pooled connection string (`...pooler.supabase.com:6543/postgres?pgbouncer=true`) | Yes |
| `DIRECT_URL` | Backend | **SECRET** | Yes | Direct connection string for schema migrations (`...pooler.supabase.com:5432/postgres`) | Yes |
| `JWT_SECRET` | Backend | **SECRET** | Yes | 64+ random characters for signing access tokens | Yes |
| `JWT_REFRESH_SECRET` | Backend | **SECRET** | Yes | 64+ random characters for signing refresh tokens | Yes |
| `JWT_EXPIRES_IN` | Backend | Public | No | Access token TTL (Default: `1h`) | Yes |
| `JWT_REFRESH_EXPIRES_IN` | Backend | Public | No | Refresh token TTL (Default: `7d`) | Yes |
| `CORS_ORIGIN` | Backend | Public | Yes | Deployed frontend origin (e.g., `https://vanta-agency-frontend.vercel.app`) | Yes |
| `ADMIN_EMAIL` | Backend | Public | Yes | Production administrator email (e.g., `admin@vanta.studio`) | Yes |
| `ADMIN_PASSWORD` | Backend | **SECRET** | Yes | High-entropy admin initial password | Yes |
| `SUPABASE_URL` | Backend | Public | Yes | Project URL (`https://yuqcieznapwdtenybqqs.supabase.co`) | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend | **SECRET** | Yes | Privileged server-side key for Storage bucket write access | Yes |
| `SUPABASE_STORAGE_BUCKET` | Backend | Public | Yes | Bucket name (Default: `vanta-media`) | Yes |
| `VITE_API_URL` | Frontend | Public | Yes | Backend API base URL (`https://vanta-backend.vercel.app/api`) | Yes |
| `VITE_USE_MOCK` | Frontend | Public | Yes | Set to `false` for live backend data | Yes |

> [!CAUTION]
> **Security Guardrail**: Never prefix private backend secrets (e.g. `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, or `DATABASE_URL`) with `VITE_`. Frontend bundles are publicly downloadable; any `VITE_` variables are baked into browser client assets.

---

## 3. Step-by-Step Vercel Deployment

### 3.1 Step A: Deploy the Backend API (`vanta-backend`)

1. Open [Vercel Dashboard](https://vercel.com/new).
2. Import the Git repository: `https://github.com/VantaSolution/vanta_agancy`.
3. In Project Configuration:
   - **Project Name**: `vanta-backend`
   - **Framework Preset**: `Other`
   - **Root Directory**: Click *Edit* and select `backend`.
   - **Build Command**: `prisma generate && tsc`
   - **Output Directory**: Leave empty / default.
4. Expand **Environment Variables** and add all Backend variables from the matrix above.
5. Click **Deploy**.
6. When deployment finishes, note the assigned URL (e.g. `https://vanta-backend.vercel.app`).

### 3.2 Step B: Execute Database Migrations & Initial Seed

Before directing traffic to the backend, run migrations against your production database:

```bash
# In your local terminal with production DATABASE_URL and DIRECT_URL set:
cd backend
npm run migrate
npm run seed
```

This creates the tables (`admins`, `projects`, `services`, `messages`, `website_content`, `settings`, `media`) and initializes your production administrator account.

### 3.3 Step C: Configure Supabase Storage

1. Navigate to your Supabase project dashboard -> **Storage**.
2. Create a bucket named `vanta-media`.
3. Set bucket access to **Public** (so project gallery images and media can be retrieved by client browsers via CDN URL).
4. Verify that `SUPABASE_SERVICE_ROLE_KEY` is saved in the Vercel Backend Environment Variables.

### 3.4 Step D: Deploy the Frontend Application (`vanta-agency-frontend`)

1. In Vercel Dashboard, click **Add New Project**.
2. Select `https://github.com/VantaSolution/vanta_agancy`.
3. In Project Configuration:
   - **Project Name**: `vanta-agency-frontend`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables**:
   ```env
   VITE_API_URL=https://vanta-backend.vercel.app/api
   VITE_USE_MOCK=false
   ```
5. Click **Deploy**.

---

## 4. Verification & Smoke Testing

### 4.1 Automated Backend Health Check
```bash
curl -I https://vanta-backend.vercel.app/health
# Expected: HTTP/2 200 OK
```

### 4.2 Content API Verification
```bash
curl -s https://vanta-backend.vercel.app/api/content | head -n 20
# Expected: JSON object with success: true and content sections
```

### 4.3 Edge Security Headers Verification
```bash
curl -I https://vanta-agency-frontend.vercel.app/
# Verify presence of:
# - Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
# - X-Content-Type-Options: nosniff
# - X-Frame-Options: DENY
# - Referrer-Policy: strict-origin-when-cross-origin
```

---

## 5. Rollback Guidance

In the event of an unforeseen production incident:
1. **Instant Vercel Rollback**:
   - Go to Vercel Dashboard -> Project -> **Deployments**.
   - Locate the previous stable deployment commit (e.g., `97a84ac` or `15ab716`).
   - Click the three dots `...` -> **Promote to Production**. Rollback is instantaneous (under 5 seconds) without needing a git revert.
2. **Git Rollback**:
   - Revert commit via `git revert <commit-hash>`.
   - Push to `main` branch: `git push origin main`.
