from __future__ import annotations

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VENV_PYTHON = ROOT / ".venv" / "Scripts" / "python.exe"


def inside_venv() -> bool:
    return Path(sys.executable).resolve() == VENV_PYTHON.resolve() if VENV_PYTHON.exists() else False


if VENV_PYTHON.exists() and not inside_venv():
    os.execv(str(VENV_PYTHON), [str(VENV_PYTHON), __file__, *sys.argv[1:]])

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

try:
    import uvicorn
except ModuleNotFoundError as exc:
    raise SystemExit(
        "FastAPI backend dependencies are missing. Run: "
        "python -m venv .venv && .\\.venv\\Scripts\\python -m pip install -e ."
    ) from exc

from server.app.config import settings


if __name__ == "__main__":
    uvicorn.run(
        "server.app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload="--reload" in sys.argv,
    )
