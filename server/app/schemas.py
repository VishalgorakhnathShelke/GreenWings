from __future__ import annotations

import re
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

Language = Literal["en", "hi", "mr"]
Status = Literal["draft", "published", "archived"]
FertilizerStatus = Literal["active", "draft", "inactive"]
Priority = Literal["LOW", "NORMAL", "HIGH", "URGENT"]
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def clean_text(value: Any) -> str:
    return str(value or "").strip()


class ApiModel(BaseModel):
    model_config = ConfigDict(extra="ignore", str_strip_whitespace=True)


class LoginRequest(ApiModel):
    email: str = Field(min_length=3)
    password: str = Field(min_length=1)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        email = value.strip().lower()
        if not EMAIL_PATTERN.match(email):
            raise ValueError("Please enter a valid email address.")
        return email


class RegisterRequest(ApiModel):
    firstName: str = Field(min_length=1)
    lastName: str = Field(min_length=1)
    mobileNumber: str = Field(min_length=1)
    email: str = Field(min_length=3)
    password: str = Field(min_length=8)
    interest: str = Field(min_length=1)
    enquiryQuestion: str = Field(min_length=1)
    address: str = Field(min_length=1)
    state: str = Field(min_length=1)
    country: str = Field(min_length=1)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        email = value.strip().lower()
        if not EMAIL_PATTERN.match(email):
            raise ValueError("Please enter a valid email address.")
        return email


class EnquiryCreate(ApiModel):
    subject: str = Field(min_length=1)
    category: str = Field(min_length=1)
    description: str = Field(min_length=1)
    priority: Priority = "NORMAL"

    @field_validator("priority", mode="before")
    @classmethod
    def normalize_priority(cls, value: Any) -> str:
        normalized = clean_text(value).upper() or "NORMAL"
        return normalized if normalized in {"LOW", "NORMAL", "HIGH", "URGENT"} else "NORMAL"


class AnalyticsVisit(ApiModel):
    visitorId: str = ""
    sessionId: str = ""
    pagePath: str = Field(default="/", min_length=1)
    referrer: str = ""
    country: str = ""


class CompanyStoryIn(ApiModel):
    title: str = Field(min_length=1)
    slug: str = Field(min_length=1)
    language: Language = "en"
    content: str = Field(min_length=1)
    featuredImage: str = ""
    displayOrder: int = 0
    status: Status = "published"


class CompanyContentIn(ApiModel):
    sectionKey: str = Field(min_length=1)
    title: str = Field(min_length=1)
    subtitle: str = ""
    content: str = Field(min_length=1)
    language: Language = "en"
    displayOrder: int = 0
    status: Status = "published"


class CompanyMilestoneIn(ApiModel):
    year: str = Field(min_length=1)
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)
    impactMetric: str = ""
    language: Language = "en"
    status: Status = "published"
    image: str = ""
    displayOrder: int = 0
    translations: dict[str, dict[str, str]] = Field(default_factory=dict)


class CompanyTimelineIn(ApiModel):
    year: str = Field(min_length=1)
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)
    impactMetric: str = ""
    language: Language = "en"
    displayOrder: int = 0
    status: Status = "published"


class HomepageStatisticIn(ApiModel):
    label: str = Field(min_length=1)
    value: str = Field(min_length=1)
    description: str = ""
    displayOrder: int = 0
    active: bool = True


class LeadershipMemberIn(ApiModel):
    fullName: str = Field(min_length=1)
    designation: str = Field(min_length=1)
    roleDescription: str = ""
    biography: str = Field(min_length=1)
    image: str = ""
    imageUrl: str = ""
    language: Language = "en"
    displayOrder: int = 0
    active: bool = True
    translations: dict[str, dict[str, str]] = Field(default_factory=dict)


class SuccessStoryMediaIn(ApiModel):
    mediaType: str = "image"
    mediaUrl: str = Field(min_length=1)
    caption: str = ""
    displayOrder: int = 0


class SuccessStoryIn(ApiModel):
    farmerName: str = Field(min_length=1)
    farmerPhone: str = ""
    title: str = Field(min_length=1)
    slug: str = Field(min_length=1)
    location: str = ""
    village: str = ""
    district: str = ""
    cropType: str = ""
    landArea: str = ""
    storyCategory: str = ""
    shortQuote: str = ""
    shortSummary: str = ""
    fullStory: str = Field(min_length=1)
    challenge: str = ""
    solution: str = ""
    result: str = ""
    yieldBefore: str = ""
    yieldAfter: str = ""
    priceBenefit: str = ""
    additionalIncome: str = ""
    fertilizerUsed: str = ""
    seedUsed: str = ""
    marketSupport: str = ""
    profileImage: str = ""
    coverImage: str = ""
    language: Language = "en"
    displayOrder: int = 0
    featured: bool = False
    status: Status = "published"
    media: list[SuccessStoryMediaIn] | None = None


class FertilizerTranslationIn(ApiModel):
    name: str = ""
    category: str = ""
    countryOfOrigin: str = ""
    description: str = ""
    content: str = ""
    uses: str = ""
    applyOnCrops: str = ""
    doNotApplyOn: str = ""
    applicationMethod: str = ""
    recommendedStage: str = ""
    season: str = ""
    temperatureRange: str = ""
    soilType: str = ""
    benefits: str = ""
    precautions: str = ""
    approvalBody: str = ""
    regionalRecommendations: str = ""
    brand: str = ""
    importCertifications: str = ""
    internationalSpecifications: str = ""
    image_link: str = ""


class FertilizerIn(ApiModel):
    name: str = Field(min_length=1)
    category: str = Field(min_length=1)
    manufacturer: str = Field(min_length=1)
    countryOfOrigin: str = Field(min_length=1)
    description: str = Field(min_length=1)
    content: str = Field(min_length=1)
    uses: str = ""
    applyOnCrops: str = ""
    doNotApplyOn: str = ""
    applicationMethod: str = ""
    recommendedStage: str = ""
    season: str = ""
    temperatureRange: str = ""
    soilType: str = ""
    benefits: str = ""
    precautions: str = ""
    imageUrl: str = ""
    image_link: str = ""
    status: FertilizerStatus = "active"
    documentUrl: str = ""
    approvalBody: str = ""
    regionalRecommendations: str = ""
    brand: str = ""
    importCertifications: str = ""
    internationalSpecifications: str = ""
    translations: dict[str, FertilizerTranslationIn] = Field(default_factory=dict)
