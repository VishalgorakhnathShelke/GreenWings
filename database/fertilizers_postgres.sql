CREATE TABLE IF NOT EXISTS local_fertilizers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  country_of_origin TEXT NOT NULL DEFAULT 'India',
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  uses TEXT NOT NULL,
  apply_on_crops TEXT NOT NULL,
  do_not_apply_on TEXT NOT NULL,
  application_method TEXT NOT NULL,
  recommended_stage TEXT NOT NULL,
  season TEXT NOT NULL,
  temperature_range TEXT NOT NULL,
  soil_type TEXT NOT NULL,
  benefits TEXT NOT NULL,
  precautions TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  document_url TEXT,
  approval_body TEXT,
  regional_recommendations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS imported_fertilizers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  country_of_origin TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  uses TEXT NOT NULL,
  apply_on_crops TEXT NOT NULL,
  do_not_apply_on TEXT NOT NULL,
  application_method TEXT NOT NULL,
  recommended_stage TEXT NOT NULL,
  season TEXT NOT NULL,
  temperature_range TEXT NOT NULL,
  soil_type TEXT NOT NULL,
  benefits TEXT NOT NULL,
  precautions TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  document_url TEXT,
  brand TEXT,
  import_certifications TEXT,
  international_specifications TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS local_fertilizer_translations (
  id SERIAL PRIMARY KEY,
  fertilizer_id INTEGER NOT NULL REFERENCES local_fertilizers(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  name TEXT,
  category TEXT,
  description TEXT,
  content TEXT,
  uses TEXT,
  benefits TEXT,
  precautions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (fertilizer_id, language)
);

CREATE TABLE IF NOT EXISTS imported_fertilizer_translations (
  id SERIAL PRIMARY KEY,
  fertilizer_id INTEGER NOT NULL REFERENCES imported_fertilizers(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  name TEXT,
  category TEXT,
  description TEXT,
  content TEXT,
  uses TEXT,
  benefits TEXT,
  precautions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (fertilizer_id, language)
);

CREATE INDEX IF NOT EXISTS idx_local_fertilizers_status ON local_fertilizers(status);
CREATE INDEX IF NOT EXISTS idx_local_fertilizers_category ON local_fertilizers(category);
CREATE INDEX IF NOT EXISTS idx_imported_fertilizers_status ON imported_fertilizers(status);
CREATE INDEX IF NOT EXISTS idx_imported_fertilizers_category ON imported_fertilizers(category);
