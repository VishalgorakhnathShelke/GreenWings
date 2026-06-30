from __future__ import annotations

import json
import re
import secrets
import time
from datetime import datetime, timezone
from typing import Any

from fastapi import Depends, FastAPI, Header, HTTPException, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import and_, desc, func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import models
from .config import settings
from .database import Base, engine, get_db
from .legacy import legacy
from .schemas import (
    AnalyticsVisit,
    CompanyContentIn,
    CompanyMilestoneIn,
    CompanyStoryIn,
    CompanyTimelineIn,
    EnquiryCreate,
    FertilizerIn,
    HomepageStatisticIn,
    LeadershipMemberIn,
    LoginRequest,
    RegisterRequest,
    SuccessStoryIn,
)

SUPPORTED_LANGUAGES = {"en", "hi", "mr"}
PUBLIC_STATUSES = {"published"}
CATEGORY_ALIASES = {
    "fruit": "fruits",
    "fruits": "fruits",
    "fresh-fruits": "fruits",
    "fresh fruits": "fruits",
    "grain": "grains",
    "grains": "grains",
    "cereal": "grains",
    "cereals": "grains",
    "grains-cereals": "grains",
    "grains & cereals": "grains",
    "millet": "millets",
    "millets": "millets",
    "pulse": "pulses",
    "pulses": "pulses",
    "lentils": "pulses",
    "pulses-lentils": "pulses",
    "pulses & lentils": "pulses",
    "vegetable": "vegetables",
    "vegetables": "vegetables",
    "fresh-vegetables": "vegetables",
    "fresh vegetables": "vegetables",
    "oilseed": "oilseeds",
    "oilseeds": "oilseeds",
    "oil-seeds": "oilseeds",
    "oil seeds": "oilseeds",
}
FERTILIZER_FIELDS = [
    "name",
    "category",
    "manufacturer",
    "countryOfOrigin",
    "description",
    "content",
    "uses",
    "applyOnCrops",
    "doNotApplyOn",
    "applicationMethod",
    "recommendedStage",
    "season",
    "temperatureRange",
    "soilType",
    "benefits",
    "precautions",
    "imageUrl",
    "image_link",
    "status",
    "documentUrl",
]
FERTILIZER_TRANSLATION_FIELDS = [
    "name",
    "category",
    "countryOfOrigin",
    "description",
    "content",
    "uses",
    "applyOnCrops",
    "doNotApplyOn",
    "applicationMethod",
    "recommendedStage",
    "season",
    "temperatureRange",
    "soilType",
    "benefits",
    "precautions",
    "approvalBody",
    "regionalRecommendations",
    "brand",
    "importCertifications",
    "internationalSpecifications",
    "image_link",
]

app = FastAPI(title="GreenWings API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_origin_regex=r"https://.*\.trycloudflare\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={"error": "Validation failed.", "details": exc.errors()},
    )


@app.on_event("startup")
def startup() -> None:
    legacy.ensure_database()
    Base.metadata.create_all(bind=engine)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def clean_language(language: str | None) -> str:
    language = (language or "en").lower()
    return language if language in SUPPORTED_LANGUAGES else "en"


def sortable_year(year: str) -> int:
    match = re.search(r"\d{4}", str(year))
    return int(match.group(0)) if match else 0


def truthy(value: Any) -> int:
    return 1 if value in {True, 1, "1", "true", "active", "yes", "on", "featured"} else 0


def image_url_list(value: str | None) -> list[str]:
    if not value:
        return []
    text = str(value).strip()
    if not text:
        return []
    try:
        parsed = json.loads(text)
        if isinstance(parsed, list):
            return [str(item) for item in parsed if str(item).strip()]
        if isinstance(parsed, str) and parsed.strip():
            return [parsed.strip()]
    except json.JSONDecodeError:
        pass
    return [part.strip() for part in re.split(r"[\n,;]+", text) if part.strip()]


def current_user(authorization: str = Header(default="")) -> dict | None:
    if not authorization.startswith("Bearer "):
        return None
    return legacy.decode_token(authorization.removeprefix("Bearer ").strip())


def require_login(user: dict | None = Depends(current_user)) -> dict:
    if not user:
        raise HTTPException(status_code=401, detail="Login required.")
    return user


def require_admin(user: dict | None = Depends(current_user)) -> dict:
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


def to_user(row: models.User) -> dict:
    role = "admin" if str(row.role).lower() == "admin" else "member"
    return {
        "id": row.id,
        "firstName": row.firstName,
        "lastName": row.lastName,
        "name": f"{row.firstName} {row.lastName}".strip(),
        "mobileNumber": row.mobileNumber,
        "email": row.email,
        "interest": row.interest,
        "enquiryQuestion": row.enquiryQuestion,
        "address": row.address,
        "state": row.state,
        "country": row.country,
        "role": role,
        "emailVerified": bool(row.emailVerified),
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt,
    }


def to_enquiry(row: models.Enquiry) -> dict:
    return {
        "id": row.id,
        "enquiryId": row.enquiryId,
        "userId": row.userId,
        "subject": row.subject,
        "category": row.category,
        "description": row.description,
        "priority": row.priority,
        "status": row.status,
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt,
    }


def to_subtype(row: models.Subtype, language: str) -> dict:
    image_link = getattr(row, "image_link", "") or ""
    item = {
        "subtype_id": row.subtype_id,
        "produce_id": row.produce_id,
        "subtype_name": row.subtype_name,
        "variety_id": row.subtype_id,
        "variety_name": row.subtype_name,
        "display_name": row.subtype_name,
        "language": language,
        "origin_state": row.origin_state,
        "taste_profile": row.taste_profile,
        "scientific_name": row.scientific_name,
        "marathi_name": row.marathi_name,
        "description": row.description,
        "localized_description": row.description,
        "info": row.info,
        "localized_info": row.info,
        "image_link": image_link,
        "imageLink": image_link,
        "image_url": image_link,
    }
    if language != "en":
        translation = next((entry for entry in row.translations if entry.language == language), None)
        if translation:
            item.update(
                {
                    "display_name": translation.display_name,
                    "localized_origin_state": translation.origin_state,
                    "localized_taste_profile": translation.taste_profile,
                    "localized_description": translation.description,
                    "localized_info": translation.info,
                }
            )
    return item


def to_product(row: models.Produce, language: str) -> dict:
    image_link = getattr(row, "image_link", "") or ""
    item = {
        "produce_id": row.produce_id,
        "crop_id": row.produce_id,
        "type": row.type,
        "display_type": row.type,
        "name": row.name,
        "display_name": row.name,
        "language": language,
        "scientific_name": row.scientific_name,
        "category": row.category,
        "season": row.season,
        "marathi_name": row.marathi_name,
        "hindi_name": row.hindi_name,
        "english_name": row.english_name,
        "description": row.description,
        "localized_description": row.description,
        "info": row.info,
        "localized_info": row.info,
        "image_link": image_link,
        "imageLink": image_link,
        "image_url": image_link,
        "subtypes": [to_subtype(subtype, language) for subtype in sorted(row.subtypes, key=lambda value: value.subtype_name)],
    }
    if language != "en":
        translation = next((entry for entry in row.translations if entry.language == language), None)
        if translation:
            item.update(
                {
                    "display_name": translation.display_name,
                    "display_type": translation.display_type,
                    "localized_category": translation.category,
                    "localized_season": translation.season,
                    "localized_description": translation.description,
                    "localized_info": translation.info,
                }
            )
    return item


