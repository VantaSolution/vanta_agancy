# 🚀 Production Deployment Guide — VANTA Agency V2.0

This guide provides step-by-step instructions for deploying **VANTA Agency** to production.

---

## Architecture Overview

- **Frontend**: Single Page Application (React 19 + Vite) deployed to **Vercel**, **Netlify**, or **Cloudflare Pages**.
- **Backend API**: Node.js + Express REST API deployed to **Render**, **Railway**, or **VPS (Ubuntu + PM2/Nginx)**.
- **Database**: Managed PostgreSQL database hosted on **Supabase**, **Neon**, **Railway**, or **AWS RDS**.
- **Storage**: Media uploads served directly via backend `/uploads` or object storage (AWS S3 / Cloudflare R2).

---

## Step 1: Local Preparation & Verification

Before pushing to git or deploying, run local builds to verify zero TypeScript and bundle errors:

```bash
# 1. Verify Backend Compilation
cd backend
npm run build        # Must compile cleanly to dist/

# 2. Verify Frontend Production Build
cd frontend
npm run build        # Must output dist/ without errors
```

---

## Step 2: Source Control & Git Hygiene

1. Ensure `.env` files are ignored by git:
   ```bash
   git status
   ```
   *Confirm that `.env`, `node_modules/`, `dist/`, and `uploads/*` are not staged.*

2. Commit changes to your Git repository:
   ```bash
   git add .
   git commit -m "chore: prepare VANTA agency for production deployment"
   git push origin main
   ```

---

## Step 3: Database Provisioning & Schema Migration

1. **Create Managed Database**:
   - Provision a PostgreSQL database on **Supabase**, **Neon**, or **Railway**.
   - Copy the database Connection URL (or individual parameters: host, port, database, user, password).

2. **Execute Database Migrations**:
   Set environment variables to point to your live PostgreSQL database, then run:
   ```bash
   cd backend
   npm run migrate
   ```
   *This safely creates all required tables (`admins`, `projects`, `services`, `messages`, `website_content`, `settings`, `media`) and indexes.*

3. **Initialize Production Admin & Default Content**:
   ```bash
   cd backend
   npm run seed
   ```
   *This creates your production admin account using `ADMIN_EMAIL` and `ADMIN_PASSWORD` defined in your environment.*

---

## Step 4: Backend API Deployment (e.g., Render / Railway)

### Environment Variables required on Backend Server:
| Variable Name | Value Description |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` (or host assigned `$PORT`) |
| `DB_HOST` | Database host |
| `DB_PORT` | `5432` |
| `DB_NAME` | Database name |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | 64+ char random string |
| `JWT_REFRESH_SECRET` | 64+ char random string |
| `CORS_ORIGIN` | `https://yourdomain.com` (Your production frontend URL) |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Strong secret admin password |

### Deployment Commands:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Health Check Endpoint**: `/health`

---

## Step 5: Frontend SPA Deployment (e.g., Vercel / Netlify)

### Environment Variables required on Frontend Platform:
| Variable Name | Value Description |
|---|---|
| `VITE_API_URL` | `https://api.yourdomain.com/api` (Production API endpoint) |
| `VITE_USE_MOCK` | `false` |

### Platform Settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Single Page Application Rewrite**: Ensure all routes redirect to `/index.html` (for Client-Side Routing).

---

## Step 6: Custom Domain & DNS Setup

1. **Frontend Domain**:
   - Add CNAME record pointing `yourdomain.com` or `www.yourdomain.com` to your frontend provider (e.g. `cname.vercel-dns.com`).
2. **Backend Domain / Subdomain**:
   - Add CNAME record pointing `api.yourdomain.com` to your backend server.
3. **SSL/TLS**:
   - Enable free Let's Encrypt / Automatic SSL on both provider dashboards.

---

## Step 7: Payment Gateway (If Applicable)

- Keep payment provider API private keys strictly on the backend (`STRIPE_SECRET_KEY`, `PAYPAL_SECRET`).
- Set payment webhooks to verify signature server-side.
- Never trust frontend payment status confirmation.

---

## Step 8: Production Verification Checklist

After deployment, test the live application end-to-end:

- [ ] Public site loads without console errors (`https://yourdomain.com`).
- [ ] Navbar dynamic agency name loads from API.
- [ ] Portfolio items and services render live data.
- [ ] Public contact form `/api/messages` submits cleanly.
- [ ] Admin login `/admin/login` works with production admin credentials.
- [ ] Refreshing on admin pages (e.g., `/admin/projects`) reloads without 404.
- [ ] Saving updates in Admin Content Panel updates public site immediately.
- [ ] Rate limiting rejects excessive login attempts (>10 per 15 min).
