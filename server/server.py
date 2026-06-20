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
            """
        )
    seed_fertilizers()


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
        self.send_json(404, {"error": "Not found"})

    def do_PUT(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/admin/fertilizers/"):
            self.handle_update_fertilizer(parsed)
            return
        self.send_json(404, {"error": "Not found"})

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/admin/fertilizers/"):
            self.handle_delete_fertilizer(parsed)
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