def translation_for(entries: list[Any], language: str) -> Any | None:
    if language == "en":
        return None
    return next((entry for entry in entries if entry.language == language), None)


def normalize_category_filter(value: str) -> str:
    normalized = value.strip().lower().replace("_", "-")
    return CATEGORY_ALIASES.get(normalized, normalized)


def category_translation(row: models.CropCategory | None, language: str):
    if not row or language == "en":
        return None
    return next((entry for entry in row.translations if entry.language == language), None)


def to_crop_category(row: models.CropCategory, language: str = "en") -> dict:
    translation = category_translation(row, language)
    return {
        "id": row.id,
        "name": row.name,
        "displayName": translation.name if translation and translation.name else row.name,
        "slug": row.slug or "",
        "description": row.description or "",
        "localizedDescription": translation.description if translation and translation.description else (row.description or ""),
        "info": row.info or "",
        "localizedInfo": translation.info if translation and translation.info else (row.info or ""),
        "image_link": (translation.image_link if translation and translation.image_link else row.image_link) or "",
        "imageLink": (translation.image_link if translation and translation.image_link else row.image_link) or "",
        "sourceUrls": row.source_urls or "",
        "displayOrder": row.display_order,
        "status": row.status,
        "language": language,
    }


def to_crop_variety(row: models.CropVariety, language: str) -> dict:
    translation = translation_for(row.translations, language)
    image_urls = image_url_list(row.image_url)
    display_name = translation.display_name if translation and translation.display_name else row.variety_name
    origin = translation.region_of_origin if translation and translation.region_of_origin else row.region_of_origin
    taste = translation.flavor_profile if translation and translation.flavor_profile else row.flavor_profile
    description = translation.description if translation and translation.description else row.description
    notes = translation.notes if translation and translation.notes else row.notes
    image_link = (
        (translation.image_link if translation and translation.image_link else "")
        or row.image_link
        or (image_urls[0] if image_urls else "")
        or ""
    )
    return {
        "subtype_id": row.subtype_id or row.id,
        "variety_id": row.id,
        "produce_id": row.crop.produce_id or row.crop_id,
        "crop_id": row.crop_id,
        "subtype_name": row.variety_name,
        "variety_name": row.variety_name,
        "display_name": display_name,
        "language": language,
        "origin_state": row.region_of_origin,
        "localized_origin_state": origin,
        "taste_profile": row.flavor_profile,
        "localized_taste_profile": taste,
        "scientific_name": row.scientific_name,
        "marathi_name": row.marathi_name,
        "description": row.description,
        "localized_description": description,
        "info": row.notes or row.description or "",
        "localized_info": notes or description or "",
        "image_link": image_link,
        "imageLink": image_link,
        "image_url": row.image_url or image_link,
        "image_urls": image_urls,
    }


def to_crop_product(row: models.Crop, language: str) -> dict:
    translation = translation_for(row.translations, language)
    crop_image_urls = image_url_list(row.image_url)
    category_row = row.category_group
    category_payload = to_crop_category(category_row, language) if category_row else None
    display_name = translation.display_name if translation and translation.display_name else row.common_name
    display_type = category_payload["displayName"] if category_payload else (translation.display_type if translation and translation.display_type else row.type)
    category = category_payload["displayName"] if category_payload else (translation.category if translation and translation.category else row.category)
    season = translation.season if translation and translation.season else row.season
    description = translation.description if translation and translation.description else row.description
    notes = translation.notes if translation and translation.notes else row.notes
    image_link = (
        (translation.image_link if translation and translation.image_link else "")
        or row.image_link
        or (crop_image_urls[0] if crop_image_urls else "")
        or ""
    )
    return {
        "produce_id": row.produce_id or row.id,
        "crop_id": row.id,
        "category_id": row.category_id,
        "type": category_payload["slug"] if category_payload else row.type,
        "display_type": display_type,
        "category_group": category_payload["name"] if category_payload else (row.category or ""),
        "localized_category_group": category_payload["displayName"] if category_payload else category,
        "category_slug": category_payload["slug"] if category_payload else (row.type or ""),
        "category_info": category_payload["info"] if category_payload else "",
        "localized_category_info": category_payload["localizedInfo"] if category_payload else "",
        "name": row.common_name,
        "display_name": display_name,
        "language": language,
        "scientific_name": row.scientific_name,
        "category": row.category,
        "localized_category": category,
        "season": row.season,
        "localized_season": season,
        "marathi_name": row.marathi_name,
        "hindi_name": row.hindi_name,
        "english_name": row.english_name,
        "description": row.description,
        "localized_description": description,
        "info": row.notes or row.description or "",
        "localized_info": notes or description or "",
        "image_link": image_link,
        "imageLink": image_link,
        "image_url": row.image_url or image_link,
        "image_urls": crop_image_urls,
        "subtypes": [to_crop_variety(variety, language) for variety in sorted(row.varieties, key=lambda value: value.variety_name)],
    }


def fertilizer_classes(kind: str):
    if kind == "local":
        return models.Fertilizer, models.FertilizerTranslation, ["approvalBody", "regionalRecommendations"]
    if kind == "imported":
        return models.Fertilizer, models.FertilizerTranslation, [
            "brand",
            "importCertifications",
            "internationalSpecifications",
        ]
    raise HTTPException(status_code=400, detail="Invalid fertilizer kind.")


def to_fertilizer(row: Any, kind: str, language: str = "en", translation: Any | None = None) -> dict:
    fields = FERTILIZER_FIELDS + (
        ["approvalBody", "regionalRecommendations"]
        if kind == "local"
        else ["brand", "importCertifications", "internationalSpecifications"]
    )
    item = {field: getattr(row, field, "") or "" for field in fields}
    item["id"] = row.id
    item["createdAt"] = row.createdAt
    item["updatedAt"] = row.updatedAt
    item["kind"] = kind
    item["language"] = language
    if translation:
        for field in FERTILIZER_TRANSLATION_FIELDS:
            if field in item and getattr(translation, field, None):
                item[field] = getattr(translation, field)
    item["image_link"] = item.get("image_link") or item.get("imageUrl") or ""
    item["imageLink"] = item["image_link"]
    item["imageUrl"] = item.get("imageUrl") or item["image_link"]
    item["displayName"] = item["name"]
    item["displayCategory"] = item["category"]
    item["localizedDescription"] = item["description"]
    item["localizedContent"] = item["content"]
    item["localizedUses"] = item["uses"]
    item["localizedBenefits"] = item["benefits"]
    item["localizedPrecautions"] = item["precautions"]
    return item


def to_company_story(row: models.CompanyStory) -> dict:
    return {
        "id": row.id,
        "title": row.title,
        "slug": row.slug,
        "language": row.language,
        "content": row.content,
        "featuredImage": row.featuredImage or "",
        "displayOrder": row.displayOrder,
        "status": row.status,
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt,
    }


def to_company_content(row: models.CompanyContent) -> dict:
    return {
        "id": row.id,
        "sectionKey": row.sectionKey,
        "title": row.title,
        "subtitle": row.subtitle or "",
        "content": row.content,
        "language": row.language,
        "displayOrder": row.displayOrder,
        "status": row.status,
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt,
    }


def milestone_translation(row: models.CompanyMilestone, language: str):
    if language == "en" or getattr(row, "language", "en") != "en":
        return None
    return next((entry for entry in row.translations if entry.language == language), None)


