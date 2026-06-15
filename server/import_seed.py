from __future__ import annotations

import re
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEED_PATH = ROOT / "database" / "greenwings_maharashtra_seed.sql"
DB_PATH = ROOT / "database" / "greenwings.db"


def parse_tuple(text: str) -> list[str | None]:
    values: list[str | None] = []
    current: list[str] = []
    quoted = False
    index = 0

    while index < len(text):
        char = text[index]
        if char == "'":
            if quoted and index + 1 < len(text) and text[index + 1] == "'":
                current.append("'")
                index += 2
                continue
            quoted = not quoted
        elif char == "," and not quoted:
            value = "".join(current).strip()
            values.append(None if value.upper() == "NULL" else value)
            current = []
        else:
            current.append(char)
        index += 1

    value = "".join(current).strip()
    values.append(None if value.upper() == "NULL" else value)
    return values


def extract_tuples(block: str) -> list[list[str | None]]:
    tuples: list[list[str | None]] = []
    depth = 0
    quoted = False
    start = -1
    index = 0

    while index < len(block):
        char = block[index]
        if char == "'":
            if quoted and index + 1 < len(block) and block[index + 1] == "'":
                index += 2
                continue
            quoted = not quoted
        elif not quoted:
            if char == "(":
                if depth == 0:
                    start = index + 1
                depth += 1
            elif char == ")":
                depth -= 1
                if depth == 0 and start >= 0:
                    tuples.append(parse_tuple(block[start:index]))
                    start = -1
        index += 1
    return tuples


def build_info(fields: dict[str, str | None], subtype: bool = False) -> str:
    lines = [fields.get("description") or ""]
    if subtype:
        labels = [
            ("Scientific name", "scientific_name"),
            ("Origin", "origin_state"),
            ("Taste profile", "taste_profile"),
            ("Marathi name", "marathi_name"),
        ]
    else:
        labels = [
            ("Scientific name", "scientific_name"),
            ("Category", "category"),
            ("Season", "season"),
            ("Marathi name", "marathi_name"),
            ("Hindi name", "hindi_name"),
            ("English name", "english_name"),
        ]
    lines.extend(f"{label}: {fields.get(key) or 'Not specified'}" for label, key in labels)
    return "\n\n".join(line for line in lines if line)


def import_seed() -> tuple[int, int]:
    sql = SEED_PATH.read_text(encoding="utf-8")
    connection = sqlite3.connect(DB_PATH)
    connection.executescript(
        """
        DROP TABLE IF EXISTS subtypes;
        DROP TABLE IF EXISTS produce;
        CREATE TABLE produce (
          produce_id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          name TEXT NOT NULL UNIQUE,
          scientific_name TEXT,
          category TEXT,
          season TEXT,
          marathi_name TEXT,
          hindi_name TEXT,
          english_name TEXT,
          description TEXT,
          info TEXT NOT NULL
        );
        CREATE TABLE subtypes (
          subtype_id INTEGER PRIMARY KEY AUTOINCREMENT,
          produce_id INTEGER NOT NULL REFERENCES produce(produce_id),
          subtype_name TEXT NOT NULL,
          origin_state TEXT,
          taste_profile TEXT,
          scientific_name TEXT,
          marathi_name TEXT,
          description TEXT,
          info TEXT NOT NULL
        );
        CREATE INDEX idx_produce_type ON produce(type);
        CREATE INDEX idx_subtypes_produce ON subtypes(produce_id);
        """
    )

    produce_pattern = re.compile(
        r"INSERT INTO produce\s*\((?P<columns>.*?)\)\s*VALUES\s*(?P<values>\(.*?\));",
        re.IGNORECASE | re.DOTALL,
    )
    produce_count = 0
    for match in produce_pattern.finditer(sql):
        columns = [column.strip() for column in match.group("columns").split(",")]
        for values in extract_tuples(match.group("values")):
            if len(values) != len(columns):
                continue
            record = dict(zip(columns, values))
            record["info"] = build_info(record)
            insert_columns = [
                "type", "name", "scientific_name", "category", "season",
                "marathi_name", "hindi_name", "english_name", "description", "info",
            ]
            connection.execute(
                f"INSERT OR IGNORE INTO produce ({','.join(insert_columns)}) VALUES ({','.join('?' for _ in insert_columns)})",
                [record.get(column) for column in insert_columns],
            )
            produce_count += 1

    subtype_pattern = re.compile(
        r"INSERT INTO subtypes.*?\(VALUES(?P<values>.*?)\)\s+AS\s+s\(.*?\)\s+WHERE\s+p\.name\s*=\s*'(?P<produce>[^']+)'",
        re.IGNORECASE | re.DOTALL,
    )
    subtype_count = 0
    for match in subtype_pattern.finditer(sql):
        produce = connection.execute(
            "SELECT produce_id FROM produce WHERE name = ?", (match.group("produce"),)
        ).fetchone()
        if not produce:
            continue
        for values in extract_tuples(match.group("values")):
            if len(values) < 6:
                continue
            record = dict(zip(
                ["subtype_name", "origin_state", "taste_profile", "scientific_name", "marathi_name", "description"],
                values[:6],
            ))
            record["info"] = build_info(record, subtype=True)
            connection.execute(
                """
                INSERT INTO subtypes
                  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description, info)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (produce[0], record["subtype_name"], record["origin_state"], record["taste_profile"],
                 record["scientific_name"], record["marathi_name"], record["description"], record["info"]),
            )
            subtype_count += 1

    connection.commit()
    connection.close()
    return produce_count, subtype_count


if __name__ == "__main__":
    produce_count, subtype_count = import_seed()
    print(f"Imported {produce_count} produce records and {subtype_count} subtype records into {DB_PATH}")
