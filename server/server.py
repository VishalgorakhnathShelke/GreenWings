from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import sqlite3
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
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


def encode_token(role: str, email: str) -> str:
    payload = json.dumps({"role": role, "email": email, "exp": int(time.time()) + 8 * 60 * 60}).encode()
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
        return json.loads(self.rfile.read(length) or b"{}")

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
            user = self.current_user()
            if not user or user.get("role") != "admin":
                self.send_json(403, {"error": "Admin access required"})
                return
            with database() as connection:
                produce = connection.execute("SELECT COUNT(*) FROM produce").fetchone()[0]
                subtypes = connection.execute("SELECT COUNT(*) FROM subtypes").fetchone()[0]
            self.send_json(200, {"produce": produce, "subtypes": subtypes, "role": "admin"})
            return
        if parsed.path == "/api/products":
            query = parse_qs(parsed.query)
            product_type = query.get("type", [None])[0]
            with database() as connection:
                if product_type:
                    rows = connection.execute("SELECT * FROM produce WHERE type = ? ORDER BY name", (product_type,)).fetchall()
                else:
                    rows = connection.execute("SELECT * FROM produce ORDER BY type, name").fetchall()
                products = []
                for row in rows:
                    product = dict(row)
                    product["subtypes"] = [
                        dict(item) for item in connection.execute(
                            "SELECT * FROM subtypes WHERE produce_id = ? ORDER BY subtype_name", (row["produce_id"],)
                        ).fetchall()
                    ]
                    products.append(product)
            self.send_json(200, {"products": products})
            return
        self.send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:
        if self.path == "/api/auth/login":
            body = self.read_json()
            email = str(body.get("email", "")).strip().lower()
            password = str(body.get("password", ""))
            if hmac.compare_digest(email, ADMIN_EMAIL.lower()) and hmac.compare_digest(password, ADMIN_PASSWORD):
                self.send_json(200, {"token": encode_token("admin", ADMIN_EMAIL), "user": {"email": ADMIN_EMAIL, "role": "admin"}})
            else:
                self.send_json(401, {"error": "Invalid admin credentials"})
            return
        self.send_json(404, {"error": "Not found"})

    def log_message(self, format: str, *args: object) -> None:
        print(f"[api] {self.address_string()} - {format % args}")


if __name__ == "__main__":
    if not DB_PATH.exists():
        import_seed()
    print(f"GreenWings API running at http://127.0.0.1:{PORT}")
    ThreadingHTTPServer(("127.0.0.1", PORT), ApiHandler).serve_forever()
