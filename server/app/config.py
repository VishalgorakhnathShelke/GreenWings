from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

try:
    import tomllib
except ModuleNotFoundError:  # Python 3.10
    import tomli as tomllib

ROOT = Path(__file__).resolve().parents[2]
ENV_PATH = ROOT / ".env"
PYPROJECT_PATH = ROOT / "pyproject.toml"


def load_env_file() -> None:
    if not ENV_PATH.exists():
        return
    for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def load_toml_settings() -> dict:
    if not PYPROJECT_PATH.exists():
        return {}
    data = tomllib.loads(PYPROJECT_PATH.read_text(encoding="utf-8"))
    return data.get("tool", {}).get("greenwings", {})


def normalize_database_url(database_url: str) -> str:
    if not database_url.startswith("sqlite:///"):
        return database_url
    path_value = database_url.removeprefix("sqlite:///")
    db_path = Path(path_value)
    if not db_path.is_absolute():
        db_path = ROOT / db_path
    return f"sqlite:///{db_path.as_posix()}"


@dataclass(frozen=True)
class Settings:
    api_host: str
    api_port: int
    database_url: str
    admin_email: str
    admin_password: str
    token_secret: str


def build_settings() -> Settings:
    load_env_file()
    toml_settings = load_toml_settings()
    database_url = os.environ.get(
        "DATABASE_URL",
        os.environ.get("GREENWINGS_DATABASE_URL", toml_settings.get("database_url", "sqlite:///database/greenwings.db")),
    )
    return Settings(
        api_host=os.environ.get("API_HOST", str(toml_settings.get("api_host", "127.0.0.1"))),
        api_port=int(os.environ.get("API_PORT", str(toml_settings.get("api_port", 8787)))),
        database_url=normalize_database_url(database_url),
        admin_email=os.environ.get("ADMIN_EMAIL", "admin@greenwings.local"),
        admin_password=os.environ.get("ADMIN_PASSWORD", "ChangeMeBeforeProduction!"),
        token_secret=os.environ.get("ADMIN_TOKEN_SECRET", "local-development-secret"),
    )


settings = build_settings()
