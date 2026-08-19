"""
Portfolio - Backend Flask
------------------------------------
- Sert le front (Tailwind CSS + JS) et une API JSON qui alimente la page.
- /api/portfolio      -> toutes les données du site (bilingue FR/EN)
- /api/contact (POST) -> traite le formulaire de contact
- /api/stats          -> petit compteur de visites persistant (preuve de "dynamisme" côté serveur)
"""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "portfolio.json"
MESSAGES_FILE = BASE_DIR / "data" / "messages.json"
STATS_FILE = BASE_DIR / "data" / "stats.json"

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

app = Flask(__name__, static_folder="static", template_folder="templates")


def _read_json(path: Path, default):
    if not path.exists():
        return default
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return default


def _write_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)


@app.get("/")
def index():
    return send_from_directory(app.template_folder, "index.html")


@app.get("/api/portfolio")
def get_portfolio():
    data = _read_json(DATA_FILE, {})
    if not data:
        return jsonify({"error": "portfolio data unavailable"}), 500
    return jsonify(data)


@app.get("/api/stats")
def get_stats():
    stats = _read_json(STATS_FILE, {"visits": 0})
    stats["visits"] = stats.get("visits", 0) + 1
    _write_json(STATS_FILE, stats)
    return jsonify(stats)


@app.post("/api/contact")
def post_contact():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    message = (payload.get("message") or "").strip()

    errors = {}
    if len(name) < 2:
        errors["name"] = "Le nom doit contenir au moins 2 caractères."
    if not EMAIL_RE.match(email):
        errors["email"] = "Adresse email invalide."
    if len(message) < 10:
        errors["message"] = "Le message doit contenir au moins 10 caractères."

    if errors:
        return jsonify({"ok": False, "errors": errors}), 400

    messages = _read_json(MESSAGES_FILE, [])
    messages.append(
        {
            "name": name,
            "email": email,
            "message": message,
            "received_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    _write_json(MESSAGES_FILE, messages)

    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
