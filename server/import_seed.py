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


LANGUAGE_LABELS = {
    "hi": {
        "fruit": "फल",
        "grain": "अनाज",
        "product_intro": "{name} GreenWings कैटलॉग का एक महत्वपूर्ण {type_label} उत्पाद है. इस रिकॉर्ड में किसान, खरीदार और भागीदारों के लिए किस्म, मौसम, श्रेणी और बाजार उपयोग की मुख्य जानकारी दी गई है.",
        "subtype_intro": "{name} इस उत्पाद की एक महत्वपूर्ण किस्म/उपप्रकार है. इसकी उत्पत्ति, स्वाद प्रोफाइल, वैज्ञानिक पहचान और उपयोग की जानकारी सरल रूप में दी गई है.",
        "scientific_name": "वैज्ञानिक नाम",
        "category": "श्रेणी",
        "season": "मौसम",
        "marathi_name": "मराठी नाम",
        "hindi_name": "हिंदी नाम",
        "english_name": "अंग्रेजी नाम",
        "origin": "उत्पत्ति क्षेत्र",
        "taste_profile": "स्वाद प्रोफाइल",
        "source_note": "मूल डेटासेट विवरण",
        "not_specified": "उपलब्ध नहीं",
    },
    "mr": {
        "fruit": "फळ",
        "grain": "धान्य",
        "product_intro": "{name} हे GreenWings कॅटलॉगमधील महत्त्वाचे {type_label} उत्पादन आहे. या नोंदीमध्ये शेतकरी, खरेदीदार आणि भागीदारांसाठी वाण, हंगाम, श्रेणी आणि बाजारपेठेची मुख्य माहिती दिली आहे.",
        "subtype_intro": "{name} ही या उत्पादनाची महत्त्वाची जात/उपप्रकार आहे. तिचे उत्पत्ती क्षेत्र, चव, शास्त्रीय ओळख आणि वापर यांची माहिती सोप्या स्वरूपात दिली आहे.",
        "scientific_name": "शास्त्रीय नाव",
        "category": "श्रेणी",
        "season": "हंगाम",
        "marathi_name": "मराठी नाव",
        "hindi_name": "हिंदी नाव",
        "english_name": "इंग्रजी नाव",
        "origin": "उत्पत्ती क्षेत्र",
        "taste_profile": "चव वैशिष्ट्य",
        "source_note": "मूळ डेटासेट तपशील",
        "not_specified": "उपलब्ध नाही",
    },
}


