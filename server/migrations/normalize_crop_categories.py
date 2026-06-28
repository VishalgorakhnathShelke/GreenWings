from __future__ import annotations

import shutil
import sqlite3
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DB_PATH = ROOT / "database" / "greenwings.db"
BACKUP_DIR = ROOT / "database" / "backups"

CATEGORY_CONTENT = [
    {
        "id": 1,
        "name": "Fresh Fruits",
        "slug": "fruits",
        "description": "Fresh fruits are GreenWings' premium horticulture category, covering mango, grapes, pomegranate, banana, guava, citrus, papaya, watermelon and other high-demand fruit crops.",
        "info": "India's diverse agro-climatic zones support a wide basket of tropical and subtropical fruits. APEDA identifies fresh fruits and vegetables as an important export category, with Indian grapes, pomegranates, mangoes, bananas and citrus fruits finding strong domestic and international demand. GreenWings uses this category for fresh, naturally ripened, quality-graded fruit crops that can serve local markets, retail chains, food processors and export buyers with traceability and careful post-harvest handling.",
        "source_urls": "https://apeda.gov.in/FreshFruitsAndVegetables",
        "translations": {
            "hi": {
                "name": "ताजे फल",
                "description": "ताजे फल GreenWings की premium horticulture category है, जिसमें आम, अंगूर, अनार, केला, अमरूद, citrus, पपीता, तरबूज और अन्य high-demand फल फसलें शामिल हैं.",
                "info": "भारत के विविध agro-climatic zones tropical और subtropical fruits की विस्तृत basket को support करते हैं. APEDA fresh fruits और vegetables को important export category मानता है, जिसमें Indian grapes, pomegranates, mangoes, bananas और citrus fruits की domestic तथा international demand मजबूत है. GreenWings इस category का उपयोग fresh, naturally ripened और quality-graded फल फसलों के लिए करता है.",
            },
            "mr": {
                "name": "ताजी फळे",
                "description": "ताजी फळे ही GreenWings ची premium horticulture category आहे, ज्यात आंबा, द्राक्षे, डाळिंब, केळी, पेरू, citrus, पपई, टरबूज आणि इतर high-demand फळ पिके येतात.",
                "info": "भारताच्या विविध agro-climatic zones मुळे tropical आणि subtropical fruits ची मोठी basket तयार होते. APEDA fresh fruits आणि vegetables ला महत्त्वाची export category मानते, ज्यात Indian grapes, pomegranates, mangoes, bananas आणि citrus fruits ला domestic व international demand आहे. GreenWings ही category fresh, naturally ripened आणि quality-graded फळ पिकांसाठी वापरते.",
            },
        },
    },
    {
        "id": 2,
        "name": "Grains & Cereals",
        "slug": "grains",
        "description": "Grains and cereals cover staple crops such as rice, wheat and maize, along with related bulk field crops that support food security and processing markets.",
        "info": "Cereals remain the foundation of India's food security and a major agricultural trade segment. Rice, wheat and maize are key crops for household consumption, milling, food processing, animal feed and institutional procurement. GreenWings uses this category for staple grains and cereal-linked field crops where quality parameters such as purity, moisture, grain size and end-use performance matter for buyers.",
        "source_urls": "https://apeda.gov.in/OtherCereals;https://apeda.gov.in/MilledProducts",
        "translations": {
            "hi": {
                "name": "अनाज और धान्य",
                "description": "अनाज और धान्य category में rice, wheat, maize जैसे staple crops और food security तथा processing markets को support करने वाली field crops शामिल हैं.",
                "info": "Cereals भारत की food security का आधार और agricultural trade का प्रमुख segment हैं. Rice, wheat और maize household consumption, milling, food processing, animal feed और institutional procurement के लिए महत्वपूर्ण हैं. GreenWings इस category का उपयोग purity, moisture, grain size और end-use performance जैसे buyer parameters के लिए करता है.",
            },
            "mr": {
                "name": "धान्य आणि कडधान्य नसलेली अन्नधान्ये",
                "description": "Grains & Cereals category मध्ये rice, wheat, maize सारखी staple crops आणि food security व processing markets ला support करणारी field crops समाविष्ट आहेत.",
                "info": "Cereals भारताच्या food security चा पाया आणि agricultural trade चा मोठा segment आहेत. Rice, wheat आणि maize household consumption, milling, food processing, animal feed आणि institutional procurement साठी महत्त्वाचे आहेत. GreenWings ही category purity, moisture, grain size आणि end-use performance अशा buyer parameters साठी वापरते.",
            },
        },
    },
    {
        "id": 3,
        "name": "Millets",
        "slug": "millets",
        "description": "Millets include climate-resilient crops such as jowar, bajra, ragi, barnyard millet, kodo millet, little millet and proso millet.",
        "info": "Millets are traditional nutri-cereals valued for resilience under dryland farming, lower water needs and strong nutrition positioning. Indian millet promotion has increased demand across health-food, school nutrition, ready-to-cook and export-oriented specialty channels. GreenWings groups jowar, bajra, ragi and small millets here so farmers and buyers can treat them as a dedicated climate-smart category rather than mixing them into generic grains.",
        "source_urls": "https://apeda.gov.in/milletportal/",
        "translations": {
            "hi": {
                "name": "मोटे अनाज",
                "description": "Millets में ज्वार, बाजरा, रागी, barnyard millet, kodo millet, little millet और proso millet जैसे climate-resilient crops शामिल हैं.",
                "info": "Millets traditional nutri-cereals हैं जिन्हें dryland farming में resilience, कम water requirement और nutrition value के लिए महत्व दिया जाता है. Health-food, school nutrition, ready-to-cook और specialty export channels में demand बढ़ रही है. GreenWings ज्वार, बाजरा, रागी और small millets को अलग climate-smart category के रूप में रखता है.",
            },
            "mr": {
                "name": "मिलेट्स / भरड धान्य",
                "description": "Millets मध्ये ज्वारी, बाजरी, नाचणी, barnyard millet, kodo millet, little millet आणि proso millet यांसारखी climate-resilient पिके येतात.",
                "info": "Millets हे traditional nutri-cereals असून dryland farming मधील resilience, कमी पाण्याची गरज आणि nutrition value यासाठी महत्त्वाचे आहेत. Health-food, school nutrition, ready-to-cook आणि specialty export channels मध्ये demand वाढत आहे. GreenWings ज्वारी, बाजरी, नाचणी आणि small millets ला स्वतंत्र climate-smart category म्हणून ठेवते.",
            },
        },
    },
    {
        "id": 4,
        "name": "Pulses & Lentils",
        "slug": "pulses",
        "description": "Pulses and lentils cover protein-rich crops such as chickpea, pigeon pea, black gram and lentil.",
        "info": "Pulses are central to Indian diets as plant-protein staples and are widely used as whole pulses, split dal, flour, sprouts and processed ingredients. The category requires careful cleaning, grading, moisture control and variety-level identity because cooking quality, dal recovery and market price differ by crop and type. GreenWings uses this category for chickpea, tur, urad, masoor and related farmer-producer pulse crops.",
        "source_urls": "https://apeda.gov.in/Pulses",
        "translations": {
            "hi": {
                "name": "दालें और लेंटिल्स",
                "description": "Pulses & Lentils में chickpea, pigeon pea, black gram और lentil जैसी protein-rich crops शामिल हैं.",
                "info": "Pulses भारतीय आहार में plant-protein staples हैं और whole pulses, split dal, flour, sprouts तथा processed ingredients के रूप में उपयोग होते हैं. इस category में cleaning, grading, moisture control और variety identity महत्वपूर्ण है क्योंकि cooking quality, dal recovery और market price crop और type के अनुसार बदलते हैं.",
            },
            "mr": {
                "name": "कडधान्ये आणि डाळी",
                "description": "Pulses & Lentils मध्ये chickpea, pigeon pea, black gram आणि lentil सारखी protein-rich पिके येतात.",
                "info": "Pulses भारतीय आहारातील plant-protein staples आहेत आणि whole pulses, split dal, flour, sprouts व processed ingredients म्हणून वापरले जातात. या category मध्ये cleaning, grading, moisture control आणि variety identity महत्त्वाची आहे, कारण cooking quality, dal recovery आणि market price crop व type नुसार बदलतात.",
            },
        },
    },
    {
        "id": 5,
        "name": "Fresh Vegetables",
        "slug": "vegetables",
        "description": "Fresh vegetables cover onion, tomato, chilli, garlic, ginger, turmeric, coriander, fenugreek and other market-facing vegetable crops.",
        "info": "Fresh vegetables need fast aggregation, grading, packaging and route planning because quality changes quickly after harvest. India's vegetable basket supports daily retail demand, food service, processing and selected export channels. GreenWings uses this category for perishable vegetable and spice-vegetable crops where freshness, size grading, residue discipline and reliable dispatch timing are critical.",
        "source_urls": "https://apeda.gov.in/FreshFruitsAndVegetables",
        "translations": {
            "hi": {
                "name": "ताजी सब्जियां",
                "description": "Fresh Vegetables में onion, tomato, chilli, garlic, ginger, turmeric, coriander, fenugreek और अन्य market-facing vegetable crops शामिल हैं.",
                "info": "Fresh vegetables में harvest के बाद quality जल्दी बदलती है, इसलिए fast aggregation, grading, packaging और route planning जरूरी है. India's vegetable basket daily retail demand, food service, processing और selected export channels को support करती है. GreenWings इस category का उपयोग freshness, size grading, residue discipline और dispatch timing के लिए करता है.",
            },
            "mr": {
                "name": "ताज्या भाज्या",
                "description": "Fresh Vegetables मध्ये onion, tomato, chilli, garlic, ginger, turmeric, coriander, fenugreek आणि इतर market-facing vegetable crops येतात.",
                "info": "Fresh vegetables मध्ये harvest नंतर quality लवकर बदलते, त्यामुळे fast aggregation, grading, packaging आणि route planning आवश्यक असते. India's vegetable basket daily retail demand, food service, processing आणि selected export channels ला support करते. GreenWings ही category freshness, size grading, residue discipline आणि dispatch timing साठी वापरते.",
            },
        },
    },
    {
        "id": 6,
        "name": "Oil Seeds",
        "slug": "oilseeds",
        "description": "Oil seeds include groundnut, sesame, soybean and sunflower crops used by edible oil, food, feed and processing industries.",
        "info": "Oil seeds are important for edible oils, protein-rich meal, food ingredients, feed and industrial applications. Groundnut, sesame, soybean and sunflower require moisture control, aflatoxin awareness where relevant, clean grading and buyer-specific quality parameters. GreenWings uses this category to connect oilseed farmers with processors, bulk buyers and export-oriented value chains.",
        "source_urls": "https://www.iopepc.org/;https://apeda.gov.in/GroundNuts",
        "translations": {
            "hi": {
                "name": "तिलहन",
                "description": "Oil Seeds में groundnut, sesame, soybean और sunflower जैसी crops शामिल हैं जिनका उपयोग edible oil, food, feed और processing industries में होता है.",
                "info": "Oil seeds edible oils, protein-rich meal, food ingredients, feed और industrial applications के लिए महत्वपूर्ण हैं. Groundnut, sesame, soybean और sunflower में moisture control, relevant aflatoxin awareness, clean grading और buyer-specific quality parameters जरूरी होते हैं. GreenWings इस category से oilseed farmers को processors, bulk buyers और export-oriented value chains से जोड़ता है.",
            },
            "mr": {
                "name": "तेलबिया",
                "description": "Oil Seeds मध्ये groundnut, sesame, soybean आणि sunflower पिके येतात, जी edible oil, food, feed आणि processing industries मध्ये वापरली जातात.",
                "info": "Oil seeds edible oils, protein-rich meal, food ingredients, feed आणि industrial applications साठी महत्त्वाचे आहेत. Groundnut, sesame, soybean आणि sunflower मध्ये moisture control, relevant aflatoxin awareness, clean grading आणि buyer-specific quality parameters आवश्यक असतात. GreenWings या category मधून oilseed farmers ना processors, bulk buyers आणि export-oriented value chains शी जोडते.",
            },
        },
    },
]