def to_milestone(row: models.CompanyMilestone, language: str = "en", include_translations: bool = False) -> dict:
    translation = milestone_translation(row, language)
    item = {
        "id": row.id,
        "year": row.year,
        "title": translation.title if translation and translation.title else row.title,
        "description": translation.description if translation and translation.description else row.description,
        "impactMetric": (
            translation.impactMetric
            if translation and getattr(translation, "impactMetric", None)
            else (getattr(row, "impactMetric", "") or "")
        ),
        "baseTitle": row.title,
        "baseDescription": row.description,
        "image": row.image or "",
        "language": getattr(row, "language", "en") or "en",
        "status": getattr(row, "status", "published") or "published",
        "displayOrder": row.displayOrder,
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt,
    }
    if include_translations:
        item["translations"] = {
            entry.language: {
                "title": entry.title or "",
                "description": entry.description or "",
                "impactMetric": getattr(entry, "impactMetric", "") or "",
            }
            for entry in row.translations
        }
    return item


def to_timeline_from_milestone(row: models.CompanyMilestone) -> dict:
    return {
        "id": row.id,
        "year": row.year,
        "title": row.title,
        "description": row.description,
        "impactMetric": row.impactMetric or "",
        "language": row.language or "en",
        "displayOrder": row.displayOrder,
        "status": row.status or "published",
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt,
    }


def to_timeline(row: models.CompanyTimeline) -> dict:
    return {
        "id": row.id,
        "year": row.year,
        "title": row.title,
        "description": row.description,
        "impactMetric": row.impactMetric or "",
        "language": row.language,
        "displayOrder": row.displayOrder,
        "status": row.status,
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt,
    }


def to_statistic(row: models.HomepageStatistic) -> dict:
    return {
        "id": row.id,
        "label": row.label,
        "value": row.value,
        "description": row.description or "",
        "displayOrder": row.displayOrder,
        "active": bool(row.active),
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt,
    }


def leadership_translation(row: models.LeadershipMember, language: str):
    return next((entry for entry in row.translations if entry.language == language), None) if language != "en" else None


def to_leadership(row: models.LeadershipMember, language: str = "en", include_translations: bool = False) -> dict:
    translation = leadership_translation(row, language)
    image_url = row.imageUrl or row.image or ""
    localized_bio = translation.biography if translation and translation.biography else row.biography
    localized_role = localized_bio if translation and translation.biography else (row.roleDescription or "")
    item = {
        "id": row.id,
        "fullName": row.fullName,
        "designation": translation.designation if translation and translation.designation else row.designation,
        "roleDescription": localized_role,
        "biography": localized_bio,
        "baseDesignation": row.designation,
        "baseRoleDescription": row.roleDescription or "",
        "baseBiography": row.biography,
        "image": image_url,
        "imageUrl": image_url,
        "language": row.language or "en",
        "displayOrder": row.displayOrder,
        "active": bool(row.active),
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt,
    }
    if include_translations:
        item["translations"] = {
            entry.language: {"designation": entry.designation or "", "biography": entry.biography or ""}
            for entry in row.translations
        }
    return item


def to_story_media(row: models.SuccessStoryMedia) -> dict:
    return {
        "id": row.id,
        "successStoryId": row.successStoryId,
        "mediaType": row.mediaType,
        "mediaUrl": row.mediaUrl,
        "caption": row.caption or "",
        "displayOrder": row.displayOrder,
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt,
    }


def to_success_story(row: models.SuccessStory, media: list[models.SuccessStoryMedia] | None = None) -> dict:
    media_rows = media if media is not None else row.media
    return {
        "id": row.id,
        "farmerName": row.farmerName,
        "farmerPhone": row.farmerPhone or "",
        "title": row.title,
        "slug": row.slug,
        "location": row.location or "",
        "village": row.village or "",
        "district": row.district or "",
        "cropType": row.cropType or "",
        "landArea": row.landArea or "",
        "storyCategory": row.storyCategory or "",
        "shortQuote": row.shortQuote or "",
        "shortSummary": row.shortSummary or "",
        "fullStory": row.fullStory,
        "challenge": row.challenge or "",
        "solution": row.solution or "",
        "result": row.result or "",
        "yieldBefore": row.yieldBefore or "",
        "yieldAfter": row.yieldAfter or "",
        "priceBenefit": row.priceBenefit or "",
        "additionalIncome": row.additionalIncome or "",
        "fertilizerUsed": row.fertilizerUsed or "",
        "seedUsed": row.seedUsed or "",
        "marketSupport": row.marketSupport or "",
        "profileImage": row.profileImage or "",
        "coverImage": row.coverImage or "",
        "language": row.language,
        "displayOrder": row.displayOrder,
        "featured": bool(row.featured),
        "status": row.status,
        "media": [to_story_media(item) for item in sorted(media_rows, key=lambda value: (value.displayOrder, value.id))],
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt,
    }


def public_story_collection(db: Session, language: str) -> list[dict]:
    rows = (
        db.query(models.CompanyStory)
        .filter(models.CompanyStory.status == "published", models.CompanyStory.language.in_(["en", language]))
        .order_by(models.CompanyStory.displayOrder, models.CompanyStory.title)
        .all()
    )
    by_slug: dict[str, models.CompanyStory] = {}
    for row in rows:
        current = by_slug.get(row.slug)
        if not current or row.language == language:
            by_slug[row.slug] = row
    return sorted((to_company_story(row) for row in by_slug.values()), key=lambda item: (item["displayOrder"], item["title"]))


def public_content_collection(db: Session, language: str) -> list[dict]:
    rows = (
        db.query(models.CompanyContent)
        .filter(models.CompanyContent.status == "published", models.CompanyContent.language.in_(["en", language]))
        .order_by(models.CompanyContent.displayOrder, models.CompanyContent.title)
        .all()
    )
    by_key: dict[str, models.CompanyContent] = {}
    for row in rows:
        current = by_key.get(row.sectionKey)
        if not current or row.language == language:
            by_key[row.sectionKey] = row
    return sorted((to_company_content(row) for row in by_key.values()), key=lambda item: (item["displayOrder"], item["title"]))


def public_timeline_collection(db: Session, language: str) -> list[dict]:
    requested_language = language if language != "en" else "en"
    rows = (
        db.query(models.CompanyMilestone)
        .filter(models.CompanyMilestone.status == "published", models.CompanyMilestone.language == requested_language)
        .order_by(desc(models.CompanyMilestone.year), desc(models.CompanyMilestone.displayOrder))
        .all()
    )
    if not rows and requested_language != "en":
        rows = (
            db.query(models.CompanyMilestone)
            .filter(models.CompanyMilestone.status == "published", models.CompanyMilestone.language == "en")
            .order_by(desc(models.CompanyMilestone.year), desc(models.CompanyMilestone.displayOrder))
            .all()
        )
    return sorted(
        (to_timeline_from_milestone(row) for row in rows),
        key=lambda item: (sortable_year(item["year"]), item["displayOrder"], item["title"]),
        reverse=True,
    )