PRODUCT_DISPLAY_NAMES = {
    "hi": {
        "Mango": "आम",
        "Grapes": "अंगूर",
        "Orange": "संतरा",
        "Banana": "केला",
        "Guava": "अमरूद",
        "Pomegranate": "अनार",
        "Custard Apple": "सीताफल",
        "Papaya": "पपीता",
        "Sapota": "चीकू",
        "Coconut": "नारियल",
        "Jackfruit": "कटहल",
        "Amla": "आंवला",
        "Strawberry": "स्ट्रॉबेरी",
        "Fig": "अंजीर",
        "Ber": "बेर",
        "Rice": "चावल",
        "Wheat": "गेहूं",
        "Jowar": "ज्वार",
        "Bajra": "बाजरा",
        "Maize": "मक्का",
        "Ragi": "रागी",
        "Kodo Millet": "कोदो",
        "Little Millet": "कुटकी",
        "Barnyard Millet": "सांवा",
        "Proso Millet": "चीना",
        "Tur (Pigeon Pea)": "तूर / अरहर",
        "Chickpea": "चना",
        "Urad (Black Gram)": "उड़द",
        "Masoor (Lentil)": "मसूर",
        "Soybean": "सोयाबीन",
        "Groundnut": "मूंगफली",
        "Sesame": "तिल",
        "Sunflower": "सूरजमुखी",
        "Sugarcane": "गन्ना",
        "Onion": "प्याज",
        "Tomato": "टमाटर",
        "Sweet Lime": "मोसंबी",
        "Garlic": "लहसुन",
        "Turmeric": "हल्दी",
        "Chilli": "मिर्च",
        "Ginger": "अदरक",
        "Tamarind": "इमली",
        "Fenugreek": "मेथी",
        "Coriander": "धनिया",
        "Watermelon": "तरबूज",
        "Muskmelon": "खरबूजा",
        "Lemon": "नींबू",
    },
    "mr": {
        "Mango": "आंबा",
        "Grapes": "द्राक्ष",
        "Orange": "संत्रा",
        "Banana": "केळी",
        "Guava": "पेरू",
        "Pomegranate": "डाळिंब",
        "Custard Apple": "सीताफळ",
        "Papaya": "पपई",
        "Sapota": "चीकू",
        "Coconut": "नारळ",
        "Jackfruit": "फणस",
        "Amla": "आवळा",
        "Strawberry": "स्ट्रॉबेरी",
        "Fig": "अंजीर",
        "Ber": "बोर",
        "Rice": "तांदूळ",
        "Wheat": "गहू",
        "Jowar": "ज्वारी",
        "Bajra": "बाजरी",
        "Maize": "मका",
        "Ragi": "नाचणी",
        "Kodo Millet": "कोद्रा",
        "Little Millet": "वरी / कुटकी",
        "Barnyard Millet": "भगर / सांवा",
        "Proso Millet": "चीना",
        "Tur (Pigeon Pea)": "तूर",
        "Chickpea": "हरभरा",
        "Urad (Black Gram)": "उडीद",
        "Masoor (Lentil)": "मसूर",
        "Soybean": "सोयाबीन",
        "Groundnut": "शेंगदाणा",
        "Sesame": "तीळ",
        "Sunflower": "सूर्यफूल",
        "Sugarcane": "ऊस",
        "Onion": "कांदा",
        "Tomato": "टोमॅटो",
        "Sweet Lime": "मोसंबी",
        "Garlic": "लसूण",
        "Turmeric": "हळद",
        "Chilli": "मिरची",
        "Ginger": "आले",
        "Tamarind": "चिंच",
        "Fenugreek": "मेथी",
        "Coriander": "कोथिंबीर",
        "Watermelon": "कलिंगड",
        "Muskmelon": "खरबूज",
        "Lemon": "लिंबू",
    },
}


def localized_value(value: str | None, fallback: str) -> str:
    return value.strip() if value and value.strip() else fallback


def build_localized_product(record: dict[str, str | None], language: str) -> dict[str, str]:
    labels = LANGUAGE_LABELS[language]
    name = PRODUCT_DISPLAY_NAMES[language].get(record.get("name") or "")
    if not name:
        name = record.get("hindi_name") if language == "hi" else record.get("marathi_name")
    display_name = localized_value(name, record.get("name") or "")
    product_type = record.get("type") or "produce"
    type_label = labels.get(product_type, product_type)
    info_lines = [
        labels["product_intro"].format(name=display_name, type_label=type_label),
        f"{labels['scientific_name']}: {localized_value(record.get('scientific_name'), labels['not_specified'])}",
        f"{labels['category']}: {localized_value(record.get('category'), labels['not_specified'])}",
        f"{labels['season']}: {localized_value(record.get('season'), labels['not_specified'])}",
        f"{labels['marathi_name']}: {localized_value(record.get('marathi_name'), labels['not_specified'])}",
        f"{labels['hindi_name']}: {localized_value(record.get('hindi_name'), labels['not_specified'])}",
        f"{labels['english_name']}: {localized_value(record.get('english_name') or record.get('name'), labels['not_specified'])}",
    ]
    if record.get("description"):
        info_lines.append(f"{labels['source_note']}: {record['description']}")
    return {
        "language": language,
        "display_name": display_name,
        "display_type": type_label,
        "category": localized_value(record.get("category"), labels["not_specified"]),
        "season": localized_value(record.get("season"), labels["not_specified"]),
        "description": info_lines[0],
        "info": "\n\n".join(info_lines),
    }


