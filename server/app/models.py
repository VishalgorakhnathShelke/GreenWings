from __future__ import annotations

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firstName = Column(String, nullable=False)
    lastName = Column(String, nullable=False)
    mobileNumber = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True, index=True)
    passwordHash = Column(String, nullable=False)
    interest = Column(String, nullable=False)
    enquiryQuestion = Column(Text)
    address = Column(Text, nullable=False)
    state = Column(String, nullable=False)
    country = Column(String, nullable=False)
    role = Column(String, nullable=False, default="USER")
    emailVerified = Column(Integer, nullable=False, default=0)
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)

    enquiries = relationship("Enquiry", back_populates="user")


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    enquiryId = Column(String, nullable=False, unique=True)
    userId = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    subject = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String, nullable=False, default="NORMAL")
    status = Column(String, nullable=False, default="NEW")
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)

    user = relationship("User", back_populates="enquiries")


class WebsiteVisit(Base):
    __tablename__ = "website_visits"

    id = Column(Integer, primary_key=True)
    visitorId = Column(String, nullable=False, index=True)
    sessionId = Column(String, nullable=False)
    pagePath = Column(String, nullable=False, index=True)
    referrer = Column(Text)
    userAgent = Column(Text)
    ipAddressHash = Column(String, nullable=False)
    country = Column(String)
    deviceType = Column(String)
    browser = Column(String)
    visitedAt = Column(String, nullable=False)
    createdAt = Column(String, nullable=False)


class Produce(Base):
    __tablename__ = "produce"

    produce_id = Column(Integer, primary_key=True)
    type = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, unique=True)
    scientific_name = Column(String)
    category = Column(String)
    season = Column(String)
    marathi_name = Column(String)
    hindi_name = Column(String)
    english_name = Column(String)
    description = Column(Text)
    info = Column(Text, nullable=False)
    image_link = Column(Text)

    translations = relationship("ProduceTranslation", back_populates="produce")
    subtypes = relationship("Subtype", back_populates="produce")


class ProduceTranslation(Base):
    __tablename__ = "produce_translations"

    produce_id = Column(Integer, ForeignKey("produce.produce_id"), primary_key=True)
    language = Column(String, primary_key=True, index=True)
    display_name = Column(String, nullable=False)
    display_type = Column(String, nullable=False)
    category = Column(String, nullable=False)
    season = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    info = Column(Text, nullable=False)

    produce = relationship("Produce", back_populates="translations")


class Subtype(Base):
    __tablename__ = "subtypes"

    subtype_id = Column(Integer, primary_key=True)
    produce_id = Column(Integer, ForeignKey("produce.produce_id"), nullable=False, index=True)
    subtype_name = Column(String, nullable=False)
    origin_state = Column(String)
    taste_profile = Column(Text)
    scientific_name = Column(String)
    marathi_name = Column(String)
    description = Column(Text)
    info = Column(Text, nullable=False)
    image_link = Column(Text)

    produce = relationship("Produce", back_populates="subtypes")
    translations = relationship("SubtypeTranslation", back_populates="subtype")


class SubtypeTranslation(Base):
    __tablename__ = "subtype_translations"

    subtype_id = Column(Integer, ForeignKey("subtypes.subtype_id"), primary_key=True)
    language = Column(String, primary_key=True, index=True)
    display_name = Column(String, nullable=False)
    origin_state = Column(String, nullable=False)
    taste_profile = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    info = Column(Text, nullable=False)

    subtype = relationship("Subtype", back_populates="translations")


class CropCategory(Base):
    __tablename__ = "crop_category"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    slug = Column(String)
    description = Column(Text)
    info = Column(Text)
    icon_url = Column(Text)
    image_link = Column(Text)
    source_urls = Column(Text)
    display_order = Column(Integer, nullable=False, default=0)
    status = Column(String, nullable=False, default="active")
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)

    translations = relationship("CropCategoryTranslation", back_populates="category", cascade="all, delete-orphan")
    crops = relationship("Crop", back_populates="category_group")


