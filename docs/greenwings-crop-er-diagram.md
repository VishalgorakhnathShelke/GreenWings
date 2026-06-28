# GreenWings Crop Catalogue ER Diagram

This is the normalized product catalogue structure now used by the backend API.

```mermaid
erDiagram
    CROP_CATEGORY ||--o{ CROP_CATEGORY_TRANSLATION : "has translations"
    CROP_CATEGORY ||--o{ CROP : "groups crops"
    CROP ||--o{ CROP_TRANSLATION : "has translations"
    CROP ||--o{ CROP_VARIETY : "has varieties"
    CROP_VARIETY ||--o{ CROP_VARIETY_TRANSLATION : "has translations"

    CROP_CATEGORY {
        int id PK
        string name
        string slug
        text description
        text info
        text image_link
        text source_urls
        int display_order
        string status
    }

    CROP_CATEGORY_TRANSLATION {
        int id PK
        int category_id FK
        string language
        string name
        text description
        text info
        text image_link
    }

    CROP {
        int id PK
        int produce_id
        int category_id FK
        int taxonomy_id FK
        string common_name
        string type
        string category
        string season
        string scientific_name
        text description
        text image_link
        string status
    }

    CROP_TRANSLATION {
        int id PK
        int crop_id FK
        string language
        string display_name
        string display_type
        string category
        string season
        text description
        text notes
        text image_link
    }

    CROP_VARIETY {
        int id PK
        int crop_id FK
        int subtype_id
        string variety_name
        string local_name
        string region_of_origin
        text flavor_profile
        string scientific_name
        text description
        text notes
        text image_link
    }

    CROP_VARIETY_TRANSLATION {
        int id PK
        int crop_variety_id FK
        string language
        string display_name
        string region_of_origin
        text flavor_profile
        text description
        text notes
        text image_link
    }
```

## Category Hierarchy

1. Fresh Fruits
2. Grains & Cereals
3. Millets
4. Pulses & Lentils
5. Fresh Vegetables
6. Oil Seeds

## Query View

The SQLite database also contains `crop_category_variety_view` for quick reporting:

```sql
SELECT category_name, crop_name, variety_name
FROM crop_category_variety_view
ORDER BY category_id, crop_name, variety_name;
```

## Legacy Tables

The old `produce`, `produce_translations`, `subtypes`, and `subtype_translations` tables are retained for now as fallback/source history. The active API reads from the normalized tables above.