def build_localized_subtype(record: dict[str, str | None], language: str) -> dict[str, str]:
    labels = LANGUAGE_LABELS[language]
    name = record.get("marathi_name") if language == "mr" else record.get("subtype_name")
    display_name = localized_value(name, record.get("subtype_name") or "")
    info_lines = [
        labels["subtype_intro"].format(name=display_name),
        f"{labels['scientific_name']}: {localized_value(record.get('scientific_name'), labels['not_specified'])}",
        f"{labels['origin']}: {localized_value(record.get('origin_state'), labels['not_specified'])}",
        f"{labels['taste_profile']}: {localized_value(record.get('taste_profile'), labels['not_specified'])}",
        f"{labels['marathi_name']}: {localized_value(record.get('marathi_name'), labels['not_specified'])}",
    ]
    if record.get("description"):
        info_lines.append(f"{labels['source_note']}: {record['description']}")
    return {
        "language": language,
        "display_name": display_name,
        "origin_state": localized_value(record.get("origin_state"), labels["not_specified"]),
        "taste_profile": localized_value(record.get("taste_profile"), labels["not_specified"]),
        "description": info_lines[0],
        "info": "\n\n".join(info_lines),
    }


def import_seed() -> tuple[int, int]:
    sql = SEED_PATH.read_text(encoding="utf-8")
    connection = sqlite3.connect(DB_PATH)
    connection.executescript(
        """
        DROP TABLE IF EXISTS subtype_translations;
        DROP TABLE IF EXISTS subtypes;
        DROP TABLE IF EXISTS produce_translations;
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
        CREATE TABLE produce_translations (
          produce_id INTEGER NOT NULL REFERENCES produce(produce_id),
          language TEXT NOT NULL,
          display_name TEXT NOT NULL,
          display_type TEXT NOT NULL,
          category TEXT NOT NULL,
          season TEXT NOT NULL,
          description TEXT NOT NULL,
          info TEXT NOT NULL,
          PRIMARY KEY (produce_id, language)
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
        CREATE TABLE subtype_translations (
          subtype_id INTEGER NOT NULL REFERENCES subtypes(subtype_id),
          language TEXT NOT NULL,
          display_name TEXT NOT NULL,
          origin_state TEXT NOT NULL,
          taste_profile TEXT NOT NULL,
          description TEXT NOT NULL,
          info TEXT NOT NULL,
          PRIMARY KEY (subtype_id, language)
        );
        CREATE INDEX idx_produce_type ON produce(type);
        CREATE INDEX idx_subtypes_produce ON subtypes(produce_id);
        CREATE INDEX idx_produce_translations_language ON produce_translations(language);
        CREATE INDEX idx_subtype_translations_language ON subtype_translations(language);
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
            cursor = connection.execute(
                f"INSERT OR IGNORE INTO produce ({','.join(insert_columns)}) VALUES ({','.join('?' for _ in insert_columns)})",
                [record.get(column) for column in insert_columns],
            )
            produce_id = cursor.lastrowid
            for language in ("hi", "mr"):
                translation = build_localized_product(record, language)
                connection.execute(
                    """
                    INSERT OR REPLACE INTO produce_translations
                      (produce_id, language, display_name, display_type, category, season, description, info)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        produce_id,
                        translation["language"],
                        translation["display_name"],
                        translation["display_type"],
                        translation["category"],
                        translation["season"],
                        translation["description"],
                        translation["info"],
                    ),
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
            cursor = connection.execute(
                """
                INSERT INTO subtypes
                  (produce_id, subtype_name, origin_state, taste_profile, scientific_name, marathi_name, description, info)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (produce[0], record["subtype_name"], record["origin_state"], record["taste_profile"],
                 record["scientific_name"], record["marathi_name"], record["description"], record["info"]),
            )
            subtype_id = cursor.lastrowid
            for language in ("hi", "mr"):
                translation = build_localized_subtype(record, language)
                connection.execute(
                    """
                    INSERT OR REPLACE INTO subtype_translations
                      (subtype_id, language, display_name, origin_state, taste_profile, description, info)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        subtype_id,
                        translation["language"],
                        translation["display_name"],
                        translation["origin_state"],
                        translation["taste_profile"],
                        translation["description"],
                        translation["info"],
                    ),
                )
            subtype_count += 1

    connection.commit()
    connection.close()
    return produce_count, subtype_count


if __name__ == "__main__":
    produce_count, subtype_count = import_seed()
    print(f"Imported {produce_count} produce records and {subtype_count} subtype records into {DB_PATH}")