class CropCategoryTranslation(Base):
    __tablename__ = "crop_category_translations"
    __table_args__ = (UniqueConstraint("category_id", "language"),)

    id = Column(Integer, primary_key=True)
    category_id = Column(Integer, ForeignKey("crop_category.id"), nullable=False)
    language = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    info = Column(Text)
    image_link = Column(Text)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)

    category = relationship("CropCategory", back_populates="translations")


class CropTaxonomy(Base):
    __tablename__ = "crop_taxonomy"
    __table_args__ = (UniqueConstraint("genus", "species"),)

    id = Column(Integer, primary_key=True)
    kingdom = Column(String)
    phylum = Column(String)
    class_name = Column(String)
    order_name = Column(String)
    family = Column(String)
    genus = Column(String)
    species = Column(String)
    cultivar_group = Column(String)
    image_link = Column(Text)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)


class Region(Base):
    __tablename__ = "region"
    __table_args__ = (UniqueConstraint("name", "country", "state_province"),)

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    country = Column(String)
    state_province = Column(String)
    climate_zone = Column(String)
    soil_type = Column(Text)
    avg_rainfall_mm = Column(String)
    avg_temp_celsius = Column(String)
    latitude = Column(String)
    longitude = Column(String)
    image_link = Column(Text)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)


class Crop(Base):
    __tablename__ = "crop"

    id = Column(Integer, primary_key=True)
    produce_id = Column(Integer, unique=True, index=True)
    category_id = Column(Integer, ForeignKey("crop_category.id"))
    taxonomy_id = Column(Integer, ForeignKey("crop_taxonomy.id"))
    common_name = Column(String, nullable=False)
    type = Column(String, index=True)
    category = Column(String)
    season = Column(String)
    scientific_name = Column(String)
    marathi_name = Column(String)
    hindi_name = Column(String)
    english_name = Column(String)
    description = Column(Text)
    origin_region = Column(String)
    image_url = Column(Text)
    image_link = Column(Text)
    growth_habit = Column(String)
    lifecycle_type = Column(String)
    is_edible = Column(Integer, nullable=False, default=1)
    is_commercial = Column(Integer, nullable=False, default=0)
    notes = Column(Text)
    status = Column(String, nullable=False, default="active")
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)

    category_group = relationship("CropCategory", back_populates="crops")
    translations = relationship("CropTranslation", back_populates="crop", cascade="all, delete-orphan")
    varieties = relationship("CropVariety", back_populates="crop", cascade="all, delete-orphan")


class CropTranslation(Base):
    __tablename__ = "crop_translations"
    __table_args__ = (UniqueConstraint("crop_id", "language"),)

    id = Column(Integer, primary_key=True)
    crop_id = Column(Integer, ForeignKey("crop.id"), nullable=False)
    language = Column(String, nullable=False, index=True)
    display_name = Column(String, nullable=False)
    display_type = Column(String)
    category = Column(String)
    season = Column(String)
    description = Column(Text)
    notes = Column(Text)
    image_link = Column(Text)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)

    crop = relationship("Crop", back_populates="translations")


class CropVariety(Base):
    __tablename__ = "crop_variety"
    __table_args__ = (UniqueConstraint("crop_id", "variety_name"),)

    id = Column(Integer, primary_key=True)
    crop_id = Column(Integer, ForeignKey("crop.id"), nullable=False, index=True)
    subtype_id = Column(Integer, unique=True, index=True)
    variety_name = Column(String, nullable=False)
    local_name = Column(String)
    region_of_origin = Column(String)
    season_type = Column(String)
    flavor_profile = Column(Text)
    color = Column(String)
    texture = Column(String)
    size_description = Column(Text)
    scientific_name = Column(String)
    marathi_name = Column(String)
    image_url = Column(Text)
    image_link = Column(Text)
    is_hybrid = Column(Integer, nullable=False, default=0)
    is_heirloom = Column(Integer, nullable=False, default=0)
    is_gmo = Column(Integer, nullable=False, default=0)
    development_year = Column(String)
    developed_by = Column(String)
    description = Column(Text)
    notes = Column(Text)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)

    crop = relationship("Crop", back_populates="varieties")
    translations = relationship("CropVarietyTranslation", back_populates="variety", cascade="all, delete-orphan")