CROP_TO_CATEGORY = {
    "Amla": 1,
    "Banana": 1,
    "Ber": 1,
    "Coconut": 1,
    "Custard Apple": 1,
    "Fig": 1,
    "Grapes": 1,
    "Guava": 1,
    "Jackfruit": 1,
    "Lemon": 1,
    "Mango": 1,
    "Muskmelon": 1,
    "Orange": 1,
    "Papaya": 1,
    "Pomegranate": 1,
    "Sapota": 1,
    "Strawberry": 1,
    "Sweet Lime": 1,
    "Tamarind": 1,
    "Watermelon": 1,
    "Rice": 2,
    "Wheat": 2,
    "Maize": 2,
    "Sugarcane": 2,
    "Bajra": 3,
    "Barnyard Millet": 3,
    "Jowar": 3,
    "Kodo Millet": 3,
    "Little Millet": 3,
    "Proso Millet": 3,
    "Ragi": 3,
    "Chickpea": 4,
    "Masoor (Lentil)": 4,
    "Tur (Pigeon Pea)": 4,
    "Urad (Black Gram)": 4,
    "Chilli": 5,
    "Coriander": 5,
    "Fenugreek": 5,
    "Garlic": 5,
    "Ginger": 5,
    "Onion": 5,
    "Tomato": 5,
    "Turmeric": 5,
    "Groundnut": 6,
    "Sesame": 6,
    "Soybean": 6,
    "Sunflower": 6,
}


