import pytest
from app.api.schemas import AdvisoryRequest
from uuid import uuid4

def test_advisory_request():
    uid = uuid4()
    req = AdvisoryRequest(question="What is the best fertilizer?", user_id=uid)
    assert req.question == "What is the best fertilizer?"
    assert req.user_id == uid
    assert req.language == "en"

def test_advisory_request_missing_required():
    with pytest.raises(ValueError):
        AdvisoryRequest(question="Missing User ID")
