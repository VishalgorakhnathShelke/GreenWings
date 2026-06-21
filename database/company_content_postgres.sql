CREATE TABLE IF NOT EXISTS company_stories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  language TEXT NOT NULL,
  content TEXT NOT NULL,
  "featuredImage" TEXT,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT company_stories_slug_language_key UNIQUE (slug, language)
);

CREATE INDEX IF NOT EXISTS idx_company_stories_lookup
  ON company_stories (language, status, "displayOrder");

CREATE TABLE IF NOT EXISTS company_contents (
  id SERIAL PRIMARY KEY,
  "sectionKey" TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT company_contents_section_language_key UNIQUE ("sectionKey", language)
);

CREATE INDEX IF NOT EXISTS idx_company_contents_lookup
  ON company_contents (language, status, "displayOrder");

CREATE TABLE IF NOT EXISTS company_milestones (
  id SERIAL PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_company_milestones_order
  ON company_milestones ("displayOrder");

CREATE TABLE IF NOT EXISTS company_milestone_translations (
  id SERIAL PRIMARY KEY,
  "milestoneId" INTEGER NOT NULL REFERENCES company_milestones(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  title TEXT,
  description TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT company_milestone_translations_key UNIQUE ("milestoneId", language)
);

CREATE TABLE IF NOT EXISTS company_timelines (
  id SERIAL PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "impactMetric" TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT company_timelines_year_title_language_key UNIQUE (year, title, language)
);

CREATE INDEX IF NOT EXISTS idx_company_timelines_lookup
  ON company_timelines (language, status, "displayOrder");

CREATE TABLE IF NOT EXISTS leadership_members (
  id SERIAL PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  designation TEXT NOT NULL,
  "roleDescription" TEXT,
  biography TEXT NOT NULL,
  image TEXT,
  "imageUrl" TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE leadership_members ADD COLUMN IF NOT EXISTS "roleDescription" TEXT;
ALTER TABLE leadership_members ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE leadership_members ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en';

CREATE INDEX IF NOT EXISTS idx_leadership_members_active
  ON leadership_members (active, "displayOrder");

CREATE TABLE IF NOT EXISTS leadership_member_translations (
  id SERIAL PRIMARY KEY,
  "leadershipMemberId" INTEGER NOT NULL REFERENCES leadership_members(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  designation TEXT,
  biography TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT leadership_member_translations_key UNIQUE ("leadershipMemberId", language)
);

CREATE TABLE IF NOT EXISTS homepage_statistics (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_homepage_statistics_active
  ON homepage_statistics (active, "displayOrder");
