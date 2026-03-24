from flask import Blueprint, request, jsonify
from extensions import db

test_bp = Blueprint("test", __name__)

@test_bp.route("/test-db")
def test_db():
    try:
        db.session.execute("SELECT 1")
        return {"message": "Database connected successfully"}
    except Exception as e:
        return {"error": str(e)}
    