class CropVarietyTranslation(Base):
    __tablename__ = "crop_variety_translations"
    __table_args__ = (UniqueConstraint("crop_variety_id", "language"),)

    id = Column(Integer, primary_key=True)
    crop_variety_id = Column(Integer, ForeignKey("crop_variety.id"), nullable=False)
    language = Column(String, nullable=False, index=True)
    display_name = Column(String, nullable=False)
    region_of_origin = Column(String)
    flavor_profile = Column(Text)
    description = Column(Text)
    notes = Column(Text)
    image_link = Column(Text)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)

    variety = relationship("CropVariety", back_populates="translations")


class FertilizerBaseMixin:
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    manufacturer = Column(String, nullable=False)
    countryOfOrigin = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    uses = Column(Text, nullable=False)
    applyOnCrops = Column(Text, nullable=False)
    doNotApplyOn = Column(Text, nullable=False)
    applicationMethod = Column(Text, nullable=False)
    recommendedStage = Column(String, nullable=False)
    season = Column(String, nullable=False)
    temperatureRange = Column(String, nullable=False)
    soilType = Column(Text, nullable=False)
    benefits = Column(Text, nullable=False)
    precautions = Column(Text, nullable=False)
    imageUrl = Column(Text)
    status = Column(String, nullable=False, default="active")
    documentUrl = Column(Text)
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)


class LocalFertilizer(FertilizerBaseMixin, Base):
    __tablename__ = "local_fertilizers"

    approvalBody = Column(Text)
    regionalRecommendations = Column(Text)
    translations = relationship("LocalFertilizerTranslation", back_populates="fertilizer", cascade="all, delete-orphan")


class ImportedFertilizer(FertilizerBaseMixin, Base):
    __tablename__ = "imported_fertilizers"

    brand = Column(String)
    importCertifications = Column(Text)
    internationalSpecifications = Column(Text)
    translations = relationship("ImportedFertilizerTranslation", back_populates="fertilizer", cascade="all, delete-orphan")


class FertilizerTranslationMixin:
    id = Column(Integer, primary_key=True)
    fertilizerId = Column(Integer, nullable=False)
    language = Column(String, nullable=False)
    name = Column(String)
    category = Column(String)
    countryOfOrigin = Column(String)
    description = Column(Text)
    content = Column(Text)
    uses = Column(Text)
    applyOnCrops = Column(Text)
    doNotApplyOn = Column(Text)
    applicationMethod = Column(Text)
    recommendedStage = Column(String)
    season = Column(String)
    temperatureRange = Column(String)
    soilType = Column(Text)
    benefits = Column(Text)
    precautions = Column(Text)
    approvalBody = Column(Text)
    regionalRecommendations = Column(Text)
    brand = Column(String)
    importCertifications = Column(Text)
    internationalSpecifications = Column(Text)
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)


class LocalFertilizerTranslation(FertilizerTranslationMixin, Base):
    __tablename__ = "local_fertilizer_translations"
    __table_args__ = (UniqueConstraint("fertilizerId", "language"),)

    fertilizerId = Column(Integer, ForeignKey("local_fertilizers.id"), nullable=False)
    fertilizer = relationship("LocalFertilizer", back_populates="translations")


class ImportedFertilizerTranslation(FertilizerTranslationMixin, Base):
    __tablename__ = "imported_fertilizer_translations"
    __table_args__ = (UniqueConstraint("fertilizerId", "language"),)

    fertilizerId = Column(Integer, ForeignKey("imported_fertilizers.id"), nullable=False)
    fertilizer = relationship("ImportedFertilizer", back_populates="translations")


