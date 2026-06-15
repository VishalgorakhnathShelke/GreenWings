-- ============================================================
--  GreenWings Maharashtra Agriculture Database — Full Seed
--  Scope   : Maharashtra, India (extensible to other states)
--  Covers  : Fruits · Grains · Pulses · Oilseeds · Millets
--  Data    : Produce · Subtypes · Regions · Seasons · Nutrition
--             Tags · Local Names · Market Prices
--  Schema  : Extends original greenwings_database.sql with
--             scientific_name + marathi_name columns
-- ============================================================

-- ──────────────────────────────────────────
-- 0. SCHEMA EXTENSIONS
-- ──────────────────────────────────────────
-- Add scientific_name and marathi_name to core tables
ALTER TABLE produce
    ADD COLUMN IF NOT EXISTS scientific_name VARCHAR(150),
    ADD COLUMN IF NOT EXISTS marathi_name    VARCHAR(100),
    ADD COLUMN IF NOT EXISTS hindi_name      VARCHAR(100),
    ADD COLUMN IF NOT EXISTS english_name    VARCHAR(100),
    ADD COLUMN IF NOT EXISTS info            TEXT;

ALTER TABLE subtypes
    ADD COLUMN IF NOT EXISTS scientific_name VARCHAR(150),
    ADD COLUMN IF NOT EXISTS marathi_name    VARCHAR(100),
    ADD COLUMN IF NOT EXISTS info            TEXT;


-- ──────────────────────────────────────────
-- 1. REGIONS  (Maharashtra districts/zones)
-- ──────────────────────────────────────────
INSERT INTO regions (state_name, climate_type) VALUES
  ('Konkan',           'Tropical Humid'),
  ('Western Ghats',    'Tropical Highland'),
  ('Nashik',           'Semi-arid'),
  ('Pune',             'Semi-arid'),
  ('Aurangabad',       'Semi-arid / Dry'),
  ('Vidarbha',         'Hot Semi-arid'),
  ('Marathwada',       'Hot Dry Semi-arid'),
  ('Kolhapur',         'Humid Sub-tropical'),
  ('Satara',           'Semi-arid'),
  ('Solapur',          'Hot Arid'),
  ('Sangli',           'Semi-arid'),
  ('Amravati',         'Hot Semi-arid'),
  ('Nagpur',           'Hot Semi-arid'),
  ('Latur',            'Hot Dry'),
  ('Raigad',           'Tropical Humid'),
  ('Sindhudurg',       'Tropical Humid'),
  ('Dhule',            'Hot Dry'),
  ('Jalgaon',          'Hot Semi-arid'),
  ('Nandurbar',        'Tropical'),
  ('Osmanabad',        'Hot Dry');


-- ──────────────────────────────────────────
-- 2. SEASONS
-- ──────────────────────────────────────────
INSERT INTO seasons (season_name, sowing_months, harvest_months) VALUES
  ('Kharif',     'June–July',      'October–November'),
  ('Rabi',       'October–November','February–March'),
  ('Zaid',       'February–March', 'May–June'),
  ('Year-round', 'Varies',         'Varies'),
  ('Pre-Kharif', 'April–May',      'August–September'),
  ('Winter',     'November',       'January–February');


-- ──────────────────────────────────────────
-- 3. TAGS
-- ──────────────────────────────────────────
INSERT INTO tags (tag_name) VALUES
  ('GI-Tagged'),
  ('Organic'),
  ('Exotic'),
  ('Heritage'),
  ('High-Yield'),
  ('Export Quality'),
  ('Drought Tolerant'),
  ('Rainfed'),
  ('Irrigated'),
  ('Nutritional Powerhouse'),
  ('Traditional Maharashtra'),
  ('Millet'),
  ('Pulse'),
  ('Oilseed'),
  ('Cereal'),
  ('Fruit'),
  ('Cash Crop'),
  ('Coarse Grain'),
  ('Staple'),
  ('Superfood');


-- ══════════════════════════════════════════════════════════
--  SECTION A :  F R U I T S
-- ══════════════════════════════════════════════════════════

-- ──────────────────────────────────────────
-- A1. MANGO  (Aam / Amba)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Mango', 'Mangifera indica', 'Tropical',
   'Zaid', 'Amba', 'Aam', 'Mango',
   'Maharashtra is one of India''s leading mango-producing states. The Konkan coast is especially famous for Alphonso (Hapus), prized worldwide for its aroma, sweetness, and saffron-orange flesh. Grown across Ratnagiri, Sindhudurg, and Raigad districts. Season: March–June.');

-- Mango subtypes
INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id,
       s.subtype_name, s.origin_state, s.taste_profile, s.scientific_name, s.marathi_name, s.description
FROM produce p,
     (VALUES
       ('Alphonso (Hapus)', 'Maharashtra', 'Sweet, aromatic, rich saffron flavour, low fibre',
        'Mangifera indica cv. Alphonso', 'Hapus', 'GI-tagged variety from Ratnagiri & Sindhudurg; considered the king of mangoes; peak season April–May; ideal for pulp and fresh consumption.'),
       ('Kesar', 'Gujarat/Maharashtra', 'Sweet, less fibrous, deep orange pulp',
        'Mangifera indica cv. Kesar', 'Kesar', 'Grown in Aurangabad and Marathwada; second most exported variety; saffron-coloured pulp; season May–June.'),
       ('Langra', 'Uttar Pradesh/Maharashtra', 'Sweet-sour, green skin, rich flavour',
        'Mangifera indica cv. Langra', 'Langra', 'Grown in Nashik and Pune regions; medium-large fruit; greenish skin even when ripe.'),
       ('Dasheri', 'Uttar Pradesh/Maharashtra', 'Sweet, fibrous, aromatic',
        'Mangifera indica cv. Dasheri', 'Dasheri', 'Long fruit with thin skin; grown in Vidarbha; season June–July.'),
       ('Totapuri', 'South India/Maharashtra', 'Mildly sweet, tangy, firm, low fibre',
        'Mangifera indica cv. Totapuri', 'Totapuri', 'Large, elongated beak-shaped fruit; widely processed into mango pulp and pickle; grown in Solapur and Osmanabad.'),
       ('Pairi', 'Maharashtra', 'Sweet, juicy, mild sour notes',
        'Mangifera indica cv. Pairi', 'Pairi', 'Early season variety from Konkan; oval fruit; eaten fresh; also called Pyari.'),
       ('Ratna', 'Maharashtra', 'Very sweet, aromatic, less fibrous',
        'Mangifera indica cv. Ratna', 'Ratna', 'Hybrid developed at Dr BSKKV Dapoli; Alphonso × Neelum cross; regular bearer; popular in Konkan.'),
       ('Sindhu', 'Maharashtra', 'Sweet, aromatic, low fibre, long shelf life',
        'Mangifera indica cv. Sindhu', 'Sindhu', 'Hybrid (Ratna × Alphonso) developed at Vengurle; excellent export quality; shelf life 10–12 days.'),
       ('Neelum', 'Tamil Nadu/Maharashtra', 'Sweet, mild, fibrous',
        'Mangifera indica cv. Neelum', 'Nilam', 'Late season variety (June–August); grown in Marathwada and Vidarbha; small-medium fruit, yellow skin.'),
       ('Amrapali', 'Maharashtra', 'Very sweet, deep red-orange flesh',
        'Mangifera indica cv. Amrapali', 'Amrapali', 'Dwarf hybrid; suitable for high-density planting; grown in Nashik and Jalgaon.'),
       ('Mallika', 'Maharashtra', 'Sweet, juicy, long shelf life',
        'Mangifera indica cv. Mallika', 'Mallika', 'Neelum × Dasheri hybrid; regular bearer; wide adaptability; popular in export markets.'),
       ('Vanraj', 'Gujarat/Maharashtra', 'Sweet, mild, fibrous',
        'Mangifera indica cv. Vanraj', 'Vanraj', 'Developed at NAU Gujarat; grown in Nashik, Dhule; tolerant to adverse conditions.')
     ) AS s(subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
WHERE p.name = 'Mango';


-- ──────────────────────────────────────────
-- A2. GRAPES  (Draksha)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Grapes', 'Vitis vinifera', 'Tropical',
   'Rabi', 'Draksha', 'Angoor', 'Grapes',
   'Maharashtra, particularly Nashik district, is India''s largest grape-producing region, accounting for ~70% of national output. Nashik is called the "Wine Capital of India". Grapes are grown from October–November (pruning) with harvest January–March. Major export crop.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Thompson Seedless', 'Maharashtra', 'Sweet, mild, crisp, seedless',
        'Vitis vinifera cv. Thompson Seedless', 'Thompson Seedless',
        'Most widely grown table and raisin grape in Nashik, Sangli, Pune; green-gold colour; dominant export variety; also base for wine.'),
       ('Tas-A-Ganesh', 'Maharashtra', 'Sweet, firm, large berries, seedless',
        'Vitis vinifera cv. Tas-A-Ganesh', 'Tas-A-Ganesh',
        'Early maturing mutation of Thompson; large elongated berries; popular in domestic and export market; Nashik and Sangli.'),
       ('Sonaka', 'Maharashtra', 'Sweet, firm, elongated, seedless',
        'Vitis vinifera cv. Sonaka', 'Sonaka',
        'Developed in Maharashtra; excellent export quality; long shelf life; grown in Nashik, Pune; superior post-harvest quality.'),
       ('Sharad Seedless', 'Maharashtra', 'Sweet, crisp, medium size, seedless',
        'Vitis vinifera cv. Sharad Seedless', 'Sharad Seedless',
        'Late-maturing variety; Nashik; green-white berries; popular raisin grape.'),
       ('Flame Seedless', 'USA/Maharashtra', 'Sweet, slightly tart, red, seedless',
        'Vitis vinifera cv. Flame Seedless', 'Flame Seedless',
        'Red-berry seedless variety; grown in Nashik; attractive colour; export variety.'),
       ('Crimson Seedless', 'USA/Maharashtra', 'Sweet, firm, dark red, seedless',
        'Vitis vinifera cv. Crimson Seedless', 'Crimson Seedless',
        'Large red berries; late season; high sugar content; export quality; Nashik.'),
       ('Manik Chaman', 'Maharashtra', 'Sweet, large berries, red-black, seeded',
        'Vitis vinifera cv. Manik Chaman', 'Manik Chaman',
        'Also called Beauty Seedless; grown in Nashik, Sangli; large berries; domestic market.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Grapes';


-- ──────────────────────────────────────────
-- A3. ORANGE  (Santra)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Orange', 'Citrus sinensis / Citrus reticulata', 'Citrus',
   'Rabi', 'Santra', 'Santra', 'Orange',
   'Nagpur is the "Orange City" — Maharashtra''s Vidarbha region produces the famous GI-tagged Nagpur Mandarin, India''s most well-known orange variety, harvested November–January.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Nagpur Orange', 'Maharashtra', 'Sweet-tangy, juicy, aromatic, thin skin',
        'Citrus reticulata cv. Nagpur Mandarin', 'Nagpur Santra',
        'GI-tagged; grown in Nagpur, Amravati, Wardha; season Nov–Jan; star export variety; deep orange colour.'),
       ('Valencia Orange', 'Maharashtra', 'Sweet, juicy, low seeds',
        'Citrus sinensis cv. Valencia', 'Valencia Santra',
        'Sweet orange type; grown in Marathwada; used for juice.'),
       ('Mosambi (Sweet Lime)', 'Maharashtra', 'Mildly sweet, low acid',
        'Citrus limetta', 'Mosambi',
        'Sweet lime; highly popular for juice; grown in Pune, Solapur, Aurangabad; year-round availability.'),
       ('Hamlin Orange', 'Maharashtra', 'Sweet, juicy, early season',
        'Citrus sinensis cv. Hamlin', 'Hamlin Santra',
        'Early-bearing sweet orange; Marathwada and Vidarbha.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Orange';


-- ──────────────────────────────────────────
-- A4. BANANA  (Kela)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Banana', 'Musa acuminata / Musa balbisiana', 'Tropical',
   'Year-round', 'Kela', 'Kela', 'Banana',
   'Jalgaon district is India''s banana capital — Maharashtra ranks first nationally in banana production. Jalgaon bananas have a GI tag. Bananas are cultivated year-round under drip irrigation.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Grand Naine', 'Maharashtra', 'Sweet, firm, long shelf life',
        'Musa acuminata cv. Grand Naine', 'Grand Naine',
        'Most commercially grown; Jalgaon, Nandurbar; GI-tagged Jalgaon banana; export quality; tall plant, medium bunch.'),
       ('Dwarf Cavendish', 'Maharashtra', 'Sweet, creamy, slightly tangy',
        'Musa acuminata cv. Dwarf Cavendish', 'Dwarf Kela',
        'Short statured; wind resistant; Jalgaon, Pune; widely used commercially and domestically.'),
       ('Robusta', 'Maharashtra', 'Sweet, aromatic, medium-large fruit',
        'Musa acuminata cv. Robusta', 'Robusta Kela',
        'Taller than Dwarf Cavendish; widely grown in Maharashtra; good disease resistance.'),
       ('Shrimanthi', 'Maharashtra', 'Very sweet, soft, small fruit',
        'Musa acuminata cv. Shrimanthi', 'Shrimanthi',
        'Local traditional variety from Konkan and Kolhapur; festival use; aromatic.'),
       ('Basrai', 'Maharashtra', 'Sweet, aromatic, plump',
        'Musa acuminata cv. Basrai', 'Basrai Kela',
        'Traditional Jalgaon variety; basis of Jalgaon''s banana fame; good yield and flavour.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Banana';


-- ──────────────────────────────────────────
-- A5. GUAVA  (Peru)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Guava', 'Psidium guajava', 'Tropical',
   'Year-round', 'Peru', 'Amrood', 'Guava',
   'Guava is widely grown across Nashik, Pune, Solapur and Marathwada districts of Maharashtra. Rich in Vitamin C and lycopene; two crops per year possible.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Allahabad Safeda', 'Uttar Pradesh/Maharashtra', 'Sweet, white pulp, mild flavour',
        'Psidium guajava cv. Allahabad Safeda', 'Safeda Peru',
        'Most popular commercial variety; grown across Maharashtra; white flesh; high yield; good shelf life.'),
       ('Lalit', 'Maharashtra', 'Sweet, pink pulp, aromatic',
        'Psidium guajava cv. Lalit', 'Lalit Peru',
        'Developed at IARI; pink-fleshed; high Vitamin C; grown in Nashik, Pune.'),
       ('Shweta', 'Maharashtra', 'Sweet, soft, white pulp',
        'Psidium guajava cv. Shweta', 'Shweta Peru',
        'High-yielding variety; good post-harvest quality; Nashik.'),
       ('Lucknow-49 (Sardar)', 'Uttar Pradesh/Maharashtra', 'Sweet, juicy, white-yellow pulp',
        'Psidium guajava cv. L-49', 'Lucknow Peru',
        'Very popular; round fruit; widely adapted; grown across Maharashtra.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Guava';


-- ──────────────────────────────────────────
-- A6. POMEGRANATE  (Dalimb / Anar)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Pomegranate', 'Punica granatum', 'Sub-tropical',
   'Year-round', 'Dalimb', 'Anar', 'Pomegranate',
   'Maharashtra is the largest pomegranate producer in India, contributing ~80% of national output. Solapur, Sangli, Pune, Nashik, Ahmednagar and Osmanabad are major growing districts. Bhagwa variety has a GI tag and is a prized export fruit.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Bhagwa', 'Maharashtra', 'Sweet, deep red arils, low seed hardness, juicy',
        'Punica granatum cv. Bhagwa', 'Bhagwa Dalimb',
        'GI-tagged; grown in Solapur, Sangli, Nashik, Pune; saffron-red thick skin; 65–70% aril weight; top export variety to Middle East, Europe.'),
       ('Ganesh', 'Maharashtra', 'Sweet, mild, pink arils',
        'Punica granatum cv. Ganesh', 'Ganesh Dalimb',
        'Traditional variety; Pune and Nashik; large soft-seeded fruit; good for fresh market.'),
       ('Mridula', 'Karnataka/Maharashtra', 'Very sweet, deep red, soft seeds',
        'Punica granatum cv. Mridula', 'Mridula Dalimb',
        'Deep red attractive arils; grown in Solapur and Osmanabad; early-bearing.'),
       ('Arakta', 'Karnataka/Maharashtra', 'Sweet, deep red, attractive appearance',
        'Punica granatum cv. Arakta', 'Arakta Dalimb',
        'Large fruit; bright red skin; grown in Marathwada and Nashik; good export potential.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Pomegranate';


-- ──────────────────────────────────────────
-- A7. CUSTARD APPLE  (Sitafal)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Custard Apple', 'Annona squamosa / Annona reticulata', 'Tropical',
   'Kharif', 'Sitafal', 'Sitafal', 'Custard Apple',
   'Custard apple is an important commercial fruit in Maharashtra, grown in dry regions of Nashik, Aurangabad, Osmanabad, Solapur and Pune. Season is September–November.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Balanagar', 'Telangana/Maharashtra', 'Sweet, creamy, white flesh, low seeds',
        'Annona squamosa cv. Balanagar', 'Balanagar Sitafal',
        'Most popular commercial variety in Maharashtra; Nashik, Aurangabad; large fruit; high pulp recovery.'),
       ('Red Sitafal', 'Maharashtra', 'Very sweet, soft, aromatic, reddish skin',
        'Annona reticulata', 'Lal Sitafal',
        'Bullock''s heart variety; red skin; higher sweetness; Nashik and Marathwada.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Custard Apple';


-- ──────────────────────────────────────────
-- A8. PAPAYA  (Papai)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Papaya', 'Carica papaya', 'Tropical',
   'Year-round', 'Papai', 'Papita', 'Papaya',
   'Papaya is grown extensively across Maharashtra for fresh fruit and raw papaya processing. Pune, Nashik, Jalgaon and Aurangabad are major producing districts.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Red Lady', 'Taiwan/Maharashtra', 'Very sweet, red-orange flesh, firm',
        'Carica papaya cv. Red Lady', 'Red Lady Papai',
        'F1 hybrid; most popular commercial variety; Pune, Nashik; gynoecious; high yield; disease resistant.'),
       ('Taiwan', 'Taiwan/Maharashtra', 'Sweet, orange flesh, medium size',
        'Carica papaya cv. Taiwan 786', 'Taiwan Papai',
        'Widely grown hybrid; dual purpose (fruit + raw); Jalgaon and Nashik; year-round production.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Papaya';


-- ──────────────────────────────────────────
-- A9. SAPOTA / CHIKOO  (Chiku)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Sapota', 'Manilkara zapota', 'Tropical',
   'Year-round', 'Chiku', 'Chiku', 'Sapota / Chikoo',
   'Maharashtra is a major Sapota producer; Palghar, Nashik, Pune and Thane districts are major growing areas. Fruit is available year-round with peak seasons February–May and August–November.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Kalipatti', 'Maharashtra', 'Very sweet, granular, brown flesh',
        'Manilkara zapota cv. Kalipatti', 'Kalipatti Chiku',
        'Most popular commercial variety; Palghar, Nashik; oval shape; high yield; good shelf life.'),
       ('Cricket Ball', 'Maharashtra', 'Sweet, large, round, high sugar',
        'Manilkara zapota cv. Cricket Ball', 'Cricket Ball Chiku',
        'Round large fruit; high market value; Pune and Nashik.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Sapota';


-- ──────────────────────────────────────────
-- A10. COCONUT  (Naral)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Coconut', 'Cocos nucifera', 'Tropical',
   'Year-round', 'Naral', 'Nariyal', 'Coconut',
   'Coconut is a major crop of the Konkan coast — Ratnagiri, Sindhudurg, Raigad, Palghar and Thane. Used for copra, oil, tender coconut water, and in Maharashtrian cuisine.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('West Coast Tall', 'Maharashtra', 'Rich coconut water, thick white copra',
        'Cocos nucifera cv. West Coast Tall', 'Konkan Naral',
        'Tall variety; most widely grown in Konkan; high copra yield; drought tolerant once established.'),
       ('Dwarf', 'Maharashtra', 'Sweet tender water, thin husk',
        'Cocos nucifera var. nana', 'Bodka Naral',
        'Early bearing; tender coconut market; Ratnagiri and Sindhudurg; shorter lifespan than tall.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Coconut';


-- ──────────────────────────────────────────
-- A11. JACKFRUIT  (Phanas)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Jackfruit', 'Artocarpus heterophyllus', 'Tropical',
   'Zaid', 'Phanas', 'Kathal', 'Jackfruit',
   'Jackfruit grows in the humid Konkan belt; both unripe (vegetable use) and ripe fruit are consumed. Ratnagiri, Sindhudurg, Raigad and Thane are major areas. Season May–August.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Local Konkan', 'Maharashtra', 'Sweet, aromatic, orange-yellow flesh',
        'Artocarpus heterophyllus (local)', 'Konkan Phanas',
        'Traditional variety from Konkan; high-quality sweet bulbs; used raw as vegetable and ripe as fruit.'),
       ('Singapore', 'Malaysia/Maharashtra', 'Sweet, firm, less sticky',
        'Artocarpus heterophyllus cv. Singapore', 'Singapore Phanas',
        'Less latex; firmer bulbs; good for processing; grown in Konkan.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Jackfruit';


-- ──────────────────────────────────────────
-- A12. AMLA / INDIAN GOOSEBERRY  (Avala)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Amla', 'Phyllanthus emblica', 'Sub-tropical',
   'Rabi', 'Avala', 'Amla', 'Indian Gooseberry',
   'Amla (Indian Gooseberry) is grown in Nashik, Aurangabad, Pune and Marathwada. Richest natural source of Vitamin C; harvested November–February. Important in Ayurveda and food processing (pickles, candy, juice).');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('NA-7', 'Maharashtra', 'Sour, astringent, large fruit',
        'Phyllanthus emblica cv. NA-7', 'NA-7 Avala',
        'Most popular commercial variety in Maharashtra; large fruit; Nashik and Aurangabad; high Vitamin C.'),
       ('Krishna', 'Maharashtra', 'Sour, medium size, firm',
        'Phyllanthus emblica cv. Krishna', 'Krishna Avala',
        'High yielding; grown in Marathwada; good for processing.'),
       ('Kanchan', 'Maharashtra', 'Mildly sour, attractive appearance',
        'Phyllanthus emblica cv. Kanchan', 'Kanchan Avala',
        'Regular bearer; Nashik; good for candy and pickle industry.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Amla';


-- ──────────────────────────────────────────
-- A13. STRAWBERRY  (Strawberry)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Strawberry', 'Fragaria × ananassa', 'Subtropical Highland',
   'Rabi', 'Strawberry', 'Strawberry', 'Strawberry',
   'Mahabaleshwar (Satara district) and Panchgani produce 85% of India''s strawberries. Cool highland climate (1,400m elevation) ideal; season November–March. GI tag pending; major tourist attraction.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Camarosa', 'USA/Maharashtra', 'Sweet-tart, firm, bright red',
        'Fragaria × ananassa cv. Camarosa', 'Camarosa Strawberry',
        'Most popular variety in Mahabaleshwar; large berry; good shelf life; high yield; fresh market and processing.'),
       ('Festival', 'USA/Maharashtra', 'Very sweet, aromatic, deep red',
        'Fragaria × ananassa cv. Festival', 'Festival Strawberry',
        'Sweet flavour; Mahabaleshwar and Panchgani; popular with tourists.'),
       ('Sweet Charlie', 'USA/Maharashtra', 'Very sweet, aromatic, early season',
        'Fragaria × ananassa cv. Sweet Charlie', 'Sweet Charlie Strawberry',
        'Early bearing; soft fruit; excellent flavour; Mahabaleshwar.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Strawberry';


-- ──────────────────────────────────────────
-- A14. FIG  (Anjeer)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Fig', 'Ficus carica', 'Sub-tropical',
   'Zaid', 'Anjeer', 'Anjeer', 'Fig',
   'Pune, particularly Purandar taluka, is the "Fig Capital" of India. Maharashtra has a GI tag for Purandar Fig. Season: January–March (main) and June–August (secondary).');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Poona Fig (Dinkar)', 'Maharashtra', 'Very sweet, golden-green skin, soft, aromatic',
        'Ficus carica cv. Poona', 'Poona Anjeer',
        'GI-tagged Purandar fig; unique sweetness; grown exclusively in Purandar, Pune; best eaten fresh; limited production, premium price.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Fig';


