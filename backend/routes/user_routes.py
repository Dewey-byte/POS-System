from flask import Blueprint, request, jsonify
from models.user import User
from extensions import db
from werkzeug.security import check_password_hash, generate_password_hash

user_bp = Blueprint("users", __name__)

# LOGIN
@user_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    users = User.query.filter_by(username=username).first()

    if users and check_password_hash(users.password, password):
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": users.id,
                "username": users.username,
                "role": users.role
            }
        }), 200

    return jsonify({"message": "Invalid username or password"}), 401


# SIGNUP / REGISTER
@user_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json

    name = data.get("name")
    username = data.get("username")
    password = data.get("password")

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"message": "Username already exists"}), 400

    hashed_password = generate_password_hash(password)

    new_user = User(
        name=name,
        username=username,
        password=hashed_password,   # match DB column
        role="user"
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201