def public_milestone_collection(db: Session, language: str) -> list[dict]:
    requested_language = language if language != "en" else "en"
    rows = (
        db.query(models.CompanyMilestone)
        .filter(models.CompanyMilestone.status == "published", models.CompanyMilestone.language == requested_language)
        .order_by(desc(models.CompanyMilestone.year), desc(models.CompanyMilestone.displayOrder))
        .all()
    )
    if not rows and requested_language != "en":
        rows = (
            db.query(models.CompanyMilestone)
            .filter(models.CompanyMilestone.status == "published", models.CompanyMilestone.language == "en")
            .order_by(desc(models.CompanyMilestone.year), desc(models.CompanyMilestone.displayOrder))
            .all()
        )
    return sorted(
        (to_milestone(row, language) for row in rows),
        key=lambda item: (sortable_year(item["year"]), item["displayOrder"], item["title"]),
        reverse=True,
    )


def public_statistics(db: Session) -> list[dict]:
    rows = (
        db.query(models.HomepageStatistic)
        .filter(models.HomepageStatistic.active == 1)
        .order_by(models.HomepageStatistic.displayOrder, models.HomepageStatistic.label)
        .all()
    )
    return [to_statistic(row) for row in rows]


def public_leadership(db: Session, language: str) -> list[dict]:
    rows = (
        db.query(models.LeadershipMember)
        .filter(models.LeadershipMember.active == 1)
        .order_by(models.LeadershipMember.displayOrder, models.LeadershipMember.fullName)
        .all()
    )
    return [to_leadership(row, language) for row in rows]


def public_success_stories(db: Session, language: str) -> list[dict]:
    rows = (
        db.query(models.SuccessStory)
        .filter(models.SuccessStory.status == "published", models.SuccessStory.language.in_(["en", language]))
        .order_by(models.SuccessStory.displayOrder, desc(models.SuccessStory.featured), models.SuccessStory.farmerName)
        .all()
    )
    by_slug: dict[str, models.SuccessStory] = {}
    for row in rows:
        current = by_slug.get(row.slug)
        if not current or row.language == language:
            by_slug[row.slug] = row
    stories: list[dict] = []
    for row in by_slug.values():
        media = row.media
        if not media and row.language != "en":
            english = (
                db.query(models.SuccessStory)
                .filter(models.SuccessStory.slug == row.slug, models.SuccessStory.language == "en")
                .first()
            )
            if english:
                media = english.media
        stories.append(to_success_story(row, media))
    return sorted(stories, key=lambda item: (item["displayOrder"], item["farmerName"]))


def generate_enquiry_id(db: Session) -> str:
    year = datetime.now(timezone.utc).year
    for _ in range(10):
        candidate = f"GW-{year}-{secrets.randbelow(900000) + 100000}"
        exists = db.query(models.Enquiry).filter(models.Enquiry.enquiryId == candidate).first()
        if not exists:
            return candidate
    return f"GW-{year}-{int(time.time())}"


def insert_story_media(db: Session, story_id: int, media_items: list | None, timestamp: str) -> None:
    for index, media in enumerate(media_items or []):
        db.add(
            models.SuccessStoryMedia(
                successStoryId=story_id,
                mediaType=media.mediaType or "image",
                mediaUrl=media.mediaUrl,
                caption=media.caption or "",
                displayOrder=media.displayOrder or index + 1,
                createdAt=timestamp,
                updatedAt=timestamp,
            )
        )


def upsert_milestone_translations(db: Session, milestone_id: int, translations: dict[str, dict[str, str]], timestamp: str) -> None:
    for language, values in (translations or {}).items():
        if language not in {"hi", "mr"} or not isinstance(values, dict):
            continue
        title = str(values.get("title", "")).strip()
        description = str(values.get("description", "")).strip()
        impact_metric = str(values.get("impactMetric", "") or values.get("impact_metric", "")).strip()
        if not title and not description and not impact_metric:
            continue
        row = (
            db.query(models.CompanyMilestoneTranslation)
            .filter(
                models.CompanyMilestoneTranslation.milestoneId == milestone_id,
                models.CompanyMilestoneTranslation.language == language,
            )
            .first()
        )
        if row:
            row.title = title
            row.description = description
            row.impactMetric = impact_metric
            row.updatedAt = timestamp
        else:
            db.add(
                models.CompanyMilestoneTranslation(
                    milestoneId=milestone_id,
                    language=language,
                    title=title,
                    description=description,
                    impactMetric=impact_metric,
                    createdAt=timestamp,
                    updatedAt=timestamp,
                )
            )


def upsert_leadership_translations(db: Session, member_id: int, translations: dict[str, dict[str, str]], timestamp: str) -> None:
    for language, values in (translations or {}).items():
        if language not in {"hi", "mr"} or not isinstance(values, dict):
            continue
        designation = str(values.get("designation", "")).strip()
        biography = str(values.get("biography", "")).strip()
        if not designation and not biography:
            continue
        row = (
            db.query(models.LeadershipMemberTranslation)
            .filter(
                models.LeadershipMemberTranslation.leadershipMemberId == member_id,
                models.LeadershipMemberTranslation.language == language,
            )
            .first()
        )
        if row:
            row.designation = designation
            row.biography = biography
            row.updatedAt = timestamp
        else:
            db.add(
                models.LeadershipMemberTranslation(
                    leadershipMemberId=member_id,
                    language=language,
                    designation=designation,
                    biography=biography,
                    createdAt=timestamp,
                    updatedAt=timestamp,
                )
            )


def upsert_fertilizer_translations(
    db: Session,
    translation_model: Any,
    fertilizer_id: int,
    translations: dict,
    timestamp: str,
) -> None:
    id_field_name = "fertilizer_id" if hasattr(translation_model, "fertilizer_id") else "fertilizerId"
    id_field = getattr(translation_model, id_field_name)
    for language, values in (translations or {}).items():
        if language not in {"hi", "mr"}:
            continue
        data = values.model_dump() if hasattr(values, "model_dump") else dict(values)
        if not any(str(data.get(field, "")).strip() for field in FERTILIZER_TRANSLATION_FIELDS):
            continue
        row = (
            db.query(translation_model)
            .filter(id_field == fertilizer_id, translation_model.language == language)
            .first()
        )
        if not row:
            row = translation_model(**{id_field_name: fertilizer_id}, language=language, createdAt=timestamp, updatedAt=timestamp)
            db.add(row)
        for field in FERTILIZER_TRANSLATION_FIELDS:
            value = str(data.get(field, "") or "").strip()
            if value:
                setattr(row, field, value)
        row.updatedAt = timestamp


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "database": str(legacy.DB_PATH.name), "backend": "fastapi"}


@app.get("/api/auth/me")
def auth_me(user: dict | None = Depends(current_user)) -> dict:
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return {"user": user}