-- ──────────────────────────────────────────
-- A15. BER / INDIAN JUJUBE  (Bor)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Ber', 'Ziziphus mauritiana', 'Sub-tropical',
   'Rabi', 'Bor', 'Ber', 'Indian Jujube / Ber',
   'Ber is a drought-tolerant fruit grown in dry zones of Maharashtra — Solapur, Osmanabad, Latur, Aurangabad. Season November–February. Rich in Vitamin C and minerals; good for dry regions.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Umran', 'Rajasthan/Maharashtra', 'Sweet, large, firm, low acidity',
        'Ziziphus mauritiana cv. Umran', 'Umran Bor',
        'Most popular commercial variety; large oval fruit; good shelf life; Solapur, Aurangabad.'),
       ('Gola', 'Maharashtra', 'Sweet-sour, round, medium size',
        'Ziziphus mauritiana cv. Gola', 'Gola Bor',
        'Traditional variety; good domestic market; Marathwada and Vidarbha.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Ber';


-- ══════════════════════════════════════════════════════════
--  SECTION B :  C E R E A L S
-- ══════════════════════════════════════════════════════════

-- ──────────────────────────────────────────
-- B1. RICE  (Bhat / Tandul)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Rice', 'Oryza sativa', 'Cereal',
   'Kharif', 'Bhat / Tandul', 'Chawal', 'Rice',
   'Rice is the primary Kharif food grain of Maharashtra, grown mainly in Konkan (Ratnagiri, Sindhudurg, Raigad), Western Ghats foothills, and Vidarbha. Maharashtra grows aromatic traditional varieties alongside high-yielding types. Total area ~1.5 million hectares.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Indrayani', 'Maharashtra', 'Aromatic, soft, sticky when cooked',
        'Oryza sativa cv. Indrayani', 'Indrayani Tandul',
        'GI-tagged; developed at Dr BSKKV, Dapoli; grown in Pune, Nashik and Konkan; premium price; very popular in Pune city market.'),
       ('Ambemohar', 'Maharashtra', 'Highly aromatic (mango blossom scent), soft, short grain',
        'Oryza sativa cv. Ambemohar', 'Ambemohar Tandul',
        'Heritage aromatic variety; Pune and Konkan hills; named for its mango-blossom aroma; slow cooking; festival and high-value rice.'),
       ('Kolam', 'Maharashtra', 'Slightly aromatic, slender, fluffy on cooking',
        'Oryza sativa cv. Kolam', 'Kolam Tandul',
        'Very popular in Mumbai-Pune; medium-slender grain; widely used for daily cooking; Nashik, Konkan.'),
       ('HMT', 'India', 'Mild aroma, long grain, non-sticky',
        'Oryza sativa cv. HMT', 'HMT Tandul',
        'Named for its resemblance to HMT watches (long slim grain); popular across Maharashtra; biryani rice.'),
       ('Jaya', 'India (IRRI origin)', 'Plain, non-aromatic, high-yield',
        'Oryza sativa cv. Jaya', 'Jaya Tandul',
        'High-yielding semi-dwarf; widely grown in irrigated areas of Vidarbha and Marathwada.'),
       ('Swarna', 'India', 'Non-aromatic, medium-bold, high yield',
        'Oryza sativa cv. Swarna (MTU 7029)', 'Swarna Tandul',
        'Most widely grown HYV rice in Maharashtra; Vidarbha; flood tolerant; rainfed and irrigated.'),
       ('Basmati', 'India', 'Very aromatic, extra long slender grain, fluffy',
        'Oryza sativa cv. Basmati', 'Basmati Tandul',
        'Grown in Nashik and parts of Marathwada; mostly for export and premium market.'),
       ('Karjat-4', 'Maharashtra', 'Aromatic, short-bold, good palatability',
        'Oryza sativa cv. Karjat-4', 'Karjat Tandul',
        'Developed at Regional Agricultural Research Station, Karjat; adapted to Konkan; medium duration.'),
       ('Phule Samruddhi', 'Maharashtra', 'High yield, medium grain, good cooking quality',
        'Oryza sativa cv. Phule Samruddhi', 'Phule Samruddhi Tandul',
        'Developed by MPKV Rahuri; high-yielding; suitable for Konkan and Western Maharashtra.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Rice';


-- ──────────────────────────────────────────
-- B2. WHEAT  (Gahu)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Wheat', 'Triticum aestivum / Triticum durum', 'Cereal',
   'Rabi', 'Gahu', 'Gehun', 'Wheat',
   'Wheat is Maharashtra''s principal Rabi crop; grown in Nashik, Pune, Ahmednagar, Aurangabad, Solapur and Vidarbha under irrigated conditions. Sown October–November, harvested February–March. Maharashtra grows both bread wheat and durum (for semolina/pasta).');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Lokwan', 'Maharashtra', 'Nutty, slightly sweet, good chapati quality',
        'Triticum aestivum cv. Lokwan', 'Lokwan Gahu',
        'Heritage wheat of Maharashtra; famous for chapati quality; medium yield; lower gluten than modern varieties; Nashik, Pune, Aurangabad.'),
       ('HD-2189', 'India', 'Plain, high gluten, good milling quality',
        'Triticum aestivum cv. HD-2189', 'HD-2189 Gahu',
        'Widely grown HYV; adaptable; Nashik and Aurangabad irrigated zones.'),
       ('HD-2967', 'India', 'Mild, high yield, good chapati quality',
        'Triticum aestivum cv. HD-2967', 'HD-2967 Gahu',
        'One of most popular wheats in Maharashtra; rust-resistant; Nashik, Pune, Vidarbha.'),
       ('NIAW-34', 'Maharashtra', 'Mild flavour, high yield, semi-dwarf',
        'Triticum aestivum cv. NIAW-34', 'NIAW-34 Gahu',
        'Developed at NIPHAD, Nashik; well adapted to Maharashtra; good tillering.'),
       ('NIAW-917', 'Maharashtra', 'Good chapati quality, heat tolerant',
        'Triticum aestivum cv. NIAW-917', 'NIAW-917 Gahu',
        'Heat-tolerant variety for Maharashtra; late sowing conditions; Marathwada.'),
       ('MACS-6222', 'Maharashtra', 'High protein, good chapati quality',
        'Triticum aestivum cv. MACS-6222', 'MACS-6222 Gahu',
        'Developed at ARI, Pune; high-yielding; Nashik, Pune, Solapur.'),
       ('AKAW-4627', 'Maharashtra', 'Durum type, high protein, golden semolina',
        'Triticum durum cv. AKAW-4627', 'AKAW Gahu',
        'Durum wheat; Akola series; Vidarbha and Marathwada; used for semolina (rawa/suji).')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Wheat';


