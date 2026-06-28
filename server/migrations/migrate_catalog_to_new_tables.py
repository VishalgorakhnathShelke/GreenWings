from __future__ import annotations

import shutil
import sqlite3
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DB_PATH = ROOT / "database" / "greenwings.db"
BACKUP_DIR = ROOT / "database" / "backups"


def backup_database() -> Path:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    backup_path = BACKUP_DIR / f"greenwings-before-new-table-switch-{datetime.now().strftime('%Y%m%d-%H%M%S')}.db"
    shutil.copy2(DB_PATH, backup_path)
    return backup_path


def table_exists(connection: sqlite3.Connection, table: str) -> bool:
    return connection.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name = ?",
        (table,),
    ).fetchone() is not None


def columns(connection: sqlite3.Connection, table: str) -> set[str]:
    if not table_exists(connection, table):
        return set()
    return {row[1] for row in connection.execute(f"PRAGMA table_info({table})")}


def add_column(connection: sqlite3.Connection, table: str, name: str, definition: str) -> None:
    if table_exists(connection, table) and name not in columns(connection, table):
        connection.execute(f"ALTER TABLE {table} ADD COLUMN {name} {definition}")


def first_scientific_name(value: str | None) -> tuple[str | None, str | None]:
    if not value:
        return None, None
    first_name = value.split("/")[0].strip()
    parts = first_name.split()
    if len(parts) < 2:
        return parts[0] if parts else None, None
    return parts[0], " ".join(parts[1:])


