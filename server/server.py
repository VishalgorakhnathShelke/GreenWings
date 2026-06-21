from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
import smtplib
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from datetime import datetime, timezone
from email.message import EmailMessage
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from import_seed import DB_PATH, import_seed

ROOT = Path(__file__).resolve().parents[1]


def load_env() -> None:
    env_path = ROOT / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


load_env()
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@greenwings.local")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "ChangeMeBeforeProduction!")
TOKEN_SECRET = os.environ.get("ADMIN_TOKEN_SECRET", "local-development-secret").encode()
PORT = int(os.environ.get("API_PORT", "8787"))
SUPPORTED_LANGUAGES = {"en", "hi", "mr"}
PASSWORD_ITERATIONS = 120_000
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
RATE_LIMITS: dict[str, list[float]] = {}
FERTILIZER_FIELDS = [
    "name",
    "category",
    "manufacturer",
    "countryOfOrigin",
    "description",
    "content",
    "uses",
    "applyOnCrops",
    "doNotApplyOn",
    "applicationMethod",
    "recommendedStage",
    "season",
    "temperatureRange",
    "soilType",
    "benefits",
    "precautions",
    "imageUrl",
    "status",
    "documentUrl",
]
FERTILIZER_KINDS = {
    "local": ("local_fertilizers", "local_fertilizer_translations"),
    "imported": ("imported_fertilizers", "imported_fertilizer_translations"),
}
COMPANY_STORY_FIELDS = [
    "title",
    "slug",
    "language",
    "content",
    "featuredImage",
    "displayOrder",
    "status",
]
COMPANY_MILESTONE_FIELDS = ["year", "title", "description", "image", "displayOrder"]
LEADERSHIP_FIELDS = ["fullName", "designation", "roleDescription", "biography", "image", "imageUrl", "displayOrder", "active"]
COMPANY_CONTENT_FIELDS = ["sectionKey", "title", "subtitle", "content", "language", "displayOrder", "status"]
COMPANY_TIMELINE_FIELDS = ["year", "title", "description", "impactMetric", "language", "displayOrder", "status"]
HOMEPAGE_STATISTIC_FIELDS = ["label", "value", "description", "displayOrder", "active"]


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def encode_token(
    role: str,
    email: str,
    user_id: int | None = None,
    name: str | None = None,
) -> str:
    payload_dict = {"role": role, "email": email, "exp": int(time.time()) + 8 * 60 * 60}
    if user_id is not None:
        payload_dict["userId"] = user_id
    if name:
        payload_dict["name"] = name
    payload = json.dumps(payload_dict).encode()
    encoded = base64.urlsafe_b64encode(payload).rstrip(b"=")
    signature = hmac.new(TOKEN_SECRET, encoded, hashlib.sha256).digest()
    return f"{encoded.decode()}.{base64.urlsafe_b64encode(signature).rstrip(b'=').decode()}"


def decode_token(token: str) -> dict | None:
    try:
        encoded, signature = token.split(".", 1)
        expected = hmac.new(TOKEN_SECRET, encoded.encode(), hashlib.sha256).digest()
        actual = base64.urlsafe_b64decode(signature + "=" * (-len(signature) % 4))
        if not hmac.compare_digest(expected, actual):
            return None
        payload = json.loads(base64.urlsafe_b64decode(encoded + "=" * (-len(encoded) % 4)))
        return payload if payload["exp"] > time.time() else None
    except (ValueError, KeyError, json.JSONDecodeError):
        return None


def database() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def ensure_columns(connection: sqlite3.Connection, table: str, columns: dict[str, str]) -> None:
    existing = {row["name"] for row in connection.execute(f"PRAGMA table_info({table})").fetchall()}
    for name, definition in columns.items():
        if name not in existing:
            connection.execute(f"ALTER TABLE {table} ADD COLUMN {name} {definition}")