@app.post("/api/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> dict:
    email = payload.email.lower()
    if email == settings.admin_email.lower() and payload.password == settings.admin_password:
        token = legacy.encode_token("admin", settings.admin_email, name="GreenWings Admin")
        return {"token": token, "user": {"email": settings.admin_email, "role": "admin", "name": "GreenWings Admin"}}

    row = db.query(models.User).filter(func.lower(models.User.email) == email).first()
    if not row or not legacy.verify_password(payload.password, row.passwordHash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    user = to_user(row)
    token = legacy.encode_token("member", user["email"], user["id"], user["name"])
    return {"token": token, "user": user}


@app.post("/api/auth/register", status_code=201)
def register(payload: RegisterRequest, request: Request, db: Session = Depends(get_db)) -> dict:
    ip_address = request.headers.get("CF-Connecting-IP") or (request.client.host if request.client else "127.0.0.1")
    if legacy.rate_limited(f"register:{ip_address}", 6, 300):
        raise HTTPException(status_code=429, detail="Too many registration attempts. Please try again later.")

    raw = payload.model_dump()
    errors = legacy.validate_registration(raw)
    if errors:
        return JSONResponse(status_code=400, content={"error": "Please correct the registration form.", "details": errors})
    email = payload.email.lower()
    if db.query(models.User).filter(func.lower(models.User.email) == email).first():
        raise HTTPException(status_code=409, detail="This email is already registered. Please login instead.")

    _, clean_mobile = legacy.normalized_mobile_number(payload.mobileNumber, payload.country)
    timestamp = now_iso()
    user_row = models.User(
        firstName=payload.firstName,
        lastName=payload.lastName,
        mobileNumber=clean_mobile,
        email=email,
        passwordHash=legacy.hash_password(payload.password),
        interest=payload.interest,
        enquiryQuestion=payload.enquiryQuestion,
        address=payload.address,
        state=payload.state,
        country=payload.country,
        role="USER",
        emailVerified=0,
        createdAt=timestamp,
        updatedAt=timestamp,
    )
    db.add(user_row)
    db.flush()
    enquiry_row = models.Enquiry(
        enquiryId=generate_enquiry_id(db),
        userId=user_row.id,
        subject=f"New member enquiry: {payload.interest}",
        category=payload.interest,
        description=payload.enquiryQuestion,
        priority="NORMAL",
        status="NEW",
        createdAt=timestamp,
        updatedAt=timestamp,
    )
    db.add(enquiry_row)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="This email is already registered. Please login instead.")

    db.refresh(user_row)
    db.refresh(enquiry_row)
    user = to_user(user_row)
    enquiry = to_enquiry(enquiry_row)
    legacy.send_admin_registration_email(user, enquiry)
    token = legacy.encode_token("member", user["email"], user["id"], user["name"])
    return {"token": token, "user": user, "enquiry": enquiry}


@app.get("/api/products")
def products(
    type: str | None = Query(default=None),
    lang: str = Query(default="en"),
    db: Session = Depends(get_db),
) -> dict:
    language = clean_language(lang)
    query = db.query(models.Crop).join(models.CropCategory, models.Crop.category_id == models.CropCategory.id).filter(models.Crop.status == "active")
    if type:
        normalized_type = normalize_category_filter(type)
        query = query.filter(
            or_(
                models.Crop.type == normalized_type,
                models.CropCategory.slug == normalized_type,
                func.lower(models.CropCategory.name) == normalized_type.replace("-", " "),
            )
        )
    rows = query.order_by(models.CropCategory.display_order, models.Crop.common_name).all()
    if rows:
        return {"language": language, "products": [to_crop_product(row, language) for row in rows]}

    legacy_query = db.query(models.Produce)
    if type:
        legacy_query = legacy_query.filter(models.Produce.type == type.strip().lower().removesuffix("s"))
    legacy_rows = legacy_query.order_by(models.Produce.type, models.Produce.name).all()
    return {"language": language, "products": [to_product(row, language) for row in legacy_rows]}


@app.get("/api/crop-categories")
def crop_categories(lang: str = Query(default="en"), db: Session = Depends(get_db)) -> dict:
    language = clean_language(lang)
    rows = (
        db.query(models.CropCategory)
        .filter(models.CropCategory.status == "active")
        .order_by(models.CropCategory.display_order, models.CropCategory.name)
        .all()
    )
    return {"language": language, "categories": [to_crop_category(row, language) for row in rows]}


@app.get("/api/fertilizers")
def fertilizers(
    kind: str = Query(default="local"),
    lang: str = Query(default="en"),
    search: str = Query(default=""),
    category: str = Query(default=""),
    db: Session = Depends(get_db),
) -> dict:
    language = clean_language(lang)
    model, translation_model, _ = fertilizer_classes(kind)
    query = db.query(model).filter(model.status == "active", model.fertilizer_type == kind)
    if search:
        pattern = f"%{search.strip()}%"
        query = query.filter(or_(model.name.like(pattern), model.category.like(pattern), model.manufacturer.like(pattern)))
    if category:
        query = query.filter(model.category == category)
    rows = query.order_by(model.category, model.name).all()
    categories = [
        item[0]
        for item in db.query(model.category)
        .filter(model.status == "active", model.fertilizer_type == kind)
        .distinct()
        .order_by(model.category)
        .all()
        if item[0]
    ]
    fertilizers_payload = []
    for row in rows:
        translation = None
        if language != "en":
            translation = (
                db.query(translation_model)
                .filter(translation_model.fertilizer_id == row.id, translation_model.language == language)
                .first()
            )
        fertilizers_payload.append(to_fertilizer(row, kind, language, translation))
    return {"kind": kind, "language": language, "categories": categories, "fertilizers": fertilizers_payload}


@app.get("/api/fertilizers/{kind}/{fertilizer_id}")
def fertilizer_detail(kind: str, fertilizer_id: int, lang: str = Query(default="en"), db: Session = Depends(get_db)) -> dict:
    language = clean_language(lang)
    model, translation_model, _ = fertilizer_classes(kind)
    row = db.query(model).filter(model.id == fertilizer_id, model.fertilizer_type == kind, model.status == "active").first()
    if not row:
        raise HTTPException(status_code=404, detail="Fertilizer not found.")
    translation = None
    if language != "en":
        translation = db.query(translation_model).filter(
            translation_model.fertilizer_id == row.id,
            translation_model.language == language,
        ).first()
    return {"fertilizer": to_fertilizer(row, kind, language, translation)}


@app.get("/api/company-content")
@app.get("/api/content/about")
def company_content(lang: str = Query(default="en"), db: Session = Depends(get_db)) -> dict:
    language = clean_language(lang)
    contents = public_content_collection(db, language)
    stories = public_story_collection(db, language)
    timelines = public_timeline_collection(db, language)
    milestones = public_milestone_collection(db, language)
    statistics = public_statistics(db)
    leadership = public_leadership(db, language)
    return {
        "language": language,
        "contents": contents,
        "contentByKey": {item["sectionKey"]: item for item in contents},
        "stories": stories,
        "storiesBySlug": {story["slug"]: story for story in stories},
        "timelines": timelines,
        "milestones": milestones,
        "statistics": statistics,
        "leadership": leadership,
    }


@app.get("/api/success-stories")
def success_stories(lang: str = Query(default="en"), db: Session = Depends(get_db)) -> dict:
    language = clean_language(lang)
    return {"language": language, "stories": public_success_stories(db, language)}


@app.get("/api/success-stories/{slug}")
def success_story_detail(slug: str, lang: str = Query(default="en"), db: Session = Depends(get_db)) -> dict:
    language = clean_language(lang)
    rows = (
        db.query(models.SuccessStory)
        .filter(
            models.SuccessStory.slug == slug,
            models.SuccessStory.status == "published",
            models.SuccessStory.language.in_(["en", language]),
        )
        .all()
    )
    if not rows:
        raise HTTPException(status_code=404, detail="Success story not found.")
    row = next((item for item in rows if item.language == language), rows[0])
    media = row.media
    if not media and row.language != "en":
        english = next((item for item in rows if item.language == "en"), None)
        if english:
            media = english.media
    return {"language": language, "story": to_success_story(row, media)}


@app.get("/api/enquiries")
def enquiry_list(user: dict = Depends(require_login), db: Session = Depends(get_db)) -> dict:
    if user.get("role") == "admin":
        rows = (
            db.query(models.Enquiry, models.User)
            .outerjoin(models.User, models.User.id == models.Enquiry.userId)
            .order_by(desc(models.Enquiry.updatedAt))
            .limit(100)
            .all()
        )
        enquiries = []
        for enquiry, owner in rows:
            item = to_enquiry(enquiry)
            item["userName"] = f"{owner.firstName if owner else ''} {owner.lastName if owner else ''}".strip()
            item["userEmail"] = owner.email if owner else ""
            enquiries.append(item)
        return {"enquiries": enquiries}

    user_id = user.get("userId")
    if not user_id:
        raise HTTPException(status_code=401, detail="Login required.")
    rows = db.query(models.Enquiry).filter(models.Enquiry.userId == user_id).order_by(desc(models.Enquiry.updatedAt)).all()
    return {"enquiries": [to_enquiry(row) for row in rows]}


@app.post("/api/enquiries", status_code=201)
def create_enquiry(payload: EnquiryCreate, user: dict = Depends(require_login), db: Session = Depends(get_db)) -> dict:
    if user.get("role") != "member" or not user.get("userId"):
        raise HTTPException(status_code=401, detail="Member login required.")
    timestamp = now_iso()
    row = models.Enquiry(
        enquiryId=generate_enquiry_id(db),
        userId=int(user["userId"]),
        subject=payload.subject,
        category=payload.category,
        description=payload.description,
        priority=payload.priority,
        status="NEW",
        createdAt=timestamp,
        updatedAt=timestamp,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"enquiry": to_enquiry(row)}


@app.post("/api/analytics/visit", status_code=201)
def analytics_visit(payload: AnalyticsVisit, request: Request, db: Session = Depends(get_db)) -> dict:
    user_agent = request.headers.get("User-Agent", "")[:500]
    ip_address = request.headers.get("CF-Connecting-IP") or (request.client.host if request.client else "127.0.0.1")
    timestamp = now_iso()
    db.add(
        models.WebsiteVisit(
            visitorId=(payload.visitorId or secrets.token_urlsafe(18))[:120],
            sessionId=(payload.sessionId or secrets.token_urlsafe(18))[:120],
            pagePath=(payload.pagePath or "/")[:300],
            referrer=(payload.referrer or "")[:500],
            userAgent=user_agent,
            ipAddressHash=legacy.hash_ip_address(ip_address),
            country=(payload.country or "")[:80],
            deviceType=legacy.detect_device_type(user_agent),
            browser=legacy.detect_browser(user_agent),
            visitedAt=timestamp,
            createdAt=timestamp,
        )
    )
    db.commit()
    return {"ok": True}


@app.get("/api/admin/summary")
def admin_summary(_: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    today = datetime.now(timezone.utc).date().isoformat()
    recent_users = (
        db.query(models.User)
        .filter(models.User.role == "USER")
        .order_by(desc(models.User.createdAt))
        .limit(6)
        .all()
    )
    recent_rows = (
        db.query(models.Enquiry, models.User)
        .outerjoin(models.User, models.User.id == models.Enquiry.userId)
        .order_by(desc(models.Enquiry.createdAt))
        .limit(6)
        .all()
    )
    recent_enquiries = []
    for enquiry, owner in recent_rows:
        item = to_enquiry(enquiry)
        item["userName"] = f"{owner.firstName if owner else ''} {owner.lastName if owner else ''}".strip()
        item["userEmail"] = owner.email if owner else ""
        recent_enquiries.append(item)
    most_visited = (
        db.query(models.WebsiteVisit.pagePath, func.count(models.WebsiteVisit.id).label("visits"))
        .group_by(models.WebsiteVisit.pagePath)
        .order_by(desc("visits"))
        .limit(5)
        .all()
    )
    return {
        "role": "admin",
        "produce": db.query(models.Crop).count(),
        "subtypes": db.query(models.CropVariety).count(),
        "localFertilizers": db.query(models.Fertilizer).filter(models.Fertilizer.fertilizer_type == "local").count(),
        "importedFertilizers": db.query(models.Fertilizer).filter(models.Fertilizer.fertilizer_type == "imported").count(),
        "companyStories": db.query(models.CompanyStory).count(),
        "companyContents": db.query(models.CompanyContent).count(),
        "companyMilestones": db.query(models.CompanyMilestone).count(),
        "companyTimelines": db.query(models.CompanyMilestone).count(),
        "leadershipMembers": db.query(models.LeadershipMember).count(),
        "homepageStatistics": db.query(models.HomepageStatistic).count(),
        "successStories": db.query(models.SuccessStory).count(),
        "totalUsers": db.query(models.User).filter(models.User.role == "USER").count(),
        "newUsersToday": db.query(models.User).filter(models.User.role == "USER", models.User.createdAt.like(f"{today}%")).count(),
        "totalEnquiries": db.query(models.Enquiry).count(),
        "newEnquiries": db.query(models.Enquiry).filter(models.Enquiry.status == "NEW").count(),
        "totalVisits": db.query(models.WebsiteVisit).count(),
        "uniqueVisitors": db.query(func.count(func.distinct(models.WebsiteVisit.visitorId))).scalar() or 0,
        "todayVisits": db.query(models.WebsiteVisit).filter(models.WebsiteVisit.visitedAt.like(f"{today}%")).count(),
        "recentUsers": [to_user(row) for row in recent_users],
        "recentEnquiries": recent_enquiries,
        "mostVisitedPages": [{"pagePath": row.pagePath, "visits": row.visits} for row in most_visited],
    }


def search_filter(query, model, search: str, fields: list[str]):
    if not search:
        return query
    pattern = f"%{search.strip()}%"
    return query.filter(or_(*(getattr(model, field).like(pattern) for field in fields)))


@app.get("/api/admin/company-contents")
def admin_company_contents(
    _: dict = Depends(require_admin),
    search: str = Query(default=""),
    language: str = Query(default=""),
    status: str = Query(default=""),
    db: Session = Depends(get_db),
) -> dict:
    query = db.query(models.CompanyContent)
    query = search_filter(query, models.CompanyContent, search, ["sectionKey", "title", "content"])
    if language:
        query = query.filter(models.CompanyContent.language == language)
    if status:
        query = query.filter(models.CompanyContent.status == status)
    rows = query.order_by(models.CompanyContent.language, models.CompanyContent.displayOrder, models.CompanyContent.title).all()
    return {"contents": [to_company_content(row) for row in rows]}


@app.post("/api/admin/company-contents", status_code=201)
def create_company_content(payload: CompanyContentIn, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    timestamp = now_iso()
    row = models.CompanyContent(**payload.model_dump(), createdAt=timestamp, updatedAt=timestamp)
    db.add(row)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A content section with this key and language already exists.")
    db.refresh(row)
    return {"content": to_company_content(row)}


@app.put("/api/admin/company-contents/{content_id}")
def update_company_content(content_id: int, payload: CompanyContentIn, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    row = db.get(models.CompanyContent, content_id)
    if not row:
        raise HTTPException(status_code=404, detail="Content section not found.")
    for field, value in payload.model_dump().items():
        setattr(row, field, value)
    row.updatedAt = now_iso()
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A content section with this key and language already exists.")
    db.refresh(row)
    return {"content": to_company_content(row)}


@app.delete("/api/admin/company-contents/{content_id}")
def delete_company_content(content_id: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    row = db.get(models.CompanyContent, content_id)
    if not row:
        raise HTTPException(status_code=404, detail="Content section not found.")
    db.delete(row)
    db.commit()
    return {"ok": True}


@app.get("/api/admin/company-stories")
def admin_company_stories(
    _: dict = Depends(require_admin),
    search: str = Query(default=""),
    language: str = Query(default=""),
    status: str = Query(default=""),
    db: Session = Depends(get_db),
) -> dict:
    query = db.query(models.CompanyStory)
    query = search_filter(query, models.CompanyStory, search, ["title", "slug", "content"])
    if language:
        query = query.filter(models.CompanyStory.language == language)
    if status:
        query = query.filter(models.CompanyStory.status == status)
    rows = query.order_by(models.CompanyStory.language, models.CompanyStory.displayOrder, models.CompanyStory.title).all()
    return {"stories": [to_company_story(row) for row in rows]}


@app.post("/api/admin/company-stories", status_code=201)
def create_company_story(payload: CompanyStoryIn, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    timestamp = now_iso()
    row = models.CompanyStory(**payload.model_dump(), createdAt=timestamp, updatedAt=timestamp)
    db.add(row)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A story with this slug and language already exists.")
    db.refresh(row)
    return {"story": to_company_story(row)}


@app.put("/api/admin/company-stories/{story_id}")
def update_company_story(story_id: int, payload: CompanyStoryIn, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    row = db.get(models.CompanyStory, story_id)
    if not row:
        raise HTTPException(status_code=404, detail="Story not found.")
    for field, value in payload.model_dump().items():
        setattr(row, field, value)
    row.updatedAt = now_iso()
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A story with this slug and language already exists.")
    db.refresh(row)
    return {"story": to_company_story(row)}


@app.delete("/api/admin/company-stories/{story_id}")
def delete_company_story(story_id: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    row = db.get(models.CompanyStory, story_id)
    if not row:
        raise HTTPException(status_code=404, detail="Story not found.")
    db.delete(row)
    db.commit()
    return {"ok": True}


@app.get("/api/admin/company-milestones")
def admin_company_milestones(_: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    rows = db.query(models.CompanyMilestone).order_by(desc(models.CompanyMilestone.displayOrder), desc(models.CompanyMilestone.year)).all()
    return {"milestones": [to_milestone(row, include_translations=True) for row in rows]}


@app.post("/api/admin/company-milestones", status_code=201)
def create_company_milestone(payload: CompanyMilestoneIn, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    timestamp = now_iso()
    data = payload.model_dump(exclude={"translations"})
    row = models.CompanyMilestone(**data, createdAt=timestamp, updatedAt=timestamp)
    db.add(row)
    db.flush()
    upsert_milestone_translations(db, row.id, payload.translations, timestamp)
    db.commit()
    db.refresh(row)
    return {"milestone": to_milestone(row, include_translations=True)}


@app.put("/api/admin/company-milestones/{milestone_id}")
def update_company_milestone(milestone_id: int, payload: CompanyMilestoneIn, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    row = db.get(models.CompanyMilestone, milestone_id)
    if not row:
        raise HTTPException(status_code=404, detail="Milestone not found.")
    for field, value in payload.model_dump(exclude={"translations"}).items():
        setattr(row, field, value)
    row.updatedAt = now_iso()
    upsert_milestone_translations(db, row.id, payload.translations, row.updatedAt)
    db.commit()
    db.refresh(row)
    return {"milestone": to_milestone(row, include_translations=True)}


@app.delete("/api/admin/company-milestones/{milestone_id}")
def delete_company_milestone(milestone_id: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    row = db.get(models.CompanyMilestone, milestone_id)
    if not row:
        raise HTTPException(status_code=404, detail="Milestone not found.")
    db.delete(row)
    db.commit()
    return {"ok": True}


@app.get("/api/admin/company-timelines")
def admin_company_timelines(
    _: dict = Depends(require_admin),
    search: str = Query(default=""),
    language: str = Query(default=""),
    status: str = Query(default=""),
    db: Session = Depends(get_db),
) -> dict:
    query = db.query(models.CompanyMilestone)
    query = search_filter(query, models.CompanyMilestone, search, ["year", "title", "description", "impactMetric"])
    if language:
        query = query.filter(models.CompanyMilestone.language == language)
    if status:
        query = query.filter(models.CompanyMilestone.status == status)
    rows = query.order_by(desc(models.CompanyMilestone.year), desc(models.CompanyMilestone.displayOrder)).all()
    return {"timelines": [to_timeline_from_milestone(row) for row in rows]}


@app.post("/api/admin/company-timelines", status_code=201)
def create_company_timeline(payload: CompanyTimelineIn, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    timestamp = now_iso()
    row = models.CompanyMilestone(**payload.model_dump(), image="", createdAt=timestamp, updatedAt=timestamp)
    db.add(row)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A timeline item with this year, title and language already exists.")
    db.refresh(row)
    return {"timeline": to_timeline_from_milestone(row)}


@app.put("/api/admin/company-timelines/{timeline_id}")
def update_company_timeline(timeline_id: int, payload: CompanyTimelineIn, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    row = db.get(models.CompanyMilestone, timeline_id)
    if not row:
        raise HTTPException(status_code=404, detail="Timeline item not found.")
    for field, value in payload.model_dump().items():
        setattr(row, field, value)
    row.updatedAt = now_iso()
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A timeline item with this year, title and language already exists.")
    db.refresh(row)
    return {"timeline": to_timeline_from_milestone(row)}


@app.delete("/api/admin/company-timelines/{timeline_id}")
def delete_company_timeline(timeline_id: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    row = db.get(models.CompanyMilestone, timeline_id)
    if not row:
        raise HTTPException(status_code=404, detail="Timeline item not found.")
    db.delete(row)
    db.commit()
    return {"ok": True}


@app.get("/api/admin/homepage-statistics")
def admin_homepage_statistics(_: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    rows = db.query(models.HomepageStatistic).order_by(models.HomepageStatistic.displayOrder, models.HomepageStatistic.label).all()
    return {"statistics": [to_statistic(row) for row in rows]}


@app.post("/api/admin/homepage-statistics", status_code=201)
def create_homepage_statistic(payload: HomepageStatisticIn, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    timestamp = now_iso()
    data = payload.model_dump()
    data["active"] = truthy(data["active"])
    row = models.HomepageStatistic(**data, createdAt=timestamp, updatedAt=timestamp)
    db.add(row)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A statistic with this label already exists.")
    db.refresh(row)
    return {"statistic": to_statistic(row)}


@app.put("/api/admin/homepage-statistics/{statistic_id}")
def update_homepage_statistic(statistic_id: int, payload: HomepageStatisticIn, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    row = db.get(models.HomepageStatistic, statistic_id)
    if not row:
        raise HTTPException(status_code=404, detail="Statistic not found.")
    data = payload.model_dump()
    data["active"] = truthy(data["active"])
    for field, value in data.items():
        setattr(row, field, value)
    row.updatedAt = now_iso()
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A statistic with this label already exists.")
    db.refresh(row)
    return {"statistic": to_statistic(row)}


@app.delete("/api/admin/homepage-statistics/{statistic_id}")
def delete_homepage_statistic(statistic_id: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    row = db.get(models.HomepageStatistic, statistic_id)
    if not row:
        raise HTTPException(status_code=404, detail="Statistic not found.")
    db.delete(row)
    db.commit()
    return {"ok": True}


@app.get("/api/admin/leadership-members")
def admin_leadership_members(_: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    rows = db.query(models.LeadershipMember).order_by(models.LeadershipMember.displayOrder, models.LeadershipMember.fullName).all()
    return {"leadership": [to_leadership(row, include_translations=True) for row in rows]}


@app.post("/api/admin/leadership-members", status_code=201)
def create_leadership_member(payload: LeadershipMemberIn, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    timestamp = now_iso()
    data = payload.model_dump(exclude={"translations"})
    if not data.get("imageUrl"):
        data["imageUrl"] = data.get("image", "")
    if not data.get("image"):
        data["image"] = data.get("imageUrl", "")
    data["active"] = truthy(data["active"])
    row = models.LeadershipMember(**data, createdAt=timestamp, updatedAt=timestamp)
    db.add(row)
    db.flush()
    upsert_leadership_translations(db, row.id, payload.translations, timestamp)
    db.commit()
    db.refresh(row)
    return {"member": to_leadership(row, include_translations=True)}


@app.put("/api/admin/leadership-members/{member_id}")
def update_leadership_member(member_id: int, payload: LeadershipMemberIn, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    row = db.get(models.LeadershipMember, member_id)
    if not row:
        raise HTTPException(status_code=404, detail="Leadership member not found.")
    data = payload.model_dump(exclude={"translations"})
    if not data.get("imageUrl"):
        data["imageUrl"] = data.get("image", "")
    if not data.get("image"):
        data["image"] = data.get("imageUrl", "")
    data["active"] = truthy(data["active"])
    for field, value in data.items():
        setattr(row, field, value)
    row.updatedAt = now_iso()
    upsert_leadership_translations(db, row.id, payload.translations, row.updatedAt)
    db.commit()
    db.refresh(row)
    return {"member": to_leadership(row, include_translations=True)}


@app.delete("/api/admin/leadership-members/{member_id}")
def delete_leadership_member(member_id: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    row = db.get(models.LeadershipMember, member_id)
    if not row:
        raise HTTPException(status_code=404, detail="Leadership member not found.")
    db.delete(row)
    db.commit()
    return {"ok": True}


@app.get("/api/admin/success-stories")
def admin_success_stories(
    _: dict = Depends(require_admin),
    search: str = Query(default=""),
    language: str = Query(default=""),
    status: str = Query(default=""),
    db: Session = Depends(get_db),
) -> dict:
    query = db.query(models.SuccessStory)
    query = search_filter(query, models.SuccessStory, search, ["farmerName", "title", "slug", "location", "cropType"])
    if language:
        query = query.filter(models.SuccessStory.language == language)
    if status:
        query = query.filter(models.SuccessStory.status == status)
    rows = query.order_by(models.SuccessStory.language, models.SuccessStory.displayOrder, models.SuccessStory.farmerName).all()
    return {"stories": [to_success_story(row) for row in rows]}


@app.post("/api/admin/success-stories", status_code=201)
def create_success_story(payload: SuccessStoryIn, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    timestamp = now_iso()
    data = payload.model_dump(exclude={"media"})
    data["featured"] = truthy(data["featured"])
    row = models.SuccessStory(**data, createdAt=timestamp, updatedAt=timestamp)
    db.add(row)
    try:
        db.flush()
        insert_story_media(db, row.id, payload.media, timestamp)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A success story with this slug and language already exists.")
    db.refresh(row)
    return {"story": to_success_story(row)}


@app.put("/api/admin/success-stories/{story_id}")
def update_success_story(story_id: int, payload: SuccessStoryIn, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    row = db.get(models.SuccessStory, story_id)
    if not row:
        raise HTTPException(status_code=404, detail="Success story not found.")
    data = payload.model_dump(exclude={"media"})
    data["featured"] = truthy(data["featured"])
    for field, value in data.items():
        setattr(row, field, value)
    row.updatedAt = now_iso()
    if payload.media is not None:
        db.query(models.SuccessStoryMedia).filter(models.SuccessStoryMedia.successStoryId == story_id).delete()
        insert_story_media(db, story_id, payload.media, row.updatedAt)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A success story with this slug and language already exists.")
    db.refresh(row)
    return {"story": to_success_story(row)}


@app.delete("/api/admin/success-stories/{story_id}")
def delete_success_story(story_id: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    row = db.get(models.SuccessStory, story_id)
    if not row:
        raise HTTPException(status_code=404, detail="Success story not found.")
    db.delete(row)
    db.commit()
    return {"ok": True}


@app.get("/api/admin/fertilizers")
def admin_fertilizers(
    _: dict = Depends(require_admin),
    kind: str = Query(default="local"),
    search: str = Query(default=""),
    category: str = Query(default=""),
    status: str = Query(default=""),
    db: Session = Depends(get_db),
) -> dict:
    model, _, _ = fertilizer_classes(kind)
    query = db.query(model).filter(model.fertilizer_type == kind)
    query = search_filter(query, model, search, ["name", "category", "manufacturer"])
    if category:
        query = query.filter(model.category == category)
    if status:
        query = query.filter(model.status == status)
    rows = query.order_by(desc(model.updatedAt)).all()
    return {"kind": kind, "fertilizers": [to_fertilizer(row, kind) for row in rows]}


@app.post("/api/admin/fertilizers", status_code=201)
def create_fertilizer(
    payload: FertilizerIn,
    _: dict = Depends(require_admin),
    kind: str = Query(default="local"),
    db: Session = Depends(get_db),
) -> dict:
    model, translation_model, extra_fields = fertilizer_classes(kind)
    timestamp = now_iso()
    data = payload.model_dump(exclude={"translations"})
    row_data = {field: data.get(field, "") for field in FERTILIZER_FIELDS + extra_fields}
    row_data["fertilizer_type"] = kind
    row = model(**row_data, createdAt=timestamp, updatedAt=timestamp)
    db.add(row)
    db.flush()
    upsert_fertilizer_translations(db, translation_model, row.id, payload.translations, timestamp)
    db.commit()
    db.refresh(row)
    return {"fertilizer": to_fertilizer(row, kind)}


@app.put("/api/admin/fertilizers/{kind}/{fertilizer_id}")
def update_fertilizer(
    kind: str,
    fertilizer_id: int,
    payload: FertilizerIn,
    _: dict = Depends(require_admin),
    db: Session = Depends(get_db),
) -> dict:
    model, translation_model, extra_fields = fertilizer_classes(kind)
    row = db.query(model).filter(model.id == fertilizer_id, model.fertilizer_type == kind).first()
    if not row:
        raise HTTPException(status_code=404, detail="Fertilizer not found.")
    data = payload.model_dump(exclude={"translations"})
    for field in FERTILIZER_FIELDS + extra_fields:
        setattr(row, field, data.get(field, ""))
    row.updatedAt = now_iso()
    upsert_fertilizer_translations(db, translation_model, row.id, payload.translations, row.updatedAt)
    db.commit()
    db.refresh(row)
    return {"fertilizer": to_fertilizer(row, kind)}


@app.delete("/api/admin/fertilizers/{kind}/{fertilizer_id}")
def delete_fertilizer(kind: str, fertilizer_id: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    model, translation_model, _ = fertilizer_classes(kind)
    row = db.query(model).filter(model.id == fertilizer_id, model.fertilizer_type == kind).first()
    if not row:
        raise HTTPException(status_code=404, detail="Fertilizer not found.")
    db.query(translation_model).filter(translation_model.fertilizer_id == fertilizer_id).delete()
    db.delete(row)
    db.commit()
    return {"ok": True}
