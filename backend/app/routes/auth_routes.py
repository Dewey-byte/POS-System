from flask import Blueprint, request
from flask_jwt_extended import create_access_token
from app.services.auth_service import register_user, authenticate_user
from app.utils.response import success, error

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    user = register_user(data["name"], data["email"], data["password"])
    return success({"id": user.id}, "User registered")

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = authenticate_user(data["email"], data["password"])

    if not user:
        return error("Invalid credentials", 401)

    token = create_access_token(identity=user.id)
    return success({"token": token})