class Fertilizer(Base):
    __tablename__ = "fertilizers"

    id = Column(Integer, primary_key=True, index=True)
    fertilizer_type = Column(String, nullable=False, default="local", index=True)
    name = Column(String, nullable=False)
    category = Column(String)
    manufacturer = Column(String)
    brand = Column(String)
    countryOfOrigin = Column(String)
    description = Column(Text)
    content = Column(Text)
    uses = Column(Text)
    applyOnCrops = Column(Text)
    doNotApplyOn = Column(Text)
    applicationMethod = Column(Text)
    recommendedStage = Column(String)
    season = Column(String)
    temperatureRange = Column(String)
    soilType = Column(Text)
    benefits = Column(Text)
    precautions = Column(Text)
    imageUrl = Column(Text)
    image_link = Column(Text)
    documentUrl = Column(Text)
    approvalBody = Column(Text)
    regionalRecommendations = Column(Text)
    importCertifications = Column(Text)
    internationalSpecifications = Column(Text)
    status = Column(String, nullable=False, default="active")
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)

    translations = relationship("FertilizerTranslation", back_populates="fertilizer", cascade="all, delete-orphan")


class FertilizerTranslation(Base):
    __tablename__ = "fertilizer_translations"
    __table_args__ = (UniqueConstraint("fertilizer_id", "language"),)

    id = Column(Integer, primary_key=True)
    fertilizer_id = Column(Integer, ForeignKey("fertilizers.id"), nullable=False)
    language = Column(String, nullable=False, index=True)
    name = Column(String)
    category = Column(String)
    countryOfOrigin = Column(String)
    description = Column(Text)
    content = Column(Text)
    uses = Column(Text)
    applyOnCrops = Column(Text)
    doNotApplyOn = Column(Text)
    applicationMethod = Column(Text)
    recommendedStage = Column(String)
    season = Column(String)
    temperatureRange = Column(String)
    soilType = Column(Text)
    benefits = Column(Text)
    precautions = Column(Text)
    approvalBody = Column(Text)
    regionalRecommendations = Column(Text)
    brand = Column(String)
    importCertifications = Column(Text)
    internationalSpecifications = Column(Text)
    image_link = Column(Text)
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)

    fertilizer = relationship("Fertilizer", back_populates="translations")


class CompanyStory(Base):
    __tablename__ = "company_stories"
    __table_args__ = (UniqueConstraint("slug", "language"),)

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    slug = Column(String, nullable=False)
    language = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    featuredImage = Column(Text)
    displayOrder = Column(Integer, nullable=False, default=0)
    status = Column(String, nullable=False, default="published")
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)


class CompanyContent(Base):
    __tablename__ = "company_contents"
    __table_args__ = (UniqueConstraint("sectionKey", "language"),)

    id = Column(Integer, primary_key=True)
    sectionKey = Column(String, nullable=False)
    title = Column(String, nullable=False)
    subtitle = Column(Text)
    content = Column(Text, nullable=False)
    language = Column(String, nullable=False, default="en")
    displayOrder = Column(Integer, nullable=False, default=0)
    status = Column(String, nullable=False, default="published")
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)


class CompanyMilestone(Base):
    __tablename__ = "company_milestones"

    id = Column(Integer, primary_key=True)
    year = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    impactMetric = Column(Text)
    language = Column(String, nullable=False, default="en")
    status = Column(String, nullable=False, default="published")
    image = Column(Text)
    displayOrder = Column(Integer, nullable=False, default=0)
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)

    translations = relationship("CompanyMilestoneTranslation", back_populates="milestone", cascade="all, delete-orphan")


class CompanyMilestoneTranslation(Base):
    __tablename__ = "company_milestone_translations"
    __table_args__ = (UniqueConstraint("milestoneId", "language"),)

    id = Column(Integer, primary_key=True)
    milestoneId = Column(Integer, ForeignKey("company_milestones.id"), nullable=False)
    language = Column(String, nullable=False)
    title = Column(String)
    description = Column(Text)
    impactMetric = Column(Text)
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)

    milestone = relationship("CompanyMilestone", back_populates="translations")


