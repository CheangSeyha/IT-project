from datetime import datetime

import pytest
from pydantic import ValidationError

from app.models.opportunity import OpportunityCategory, LocationType, WorkFormat
from app.models.tracking import ApplicationStatus
from app.models.user import UserRole
from app.schemas.opportunity import OpportunityCreate, OpportunityUpdate
from app.schemas.scraper import ScraperSourceCreate
from app.schemas.tracking import ApplicationTrackerCreate, ApplicationTrackerUpdate, CuratedCollectionCreate
from app.schemas.user import UserCreate, UserProfileUpdate, UserRoleUpdate, AlertSettingsUpdate


# --- Users ---
def test_user_create_valid_defaults_to_student():
    u = UserCreate(email="a@b.com", full_name="A", password="pw123456")
    assert u.role == UserRole.STUDENT


def test_user_create_rejects_bad_email():
    with pytest.raises(ValidationError):
        UserCreate(email="not-an-email", full_name="A", password="pw")


def test_user_create_requires_password_and_name():
    with pytest.raises(ValidationError):
        UserCreate(email="a@b.com")


def test_user_create_rejects_empty_password():
    with pytest.raises(ValidationError):
        UserCreate(email="a@b.com", full_name="A", password="")


def test_profile_update_all_optional():
    assert UserProfileUpdate().model_dump(exclude_unset=True) == {}


def test_role_update_rejects_unknown_role():
    with pytest.raises(ValidationError):
        UserRoleUpdate(role="superuser")


def test_alert_settings_defaults():
    s = AlertSettingsUpdate()
    assert s.frequency == "daily" and s.email_enabled is True


# --- Opportunities ---
def test_opportunity_create_defaults():
    o = OpportunityCreate(title="T", organization="O", category="job", location_type="local", description="D")
    assert o.category == OpportunityCategory.JOB
    assert o.location_type == LocationType.LOCAL
    assert o.country == "Cambodia"
    assert o.work_format == WorkFormat.ON_SITE
    assert o.visa_sponsorship is False


@pytest.mark.parametrize("field,value", [("category", "party"), ("location_type", "mars"), ("work_format", "sleep")])
def test_opportunity_create_rejects_bad_enum(field, value):
    body = dict(title="T", organization="O", category="job", location_type="local", description="D")
    body[field] = value
    with pytest.raises(ValidationError):
        OpportunityCreate(**body)


def test_opportunity_create_requires_title_and_description():
    with pytest.raises(ValidationError):
        OpportunityCreate(organization="O", category="job", location_type="local")


def test_opportunity_create_parses_deadline():
    o = OpportunityCreate(title="T", organization="O", category="job", location_type="local",
                          description="D", deadline="2027-01-31T00:00:00")
    assert o.deadline == datetime(2027, 1, 31)


def test_opportunity_update_only_sets_given_fields():
    assert OpportunityUpdate(title="New").model_dump(exclude_unset=True) == {"title": "New"}


# --- Tracking ---
def test_tracker_create_default_status_saved():
    assert ApplicationTrackerCreate(opportunity_id=1).status == ApplicationStatus.SAVED


def test_tracker_update_requires_valid_status():
    with pytest.raises(ValidationError):
        ApplicationTrackerUpdate(status="hired")


def test_curated_requires_int_ids():
    with pytest.raises(ValidationError):
        CuratedCollectionCreate(title="T", opportunity_ids=["abc"])


# --- Scrapers ---
def test_scraper_source_defaults():
    s = ScraperSourceCreate(name="N", target_url="https://x", category="job")
    assert s.location_type == "local" and s.schedule_interval == "Every 6 hours"