def ensure_schema(connection: sqlite3.Connection) -> None:
    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS crop_category (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            icon_url TEXT,
            image_link TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS crop_taxonomy (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kingdom TEXT DEFAULT 'Plantae',
            phylum TEXT,
            class_name TEXT,
            order_name TEXT,
            family TEXT,
            genus TEXT,
            species TEXT,
            cultivar_group TEXT,
            image_link TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(genus, species)
        );

        CREATE TABLE IF NOT EXISTS region (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            country TEXT,
            state_province TEXT,
            climate_zone TEXT,
            soil_type TEXT,
            avg_rainfall_mm REAL,
            avg_temp_celsius REAL,
            latitude REAL,
            longitude REAL,
            image_link TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(name, country, state_province)
        );

        CREATE TABLE IF NOT EXISTS crop (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produce_id INTEGER UNIQUE,
            category_id INTEGER,
            taxonomy_id INTEGER,
            common_name TEXT NOT NULL,
            type TEXT,
            category TEXT,
            season TEXT,
            scientific_name TEXT,
            marathi_name TEXT,
            hindi_name TEXT,
            english_name TEXT,
            description TEXT,
            origin_region TEXT,
            image_url TEXT,
            image_link TEXT,
            growth_habit TEXT,
            lifecycle_type TEXT,
            is_edible INTEGER NOT NULL DEFAULT 1,
            is_commercial INTEGER NOT NULL DEFAULT 0,
            notes TEXT,
            status TEXT NOT NULL DEFAULT 'active',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (produce_id) REFERENCES produce(produce_id) ON DELETE SET NULL ON UPDATE CASCADE,
            FOREIGN KEY (category_id) REFERENCES crop_category(id) ON DELETE SET NULL ON UPDATE CASCADE,
            FOREIGN KEY (taxonomy_id) REFERENCES crop_taxonomy(id) ON DELETE SET NULL ON UPDATE CASCADE
        );

        CREATE TABLE IF NOT EXISTS crop_translations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop_id INTEGER NOT NULL,
            language TEXT NOT NULL,
            display_name TEXT NOT NULL,
            display_type TEXT,
            category TEXT,
            season TEXT,
            description TEXT,
            notes TEXT,
            image_link TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(crop_id, language),
            FOREIGN KEY (crop_id) REFERENCES crop(id) ON DELETE CASCADE ON UPDATE CASCADE
        );

        CREATE TABLE IF NOT EXISTS crop_variety (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop_id INTEGER NOT NULL,
            subtype_id INTEGER UNIQUE,
            variety_name TEXT NOT NULL,
            local_name TEXT,
            region_of_origin TEXT,
            season_type TEXT,
            flavor_profile TEXT,
            color TEXT,
            texture TEXT,
            size_description TEXT,
            scientific_name TEXT,
            marathi_name TEXT,
            image_url TEXT,
            image_link TEXT,
            is_hybrid INTEGER NOT NULL DEFAULT 0,
            is_heirloom INTEGER NOT NULL DEFAULT 0,
            is_gmo INTEGER NOT NULL DEFAULT 0,
            development_year TEXT,
            developed_by TEXT,
            description TEXT,
            notes TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (crop_id) REFERENCES crop(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (subtype_id) REFERENCES subtypes(subtype_id) ON DELETE SET NULL ON UPDATE CASCADE,
            UNIQUE(crop_id, variety_name)
        );

        CREATE TABLE IF NOT EXISTS crop_variety_translations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop_variety_id INTEGER NOT NULL,
            language TEXT NOT NULL,
            display_name TEXT NOT NULL,
            region_of_origin TEXT,
            flavor_profile TEXT,
            description TEXT,
            notes TEXT,
            image_link TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(crop_variety_id, language),
            FOREIGN KEY (crop_variety_id) REFERENCES crop_variety(id) ON DELETE CASCADE ON UPDATE CASCADE
        );

        CREATE TABLE IF NOT EXISTS fertilizers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fertilizer_type TEXT NOT NULL DEFAULT 'local' CHECK (fertilizer_type IN ('local','imported')),
            name TEXT NOT NULL,
            category TEXT,
            manufacturer TEXT,
            brand TEXT,
            countryOfOrigin TEXT,
            description TEXT,
            content TEXT,
            uses TEXT,
            applyOnCrops TEXT,
            doNotApplyOn TEXT,
            applicationMethod TEXT,
            recommendedStage TEXT,
            season TEXT,
            temperatureRange TEXT,
            soilType TEXT,
            benefits TEXT,
            precautions TEXT,
            imageUrl TEXT,
            image_link TEXT,
            documentUrl TEXT,
            approvalBody TEXT,
            regionalRecommendations TEXT,
            importCertifications TEXT,
            internationalSpecifications TEXT,
            status TEXT NOT NULL DEFAULT 'active',
            createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE UNIQUE INDEX IF NOT EXISTS uq_fertilizers_type_name_manufacturer
            ON fertilizers(fertilizer_type, name, COALESCE(manufacturer, ''));

        CREATE TABLE IF NOT EXISTS fertilizer_translations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fertilizer_id INTEGER NOT NULL,
            language TEXT NOT NULL,
            name TEXT,
            category TEXT,
            description TEXT,
            content TEXT,
            uses TEXT,
            benefits TEXT,
            precautions TEXT,
            countryOfOrigin TEXT,
            applyOnCrops TEXT,
            doNotApplyOn TEXT,
            applicationMethod TEXT,
            recommendedStage TEXT,
            season TEXT,
            temperatureRange TEXT,
            soilType TEXT,
            approvalBody TEXT,
            regionalRecommendations TEXT,
            brand TEXT,
            importCertifications TEXT,
            internationalSpecifications TEXT,
            image_link TEXT,
            createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(fertilizer_id, language),
            FOREIGN KEY (fertilizer_id) REFERENCES fertilizers(id) ON DELETE CASCADE ON UPDATE CASCADE
        );
        """
    )

    for table in [
        "crop_category",
        "crop_taxonomy",
        "region",
        "nutritional_profile",
        "crop_uses",
        "pests_and_diseases",
        "growing_season",
        "cultivation_guide",
        "market_info",
    ]:
        add_column(connection, table, "image_link", "TEXT")

    crop_columns = {
        "produce_id": "INTEGER",
        "type": "TEXT",
        "category": "TEXT",
        "season": "TEXT",
        "marathi_name": "TEXT",
        "hindi_name": "TEXT",
        "english_name": "TEXT",
        "image_link": "TEXT",
        "status": "TEXT NOT NULL DEFAULT 'active'",
    }
    for name, definition in crop_columns.items():
        add_column(connection, "crop", name, definition)

    crop_variety_columns = {
        "subtype_id": "INTEGER",
        "scientific_name": "TEXT",
        "marathi_name": "TEXT",
        "image_link": "TEXT",
        "notes": "TEXT",
    }
    for name, definition in crop_variety_columns.items():
        add_column(connection, "crop_variety", name, definition)

    add_column(connection, "fertilizers", "image_link", "TEXT")
    add_column(connection, "fertilizer_translations", "image_link", "TEXT")
    add_column(connection, "produce", "image_link", "TEXT")
    add_column(connection, "subtypes", "image_link", "TEXT")
    connection.execute("CREATE UNIQUE INDEX IF NOT EXISTS uq_crop_produce_id ON crop(produce_id) WHERE produce_id IS NOT NULL")
    connection.execute("CREATE UNIQUE INDEX IF NOT EXISTS uq_crop_variety_subtype_id ON crop_variety(subtype_id) WHERE subtype_id IS NOT NULL")


def migrate_crop_categories(connection: sqlite3.Connection) -> None:
    for row in connection.execute("SELECT DISTINCT type FROM produce WHERE type IS NOT NULL AND TRIM(type) != ''"):
        name = row[0]
        connection.execute(
            """
            INSERT INTO crop_category (name, description, created_at, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT(name) DO UPDATE SET updated_at = excluded.updated_at
            """,
            (name, f"{name.title()} products managed by GreenWings."),
        )


def taxonomy_id_for_product(connection: sqlite3.Connection, scientific_name: str | None) -> int | None:
    genus, species = first_scientific_name(scientific_name)
    if not genus:
        return None
    cursor = connection.execute(
        """
        INSERT INTO crop_taxonomy (kingdom, genus, species, created_at, updated_at)
        VALUES ('Plantae', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(genus, species) DO UPDATE SET updated_at = excluded.updated_at
        RETURNING id
        """,
        (genus, species or ""),
    )
    return int(cursor.fetchone()[0])


def migrate_crops(connection: sqlite3.Connection) -> None:
    migrate_crop_categories(connection)
    products = connection.execute(
        """
        SELECT produce_id, type, name, scientific_name, category, season, marathi_name,
               hindi_name, english_name, description, info, image_link, status
        FROM produce
        ORDER BY produce_id
        """
    ).fetchall()
    for product in products:
        category_id = connection.execute(
            "SELECT id FROM crop_category WHERE name = ?",
            (product["type"],),
        ).fetchone()
        taxonomy_id = taxonomy_id_for_product(connection, product["scientific_name"])
        values = (
            category_id["id"] if category_id else None,
            taxonomy_id,
            product["name"],
            product["type"],
            product["category"],
            product["season"],
            product["scientific_name"],
            product["marathi_name"],
            product["hindi_name"],
            product["english_name"],
            product["description"],
            product["image_link"],
            product["info"],
            product["status"] or "active",
        )
        existing = connection.execute("SELECT id, image_link FROM crop WHERE produce_id = ?", (product["produce_id"],)).fetchone()
        if existing:
            connection.execute(
                """
                UPDATE crop SET
                    category_id = ?, taxonomy_id = ?, common_name = ?, type = ?, category = ?,
                    season = ?, scientific_name = ?, marathi_name = ?, hindi_name = ?,
                    english_name = ?, description = ?,
                    image_link = COALESCE(NULLIF(image_link, ''), ?),
                    notes = ?, status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE produce_id = ?
                """,
                (*values, product["produce_id"]),
            )
        else:
            connection.execute(
                """
                INSERT INTO crop (
                    produce_id, category_id, taxonomy_id, common_name, type, category, season,
                    scientific_name, marathi_name, hindi_name, english_name, description,
                    image_link, notes, status, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """,
                (product["produce_id"], *values),
            )

    connection.execute(
        """
        INSERT INTO crop_translations (
            crop_id, language, display_name, display_type, category, season,
            description, notes, image_link, created_at, updated_at
        )
        SELECT c.id, pt.language, pt.display_name, pt.display_type, pt.category, pt.season,
               pt.description, pt.info, p.image_link, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        FROM produce_translations pt
        JOIN crop c ON c.produce_id = pt.produce_id
        JOIN produce p ON p.produce_id = pt.produce_id
        ON CONFLICT(crop_id, language) DO UPDATE SET
            display_name = excluded.display_name,
            display_type = excluded.display_type,
            category = excluded.category,
            season = excluded.season,
            description = excluded.description,
            notes = excluded.notes,
            image_link = COALESCE(NULLIF(crop_translations.image_link, ''), excluded.image_link),
            updated_at = CURRENT_TIMESTAMP
        """
    )


def migrate_regions(connection: sqlite3.Connection) -> None:
    regions = connection.execute(
        """
        SELECT DISTINCT origin_state
        FROM subtypes
        WHERE origin_state IS NOT NULL AND TRIM(origin_state) != ''
        ORDER BY origin_state
        """
    ).fetchall()
    for row in regions:
        name = row["origin_state"].strip()
        state = "Maharashtra" if "Maharashtra" in name else None
        connection.execute(
            """
            INSERT INTO region (name, country, state_province, created_at, updated_at)
            VALUES (?, 'India', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT(name, country, state_province) DO UPDATE SET updated_at = excluded.updated_at
            """,
            (name, state),
        )


def migrate_crop_varieties(connection: sqlite3.Connection) -> None:
    migrate_regions(connection)
    rows = connection.execute(
        """
        SELECT s.subtype_id, s.produce_id, s.subtype_name, s.origin_state, s.taste_profile,
               s.scientific_name, s.marathi_name, s.description, s.info, s.image_link, c.id AS crop_id
        FROM subtypes s
        JOIN crop c ON c.produce_id = s.produce_id
        ORDER BY s.subtype_id
        """
    ).fetchall()
    for row in rows:
        values = (
            row["crop_id"],
            row["subtype_name"],
            row["marathi_name"],
            row["origin_state"],
            row["taste_profile"],
            row["scientific_name"],
            row["marathi_name"],
            row["description"],
            row["info"],
            row["image_link"],
        )
        existing = connection.execute("SELECT id FROM crop_variety WHERE subtype_id = ?", (row["subtype_id"],)).fetchone()
        if existing:
            connection.execute(
                """
                UPDATE crop_variety SET
                    crop_id = ?, variety_name = ?, local_name = ?, region_of_origin = ?,
                    flavor_profile = ?, scientific_name = ?, marathi_name = ?, description = ?,
                    notes = ?, image_link = COALESCE(NULLIF(image_link, ''), ?),
                    updated_at = CURRENT_TIMESTAMP
                WHERE subtype_id = ?
                """,
                (*values, row["subtype_id"]),
            )
        else:
            connection.execute(
                """
                INSERT INTO crop_variety (
                    crop_id, subtype_id, variety_name, local_name, region_of_origin,
                    flavor_profile, scientific_name, marathi_name, description,
                    notes, image_link, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """,
                (row["crop_id"], row["subtype_id"], row["subtype_name"], row["marathi_name"], row["origin_state"], row["taste_profile"], row["scientific_name"], row["marathi_name"], row["description"], row["info"], row["image_link"]),
            )

    connection.execute(
        """
        INSERT INTO crop_variety_translations (
            crop_variety_id, language, display_name, region_of_origin, flavor_profile,
            description, notes, image_link, created_at, updated_at
        )
        SELECT cv.id, st.language, st.display_name, st.origin_state, st.taste_profile,
               st.description, st.info, s.image_link, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        FROM subtype_translations st
        JOIN crop_variety cv ON cv.subtype_id = st.subtype_id
        JOIN subtypes s ON s.subtype_id = st.subtype_id
        ON CONFLICT(crop_variety_id, language) DO UPDATE SET
            display_name = excluded.display_name,
            region_of_origin = excluded.region_of_origin,
            flavor_profile = excluded.flavor_profile,
            description = excluded.description,
            notes = excluded.notes,
            image_link = COALESCE(NULLIF(crop_variety_translations.image_link, ''), excluded.image_link),
            updated_at = CURRENT_TIMESTAMP
        """
    )


def migrate_fertilizers(connection: sqlite3.Connection) -> None:
    if table_exists(connection, "local_fertilizers"):
        connection.execute(
            """
            INSERT INTO fertilizers (
                fertilizer_type, name, category, manufacturer, countryOfOrigin, description, content,
                uses, applyOnCrops, doNotApplyOn, applicationMethod, recommendedStage, season,
                temperatureRange, soilType, benefits, precautions, imageUrl, image_link, status, documentUrl,
                approvalBody, regionalRecommendations, createdAt, updatedAt
            )
            SELECT 'local', name, category, manufacturer, countryOfOrigin, description, content,
                   uses, applyOnCrops, doNotApplyOn, applicationMethod, recommendedStage, season,
                   temperatureRange, soilType, benefits, precautions, imageUrl, imageUrl, status, documentUrl,
                   approvalBody, regionalRecommendations, createdAt, updatedAt
            FROM local_fertilizers lf
            WHERE NOT EXISTS (
                SELECT 1 FROM fertilizers f
                WHERE f.fertilizer_type = 'local'
                  AND f.name = lf.name
                  AND COALESCE(f.manufacturer, '') = COALESCE(lf.manufacturer, '')
            )
            """
        )

    if table_exists(connection, "imported_fertilizers"):
        connection.execute(
            """
            INSERT INTO fertilizers (
                fertilizer_type, name, category, manufacturer, brand, countryOfOrigin, description, content,
                uses, applyOnCrops, doNotApplyOn, applicationMethod, recommendedStage, season,
                temperatureRange, soilType, benefits, precautions, imageUrl, image_link, status, documentUrl,
                importCertifications, internationalSpecifications, createdAt, updatedAt
            )
            SELECT 'imported', name, category, manufacturer, brand, countryOfOrigin, description, content,
                   uses, applyOnCrops, doNotApplyOn, applicationMethod, recommendedStage, season,
                   temperatureRange, soilType, benefits, precautions, imageUrl, imageUrl, status, documentUrl,
                   importCertifications, internationalSpecifications, createdAt, updatedAt
            FROM imported_fertilizers inf
            WHERE NOT EXISTS (
                SELECT 1 FROM fertilizers f
                WHERE f.fertilizer_type = 'imported'
                  AND f.name = inf.name
                  AND COALESCE(f.manufacturer, '') = COALESCE(inf.manufacturer, '')
            )
            """
        )

    if table_exists(connection, "local_fertilizer_translations"):
        connection.execute(
            """
            INSERT OR IGNORE INTO fertilizer_translations (
                fertilizer_id, language, name, category, description, content, uses, benefits,
                precautions, countryOfOrigin, applyOnCrops, doNotApplyOn, applicationMethod,
                recommendedStage, season, temperatureRange, soilType, approvalBody,
                regionalRecommendations, brand, importCertifications, internationalSpecifications,
                image_link, createdAt, updatedAt
            )
            SELECT f.id, lt.language, lt.name, lt.category, lt.description, lt.content, lt.uses, lt.benefits,
                   lt.precautions, lt.countryOfOrigin, lt.applyOnCrops, lt.doNotApplyOn, lt.applicationMethod,
                   lt.recommendedStage, lt.season, lt.temperatureRange, lt.soilType, lt.approvalBody,
                   lt.regionalRecommendations, lt.brand, lt.importCertifications, lt.internationalSpecifications,
                   f.image_link, lt.createdAt, lt.updatedAt
            FROM local_fertilizer_translations lt
            JOIN local_fertilizers lf ON lf.id = lt.fertilizerId
            JOIN fertilizers f ON f.fertilizer_type = 'local' AND f.name = lf.name
            """
        )

    if table_exists(connection, "imported_fertilizer_translations"):
        connection.execute(
            """
            INSERT OR IGNORE INTO fertilizer_translations (
                fertilizer_id, language, name, category, description, content, uses, benefits,
                precautions, countryOfOrigin, applyOnCrops, doNotApplyOn, applicationMethod,
                recommendedStage, season, temperatureRange, soilType, approvalBody,
                regionalRecommendations, brand, importCertifications, internationalSpecifications,
                image_link, createdAt, updatedAt
            )
            SELECT f.id, it.language, it.name, it.category, it.description, it.content, it.uses, it.benefits,
                   it.precautions, it.countryOfOrigin, it.applyOnCrops, it.doNotApplyOn, it.applicationMethod,
                   it.recommendedStage, it.season, it.temperatureRange, it.soilType, it.approvalBody,
                   it.regionalRecommendations, it.brand, it.importCertifications, it.internationalSpecifications,
                   f.image_link, it.createdAt, it.updatedAt
            FROM imported_fertilizer_translations it
            JOIN imported_fertilizers inf ON inf.id = it.fertilizerId
            JOIN fertilizers f ON f.fertilizer_type = 'imported' AND f.name = inf.name
            """
        )


def ensure_indexes(connection: sqlite3.Connection) -> None:
    connection.executescript(
        """
        CREATE INDEX IF NOT EXISTS idx_crop_type ON crop(type);
        CREATE INDEX IF NOT EXISTS idx_crop_status ON crop(status);
        CREATE INDEX IF NOT EXISTS idx_crop_produce ON crop(produce_id);
        CREATE INDEX IF NOT EXISTS idx_crop_translations_language ON crop_translations(language);
        CREATE INDEX IF NOT EXISTS idx_crop_variety_crop ON crop_variety(crop_id);
        CREATE INDEX IF NOT EXISTS idx_crop_variety_subtype ON crop_variety(subtype_id);
        CREATE INDEX IF NOT EXISTS idx_crop_variety_translations_language ON crop_variety_translations(language);
        CREATE INDEX IF NOT EXISTS idx_fert_type ON fertilizers(fertilizer_type);
        CREATE INDEX IF NOT EXISTS idx_fert_status ON fertilizers(status);
        CREATE INDEX IF NOT EXISTS idx_fert_translations_language ON fertilizer_translations(language);
        """
    )


def main() -> None:
    if not DB_PATH.exists():
        raise SystemExit(f"Database not found: {DB_PATH}")

    backup_path = backup_database()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = OFF")
        ensure_schema(connection)
        migrate_crops(connection)
        migrate_crop_varieties(connection)
        migrate_fertilizers(connection)
        ensure_indexes(connection)
        connection.commit()
        connection.execute("PRAGMA foreign_keys = ON")
        fk_errors = connection.execute("PRAGMA foreign_key_check").fetchall()
        if fk_errors:
            raise SystemExit(f"Foreign key check failed: {fk_errors[:10]}")
        summary = dict(
            connection.execute(
                """
                SELECT 'crop' AS name, COUNT(*) AS total FROM crop
                UNION ALL SELECT 'crop_translations', COUNT(*) FROM crop_translations
                UNION ALL SELECT 'crop_variety', COUNT(*) FROM crop_variety
                UNION ALL SELECT 'crop_variety_translations', COUNT(*) FROM crop_variety_translations
                UNION ALL SELECT 'fertilizers', COUNT(*) FROM fertilizers
                UNION ALL SELECT 'fertilizer_translations', COUNT(*) FROM fertilizer_translations
                """
            ).fetchall()
        )
    print(f"Backup: {backup_path}")
    print(summary)


if __name__ == "__main__":
    main()
