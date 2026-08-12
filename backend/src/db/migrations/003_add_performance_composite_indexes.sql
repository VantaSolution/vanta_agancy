-- ═══════════════════════════════════════════════════════════
-- Migration 003: Performance Composite Indexes
-- ═══════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_projects_published_order ON projects(is_published, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_services_active_order ON services(is_active, display_order ASC);
