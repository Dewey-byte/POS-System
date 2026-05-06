from flask import Blueprint, request, jsonify
from models.user import User
from extensions import db
from werkzeug.security import check_password_hash, generate_password_hash

user_bp = Blueprint("users", __name__)

# GET ALL USERS
@user_bp.route("/", methods=["GET"])
def get_users():
    users = User.query.all()

    return jsonify([
        {
            "id": u.id,
            "name": u.name,
            "username": u.username,
            "role": u.role
        }
        for u in users
    ])
    
    # UPDATE USER
@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.json

    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Update fields if provided
    name = data.get("name")
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")

    if username:
        # check if username already exists (exclude current user)
        existing_user = User.query.filter_by(username=username).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({"message": "Username already taken"}), 400
        user.username = username

    if name:
        user.name = name

    if role:
        user.role = role

    if password:
        user.password = generate_password_hash(password)

    db.session.commit()

    return jsonify({
        "message": "User updated successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "role": user.role
        }
    }), 200

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
        password=hashed_password,
        role="cashier"   # default role set here
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# DELETE USER
@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    # 🚫 Prevent deleting admin users
    if user.role == "admin":
        return jsonify({"message": "Admin users cannot be deleted"}), 403

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200