def ensure_app_schema() -> None:
    with database() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                mobileNumber TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                passwordHash TEXT NOT NULL,
                interest TEXT NOT NULL,
                enquiryQuestion TEXT,
                address TEXT NOT NULL,
                state TEXT NOT NULL,
                country TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'USER',
                emailVerified INTEGER NOT NULL DEFAULT 0,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS enquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                enquiryId TEXT NOT NULL UNIQUE,
                userId INTEGER NOT NULL,
                subject TEXT NOT NULL,
                category TEXT NOT NULL,
                description TEXT NOT NULL,
                priority TEXT NOT NULL DEFAULT 'NORMAL',
                status TEXT NOT NULL DEFAULT 'NEW',
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS website_visits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                visitorId TEXT NOT NULL,
                sessionId TEXT NOT NULL,
                pagePath TEXT NOT NULL,
                referrer TEXT,
                userAgent TEXT,
                ipAddressHash TEXT NOT NULL,
                country TEXT,
                deviceType TEXT,
                browser TEXT,
                visitedAt TEXT NOT NULL,
                createdAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS local_fertilizers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                manufacturer TEXT NOT NULL,
                countryOfOrigin TEXT NOT NULL DEFAULT 'India',
                description TEXT NOT NULL,
                content TEXT NOT NULL,
                uses TEXT NOT NULL,
                applyOnCrops TEXT NOT NULL,
                doNotApplyOn TEXT NOT NULL,
                applicationMethod TEXT NOT NULL,
                recommendedStage TEXT NOT NULL,
                season TEXT NOT NULL,
                temperatureRange TEXT NOT NULL,
                soilType TEXT NOT NULL,
                benefits TEXT NOT NULL,
                precautions TEXT NOT NULL,
                imageUrl TEXT,
                status TEXT NOT NULL DEFAULT 'active',
                documentUrl TEXT,
                approvalBody TEXT,
                regionalRecommendations TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS imported_fertilizers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                manufacturer TEXT NOT NULL,
                countryOfOrigin TEXT NOT NULL,
                description TEXT NOT NULL,
                content TEXT NOT NULL,
                uses TEXT NOT NULL,
                applyOnCrops TEXT NOT NULL,
                doNotApplyOn TEXT NOT NULL,
                applicationMethod TEXT NOT NULL,
                recommendedStage TEXT NOT NULL,
                season TEXT NOT NULL,
                temperatureRange TEXT NOT NULL,
                soilType TEXT NOT NULL,
                benefits TEXT NOT NULL,
                precautions TEXT NOT NULL,
                imageUrl TEXT,
                status TEXT NOT NULL DEFAULT 'active',
                documentUrl TEXT,
                brand TEXT,
                importCertifications TEXT,
                internationalSpecifications TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS local_fertilizer_translations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fertilizerId INTEGER NOT NULL,
                language TEXT NOT NULL,
                name TEXT,
                category TEXT,
                description TEXT,
                content TEXT,
                uses TEXT,
                benefits TEXT,
                precautions TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                UNIQUE(fertilizerId, language),
                FOREIGN KEY (fertilizerId) REFERENCES local_fertilizers(id)
            );

            CREATE TABLE IF NOT EXISTS imported_fertilizer_translations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fertilizerId INTEGER NOT NULL,
                language TEXT NOT NULL,
                name TEXT,
                category TEXT,
                description TEXT,
                content TEXT,
                uses TEXT,
                benefits TEXT,
                precautions TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                UNIQUE(fertilizerId, language),
                FOREIGN KEY (fertilizerId) REFERENCES imported_fertilizers(id)
            );

            CREATE TABLE IF NOT EXISTS company_stories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT NOT NULL,
                language TEXT NOT NULL,
                content TEXT NOT NULL,
                featuredImage TEXT,
                displayOrder INTEGER NOT NULL DEFAULT 0,
                status TEXT NOT NULL DEFAULT 'published',
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                UNIQUE(slug, language)
            );

            CREATE TABLE IF NOT EXISTS company_contents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sectionKey TEXT NOT NULL,
                title TEXT NOT NULL,
                subtitle TEXT,
                content TEXT NOT NULL,
                language TEXT NOT NULL DEFAULT 'en',
                displayOrder INTEGER NOT NULL DEFAULT 0,
                status TEXT NOT NULL DEFAULT 'published',
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                UNIQUE(sectionKey, language)
            );

            CREATE TABLE IF NOT EXISTS company_milestones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                year TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                image TEXT,
                displayOrder INTEGER NOT NULL DEFAULT 0,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS company_milestone_translations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                milestoneId INTEGER NOT NULL,
                language TEXT NOT NULL,
                title TEXT,
                description TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                UNIQUE(milestoneId, language),
                FOREIGN KEY (milestoneId) REFERENCES company_milestones(id)
            );

            CREATE TABLE IF NOT EXISTS company_timelines (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                year TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                impactMetric TEXT,
                language TEXT NOT NULL DEFAULT 'en',
                displayOrder INTEGER NOT NULL DEFAULT 0,
                status TEXT NOT NULL DEFAULT 'published',
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                UNIQUE(year, title, language)
            );

            CREATE TABLE IF NOT EXISTS leadership_members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fullName TEXT NOT NULL,
                designation TEXT NOT NULL,
                roleDescription TEXT,
                biography TEXT NOT NULL,
                image TEXT,
                imageUrl TEXT,
                language TEXT NOT NULL DEFAULT 'en',
                displayOrder INTEGER NOT NULL DEFAULT 0,
                active INTEGER NOT NULL DEFAULT 1,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS leadership_member_translations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                leadershipMemberId INTEGER NOT NULL,
                language TEXT NOT NULL,
                designation TEXT,
                biography TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                UNIQUE(leadershipMemberId, language),
                FOREIGN KEY (leadershipMemberId) REFERENCES leadership_members(id)
            );

            CREATE TABLE IF NOT EXISTS homepage_statistics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                label TEXT NOT NULL,
                value TEXT NOT NULL,
                description TEXT,
                displayOrder INTEGER NOT NULL DEFAULT 0,
                active INTEGER NOT NULL DEFAULT 1,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                UNIQUE(label)
            );

            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_enquiries_user ON enquiries(userId);
            CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
            CREATE INDEX IF NOT EXISTS idx_website_visits_visitor ON website_visits(visitorId);
            CREATE INDEX IF NOT EXISTS idx_website_visits_page ON website_visits(pagePath);
            CREATE INDEX IF NOT EXISTS idx_website_visits_date ON website_visits(visitedAt);
            CREATE INDEX IF NOT EXISTS idx_local_fertilizers_status ON local_fertilizers(status);
            CREATE INDEX IF NOT EXISTS idx_imported_fertilizers_status ON imported_fertilizers(status);
            CREATE INDEX IF NOT EXISTS idx_local_fertilizers_category ON local_fertilizers(category);
            CREATE INDEX IF NOT EXISTS idx_imported_fertilizers_category ON imported_fertilizers(category);
            CREATE INDEX IF NOT EXISTS idx_company_stories_lookup ON company_stories(language, status, displayOrder);
            CREATE INDEX IF NOT EXISTS idx_company_contents_lookup ON company_contents(language, status, displayOrder);
            CREATE INDEX IF NOT EXISTS idx_company_milestones_order ON company_milestones(displayOrder);
            CREATE INDEX IF NOT EXISTS idx_company_timelines_lookup ON company_timelines(language, status, displayOrder);
            CREATE INDEX IF NOT EXISTS idx_leadership_members_active ON leadership_members(active, displayOrder);
            CREATE INDEX IF NOT EXISTS idx_homepage_statistics_active ON homepage_statistics(active, displayOrder);
            """
        )
        ensure_columns(
            connection,
            "leadership_members",
            {
                "roleDescription": "TEXT",
                "imageUrl": "TEXT",
                "language": "TEXT NOT NULL DEFAULT 'en'",
            },
        )
    seed_fertilizers()
    seed_company_content()
    seed_company_profile_content()


def ensure_database() -> None:
    if not DB_PATH.exists():
        import_seed()
        ensure_app_schema()
        return
    with database() as connection:
        tables = {
            row["name"] for row in connection.execute(
                "SELECT name FROM sqlite_master WHERE type = 'table'"
            ).fetchall()
        }
    if not {"produce_translations", "subtype_translations"}.issubset(tables):
        import_seed()
    ensure_app_schema()


def requested_language(query: dict[str, list[str]]) -> str:
    language = query.get("lang", ["en"])[0].lower()
    return language if language in SUPPORTED_LANGUAGES else "en"


def fertilizer_tables(kind: str) -> tuple[str, str]:
    if kind not in FERTILIZER_KINDS:
        raise ValueError("Invalid fertilizer kind")
    return FERTILIZER_KINDS[kind]


def seed_fertilizers() -> None:
    created_at = now_iso()
    local_rows = [
        {
            "name": "Neem Coated Urea",
            "category": "Nitrogen fertilizer",
            "manufacturer": "National Fertilizers Limited",
            "countryOfOrigin": "India",
            "description": "Government-approved nitrogen fertilizer designed to release nitrogen gradually and reduce nutrient loss in Indian field conditions.",
            "content": "Nitrogen 46% with neem oil coating for controlled release.",
            "uses": "Basal and top dressing nitrogen nutrition for cereals, sugarcane, cotton and vegetables.",
            "applyOnCrops": "Wheat, maize, paddy, sugarcane, cotton, onion and leafy vegetables.",
            "doNotApplyOn": "Avoid direct seed contact, waterlogged fields and crops under severe drought stress.",
            "applicationMethod": "Broadcast evenly and incorporate into moist soil. Split application is recommended for long-duration crops.",
            "recommendedStage": "Basal dose and active vegetative growth stage.",
            "season": "Kharif and rabi.",
            "temperatureRange": "18-35 C.",
            "soilType": "Alluvial, black cotton and medium-textured soils with adequate moisture.",
            "benefits": "Supports steady vegetative growth, improves nitrogen use efficiency and helps reduce volatilization losses.",
            "precautions": "Use soil-test based dosage, wear gloves, and do not over-apply near water bodies.",
            "imageUrl": "/assets/agri-inputs/local-neem-urea.svg",
            "status": "active",
            "documentUrl": "/resources/neem-coated-urea-guide.txt",
            "approvalBody": "Government of India fertilizer control approved category",
            "regionalRecommendations": "Recommended across Maharashtra for cereals, sugarcane and onion under guided nutrient plans.",
        },
        {
            "name": "City Compost Organic Manure",
            "category": "Organic fertilizer",
            "manufacturer": "Maharashtra Agro Industries Development Corporation",
            "countryOfOrigin": "India",
            "description": "Organic manure option for soil health improvement, carbon addition and balanced microbial activity in regional farming systems.",
            "content": "Organic carbon, humic matter, secondary nutrients and beneficial microbial activity.",
            "uses": "Soil conditioning, organic carbon improvement and pre-planting manure application.",
            "applyOnCrops": "Grapes, pomegranate, banana, vegetables, pulses, cereals and orchard crops.",
            "doNotApplyOn": "Avoid fresh application near tender seedlings without proper compost maturity confirmation.",
            "applicationMethod": "Apply during land preparation and mix well into the root zone.",
            "recommendedStage": "Before sowing, before transplanting and during orchard basin preparation.",
            "season": "Pre-kharif, pre-rabi and orchard annual nutrition cycle.",
            "temperatureRange": "15-38 C.",
            "soilType": "Low-organic-carbon soils, black soils and light soils needing structure improvement.",
            "benefits": "Improves soil structure, moisture holding, microbial activity and long-term nutrient availability.",
            "precautions": "Use mature compost only and avoid mixing directly with concentrated chemical fertilizers during storage.",
            "imageUrl": "/assets/agri-inputs/local-city-compost.svg",
            "status": "active",
            "documentUrl": "/resources/city-compost-guide.txt",
            "approvalBody": "Organic input aligned with government soil health improvement programmes",
            "regionalRecommendations": "Useful for Nashik and Yeola orchards where organic carbon rebuilding is a priority.",
        },
    ]
    imported_rows = [
        {
            "name": "YaraMila Complex 12-11-18",
            "category": "NPK complex fertilizer",
            "manufacturer": "Yara International",
            "countryOfOrigin": "Norway",
            "description": "Premium imported NPK formulation for balanced macronutrient supply and quality-focused crop development.",
            "content": "NPK 12-11-18 with sulphur, magnesium and crop-available micronutrient support.",
            "uses": "Balanced nutrition for high-value crops requiring uniform granule quality and predictable nutrient release.",
            "applyOnCrops": "Grapes, pomegranate, banana, vegetables, floriculture and protected cultivation crops.",
            "doNotApplyOn": "Avoid salt-sensitive nursery crops and direct placement near tender roots without irrigation.",
            "applicationMethod": "Apply through soil broadcasting, band placement or fertigation-compatible programmes as advised.",
            "recommendedStage": "Vegetative growth, flowering support and early fruit development.",
            "season": "Year-round for irrigated high-value crops.",
            "temperatureRange": "16-34 C.",
            "soilType": "Well-drained loam, black soil and managed orchard soils.",
            "benefits": "Supports uniform growth, flowering, fruit size and premium quality output.",
            "precautions": "Follow crop-specific dosage, avoid mixing with incompatible alkaline materials and store in a dry place.",
            "imageUrl": "/assets/agri-inputs/imported-yaramila.svg",
            "status": "active",
            "documentUrl": "/resources/yaramila-product-specification.txt",
            "brand": "YaraMila",
            "importCertifications": "Importer quality documentation, batch certificate and compliant product labelling required.",
            "internationalSpecifications": "European granulation standards with declared nutrient composition and traceability.",
        },
        {
            "name": "Haifa Multi-K Potassium Nitrate",
            "category": "Water soluble fertilizer",
            "manufacturer": "Haifa Group",
            "countryOfOrigin": "Israel",
            "description": "High-purity imported potassium nitrate used for precision fertigation, fruit quality and stress-stage nutrition.",
            "content": "Potassium nitrate with nitrate nitrogen and fully water-soluble potassium.",
            "uses": "Fertigation, foliar feeding and precision crop nutrition programmes.",
            "applyOnCrops": "Grapes, pomegranate, banana, tomato, chilli, capsicum, cucumber and export-oriented vegetables.",
            "doNotApplyOn": "Avoid use on crops under severe water stress or with incompatible calcium-rich tank mixes.",
            "applicationMethod": "Apply through drip fertigation or foliar spray as per agronomist dosage guidance.",
            "recommendedStage": "Flowering, fruit setting, fruit sizing and quality development stages.",
            "season": "Irrigated crop cycles and protected cultivation seasons.",
            "temperatureRange": "14-32 C.",
            "soilType": "Drip-irrigated soils with managed EC and pH.",
            "benefits": "Improves fruit size, colour, sugar accumulation and potassium-driven crop quality.",
            "precautions": "Check water pH and EC, avoid excessive foliar concentration and follow label directions.",
            "imageUrl": "/assets/agri-inputs/imported-haifa-multik.svg",
            "status": "active",
            "documentUrl": "/resources/haifa-multik-specification.txt",
            "brand": "Multi-K",
            "importCertifications": "Product import documentation, certificate of analysis and batch traceability required.",
            "internationalSpecifications": "High-purity crystalline water-soluble fertilizer for fertigation systems.",
        },
    ]
    with database() as connection:
        if connection.execute("SELECT COUNT(*) FROM local_fertilizers").fetchone()[0] == 0:
            for row in local_rows:
                insert_fertilizer_row(connection, "local_fertilizers", row, created_at)
        if connection.execute("SELECT COUNT(*) FROM imported_fertilizers").fetchone()[0] == 0:
            for row in imported_rows:
                insert_fertilizer_row(connection, "imported_fertilizers", row, created_at)


def insert_fertilizer_row(connection: sqlite3.Connection, table: str, payload: dict, timestamp: str) -> int:
    common_columns = FERTILIZER_FIELDS + ["createdAt", "updatedAt"]
    extra_columns = ["approvalBody", "regionalRecommendations"] if table == "local_fertilizers" else ["brand", "importCertifications", "internationalSpecifications"]
    columns = common_columns + extra_columns
    values = [str(payload.get(column, "")).strip() for column in FERTILIZER_FIELDS]
    values.extend([timestamp, timestamp])
    values.extend(str(payload.get(column, "")).strip() for column in extra_columns)
    placeholders = ", ".join("?" for _ in columns)
    cursor = connection.execute(
        f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({placeholders})",
        values,
    )
    return int(cursor.lastrowid)


def seed_company_content() -> None:
    created_at = now_iso()
    story_sections = [
        ("home-hero", "From the Farms of Yeola (Nashik) to the World", "GreenWings connects farmer knowledge, natural farming values and market-ready systems so rural prosperity can travel from local fields to global opportunities.", "/assets/greenwings-community.png", 1),
        ("home-stat-farmers", "Farmers Connected: 1,100+", "A growing community of farmers is connected through GreenWings training, advisory, input support and market-linkage programmes.", "", 2),
        ("community-knowledge-sharing", "Knowledge Sharing", "GreenWings creates farmer learning circles where practical field experience, scientific guidance and seasonal crop planning are shared openly.", "/assets/greenwings-hero.png", 10),
        ("community-farmer-networking", "Farmer Networking", "The platform strengthens farmer-to-farmer relationships so members can collaborate on cultivation, aggregation, market access and collective growth.", "/assets/greenwings-community.png", 11),
        ("community-training-programs", "Training Programs", "Training programmes help farmers adopt better practices in soil health, crop nutrition, post-harvest handling and digital market readiness.", "/assets/greenwings-hero.png", 12),
        ("community-innovation", "Innovation", "GreenWings encourages practical innovation through agri-technology, data-led decisions, climate-aware cultivation and value-chain partnerships.", "/assets/greenwings-community.png", 13),
        ("community-learning", "Learning", "Continuous learning keeps farmers prepared for changing weather, market demand, input choices, quality standards and export opportunities.", "/assets/greenwings-hero.png", 14),
        ("community-sustainable-agriculture", "Sustainable Agriculture", "Sustainable agriculture is promoted through natural farming, responsible input use, soil improvement and water-conscious cultivation.", "/assets/greenwings-community.png", 15),
        ("company-introduction", "Company Introduction", "GREEN WINGS FARMERS PRODUCER COMPANY LIMITED is a farmer-owned organisation founded to connect farmers with inputs, knowledge, technology, processing, value addition and better markets.", "/assets/greenwings-hero.png", 20),
        ("our-journey", "Our Journey", "GreenWings began in 2023 with a clear purpose: unite farmers around trust, learning, collaboration and long-term agricultural growth.", "/assets/greenwings-community.png", 21),
        ("vision", "Vision", "To build a trusted farmer-led agricultural ecosystem that carries the strength of Yeola and Nashik farming communities to national and international markets.", "", 22),
        ("mission", "Mission", "To empower farmers through training, natural farming support, input guidance, aggregation, processing, value addition and market connectivity.", "", 23),
        ("core-values", "Core Values", "Trust, transparency, farmer-first decision making, sustainability, innovation, community ownership and shared prosperity guide GreenWings.", "", 24),
        ("export-vision", "Export Vision", "GreenWings aims to prepare farmer produce for premium markets through quality systems, traceability, grading, packaging and buyer readiness.", "", 25),
        ("natural-farming-initiative", "Natural Farming Initiative", "The natural farming initiative promotes soil health, reduced chemical dependency, local resources, biodiversity and resilient production systems.", "", 26),
        ("farmer-empowerment-strategy", "Farmer Empowerment Strategy", "The farmer empowerment strategy focuses on knowledge access, group strength, digital connectivity, finance readiness and better bargaining power.", "", 27),
        ("processing-value-addition-strategy", "Processing & Value Addition Strategy", "GreenWings plans to support grading, primary processing, packaging, storage and value-added products that increase farmer income.", "", 28),
    ]
    story_translations = {
        "hi": {
            "home-hero": ("येवला (नाशिक) के खेतों से दुनिया तक", "ग्रीनविंग्स किसान ज्ञान, प्राकृतिक खेती और बाजार-तैयार प्रणालियों को जोड़ता है ताकि ग्रामीण समृद्धि स्थानीय खेतों से वैश्विक अवसरों तक पहुंचे।"),
            "home-stat-farmers": ("किसान जुड़े: 1,100+", "ग्रीनविंग्स प्रशिक्षण, सलाह, इनपुट सहयोग और बाजार संपर्क के माध्यम से किसानों का बढ़ता समुदाय जोड़ रहा है।"),
            "community-knowledge-sharing": ("ज्ञान साझा करना", "ग्रीनविंग्स किसान सीखने के समूह बनाता है जहां खेत का अनुभव, वैज्ञानिक सलाह और मौसमी फसल योजना खुले रूप से साझा की जाती है।"),
            "community-farmer-networking": ("किसान नेटवर्किंग", "यह मंच किसानों के बीच सहयोग को मजबूत करता है ताकि खेती, संग्रह, बाजार पहुंच और सामूहिक विकास में साझेदारी बढ़े।"),
            "community-training-programs": ("प्रशिक्षण कार्यक्रम", "प्रशिक्षण कार्यक्रम किसानों को मिट्टी स्वास्थ्य, फसल पोषण, कटाई के बाद प्रबंधन और डिजिटल बाजार तैयारी में बेहतर अभ्यास अपनाने में मदद करते हैं।"),
            "community-innovation": ("नवाचार", "ग्रीनविंग्स कृषि तकनीक, डेटा आधारित निर्णय, जलवायु-सजग खेती और मूल्य-श्रृंखला साझेदारी के माध्यम से व्यावहारिक नवाचार को बढ़ावा देता है।"),
            "community-learning": ("लगातार सीखना", "लगातार सीखने से किसान बदलते मौसम, बाजार मांग, इनपुट विकल्प, गुणवत्ता मानक और निर्यात अवसरों के लिए तैयार रहते हैं।"),
            "community-sustainable-agriculture": ("टिकाऊ कृषि", "टिकाऊ कृषि को प्राकृतिक खेती, जिम्मेदार इनपुट उपयोग, मिट्टी सुधार और जल-सचेत खेती के माध्यम से बढ़ावा दिया जाता है।"),
            "company-introduction": ("कंपनी परिचय", "ग्रीन विंग्स फार्मर्स प्रोड्यूसर कंपनी लिमिटेड किसानों को इनपुट, ज्ञान, तकनीक, प्रसंस्करण, मूल्यवर्धन और बेहतर बाजारों से जोड़ने वाला किसान-स्वामित्व संगठन है।"),
            "our-journey": ("हमारी यात्रा", "ग्रीनविंग्स की शुरुआत 2023 में विश्वास, सीख, सहयोग और दीर्घकालीन कृषि विकास के उद्देश्य से हुई।"),
            "vision": ("दृष्टि", "येवला और नाशिक के किसानों की शक्ति को राष्ट्रीय और अंतरराष्ट्रीय बाजारों तक पहुंचाने वाला भरोसेमंद किसान-नेतृत्व कृषि तंत्र बनाना।"),
            "mission": ("मिशन", "प्रशिक्षण, प्राकृतिक खेती सहयोग, इनपुट मार्गदर्शन, aggregation, प्रसंस्करण, मूल्यवर्धन और बाजार संपर्क से किसानों को सशक्त बनाना।"),
            "core-values": ("मुख्य मूल्य", "विश्वास, पारदर्शिता, किसान-प्रथम निर्णय, स्थिरता, नवाचार, सामुदायिक स्वामित्व और साझा समृद्धि।"),
            "export-vision": ("निर्यात दृष्टि", "गुणवत्ता प्रणाली, traceability, grading, packaging और buyer readiness के माध्यम से किसान उत्पाद को प्रीमियम बाजारों के लिए तैयार करना।"),
            "natural-farming-initiative": ("प्राकृतिक खेती पहल", "मिट्टी के स्वास्थ्य, कम रासायनिक निर्भरता, स्थानीय संसाधनों, जैव विविधता और लचीली उत्पादन प्रणाली को बढ़ावा देना।"),
            "farmer-empowerment-strategy": ("किसान सशक्तिकरण रणनीति", "ज्ञान, समूह शक्ति, डिजिटल कनेक्टिविटी, वित्तीय तैयारी और बेहतर सौदेबाजी शक्ति पर केंद्रित रणनीति।"),
            "processing-value-addition-strategy": ("प्रसंस्करण और मूल्यवर्धन रणनीति", "grading, primary processing, packaging, storage और value-added products से किसानों की आय बढ़ाना।"),
        },
        "mr": {
            "home-hero": ("येवला (नाशिक) च्या शेतातून जगभर", "ग्रीनविंग्स शेतकरी ज्ञान, नैसर्गिक शेती मूल्ये आणि बाजारपेठेसाठी तयार प्रणाली जोडून ग्रामीण समृद्धी जागतिक संधींपर्यंत पोहोचवते."),
            "home-stat-farmers": ("जोडलेले शेतकरी: 1,100+", "ग्रीनविंग्स प्रशिक्षण, सल्ला, इनपुट सहाय्य आणि बाजार जोडणीद्वारे वाढता शेतकरी समुदाय जोडत आहे."),
            "community-knowledge-sharing": ("ज्ञानाची देवाणघेवाण", "ग्रीनविंग्स शेतकरी शिक्षण गट तयार करते जिथे प्रत्यक्ष शेतातील अनुभव, वैज्ञानिक मार्गदर्शन आणि हंगामी पीक नियोजन खुलेपणाने शेअर केले जाते."),
            "community-farmer-networking": ("शेतकरी नेटवर्किंग", "हे व्यासपीठ शेतकरी-ते-शेतकरी नाते मजबूत करते, ज्यामुळे लागवड, संकलन, बाजार प्रवेश आणि सामूहिक वाढीत सहकार्य वाढते."),
            "community-training-programs": ("प्रशिक्षण कार्यक्रम", "प्रशिक्षण कार्यक्रम शेतकऱ्यांना माती आरोग्य, पीक पोषण, काढणीनंतरची हाताळणी आणि डिजिटल बाजार तयारीतील चांगल्या पद्धती स्वीकारण्यास मदत करतात."),
            "community-innovation": ("नवोन्मेष", "ग्रीनविंग्स कृषी तंत्रज्ञान, माहितीआधारित निर्णय, हवामान-जाणिवेची शेती आणि मूल्यसाखळी भागीदारीद्वारे व्यावहारिक नवोन्मेषाला प्रोत्साहन देते."),
            "community-learning": ("सतत शिकणे", "सतत शिकण्यामुळे शेतकरी बदलते हवामान, बाजार मागणी, इनपुट निवड, गुणवत्ता मानके आणि निर्यात संधींसाठी तयार राहतात."),
            "community-sustainable-agriculture": ("शाश्वत शेती", "नैसर्गिक शेती, जबाबदार इनपुट वापर, माती सुधारणा आणि पाणी-जाणिवेच्या लागवडीद्वारे शाश्वत शेतीला प्रोत्साहन दिले जाते."),
            "company-introduction": ("कंपनी परिचय", "ग्रीन विंग्स फार्मर्स प्रोड्यूसर कंपनी लिमिटेड ही शेतकऱ्यांना इनपुट, ज्ञान, तंत्रज्ञान, प्रक्रिया, मूल्यवर्धन आणि चांगल्या बाजारपेठांशी जोडणारी शेतकरी-मालकीची संस्था आहे."),
            "our-journey": ("आमचा प्रवास", "ग्रीनविंग्सची सुरुवात 2023 मध्ये विश्वास, शिक्षण, सहकार्य आणि दीर्घकालीन कृषी विकासाच्या उद्देशाने झाली."),
            "vision": ("दृष्टी", "येवला आणि नाशिकच्या शेतकरी समुदायाची ताकद राष्ट्रीय आणि आंतरराष्ट्रीय बाजारपेठांपर्यंत नेणारी विश्वासार्ह शेतकरी-नेतृत्व कृषि व्यवस्था उभारणे."),
            "mission": ("मिशन", "प्रशिक्षण, नैसर्गिक शेती सहाय्य, इनपुट मार्गदर्शन, aggregation, प्रक्रिया, मूल्यवर्धन आणि बाजार जोडणीद्वारे शेतकऱ्यांना सक्षम करणे."),
            "core-values": ("मूल्ये", "विश्वास, पारदर्शकता, शेतकरी-प्रथम निर्णय, शाश्वतता, नवोन्मेष, समुदाय मालकी आणि सामायिक समृद्धी."),
            "export-vision": ("निर्यात दृष्टी", "गुणवत्ता प्रणाली, traceability, grading, packaging आणि buyer readiness द्वारे शेतमाल प्रीमियम बाजारपेठांसाठी तयार करणे."),
            "natural-farming-initiative": ("नैसर्गिक शेती उपक्रम", "मातीचे आरोग्य, कमी रासायनिक अवलंबित्व, स्थानिक संसाधने, जैवविविधता आणि लवचिक उत्पादन प्रणालींना प्रोत्साहन देणे."),
            "farmer-empowerment-strategy": ("शेतकरी सक्षमीकरण रणनीती", "ज्ञान, समूह शक्ती, डिजिटल जोडणी, वित्तीय तयारी आणि चांगल्या सौदेबाजी शक्तीवर केंद्रित रणनीती."),
            "processing-value-addition-strategy": ("प्रक्रिया आणि मूल्यवर्धन रणनीती", "grading, primary processing, packaging, storage आणि value-added products द्वारे शेतकऱ्यांचे उत्पन्न वाढवणे."),
        },
    }
    with database() as connection:
        if connection.execute("SELECT COUNT(*) FROM company_stories").fetchone()[0] == 0:
            for slug, title, content, image, order in story_sections:
                connection.execute(
                    """
                    INSERT INTO company_stories (title, slug, language, content, featuredImage, displayOrder, status, createdAt, updatedAt)
                    VALUES (?, ?, 'en', ?, ?, ?, 'published', ?, ?)
                    """,
                    (title, slug, content, image, order, created_at, created_at),
                )
                for language in ("hi", "mr"):
                    localized_title, localized_content = story_translations.get(language, {}).get(slug, (title, content))
                    connection.execute(
                        """
                        INSERT INTO company_stories (title, slug, language, content, featuredImage, displayOrder, status, createdAt, updatedAt)
                        VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?)
                        """,
                        (localized_title, slug, language, localized_content, image, order, created_at, created_at),
                    )

        if connection.execute("SELECT COUNT(*) FROM company_milestones").fetchone()[0] == 0:
            milestone_rows = [
                (
                    "2023",
                    "Company Formation",
                    "GreenWings was formally established as a farmer producer company to organise farmers around shared growth.",
                    "/assets/greenwings-community.png",
                    1,
                    {
                        "hi": ("कंपनी स्थापना", "ग्रीनविंग्स को साझा विकास के लिए किसानों को संगठित करने वाली किसान उत्पादक कंपनी के रूप में औपचारिक रूप से स्थापित किया गया।"),
                        "mr": ("कंपनी स्थापना", "सामायिक वाढीसाठी शेतकऱ्यांना संघटित करणारी शेतकरी उत्पादक कंपनी म्हणून ग्रीनविंग्सची औपचारिक स्थापना झाली."),
                    },
                ),
                (
                    "2023",
                    "Natural Farming Initiative",
                    "The company began promoting soil health, natural farming awareness and responsible input usage.",
                    "/assets/greenwings-hero.png",
                    2,
                    {
                        "hi": ("प्राकृतिक खेती पहल", "कंपनी ने मिट्टी स्वास्थ्य, प्राकृतिक खेती जागरूकता और जिम्मेदार इनपुट उपयोग को बढ़ावा देना शुरू किया।"),
                        "mr": ("नैसर्गिक शेती उपक्रम", "कंपनीने माती आरोग्य, नैसर्गिक शेती जागरूकता आणि जबाबदार इनपुट वापराला प्रोत्साहन देण्यास सुरुवात केली."),
                    },
                ),
                (
                    "2024",
                    "Farmer Growth Milestones",
                    "Farmer participation expanded through village meetings, training programmes and collective planning.",
                    "/assets/greenwings-community.png",
                    3,
                    {
                        "hi": ("किसान विकास मील के पत्थर", "गांव बैठकों, प्रशिक्षण कार्यक्रमों और सामूहिक योजना के माध्यम से किसानों की भागीदारी बढ़ी।"),
                        "mr": ("शेतकरी वाढीचे टप्पे", "गाव बैठका, प्रशिक्षण कार्यक्रम आणि सामूहिक नियोजनाद्वारे शेतकरी सहभाग वाढला."),
                    },
                ),
                (
                    "2025",
                    "Export Expansion Milestones",
                    "GreenWings started preparing farmers for export readiness through quality, grading and buyer-oriented practices.",
                    "/assets/greenwings-hero.png",
                    4,
                    {
                        "hi": ("निर्यात विस्तार मील के पत्थर", "ग्रीनविंग्स ने गुणवत्ता, ग्रेडिंग और खरीदार-केंद्रित पद्धतियों के माध्यम से किसानों को निर्यात तैयारी के लिए तैयार करना शुरू किया।"),
                        "mr": ("निर्यात विस्ताराचे टप्पे", "ग्रीनविंग्सने गुणवत्ता, ग्रेडिंग आणि खरेदीदार-केंद्रित पद्धतींद्वारे शेतकऱ्यांना निर्यात तयारीसाठी तयार करणे सुरू केले."),
                    },
                ),
                (
                    "2026",
                    "Processing and Value Addition Milestones",
                    "The organisation began shaping plans for grading, packaging, primary processing and value-added products.",
                    "/assets/greenwings-community.png",
                    5,
                    {
                        "hi": ("प्रसंस्करण और मूल्यवर्धन मील के पत्थर", "संगठन ने ग्रेडिंग, पैकेजिंग, प्राथमिक प्रसंस्करण और मूल्य-वर्धित उत्पादों की योजनाएं बनाना शुरू किया।"),
                        "mr": ("प्रक्रिया आणि मूल्यवर्धनाचे टप्पे", "संस्थेने ग्रेडिंग, पॅकेजिंग, प्राथमिक प्रक्रिया आणि मूल्यवर्धित उत्पादनांच्या योजना आकारास आणण्यास सुरुवात केली."),
                    },
                ),
            ]
            for year, title, description, image, order, translations in milestone_rows:
                cursor = connection.execute(
                    """
                    INSERT INTO company_milestones (year, title, description, image, displayOrder, createdAt, updatedAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (year, title, description, image, order, created_at, created_at),
                )
                milestone_id = int(cursor.lastrowid)
                for language, (localized_title, localized_description) in translations.items():
                    connection.execute(
                        """
                        INSERT INTO company_milestone_translations (milestoneId, language, title, description, createdAt, updatedAt)
                        VALUES (?, ?, ?, ?, ?, ?)
                        """,
                        (milestone_id, language, localized_title, localized_description, created_at, created_at),
                    )

        if connection.execute("SELECT COUNT(*) FROM leadership_members").fetchone()[0] == 0:
            leaders = [
                (
                    "Mr. Malhari Runjaba Jadhav",
                    "Chairman",
                    "Provides strategic direction for GreenWings with a focus on farmer trust, governance and collective rural development.",
                    "/assets/greenwings-community.png",
                    1,
                    {
                        "hi": ("अध्यक्ष", "किसान विश्वास, सुशासन और सामूहिक ग्रामीण विकास पर ध्यान देते हुए ग्रीनविंग्स को रणनीतिक दिशा प्रदान करते हैं।"),
                        "mr": ("अध्यक्ष", "शेतकरी विश्वास, सुशासन आणि सामूहिक ग्रामीण विकासावर लक्ष केंद्रित करून ग्रीनविंग्सला धोरणात्मक दिशा देतात."),
                    },
                ),
                (
                    "Mr. Manik Ramchandra Rasal",
                    "Vice Chairman",
                    "Supports organisational planning, member coordination and practical implementation of farmer-first programmes.",
                    "/assets/greenwings-hero.png",
                    2,
                    {
                        "hi": ("उपाध्यक्ष", "संगठनात्मक योजना, सदस्य समन्वय और किसान-प्रथम कार्यक्रमों के व्यावहारिक कार्यान्वयन में सहयोग करते हैं।"),
                        "mr": ("उपाध्यक्ष", "संस्थात्मक नियोजन, सदस्य समन्वय आणि शेतकरी-प्रथम कार्यक्रमांच्या प्रत्यक्ष अंमलबजावणीत सहकार्य करतात."),
                    },
                ),
                (
                    "Mr. Nandkishor Shriram Shinde",
                    "Secretary",
                    "Oversees documentation, coordination and member communication for transparent company operations.",
                    "/assets/greenwings-community.png",
                    3,
                    {
                        "hi": ("सचिव", "पारदर्शी कंपनी संचालन के लिए दस्तावेजीकरण, समन्वय और सदस्य संचार की देखरेख करते हैं।"),
                        "mr": ("सचिव", "पारदर्शक कंपनी कामकाजासाठी दस्तऐवजीकरण, समन्वय आणि सदस्य संवादाची देखरेख करतात."),
                    },
                ),
                (
                    "Mrs. Varsha Vishwambhar Patil",
                    "Director",
                    "Represents community development priorities and encourages inclusive participation across farmer groups.",
                    "/assets/greenwings-hero.png",
                    4,
                    {
                        "hi": ("निदेशक", "सामुदायिक विकास प्राथमिकताओं का प्रतिनिधित्व करती हैं और किसान समूहों में समावेशी भागीदारी को प्रोत्साहित करती हैं।"),
                        "mr": ("संचालक", "समुदाय विकासाच्या प्राधान्यांचे प्रतिनिधित्व करतात आणि शेतकरी गटांमध्ये समावेशक सहभागाला प्रोत्साहन देतात."),
                    },
                ),
                (
                    "Mr. Tushar Gorakhanath Shelke",
                    "Director and Chief Executive Officer",
                    "Leads GreenWings operations, digital strategy, farmer services and market-connectivity initiatives.",
                    "/assets/greenwings-community.png",
                    5,
                    {
                        "hi": ("निदेशक और मुख्य कार्यकारी अधिकारी", "ग्रीनविंग्स संचालन, डिजिटल रणनीति, किसान सेवाओं और बाजार-संपर्क पहलों का नेतृत्व करते हैं।"),
                        "mr": ("संचालक आणि मुख्य कार्यकारी अधिकारी", "ग्रीनविंग्सचे कामकाज, डिजिटल धोरण, शेतकरी सेवा आणि बाजार-जोडणी उपक्रमांचे नेतृत्व करतात."),
                    },
                ),
            ]
            for full_name, designation, biography, image, order, translations in leaders:
                cursor = connection.execute(
                    """
                    INSERT INTO leadership_members (fullName, designation, biography, image, displayOrder, active, createdAt, updatedAt)
                    VALUES (?, ?, ?, ?, ?, 1, ?, ?)
                    """,
                    (full_name, designation, biography, image, order, created_at, created_at),
                )
                member_id = int(cursor.lastrowid)
                for language, (localized_designation, localized_biography) in translations.items():
                    connection.execute(
                        """
                        INSERT INTO leadership_member_translations (leadershipMemberId, language, designation, biography, createdAt, updatedAt)
                        VALUES (?, ?, ?, ?, ?, ?)
                        """,
                        (member_id, language, localized_designation, localized_biography, created_at, created_at),
                    )