-- ──────────────────────────────────────────
-- B3. JOWAR / SORGHUM  (Jwarī)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Jowar', 'Sorghum bicolor', 'Millet / Cereal',
   'Kharif', 'Jwarī', 'Jowar', 'Sorghum',
   'Maharashtra is India''s largest Jowar-producing state. Jowar (bhakri) is the staple food of rural Maharashtra. Grown in Solapur, Osmanabad, Latur, Aurangabad, Nashik. Kharif and Rabi (sweet sorghum for fodder) seasons. Drought tolerant and rainfed crop.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Maldandi', 'Maharashtra', 'Bold, white grain, excellent bhakri quality',
        'Sorghum bicolor cv. Maldandi 35-1', 'Maldandi Jwarī',
        'Heritage rabi sorghum; Solapur is the heartland; world-famous grain quality; GI tag sought; premium price; iconic Maharashtrian grain.'),
       ('Dagadi Jowar', 'Maharashtra', 'Nutty, hard grain, very drought tolerant',
        'Sorghum bicolor (local landrace)', 'Dagadi Jwarī',
        'Traditional hard-grain Kharif variety; Marathwada and Vidarbha; grown without irrigation.'),
       ('Phule Vasudha', 'Maharashtra', 'High yield, white grain, good quality',
        'Sorghum bicolor cv. Phule Vasudha', 'Phule Vasudha Jwarī',
        'Developed by MPKV; Rabi season; Nashik, Pune, Aurangabad; dual purpose (grain + fodder).'),
       ('CSV-15', 'India (ICRISAT)', 'Bold white grain, high yield',
        'Sorghum bicolor cv. CSV-15', 'CSV-15 Jwarī',
        'ICRISAT-developed; widely adapted; Maharashtra, Karnataka; Kharif.'),
       ('CSV-20', 'India (ICRISAT)', 'White grain, good yield, disease resistant',
        'Sorghum bicolor cv. CSV-20', 'CSV-20 Jwarī',
        'Improved variety; Marathwada and Vidarbha.'),
       ('CSV-27', 'India (ICRISAT)', 'White grain, drought tolerant, medium yield',
        'Sorghum bicolor cv. CSV-27', 'CSV-27 Jwarī',
        'Latest release; suitable for Kharif; Maharashtra.'),
       ('CSH-14', 'India', 'High yield, bold grain, hybrid vigour',
        'Sorghum bicolor cv. CSH-14', 'CSH-14 Jwarī',
        'Popular hybrid; Kharif; Vidarbha and Marathwada; good fodder value.'),
       ('CSH-16', 'India', 'Very high yield, white grain, hybrid',
        'Sorghum bicolor cv. CSH-16', 'CSH-16 Jwarī',
        'Widely grown hybrid; Kharif and Rabi; Maharashtra and Andhra Pradesh.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Jowar';


-- ──────────────────────────────────────────
-- B4. BAJRA / PEARL MILLET  (Bajrī)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Bajra', 'Pennisetum glaucum', 'Millet / Cereal',
   'Kharif', 'Bajrī', 'Bajra', 'Pearl Millet',
   'Bajra is a major Kharif crop of dry districts of Maharashtra — Nashik, Jalgaon, Dhule, Aurangabad. Very drought tolerant; important for poor rainfall areas. Bhakri (flatbread) is traditional use.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('ICTP-8203', 'India (ICRISAT)', 'Grey-white grain, good taste, nutritious',
        'Pennisetum glaucum cv. ICTP-8203', 'ICTP Bajrī',
        'Open-pollinated variety; widely adopted in Maharashtra; drought-tolerant; ICRISAT developed.'),
       ('Shanti', 'Maharashtra', 'White grain, mild flavour, high yield',
        'Pennisetum glaucum cv. Shanti', 'Shanti Bajrī',
        'MPKV Rahuri; well adapted to dry zones of Nashik, Aurangabad; Kharif.'),
       ('Saburi', 'Maharashtra', 'Good grain quality, medium yield',
        'Pennisetum glaucum cv. Saburi', 'Saburi Bajrī',
        'MPKV variety; Maharashtra; dual purpose.'),
       ('Phule Mahashakti', 'Maharashtra', 'High protein, bold grain, high yield',
        'Pennisetum glaucum cv. Phule Mahashakti', 'Phule Mahashakti Bajrī',
        'Biofortified; high iron and zinc; MPKV; Nashik, Dhule, Jalgaon.'),
       ('HHB-67', 'India', 'Bold grey grain, very high yield, hybrid',
        'Pennisetum glaucum cv. HHB-67', 'HHB-67 Bajrī',
        'Most popular hybrid in Maharashtra; CCSHAU Hisar; Nashik, Jalgaon, Dhule.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Bajra';


-- ──────────────────────────────────────────
-- B5. MAIZE / CORN  (Makka)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Maize', 'Zea mays', 'Cereal',
   'Kharif', 'Makka', 'Makka', 'Maize / Corn',
   'Maize is an important Kharif crop in Nashik, Pune, Aurangabad, Ahmednagar and Nanded districts. Used for food (corn), poultry feed, starch and ethanol. Maharashtra contributes ~5% of national maize production.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('African Tall', 'Maharashtra', 'Plain, starchy, large cob, open-pollinated',
        'Zea mays cv. African Tall', 'African Tall Makka',
        'Traditional OPV; tall plant; widely grown in Nashik and Pune; good for food and fodder.'),
       ('Vijay Composite', 'India', 'Good flavour, medium yield',
        'Zea mays cv. Vijay', 'Vijay Makka',
        'Open-pollinated; IARI developed; adaptable to Maharashtra; Kharif.'),
       ('Deccan Hybrid-101', 'Maharashtra', 'Good flavour, high yield, hybrid vigour',
        'Zea mays cv. Deccan-101', 'Deccan Makka',
        'Local hybrid; Pune and Nashik; food and fodder use.'),
       ('HQPM-1', 'India', 'High protein (QPM), sweet-nutty flavour',
        'Zea mays cv. HQPM-1', 'HQPM-1 Makka',
        'Quality Protein Maize; IARI; high lysine and tryptophan; nutritionally superior; poultry and food.'),
       ('Bioseed 9681', 'Maharashtra', 'Very high yield, bold grain, hybrid',
        'Zea mays cv. Bioseed 9681', 'Bioseed Makka',
        'Commercial hybrid; Nashik, Pune; widely used by contract farmers.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Maize';


-- ──────────────────────────────────────────
-- B6. RAGI / FINGER MILLET  (Nachni)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Ragi', 'Eleusine coracana', 'Millet',
   'Kharif', 'Nachni', 'Ragi / Mandua', 'Finger Millet',
   'Ragi (Nachni) is a nutritionally dense millet; grown in hilly and tribal areas of Nashik, Pune (Junnar), Nandurbar and Konkan. Richest grain source of calcium (344 mg/100g). Nachni bhakri and nachni satva (porridge) are traditional foods.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Dapoli-1', 'Maharashtra', 'Brown grain, earthy, nutritious',
        'Eleusine coracana cv. Dapoli-1', 'Dapoli Nachni',
        'Developed at BSKKV Dapoli; adapted to Konkan; Kharif; good yield.'),
       ('GPU-28', 'Karnataka/Maharashtra', 'Brown-black grain, high yield',
        'Eleusine coracana cv. GPU-28', 'GPU-28 Nachni',
        'One of most popular varieties; GKVK Bengaluru; widely adapted to Maharashtra.'),
       ('GPU-67', 'Karnataka/Maharashtra', 'Brown grain, blast-resistant, high yield',
        'Eleusine coracana cv. GPU-67', 'GPU-67 Nachni',
        'Disease resistant; good yield; Nashik hills and Nandurbar.'),
       ('Indaf-5', 'India', 'Dark brown, higher protein content',
        'Eleusine coracana cv. Indaf-5', 'Indaf Nachni',
        'ICAR developed; high yielding; used widely in Maharashtra tribal districts.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Ragi';


-- ══════════════════════════════════════════════════════════
--  SECTION C :  M I L L E T S  (Traditional)
-- ══════════════════════════════════════════════════════════

-- ──────────────────────────────────────────
-- C1. KODO MILLET  (Kodra / Varagu)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Kodo Millet', 'Paspalum scrobiculatum', 'Millet',
   'Kharif', 'Kodra', 'Kodra', 'Kodo Millet',
   'Kodo Millet (Kodra) is a traditional millet grown in tribal/hilly areas of Nashik, Nandurbar, Amravati and Gadchiroli. Drought-tolerant; low input; nutritious; part of the Nutri-Cereal revival initiative in Maharashtra.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Local Kodra', 'Maharashtra', 'Earthy, nutty, slightly bitter if unhulled',
        'Paspalum scrobiculatum (local landrace)', 'Sthanik Kodra',
        'Indigenous landraces grown in Nashik and Nandurbar tribal belts; integral to tribal food culture.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Kodo Millet';


-- ──────────────────────────────────────────
-- C2. LITTLE MILLET  (Kutki / Vari)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Little Millet', 'Panicum sumatrense', 'Millet',
   'Kharif', 'Vari / Kutki', 'Kutki', 'Little Millet',
   'Little Millet (Vari) is used during religious fasting in Maharashtra (Ekadashi, Navratri). Grown in tribal belts of Nashik, Nandurbar and Gadchiroli. Reviving due to health consciousness and fasting food markets.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Kutki (Local)', 'Maharashtra', 'Mild, slightly nutty, soft when cooked',
        'Panicum sumatrense (local)', 'Sthanik Vari',
        'Traditional landrace; Nashik and Nandurbar; used for vari chi bhakri and khichdi during fasting.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Little Millet';


-- ──────────────────────────────────────────
-- C3. FOXTAIL MILLET  (Kangni / Rala)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Foxtail Millet', 'Setaria italica', 'Millet',
   'Kharif', 'Rala / Kangni', 'Kangni', 'Foxtail Millet',
   'Foxtail Millet is an ancient millet with high iron content; reviving in Maharashtra under Nutri-Cereal programme. Grown in Nashik, Aurangabad, and tribal districts. Short-duration (60–90 days); highly drought tolerant.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Kangni (Local)', 'Maharashtra', 'Mild, slightly sweet, fluffy when cooked',
        'Setaria italica (local landrace)', 'Sthanik Rala',
        'Local landraces; Nashik, Nandurbar; very short duration; used for porridge and bhakri.'),
       ('SiA-3085', 'India (ICAR-IIMR)', 'Good grain quality, high yield',
        'Setaria italica cv. SiA-3085', 'SiA-3085 Rala',
        'Improved variety; adaptable to Maharashtra; ICAR-IIMR Hyderabad.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Foxtail Millet';


-- ──────────────────────────────────────────
-- C4. BARNYARD MILLET  (Sanwa / Bhagar)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Barnyard Millet', 'Echinochloa frumentacea', 'Millet',
   'Kharif', 'Bhagar / Sanwa', 'Sanwa', 'Barnyard Millet',
   'Barnyard Millet (Bhagar) is extremely popular in Maharashtra for religious fasting (Upvasachi bhakri, Bhagar rice). Widely consumed during Ekadashi, Navratri. Grown in Nashik, Aurangabad, Nandurbar. High fibre, low GI.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Bhagar (Local)', 'Maharashtra', 'Mild, fluffy, slightly chewy',
        'Echinochloa frumentacea (local)', 'Sthanik Bhagar',
        'Traditional local variety; grown across Maharashtra; essential fasting food; khichdi and bhakri.'),
       ('PRJ-1', 'Maharashtra', 'Good grain quality, high yield',
        'Echinochloa frumentacea cv. PRJ-1', 'PRJ-1 Bhagar',
        'Improved variety; BSKKV Dapoli; Konkan and Nashik.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Barnyard Millet';


-- ──────────────────────────────────────────
-- C5. PROSO MILLET  (Cheena / Vari)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Proso Millet', 'Panicum miliaceum', 'Millet',
   'Kharif', 'Cheena', 'Cheena', 'Proso Millet / Common Millet',
   'Proso Millet is an ancient grain with fastest growth cycle (60–75 days) among millets. Grown in dry areas of Maharashtra as an emergency/catch crop. Low water requirement; high nutritional value. Reviving under health and organic food movements.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Cheena (Local)', 'Maharashtra', 'Mild, bland, soft when cooked',
        'Panicum miliaceum (local landrace)', 'Sthanik Cheena',
        'Local varieties; Marathwada and Vidarbha; very short duration; used for khichdi and upma.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Proso Millet';


-- ══════════════════════════════════════════════════════════
--  SECTION D :  P U L S E S
-- ══════════════════════════════════════════════════════════

-- ──────────────────────────────────────────
-- D1. TUR / PIGEON PEA  (Tur Dal)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Tur (Pigeon Pea)', 'Cajanus cajan', 'Pulse',
   'Kharif', 'Tur', 'Arhar / Tur', 'Pigeon Pea / Red Gram',
   'Maharashtra is the largest Tur (pigeon pea) producing state in India. Grown extensively in Latur, Osmanabad, Nanded, Solapur and Marathwada. Staple dal of Maharashtra — tur dal (amti) is fundamental to Maharashtrian thali. Kharif season: sown June–July, harvested January–February.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('BSMR-736 (Vipula)', 'Maharashtra', 'Good cooking quality, earthy flavour',
        'Cajanus cajan cv. BSMR-736', 'Vipula Tur',
        'Wilt and sterility mosaic resistant; MPKV Rahuri; Marathwada and Vidarbha; medium duration.'),
       ('Asha (ICPL-87119)', 'India (ICRISAT)', 'Good flavour, medium-bold grain',
        'Cajanus cajan cv. Asha', 'Asha Tur',
        'Wilt-resistant; widely adapted; popular in Latur, Osmanabad; medium duration.'),
       ('Maruti', 'Maharashtra', 'Large seed, good dal recovery, bold grain',
        'Cajanus cajan cv. Maruti', 'Maruti Tur',
        'Bold-seeded variety; Marathwada; high market value; good for commercial dal production.'),
       ('ICPL-87119', 'India (ICRISAT)', 'Medium grain, disease resistant',
        'Cajanus cajan cv. ICPL-87119', 'Prabhat Tur',
        'Extra-early variety; ICRISAT; Marathwada; good for areas with short seasons.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Tur (Pigeon Pea)';


-- ──────────────────────────────────────────
-- D2. CHICKPEA / BENGAL GRAM  (Harbhara / Chana)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Chickpea', 'Cicer arietinum', 'Pulse',
   'Rabi', 'Harbhara / Chana', 'Chana', 'Chickpea / Bengal Gram',
   'Maharashtra is a leading chickpea-growing state; Marathwada (Latur, Osmanabad, Aurangabad) and Vidarbha are key regions. Both desi (brown) and kabuli (white/large) types grown. Rabi season: sown October–November, harvested January–February.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Vijay', 'Maharashtra', 'Earthy, creamy, desi type, medium seed',
        'Cicer arietinum cv. Vijay', 'Vijay Harbhara',
        'Wilt-resistant desi variety; MPKV Rahuri; widely grown in Marathwada.'),
       ('Digvijay', 'Maharashtra', 'Good cooking quality, desi type',
        'Cicer arietinum cv. Digvijay', 'Digvijay Harbhara',
        'High yielding; Marathwada; rust and wilt tolerant.'),
       ('JAKI-9218', 'Maharashtra', 'Bold kabuli type, white, premium',
        'Cicer arietinum cv. JAKI-9218', 'JAKI Kabuli Harbhara',
        'Kabuli chickpea; large white seeds; premium export market; Latur, Osmanabad.'),
       ('Vishal', 'Maharashtra', 'Bold kabuli, creamy white, export quality',
        'Cicer arietinum cv. Vishal', 'Vishal Kabuli Harbhara',
        'Large-seeded kabuli; Marathwada; grown for export to Middle East and Europe.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Chickpea';


-- ──────────────────────────────────────────
-- D3. GREEN GRAM / MOONG  (Mug)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Moong (Green Gram)', 'Vigna radiata', 'Pulse',
   'Kharif', 'Mug', 'Moong', 'Green Gram / Mung Bean',
   'Moong (Green Gram) is grown as a Kharif and summer (Zaid) pulse in Maharashtra — Nashik, Aurangabad, Pune, Nanded. Short-duration crop (60–70 days); also grown as a catch crop and for green manure. Whole or split (moong dal) widely consumed.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Vaibhav (BM-4)', 'Maharashtra', 'Bright green seed, good flavour',
        'Vigna radiata cv. BM-4', 'BM-4 Mug',
        'MPKV variety; widely adapted; Kharif and summer; Nashik, Aurangabad.'),
       ('PDM-11', 'India', 'Bold green seed, high yield',
        'Vigna radiata cv. PDM-11', 'PDM-11 Mug',
        'IARI; popular in Maharashtra Kharif; wilt and CYM virus tolerant.'),
       ('SML-668', 'India', 'Green seed, high protein, short duration',
        'Vigna radiata cv. SML-668', 'SML-668 Mug',
        'PAU Ludhiana variety; adapted to Maharashtra summer crop; very short duration 60 days.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Moong (Green Gram)';


-- ──────────────────────────────────────────
-- D4. BLACK GRAM / URAD  (Udid)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Urad (Black Gram)', 'Vigna mungo', 'Pulse',
   'Kharif', 'Udid', 'Urad', 'Black Gram / Urad',
   'Urad (Udid) is a Kharif pulse grown in Nanded, Latur, Osmanabad, Aurangabad and parts of Vidarbha. Essential for Maharashtrian vada, idli (batter), and dal. Short-duration; good in mixed cropping with Tur.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('TAU-1', 'Maharashtra', 'Black seed, bold, good dal quality',
        'Vigna mungo cv. TAU-1', 'TAU-1 Udid',
        'MPKV Parbhani; widely grown in Marathwada; Kharif; wilt tolerant.'),
       ('TPU-4', 'Maharashtra', 'Medium black seed, good yield',
        'Vigna mungo cv. TPU-4', 'TPU-4 Udid',
        'MPKV variety; adapted to Marathwada and Vidarbha.'),
       ('AKU-15', 'Maharashtra', 'Bold black seed, high protein',
        'Vigna mungo cv. AKU-15', 'AKU Udid',
        'Akola series; Vidarbha; disease-resistant; Kharif.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Urad (Black Gram)';


-- ──────────────────────────────────────────
-- D5. LENTIL / MASOOR  (Masur)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Masoor (Lentil)', 'Lens culinaris', 'Pulse',
   'Rabi', 'Masur', 'Masoor', 'Lentil / Masoor',
   'Masoor (Red Lentil) is a Rabi pulse grown in Marathwada and Vidarbha — Latur, Osmanabad, Yavatmal. Less common than Tur and Chana but nutritionally important; pink/red split dal used widely in Maharashtrian cuisine.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('JL-3', 'Maharashtra', 'Orange-red split, mild earthy flavour',
        'Lens culinaris cv. JL-3', 'JL-3 Masur',
        'MPKV Parbhani; adapted to Marathwada; Rabi; medium yield.'),
       ('JL-1', 'Maharashtra', 'Medium brown seed, good quality split',
        'Lens culinaris cv. JL-1', 'JL-1 Masur',
        'Earlier release; Marathwada; good cooking quality.'),
       ('KLS-218', 'Maharashtra', 'Brown-red seed, good yield',
        'Lens culinaris cv. KLS-218', 'KLS-218 Masur',
        'MPKV variety; Latur, Osmanabad; rust-tolerant.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Masoor (Lentil)';


-- ══════════════════════════════════════════════════════════
--  SECTION E :  O I L S E E D S
-- ══════════════════════════════════════════════════════════

-- ──────────────────────────────────────────
-- E1. SOYBEAN  (Soya)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Soybean', 'Glycine max', 'Oilseed',
   'Kharif', 'Soya', 'Soya', 'Soybean',
   'Maharashtra is the largest soybean-growing state in India, with ~40% of national acreage. Grown in Vidarbha (Nagpur, Amravati), Marathwada (Latur, Osmanabad) and Nashik. Major oilseed and protein crop. Sown June–July; harvested September–October.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('JS-335', 'Madhya Pradesh/Maharashtra', 'Neutral, beany, high protein and oil',
        'Glycine max cv. JS-335', 'JS-335 Soya',
        'Most widely grown variety in Maharashtra for decades; Vidarbha and Marathwada; good yield and oil content.'),
       ('JS-9305', 'India', 'High yield, good oil content',
        'Glycine max cv. JS-9305', 'JS-9305 Soya',
        'Improved variety; Vidarbha; pod shatter resistant; Kharif.'),
       ('MAUS-71', 'Maharashtra', 'High yield, good protein content',
        'Glycine max cv. MAUS-71', 'MAUS-71 Soya',
        'MPKV Rahuri; widely adapted to Maharashtra; moderate disease resistance.'),
       ('MAUS-158', 'Maharashtra', 'High yield, lodging resistant',
        'Glycine max cv. MAUS-158', 'MAUS-158 Soya',
        'Latest MPKV variety; improved pod-shatter resistance; Maharashtra.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Soybean';


-- ──────────────────────────────────────────
-- E2. GROUNDNUT  (Bhui Mung / Shengdana)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Groundnut', 'Arachis hypogaea', 'Oilseed',
   'Kharif', 'Shengdana', 'Moongphali', 'Groundnut / Peanut',
   'Groundnut is a major Kharif oilseed and cash crop in Maharashtra — Akola, Amravati, Wardha (Vidarbha) and Nashik, Jalgaon (North Maharashtra). Maharashtra is 4th nationally. Also a Rabi irrigated crop in Solapur. Famous for "Vidarbha shengdana".');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('JL-24', 'Maharashtra', 'Rich nutty flavour, high oil, Spanish type',
        'Arachis hypogaea cv. JL-24', 'JL-24 Shengdana',
        'Most popular in Maharashtra; MPKV Junnar; Spanish bunch; widely grown in Vidarbha, Nashik; short duration.'),
       ('TAG-24', 'India', 'Good oil content, bold kernel, Spanish',
        'Arachis hypogaea cv. TAG-24', 'TAG-24 Shengdana',
        'Tilakar Agri; drought-tolerant; Marathwada, Vidarbha; Kharif.'),
       ('SB-11', 'Maharashtra', 'High yield, good kernel recovery',
        'Arachis hypogaea cv. SB-11', 'SB-11 Shengdana',
        'MPKV variety; Nashik and Ahmednagar; drought tolerant.'),
       ('Phule Pragati', 'Maharashtra', 'Bold kernel, high oil, good yield',
        'Arachis hypogaea cv. Phule Pragati', 'Phule Pragati Shengdana',
        'MPKV Rahuri; improved variety; dual purpose (oil + fresh nut); Maharashtra.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Groundnut';


-- ──────────────────────────────────────────
-- E3. SESAME  (Til)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Sesame', 'Sesamum indicum', 'Oilseed',
   'Kharif', 'Til', 'Til', 'Sesame',
   'Sesame (Til) is a traditional oilseed crop of Maharashtra grown in Aurangabad, Jalgaon, Nashik and Osmanabad. Essential in Maharashtrian sweets — tilgul (sesame-jaggery balls) for Makar Sankranti. High-value crop for domestic and export market.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('AKT-64', 'Maharashtra', 'White seed, nutty, high oil (50–54%)',
        'Sesamum indicum cv. AKT-64', 'AKT-64 Til',
        'Akola series; Vidarbha and Marathwada; white-seeded; high oil; good export quality.'),
       ('JLT-7', 'Maharashtra', 'White seed, good oil content',
        'Sesamum indicum cv. JLT-7', 'JLT-7 Til',
        'MPKV Jalgaon variety; North Maharashtra; Kharif; medium yield.'),
       ('Phule Til-1', 'Maharashtra', 'White seed, high oil, improved variety',
        'Sesamum indicum cv. Phule Til-1', 'Phule Til',
        'MPKV Rahuri; widely recommended for Maharashtra; good yield under rainfed conditions.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Sesame';


-- ──────────────────────────────────────────
-- E4. SUNFLOWER  (Suryafool)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Sunflower', 'Helianthus annuus', 'Oilseed',
   'Rabi', 'Suryafool', 'Surajmukhi', 'Sunflower',
   'Sunflower is grown as a Rabi crop in Maharashtra — Solapur, Osmanabad, Latur, Aurangabad, Nashik. Good oil crop for light black soils; used as edible oil. Also a Kharif crop in some areas.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Morden', 'Canada/Maharashtra', 'High oil content, open-pollinated',
        'Helianthus annuus cv. Morden', 'Morden Suryafool',
        'OPV; adapted to dry conditions in Marathwada; medium height; good oil (40–45%).'),
       ('KBSH-1', 'Karnataka/Maharashtra', 'High oil (42–45%), hybrid, high yield',
        'Helianthus annuus cv. KBSH-1', 'KBSH-1 Suryafool',
        'Hybrid; UASD Dharwad; most popular sunflower hybrid in Maharashtra; Solapur, Latur.'),
       ('KBSH-44', 'Karnataka/Maharashtra', 'Very high oil, large head, hybrid',
        'Helianthus annuus cv. KBSH-44', 'KBSH-44 Suryafool',
        'Improved hybrid; UASD; downy mildew resistant; Maharashtra dry zones.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Sunflower';


-- ══════════════════════════════════════════════════════════
--  SECTION F :  N U T R I T I O N  F A C T S
--  (per 100g edible portion, approximate values)
-- ══════════════════════════════════════════════════════════
INSERT INTO nutrition_facts
  (produce_id, calories, protein_g, carbs_g, fiber_g, fat_g, vitamins, minerals, per_quantity)
SELECT p.produce_id,
       n.cal, n.prot, n.carbs, n.fiber, n.fat, n.vit, n.min, '100g'
FROM produce p
JOIN (VALUES
  -- Fruits
  ('Mango',              60.0,  0.82, 14.98, 1.6,  0.38,
   'Vitamin C 36mg, Vitamin A 54μg, Folate 43μg, Vitamin B6 0.12mg',
   'Potassium 168mg, Calcium 11mg, Magnesium 10mg'),
  ('Grapes',             67.0,  0.63, 17.15, 0.9,  0.35,
   'Vitamin C 3.2mg, Vitamin K 14.6μg, Vitamin B6 0.09mg',
   'Potassium 191mg, Calcium 10mg, Iron 0.36mg'),
  ('Orange',             47.0,  0.94, 11.75, 2.4,  0.12,
   'Vitamin C 53mg, Folate 30μg, Thiamine 0.09mg',
   'Potassium 181mg, Calcium 40mg, Magnesium 10mg'),
  ('Banana',             89.0,  1.09, 22.84, 2.6,  0.33,
   'Vitamin C 8.7mg, Vitamin B6 0.37mg, Folate 20μg',
   'Potassium 358mg, Magnesium 27mg, Phosphorus 22mg'),
  ('Guava',              68.0,  2.55, 14.32, 5.4,  0.95,
   'Vitamin C 228mg, Folate 49μg, Vitamin A 31μg',
   'Potassium 417mg, Calcium 18mg, Magnesium 22mg'),
  ('Pomegranate',        83.0,  1.67, 18.70, 4.0,  1.17,
   'Vitamin C 10.2mg, Folate 38μg, Vitamin K 16.4μg',
   'Potassium 236mg, Calcium 10mg, Phosphorus 36mg'),
  ('Custard Apple',     101.0,  1.70, 25.20, 2.4,  0.60,
   'Vitamin C 19mg, Vitamin B6 0.22mg, Niacin 0.90mg',
   'Potassium 382mg, Calcium 30mg, Magnesium 18mg'),
  ('Papaya',             43.0,  0.47, 10.82, 1.7,  0.26,
   'Vitamin C 61.8mg, Vitamin A 47μg, Folate 37μg',
   'Potassium 182mg, Calcium 20mg, Magnesium 21mg'),
  ('Sapota',            141.0,  0.44, 34.60, 5.3,  1.10,
   'Vitamin C 14.7mg, Vitamin A 30μg, Niacin 0.20mg',
   'Potassium 193mg, Calcium 21mg, Iron 0.80mg'),
  ('Coconut',           354.0,  3.33, 15.23, 9.0, 33.49,
   'Vitamin C 3.3mg, Folate 26μg, Thiamine 0.07mg',
   'Potassium 356mg, Magnesium 32mg, Phosphorus 113mg'),
  ('Jackfruit',          95.0,  1.72, 23.25, 1.5,  0.64,
   'Vitamin C 13.7mg, Vitamin B6 0.33mg, Niacin 1.5mg',
   'Potassium 448mg, Calcium 34mg, Magnesium 37mg'),
  ('Amla',              44.0,  0.88, 10.18, 4.3,  0.58,
   'Vitamin C 600–800mg, Calcium 50mg, Carotene 9μg',
   'Iron 1.2mg, Potassium 198mg, Phosphorus 27mg'),
  ('Strawberry',         32.0,  0.67,  7.68, 2.0,  0.30,
   'Vitamin C 58.8mg, Folate 24μg, Vitamin B6 0.05mg',
   'Potassium 153mg, Calcium 16mg, Magnesium 13mg'),
  ('Fig',                74.0,  0.75, 19.18, 2.9,  0.30,
   'Vitamin C 2mg, Vitamin K 4.7μg, Thiamine 0.06mg',
   'Potassium 232mg, Calcium 35mg, Iron 0.37mg'),
  ('Ber',                79.0,  1.20, 20.23, 0.6,  0.20,
   'Vitamin C 69mg, Riboflavin 0.04mg, Niacin 0.9mg',
   'Potassium 250mg, Calcium 21mg, Phosphorus 23mg'),
  -- Cereals / Grains
  ('Rice',              130.0,  2.69, 28.17, 0.4,  0.28,
   'Thiamine 0.02mg, Niacin 1.53mg, Folate 3μg',
   'Phosphorus 43mg, Manganese 0.47mg, Magnesium 12mg'),
  ('Wheat',             340.0, 12.61, 72.57, 10.7,  1.54,
   'Thiamine 0.30mg, Niacin 5.46mg, Folate 44μg',
   'Phosphorus 288mg, Magnesium 138mg, Iron 3.19mg, Zinc 2.77mg'),
  ('Jowar',             349.0, 10.40, 72.09,  6.7,  3.46,
   'Thiamine 0.37mg, Niacin 3.72mg, Riboflavin 0.14mg',
   'Iron 4.1mg, Calcium 25mg, Phosphorus 287mg, Magnesium 165mg'),
  ('Bajra',             378.0, 11.02, 72.80,  8.5,  5.43,
   'Thiamine 0.38mg, Niacin 4.72mg, Folate 85μg',
   'Iron 8.0mg, Calcium 42mg, Zinc 3.1mg, Magnesium 162mg'),
  ('Maize',             365.0,  9.42, 74.26,  7.3,  4.74,
   'Vitamin A 214μg, Thiamine 0.39mg, Niacin 3.63mg',
   'Phosphorus 210mg, Magnesium 127mg, Iron 2.71mg'),
  ('Ragi',              328.0,  7.70, 72.00,  3.6,  1.92,
   'Thiamine 0.42mg, Riboflavin 0.19mg, Niacin 1.1mg',
   'Calcium 344mg (highest of all cereals), Iron 3.9mg, Phosphorus 283mg'),
  ('Kodo Millet',       309.0,  8.30, 65.90,  9.0,  1.40,
   'Thiamine 0.15mg, Niacin 2.0mg',
   'Iron 0.5mg, Calcium 27mg, Phosphorus 188mg'),
  ('Little Millet',     341.0,  7.70, 67.00,  7.6,  5.20,
   'Thiamine 0.30mg, Niacin 3.2mg',
   'Iron 9.3mg, Calcium 17mg, Phosphorus 220mg'),
  ('Foxtail Millet',    351.0, 12.30, 60.90,  8.0,  4.30,
   'Thiamine 0.59mg, Niacin 3.2mg, Riboflavin 0.11mg',
   'Iron 2.8mg, Calcium 31mg, Phosphorus 290mg'),
  ('Barnyard Millet',   307.0,  6.20, 65.50, 13.6,  2.20,
   'Thiamine 0.33mg, Niacin 4.2mg',
   'Iron 5.0mg, Calcium 20mg, Phosphorus 280mg'),
  ('Proso Millet',      378.0, 11.02, 72.90,  8.5,  4.22,
   'Thiamine 0.41mg, Niacin 4.72mg',
   'Iron 3.0mg, Calcium 14mg, Phosphorus 206mg'),
  -- Pulses
  ('Tur (Pigeon Pea)',  343.0, 21.70, 62.78,  15.0,  1.49,
   'Folate 456μg, Thiamine 0.64mg, Niacin 2.97mg',
   'Iron 5.23mg, Potassium 981mg, Phosphorus 367mg, Zinc 2.76mg'),
  ('Chickpea',          364.0, 19.30, 60.65,  17.4,  6.04,
   'Folate 557μg, Thiamine 0.48mg, Vitamin B6 0.54mg',
   'Iron 6.24mg, Zinc 3.43mg, Magnesium 115mg, Potassium 875mg'),
  ('Moong (Green Gram)', 347.0, 23.86, 62.62,  16.3,  1.15,
   'Folate 625μg, Thiamine 0.62mg, Riboflavin 0.23mg',
   'Iron 6.74mg, Zinc 2.68mg, Potassium 1246mg, Magnesium 189mg'),
  ('Urad (Black Gram)', 341.0, 25.21, 58.99,  18.3,  1.64,
   'Folate 216μg, Thiamine 0.27mg, Niacin 1.5mg',
   'Iron 7.57mg, Calcium 138mg, Phosphorus 379mg, Potassium 983mg'),
  ('Masoor (Lentil)',   352.0, 25.80, 63.35,  30.5,  1.06,
   'Folate 479μg, Thiamine 0.87mg, Niacin 2.6mg',
   'Iron 7.54mg, Zinc 3.63mg, Potassium 955mg, Magnesium 122mg'),
  -- Oilseeds
  ('Soybean',           446.0, 36.49, 30.16,  9.3, 19.94,
   'Folate 375μg, Vitamin K 47μg, Riboflavin 0.87mg',
   'Iron 15.7mg, Calcium 277mg, Magnesium 280mg, Zinc 4.89mg'),
  ('Groundnut',         567.0, 25.80, 16.13,  8.5, 49.24,
   'Niacin 12.07mg, Folate 240μg, Vitamin E 8.33mg',
   'Magnesium 168mg, Phosphorus 376mg, Zinc 3.27mg, Iron 4.58mg'),
  ('Sesame',            573.0, 17.73, 23.45,  11.8, 49.67,
   'Thiamine 0.79mg, Niacin 4.52mg, Folate 97μg',
   'Calcium 975mg, Iron 14.55mg, Magnesium 351mg, Zinc 7.75mg'),
  ('Sunflower',         584.0, 20.78,  8.85,   8.6, 51.46,
   'Vitamin E 35.17mg, Thiamine 1.48mg, Folate 227μg',
   'Phosphorus 660mg, Magnesium 325mg, Iron 5.25mg, Zinc 5.0mg')
) AS n(name, cal, prot, carbs, fiber, fat, vit, min)
ON p.name = n.name;


-- ══════════════════════════════════════════════════════════
--  SECTION G :  LOCAL NAMES  (Marathi + Hindi + English)
-- ══════════════════════════════════════════════════════════
-- Marathi names
INSERT INTO local_names (produce_id, language, name)
SELECT p.produce_id, 'Marathi', p.marathi_name
FROM produce p WHERE p.marathi_name IS NOT NULL;

-- Hindi names
INSERT INTO local_names (produce_id, language, name)
SELECT p.produce_id, 'Hindi', p.hindi_name
FROM produce p WHERE p.hindi_name IS NOT NULL;

-- English names
INSERT INTO local_names (produce_id, language, name)
SELECT p.produce_id, 'English', p.english_name
FROM produce p WHERE p.english_name IS NOT NULL;


-- ══════════════════════════════════════════════════════════
--  SECTION H :  PRODUCE ↔ REGION MAP
-- ══════════════════════════════════════════════════════════
-- Key growing regions per produce
INSERT INTO produce_region_map (produce_id, region_id)
SELECT p.produce_id, r.region_id
FROM produce p, regions r
WHERE
  (p.name = 'Mango'            AND r.state_name IN ('Konkan','Raigad','Nashik','Aurangabad'))
OR(p.name = 'Grapes'           AND r.state_name IN ('Nashik','Pune','Sangli','Solapur'))
OR(p.name = 'Orange'           AND r.state_name IN ('Nagpur','Amravati','Aurangabad'))
OR(p.name = 'Banana'           AND r.state_name IN ('Jalgaon','Nashik','Nandurbar'))
OR(p.name = 'Guava'            AND r.state_name IN ('Nashik','Pune','Solapur','Aurangabad'))
OR(p.name = 'Pomegranate'      AND r.state_name IN ('Solapur','Sangli','Nashik','Pune','Osmanabad'))
OR(p.name = 'Custard Apple'    AND r.state_name IN ('Nashik','Aurangabad','Osmanabad','Solapur'))
OR(p.name = 'Papaya'           AND r.state_name IN ('Pune','Nashik','Jalgaon','Aurangabad'))
OR(p.name = 'Sapota'           AND r.state_name IN ('Nashik','Pune','Konkan'))
OR(p.name = 'Coconut'          AND r.state_name IN ('Konkan','Sindhudurg','Raigad'))
OR(p.name = 'Jackfruit'        AND r.state_name IN ('Konkan','Sindhudurg','Raigad'))
OR(p.name = 'Amla'             AND r.state_name IN ('Nashik','Aurangabad','Pune','Marathwada'))
OR(p.name = 'Strawberry'       AND r.state_name IN ('Satara','Western Ghats'))
OR(p.name = 'Fig'              AND r.state_name IN ('Pune'))
OR(p.name = 'Ber'              AND r.state_name IN ('Solapur','Osmanabad','Latur','Aurangabad'))
OR(p.name = 'Rice'             AND r.state_name IN ('Konkan','Sindhudurg','Raigad','Nashik','Vidarbha','Amravati'))
OR(p.name = 'Wheat'            AND r.state_name IN ('Nashik','Pune','Aurangabad','Solapur','Amravati','Nagpur'))
OR(p.name = 'Jowar'            AND r.state_name IN ('Solapur','Osmanabad','Latur','Aurangabad','Nashik','Vidarbha'))
OR(p.name = 'Bajra'            AND r.state_name IN ('Nashik','Jalgaon','Dhule','Aurangabad'))
OR(p.name = 'Maize'            AND r.state_name IN ('Nashik','Pune','Aurangabad','Amravati'))
OR(p.name = 'Ragi'             AND r.state_name IN ('Nashik','Pune','Nandurbar','Konkan'))
OR(p.name = 'Kodo Millet'      AND r.state_name IN ('Nashik','Nandurbar','Amravati'))
OR(p.name = 'Little Millet'    AND r.state_name IN ('Nashik','Nandurbar'))
OR(p.name = 'Foxtail Millet'   AND r.state_name IN ('Nashik','Aurangabad','Nandurbar'))
OR(p.name = 'Barnyard Millet'  AND r.state_name IN ('Nashik','Aurangabad','Nandurbar','Konkan'))
OR(p.name = 'Proso Millet'     AND r.state_name IN ('Marathwada','Vidarbha','Aurangabad'))
OR(p.name = 'Tur (Pigeon Pea)' AND r.state_name IN ('Latur','Osmanabad','Aurangabad','Solapur','Amravati','Nagpur'))
OR(p.name = 'Chickpea'         AND r.state_name IN ('Latur','Osmanabad','Aurangabad','Amravati','Nagpur'))
OR(p.name = 'Moong (Green Gram)'AND r.state_name IN ('Nashik','Aurangabad','Pune','Amravati'))
OR(p.name = 'Urad (Black Gram)'AND r.state_name IN ('Latur','Osmanabad','Aurangabad','Amravati','Nagpur'))
OR(p.name = 'Masoor (Lentil)'  AND r.state_name IN ('Latur','Osmanabad','Amravati'))
OR(p.name = 'Soybean'          AND r.state_name IN ('Amravati','Nagpur','Latur','Osmanabad','Nashik'))
OR(p.name = 'Groundnut'        AND r.state_name IN ('Amravati','Nagpur','Nashik','Jalgaon','Solapur'))
OR(p.name = 'Sesame'           AND r.state_name IN ('Aurangabad','Jalgaon','Nashik','Osmanabad'))
OR(p.name = 'Sunflower'        AND r.state_name IN ('Solapur','Latur','Osmanabad','Aurangabad','Nashik'));


-- ══════════════════════════════════════════════════════════
--  SECTION I :  PRODUCE ↔ SEASON MAP
-- ══════════════════════════════════════════════════════════
INSERT INTO produce_season_map (produce_id, season_id)
SELECT p.produce_id, s.season_id
FROM produce p, seasons s
WHERE
  (p.name IN ('Mango','Papaya','Guava') AND s.season_name = 'Zaid')
OR(p.name IN ('Rice','Jowar','Bajra','Maize','Ragi','Kodo Millet','Little Millet',
               'Foxtail Millet','Barnyard Millet','Proso Millet','Tur (Pigeon Pea)',
               'Moong (Green Gram)','Urad (Black Gram)','Soybean','Groundnut','Sesame')
               AND s.season_name = 'Kharif')
OR(p.name IN ('Wheat','Grapes','Orange','Chickpea','Masoor (Lentil)','Sunflower')
               AND s.season_name = 'Rabi')
OR(p.name IN ('Banana','Coconut','Jackfruit','Sapota','Custard Apple','Pomegranate')
               AND s.season_name = 'Year-round')
OR(p.name IN ('Amla','Ber','Strawberry','Fig') AND s.season_name = 'Rabi');


-- ══════════════════════════════════════════════════════════
--  SECTION J :  TAGS  ↔  PRODUCE MAP
-- ══════════════════════════════════════════════════════════
INSERT INTO produce_tags_map (produce_id, tag_id)
SELECT p.produce_id, t.tag_id
FROM produce p, tags t
WHERE
-- GI Tags
  (t.tag_name = 'GI-Tagged' AND p.name IN ('Mango','Pomegranate','Grapes','Banana','Orange','Fig','Rice'))
-- Cereal category
OR(t.tag_name = 'Cereal'    AND p.name IN ('Rice','Wheat','Jowar','Bajra','Maize'))
-- Millet category
OR(t.tag_name = 'Millet'    AND p.name IN ('Jowar','Bajra','Ragi','Kodo Millet','Little Millet',
                                            'Foxtail Millet','Barnyard Millet','Proso Millet'))
-- Pulse category
OR(t.tag_name = 'Pulse'     AND p.name IN ('Tur (Pigeon Pea)','Chickpea','Moong (Green Gram)',
                                            'Urad (Black Gram)','Masoor (Lentil)'))
-- Oilseed category
OR(t.tag_name = 'Oilseed'   AND p.name IN ('Soybean','Groundnut','Sesame','Sunflower'))
-- Fruit category
OR(t.tag_name = 'Fruit'     AND p.type = 'fruit')
-- Export quality
OR(t.tag_name = 'Export Quality' AND p.name IN ('Mango','Grapes','Pomegranate','Banana',
                                                  'Orange','Chickpea','Soybean','Sesame'))
-- Traditional Maharashtra
OR(t.tag_name = 'Traditional Maharashtra' AND p.name IN ('Jowar','Bajra','Ragi','Rice','Tur (Pigeon Pea)',
                                                          'Groundnut','Mango','Amla'))
-- Nutritional Powerhouse
OR(t.tag_name = 'Nutritional Powerhouse' AND p.name IN ('Ragi','Sesame','Soybean','Amla','Guava',
                                                         'Bajra','Moong (Green Gram)','Urad (Black Gram)'))
-- Drought Tolerant
OR(t.tag_name = 'Drought Tolerant' AND p.name IN ('Jowar','Bajra','Groundnut','Kodo Millet',
                                                    'Foxtail Millet','Barnyard Millet','Ber',
                                                    'Custard Apple','Sesame','Soybean'))
-- Heritage varieties
OR(t.tag_name = 'Heritage' AND p.name IN ('Jowar','Rice','Wheat','Coconut','Jackfruit','Amla','Sesame'))
-- Superfood
OR(t.tag_name = 'Superfood' AND p.name IN ('Amla','Guava','Pomegranate','Ragi','Sesame',
                                            'Moong (Green Gram)','Soybean'))
-- Staple
OR(t.tag_name = 'Staple'    AND p.name IN ('Rice','Wheat','Jowar','Bajra','Tur (Pigeon Pea)','Chickpea'))
-- Cash Crop
OR(t.tag_name = 'Cash Crop' AND p.name IN ('Grapes','Pomegranate','Banana','Soybean','Groundnut',
                                            'Sunflower','Mango'));


-- ══════════════════════════════════════════════════════════
--  SECTION K :  SAMPLE MARKET PRICES
--  (Indicative wholesale mandi prices, Maharashtra 2023–24)
-- ══════════════════════════════════════════════════════════
INSERT INTO market_prices (produce_id, subtype_id, market_name, price, unit, recorded_date)
SELECT p.produce_id, NULL,
       mp.market, mp.price, mp.unit, mp.rdate::DATE
FROM produce p
JOIN (VALUES
  ('Mango',              'Ratnagiri APMC',       350.00, 'per kg',      '2024-04-15'),
  ('Grapes',             'Nashik APMC',            55.00, 'per kg',      '2024-02-10'),
  ('Orange',             'Nagpur APMC',            40.00, 'per kg',      '2023-12-20'),
  ('Banana',             'Jalgaon APMC',           18.00, 'per kg',      '2024-01-15'),
  ('Guava',              'Nashik APMC',            25.00, 'per kg',      '2024-03-01'),
  ('Pomegranate',        'Solapur APMC',          120.00, 'per kg',      '2024-01-20'),
  ('Custard Apple',      'Nashik APMC',            80.00, 'per kg',      '2023-10-15'),
  ('Papaya',             'Pune APMC',              20.00, 'per kg',      '2024-02-01'),
  ('Sapota',             'Nashik APMC',            35.00, 'per kg',      '2024-02-15'),
  ('Coconut',            'Ratnagiri APMC',         15.00, 'per piece',   '2024-01-10'),
  ('Strawberry',         'Satara APMC',           200.00, 'per kg',      '2024-01-20'),
  ('Fig',                'Pune APMC',             400.00, 'per kg',      '2024-02-10'),
  ('Amla',               'Nashik APMC',            30.00, 'per kg',      '2023-11-20'),
  ('Ber',                'Solapur APMC',           35.00, 'per kg',      '2024-01-05'),
  ('Rice',               'Ratnagiri APMC',       3200.00, 'per quintal', '2024-01-15'),
  ('Wheat',              'Nashik APMC',           2800.00, 'per quintal', '2024-02-15'),
  ('Jowar',              'Solapur APMC',          3500.00, 'per quintal', '2024-02-01'),
  ('Bajra',              'Nashik APMC',           2500.00, 'per quintal', '2023-11-10'),
  ('Maize',              'Nashik APMC',           2000.00, 'per quintal', '2023-11-15'),
  ('Ragi',               'Nashik APMC',           3800.00, 'per quintal', '2023-11-20'),
  ('Tur (Pigeon Pea)',   'Latur APMC',            7500.00, 'per quintal', '2024-01-20'),
  ('Chickpea',           'Latur APMC',            5800.00, 'per quintal', '2024-03-01'),
  ('Moong (Green Gram)', 'Nashik APMC',           8000.00, 'per quintal', '2023-11-05'),
  ('Urad (Black Gram)',  'Nanded APMC',           7000.00, 'per quintal', '2023-11-10'),
  ('Masoor (Lentil)',    'Latur APMC',            6500.00, 'per quintal', '2024-02-20'),
  ('Soybean',            'Latur APMC',            4800.00, 'per quintal', '2023-11-01'),
  ('Groundnut',          'Akola APMC',            5500.00, 'per quintal', '2023-11-15'),
  ('Sesame',             'Aurangabad APMC',      12000.00, 'per quintal', '2023-11-20'),
  ('Sunflower',          'Solapur APMC',          6000.00, 'per quintal', '2024-02-15'),
  ('Kodo Millet',        'Nashik APMC',           4500.00, 'per quintal', '2023-11-10'),
  ('Little Millet',      'Nashik APMC',           5000.00, 'per quintal', '2023-11-10'),
  ('Foxtail Millet',     'Aurangabad APMC',       4800.00, 'per quintal', '2023-11-15'),
  ('Barnyard Millet',    'Nashik APMC',           5500.00, 'per quintal', '2023-11-20'),
  ('Proso Millet',       'Aurangabad APMC',       5000.00, 'per quintal', '2023-11-10')
) AS mp(name, market, price, unit, rdate)
ON p.name = mp.name;


-- ══════════════════════════════════════════════════════════
--  SECTION L :  ADDITIONAL TAGS  (for new produce below)
-- ══════════════════════════════════════════════════════════
INSERT INTO tags (tag_name) VALUES
  ('Spice'),
  ('Vegetable'),
  ('Fibre Crop'),
  ('Industrial Crop'),
  ('Ayurvedic'),
  ('Anti-inflammatory'),
  ('GI-Pending'),
  ('Rainfed'),
  ('High-Value Export'),
  ('Fasting Food');


-- ══════════════════════════════════════════════════════════
--  SECTION M :  CASH CROPS & PLANTATION CROPS
-- ══════════════════════════════════════════════════════════

-- ──────────────────────────────────────────
-- M1. SUGARCANE  (Oos / Verdi)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Sugarcane', 'Saccharum officinarum', 'Cash Crop / Industrial',
   'Year-round', 'Oos / Verdi', 'Ganna', 'Sugarcane',
   'Maharashtra is India''s second-largest sugarcane and sugar-producing state. The Deccan plateau districts of Pune, Satara, Sangli, Kolhapur, Solapur, Nashik and Ahmednagar form the "Sugar Belt". Over 200 cooperative sugar factories operate. Maharashtra also leads in ethanol production from sugarcane. Crushed October–March after 10–14 months of growth. By-products: bagasse (energy), molasses (ethanol/alcohol), press mud (compost).');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Co-86032', 'Maharashtra', 'High sugar (CCS 12–13%), medium-thick cane',
        'Saccharum officinarum cv. Co-86032', 'Co-86032 Oos',
        'Most widely grown variety in Maharashtra sugar belt; high sucrose; Pune, Satara, Sangli, Kolhapur.'),
       ('CoC-671 (Karuppan)', 'Tamil Nadu/Maharashtra', 'Very high sugar, thick cane',
        'Saccharum officinarum cv. CoC-671', 'CoC-671 Oos',
        'Red cane; high CCS; drought-tolerant; Marathwada and Solapur belt.'),
       ('Co-94012', 'Maharashtra', 'High yield, high sugar, thin-medium cane',
        'Saccharum officinarum cv. Co-94012', 'Co-94012 Oos',
        'Developed for Maharashtra; resistant to red rot; Nashik, Ahmednagar, Pune.'),
       ('Phule-265 (VSI-434)', 'Maharashtra', 'High sugar, high yield, mid-late variety',
        'Saccharum officinarum cv. Phule-265', 'Phule Oos',
        'Developed at Vasantdada Sugar Institute, Pune; ideal for cooperative factories; Pune, Satara.'),
       ('Co-740', 'Maharashtra', 'Early maturity, good sugar recovery',
        'Saccharum officinarum cv. Co-740', 'Co-740 Oos',
        'Early variety; once the most grown in Maharashtra; being replaced by newer hybrids.'),
       ('MS-10001 (Phule Mahadhan)', 'Maharashtra', 'Very high yield, high CCS',
        'Saccharum officinarum cv. MS-10001', 'Phule Mahadhan Oos',
        'Latest high-yield release by MPKV and VSI; Pune, Satara, Sangli; water-efficient under drip.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Sugarcane';


-- ──────────────────────────────────────────
-- M2. COTTON  (Kapus)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('grain', 'Cotton', 'Gossypium hirsutum / Gossypium arboreum', 'Fibre Crop / Cash Crop',
   'Kharif', 'Kapus', 'Kapas', 'Cotton',
   'Maharashtra is India''s largest cotton-growing state, covering ~40–42 lakh hectares mainly in Vidarbha (Amravati, Wardha, Yavatmal, Akola, Buldhana) and Marathwada (Aurangabad, Jalgaon, Nanded). "White Gold" — cotton is the backbone of Vidarbha''s economy. Both Bt-hybrid cotton and traditional desi cotton (G. arboreum) are grown. Sown May–June on black cotton soil (vertisols); picked October–January.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Bt-RCH-2 (Bollgard I)', 'Maharashtra', 'High yield, long staple, bollworm resistant',
        'Gossypium hirsutum cv. RCH-2 Bt', 'RCH-2 Kapus',
        'First-generation Bt hybrid; most widely grown in Vidarbha; pink bollworm and bollworm resistant; 28–30mm fibre.'),
       ('Bt-MRC-7361 (Bollgard II)', 'Maharashtra', 'Very high yield, long fine fibre',
        'Gossypium hirsutum cv. MRC-7361 Bt', 'Bollgard-II Kapus',
        'Second-generation Bt (two-gene); dominant in Maharashtra post-2007; pink bollworm resistance; Vidarbha, Marathwada.'),
       ('JKCH-1947 Bt', 'Maharashtra', 'High yield, good fibre strength',
        'Gossypium hirsutum cv. JKCH-1947 Bt', 'JKCH Kapus',
        'JK Seeds hybrid; widely adopted in Amravati, Yavatmal; high seed cotton yield.'),
       ('Nandurbar Desi (ADB)', 'Maharashtra', 'Short staple, hardy, drought tolerant',
        'Gossypium arboreum cv. ADB', 'Desi Kapus',
        'Indigenous G. arboreum type; Nandurbar, Dhule, Jalgaon; very drought-tolerant; no pesticide needed; traditional fabric cotton.'),
       ('Phule Dhanwantari', 'Maharashtra', 'High yield, medium staple, hybrid',
        'Gossypium hirsutum cv. Phule Dhanwantari', 'Phule Dhanwantari Kapus',
        'MPKV Rahuri developed; recommended for rainfed Vidarbha; good disease package; multi-pest tolerant.'),
       ('Suraj (AKA-8401)', 'Maharashtra', 'Good fibre, high ginning outturn',
        'Gossypium hirsutum cv. Suraj', 'Suraj Kapus',
        'PDKV Akola variety; pure-line selection; Vidarbha dryland; recommended for rainfed cultivation.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Cotton';


-- ══════════════════════════════════════════════════════════
--  SECTION N :  VEGETABLES  (Major Maharashtra Vegetables)
-- ══════════════════════════════════════════════════════════

-- ──────────────────────────────────────────
-- N1. ONION  (Kanda)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('vegetable', 'Onion', 'Allium cepa', 'Vegetable / Spice',
   'Rabi', 'Kanda', 'Pyaaz', 'Onion',
   'Maharashtra is India''s largest onion-producing state (~40% national share). Nashik, Pune, Ahmednagar, Solapur and Satara are prime growing districts. Nashik''s Lasalgaon APMC is Asia''s largest onion market. Three crops a year possible: Kharif (June–October), Late Kharif (September–January), and Rabi (January–May). Major export crop to Europe, South-East Asia and Middle East.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Bhima Raj', 'Maharashtra', 'Mild-pungent, red-purple, firm, long shelf life',
        'Allium cepa cv. Bhima Raj', 'Bhima Raj Kanda',
        'ICAR-DOGR Pune; most popular commercial variety; excellent storage and export quality; Nashik, Pune, Ahmednagar; Rabi.'),
       ('Bhima Super', 'Maharashtra', 'Pungent, dark red, globular, good yield',
        'Allium cepa cv. Bhima Super', 'Bhima Super Kanda',
        'ICAR-DOGR; high yield; Rabi and Late Kharif; good storage; Nashik, Solapur.'),
       ('Bhima Kiran', 'Maharashtra', 'Pungent, reddish, high yield, Kharif',
        'Allium cepa cv. Bhima Kiran', 'Bhima Kiran Kanda',
        'Kharif/Late Kharif specialist; ICAR-DOGR; resistant to purple blotch; Pune, Nashik.'),
       ('N-2-4-1 (NHRDF)', 'Maharashtra', 'Mild pungent, red, medium bulb, Rabi',
        'Allium cepa cv. N-2-4-1', 'N-2-4-1 Kanda',
        'NHRDF variety; popular for Rabi; Maharashtra and Karnataka; export quality; Nashik.'),
       ('Agrifound Light Red', 'Maharashtra', 'Mild pungent, light red, good export',
        'Allium cepa cv. Agrifound Light Red', 'Phikka Lal Kanda',
        'NHRDF; light-red colour preferred in Europe; export-grade; Nashik, Pune.'),
       ('Phule Samarth', 'Maharashtra', 'Pungent, deep red, high yield, hybrid',
        'Allium cepa cv. Phule Samarth', 'Phule Samarth Kanda',
        'MPKV Rahuri F1 hybrid; very high yield; Rabi; excellent storage; recommended for export belt.'),
       ('Nasik Red (Local)', 'Maharashtra', 'Very pungent, classic red, traditional variety',
        'Allium cepa (local landrace)', 'Nashik Lal Kanda',
        'Traditional Nashik landrace; smaller bulb; intense flavour; preferred in domestic market and for export dehydration.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Onion';


-- ──────────────────────────────────────────
-- N2. TOMATO  (Tomato / Tamatar)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('vegetable', 'Tomato', 'Solanum lycopersicum', 'Vegetable',
   'Year-round', 'Tomato', 'Tamatar', 'Tomato',
   'Maharashtra is a top-3 tomato-producing state. Nashik, Pune, Satara, Ahmednagar and Solapur are major districts. Tomatoes are grown year-round under irrigated conditions; also a major processing crop for puree, paste and ketchup. Narayangaon (Pune) is an important tomato trading hub.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Phule Raja', 'Maharashtra', 'Firm, red, medium-large, good shelf life',
        'Solanum lycopersicum cv. Phule Raja', 'Phule Raja Tomato',
        'MPKV Rahuri; popular commercial variety; suitable for fresh market and processing; Maharashtra Rabi/summer.'),
       ('Namdhari NS-5252', 'Maharashtra', 'Firm, uniform red, hybrid, long shelf life',
        'Solanum lycopersicum cv. NS-5252', 'NS-5252 Tomato',
        'Namdhari Seeds F1 hybrid; widely grown in Nashik, Pune; good for transport and export.'),
       ('Syngenta Naveen', 'Maharashtra', 'Bright red, firm, medium, disease tolerant',
        'Solanum lycopersicum cv. Naveen', 'Naveen Tomato',
        'Popular hybrid; resistance to ToMV; Nashik, Satara; early bearing.'),
       ('Pusa Ruby', 'India', 'Medium red, slightly acidic, open-pollinated',
        'Solanum lycopersicum cv. Pusa Ruby', 'Pusa Ruby Tomato',
        'IARI variety; OPV; widely grown; Nashik, Pune; good for home gardens and subsistence farming.'),
       ('Arka Vikas', 'Maharashtra', 'Large, red, firm, good yield, OPV',
        'Solanum lycopersicum cv. Arka Vikas', 'Arka Vikas Tomato',
        'IIHR Bengaluru; adapted to Maharashtra; suitable for rainy season; wilt-tolerant.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Tomato';


-- ──────────────────────────────────────────
-- N3. SWEET LIME / MOSAMBI  (as separate produce)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Sweet Lime', 'Citrus limetta', 'Citrus',
   'Year-round', 'Mosambi', 'Mosambi', 'Sweet Lime / Mosambi',
   'Sweet Lime (Mosambi) is one of Maharashtra''s most commercially important citrus fruits, distinct from orange. Solapur, Osmanabad, Aurangabad, Pune and Nashik are major growing centres. Extremely popular for fresh juice; sold across India year-round. Maharashtra accounts for ~35% of India''s Mosambi production.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Sathgudi', 'Andhra Pradesh/Maharashtra', 'Mildly sweet, very juicy, thin skin',
        'Citrus limetta cv. Sathgudi', 'Sathgudi Mosambi',
        'Most widely grown Mosambi variety in Maharashtra; Solapur, Osmanabad; high juice content; year-round availability.'),
       ('Phule Mosambi-1', 'Maharashtra', 'Sweet, juicy, good rind colour',
        'Citrus limetta cv. Phule Mosambi-1', 'Phule Mosambi',
        'MPKV Rahuri developed; suitable for Maharashtra''s dry zones; good adaptation.'),
       ('Seedless Mosambi (Local)', 'Maharashtra', 'Sweet, nearly seedless, smooth skin',
        'Citrus limetta (seedless type)', 'Bijrahit Mosambi',
        'Seedless selections grown in Pune and Solapur; premium market; limited production.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Sweet Lime';


-- ──────────────────────────────────────────
-- N4. GARLIC  (Lasun)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('vegetable', 'Garlic', 'Allium sativum', 'Vegetable / Spice',
   'Rabi', 'Lasun', 'Lahsun', 'Garlic',
   'Garlic is an important Rabi spice crop in Maharashtra — Nashik, Satara, Solapur, Pune, Aurangabad. Maharashtra is among top-5 garlic-producing states. Sown October–November; harvested February–March. Maharashtra garlic is known for its pungency and high allicin content. Major export crop and ingredient in Indian cuisine and Ayurvedic medicine.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Yamuna Safed (G-1)', 'India', 'Strongly pungent, white, large cloves',
        'Allium sativum cv. Yamuna Safed', 'Yamuna Safed Lasun',
        'NHRDF variety; most popular in Maharashtra; large white bulb; good storage; Nashik, Pune.'),
       ('Phule Bahugunak', 'Maharashtra', 'Very pungent, big bulb, long shelf life',
        'Allium sativum cv. Phule Bahugunak', 'Phule Bahugunak Lasun',
        'MPKV Rahuri; specifically bred for Maharashtra conditions; high yield; Nashik, Satara.'),
       ('Agrifound White (G-41)', 'Maharashtra', 'Pungent, white, medium bulb, export quality',
        'Allium sativum cv. G-41', 'Safed Lasun',
        'NHRDF; export-grade white garlic; Maharashtra and Rajasthan; Nashik, Solapur.'),
       ('Desi Kali (Local Black Garlic)', 'Maharashtra', 'Strongly pungent, purple-tinged cloves',
        'Allium sativum (local landrace)', 'Desi Kali Lasun',
        'Indigenous variety; smaller bulb; intense flavour; drought tolerant; grown without irrigation in Marathwada.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Garlic';


-- ══════════════════════════════════════════════════════════
--  SECTION O :  SPICES OF MAHARASHTRA
-- ══════════════════════════════════════════════════════════

-- ──────────────────────────────────────────
-- O1. TURMERIC  (Halad)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('vegetable', 'Turmeric', 'Curcuma longa', 'Spice / Medicinal',
   'Kharif', 'Halad', 'Haldi', 'Turmeric',
   'Maharashtra is one of India''s top turmeric-producing states. Sangli, Kolhapur, Satara and Pune are major growing districts. Sangli''s Erande (Yelur) turmeric is GI-tagged and renowned for its high curcumin content (>4.5%). Harvested January–March after 8–9 months. Essential in Maharashtrian cooking, medicine (Ayurveda) and cosmetics. Major export to USA, Japan, EU.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Sangli Turmeric (Erande/Rajapuri)', 'Maharashtra', 'High curcumin (>4.5%), intense golden, earthy-bitter',
        'Curcuma longa cv. Rajapuri', 'Sangli Halad',
        'GI-tagged; grown in Sangli, Kolhapur, Satara; premium price; thick rhizome; dry and polished for export. Best curcumin content in world.'),
       ('Phule Swarnim', 'Maharashtra', 'High curcumin, good yield, improved variety',
        'Curcuma longa cv. Phule Swarnim', 'Phule Swarnim Halad',
        'MPKV Rahuri; specifically bred for Maharashtra; high curcumin and yield; Sangli, Satara.'),
       ('Selam', 'Tamil Nadu/Maharashtra', 'Medium curcumin, round finger, good yield',
        'Curcuma longa cv. Salem', 'Salem Halad',
        'Salem type; popular in Pune, Nashik; early maturing; bright yellow colour.'),
       ('Sugandham', 'Maharashtra', 'Aromatic, high oil, good curcumin',
        'Curcuma longa cv. Sugandham', 'Sugandhi Halad',
        'Aromatic variety; IISR Kozhikode; adapted to Maharashtra; good for value-added products.'),
       ('Pratibha', 'Maharashtra', 'High curcumin (4–5%), bold rhizome',
        'Curcuma longa cv. Pratibha', 'Pratibha Halad',
        'MPKV variety; Sangli and Kolhapur; high export value; disease-tolerant.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Turmeric';


-- ──────────────────────────────────────────
-- O2. CHILLI / HOT PEPPER  (Mirchi)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('vegetable', 'Chilli', 'Capsicum annuum', 'Spice / Vegetable',
   'Kharif', 'Mirchi', 'Mirch', 'Chilli / Hot Pepper',
   'Maharashtra is a major chilli-producing state. Aurangabad, Nashik, Pune, Latur, Osmanabad and Amravati are key districts for dry chilli production. Kolhapur Red Chilli is GI-tagged and one of the hottest and most flavourful in India. Chilli grown for fresh, dry, and powder markets. Key ingredient in Kolhapuri cuisine and Maharashtra masalas.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Kolhapuri Chilli (Lavangi)', 'Maharashtra', 'Extremely hot, deep red, smoky-earthy',
        'Capsicum annuum cv. Lavangi', 'Lavangi Mirchi',
        'GI-tagged; Kolhapur and Sangli; small, thin chilli; very high Scoville (>100,000 SHU); essential for Kolhapuri masala and dry red chilli powder; prized export variety.'),
       ('Phule Jyoti', 'Maharashtra', 'Medium hot, bright red, high yield',
        'Capsicum annuum cv. Phule Jyoti', 'Phule Jyoti Mirchi',
        'MPKV Rahuri; popular commercial variety; Maharashtra Kharif; good for fresh and dry use.'),
       ('Byadgi Chilli', 'Karnataka/Maharashtra', 'Mildly hot, deep red, high colour (ASTA)',
        'Capsicum annuum cv. Byadgi', 'Byadgi Mirchi',
        'Grown in Aurangabad and Osmanabad; bright colour without high pungency; ideal for colour-extraction and masala powders; high export demand.'),
       ('Kashmiri Chilli (Maharashtra Grown)', 'Maharashtra', 'Very mild, deep red, high colour',
        'Capsicum annuum cv. K-2', 'Kashmiri Mirchi',
        'Low-pungency variety grown in Maharashtra for colour; used in tandoori, butter chicken; Nashik and Aurangabad.'),
       ('Arka Meghana', 'Maharashtra', 'Hot, bold red fruit, high yield, hybrid',
        'Capsicum annuum cv. Arka Meghana', 'Arka Meghana Mirchi',
        'IIHR Bengaluru F1 hybrid; adapted to Maharashtra; wilt and virus resistant; Nashik, Pune.'),
       ('Pusa Jwala', 'India', 'Very hot, green to red, thin-walled, aromatic',
        'Capsicum annuum cv. Pusa Jwala', 'Pusa Jwala Mirchi',
        'IARI variety; widely grown across Maharashtra; popular for fresh green and dry red market; Nashik, Aurangabad.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Chilli';


-- ──────────────────────────────────────────
-- O3. GINGER  (Aale / Adrak)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('vegetable', 'Ginger', 'Zingiber officinale', 'Spice / Medicinal',
   'Kharif', 'Aale', 'Adrak', 'Ginger',
   'Ginger is grown in the high-rainfall Western Ghats districts of Maharashtra — Satara, Kolhapur, Sindhudurg, Pune (Maval). A Kharif crop, sown April–May and harvested November–December. Fresh green ginger and dried soonth (dried ginger powder) both produced. Maharashtra contributes ~8% of India''s ginger output. High value for domestic cooking and pharma/ayurvedic industry.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Mahadeo (Local Konkan)', 'Maharashtra', 'Very pungent, aromatic, high oil, spicy',
        'Zingiber officinale (local landrace)', 'Konkan Aale',
        'Traditional high-oil landrace from Western Ghats; Satara, Kolhapur, Sindhudurg; premium dried ginger (Soonth); high gingerol content.'),
       ('Suprabha', 'India (IISR)', 'Pungent, high yield, good oleoresin',
        'Zingiber officinale cv. Suprabha', 'Suprabha Aale',
        'ICAR-IISR Kozhikode; adapted to Maharashtra; high yield; good for fresh and processing market.'),
       ('Himgiri', 'Himachal Pradesh/Maharashtra', 'Medium pungent, high yield, large rhizome',
        'Zingiber officinale cv. Himgiri', 'Himgiri Aale',
        'Adapted to highlands; Satara and Pune hills; good fresh ginger yield.'),
       ('Rio-de-Janeiro', 'Brazil/Maharashtra', 'Mild pungent, plump rhizome, high fresh weight',
        'Zingiber officinale cv. Rio-de-Janeiro', 'Rio Aale',
        'Low fibre; preferred for fresh vegetable use; grown in Pune and Nashik irrigated areas.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Ginger';


-- ──────────────────────────────────────────
-- O4. TAMARIND  (Chincha)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Tamarind', 'Tamarindus indica', 'Fruit / Spice',
   'Rabi', 'Chincha', 'Imli', 'Tamarind',
   'Tamarind is a perennial tree crop widely found across Maharashtra, especially in Marathwada (Aurangabad, Osmanabad, Latur) and Vidarbha (Amravati, Nagpur). It is a rainfed, low-maintenance crop harvested January–April. Tamarind pulp, seed and shell all have commercial value. Key ingredient in Maharashtra''s chutneys, rasam-style dishes, and the famous Panha drink. Also used in pharmaceuticals, confectionery and food processing.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Pragati', 'Maharashtra', 'Sweet-sour, thick pulp, low seed, high yield',
        'Tamarindus indica cv. Pragati', 'Pragati Chincha',
        'Improved selection; high pulp-to-seed ratio; Maharashtra''s Marathwada belt; grafted plants available from MPKV.'),
       ('PKM-1', 'Tamil Nadu/Maharashtra', 'Sour-sweet, fleshy, low fibre, high pulp',
        'Tamarindus indica cv. PKM-1', 'PKM-1 Chincha',
        'Tamil Nadu variety adopted in Maharashtra; high yield; early bearing grafted plants; Nashik, Aurangabad.'),
       ('Urigam (Local)', 'Maharashtra', 'Sour, traditional, deep brown pulp',
        'Tamarindus indica (local landrace)', 'Sthanik Chincha',
        'Wild-type landraces grown along roads and forest margins; Marathwada; fruiting December–March; traditional harvest.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Tamarind';


-- ──────────────────────────────────────────
-- O5. FENUGREEK / METHI  (Methi)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('vegetable', 'Fenugreek', 'Trigonella foenum-graecum', 'Spice / Vegetable / Medicinal',
   'Rabi', 'Methi', 'Methi', 'Fenugreek / Methi',
   'Fenugreek (Methi) is grown across Maharashtra as a Rabi crop for its leaves (fresh vegetable) and seeds (spice). Nashik, Pune, Aurangabad and Solapur are major growing areas. The seeds are essential in Maharashtra''s goda masala, pickles and parathas. Rich in fenuside, fibre and iron. Also used medicinally for diabetes and lactation support.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Pusa Early Bunching', 'India', 'Mildly bitter, leafy, quick to bolt',
        'Trigonella foenum-graecum cv. Pusa Early Bunching', 'Lavkar Methi',
        'IARI; popular for fresh leaf market; short duration; Maharashtra Rabi; continuous harvest possible.'),
       ('Kasuri Methi (IARI-PEB)', 'India', 'Strongly aromatic, small leaf, dried use',
        'Trigonella foenum-graecum cv. Kasuri', 'Kasuri Methi',
        'Small-leafed aromatic variety; dried for culinary use; grown in Nashik and Pune; premium quality.'),
       ('RMt-1 (Rajasthan)', 'Rajasthan/Maharashtra', 'Bitter seeds, good leaf yield',
        'Trigonella foenum-graecum cv. RMt-1', 'RMt-1 Methi',
        'Good seed yield; adapted to Maharashtra Rabi; Nashik, Aurangabad; used for seed and fresh leaf both.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Fenugreek';


-- ──────────────────────────────────────────
-- O6. CORIANDER  (Kothimbir)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('vegetable', 'Coriander', 'Coriandrum sativum', 'Spice / Herb',
   'Rabi', 'Kothimbir', 'Dhaniya', 'Coriander / Dhania',
   'Coriander is one of Maharashtra''s most important spice crops, grown in Nashik, Pune, Satara, Aurangabad. Used both fresh (green coriander leaves) and dry (dhania seeds). Kothimbir Vadi (coriander fritters) is a signature Maharashtrian snack. Maharashtra is among India''s top-5 coriander-producing states. Season: October–January for leaves; February–March for seeds.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('CO-1', 'Maharashtra', 'Aromatic, high leaf yield, fresh market',
        'Coriandrum sativum cv. CO-1', 'CO-1 Kothimbir',
        'Tall plant; high green leaf yield; Nashik, Pune, Satara; widely grown for leaf market; successive harvests.'),
       ('Phule Suvarna', 'Maharashtra', 'Good seed yield, aromatic, dual purpose',
        'Coriandrum sativum cv. Phule Suvarna', 'Phule Suvarna Kothimbir',
        'MPKV Rahuri; dual-purpose (leaf + seed); Nashik; Rabi; popular with cooperative farms.'),
       ('Rajendra Swati', 'Maharashtra', 'High seed yield, aromatic, good oil',
        'Coriandrum sativum cv. Rajendra Swati', 'Rajendra Swati Kothimbir',
        'RAU Bihar; adapted to Maharashtra; high dhania (seed) yield; Nashik, Aurangabad.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Coriander';


-- ══════════════════════════════════════════════════════════
--  SECTION P :  ADDITIONAL FRUITS
-- ══════════════════════════════════════════════════════════

-- ──────────────────────────────────────────
-- P1. WATERMELON  (Kalingad)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Watermelon', 'Citrullus lanatus', 'Cucurbit Fruit',
   'Zaid', 'Kalingad', 'Tarbooz', 'Watermelon',
   'Watermelon is a major summer (Zaid) crop in Maharashtra — Nashik, Aurangabad, Solapur, Latur, Pune. Grown on sandy riverbed soils; sown February–March, harvested April–June. Maharashtra is a leading watermelon-producing state for domestic market. Large fruits preferred in Indian market; seedless hybrids gaining popularity.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Sugar Baby', 'USA/Maharashtra', 'Very sweet (Brix 10–12), dark green, small round',
        'Citrullus lanatus cv. Sugar Baby', 'Sugar Baby Kalingad',
        'Most popular variety in Maharashtra; compact fruit; deep red flesh; sold widely in Nashik, Nashik, Solapur.'),
       ('Arka Manik', 'India (IIHR)', 'Sweet, firm red flesh, high yield',
        'Citrullus lanatus cv. Arka Manik', 'Arka Manik Kalingad',
        'IIHR Bengaluru; striped green fruit; high sugar; 5–8 kg fruit; Nashik, Aurangabad.'),
       ('Phule Indrayani (Seedless)', 'Maharashtra', 'Sweet, seedless, crisp',
        'Citrullus lanatus cv. Phule Indrayani', 'Bijrahit Kalingad',
        'MPKV Rahuri seedless hybrid; premium market; Nashik valley; polliniser plants required.'),
       ('NS-295 (Namdhari)', 'Maharashtra', 'Very sweet, oblong, striped, red flesh',
        'Citrullus lanatus cv. NS-295', 'NS-295 Kalingad',
        'Namdhari Seeds F1; very high yield; Nashik, Solapur; excellent transport quality; large 8–10 kg fruit.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Watermelon';


-- ──────────────────────────────────────────
-- P2. MUSKMELON / KHARBUJ  (Kharbuja)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Muskmelon', 'Cucumis melo', 'Cucurbit Fruit',
   'Zaid', 'Kharbuja', 'Kharbuja', 'Muskmelon / Cantaloupe',
   'Muskmelon (Kharbuj) is an important summer fruit crop in Maharashtra — Nashik, Pune, Solapur, Jalgaon. Grown on sandy loam soils; excellent in Godavari and Bhima river basin. Season March–June. High demand for fresh consumption and cooling drinks.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Arka Rajhans', 'India (IIHR)', 'Very sweet, orange flesh, aromatic, netted skin',
        'Cucumis melo cv. Arka Rajhans', 'Arka Rajhans Kharbuja',
        'IIHR Bengaluru; popular in Maharashtra; cantaloupe type; netted rind; high Brix 12–14.'),
       ('Hara Madhu', 'India', 'Sweet, green flesh, smooth skin',
        'Cucumis melo cv. Hara Madhu', 'Hara Madhu Kharbuja',
        'Pale green smooth skin; classic Indian muskmelon; grown across Maharashtra; affordable and popular.'),
       ('Phule Shreshtha', 'Maharashtra', 'Sweet, high yield, good keeping quality',
        'Cucumis melo cv. Phule Shreshtha', 'Phule Shreshtha Kharbuja',
        'MPKV Rahuri; recommended for Maharashtra summer; Nashik, Pune; medium-large fruit.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Muskmelon';


-- ──────────────────────────────────────────
-- P3. LEMON / LIME  (Limbu)
-- ──────────────────────────────────────────
INSERT INTO produce
  (type, name, scientific_name, category, season, marathi_name, hindi_name, english_name, description)
VALUES
  ('fruit', 'Lemon', 'Citrus limon / Citrus aurantiifolia', 'Citrus',
   'Year-round', 'Limbu', 'Nimbu', 'Lemon / Lime',
   'Lemon and acid lime are widely grown across Maharashtra — Nashik, Pune, Aurangabad, Vidarbha. A perennial crop with year-round fruiting under irrigation. Widely used in Maharashtrian cuisine (limbu sherbet, chutneys, achaar), street food, and increasing export to the Gulf. Drought-tolerant once established.');

INSERT INTO subtypes
  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description)
SELECT p.produce_id, s.sn, s.os, s.tp, s.sc, s.mn, s.desc
FROM produce p,
     (VALUES
       ('Sai Sharbati', 'Maharashtra', 'Acidic, juicy, thin-skinned, aromatic',
        'Citrus limon cv. Sai Sharbati', 'Sai Sharbati Limbu',
        'Popular commercial variety in Maharashtra; Nashik, Pune; high juice content; year-round fruiting.'),
       ('Phule Saurabh', 'Maharashtra', 'Acidic, aromatic, high juice, soft rind',
        'Citrus limon cv. Phule Saurabh', 'Phule Saurabh Limbu',
        'MPKV Rahuri; improved lemon variety; suitable for drip-irrigated orchards; Nashik, Aurangabad.'),
       ('Seedless Lime', 'Maharashtra', 'Acidic, thin-skinned, nearly seedless',
        'Citrus aurantiifolia (seedless type)', 'Bijrahit Limbu',
        'Acid lime type; Konkan and Pune; very popular for household use and street food vendors.'),
       ('Eureka Lemon', 'USA/Maharashtra', 'Strongly acidic, aromatic, thick-skinned',
        'Citrus limon cv. Eureka', 'Eureka Limbu',
        'Introduced variety; grown in Nashik and Pune; export-quality large lemon; increasing adoption.')
     ) AS s(sn, os, tp, sc, mn, desc)
WHERE p.name = 'Lemon';


-- ══════════════════════════════════════════════════════════
--  SECTION Q :  NUTRITION FACTS (new produce)
-- ══════════════════════════════════════════════════════════
INSERT INTO nutrition_facts
  (produce_id, calories, protein_g, carbs_g, fiber_g, fat_g, vitamins, minerals, per_quantity)
SELECT p.produce_id,
       n.cal, n.prot, n.carbs, n.fiber, n.fat, n.vit, n.min, '100g'
FROM produce p
JOIN (VALUES
  -- Cash Crops (raw / fresh reference values)
  ('Sugarcane',    38.0,  0.27,  9.50, 0.6,  0.11,
   'Vitamin C 1mg, Riboflavin 0.01mg, Niacin 0.2mg',
   'Potassium 140mg, Calcium 11mg, Iron 0.37mg, Magnesium 12mg'),
  ('Cotton',        0.0,  0.0,   0.0,  0.0,  0.0,
   'N/A — fibre crop; cottonseed oil: Vitamin E 28.4mg per 100ml',
   'Cottonseed oil: Phosphorus, Iron; Cottonseed meal: high protein ~36%'),
  -- Vegetables
  ('Onion',        40.0,  1.10,  9.34, 1.7,  0.10,
   'Vitamin C 7.4mg, Folate 19μg, Vitamin B6 0.12mg, Vitamin K 0.4μg',
   'Potassium 146mg, Calcium 23mg, Phosphorus 29mg, Iron 0.21mg'),
  ('Tomato',       18.0,  0.88,  3.89, 1.2,  0.20,
   'Vitamin C 13.7mg, Vitamin A 42μg, Folate 15μg, Vitamin K 7.9μg',
   'Potassium 237mg, Calcium 10mg, Magnesium 11mg, Phosphorus 24mg'),
  ('Garlic',      149.0,  6.36, 33.06, 2.1,  0.50,
   'Vitamin C 31.2mg, Vitamin B6 1.24mg, Thiamine 0.20mg, Folate 3μg',
   'Manganese 1.67mg, Calcium 181mg, Phosphorus 153mg, Iron 1.70mg'),
  ('Sweet Lime',   43.0,  0.70, 10.60, 0.5,  0.30,
   'Vitamin C 50mg, Folate 20μg, Thiamine 0.05mg',
   'Potassium 180mg, Calcium 27mg, Magnesium 10mg'),
  -- Spices
  ('Turmeric',    354.0,  7.83, 64.93, 21.1,  9.88,
   'Vitamin C 25.9mg, Vitamin B6 1.80mg, Niacin 5.14mg, Folate 39μg',
   'Iron 41.4mg, Calcium 183mg, Potassium 2525mg, Manganese 7.83mg, Magnesium 193mg'),
  ('Chilli',       40.0,  1.87,  8.81, 1.5,  0.44,
   'Vitamin C 143.7mg, Vitamin A 59μg, Vitamin B6 0.51mg, Vitamin K 14μg',
   'Potassium 322mg, Calcium 14mg, Iron 1.03mg, Magnesium 23mg'),
  ('Ginger',       80.0,  1.82, 17.77, 2.0,  0.75,
   'Vitamin C 5mg, Vitamin B6 0.16mg, Niacin 0.75mg, Folate 11μg',
   'Potassium 415mg, Magnesium 43mg, Phosphorus 34mg, Iron 0.60mg'),
  ('Fenugreek',   323.0, 23.00, 58.35, 24.6,  6.41,
   'Vitamin C 3mg, Thiamine 0.32mg, Riboflavin 0.37mg, Niacin 1.64mg',
   'Iron 33.5mg, Calcium 176mg, Potassium 770mg, Magnesium 191mg'),
  ('Coriander',   298.0, 12.37, 54.99, 41.9, 17.77,
   'Vitamin C 21mg, Vitamin K 310μg, Vitamin A 337μg, Folate 0μg',
   'Calcium 709mg, Iron 16.32mg, Potassium 1267mg, Magnesium 330mg'),
  ('Tamarind',    239.0,  2.80, 62.50, 5.1,  0.60,
   'Thiamine 0.43mg, Niacin 1.94mg, Riboflavin 0.15mg',
   'Potassium 628mg, Iron 2.80mg, Magnesium 92mg, Phosphorus 113mg'),
  -- Additional Fruits
  ('Watermelon',   30.0,  0.61,  7.55, 0.4,  0.15,
   'Vitamin C 8.1mg, Vitamin A 28μg, Vitamin B6 0.04mg',
   'Potassium 112mg, Magnesium 10mg, Calcium 7mg'),
  ('Muskmelon',    34.0,  0.84,  8.16, 0.9,  0.19,
   'Vitamin C 36.7mg, Vitamin A 169μg, Folate 21μg',
   'Potassium 267mg, Calcium 9mg, Magnesium 12mg'),
  ('Lemon',        29.0,  1.10,  9.32, 2.8,  0.30,
   'Vitamin C 53mg, Folate 11μg, Vitamin B6 0.08mg',
   'Potassium 138mg, Calcium 26mg, Magnesium 8mg')
) AS n(name, cal, prot, carbs, fiber, fat, vit, min)
ON p.name = n.name;


-- ══════════════════════════════════════════════════════════
--  SECTION R :  REGION MAP (new produce)
-- ══════════════════════════════════════════════════════════
INSERT INTO produce_region_map (produce_id, region_id)
SELECT p.produce_id, r.region_id
FROM produce p, regions r
WHERE
  (p.name = 'Sugarcane'   AND r.state_name IN ('Pune','Satara','Sangli','Kolhapur','Solapur','Nashik'))
OR(p.name = 'Cotton'      AND r.state_name IN ('Amravati','Vidarbha','Aurangabad','Jalgaon','Marathwada'))
OR(p.name = 'Onion'       AND r.state_name IN ('Nashik','Pune','Solapur','Satara','Sangli'))
OR(p.name = 'Tomato'      AND r.state_name IN ('Nashik','Pune','Satara','Solapur'))
OR(p.name = 'Garlic'      AND r.state_name IN ('Nashik','Satara','Solapur','Pune'))
OR(p.name = 'Sweet Lime'  AND r.state_name IN ('Solapur','Osmanabad','Aurangabad','Pune','Nashik'))
OR(p.name = 'Turmeric'    AND r.state_name IN ('Sangli','Kolhapur','Satara','Pune'))
OR(p.name = 'Chilli'      AND r.state_name IN ('Aurangabad','Nashik','Pune','Latur','Osmanabad','Kolhapur'))
OR(p.name = 'Ginger'      AND r.state_name IN ('Satara','Kolhapur','Sindhudurg','Western Ghats'))
OR(p.name = 'Tamarind'    AND r.state_name IN ('Aurangabad','Osmanabad','Latur','Amravati','Nagpur'))
OR(p.name = 'Fenugreek'   AND r.state_name IN ('Nashik','Pune','Aurangabad','Solapur'))
OR(p.name = 'Coriander'   AND r.state_name IN ('Nashik','Pune','Satara','Aurangabad'))
OR(p.name = 'Watermelon'  AND r.state_name IN ('Nashik','Aurangabad','Solapur','Pune'))
OR(p.name = 'Muskmelon'   AND r.state_name IN ('Nashik','Pune','Solapur','Jalgaon'))
OR(p.name = 'Lemon'       AND r.state_name IN ('Nashik','Pune','Aurangabad','Nagpur'));


-- ══════════════════════════════════════════════════════════
--  SECTION S :  SEASON MAP (new produce)
-- ══════════════════════════════════════════════════════════
INSERT INTO produce_season_map (produce_id, season_id)
SELECT p.produce_id, s.season_id
FROM produce p, seasons s
WHERE
  (p.name IN ('Sugarcane')               AND s.season_name = 'Year-round')
OR(p.name IN ('Cotton')                  AND s.season_name = 'Kharif')
OR(p.name IN ('Onion','Garlic','Fenugreek','Coriander','Sweet Lime') AND s.season_name = 'Rabi')
OR(p.name IN ('Tomato','Lemon','Tamarind') AND s.season_name = 'Year-round')
OR(p.name IN ('Turmeric','Chilli','Ginger') AND s.season_name = 'Kharif')
OR(p.name IN ('Watermelon','Muskmelon') AND s.season_name = 'Zaid');


-- ══════════════════════════════════════════════════════════
--  SECTION T :  TAGS MAP (new produce)
-- ══════════════════════════════════════════════════════════
INSERT INTO produce_tags_map (produce_id, tag_id)
SELECT p.produce_id, t.tag_id
FROM produce p, tags t
WHERE
  (t.tag_name = 'Cash Crop'          AND p.name IN ('Sugarcane','Cotton','Onion','Turmeric'))
OR(t.tag_name = 'Fibre Crop'         AND p.name IN ('Cotton'))
OR(t.tag_name = 'Industrial Crop'    AND p.name IN ('Sugarcane','Cotton'))
OR(t.tag_name = 'Spice'              AND p.name IN ('Turmeric','Chilli','Ginger','Fenugreek','Coriander','Garlic'))
OR(t.tag_name = 'Vegetable'          AND p.name IN ('Onion','Tomato','Garlic','Fenugreek','Coriander','Chilli','Ginger'))
OR(t.tag_name = 'Fruit'              AND p.name IN ('Sweet Lime','Watermelon','Muskmelon','Lemon','Tamarind'))
OR(t.tag_name = 'Ayurvedic'          AND p.name IN ('Turmeric','Ginger','Fenugreek','Amla','Tamarind'))
OR(t.tag_name = 'Anti-inflammatory'  AND p.name IN ('Turmeric','Ginger','Fenugreek'))
OR(t.tag_name = 'GI-Tagged'          AND p.name IN ('Turmeric','Chilli'))
OR(t.tag_name = 'Export Quality'     AND p.name IN ('Onion','Turmeric','Chilli','Sugarcane','Garlic'))
OR(t.tag_name = 'Nutritional Powerhouse' AND p.name IN ('Turmeric','Fenugreek','Coriander','Ginger'))
OR(t.tag_name = 'Drought Tolerant'   AND p.name IN ('Cotton','Tamarind','Lemon','Garlic'))
OR(t.tag_name = 'High-Yield'         AND p.name IN ('Sugarcane','Onion','Tomato','Watermelon'))
OR(t.tag_name = 'Traditional Maharashtra' AND p.name IN ('Turmeric','Coriander','Fenugreek','Tamarind','Chilli'));


-- ══════════════════════════════════════════════════════════
--  SECTION U :  MARKET PRICES (new produce)
--  (Indicative wholesale mandi prices, Maharashtra 2023–24)
-- ══════════════════════════════════════════════════════════
INSERT INTO market_prices (produce_id, subtype_id, market_name, price, unit, recorded_date)
SELECT p.produce_id, NULL,
       mp.market, mp.price, mp.unit, mp.rdate::DATE
FROM produce p
JOIN (VALUES
  ('Sugarcane',   'Pune APMC',            350.00,  'per tonne',   '2024-01-15'),
  ('Cotton',      'Akola APMC',          7000.00,  'per quintal', '2023-11-20'),
  ('Onion',       'Nashik (Lasalgaon)',    800.00,  'per quintal', '2024-02-10'),
  ('Tomato',      'Nashik APMC',          1200.00, 'per quintal', '2024-02-15'),
  ('Sweet Lime',  'Solapur APMC',           30.00, 'per kg',      '2024-02-20'),
  ('Garlic',      'Nashik APMC',          8000.00, 'per quintal', '2024-02-01'),
  ('Turmeric',    'Sangli APMC',          9500.00, 'per quintal', '2024-01-10'),
  ('Chilli',      'Kolhapur APMC',        6000.00, 'per quintal', '2023-12-15'),
  ('Ginger',      'Satara APMC',          2800.00, 'per quintal', '2023-12-20'),
  ('Tamarind',    'Aurangabad APMC',      9000.00, 'per quintal', '2024-01-25'),
  ('Fenugreek',   'Nashik APMC',          6500.00, 'per quintal', '2024-02-05'),
  ('Coriander',   'Nashik APMC',          7200.00, 'per quintal', '2024-02-08'),
  ('Watermelon',  'Nashik APMC',            800.00,'per quintal', '2024-04-01'),
  ('Muskmelon',   'Pune APMC',             1200.00,'per quintal', '2024-04-10'),
  ('Lemon',       'Nashik APMC',          6000.00, 'per quintal', '2024-03-15')
) AS mp(name, market, price, unit, rdate)
ON p.name = mp.name;


-- ══════════════════════════════════════════════════════════
--  SECTION V :  LOCAL NAMES (new produce)
-- ══════════════════════════════════════════════════════════
INSERT INTO local_names (produce_id, language, name)
SELECT p.produce_id, 'Marathi', p.marathi_name
FROM produce p
WHERE p.name IN ('Sugarcane','Cotton','Onion','Tomato','Sweet Lime','Garlic',
                 'Turmeric','Chilli','Ginger','Tamarind','Fenugreek','Coriander',
                 'Watermelon','Muskmelon','Lemon')
AND p.marathi_name IS NOT NULL;

INSERT INTO local_names (produce_id, language, name)
SELECT p.produce_id, 'Hindi', p.hindi_name
FROM produce p
WHERE p.name IN ('Sugarcane','Cotton','Onion','Tomato','Sweet Lime','Garlic',
                 'Turmeric','Chilli','Ginger','Tamarind','Fenugreek','Coriander',
                 'Watermelon','Muskmelon','Lemon')
AND p.hindi_name IS NOT NULL;

INSERT INTO local_names (produce_id, language, name)
SELECT p.produce_id, 'English', p.english_name
FROM produce p
WHERE p.name IN ('Sugarcane','Cotton','Onion','Tomato','Sweet Lime','Garlic',
                 'Turmeric','Chilli','Ginger','Tamarind','Fenugreek','Coriander',
                 'Watermelon','Muskmelon','Lemon')
AND p.english_name IS NOT NULL;


-- ══════════════════════════════════════════════════════════
--  END OF SEED FILE
--  ┌─────────────────────────────────────────────────────┐
--  │  COMPLETE SUMMARY                                   │
--  │  Produce items  : 50  (35 original + 15 new)       │
--  │  Subtypes       : 200+ (150 original + 60+ new)    │
--  │  Regions        : 20  (Maharashtra districts/zones) │
--  │  Seasons        : 6                                 │
--  │  Tags           : 30  (20 original + 10 new)       │
--  │  Nutrition facts: 50  (all produce covered)        │
--  │  Local names    : Marathi · Hindi · English        │
--  │  Market prices  : 49 APMCs                         │
--  │                                                     │
--  │  CATEGORIES COVERED                                 │
--  │  ✔ Fruits (15): Mango, Grapes, Orange, Banana,    │
--  │     Guava, Pomegranate, Custard Apple, Papaya,     │
--  │     Sapota, Coconut, Jackfruit, Amla, Strawberry, │
--  │     Fig, Ber, Sweet Lime, Watermelon,              │
--  │     Muskmelon, Lemon, Tamarind                     │
--  │  ✔ Cereals (6): Rice, Wheat, Jowar, Bajra,        │
--  │     Maize, Ragi                                     │
--  │  ✔ Millets (5): Kodo, Little, Foxtail, Barnyard,  │
--  │     Proso                                           │
--  │  ✔ Pulses (5): Tur, Chickpea, Moong, Urad,        │
--  │     Masoor                                          │
--  │  ✔ Oilseeds (4): Soybean, Groundnut, Sesame,      │
--  │     Sunflower                                       │
--  │  ✔ Cash Crops (2): Sugarcane, Cotton              │
--  │  ✔ Vegetables (4): Onion, Tomato, Garlic,         │
--  │     Fenugreek                                       │
--  │  ✔ Spices (5): Turmeric, Chilli, Ginger,          │
--  │     Coriander + Garlic/Fenugreek (dual-category)  │
--  │                                                     │
--  │  Multi-state extension: add rows to regions table   │
--  │  and use produce_region_map for other states.       │
--  └─────────────────────────────────────────────────────┘
-- ══════════════════════════════════════════════════════════


-- ============================================================
--  GreenWings Maharashtra — COMPLETION PATCH
--  Fills all gaps in greenwings_maharashtra_seed__1_.sql
--  Apply AFTER running the seed file.
--
--  Gaps addressed:
--   1. Missing regions: Vidarbha & Marathwada (used in maps but not inserted)
--   2. Missing market prices: Jackfruit, Coconut (fruits), Cotton (cash crop)
--   3. Unmapped new tags: Fasting Food, High-Value Export, GI-Pending
--   4. Duplicate tag fix: 'Rainfed' was re-inserted in Section L
--   5. Produce–tag mappings for all Section L tags on relevant produce
--   6. Additional useful tag mappings (Organic, Superfood, Irrigated, etc.)
-- ============================================================


-- ──────────────────────────────────────────
-- 1. MISSING REGIONS
--    'Vidarbha' and 'Marathwada' are referenced in produce_region_map
--    but were never inserted into the regions table.
--    All other references (Konkan, Western Ghats, etc.) already exist.
-- ──────────────────────────────────────────
INSERT INTO regions (state_name, climate_type) VALUES
  ('Vidarbha',    'Hot Semi-arid'),   -- referenced in Cotton/Jowar/Rice/Barnyard Millet maps
  ('Marathwada',  'Hot Dry Semi-arid') -- referenced in Proso Millet/Cotton/Chickpea maps
ON CONFLICT DO NOTHING;


-- ──────────────────────────────────────────
-- 2. MISSING MARKET PRICES
--    Jackfruit and Coconut were in Section A (Fruits) but omitted from
--    Section K (Market Prices). Cotton was in Section M but omitted
--    from both Section K and Section U.
--    (Indicative wholesale mandi prices, Maharashtra 2023–24)
-- ──────────────────────────────────────────
INSERT INTO market_prices (produce_id, subtype_id, market_name, price, unit, recorded_date)
SELECT p.produce_id, NULL,
       mp.market, mp.price, mp.unit, mp.rdate::DATE
FROM produce p
JOIN (VALUES
  ('Jackfruit',  'Ratnagiri APMC',   40.00,  'per kg',      '2024-05-15'),
  ('Coconut',    'Sindhudurg APMC',  18.00,  'per piece',   '2024-02-01'),
  ('Cotton',     'Yavatmal APMC',  7200.00,  'per quintal', '2023-11-25')
) AS mp(name, market, price, unit, rdate)
ON p.name = mp.name;


-- ──────────────────────────────────────────
-- 3. FIX DUPLICATE 'Rainfed' TAG
--    'Rainfed' was inserted in the original 20 tags (Section 3)
--    AND again in Section L. Remove the duplicate to avoid
--    double-mapping issues. Keep whichever has the lower tag_id.
-- ──────────────────────────────────────────
-- Delete the higher-id duplicate of Rainfed (the one added in Section L)
DELETE FROM tags
WHERE tag_name = 'Rainfed'
  AND tag_id = (
    SELECT MAX(tag_id) FROM tags WHERE tag_name = 'Rainfed'
  );


-- ──────────────────────────────────────────
-- 4. PRODUCE–TAG MAPPINGS  (Section L new tags)
--
--  Tags added in Section L that were never mapped:
--    Fasting Food    → Little Millet, Barnyard Millet, Proso Millet
--    High-Value Export → Mango (Alphonso), Pomegranate, Grapes, Turmeric,
--                        Orange, Chickpea, Garlic, Sesame
--    GI-Pending      → Strawberry (Mahabaleshwar), Jowar (Maldandi)
--
--  Section L also added: Spice, Vegetable, Fibre Crop, Industrial Crop,
--  Ayurvedic, Anti-inflammatory — these are already mapped in Section T
--  EXCEPT for a few produce items listed below.
-- ──────────────────────────────────────────
INSERT INTO produce_tags_map (produce_id, tag_id)
SELECT p.produce_id, t.tag_id
FROM produce p, tags t
WHERE

-- Fasting Food
  (t.tag_name = 'Fasting Food'
   AND p.name IN ('Barnyard Millet','Little Millet','Proso Millet',
                  'Foxtail Millet','Kodo Millet','Watermelon','Muskmelon'))

-- High-Value Export
OR(t.tag_name = 'High-Value Export'
   AND p.name IN ('Mango','Pomegranate','Grapes','Banana','Orange',
                  'Turmeric','Chilli','Garlic','Onion','Sesame',
                  'Chickpea','Soybean','Fig','Strawberry'))

-- GI-Pending
OR(t.tag_name = 'GI-Pending'
   AND p.name IN ('Strawberry','Jowar','Rice','Jackfruit'))

-- Ayurvedic (not yet mapped for some produce)
OR(t.tag_name = 'Ayurvedic'
   AND p.name IN ('Amla','Sesame','Coconut','Ber','Guava',
                  'Ragi','Bajra','Jowar'))

-- Anti-inflammatory (not yet mapped for some produce)
OR(t.tag_name = 'Anti-inflammatory'
   AND p.name IN ('Amla','Pomegranate','Guava','Coconut'))

-- Rainfed (map to all unirrigated / dryland produce)
OR(t.tag_name = 'Rainfed'
   AND p.name IN ('Jowar','Bajra','Kodo Millet','Little Millet',
                  'Foxtail Millet','Barnyard Millet','Proso Millet',
                  'Tur (Pigeon Pea)','Cotton','Urad (Black Gram)',
                  'Soybean','Groundnut','Ber','Tamarind','Sesame'))

-- Irrigated (produce that needs/relies on irrigation)
OR(t.tag_name = 'Irrigated'
   AND p.name IN ('Grapes','Sugarcane','Onion','Banana','Pomegranate',
                  'Tomato','Garlic','Wheat','Maize','Sunflower',
                  'Lemon','Sweet Lime','Muskmelon','Watermelon'))

-- Organic (produce commonly marketed organic)
OR(t.tag_name = 'Organic'
   AND p.name IN ('Amla','Rice','Ragi','Kodo Millet','Little Millet',
                  'Foxtail Millet','Barnyard Millet','Proso Millet',
                  'Sesame','Coconut','Turmeric','Ginger'))

-- Exotic (introduced/non-native crops in Maharashtra)
OR(t.tag_name = 'Exotic'
   AND p.name IN ('Strawberry','Grapes','Sunflower','Maize',
                  'Watermelon','Muskmelon'))

-- High-Yield (already in Section J but missing some)
OR(t.tag_name = 'High-Yield'
   AND p.name IN ('Sugarcane','Cotton','Onion','Soybean',
                  'Groundnut','Wheat','Maize','Tomato'))

-- Drought Tolerant (missing some from Section J/T)
OR(t.tag_name = 'Drought Tolerant'
   AND p.name IN ('Cotton','Jowar','Tamarind','Lemon','Coconut',
                  'Ber','Custard Apple','Amla'))

ON CONFLICT DO NOTHING;


-- ──────────────────────────────────────────
-- 5. ADDITIONAL PRODUCE–REGION MAPPINGS
--    A few produce were mapped to region names like 'Vidarbha'
--    and 'Marathwada' (now inserted above). The ON clause in the
--    seed file's CROSS JOIN already covers them once regions exist;
--    but the seed file runs before this patch, so we add them now.
-- ──────────────────────────────────────────
INSERT INTO produce_region_map (produce_id, region_id)
SELECT p.produce_id, r.region_id
FROM produce p, regions r
WHERE
  (p.name = 'Barnyard Millet' AND r.state_name IN ('Vidarbha','Marathwada'))
OR(p.name = 'Proso Millet'    AND r.state_name IN ('Vidarbha','Marathwada'))
OR(p.name = 'Cotton'          AND r.state_name IN ('Vidarbha','Marathwada'))
OR(p.name = 'Jowar'           AND r.state_name IN ('Vidarbha','Marathwada'))
OR(p.name = 'Rice'            AND r.state_name IN ('Vidarbha'))
OR(p.name = 'Tur (Pigeon Pea)'AND r.state_name IN ('Marathwada'))
OR(p.name = 'Chickpea'        AND r.state_name IN ('Marathwada'))
OR(p.name = 'Urad (Black Gram)'AND r.state_name IN ('Marathwada','Vidarbha'))
OR(p.name = 'Masoor (Lentil)' AND r.state_name IN ('Marathwada','Vidarbha'))
OR(p.name = 'Soybean'         AND r.state_name IN ('Vidarbha','Marathwada'))
OR(p.name = 'Groundnut'       AND r.state_name IN ('Vidarbha'))
OR(p.name = 'Wheat'           AND r.state_name IN ('Vidarbha','Marathwada'))
OR(p.name = 'Bajra'           AND r.state_name IN ('Marathwada'))
OR(p.name = 'Maize'           AND r.state_name IN ('Vidarbha','Marathwada'))
OR(p.name = 'Ragi'            AND r.state_name IN ('Vidarbha'))
OR(p.name = 'Sugarcane'       AND r.state_name IN ('Marathwada'))
OR(p.name = 'Turmeric'        AND r.state_name IN ('Marathwada'))
OR(p.name = 'Pomegranate'     AND r.state_name IN ('Marathwada'))
OR(p.name = 'Amla'            AND r.state_name IN ('Marathwada','Vidarbha'))
ON CONFLICT DO NOTHING;


-- ──────────────────────────────────────────
-- 6. ADDITIONAL LOCAL NAMES (Regional languages)
--    Adds Kannada and Telugu equivalents for key produce that
--    cross into border markets (Marathwada ↔ Karnataka/AP)
-- ──────────────────────────────────────────
INSERT INTO local_names (produce_id, language, name)
SELECT p.produce_id, ln.lang, ln.lname
FROM produce p
JOIN (VALUES
  ('Jowar',              'Kannada',  'Jola'),
  ('Jowar',              'Telugu',   'Jonna'),
  ('Bajra',              'Kannada',  'Sajje'),
  ('Bajra',              'Telugu',   'Sajja'),
  ('Tur (Pigeon Pea)',   'Kannada',  'Togari bele'),
  ('Tur (Pigeon Pea)',   'Telugu',   'Kandipappu'),
  ('Chickpea',           'Kannada',  'Kadale'),
  ('Chickpea',           'Telugu',   'Sanagapappu'),
  ('Sesame',             'Kannada',  'Ellu'),
  ('Sesame',             'Telugu',   'Nuvvulu'),
  ('Tamarind',           'Kannada',  'Hunise'),
  ('Tamarind',           'Telugu',   'Chinthapandu'),
  ('Turmeric',           'Kannada',  'Arishina'),
  ('Turmeric',           'Telugu',   'Pasupu'),
  ('Mango',              'Kannada',  'Mavina hannu'),
  ('Mango',              'Telugu',   'Mamidi pandu'),
  ('Pomegranate',        'Kannada',  'Dalimbe'),
  ('Pomegranate',        'Telugu',   'Danimma'),
  ('Cotton',             'Kannada',  'Hatti'),
  ('Cotton',             'Telugu',   'Patti')
) AS ln(pname, lang, lname)
ON p.name = ln.pname;


-- ──────────────────────────────────────────
-- 7. COMPLETE SUMMARY (updated counts)
-- ──────────────────────────────────────────
--  After applying this patch:
--  Produce items   : 50  (unchanged)
--  Regions         : 22  (+2: Vidarbha, Marathwada)
--  Tags            : 29  (30 inserted - 1 duplicate Rainfed removed)
--  Market prices   : 52  (+3: Jackfruit, Coconut, Cotton)
--  Local names     : +20 Kannada/Telugu entries
--  Produce-tag map : substantially expanded for Section L tags
--  Produce-region  : gaps filled for Vidarbha/Marathwada-dependent crops
-- ──────────────────────────────────────────
-- The info columns are populated after all seed inserts so they contain a
-- complete, frontend-ready summary assembled from the source fields.
UPDATE produce
SET info = concat_ws(
  E'\n\n',
  description,
  'Scientific name: ' || coalesce(scientific_name, 'Not specified'),
  'Category: ' || coalesce(category, 'Not specified'),
  'Season: ' || coalesce(season, 'Not specified'),
  'Marathi name: ' || coalesce(marathi_name, 'Not specified'),
  'Hindi name: ' || coalesce(hindi_name, 'Not specified'),
  'English name: ' || coalesce(english_name, name)
);

UPDATE subtypes
SET info = concat_ws(
  E'\n\n',
  description,
  'Scientific name: ' || coalesce(scientific_name, 'Not specified'),
  'Origin: ' || coalesce(origin_state, 'Not specified'),
  'Taste profile: ' || coalesce(taste_profile, 'Not specified'),
  'Marathi name: ' || coalesce(marathi_name, subtype_name)
);
