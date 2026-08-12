-- ═══════════════════════════════════════════════════════════
-- Migration 002: Upgrade URL columns to TEXT in projects table
-- ═══════════════════════════════════════════════════════════

ALTER TABLE projects ALTER COLUMN project_image TYPE TEXT;
ALTER TABLE projects ALTER COLUMN project_url TYPE TEXT;
ALTER TABLE projects ALTER COLUMN case_study_url TYPE TEXT;
