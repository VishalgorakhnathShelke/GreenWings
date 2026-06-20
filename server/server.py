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

            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_enquiries_user ON enquiries(userId);
            CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
            CREATE INDEX IF NOT EXISTS idx_website_visits_visitor ON website_visits(visitorId);
            CREATE INDEX IF NOT EXISTS idx_website_visits_page ON website_visits(pagePath);
            CREATE INDEX IF NOT EXISTS idx_website_visits_date ON website_visits(visitedAt);
            """
        )


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
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
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
        if parsed.path == "/api/enquiries":
            self.handle_enquiry_list()
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
        self.send_json(404, {"error": "Not found"})

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
