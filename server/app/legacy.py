from __future__ import annotations

import importlib.util
import sys
from pathlib import Path
from types import ModuleType

ROOT = Path(__file__).resolve().parents[2]
SERVER_DIR = ROOT / "server"
LEGACY_SERVER_PATH = SERVER_DIR / "server.py"


def load_legacy_server() -> ModuleType:
    if str(SERVER_DIR) not in sys.path:
        sys.path.insert(0, str(SERVER_DIR))
    spec = importlib.util.spec_from_file_location("greenwings_legacy_server", LEGACY_SERVER_PATH)
    if not spec or not spec.loader:
        raise RuntimeError("Unable to load legacy GreenWings server helpers.")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


legacy = load_legacy_server()