def seed_company_profile_content() -> None:
    created_at = now_iso()
    company_contents = [
        {
            "sectionKey": "company_introduction",
            "title": "Introduction",
            "subtitle": "Green Wings Farmers Producer Company Limited",
            "content": "\n\n".join(
                [
                    "Green Wings Farmers Producer Company was established on 4 March 2023 under the Government of India’s “Formation and Promotion of 10,000 Farmer Producer Organizations (FPOs)” scheme. The company received financial support from NABARD under this initiative.",
                    "Green Wings Farmers Producer Company was established with the objective of ensuring the progress and prosperity of farmers and securing a brighter future for them. The company was formed to bring farmers together so that they could receive fair and remunerative prices for their agricultural produce. Another key objective was to help farmers reduce their cultivation costs by collectively procuring seeds, fertilizers, and other agricultural inputs at more affordable rates.",
                    "In addition, the Board of Directors adopted a policy of promoting Natural Farming and Organic Farming, while actively encouraging and creating awareness about these sustainable agricultural practices among farmers.",
                    "The Chief Executive Officer, Mr. Tushar Gorakhanath Shelke, envisioned that the agricultural produce of the company should reach markets beyond Yeola Taluka and Nashik District. His goal was to ensure that the company’s produce was marketed not only across Maharashtra and India, but also in international markets. With this vision, the company decided to enter the field of exports as well.",
                    "At the same time, Chairman Mr. Malhari Runjaba Jadhav and Secretary Mr. Nandkishor Shriram Shinde adopted a strategy focused on the processing and value addition of agricultural produce, with the aim of helping farmers obtain better prices and enhanced value for their products.",
                    "Through these initiatives, Green Wings Farmers Producer Company continues to work towards empowering farmers, promoting sustainable agriculture, increasing farm incomes, and creating access to domestic as well as international markets.",
                ]
            ),
            "language": "en",
            "displayOrder": 1,
            "status": "published",
        },
        {
            "sectionKey": "vision",
            "title": "Vision",
            "subtitle": "",
            "content": "To empower farmers by connecting them with fair markets, sustainable farming practices, value-added processing opportunities, and domestic as well as international agricultural trade networks.",
            "language": "en",
            "displayOrder": 2,
            "status": "published",
        },
        {
            "sectionKey": "mission",
            "title": "Mission",
            "subtitle": "",
            "content": "To unite farmers under a strong Farmer Producer Organisation, reduce their input costs through collective procurement, promote natural and organic farming, support value addition of agricultural produce, and help farmers receive better returns through market linkage and export-oriented growth.",
            "language": "en",
            "displayOrder": 3,
            "status": "published",
        },
    ]
    company_content_translations = {
        "hi": {
            "company_introduction": {
                "title": "परिचय",
                "subtitle": "ग्रीन विंग्स फार्मर्स प्रोड्यूसर कंपनी लिमिटेड",
                "content": "\n\n".join(
                    [
                        "ग्रीन विंग्स फार्मर्स प्रोड्यूसर कंपनी की स्थापना 4 मार्च 2023 को भारत सरकार की “10,000 किसान उत्पादक संगठनों के गठन और संवर्धन” योजना के अंतर्गत हुई। इस पहल के तहत कंपनी को NABARD से वित्तीय सहायता प्राप्त हुई।",
                        "कंपनी का उद्देश्य किसानों की प्रगति, समृद्धि और उज्ज्वल भविष्य को मजबूत करना है। किसानों को एकजुट कर उनकी कृषि उपज के लिए उचित और लाभकारी मूल्य दिलाना तथा बीज, उर्वरक और अन्य कृषि इनपुट सामूहिक रूप से कम लागत पर उपलब्ध कराना इसका प्रमुख लक्ष्य है।",
                        "बोर्ड ऑफ डायरेक्टर्स ने प्राकृतिक खेती और जैविक खेती को बढ़ावा देने की नीति अपनाई है और किसानों में इन टिकाऊ कृषि पद्धतियों के प्रति जागरूकता निर्माण पर काम कर रहा है।",
                        "मुख्य कार्यकारी अधिकारी श्री तुषार गोरखनाथ शेलके की दृष्टि है कि कंपनी की कृषि उपज येवला तालुका और नाशिक जिले से आगे महाराष्ट्र, भारत और अंतरराष्ट्रीय बाजारों तक पहुंचे। इसी सोच के साथ कंपनी ने निर्यात क्षेत्र में भी प्रवेश करने का निर्णय लिया।",
                        "अध्यक्ष श्री मल्हारी रुणजाबा जाधव और सचिव श्री नंदकिशोर श्रीराम शिंदे ने कृषि उपज के प्रसंस्करण और मूल्यवर्धन पर आधारित रणनीति अपनाई है, ताकि किसानों को अपने उत्पादों का बेहतर मूल्य मिल सके।",
                        "इन पहलों के माध्यम से ग्रीन विंग्स किसानों को सशक्त बनाने, टिकाऊ कृषि को बढ़ावा देने, किसानों की आय बढ़ाने और घरेलू तथा अंतरराष्ट्रीय बाजारों तक पहुंच बनाने के लिए निरंतर कार्य कर रहा है।",
                    ]
                ),
            },
            "vision": {
                "title": "दृष्टि",
                "subtitle": "",
                "content": "किसानों को उचित बाजारों, टिकाऊ खेती पद्धतियों, मूल्यवर्धित प्रसंस्करण अवसरों और घरेलू तथा अंतरराष्ट्रीय कृषि व्यापार नेटवर्क से जोड़कर सशक्त बनाना।",
            },
            "mission": {
                "title": "मिशन",
                "subtitle": "",
                "content": "किसानों को एक मजबूत किसान उत्पादक संगठन के अंतर्गत संगठित करना, सामूहिक खरीद से इनपुट लागत कम करना, प्राकृतिक और जैविक खेती को बढ़ावा देना, कृषि उपज के मूल्यवर्धन में सहयोग करना और बाजार संपर्क तथा निर्यात-उन्मुख विकास के माध्यम से किसानों को बेहतर रिटर्न दिलाना।",
            },
        },
        "mr": {
            "company_introduction": {
                "title": "परिचय",
                "subtitle": "ग्रीन विंग्स फार्मर्स प्रोड्यूसर कंपनी लिमिटेड",
                "content": "\n\n".join(
                    [
                        "ग्रीन विंग्स फार्मर्स प्रोड्यूसर कंपनीची स्थापना 4 मार्च 2023 रोजी भारत सरकारच्या “10,000 शेतकरी उत्पादक संघटनांची स्थापना आणि प्रोत्साहन” योजनेअंतर्गत झाली. या उपक्रमांतर्गत कंपनीला NABARD कडून आर्थिक सहाय्य मिळाले.",
                        "कंपनीची स्थापना शेतकऱ्यांची प्रगती, समृद्धी आणि उज्ज्वल भविष्य मजबूत करण्याच्या उद्देशाने झाली. शेतकऱ्यांना एकत्र आणून त्यांच्या शेतमालाला योग्य आणि फायदेशीर दर मिळवून देणे, तसेच बियाणे, खते आणि इतर कृषी इनपुट सामूहिक खरेदीद्वारे कमी खर्चात उपलब्ध करून देणे हा प्रमुख उद्देश आहे.",
                        "संचालक मंडळाने नैसर्गिक शेती आणि सेंद्रिय शेतीला प्रोत्साहन देण्याचे धोरण स्वीकारले असून या शाश्वत शेती पद्धतींबद्दल शेतकऱ्यांमध्ये जागरूकता निर्माण करण्यावर भर दिला आहे.",
                        "मुख्य कार्यकारी अधिकारी श्री. तुषार गोरखनाथ शेलके यांची दृष्टी अशी आहे की कंपनीचा शेतमाल येवला तालुका आणि नाशिक जिल्ह्याच्या पलीकडे महाराष्ट्र, भारत आणि आंतरराष्ट्रीय बाजारपेठांपर्यंत पोहोचावा. या दृष्टिकोनातून कंपनीने निर्यात क्षेत्रातही प्रवेश करण्याचा निर्णय घेतला.",
                        "त्याचबरोबर अध्यक्ष श्री. मल्हारी रुणजाबा जाधव आणि सचिव श्री. नंदकिशोर श्रीराम शिंदे यांनी शेतमाल प्रक्रिया आणि मूल्यवर्धनावर आधारित रणनीती स्वीकारली आहे, ज्यामुळे शेतकऱ्यांना त्यांच्या उत्पादनांना अधिक चांगला दर मिळू शकेल.",
                        "या उपक्रमांद्वारे ग्रीन विंग्स शेतकऱ्यांचे सक्षमीकरण, शाश्वत शेतीचा प्रसार, शेतकरी उत्पन्नवाढ आणि देशांतर्गत तसेच आंतरराष्ट्रीय बाजारपेठांशी जोडणी यासाठी सातत्याने कार्य करत आहे.",
                    ]
                ),
            },
            "vision": {
                "title": "दृष्टी",
                "subtitle": "",
                "content": "शेतकऱ्यांना योग्य बाजारपेठा, शाश्वत शेती पद्धती, मूल्यवर्धित प्रक्रिया संधी आणि देशांतर्गत तसेच आंतरराष्ट्रीय कृषी व्यापार नेटवर्कशी जोडून सक्षम करणे.",
            },
            "mission": {
                "title": "मिशन",
                "subtitle": "",
                "content": "शेतकऱ्यांना मजबूत शेतकरी उत्पादक संस्थेखाली एकत्र आणणे, सामूहिक खरेदीद्वारे इनपुट खर्च कमी करणे, नैसर्गिक आणि सेंद्रिय शेतीला प्रोत्साहन देणे, शेतमालाच्या मूल्यवर्धनाला आधार देणे आणि बाजार जोडणी तसेच निर्याताभिमुख वाढीद्वारे शेतकऱ्यांना चांगला परतावा मिळवून देणे.",
            },
        },
    }
    leadership_rows = [
        {
            "fullName": "Mr. Malhari Runjaba Jadhav",
            "designation": "Chairman",
            "roleDescription": "",
            "biography": "",
            "imageUrl": "",
            "displayOrder": 1,
            "active": 1,
        },
        {
            "fullName": "Mr. Manik Ramchandra Rasal",
            "designation": "Vice Chairman",
            "roleDescription": "",
            "biography": "",
            "imageUrl": "",
            "displayOrder": 2,
            "active": 1,
        },
        {
            "fullName": "Mr. Nandkishor Shriram Shinde",
            "designation": "Secretary",
            "roleDescription": "",
            "biography": "",
            "imageUrl": "",
            "displayOrder": 3,
            "active": 1,
        },
        {
            "fullName": "Mrs. Varsha Vishwambhar Patil",
            "designation": "Director",
            "roleDescription": "",
            "biography": "",
            "imageUrl": "",
            "displayOrder": 4,
            "active": 1,
        },
        {
            "fullName": "Mr. Tushar Gorakhanath Shelke",
            "designation": "Director and Chief Executive Officer",
            "roleDescription": "Mr. Tushar Gorakhanath Shelke serves as Director and Chief Executive Officer of Green Wings Farmers Producer Company. He leads the company’s operational management and export-oriented growth vision.",
            "biography": "Mr. Tushar Gorakhanath Shelke serves as Director and Chief Executive Officer of Green Wings Farmers Producer Company. He leads the company’s operational management and export-oriented growth vision.",
            "imageUrl": "",
            "displayOrder": 5,
            "active": 1,
        },
    ]
    timeline_rows = [
        {
            "year": "2023",
            "title": "Company Established",
            "description": "Green Wings Farmers Producer Company was established on 4 March 2023 under the Government of India’s Formation and Promotion of 10,000 Farmer Producer Organizations scheme, with financial support from NABARD.",
            "impactMetric": "Official FPO registration under national FPO promotion initiative",
            "displayOrder": 1,
        },
        {
            "year": "2023",
            "title": "Government Onion Procurement Started",
            "description": "The company began its work through government onion procurement under NAFED in collaboration with Mahakisan Vriddhi Agro Federation.",
            "impactMetric": "First major procurement activity launched",
            "displayOrder": 2,
        },
        {
            "year": "2023",
            "title": "Summer Onion Procurement",
            "description": "In its first year, the company purchased 3,453 quintals of summer onion from farmers and supplied it to NAFED. Farmers received at least ₹2 per kg more than the market committee rate, helping each trolley earn approximately ₹5,000 more.",
            "impactMetric": "3,453 quintals procured, 150+ farmers directly benefited",
            "displayOrder": 3,
        },
        {
            "year": "2023",
            "title": "Red Onion Procurement",
            "description": "The company later received another opportunity for red onion procurement. Under this activity, it purchased 5,861 quintals of onion from farmers and helped more than 200 farmers benefit from better pricing. Farmers received an average of ₹4 per kg more, which increased farmer satisfaction and strengthened membership.",
            "impactMetric": "5,861 quintals procured, 200+ farmers benefited",
            "displayOrder": 4,
        },
        {
            "year": "2023",
            "title": "Membership Growth",
            "description": "After successful onion procurement activities, farmers joined the company as members, increasing the company’s membership base to 323.",
            "impactMetric": "323 members",
            "displayOrder": 5,
        },
        {
            "year": "2023",
            "title": "First-Year Turnover",
            "description": "Due to these procurement activities, the company achieved a turnover of approximately ₹2 crore in its first year. All farmer payments were transferred online directly to their bank accounts.",
            "impactMetric": "₹2 crore first-year turnover",
            "displayOrder": 6,
        },
        {
            "year": "2024",
            "title": "Continued Independent Procurement",
            "description": "Due to changes in government and NAFED procurement policies, and payment delays from Mahakisan Vriddhi Federation, the company did not receive further government onion procurement work. However, Green Wings continued its activities independently and carried on onion procurement at the local level.",
            "impactMetric": "Independent procurement activities continued",
            "displayOrder": 7,
        },
        {
            "year": "2024",
            "title": "Seeds and Organic Fertilizer Support",
            "description": "The company continued supporting farmers by supplying seeds and organic fertilizers, helping farmers access important agricultural inputs.",
            "impactMetric": "Farmer input support continued",
            "displayOrder": 8,
        },
        {
            "year": "2025",
            "title": "Membership Crossed 600+",
            "description": "Through consistent farmer support, procurement activities, and input supply services, Green Wings Farmers Producer Company expanded its membership base to more than 600 farmers.",
            "impactMetric": "600+ members",
            "displayOrder": 9,
        },
    ]
    timeline_translations = {
        "hi": {
            1: ("कंपनी की स्थापना", "ग्रीन विंग्स फार्मर्स प्रोड्यूसर कंपनी की स्थापना 4 मार्च 2023 को भारत सरकार की 10,000 किसान उत्पादक संगठनों के गठन और संवर्धन योजना के अंतर्गत NABARD की वित्तीय सहायता से हुई।", "राष्ट्रीय FPO प्रोत्साहन पहल के अंतर्गत आधिकारिक पंजीकरण"),
            2: ("सरकारी प्याज खरीद शुरू", "कंपनी ने NAFED के अंतर्गत महाकिसान वृद्धि एग्रो फेडरेशन के सहयोग से सरकारी प्याज खरीद के माध्यम से अपना कार्य शुरू किया।", "पहली प्रमुख खरीद गतिविधि शुरू"),
            3: ("ग्रीष्मकालीन प्याज खरीद", "पहले वर्ष में कंपनी ने किसानों से 3,453 क्विंटल ग्रीष्मकालीन प्याज खरीदकर NAFED को आपूर्ति किया। किसानों को बाजार समिति दर से कम से कम ₹2 प्रति किलो अधिक मिला, जिससे प्रत्येक ट्रॉली पर लगभग ₹5,000 अतिरिक्त आय हुई।", "3,453 क्विंटल खरीद, 150+ किसानों को प्रत्यक्ष लाभ"),
            4: ("लाल प्याज खरीद", "बाद में कंपनी को लाल प्याज खरीद का अवसर मिला। इस गतिविधि में 5,861 क्विंटल प्याज खरीदा गया और 200 से अधिक किसानों को बेहतर मूल्य मिला। किसानों को औसतन ₹4 प्रति किलो अधिक मिला, जिससे संतुष्टि और सदस्यता मजबूत हुई।", "5,861 क्विंटल खरीद, 200+ किसानों को लाभ"),
            5: ("सदस्यता वृद्धि", "सफल प्याज खरीद गतिविधियों के बाद किसान कंपनी के सदस्य बने और सदस्य संख्या 323 तक पहुंच गई।", "323 सदस्य"),
            6: ("पहले वर्ष का कारोबार", "इन खरीद गतिविधियों के कारण कंपनी ने पहले वर्ष में लगभग ₹2 करोड़ का कारोबार किया। सभी किसानों का भुगतान सीधे उनके बैंक खातों में ऑनलाइन किया गया।", "₹2 करोड़ पहले वर्ष का कारोबार"),
            7: ("स्वतंत्र खरीद जारी", "सरकारी और NAFED खरीद नीतियों में बदलाव तथा महाकिसान वृद्धि फेडरेशन से भुगतान में देरी के कारण कंपनी को आगे सरकारी प्याज खरीद कार्य नहीं मिला। फिर भी ग्रीन विंग्स ने स्थानीय स्तर पर स्वतंत्र खरीद गतिविधियां जारी रखीं।", "स्वतंत्र खरीद गतिविधियां जारी"),
            8: ("बीज और जैविक खाद सहायता", "कंपनी ने किसानों को बीज और जैविक खाद उपलब्ध कराकर महत्वपूर्ण कृषि इनपुट तक पहुंच में सहयोग जारी रखा।", "किसान इनपुट सहायता जारी"),
            9: ("सदस्यता 600+ पार", "लगातार किसान सहायता, खरीद गतिविधियों और इनपुट आपूर्ति सेवाओं के माध्यम से ग्रीन विंग्स फार्मर्स प्रोड्यूसर कंपनी ने अपनी सदस्य संख्या 600 से अधिक कर ली।", "600+ सदस्य"),
        },
        "mr": {
            1: ("कंपनीची स्थापना", "ग्रीन विंग्स फार्मर्स प्रोड्यूसर कंपनीची स्थापना 4 मार्च 2023 रोजी भारत सरकारच्या 10,000 शेतकरी उत्पादक संघटनांच्या स्थापना आणि प्रोत्साहन योजनेअंतर्गत NABARD च्या आर्थिक सहाय्याने झाली.", "राष्ट्रीय FPO प्रोत्साहन उपक्रमांतर्गत अधिकृत नोंदणी"),
            2: ("सरकारी कांदा खरेदी सुरू", "कंपनीने NAFED अंतर्गत महाकिसान वृद्धी अॅग्रो फेडरेशनच्या सहकार्याने सरकारी कांदा खरेदीद्वारे कामाची सुरुवात केली.", "पहिली मोठी खरेदी गतिविधी सुरू"),
            3: ("उन्हाळी कांदा खरेदी", "पहिल्या वर्षी कंपनीने शेतकऱ्यांकडून 3,453 क्विंटल उन्हाळी कांदा खरेदी करून NAFED ला पुरवठा केला. शेतकऱ्यांना बाजार समिती दरापेक्षा किमान ₹2 प्रति किलो जास्त दर मिळाला, ज्यामुळे प्रत्येक ट्रॉलीमागे अंदाजे ₹5,000 अधिक उत्पन्न झाले.", "3,453 क्विंटल खरेदी, 150+ शेतकऱ्यांना थेट लाभ"),
            4: ("लाल कांदा खरेदी", "नंतर कंपनीला लाल कांदा खरेदीची संधी मिळाली. या उपक्रमात 5,861 क्विंटल कांदा खरेदी करण्यात आला आणि 200 पेक्षा जास्त शेतकऱ्यांना चांगला दर मिळाला. शेतकऱ्यांना सरासरी ₹4 प्रति किलो अधिक मिळाल्याने समाधान आणि सदस्यता मजबूत झाली.", "5,861 क्विंटल खरेदी, 200+ शेतकऱ्यांना लाभ"),
            5: ("सदस्यता वाढ", "यशस्वी कांदा खरेदी उपक्रमांनंतर शेतकरी कंपनीचे सदस्य झाले आणि सदस्य संख्या 323 पर्यंत वाढली.", "323 सदस्य"),
            6: ("पहिल्या वर्षाचा उलाढाल", "या खरेदी उपक्रमांमुळे कंपनीने पहिल्या वर्षात अंदाजे ₹2 कोटींची उलाढाल साध्य केली. सर्व शेतकरी देयके थेट त्यांच्या बँक खात्यात ऑनलाइन जमा करण्यात आली.", "₹2 कोटी पहिल्या वर्षाची उलाढाल"),
            7: ("स्वतंत्र खरेदी सुरूच", "सरकारी आणि NAFED खरेदी धोरणांतील बदल तसेच महाकिसान वृद्धी फेडरेशनकडून देयक विलंबामुळे कंपनीला पुढील सरकारी कांदा खरेदीचे काम मिळाले नाही. तरीही ग्रीन विंग्सने स्थानिक पातळीवर स्वतंत्र खरेदी सुरू ठेवली.", "स्वतंत्र खरेदी गतिविधी सुरू"),
            8: ("बियाणे आणि सेंद्रिय खत सहाय्य", "कंपनीने शेतकऱ्यांना बियाणे आणि सेंद्रिय खते पुरवून महत्त्वाच्या कृषी इनपुटपर्यंतची मदत सुरू ठेवली.", "शेतकरी इनपुट सहाय्य सुरू"),
            9: ("सदस्यता 600+ पार", "सातत्यपूर्ण शेतकरी सहाय्य, खरेदी उपक्रम आणि इनपुट पुरवठा सेवांद्वारे ग्रीन विंग्स फार्मर्स प्रोड्यूसर कंपनीची सदस्य संख्या 600 पेक्षा जास्त झाली.", "600+ सदस्य"),
        },
    }
    leadership_translations = {
        "hi": {
            "Mr. Malhari Runjaba Jadhav": ("अध्यक्ष", "श्री मल्हारी रुणजाबा जाधव किसान विश्वास, सुशासन और सामूहिक ग्रामीण विकास पर ध्यान केंद्रित करते हुए ग्रीन विंग्स को रणनीतिक दिशा प्रदान करते हैं।"),
            "Mr. Manik Ramchandra Rasal": ("उपाध्यक्ष", "श्री माणिक रामचंद्र रासल संगठनात्मक योजना, सदस्य समन्वय और किसान-प्रथम कार्यक्रमों के व्यावहारिक क्रियान्वयन में सहयोग करते हैं।"),
            "Mr. Nandkishor Shriram Shinde": ("सचिव", "श्री नंदकिशोर श्रीराम शिंदे पारदर्शी कंपनी संचालन के लिए दस्तावेजीकरण, समन्वय और सदस्य संवाद की जिम्मेदारी संभालते हैं।"),
            "Mrs. Varsha Vishwambhar Patil": ("निदेशक", "श्रीमती वर्षा विश्वंभर पाटिल सामुदायिक विकास प्राथमिकताओं का प्रतिनिधित्व करती हैं और किसान समूहों में समावेशी भागीदारी को प्रोत्साहित करती हैं।"),
            "Mr. Tushar Gorakhanath Shelke": ("निदेशक और मुख्य कार्यकारी अधिकारी", "श्री तुषार गोरखनाथ शेलके ग्रीन विंग्स के संचालन, डिजिटल रणनीति, किसान सेवाओं और बाजार-जोड़णी उपक्रमों का नेतृत्व करते हैं।"),
        },
        "mr": {
            "Mr. Malhari Runjaba Jadhav": ("अध्यक्ष", "श्री. मल्हारी रुणजाबा जाधव शेतकरी विश्वास, सुशासन आणि सामूहिक ग्रामीण विकासावर लक्ष केंद्रित करून ग्रीन विंग्सला धोरणात्मक दिशा देतात."),
            "Mr. Manik Ramchandra Rasal": ("उपाध्यक्ष", "श्री. माणिक रामचंद्र रासल संस्थात्मक नियोजन, सदस्य समन्वय आणि शेतकरी-प्रथम कार्यक्रमांच्या प्रत्यक्ष अंमलबजावणीत सहकार्य करतात."),
            "Mr. Nandkishor Shriram Shinde": ("सचिव", "श्री. नंदकिशोर श्रीराम शिंदे पारदर्शक कंपनी कामकाजासाठी दस्तऐवजीकरण, समन्वय आणि सदस्य संवादाची जबाबदारी सांभाळतात."),
            "Mrs. Varsha Vishwambhar Patil": ("संचालक", "श्रीमती वर्षा विश्वंभर पाटील समुदाय विकासाच्या प्राधान्यांचे प्रतिनिधित्व करतात आणि शेतकरी गटांमध्ये समावेशक सहभागाला प्रोत्साहन देतात."),
            "Mr. Tushar Gorakhanath Shelke": ("संचालक आणि मुख्य कार्यकारी अधिकारी", "श्री. तुषार गोरखनाथ शेलके ग्रीन विंग्सचे कामकाज, डिजिटल धोरण, शेतकरी सेवा आणि बाजार-जोडणी उपक्रमांचे नेतृत्व करतात."),
        },
    }
    statistics = [
        ("Farmers Connected", "600+", "", 1),
        ("Summer Onion Procured", "3,453 Quintals", "", 2),
        ("Red Onion Procured", "5,861 Quintals", "", 3),
        ("First-Year Turnover", "₹2 Crore", "", 4),
        ("Farmers Benefited", "350+", "", 5),
    ]
    with database() as connection:
        for item in company_contents:
            connection.execute(
                """
                INSERT OR IGNORE INTO company_contents (
                    sectionKey, title, subtitle, content, language, displayOrder, status, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    item["sectionKey"],
                    item["title"],
                    item["subtitle"],
                    item["content"],
                    item["language"],
                    item["displayOrder"],
                    item["status"],
                    created_at,
                    created_at,
                ),
            )
        for language, sections in company_content_translations.items():
            for section_key, translated in sections.items():
                source = next((item for item in company_contents if item["sectionKey"] == section_key), None)
                if not source:
                    continue
                connection.execute(
                    """
                    INSERT OR IGNORE INTO company_contents (
                        sectionKey, title, subtitle, content, language, displayOrder, status, createdAt, updatedAt
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        section_key,
                        translated["title"],
                        translated.get("subtitle", ""),
                        translated["content"],
                        language,
                        source["displayOrder"],
                        source["status"],
                        created_at,
                        created_at,
                    ),
                )

        for item in leadership_rows:
            existing = connection.execute(
                "SELECT * FROM leadership_members WHERE fullName = ?",
                (item["fullName"],),
            ).fetchone()
            if not existing:
                connection.execute(
                    """
                    INSERT INTO leadership_members (
                        fullName, designation, roleDescription, biography, image, imageUrl,
                        language, displayOrder, active, createdAt, updatedAt
                    ) VALUES (?, ?, ?, ?, '', ?, 'en', ?, ?, ?, ?)
                    """,
                    (
                        item["fullName"],
                        item["designation"],
                        item["roleDescription"],
                        item["biography"],
                        item["imageUrl"],
                        item["displayOrder"],
                        item["active"],
                        created_at,
                        created_at,
                    ),
                )
                member_id = int(connection.execute("SELECT last_insert_rowid()").fetchone()[0])
                for language, translations in leadership_translations.items():
                    translated = translations.get(item["fullName"])
                    if not translated:
                        continue
                    connection.execute(
                        """
                        INSERT OR IGNORE INTO leadership_member_translations (
                            leadershipMemberId, language, designation, biography, createdAt, updatedAt
                        ) VALUES (?, ?, ?, ?, ?, ?)
                        """,
                        (member_id, language, translated[0], translated[1], created_at, created_at),
                    )
                continue

            updates: list[str] = []
            values: list[object] = []
            for field in ("roleDescription", "imageUrl"):
                if item[field] and not str(existing[field] or "").strip():
                    updates.append(f"{field} = ?")
                    values.append(item[field])
            if item["biography"] and not str(existing["biography"] or "").strip():
                updates.append("biography = ?")
                values.append(item["biography"])
            if updates:
                updates.append("updatedAt = ?")
                values.append(created_at)
                values.append(existing["id"])
                connection.execute(f"UPDATE leadership_members SET {', '.join(updates)} WHERE id = ?", values)
            member_id = int(existing["id"])
            for language, translations in leadership_translations.items():
                translated = translations.get(item["fullName"])
                if not translated:
                    continue
                connection.execute(
                    """
                    INSERT OR IGNORE INTO leadership_member_translations (
                        leadershipMemberId, language, designation, biography, createdAt, updatedAt
                    ) VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (member_id, language, translated[0], translated[1], created_at, created_at),
                )

        for item in timeline_rows:
            existing_timeline = connection.execute(
                """
                SELECT 1 FROM company_timelines
                WHERE year = ? AND language = 'en' AND displayOrder = ?
                """,
                (item["year"], item["displayOrder"]),
            ).fetchone()
            if not existing_timeline:
                connection.execute(
                    """
                    INSERT INTO company_timelines (
                        year, title, description, impactMetric, language, displayOrder, status, createdAt, updatedAt
                    ) VALUES (?, ?, ?, ?, 'en', ?, 'published', ?, ?)
                    """,
                    (
                        item["year"],
                        item["title"],
                        item["description"],
                        item["impactMetric"],
                        item["displayOrder"],
                        created_at,
                        created_at,
                    ),
                )
            for language, translations in timeline_translations.items():
                translated = translations.get(item["displayOrder"])
                if not translated:
                    continue
                existing_translation = connection.execute(
                    """
                    SELECT 1 FROM company_timelines
                    WHERE year = ? AND language = ? AND displayOrder = ?
                    """,
                    (item["year"], language, item["displayOrder"]),
                ).fetchone()
                if existing_translation:
                    continue
                connection.execute(
                    """
                    INSERT INTO company_timelines (
                        year, title, description, impactMetric, language, displayOrder, status, createdAt, updatedAt
                    ) VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?)
                    """,
                    (
                        item["year"],
                        translated[0],
                        translated[1],
                        translated[2],
                        language,
                        item["displayOrder"],
                        created_at,
                        created_at,
                    ),
                )

        for label, value, description, order in statistics:
            connection.execute(
                """
                INSERT OR IGNORE INTO homepage_statistics (
                    label, value, description, displayOrder, active, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, 1, ?, ?)
                """,
                (label, value, description, order, created_at, created_at),
            )


def rate_limited(key: str, limit: int, window_seconds: int) -> bool:
    current = time.time()
    entries = [stamp for stamp in RATE_LIMITS.get(key, []) if current - stamp < window_seconds]
    if len(entries) >= limit:
        RATE_LIMITS[key] = entries
        return True
    entries.append(current)
    RATE_LIMITS[key] = entries
    return False


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        PASSWORD_ITERATIONS,
    ).hex()
    return f"pbkdf2_sha256${PASSWORD_ITERATIONS}${salt}${digest}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        algorithm, iterations, salt, digest = stored_hash.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        computed = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            bytes.fromhex(salt),
            int(iterations),
        ).hex()
        return hmac.compare_digest(computed, digest)
    except (TypeError, ValueError):
        return False


def hash_ip_address(ip_address: str) -> str:
    return hashlib.sha256(TOKEN_SECRET + ip_address.encode("utf-8")).hexdigest()


def detect_device_type(user_agent: str) -> str:
    lower_agent = user_agent.lower()
    if "mobile" in lower_agent or "android" in lower_agent or "iphone" in lower_agent:
        return "Mobile"
    if "ipad" in lower_agent or "tablet" in lower_agent:
        return "Tablet"
    return "Desktop"


def detect_browser(user_agent: str) -> str:
    lower_agent = user_agent.lower()
    if "edg/" in lower_agent:
        return "Edge"
    if "chrome/" in lower_agent:
        return "Chrome"
    if "firefox/" in lower_agent:
        return "Firefox"
    if "safari/" in lower_agent:
        return "Safari"
    return "Other"


def row_to_user(row: sqlite3.Row) -> dict:
    role = "admin" if str(row["role"]).lower() == "admin" else "member"
    return {
        "id": row["id"],
        "firstName": row["firstName"],
        "lastName": row["lastName"],
        "name": f"{row['firstName']} {row['lastName']}".strip(),
        "mobileNumber": row["mobileNumber"],
        "email": row["email"],
        "interest": row["interest"],
        "enquiryQuestion": row["enquiryQuestion"],
        "address": row["address"],
        "state": row["state"],
        "country": row["country"],
        "role": role,
        "emailVerified": bool(row["emailVerified"]),
        "createdAt": row["createdAt"],
        "updatedAt": row["updatedAt"],
    }


def row_to_enquiry(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "enquiryId": row["enquiryId"],
        "userId": row["userId"],
        "subject": row["subject"],
        "category": row["category"],
        "description": row["description"],
        "priority": row["priority"],
        "status": row["status"],
        "createdAt": row["createdAt"],
        "updatedAt": row["updatedAt"],
    }


def row_to_fertilizer(row: sqlite3.Row, kind: str, language: str = "en", translation: sqlite3.Row | None = None) -> dict:
    item = dict(row)
    item["kind"] = kind
    item["language"] = language
    item["displayName"] = item["name"]
    item["displayCategory"] = item["category"]
    item["localizedDescription"] = item["description"]
    item["localizedContent"] = item["content"]
    item["localizedUses"] = item["uses"]
    item["localizedBenefits"] = item["benefits"]
    item["localizedPrecautions"] = item["precautions"]
    if translation:
        item["displayName"] = translation["name"] or item["name"]
        item["displayCategory"] = translation["category"] or item["category"]
        item["localizedDescription"] = translation["description"] or item["description"]
        item["localizedContent"] = translation["content"] or item["content"]
        item["localizedUses"] = translation["uses"] or item["uses"]
        item["localizedBenefits"] = translation["benefits"] or item["benefits"]
        item["localizedPrecautions"] = translation["precautions"] or item["precautions"]
    return item


def localized_fertilizer(connection: sqlite3.Connection, row: sqlite3.Row, kind: str, language: str) -> dict:
    _, translation_table = fertilizer_tables(kind)
    translation = None
    if language != "en":
        translation = connection.execute(
            f"""
            SELECT name, category, description, content, uses, benefits, precautions
            FROM {translation_table}
            WHERE fertilizerId = ? AND language = ?
            """,
            (row["id"], language),
        ).fetchone()
    return row_to_fertilizer(row, kind, language, translation)


def fertilizer_payload(body: dict, kind: str) -> tuple[dict, list[str]]:
    required_fields = ["name", "category", "manufacturer", "countryOfOrigin", "description", "content"]
    clean = {field: str(body.get(field, "")).strip() for field in FERTILIZER_FIELDS}
    clean["status"] = clean["status"] or "active"
    if clean["status"] not in {"active", "draft", "inactive"}:
        clean["status"] = "active"
    if kind == "local":
        clean["approvalBody"] = str(body.get("approvalBody", "")).strip()
        clean["regionalRecommendations"] = str(body.get("regionalRecommendations", "")).strip()
    else:
        clean["brand"] = str(body.get("brand", "")).strip()
        clean["importCertifications"] = str(body.get("importCertifications", "")).strip()
        clean["internationalSpecifications"] = str(body.get("internationalSpecifications", "")).strip()
    errors = [f"{field} is required." for field in required_fields if not clean.get(field)]
    return clean, errors


def upsert_fertilizer_translations(
    connection: sqlite3.Connection,
    table: str,
    fertilizer_id: int,
    translations: dict,
    timestamp: str,
) -> None:
    if not isinstance(translations, dict):
        return
    for language, values in translations.items():
        if language not in {"hi", "mr"} or not isinstance(values, dict):
            continue
        clean = {
            "name": str(values.get("name", "")).strip(),
            "category": str(values.get("category", "")).strip(),
            "description": str(values.get("description", "")).strip(),
            "content": str(values.get("content", "")).strip(),
            "uses": str(values.get("uses", "")).strip(),
            "benefits": str(values.get("benefits", "")).strip(),
            "precautions": str(values.get("precautions", "")).strip(),
        }
        if not any(clean.values()):
            continue
        connection.execute(
            f"""
            INSERT INTO {table} (
                fertilizerId, language, name, category, description, content, uses, benefits, precautions, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(fertilizerId, language) DO UPDATE SET
                name = excluded.name,
                category = excluded.category,
                description = excluded.description,
                content = excluded.content,
                uses = excluded.uses,
                benefits = excluded.benefits,
                precautions = excluded.precautions,
                updatedAt = excluded.updatedAt
            """,
            (
                fertilizer_id,
                language,
                clean["name"],
                clean["category"],
                clean["description"],
                clean["content"],
                clean["uses"],
                clean["benefits"],
                clean["precautions"],
                timestamp,
                timestamp,
            ),
        )


def row_to_company_story(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "title": row["title"],
        "slug": row["slug"],
        "language": row["language"],
        "content": row["content"],
        "featuredImage": row["featuredImage"],
        "displayOrder": row["displayOrder"],
        "status": row["status"],
        "createdAt": row["createdAt"],
        "updatedAt": row["updatedAt"],
    }


def row_to_company_content(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "sectionKey": row["sectionKey"],
        "title": row["title"],
        "subtitle": row["subtitle"] or "",
        "content": row["content"],
        "language": row["language"],
        "displayOrder": row["displayOrder"],
        "status": row["status"],
        "createdAt": row["createdAt"],
        "updatedAt": row["updatedAt"],
    }


def row_to_company_milestone(row: sqlite3.Row, translation: sqlite3.Row | None = None) -> dict:
    return {
        "id": row["id"],
        "year": row["year"],
        "title": translation["title"] if translation and translation["title"] else row["title"],
        "description": translation["description"] if translation and translation["description"] else row["description"],
        "baseTitle": row["title"],
        "baseDescription": row["description"],
        "image": row["image"],
        "displayOrder": row["displayOrder"],
        "createdAt": row["createdAt"],
        "updatedAt": row["updatedAt"],
    }


def row_to_company_timeline(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "year": row["year"],
        "title": row["title"],
        "description": row["description"],
        "impactMetric": row["impactMetric"] or "",
        "language": row["language"],
        "displayOrder": row["displayOrder"],
        "status": row["status"],
        "createdAt": row["createdAt"],
        "updatedAt": row["updatedAt"],
    }


def row_to_homepage_statistic(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "label": row["label"],
        "value": row["value"],
        "description": row["description"] or "",
        "displayOrder": row["displayOrder"],
        "active": bool(row["active"]),
        "createdAt": row["createdAt"],
        "updatedAt": row["updatedAt"],
    }


def row_to_leadership_member(row: sqlite3.Row, translation: sqlite3.Row | None = None) -> dict:
    image_url = row["imageUrl"] or row["image"] or ""
    localized_biography = translation["biography"] if translation and translation["biography"] else row["biography"]
    localized_role = localized_biography if translation and translation["biography"] else (row["roleDescription"] or "")
    return {
        "id": row["id"],
        "fullName": row["fullName"],
        "designation": translation["designation"] if translation and translation["designation"] else row["designation"],
        "roleDescription": localized_role,
        "biography": localized_biography,
        "baseDesignation": row["designation"],
        "baseRoleDescription": row["roleDescription"] or "",
        "baseBiography": row["biography"],
        "image": image_url,
        "imageUrl": image_url,
        "language": row["language"] if "language" in row.keys() else "en",
        "displayOrder": row["displayOrder"],
        "active": bool(row["active"]),
        "createdAt": row["createdAt"],
        "updatedAt": row["updatedAt"],
    }


def company_story_payload(body: dict) -> tuple[dict, list[str]]:
    clean = {field: str(body.get(field, "")).strip() for field in COMPANY_STORY_FIELDS}
    clean["language"] = clean["language"] if clean["language"] in SUPPORTED_LANGUAGES else "en"
    clean["status"] = clean["status"] if clean["status"] in {"draft", "published", "archived"} else "published"
    try:
        clean["displayOrder"] = int(body.get("displayOrder", 0))
    except (TypeError, ValueError):
        clean["displayOrder"] = 0
    errors = [f"{field} is required." for field in ["title", "slug", "language", "content"] if not clean.get(field)]
    return clean, errors


def company_content_payload(body: dict) -> tuple[dict, list[str]]:
    clean = {field: str(body.get(field, "")).strip() for field in COMPANY_CONTENT_FIELDS}
    clean["language"] = clean["language"] if clean["language"] in SUPPORTED_LANGUAGES else "en"
    clean["status"] = clean["status"] if clean["status"] in {"draft", "published", "archived"} else "published"
    try:
        clean["displayOrder"] = int(body.get("displayOrder", 0))
    except (TypeError, ValueError):
        clean["displayOrder"] = 0
    errors = [f"{field} is required." for field in ["sectionKey", "title", "content", "language"] if not clean.get(field)]
    return clean, errors


def company_milestone_payload(body: dict) -> tuple[dict, list[str]]:
    clean = {field: str(body.get(field, "")).strip() for field in COMPANY_MILESTONE_FIELDS}
    try:
        clean["displayOrder"] = int(body.get("displayOrder", 0))
    except (TypeError, ValueError):
        clean["displayOrder"] = 0
    errors = [f"{field} is required." for field in ["year", "title", "description"] if not clean.get(field)]
    return clean, errors


def company_timeline_payload(body: dict) -> tuple[dict, list[str]]:
    clean = {field: str(body.get(field, "")).strip() for field in COMPANY_TIMELINE_FIELDS}
    clean["language"] = clean["language"] if clean["language"] in SUPPORTED_LANGUAGES else "en"
    clean["status"] = clean["status"] if clean["status"] in {"draft", "published", "archived"} else "published"
    try:
        clean["displayOrder"] = int(body.get("displayOrder", 0))
    except (TypeError, ValueError):
        clean["displayOrder"] = 0
    errors = [f"{field} is required." for field in ["year", "title", "description", "language"] if not clean.get(field)]
    return clean, errors


def homepage_statistic_payload(body: dict) -> tuple[dict, list[str]]:
    clean = {field: str(body.get(field, "")).strip() for field in HOMEPAGE_STATISTIC_FIELDS}
    try:
        clean["displayOrder"] = int(body.get("displayOrder", 0))
    except (TypeError, ValueError):
        clean["displayOrder"] = 0
    clean["active"] = 1 if body.get("active", True) in {True, 1, "1", "true", "active", "yes"} else 0
    errors = [f"{field} is required." for field in ["label", "value"] if not clean.get(field)]
    return clean, errors


def leadership_payload(body: dict) -> tuple[dict, list[str]]:
    clean = {field: str(body.get(field, "")).strip() for field in LEADERSHIP_FIELDS}
    if not clean["imageUrl"]:
        clean["imageUrl"] = clean["image"]
    if not clean["image"]:
        clean["image"] = clean["imageUrl"]
    try:
        clean["displayOrder"] = int(body.get("displayOrder", 0))
    except (TypeError, ValueError):
        clean["displayOrder"] = 0
    clean["active"] = 1 if body.get("active", True) in {True, 1, "1", "true", "active", "yes"} else 0
    errors = [f"{field} is required." for field in ["fullName", "designation", "biography"] if not clean.get(field)]
    return clean, errors


def upsert_milestone_translations(connection: sqlite3.Connection, milestone_id: int, translations: dict, timestamp: str) -> None:
    if not isinstance(translations, dict):
        return
    for language, values in translations.items():
        if language not in {"hi", "mr"} or not isinstance(values, dict):
            continue
        title = str(values.get("title", "")).strip()
        description = str(values.get("description", "")).strip()
        if not title and not description:
            continue
        connection.execute(
            """
            INSERT INTO company_milestone_translations (milestoneId, language, title, description, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(milestoneId, language) DO UPDATE SET
                title = excluded.title,
                description = excluded.description,
                updatedAt = excluded.updatedAt
            """,
            (milestone_id, language, title, description, timestamp, timestamp),
        )


def upsert_leadership_translations(connection: sqlite3.Connection, member_id: int, translations: dict, timestamp: str) -> None:
    if not isinstance(translations, dict):
        return
    for language, values in translations.items():
        if language not in {"hi", "mr"} or not isinstance(values, dict):
            continue
        designation = str(values.get("designation", "")).strip()
        biography = str(values.get("biography", "")).strip()
        if not designation and not biography:
            continue
        connection.execute(
            """
            INSERT INTO leadership_member_translations (leadershipMemberId, language, designation, biography, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(leadershipMemberId, language) DO UPDATE SET
                designation = excluded.designation,
                biography = excluded.biography,
                updatedAt = excluded.updatedAt
            """,
            (member_id, language, designation, biography, timestamp, timestamp),
        )


def story_collection(connection: sqlite3.Connection, language: str) -> list[dict]:
    rows = connection.execute(
        """
        SELECT * FROM company_stories
        WHERE status = 'published' AND language IN ('en', ?)
        ORDER BY displayOrder, title
        """,
        (language,),
    ).fetchall()
    by_slug: dict[str, dict] = {}
    for row in rows:
        item = row_to_company_story(row)
        current = by_slug.get(item["slug"])
        if not current or item["language"] == language:
            by_slug[item["slug"]] = item
    return sorted(by_slug.values(), key=lambda item: (item["displayOrder"], item["title"]))


def content_collection(connection: sqlite3.Connection, language: str, only_public: bool = True) -> list[dict]:
    clauses = ["language IN ('en', ?)"]
    params: list[object] = [language]
    if only_public:
        clauses.append("status = 'published'")
    rows = connection.execute(
        f"""
        SELECT * FROM company_contents
        WHERE {' AND '.join(clauses)}
        ORDER BY displayOrder, sectionKey
        """,
        params,
    ).fetchall()
    by_key: dict[str, dict] = {}
    for row in rows:
        item = row_to_company_content(row)
        current = by_key.get(item["sectionKey"])
        if not current or item["language"] == language:
            by_key[item["sectionKey"]] = item
    return sorted(by_key.values(), key=lambda item: (item["displayOrder"], item["sectionKey"]))


def milestone_collection(connection: sqlite3.Connection, language: str, only_public: bool = True) -> list[dict]:
    rows = connection.execute("SELECT * FROM company_milestones ORDER BY displayOrder, year").fetchall()
    milestones: list[dict] = []
    for row in rows:
        translation = None
        translations = {}
        if language != "en":
            translation = connection.execute(
                """
                SELECT * FROM company_milestone_translations
                WHERE milestoneId = ? AND language = ?
                """,
                (row["id"], language),
            ).fetchone()
        if not only_public:
            translations = {
                item["language"]: {"title": item["title"], "description": item["description"]}
                for item in connection.execute(
                    """
                    SELECT language, title, description
                    FROM company_milestone_translations
                    WHERE milestoneId = ?
                    ORDER BY language
                    """,
                    (row["id"],),
                ).fetchall()
            }
        milestone = row_to_company_milestone(row, translation)
        if translations:
            milestone["translations"] = translations
        milestones.append(milestone)
    return milestones


def timeline_collection(connection: sqlite3.Connection, language: str, only_public: bool = True) -> list[dict]:
    clauses = ["language IN ('en', ?)"]
    params: list[object] = [language]
    if only_public:
        clauses.append("status = 'published'")
    rows = connection.execute(
        f"""
        SELECT * FROM company_timelines
        WHERE {' AND '.join(clauses)}
        ORDER BY displayOrder, year
        """,
        params,
    ).fetchall()
    by_identity: dict[str, dict] = {}
    for row in rows:
        item = row_to_company_timeline(row)
        key = f"{item['displayOrder']}::{item['year']}"
        current = by_identity.get(key)
        if not current or item["language"] == language:
            by_identity[key] = item
    return sorted(by_identity.values(), key=lambda item: (item["displayOrder"], item["year"], item["title"]))


def statistic_collection(connection: sqlite3.Connection, only_active: bool = True) -> list[dict]:
    where = "WHERE active = 1" if only_active else ""
    rows = connection.execute(
        f"SELECT * FROM homepage_statistics {where} ORDER BY displayOrder, label"
    ).fetchall()
    return [row_to_homepage_statistic(row) for row in rows]


def leadership_collection(connection: sqlite3.Connection, language: str, only_active: bool = True) -> list[dict]:
    where = "WHERE active = 1" if only_active else ""
    rows = connection.execute(f"SELECT * FROM leadership_members {where} ORDER BY displayOrder, fullName").fetchall()
    members: list[dict] = []
    for row in rows:
        translation = None
        translations = {}
        if language != "en":
            translation = connection.execute(
                """
                SELECT * FROM leadership_member_translations
                WHERE leadershipMemberId = ? AND language = ?
                """,
                (row["id"], language),
            ).fetchone()
        if not only_active:
            translations = {
                item["language"]: {"designation": item["designation"], "biography": item["biography"]}
                for item in connection.execute(
                    """
                    SELECT language, designation, biography
                    FROM leadership_member_translations
                    WHERE leadershipMemberId = ?
                    ORDER BY language
                    """,
                    (row["id"],),
                ).fetchall()
            }
        member = row_to_leadership_member(row, translation)
        if translations:
            member["translations"] = translations
        members.append(member)
    return members


def validate_registration(payload: dict) -> list[str]:
    required_fields = [
        "firstName",
        "lastName",
        "mobileNumber",
        "email",
        "password",
        "interest",
        "enquiryQuestion",
        "address",
        "state",
        "country",
    ]
    errors: list[str] = []
    for field in required_fields:
        if not str(payload.get(field, "")).strip():
            errors.append(f"{field} is required.")
    email = str(payload.get("email", "")).strip().lower()
    if email and not EMAIL_PATTERN.match(email):
        errors.append("Please enter a valid email address.")
    password = str(payload.get("password", ""))
    if password and len(password) < 8:
        errors.append("Password must be at least 8 characters.")
    mobile = re.sub(r"\D", "", str(payload.get("mobileNumber", "")))
    if mobile and len(mobile) < 10:
        errors.append("Please enter a valid mobile number.")
    return errors


def generate_enquiry_id(connection: sqlite3.Connection) -> str:
    year = datetime.now(timezone.utc).year
    for _ in range(10):
        candidate = f"GW-{year}-{secrets.randbelow(900000) + 100000}"
        exists = connection.execute("SELECT 1 FROM enquiries WHERE enquiryId = ?", (candidate,)).fetchone()
        if not exists:
            return candidate
    return f"GW-{year}-{int(time.time())}"


def send_admin_registration_email(user: dict, enquiry: dict | None) -> None:
    smtp_host = os.environ.get("SMTP_HOST", "").strip()
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER", "").strip()
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    admin_email = os.environ.get("ADMIN_EMAIL", "").strip()
    email_from = os.environ.get("EMAIL_FROM", "").strip() or smtp_user

    if not smtp_host or not admin_email or not email_from:
        print("[email] Registration notification skipped: SMTP is not configured.")
        return

    message = EmailMessage()
    message["Subject"] = f"New GreenWings registration: {user['name']}"
    message["From"] = email_from
    message["To"] = admin_email
    message.set_content(
        "\n".join(
            [
                "A new member registered on GreenWings.",
                "",
                f"Name: {user['name']}",
                f"Email: {user['email']}",
                f"Mobile: {user['mobileNumber']}",
                f"Interest: {user['interest']}",
                f"Question: {user['enquiryQuestion']}",
                f"Address: {user['address']}, {user['state']}, {user['country']}",
                f"Enquiry ID: {enquiry['enquiryId'] if enquiry else 'Not created'}",
                f"Registered at: {user['createdAt']}",
            ]
        )
    )

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as smtp:
            if smtp_port == 587:
                smtp.starttls()
            if smtp_user and smtp_password:
                smtp.login(smtp_user, smtp_password)
            smtp.send_message(message)
    except Exception:
        print("[email] Registration notification failed.")


def localized_product(connection: sqlite3.Connection, row: sqlite3.Row, language: str) -> dict:
    product = dict(row)
    product["language"] = language
    product["display_name"] = product["name"]
    product["display_type"] = product["type"]
    product["localized_description"] = product["description"]
    product["localized_info"] = product["info"]

    if language != "en":
        translation = connection.execute(
            """
            SELECT display_name, display_type, category, season, description, info
            FROM produce_translations
            WHERE produce_id = ? AND language = ?
            """,
            (row["produce_id"], language),
        ).fetchone()
        if translation:
            product.update({
                "display_name": translation["display_name"],
                "display_type": translation["display_type"],
                "localized_category": translation["category"],
                "localized_season": translation["season"],
                "localized_description": translation["description"],
                "localized_info": translation["info"],
            })

    product["subtypes"] = [
        localized_subtype(connection, item, language) for item in connection.execute(
            "SELECT * FROM subtypes WHERE produce_id = ? ORDER BY subtype_name", (row["produce_id"],)
        ).fetchall()
    ]
    return product


def localized_subtype(connection: sqlite3.Connection, row: sqlite3.Row, language: str) -> dict:
    subtype = dict(row)
    subtype["language"] = language
    subtype["display_name"] = subtype["subtype_name"]
    subtype["localized_description"] = subtype["description"]
    subtype["localized_info"] = subtype["info"]

    if language != "en":
        translation = connection.execute(
            """
            SELECT display_name, origin_state, taste_profile, description, info
            FROM subtype_translations
            WHERE subtype_id = ? AND language = ?
            """,
            (row["subtype_id"], language),
        ).fetchone()
        if translation:
            subtype.update({
                "display_name": translation["display_name"],
                "localized_origin_state": translation["origin_state"],
                "localized_taste_profile": translation["taste_profile"],
                "localized_description": translation["description"],
                "localized_info": translation["info"],
            })

    return subtype


class ApiHandler(BaseHTTPRequestHandler):
    def send_json(self, status: int, payload: object) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "http://127.0.0.1:5173")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.end_headers()
        self.wfile.write(body)

    def read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        try:
            return json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError:
            return {}

    def client_ip(self) -> str:
        return self.headers.get("CF-Connecting-IP") or self.client_address[0]

    def current_user(self) -> dict | None:
        header = self.headers.get("Authorization", "")
        return decode_token(header.removeprefix("Bearer ")) if header.startswith("Bearer ") else None

    def do_OPTIONS(self) -> None:
        self.send_json(204, {})

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            self.send_json(200, {"status": "ok", "database": str(DB_PATH.name)})
            return
        if parsed.path == "/api/auth/me":
            user = self.current_user()
            self.send_json(200 if user else 401, {"user": user} if user else {"error": "Unauthorized"})
            return
        if parsed.path == "/api/admin/summary":
            self.handle_admin_summary()
            return
        if parsed.path in {"/api/company-content", "/api/content/about"}:
            self.handle_company_content(parsed)
            return
        if parsed.path == "/api/admin/company-stories":
            self.handle_admin_company_story_list(parsed)
            return
        if parsed.path == "/api/admin/company-contents":
            self.handle_admin_company_content_list(parsed)
            return
        if parsed.path == "/api/admin/company-milestones":
            self.handle_admin_company_milestone_list()
            return
        if parsed.path == "/api/admin/company-timelines":
            self.handle_admin_company_timeline_list(parsed)
            return
        if parsed.path == "/api/admin/homepage-statistics":
            self.handle_admin_homepage_statistic_list()
            return
        if parsed.path == "/api/admin/leadership-members":
            self.handle_admin_leadership_list()
            return
        if parsed.path == "/api/admin/fertilizers":
            self.handle_admin_fertilizer_list(parsed)
            return
        if parsed.path == "/api/enquiries":
            self.handle_enquiry_list()
            return
        if parsed.path == "/api/fertilizers":
            self.handle_fertilizer_list(parsed)
            return
        if parsed.path.startswith("/api/fertilizers/"):
            self.handle_fertilizer_detail(parsed)
            return
        if parsed.path == "/api/products":
            query = parse_qs(parsed.query)
            language = requested_language(query)
            product_type = query.get("type", [None])[0]
            with database() as connection:
                if product_type:
                    rows = connection.execute("SELECT * FROM produce WHERE type = ? ORDER BY name", (product_type,)).fetchall()
                else:
                    rows = connection.execute("SELECT * FROM produce ORDER BY type, name").fetchall()
                products = [localized_product(connection, row, language) for row in rows]
            self.send_json(200, {"language": language, "products": products})
            return
        self.send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/auth/login":
            self.handle_login()
            return
        if parsed.path == "/api/auth/register":
            self.handle_registration()
            return
        if parsed.path == "/api/enquiries":
            self.handle_create_enquiry()
            return
        if parsed.path == "/api/analytics/visit":
            self.handle_visit_tracking()
            return
        if parsed.path == "/api/admin/fertilizers":
            self.handle_create_fertilizer(parsed)
            return
        if parsed.path == "/api/admin/company-stories":
            self.handle_create_company_story()
            return
        if parsed.path == "/api/admin/company-contents":
            self.handle_create_company_content()
            return
        if parsed.path == "/api/admin/company-milestones":
            self.handle_create_company_milestone()
            return
        if parsed.path == "/api/admin/company-timelines":
            self.handle_create_company_timeline()
            return
        if parsed.path == "/api/admin/homepage-statistics":
            self.handle_create_homepage_statistic()
            return
        if parsed.path == "/api/admin/leadership-members":
            self.handle_create_leadership_member()
            return
        self.send_json(404, {"error": "Not found"})

    def do_PUT(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/admin/fertilizers/"):
            self.handle_update_fertilizer(parsed)
            return
        if parsed.path.startswith("/api/admin/company-stories/"):
            self.handle_update_company_story(parsed)
            return
        if parsed.path.startswith("/api/admin/company-contents/"):
            self.handle_update_company_content(parsed)
            return
        if parsed.path.startswith("/api/admin/company-milestones/"):
            self.handle_update_company_milestone(parsed)
            return
        if parsed.path.startswith("/api/admin/company-timelines/"):
            self.handle_update_company_timeline(parsed)
            return
        if parsed.path.startswith("/api/admin/homepage-statistics/"):
            self.handle_update_homepage_statistic(parsed)
            return
        if parsed.path.startswith("/api/admin/leadership-members/"):
            self.handle_update_leadership_member(parsed)
            return
        self.send_json(404, {"error": "Not found"})

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/admin/fertilizers/"):
            self.handle_delete_fertilizer(parsed)
            return
        if parsed.path.startswith("/api/admin/company-stories/"):
            self.handle_delete_company_story(parsed)
            return
        if parsed.path.startswith("/api/admin/company-contents/"):
            self.handle_delete_company_content(parsed)
            return
        if parsed.path.startswith("/api/admin/company-milestones/"):
            self.handle_delete_company_milestone(parsed)
            return
        if parsed.path.startswith("/api/admin/company-timelines/"):
            self.handle_delete_company_timeline(parsed)
            return
        if parsed.path.startswith("/api/admin/homepage-statistics/"):
            self.handle_delete_homepage_statistic(parsed)
            return
        if parsed.path.startswith("/api/admin/leadership-members/"):
            self.handle_delete_leadership_member(parsed)
            return
        self.send_json(404, {"error": "Not found"})

    def fertilizer_kind_from_query(self, parsed) -> str | None:
        query = parse_qs(parsed.query)
        kind = query.get("kind", query.get("scope", ["local"]))[0].lower()
        return kind if kind in FERTILIZER_KINDS else None

    def fertilizer_kind_and_id_from_path(self, path: str, prefix: str) -> tuple[str | None, int | None]:
        parts = path.removeprefix(prefix).strip("/").split("/")
        if len(parts) != 2:
            return None, None
        kind = parts[0].lower()
        if kind not in FERTILIZER_KINDS:
            return None, None
        try:
            return kind, int(parts[1])
        except ValueError:
            return None, None

    def require_admin(self) -> bool:
        user = self.current_user()
        if not user or user.get("role") != "admin":
            self.send_json(403, {"error": "Admin access required"})
            return False
        return True

    def id_from_path(self, path: str, prefix: str) -> int | None:
        parts = path.removeprefix(prefix).strip("/").split("/")
        if len(parts) != 1 or not parts[0]:
            return None
        try:
            return int(parts[0])
        except ValueError:
            return None

    def milestone_admin_record(self, connection: sqlite3.Connection, milestone_id: int) -> dict | None:
        row = connection.execute("SELECT * FROM company_milestones WHERE id = ?", (milestone_id,)).fetchone()
        if not row:
            return None
        record = row_to_company_milestone(row)
        record["translations"] = {
            item["language"]: {"title": item["title"], "description": item["description"]}
            for item in connection.execute(
                """
                SELECT language, title, description
                FROM company_milestone_translations
                WHERE milestoneId = ?
                ORDER BY language
                """,
                (milestone_id,),
            ).fetchall()
        }
        return record

    def leadership_admin_record(self, connection: sqlite3.Connection, member_id: int) -> dict | None:
        row = connection.execute("SELECT * FROM leadership_members WHERE id = ?", (member_id,)).fetchone()
        if not row:
            return None
        record = row_to_leadership_member(row)
        record["translations"] = {
            item["language"]: {"designation": item["designation"], "biography": item["biography"]}
            for item in connection.execute(
                """
                SELECT language, designation, biography
                FROM leadership_member_translations
                WHERE leadershipMemberId = ?
                ORDER BY language
                """,
                (member_id,),
            ).fetchall()
        }
        return record

    def handle_company_content(self, parsed) -> None:
        language = requested_language(parse_qs(parsed.query))
        with database() as connection:
            contents = content_collection(connection, language)
            stories = story_collection(connection, language)
            timelines = timeline_collection(connection, language)
            milestones = milestone_collection(connection, language)
            statistics = statistic_collection(connection)
            leadership = leadership_collection(connection, language)
        self.send_json(
            200,
            {
                "language": language,
                "contents": contents,
                "contentByKey": {item["sectionKey"]: item for item in contents},
                "stories": stories,
                "storiesBySlug": {story["slug"]: story for story in stories},
                "timelines": timelines,
                "milestones": milestones,
                "statistics": statistics,
                "leadership": leadership,
            },
        )

    def handle_admin_company_content_list(self, parsed) -> None:
        if not self.require_admin():
            return
        query = parse_qs(parsed.query)
        search = query.get("search", [""])[0].strip()
        language = query.get("language", [""])[0].strip()
        status = query.get("status", [""])[0].strip()
        clauses: list[str] = []
        params: list[str] = []
        if search:
            clauses.append("(title LIKE ? OR sectionKey LIKE ? OR content LIKE ?)")
            params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
        if language:
            clauses.append("language = ?")
            params.append(language)
        if status:
            clauses.append("status = ?")
            params.append(status)
        where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        with database() as connection:
            rows = connection.execute(
                f"SELECT * FROM company_contents {where} ORDER BY displayOrder, sectionKey, language",
                params,
            ).fetchall()
            contents = [row_to_company_content(row) for row in rows]
        self.send_json(200, {"contents": contents})

    def handle_create_company_content(self) -> None:
        if not self.require_admin():
            return
        body = self.read_json()
        clean, errors = company_content_payload(body)
        if errors:
            self.send_json(400, {"error": "Please complete the content form.", "details": errors})
            return
        timestamp = now_iso()
        try:
            with database() as connection:
                cursor = connection.execute(
                    """
                    INSERT INTO company_contents (
                        sectionKey, title, subtitle, content, language, displayOrder, status, createdAt, updatedAt
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        clean["sectionKey"],
                        clean["title"],
                        clean["subtitle"],
                        clean["content"],
                        clean["language"],
                        clean["displayOrder"],
                        clean["status"],
                        timestamp,
                        timestamp,
                    ),
                )
                row = connection.execute("SELECT * FROM company_contents WHERE id = ?", (cursor.lastrowid,)).fetchone()
            self.send_json(201, {"content": row_to_company_content(row)})
        except sqlite3.IntegrityError:
            self.send_json(409, {"error": "A content section with this key and language already exists."})

    def handle_update_company_content(self, parsed) -> None:
        if not self.require_admin():
            return
        content_id = self.id_from_path(parsed.path, "/api/admin/company-contents/")
        if content_id is None:
            self.send_json(400, {"error": "Invalid content path."})
            return
        body = self.read_json()
        clean, errors = company_content_payload(body)
        if errors:
            self.send_json(400, {"error": "Please complete the content form.", "details": errors})
            return
        timestamp = now_iso()
        try:
            with database() as connection:
                existing = connection.execute("SELECT 1 FROM company_contents WHERE id = ?", (content_id,)).fetchone()
                if not existing:
                    self.send_json(404, {"error": "Content section not found."})
                    return
                connection.execute(
                    """
                    UPDATE company_contents
                    SET sectionKey = ?, title = ?, subtitle = ?, content = ?, language = ?,
                        displayOrder = ?, status = ?, updatedAt = ?
                    WHERE id = ?
                    """,
                    (
                        clean["sectionKey"],
                        clean["title"],
                        clean["subtitle"],
                        clean["content"],
                        clean["language"],
                        clean["displayOrder"],
                        clean["status"],
                        timestamp,
                        content_id,
                    ),
                )
                row = connection.execute("SELECT * FROM company_contents WHERE id = ?", (content_id,)).fetchone()
            self.send_json(200, {"content": row_to_company_content(row)})
        except sqlite3.IntegrityError:
            self.send_json(409, {"error": "A content section with this key and language already exists."})

    def handle_delete_company_content(self, parsed) -> None:
        if not self.require_admin():
            return
        content_id = self.id_from_path(parsed.path, "/api/admin/company-contents/")
        if content_id is None:
            self.send_json(400, {"error": "Invalid content path."})
            return
        with database() as connection:
            cursor = connection.execute("DELETE FROM company_contents WHERE id = ?", (content_id,))
            if cursor.rowcount == 0:
                self.send_json(404, {"error": "Content section not found."})
                return
        self.send_json(200, {"ok": True})

    def handle_admin_company_story_list(self, parsed) -> None:
        if not self.require_admin():
            return
        query = parse_qs(parsed.query)
        search = query.get("search", [""])[0].strip()
        language = query.get("language", [""])[0].strip()
        status = query.get("status", [""])[0].strip()
        clauses: list[str] = []
        params: list[str] = []
        if search:
            clauses.append("(title LIKE ? OR slug LIKE ? OR content LIKE ?)")
            params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
        if language:
            clauses.append("language = ?")
            params.append(language)
        if status:
            clauses.append("status = ?")
            params.append(status)
        where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        with database() as connection:
            rows = connection.execute(
                f"SELECT * FROM company_stories {where} ORDER BY displayOrder, slug, language",
                params,
            ).fetchall()
            stories = [row_to_company_story(row) for row in rows]
        self.send_json(200, {"stories": stories})

    def handle_create_company_story(self) -> None:
        if not self.require_admin():
            return
        body = self.read_json()
        clean, errors = company_story_payload(body)
        if errors:
            self.send_json(400, {"error": "Please complete the story form.", "details": errors})
            return
        timestamp = now_iso()
        try:
            with database() as connection:
                cursor = connection.execute(
                    """
                    INSERT INTO company_stories (
                        title, slug, language, content, featuredImage, displayOrder, status, createdAt, updatedAt
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        clean["title"],
                        clean["slug"],
                        clean["language"],
                        clean["content"],
                        clean["featuredImage"],
                        clean["displayOrder"],
                        clean["status"],
                        timestamp,
                        timestamp,
                    ),
                )
                row = connection.execute("SELECT * FROM company_stories WHERE id = ?", (cursor.lastrowid,)).fetchone()
            self.send_json(201, {"story": row_to_company_story(row)})
        except sqlite3.IntegrityError:
            self.send_json(409, {"error": "A story with this slug and language already exists."})

    def handle_update_company_story(self, parsed) -> None:
        if not self.require_admin():
            return
        story_id = self.id_from_path(parsed.path, "/api/admin/company-stories/")
        if story_id is None:
            self.send_json(400, {"error": "Invalid story path."})
            return
        body = self.read_json()
        clean, errors = company_story_payload(body)
        if errors:
            self.send_json(400, {"error": "Please complete the story form.", "details": errors})
            return
        timestamp = now_iso()
        try:
            with database() as connection:
                existing = connection.execute("SELECT 1 FROM company_stories WHERE id = ?", (story_id,)).fetchone()
                if not existing:
                    self.send_json(404, {"error": "Story not found."})
                    return
                connection.execute(
                    """
                    UPDATE company_stories
                    SET title = ?, slug = ?, language = ?, content = ?, featuredImage = ?,
                        displayOrder = ?, status = ?, updatedAt = ?
                    WHERE id = ?
                    """,
                    (
                        clean["title"],
                        clean["slug"],
                        clean["language"],
                        clean["content"],
                        clean["featuredImage"],
                        clean["displayOrder"],
                        clean["status"],
                        timestamp,
                        story_id,
                    ),
                )
                row = connection.execute("SELECT * FROM company_stories WHERE id = ?", (story_id,)).fetchone()
            self.send_json(200, {"story": row_to_company_story(row)})
        except sqlite3.IntegrityError:
            self.send_json(409, {"error": "A story with this slug and language already exists."})

    def handle_delete_company_story(self, parsed) -> None:
        if not self.require_admin():
            return
        story_id = self.id_from_path(parsed.path, "/api/admin/company-stories/")
        if story_id is None:
            self.send_json(400, {"error": "Invalid story path."})
            return
        with database() as connection:
            cursor = connection.execute("DELETE FROM company_stories WHERE id = ?", (story_id,))
            if cursor.rowcount == 0:
                self.send_json(404, {"error": "Story not found."})
                return
        self.send_json(200, {"ok": True})

    def handle_admin_company_milestone_list(self) -> None:
        if not self.require_admin():
            return
        with database() as connection:
            milestones = milestone_collection(connection, "en", only_public=False)
        self.send_json(200, {"milestones": milestones})

    def handle_create_company_milestone(self) -> None:
        if not self.require_admin():
            return
        body = self.read_json()
        clean, errors = company_milestone_payload(body)
        if errors:
            self.send_json(400, {"error": "Please complete the milestone form.", "details": errors})
            return
        timestamp = now_iso()
        with database() as connection:
            cursor = connection.execute(
                """
                INSERT INTO company_milestones (year, title, description, image, displayOrder, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    clean["year"],
                    clean["title"],
                    clean["description"],
                    clean["image"],
                    clean["displayOrder"],
                    timestamp,
                    timestamp,
                ),
            )
            milestone_id = int(cursor.lastrowid)
            upsert_milestone_translations(connection, milestone_id, body.get("translations", {}), timestamp)
            record = self.milestone_admin_record(connection, milestone_id)
        self.send_json(201, {"milestone": record})

    def handle_update_company_milestone(self, parsed) -> None:
        if not self.require_admin():
            return
        milestone_id = self.id_from_path(parsed.path, "/api/admin/company-milestones/")
        if milestone_id is None:
            self.send_json(400, {"error": "Invalid milestone path."})
            return
        body = self.read_json()
        clean, errors = company_milestone_payload(body)
        if errors:
            self.send_json(400, {"error": "Please complete the milestone form.", "details": errors})
            return
        timestamp = now_iso()
        with database() as connection:
            existing = connection.execute("SELECT 1 FROM company_milestones WHERE id = ?", (milestone_id,)).fetchone()
            if not existing:
                self.send_json(404, {"error": "Milestone not found."})
                return
            connection.execute(
                """
                UPDATE company_milestones
                SET year = ?, title = ?, description = ?, image = ?, displayOrder = ?, updatedAt = ?
                WHERE id = ?
                """,
                (
                    clean["year"],
                    clean["title"],
                    clean["description"],
                    clean["image"],
                    clean["displayOrder"],
                    timestamp,
                    milestone_id,
                ),
            )
            upsert_milestone_translations(connection, milestone_id, body.get("translations", {}), timestamp)
            record = self.milestone_admin_record(connection, milestone_id)
        self.send_json(200, {"milestone": record})

    def handle_delete_company_milestone(self, parsed) -> None:
        if not self.require_admin():
            return
        milestone_id = self.id_from_path(parsed.path, "/api/admin/company-milestones/")
        if milestone_id is None:
            self.send_json(400, {"error": "Invalid milestone path."})
            return
        with database() as connection:
            connection.execute("DELETE FROM company_milestone_translations WHERE milestoneId = ?", (milestone_id,))
            cursor = connection.execute("DELETE FROM company_milestones WHERE id = ?", (milestone_id,))
            if cursor.rowcount == 0:
                self.send_json(404, {"error": "Milestone not found."})
                return
        self.send_json(200, {"ok": True})

    def handle_admin_company_timeline_list(self, parsed) -> None:
        if not self.require_admin():
            return
        query = parse_qs(parsed.query)
        search = query.get("search", [""])[0].strip()
        language = query.get("language", [""])[0].strip()
        status = query.get("status", [""])[0].strip()
        clauses: list[str] = []
        params: list[str] = []
        if search:
            clauses.append("(year LIKE ? OR title LIKE ? OR description LIKE ? OR impactMetric LIKE ?)")
            params.extend([f"%{search}%", f"%{search}%", f"%{search}%", f"%{search}%"])
        if language:
            clauses.append("language = ?")
            params.append(language)
        if status:
            clauses.append("status = ?")
            params.append(status)
        where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        with database() as connection:
            rows = connection.execute(
                f"SELECT * FROM company_timelines {where} ORDER BY displayOrder, year, title",
                params,
            ).fetchall()
            timelines = [row_to_company_timeline(row) for row in rows]
        self.send_json(200, {"timelines": timelines})

    def handle_create_company_timeline(self) -> None:
        if not self.require_admin():
            return
        body = self.read_json()
        clean, errors = company_timeline_payload(body)
        if errors:
            self.send_json(400, {"error": "Please complete the timeline form.", "details": errors})
            return
        timestamp = now_iso()
        try:
            with database() as connection:
                cursor = connection.execute(
                    """
                    INSERT INTO company_timelines (
                        year, title, description, impactMetric, language, displayOrder, status, createdAt, updatedAt
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        clean["year"],
                        clean["title"],
                        clean["description"],
                        clean["impactMetric"],
                        clean["language"],
                        clean["displayOrder"],
                        clean["status"],
                        timestamp,
                        timestamp,
                    ),
                )
                row = connection.execute("SELECT * FROM company_timelines WHERE id = ?", (cursor.lastrowid,)).fetchone()
            self.send_json(201, {"timeline": row_to_company_timeline(row)})
        except sqlite3.IntegrityError:
            self.send_json(409, {"error": "A timeline record with this year, title and language already exists."})

    def handle_update_company_timeline(self, parsed) -> None:
        if not self.require_admin():
            return
        timeline_id = self.id_from_path(parsed.path, "/api/admin/company-timelines/")
        if timeline_id is None:
            self.send_json(400, {"error": "Invalid timeline path."})
            return
        body = self.read_json()
        clean, errors = company_timeline_payload(body)
        if errors:
            self.send_json(400, {"error": "Please complete the timeline form.", "details": errors})
            return
        timestamp = now_iso()
        try:
            with database() as connection:
                existing = connection.execute("SELECT 1 FROM company_timelines WHERE id = ?", (timeline_id,)).fetchone()
                if not existing:
                    self.send_json(404, {"error": "Timeline record not found."})
                    return
                connection.execute(
                    """
                    UPDATE company_timelines
                    SET year = ?, title = ?, description = ?, impactMetric = ?, language = ?,
                        displayOrder = ?, status = ?, updatedAt = ?
                    WHERE id = ?
                    """,
                    (
                        clean["year"],
                        clean["title"],
                        clean["description"],
                        clean["impactMetric"],
                        clean["language"],
                        clean["displayOrder"],
                        clean["status"],
                        timestamp,
                        timeline_id,
                    ),
                )
                row = connection.execute("SELECT * FROM company_timelines WHERE id = ?", (timeline_id,)).fetchone()
            self.send_json(200, {"timeline": row_to_company_timeline(row)})
        except sqlite3.IntegrityError:
            self.send_json(409, {"error": "A timeline record with this year, title and language already exists."})

    def handle_delete_company_timeline(self, parsed) -> None:
        if not self.require_admin():
            return
        timeline_id = self.id_from_path(parsed.path, "/api/admin/company-timelines/")
        if timeline_id is None:
            self.send_json(400, {"error": "Invalid timeline path."})
            return
        with database() as connection:
            cursor = connection.execute("DELETE FROM company_timelines WHERE id = ?", (timeline_id,))
            if cursor.rowcount == 0:
                self.send_json(404, {"error": "Timeline record not found."})
                return
        self.send_json(200, {"ok": True})

    def handle_admin_homepage_statistic_list(self) -> None:
        if not self.require_admin():
            return
        with database() as connection:
            statistics = statistic_collection(connection, only_active=False)
        self.send_json(200, {"statistics": statistics})

    def handle_create_homepage_statistic(self) -> None:
        if not self.require_admin():
            return
        body = self.read_json()
        clean, errors = homepage_statistic_payload(body)
        if errors:
            self.send_json(400, {"error": "Please complete the statistic form.", "details": errors})
            return
        timestamp = now_iso()
        try:
            with database() as connection:
                cursor = connection.execute(
                    """
                    INSERT INTO homepage_statistics (
                        label, value, description, displayOrder, active, createdAt, updatedAt
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        clean["label"],
                        clean["value"],
                        clean["description"],
                        clean["displayOrder"],
                        clean["active"],
                        timestamp,
                        timestamp,
                    ),
                )
                row = connection.execute("SELECT * FROM homepage_statistics WHERE id = ?", (cursor.lastrowid,)).fetchone()
            self.send_json(201, {"statistic": row_to_homepage_statistic(row)})
        except sqlite3.IntegrityError:
            self.send_json(409, {"error": "A statistic with this label already exists."})

    def handle_update_homepage_statistic(self, parsed) -> None:
        if not self.require_admin():
            return
        statistic_id = self.id_from_path(parsed.path, "/api/admin/homepage-statistics/")
        if statistic_id is None:
            self.send_json(400, {"error": "Invalid statistic path."})
            return
        body = self.read_json()
        clean, errors = homepage_statistic_payload(body)
        if errors:
            self.send_json(400, {"error": "Please complete the statistic form.", "details": errors})
            return
        timestamp = now_iso()
        try:
            with database() as connection:
                existing = connection.execute("SELECT 1 FROM homepage_statistics WHERE id = ?", (statistic_id,)).fetchone()
                if not existing:
                    self.send_json(404, {"error": "Statistic not found."})
                    return
                connection.execute(
                    """
                    UPDATE homepage_statistics
                    SET label = ?, value = ?, description = ?, displayOrder = ?, active = ?, updatedAt = ?
                    WHERE id = ?
                    """,
                    (
                        clean["label"],
                        clean["value"],
                        clean["description"],
                        clean["displayOrder"],
                        clean["active"],
                        timestamp,
                        statistic_id,
                    ),
                )
                row = connection.execute("SELECT * FROM homepage_statistics WHERE id = ?", (statistic_id,)).fetchone()
            self.send_json(200, {"statistic": row_to_homepage_statistic(row)})
        except sqlite3.IntegrityError:
            self.send_json(409, {"error": "A statistic with this label already exists."})

    def handle_delete_homepage_statistic(self, parsed) -> None:
        if not self.require_admin():
            return
        statistic_id = self.id_from_path(parsed.path, "/api/admin/homepage-statistics/")
        if statistic_id is None:
            self.send_json(400, {"error": "Invalid statistic path."})
            return
        with database() as connection:
            cursor = connection.execute("DELETE FROM homepage_statistics WHERE id = ?", (statistic_id,))
            if cursor.rowcount == 0:
                self.send_json(404, {"error": "Statistic not found."})
                return
        self.send_json(200, {"ok": True})

    def handle_admin_leadership_list(self) -> None:
        if not self.require_admin():
            return
        with database() as connection:
            leadership = leadership_collection(connection, "en", only_active=False)
        self.send_json(200, {"leadership": leadership})

    def handle_create_leadership_member(self) -> None:
        if not self.require_admin():
            return
        body = self.read_json()
        clean, errors = leadership_payload(body)
        if errors:
            self.send_json(400, {"error": "Please complete the leadership form.", "details": errors})
            return
        timestamp = now_iso()
        with database() as connection:
            cursor = connection.execute(
                """
                INSERT INTO leadership_members (
                    fullName, designation, roleDescription, biography, image, imageUrl, displayOrder, active, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    clean["fullName"],
                    clean["designation"],
                    clean["roleDescription"],
                    clean["biography"],
                    clean["image"],
                    clean["imageUrl"],
                    clean["displayOrder"],
                    clean["active"],
                    timestamp,
                    timestamp,
                ),
            )
            member_id = int(cursor.lastrowid)
            upsert_leadership_translations(connection, member_id, body.get("translations", {}), timestamp)
            record = self.leadership_admin_record(connection, member_id)
        self.send_json(201, {"member": record})

    def handle_update_leadership_member(self, parsed) -> None:
        if not self.require_admin():
            return
        member_id = self.id_from_path(parsed.path, "/api/admin/leadership-members/")
        if member_id is None:
            self.send_json(400, {"error": "Invalid leadership member path."})
            return
        body = self.read_json()
        clean, errors = leadership_payload(body)
        if errors:
            self.send_json(400, {"error": "Please complete the leadership form.", "details": errors})
            return
        timestamp = now_iso()
        with database() as connection:
            existing = connection.execute("SELECT 1 FROM leadership_members WHERE id = ?", (member_id,)).fetchone()
            if not existing:
                self.send_json(404, {"error": "Leadership member not found."})
                return
            connection.execute(
                """
                UPDATE leadership_members
                SET fullName = ?, designation = ?, roleDescription = ?, biography = ?, image = ?, imageUrl = ?,
                    displayOrder = ?, active = ?, updatedAt = ?
                WHERE id = ?
                """,
                (
                    clean["fullName"],
                    clean["designation"],
                    clean["roleDescription"],
                    clean["biography"],
                    clean["image"],
                    clean["imageUrl"],
                    clean["displayOrder"],
                    clean["active"],
                    timestamp,
                    member_id,
                ),
            )
            upsert_leadership_translations(connection, member_id, body.get("translations", {}), timestamp)
            record = self.leadership_admin_record(connection, member_id)
        self.send_json(200, {"member": record})

    def handle_delete_leadership_member(self, parsed) -> None:
        if not self.require_admin():
            return
        member_id = self.id_from_path(parsed.path, "/api/admin/leadership-members/")
        if member_id is None:
            self.send_json(400, {"error": "Invalid leadership member path."})
            return
        with database() as connection:
            connection.execute("DELETE FROM leadership_member_translations WHERE leadershipMemberId = ?", (member_id,))
            cursor = connection.execute("DELETE FROM leadership_members WHERE id = ?", (member_id,))
            if cursor.rowcount == 0:
                self.send_json(404, {"error": "Leadership member not found."})
                return
        self.send_json(200, {"ok": True})

    def handle_fertilizer_list(self, parsed) -> None:
        query = parse_qs(parsed.query)
        kind = self.fertilizer_kind_from_query(parsed)
        if not kind:
            self.send_json(400, {"error": "Invalid fertilizer kind."})
            return
        language = requested_language(query)
        search = query.get("search", [""])[0].strip()
        category = query.get("category", [""])[0].strip()
        table, _ = fertilizer_tables(kind)
        clauses = ["status = 'active'"]
        params: list[str] = []
        if search:
            clauses.append("(name LIKE ? OR category LIKE ? OR manufacturer LIKE ?)")
            params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
        if category:
            clauses.append("category = ?")
            params.append(category)
        where = " AND ".join(clauses)
        with database() as connection:
            rows = connection.execute(
                f"SELECT * FROM {table} WHERE {where} ORDER BY category, name",
                params,
            ).fetchall()
            fertilizers = [localized_fertilizer(connection, row, kind, language) for row in rows]
            categories = [
                row["category"]
                for row in connection.execute(
                    f"SELECT DISTINCT category FROM {table} WHERE status = 'active' ORDER BY category"
                ).fetchall()
            ]
        self.send_json(200, {"kind": kind, "language": language, "categories": categories, "fertilizers": fertilizers})

    def handle_fertilizer_detail(self, parsed) -> None:
        kind, fertilizer_id = self.fertilizer_kind_and_id_from_path(parsed.path, "/api/fertilizers/")
        if not kind or fertilizer_id is None:
            self.send_json(400, {"error": "Invalid fertilizer detail path."})
            return
        language = requested_language(parse_qs(parsed.query))
        table, _ = fertilizer_tables(kind)
        with database() as connection:
            row = connection.execute(
                f"SELECT * FROM {table} WHERE id = ? AND status = 'active'",
                (fertilizer_id,),
            ).fetchone()
            if not row:
                self.send_json(404, {"error": "Fertilizer not found."})
                return
            fertilizer = localized_fertilizer(connection, row, kind, language)
        self.send_json(200, {"fertilizer": fertilizer})

    def handle_admin_fertilizer_list(self, parsed) -> None:
        user = self.current_user()
        if not user or user.get("role") != "admin":
            self.send_json(403, {"error": "Admin access required"})
            return
        query = parse_qs(parsed.query)
        kind = self.fertilizer_kind_from_query(parsed)
        if not kind:
            self.send_json(400, {"error": "Invalid fertilizer kind."})
            return
        search = query.get("search", [""])[0].strip()
        category = query.get("category", [""])[0].strip()
        status = query.get("status", [""])[0].strip()
        table, _ = fertilizer_tables(kind)
        clauses: list[str] = []
        params: list[str] = []
        if search:
            clauses.append("(name LIKE ? OR category LIKE ? OR manufacturer LIKE ?)")
            params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
        if category:
            clauses.append("category = ?")
            params.append(category)
        if status:
            clauses.append("status = ?")
            params.append(status)
        where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        with database() as connection:
            rows = connection.execute(f"SELECT * FROM {table} {where} ORDER BY updatedAt DESC", params).fetchall()
            fertilizers = [row_to_fertilizer(row, kind) for row in rows]
        self.send_json(200, {"kind": kind, "fertilizers": fertilizers})

    def handle_create_fertilizer(self, parsed) -> None:
        user = self.current_user()
        if not user or user.get("role") != "admin":
            self.send_json(403, {"error": "Admin access required"})
            return
        kind = self.fertilizer_kind_from_query(parsed)
        if not kind:
            self.send_json(400, {"error": "Invalid fertilizer kind."})
            return
        table, translation_table = fertilizer_tables(kind)
        body = self.read_json()
        clean, errors = fertilizer_payload(body, kind)
        if errors:
            self.send_json(400, {"error": "Please complete the fertilizer form.", "details": errors})
            return
        timestamp = now_iso()
        with database() as connection:
            fertilizer_id = insert_fertilizer_row(connection, table, clean, timestamp)
            upsert_fertilizer_translations(connection, translation_table, fertilizer_id, body.get("translations", {}), timestamp)
            row = connection.execute(f"SELECT * FROM {table} WHERE id = ?", (fertilizer_id,)).fetchone()
        self.send_json(201, {"fertilizer": row_to_fertilizer(row, kind)})

    def handle_update_fertilizer(self, parsed) -> None:
        user = self.current_user()
        if not user or user.get("role") != "admin":
            self.send_json(403, {"error": "Admin access required"})
            return
        kind, fertilizer_id = self.fertilizer_kind_and_id_from_path(parsed.path, "/api/admin/fertilizers/")
        if not kind or fertilizer_id is None:
            self.send_json(400, {"error": "Invalid fertilizer detail path."})
            return
        table, translation_table = fertilizer_tables(kind)
        body = self.read_json()
        clean, errors = fertilizer_payload(body, kind)
        if errors:
            self.send_json(400, {"error": "Please complete the fertilizer form.", "details": errors})
            return
        timestamp = now_iso()
        extra_fields = ["approvalBody", "regionalRecommendations"] if kind == "local" else ["brand", "importCertifications", "internationalSpecifications"]
        columns = FERTILIZER_FIELDS + extra_fields + ["updatedAt"]
        values = [clean.get(column, "") for column in FERTILIZER_FIELDS]
        values.extend(clean.get(column, "") for column in extra_fields)
        values.append(timestamp)
        values.append(fertilizer_id)
        assignments = ", ".join(f"{column} = ?" for column in columns)
        with database() as connection:
            existing = connection.execute(f"SELECT 1 FROM {table} WHERE id = ?", (fertilizer_id,)).fetchone()
            if not existing:
                self.send_json(404, {"error": "Fertilizer not found."})
                return
            connection.execute(f"UPDATE {table} SET {assignments} WHERE id = ?", values)
            upsert_fertilizer_translations(connection, translation_table, fertilizer_id, body.get("translations", {}), timestamp)
            row = connection.execute(f"SELECT * FROM {table} WHERE id = ?", (fertilizer_id,)).fetchone()
        self.send_json(200, {"fertilizer": row_to_fertilizer(row, kind)})

    def handle_delete_fertilizer(self, parsed) -> None:
        user = self.current_user()
        if not user or user.get("role") != "admin":
            self.send_json(403, {"error": "Admin access required"})
            return
        kind, fertilizer_id = self.fertilizer_kind_and_id_from_path(parsed.path, "/api/admin/fertilizers/")
        if not kind or fertilizer_id is None:
            self.send_json(400, {"error": "Invalid fertilizer detail path."})
            return
        table, translation_table = fertilizer_tables(kind)
        with database() as connection:
            connection.execute(f"DELETE FROM {translation_table} WHERE fertilizerId = ?", (fertilizer_id,))
            cursor = connection.execute(f"DELETE FROM {table} WHERE id = ?", (fertilizer_id,))
            if cursor.rowcount == 0:
                self.send_json(404, {"error": "Fertilizer not found."})
                return
        self.send_json(200, {"ok": True})

    def handle_login(self) -> None:
        ip_address = self.client_ip()
        if rate_limited(f"login:{ip_address}", 12, 60):
            self.send_json(429, {"error": "Too many login attempts. Please try again shortly."})
            return

        body = self.read_json()
        email = str(body.get("email", "")).strip().lower()
        password = str(body.get("password", ""))
        if hmac.compare_digest(email, ADMIN_EMAIL.lower()) and hmac.compare_digest(password, ADMIN_PASSWORD):
            token = encode_token("admin", ADMIN_EMAIL, name="GreenWings Admin")
            self.send_json(200, {"token": token, "user": {"email": ADMIN_EMAIL, "role": "admin", "name": "GreenWings Admin"}})
            return

        with database() as connection:
            row = connection.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()

        if not row or not verify_password(password, row["passwordHash"]):
            self.send_json(401, {"error": "Invalid email or password."})
            return

        user = row_to_user(row)
        token = encode_token("member", user["email"], user["id"], user["name"])
        self.send_json(200, {"token": token, "user": user})

    def handle_registration(self) -> None:
        ip_address = self.client_ip()
        if rate_limited(f"register:{ip_address}", 6, 300):
            self.send_json(429, {"error": "Too many registration attempts. Please try again later."})
            return

        body = self.read_json()
        errors = validate_registration(body)
        if errors:
            self.send_json(400, {"error": "Please correct the registration form.", "details": errors})
            return

        created_at = now_iso()
        email = str(body.get("email", "")).strip().lower()
        clean = {
            "firstName": str(body.get("firstName", "")).strip(),
            "lastName": str(body.get("lastName", "")).strip(),
            "mobileNumber": str(body.get("mobileNumber", "")).strip(),
            "email": email,
            "passwordHash": hash_password(str(body.get("password", ""))),
            "interest": str(body.get("interest", "")).strip(),
            "enquiryQuestion": str(body.get("enquiryQuestion", "")).strip(),
            "address": str(body.get("address", "")).strip(),
            "state": str(body.get("state", "")).strip(),
            "country": str(body.get("country", "")).strip(),
        }

        try:
            with database() as connection:
                if connection.execute("SELECT 1 FROM users WHERE email = ?", (email,)).fetchone():
                    self.send_json(409, {"error": "This email is already registered. Please login instead."})
                    return
                cursor = connection.execute(
                    """
                    INSERT INTO users (
                        firstName, lastName, mobileNumber, email, passwordHash, interest,
                        enquiryQuestion, address, state, country, role, emailVerified, createdAt, updatedAt
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'USER', 0, ?, ?)
                    """,
                    (
                        clean["firstName"],
                        clean["lastName"],
                        clean["mobileNumber"],
                        clean["email"],
                        clean["passwordHash"],
                        clean["interest"],
                        clean["enquiryQuestion"],
                        clean["address"],
                        clean["state"],
                        clean["country"],
                        created_at,
                        created_at,
                    ),
                )
                user_id = int(cursor.lastrowid)
                enquiry_id = generate_enquiry_id(connection)
                connection.execute(
                    """
                    INSERT INTO enquiries (
                        enquiryId, userId, subject, category, description, priority, status, createdAt, updatedAt
                    ) VALUES (?, ?, ?, ?, ?, 'NORMAL', 'NEW', ?, ?)
                    """,
                    (
                        enquiry_id,
                        user_id,
                        f"{clean['interest']} enquiry",
                        clean["interest"],
                        clean["enquiryQuestion"],
                        created_at,
                        created_at,
                    ),
                )
                user_row = connection.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
                enquiry_row = connection.execute("SELECT * FROM enquiries WHERE enquiryId = ?", (enquiry_id,)).fetchone()

            user = row_to_user(user_row)
            enquiry = row_to_enquiry(enquiry_row)
            send_admin_registration_email(user, enquiry)
            token = encode_token("member", user["email"], user["id"], user["name"])
            self.send_json(201, {"token": token, "user": user, "enquiry": enquiry})
        except sqlite3.IntegrityError:
            self.send_json(409, {"error": "This email is already registered. Please login instead."})

    def handle_enquiry_list(self) -> None:
        user = self.current_user()
        if not user:
            self.send_json(401, {"error": "Login required."})
            return

        with database() as connection:
            if user.get("role") == "admin":
                rows = connection.execute(
                    """
                    SELECT e.*, u.firstName, u.lastName, u.email AS userEmail
                    FROM enquiries e
                    LEFT JOIN users u ON u.id = e.userId
                    ORDER BY e.updatedAt DESC
                    LIMIT 100
                    """
                ).fetchall()
                enquiries = []
                for row in rows:
                    item = row_to_enquiry(row)
                    item["userName"] = f"{row['firstName'] or ''} {row['lastName'] or ''}".strip()
                    item["userEmail"] = row["userEmail"]
                    enquiries.append(item)
            else:
                user_id = user.get("userId")
                if not user_id:
                    self.send_json(401, {"error": "Login required."})
                    return
                rows = connection.execute(
                    "SELECT * FROM enquiries WHERE userId = ? ORDER BY updatedAt DESC",
                    (user_id,),
                ).fetchall()
                enquiries = [row_to_enquiry(row) for row in rows]
        self.send_json(200, {"enquiries": enquiries})

    def handle_create_enquiry(self) -> None:
        user = self.current_user()
        if not user or user.get("role") != "member" or not user.get("userId"):
            self.send_json(401, {"error": "Member login required."})
            return

        body = self.read_json()
        subject = str(body.get("subject", "")).strip()
        category = str(body.get("category", "")).strip()
        description = str(body.get("description", "")).strip()
        priority = str(body.get("priority", "NORMAL")).strip().upper()
        if priority not in {"LOW", "NORMAL", "HIGH", "URGENT"}:
            priority = "NORMAL"
        if not subject or not category or not description:
            self.send_json(400, {"error": "Subject, category and description are required."})
            return

        created_at = now_iso()
        with database() as connection:
            enquiry_id = generate_enquiry_id(connection)
            connection.execute(
                """
                INSERT INTO enquiries (
                    enquiryId, userId, subject, category, description, priority, status, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, 'NEW', ?, ?)
                """,
                (enquiry_id, user["userId"], subject, category, description, priority, created_at, created_at),
            )
            row = connection.execute("SELECT * FROM enquiries WHERE enquiryId = ?", (enquiry_id,)).fetchone()
        self.send_json(201, {"enquiry": row_to_enquiry(row)})

    def handle_visit_tracking(self) -> None:
        ip_address = self.client_ip()
        if rate_limited(f"visit:{ip_address}", 180, 60):
            self.send_json(204, {"ok": True})
            return

        body = self.read_json()
        page_path = str(body.get("pagePath", "/")).strip()[:240] or "/"
        referrer = str(body.get("referrer", "")).strip()[:500]
        visitor_id = str(body.get("visitorId", "")).strip()[:120] or secrets.token_urlsafe(18)
        session_id = str(body.get("sessionId", "")).strip()[:120] or secrets.token_urlsafe(18)
        user_agent = str(self.headers.get("User-Agent", ""))[:500]
        created_at = now_iso()
        with database() as connection:
            connection.execute(
                """
                INSERT INTO website_visits (
                    visitorId, sessionId, pagePath, referrer, userAgent, ipAddressHash,
                    country, deviceType, browser, visitedAt, createdAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    visitor_id,
                    session_id,
                    page_path,
                    referrer,
                    user_agent,
                    hash_ip_address(ip_address),
                    str(body.get("country", "")).strip()[:80],
                    detect_device_type(user_agent),
                    detect_browser(user_agent),
                    created_at,
                    created_at,
                ),
            )
        self.send_json(201, {"ok": True})

    def handle_admin_summary(self) -> None:
        user = self.current_user()
        if not user or user.get("role") != "admin":
            self.send_json(403, {"error": "Admin access required"})
            return

        today = datetime.now(timezone.utc).date().isoformat()
        with database() as connection:
            produce = connection.execute("SELECT COUNT(*) FROM produce").fetchone()[0]
            subtypes = connection.execute("SELECT COUNT(*) FROM subtypes").fetchone()[0]
            local_fertilizers = connection.execute("SELECT COUNT(*) FROM local_fertilizers").fetchone()[0]
            imported_fertilizers = connection.execute("SELECT COUNT(*) FROM imported_fertilizers").fetchone()[0]
            company_stories = connection.execute("SELECT COUNT(*) FROM company_stories").fetchone()[0]
            company_contents = connection.execute("SELECT COUNT(*) FROM company_contents").fetchone()[0]
            company_milestones = connection.execute("SELECT COUNT(*) FROM company_milestones").fetchone()[0]
            company_timelines = connection.execute("SELECT COUNT(*) FROM company_timelines").fetchone()[0]
            leadership_members = connection.execute("SELECT COUNT(*) FROM leadership_members").fetchone()[0]
            homepage_statistics = connection.execute("SELECT COUNT(*) FROM homepage_statistics").fetchone()[0]
            total_users = connection.execute("SELECT COUNT(*) FROM users WHERE role = 'USER'").fetchone()[0]
            new_users_today = connection.execute(
                "SELECT COUNT(*) FROM users WHERE role = 'USER' AND createdAt LIKE ?",
                (f"{today}%",),
            ).fetchone()[0]
            total_enquiries = connection.execute("SELECT COUNT(*) FROM enquiries").fetchone()[0]
            new_enquiries = connection.execute("SELECT COUNT(*) FROM enquiries WHERE status = 'NEW'").fetchone()[0]
            total_visits = connection.execute("SELECT COUNT(*) FROM website_visits").fetchone()[0]
            unique_visitors = connection.execute("SELECT COUNT(DISTINCT visitorId) FROM website_visits").fetchone()[0]
            today_visits = connection.execute(
                "SELECT COUNT(*) FROM website_visits WHERE visitedAt LIKE ?",
                (f"{today}%",),
            ).fetchone()[0]
            recent_users = [
                row_to_user(row)
                for row in connection.execute(
                    "SELECT * FROM users WHERE role = 'USER' ORDER BY createdAt DESC LIMIT 6"
                ).fetchall()
            ]
            recent_enquiry_rows = connection.execute(
                """
                SELECT e.*, u.firstName, u.lastName, u.email AS userEmail
                FROM enquiries e
                LEFT JOIN users u ON u.id = e.userId
                ORDER BY e.createdAt DESC
                LIMIT 6
                """
            ).fetchall()
            recent_enquiries = []
            for row in recent_enquiry_rows:
                item = row_to_enquiry(row)
                item["userName"] = f"{row['firstName'] or ''} {row['lastName'] or ''}".strip()
                item["userEmail"] = row["userEmail"]
                recent_enquiries.append(item)
            most_visited_pages = [
                {"pagePath": row["pagePath"], "visits": row["visits"]}
                for row in connection.execute(
                    """
                    SELECT pagePath, COUNT(*) AS visits
                    FROM website_visits
                    GROUP BY pagePath
                    ORDER BY visits DESC
                    LIMIT 5
                    """
                ).fetchall()
            ]

        self.send_json(
            200,
            {
                "role": "admin",
                "produce": produce,
                "subtypes": subtypes,
                "localFertilizers": local_fertilizers,
                "importedFertilizers": imported_fertilizers,
                "companyStories": company_stories,
                "companyContents": company_contents,
                "companyMilestones": company_milestones,
                "companyTimelines": company_timelines,
                "leadershipMembers": leadership_members,
                "homepageStatistics": homepage_statistics,
                "totalUsers": total_users,
                "newUsersToday": new_users_today,
                "totalEnquiries": total_enquiries,
                "newEnquiries": new_enquiries,
                "totalVisits": total_visits,
                "uniqueVisitors": unique_visitors,
                "todayVisits": today_visits,
                "recentUsers": recent_users,
                "recentEnquiries": recent_enquiries,
                "mostVisitedPages": most_visited_pages,
            },
        )

    def log_message(self, format: str, *args: object) -> None:
        print(f"[api] {self.address_string()} - {format % args}")


if __name__ == "__main__":
    ensure_database()
    print(f"GreenWings API running at http://127.0.0.1:{PORT}")
    ThreadingHTTPServer(("127.0.0.1", PORT), ApiHandler).serve_forever()