def backup_database() -> Path:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    backup_path = BACKUP_DIR / f"greenwings-before-normalized-crop-categories-{datetime.now().strftime('%Y%m%d-%H%M%S')}.db"
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
    if name not in columns(connection, table):
        connection.execute(f"ALTER TABLE {table} ADD COLUMN {name} {definition}")


def ensure_schema(connection: sqlite3.Connection) -> None:
    for name, definition in {
        "slug": "TEXT",
        "info": "TEXT",
        "source_urls": "TEXT",
        "display_order": "INTEGER NOT NULL DEFAULT 0",
        "status": "TEXT NOT NULL DEFAULT 'active'",
        "image_link": "TEXT",
    }.items():
        add_column(connection, "crop_category", name, definition)

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS crop_category_translations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER NOT NULL,
            language TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            info TEXT,
            image_link TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(category_id, language),
            FOREIGN KEY (category_id) REFERENCES crop_category(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
        """
    )
    connection.execute("CREATE INDEX IF NOT EXISTS idx_crop_category_translations_language ON crop_category_translations(language)")
    connection.execute("CREATE UNIQUE INDEX IF NOT EXISTS uq_crop_category_slug ON crop_category(slug) WHERE slug IS NOT NULL")


def upsert_categories(connection: sqlite3.Connection) -> None:
    for category in CATEGORY_CONTENT:
        connection.execute(
            """
            INSERT INTO crop_category (
                id, name, slug, description, info, icon_url, image_link,
                source_urls, display_order, status, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, COALESCE((SELECT icon_url FROM crop_category WHERE id = ?), ''), COALESCE((SELECT image_link FROM crop_category WHERE id = ?), ''), ?, ?, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                slug = excluded.slug,
                description = excluded.description,
                info = excluded.info,
                source_urls = excluded.source_urls,
                display_order = excluded.display_order,
                status = 'active',
                updated_at = CURRENT_TIMESTAMP
            """,
            (
                category["id"],
                category["name"],
                category["slug"],
                category["description"],
                category["info"],
                category["id"],
                category["id"],
                category["source_urls"],
                category["id"],
            ),
        )
        for language, translation in category["translations"].items():
            connection.execute(
                """
                INSERT INTO crop_category_translations (
                    category_id, language, name, description, info, image_link, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, COALESCE((SELECT image_link FROM crop_category WHERE id = ?), ''), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT(category_id, language) DO UPDATE SET
                    name = excluded.name,
                    description = excluded.description,
                    info = excluded.info,
                    image_link = COALESCE(NULLIF(crop_category_translations.image_link, ''), excluded.image_link),
                    updated_at = CURRENT_TIMESTAMP
                """,
                (
                    category["id"],
                    language,
                    translation["name"],
                    translation["description"],
                    translation["info"],
                    category["id"],
                ),
            )


def update_crop_categories(connection: sqlite3.Connection) -> None:
    categories_by_id = {item["id"]: item for item in CATEGORY_CONTENT}
    for crop_name, category_id in CROP_TO_CATEGORY.items():
        category = categories_by_id[category_id]
        connection.execute(
            """
            UPDATE crop
            SET category_id = ?,
                type = ?,
                category = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE common_name = ?
            """,
            (category_id, category["slug"], category["name"], crop_name),
        )
        for language, translation in category["translations"].items():
            connection.execute(
                """
                UPDATE crop_translations
                SET display_type = ?,
                    category = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE crop_id IN (SELECT id FROM crop WHERE common_name = ?)
                  AND language = ?
                """,
                (translation["name"], translation["name"], crop_name, language),
            )

    uncategorized = connection.execute(
        """
        SELECT common_name
        FROM crop
        WHERE category_id NOT IN (1, 2, 3, 4, 5, 6)
           OR category_id IS NULL
        ORDER BY common_name
        """
    ).fetchall()
    if uncategorized:
        names = ", ".join(row["common_name"] for row in uncategorized)
        raise SystemExit(f"Uncategorized crops remain: {names}")


def ensure_category_variety_view(connection: sqlite3.Connection) -> None:
    connection.execute("DROP VIEW IF EXISTS crop_category_variety_view")
    connection.execute(
        """
        CREATE VIEW crop_category_variety_view AS
        SELECT
            cc.id AS category_id,
            cc.name AS category_name,
            cc.slug AS category_slug,
            c.id AS crop_id,
            c.common_name AS crop_name,
            cv.id AS crop_variety_id,
            cv.variety_name,
            cv.subtype_id,
            cv.region_of_origin,
            cv.image_link AS variety_image_link
        FROM crop_category cc
        JOIN crop c ON c.category_id = cc.id
        LEFT JOIN crop_variety cv ON cv.crop_id = c.id
        """
    )


def verify(connection: sqlite3.Connection) -> dict[str, object]:
    return {
        "categories": [dict(row) for row in connection.execute("SELECT id, name, slug FROM crop_category WHERE id BETWEEN 1 AND 6 ORDER BY id")],
        "crop_counts": [
            dict(row)
            for row in connection.execute(
                """
                SELECT cc.name, COUNT(c.id) AS crops
                FROM crop_category cc
                LEFT JOIN crop c ON c.category_id = cc.id
                WHERE cc.id BETWEEN 1 AND 6
                GROUP BY cc.id, cc.name
                ORDER BY cc.id
                """
            )
        ],
        "variety_counts": [
            dict(row)
            for row in connection.execute(
                """
                SELECT cc.name, COUNT(cv.id) AS varieties
                FROM crop_category cc
                LEFT JOIN crop c ON c.category_id = cc.id
                LEFT JOIN crop_variety cv ON cv.crop_id = c.id
                WHERE cc.id BETWEEN 1 AND 6
                GROUP BY cc.id, cc.name
                ORDER BY cc.id
                """
            )
        ],
        "translation_counts": dict(
            connection.execute(
                """
                SELECT language, COUNT(*)
                FROM crop_category_translations
                GROUP BY language
                ORDER BY language
                """
            ).fetchall()
        ),
    }


def main() -> None:
    if not DB_PATH.exists():
        raise SystemExit(f"Database not found: {DB_PATH}")
    backup_path = backup_database()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = OFF")
        ensure_schema(connection)
        upsert_categories(connection)
        update_crop_categories(connection)
        ensure_category_variety_view(connection)
        connection.commit()
        connection.execute("PRAGMA foreign_keys = ON")
        summary = verify(connection)
    print(f"Backup: {backup_path}")
    print(summary)


if __name__ == "__main__":
    main()
