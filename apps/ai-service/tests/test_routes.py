import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "environment": "development"}

def test_advisory_ask_unauthorized():
    # Calling without NestJS proxy headers should fail 401
    response = client.post("/advisory/ask", json={
        "question": "What is a good pesticide?",
        "user_id": "00000000-0000-0000-0000-000000000001"
    })
    assert response.status_code == 401

def test_advisory_ask_authorized():
    # Calling with NestJS proxy header but endpoint is a 501 stub right now
    response = client.post(
        "/advisory/ask", 
        json={
            "question": "What is a good pesticide?",
            "user_id": "00000000-0000-0000-0000-000000000001"
        },
        headers={"x-user-id": "00000000-0000-0000-0000-000000000001"}
    )
    assert response.status_code == 501
