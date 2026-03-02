from flask import Blueprint, request, jsonify
from extensions import db
from models import User

user_bp = Blueprint("users", __name__)

@user_bp.route("/", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([
        {
            "id": u.id,
            "name": u.name,
            "username": u.username,
            "role": u.role
        } for u in users
    ])

@user_bp.route("/", methods=["POST"])
def create_user():
    data = request.json

    new_user = User(
        name=data["name"],
        username=data["username"],
        password_hash=data["password"],
        role=data["role"]
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201