class CompanyTimeline(Base):
    __tablename__ = "company_timelines"
    __table_args__ = (UniqueConstraint("year", "title", "language"),)

    id = Column(Integer, primary_key=True)
    year = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    impactMetric = Column(Text)
    language = Column(String, nullable=False, default="en")
    displayOrder = Column(Integer, nullable=False, default=0)
    status = Column(String, nullable=False, default="published")
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)


class LeadershipMember(Base):
    __tablename__ = "leadership_members"

    id = Column(Integer, primary_key=True)
    fullName = Column(String, nullable=False)
    designation = Column(String, nullable=False)
    roleDescription = Column(Text)
    biography = Column(Text, nullable=False)
    image = Column(Text)
    imageUrl = Column(Text)
    language = Column(String, nullable=False, default="en")
    displayOrder = Column(Integer, nullable=False, default=0)
    active = Column(Integer, nullable=False, default=1)
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)

    translations = relationship("LeadershipMemberTranslation", back_populates="member", cascade="all, delete-orphan")


class LeadershipMemberTranslation(Base):
    __tablename__ = "leadership_member_translations"
    __table_args__ = (UniqueConstraint("leadershipMemberId", "language"),)

    id = Column(Integer, primary_key=True)
    leadershipMemberId = Column(Integer, ForeignKey("leadership_members.id"), nullable=False)
    language = Column(String, nullable=False)
    designation = Column(String)
    biography = Column(Text)
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)

    member = relationship("LeadershipMember", back_populates="translations")


class HomepageStatistic(Base):
    __tablename__ = "homepage_statistics"

    id = Column(Integer, primary_key=True)
    label = Column(String, nullable=False, unique=True)
    value = Column(String, nullable=False)
    description = Column(Text)
    displayOrder = Column(Integer, nullable=False, default=0)
    active = Column(Integer, nullable=False, default=1)
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)


class SuccessStory(Base):
    __tablename__ = "success_stories"
    __table_args__ = (UniqueConstraint("slug", "language"),)

    id = Column(Integer, primary_key=True)
    farmerName = Column(String, nullable=False)
    farmerPhone = Column(String)
    title = Column(String, nullable=False)
    slug = Column(String, nullable=False)
    location = Column(String)
    village = Column(String)
    district = Column(String)
    cropType = Column(String)
    landArea = Column(String)
    storyCategory = Column(String)
    shortQuote = Column(Text)
    shortSummary = Column(Text)
    fullStory = Column(Text, nullable=False)
    challenge = Column(Text)
    solution = Column(Text)
    result = Column(Text)
    yieldBefore = Column(String)
    yieldAfter = Column(String)
    priceBenefit = Column(String)
    additionalIncome = Column(String)
    fertilizerUsed = Column(String)
    seedUsed = Column(String)
    marketSupport = Column(Text)
    profileImage = Column(Text)
    coverImage = Column(Text)
    language = Column(String, nullable=False, default="en")
    displayOrder = Column(Integer, nullable=False, default=0)
    featured = Column(Integer, nullable=False, default=0)
    status = Column(String, nullable=False, default="published")
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)

    media = relationship("SuccessStoryMedia", back_populates="story", cascade="all, delete-orphan")


class SuccessStoryMedia(Base):
    __tablename__ = "success_story_media"

    id = Column(Integer, primary_key=True)
    successStoryId = Column(Integer, ForeignKey("success_stories.id", ondelete="CASCADE"), nullable=False)
    mediaType = Column(String, nullable=False, default="image")
    mediaUrl = Column(Text, nullable=False)
    caption = Column(Text)
    displayOrder = Column(Integer, nullable=False, default=0)
    createdAt = Column(String, nullable=False)
    updatedAt = Column(String, nullable=False)

    story = relationship("SuccessStory", back_populates="media")
