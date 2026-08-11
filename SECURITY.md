# 🛡️ Security Policy & Hardening Guidelines — VANTA Agency V2.0

This document outlines the security architecture, data protection measures, and pre-deployment security requirements for **VANTA Agency**.

---

## 1. Secret & Environment Variable Policy

- **No Secrets in Source Control**: `.env` files are strictly excluded via `.gitignore`. Only `.env.example` templates containing placeholders are committed.
- **Frontend Isolation**: Frontend environment variables prefixed with `VITE_` contain **zero secret keys** or private database credentials.
- **Strong Production Secrets**:
  - `JWT_SECRET` and `JWT_REFRESH_SECRET` must be set to unique 64+ character random strings (e.g. `openssl rand -hex 32`).
  - Default development passwords (such as `admin123`) trigger automated warning logs if detected when `NODE_ENV=production`.

---

## 2. Authentication & Authorization

- **Password Hashing**: Passwords are hashed using **Bcrypt** with salt rounds set to 10.
- **Stateless JWT Tokens**:
  - Short-lived Access Tokens (`1h` expiry).
  - Refresh Tokens (`7d` expiry).
- **Protected Routes**: All mutating endpoints (`PUT /api/content`, `PUT /api/settings`, `POST /api/media`, `DELETE /api/*`) enforce `authenticateJWT` middleware.

---

## 3. Rate Limiting & Denial of Service Protection

- **Global API Rate Limiter**: 200 requests per 15-minute window per IP.
- **Auth Endpoint Rate Limiter (`/api/auth/login`)**: Strict cap of **10 login attempts per 15 minutes** to prevent brute-force credential stuffing.
- **Contact Form Submission Limiter (`/api/messages`)**: Cap of **10 form submissions per 15 minutes** to prevent email spam.

---

## 4. HTTP Headers & CORS Protection

- **Helmet Security Headers**: Automatically applies security headers including `X-DNS-Prefetch-Control`, `X-Frame-Options` (DENY), `X-Content-Type-Options` (nosniff), `Strict-Transport-Security`, and `Cross-Origin-Resource-Policy`.
- **CORS Restricted Origins**: In production mode (`NODE_ENV=production`), `CORS_ORIGIN` must explicitly list allowed client domains (e.g. `https://yourdomain.com`).

---

## 5. Input Validation & Data Sanitization

- **SQL Injection Prevention**: All database queries use parameterized SQL bindings (`$1, $2, ...`) via `pg.Pool`.
- **Request Body Parsing**: Payload size limits capped at `10mb`.
- **File Upload Security**: `multer` validates allowed MIME types (`jpeg`, `png`, `webp`, `gif`, `svg`, `mp4`, `pdf`) and restricts maximum file size to `10MB`.

---

## 6. Pre-Launch Security Checklist

- [ ] All `.env` files removed from git index (`git ls-files .env`).
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` set to secure random keys.
- [ ] `ADMIN_PASSWORD` changed from default `admin123` to a high-entropy password.
- [ ] `CORS_ORIGIN` restricted to actual production frontend domain.
- [ ] Database SSL enabled for host connection (`ssl: { rejectUnauthorized: true }`).
- [ ] HTTPS enforced on both frontend and API backend endpoints.
