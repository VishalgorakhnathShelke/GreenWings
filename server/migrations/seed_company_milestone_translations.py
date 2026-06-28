from __future__ import annotations

import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DB_PATH = ROOT / "database" / "greenwings.db"

MILESTONE_TRANSLATIONS = [
    {
        "source_title": "Company Formation",
        "hi": {
            "title": "कंपनी गठन",
            "description": "ग्रीनविंग्स को किसानों को साझा विकास के लिए संगठित करने वाली किसान उत्पादक कंपनी के रूप में औपचारिक रूप से स्थापित किया गया.",
        },
        "mr": {
            "title": "कंपनी स्थापना",
            "description": "शेतकऱ्यांना सामूहिक विकासासाठी संघटित करण्यासाठी ग्रीनविंग्सची किसान उत्पादक कंपनी म्हणून औपचारिक स्थापना झाली.",
        },
    },
    {
        "source_title": "Natural Farming Initiative",
        "hi": {
            "title": "प्राकृतिक खेती पहल",
            "description": "कंपनी ने मिट्टी के स्वास्थ्य, प्राकृतिक खेती जागरूकता और जिम्मेदार इनपुट उपयोग को बढ़ावा देना शुरू किया.",
        },
        "mr": {
            "title": "नैसर्गिक शेती उपक्रम",
            "description": "कंपनीने मातीचे आरोग्य, नैसर्गिक शेती जनजागृती आणि जबाबदार इनपुट वापराला प्रोत्साहन देणे सुरू केले.",
        },
    },
    {
        "source_title": "Farmer Growth Milestones",
        "hi": {
            "title": "किसान विकास पड़ाव",
            "description": "गांव बैठकों, प्रशिक्षण कार्यक्रमों और सामूहिक नियोजन के माध्यम से किसानों की भागीदारी बढ़ी.",
        },
        "mr": {
            "title": "शेतकरी वाढीचे टप्पे",
            "description": "गाव बैठका, प्रशिक्षण कार्यक्रम आणि सामूहिक नियोजनाच्या माध्यमातून शेतकऱ्यांचा सहभाग वाढला.",
        },
    },
    {
        "source_title": "Export Expansion Milestones",
        "hi": {
            "title": "निर्यात विस्तार पड़ाव",
            "description": "ग्रीनविंग्स ने गुणवत्ता, ग्रेडिंग और buyer-oriented practices के माध्यम से किसानों को export readiness के लिए तैयार करना शुरू किया.",
        },
        "mr": {
            "title": "निर्यात विस्ताराचे टप्पे",
            "description": "ग्रीनविंग्सने गुणवत्ता, ग्रेडिंग आणि खरेदीदार-केंद्रित पद्धतींद्वारे शेतकऱ्यांना export readiness साठी तयार करणे सुरू केले.",
        },
    },
    {
        "source_title": "Processing and Value Addition Milestones",
        "hi": {
            "title": "प्रोसेसिंग और वैल्यू एडिशन पड़ाव",
            "description": "संस्था ने ग्रेडिंग, पैकेजिंग, प्राथमिक प्रोसेसिंग और value-added products की योजनाओं को आकार देना शुरू किया.",
        },
        "mr": {
            "title": "प्रक्रिया आणि मूल्यवर्धनाचे टप्पे",
            "description": "संस्थेने ग्रेडिंग, पॅकेजिंग, प्राथमिक प्रक्रिया आणि value-added products यांच्या योजनांना आकार देणे सुरू केले.",
        },
    },
]


def main() -> None:
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        for item in MILESTONE_TRANSLATIONS:
            source = connection.execute(
                """
                SELECT year, description, image, displayOrder, impactMetric, status, createdAt, updatedAt
                FROM company_milestones
                WHERE language = 'en' AND title = ?
                LIMIT 1
                """,
                (item["source_title"],),
            ).fetchone()
            if not source:
                continue
            for language in ("hi", "mr"):
                translation = item[language]
                exists = connection.execute(
                    """
                    SELECT 1
                    FROM company_milestones
                    WHERE language = ? AND year = ? AND displayOrder = ? AND title = ?
                    """,
                    (language, source["year"], source["displayOrder"], translation["title"]),
                ).fetchone()
                if exists:
                    continue
                connection.execute(
                    """
                    INSERT INTO company_milestones (
                        year, title, description, image, displayOrder, impactMetric,
                        language, status, createdAt, updatedAt
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    """,
                    (
                        source["year"],
                        translation["title"],
                        translation["description"],
                        source["image"],
                        source["displayOrder"],
                        source["impactMetric"],
                        language,
                        source["status"] or "published",
                    ),
                )
        connection.commit()
        summary = dict(
            connection.execute(
                """
                SELECT language, COUNT(*)
                FROM company_milestones
                GROUP BY language
                ORDER BY language
                """
            ).fetchall()
        )
    print(summary)


if __name__ == "__main__":
    main()
