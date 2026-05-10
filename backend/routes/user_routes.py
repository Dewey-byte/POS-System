from flask import Blueprint, request, jsonify
from models.user import User
from extensions import db
from werkzeug.security import check_password_hash, generate_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask import current_app
import smtplib
from email.message import EmailMessage

user_bp = Blueprint("users", __name__)


def _send_reset_email(to_email: str, token: str):
    config = current_app.config
    sender = (config.get("MAIL_DEFAULT_SENDER") or config.get("MAIL_USERNAME") or "").strip()
    username = (config.get("MAIL_USERNAME") or "").strip()
    # Gmail app-passwords are shown with spaces; normalize in case pasted as-is.
    password = (config.get("MAIL_PASSWORD") or "").strip().replace(" ", "")
    smtp_server = config.get("MAIL_SERVER")
    smtp_port = config.get("MAIL_PORT", 587)
    use_tls = config.get("MAIL_USE_TLS", True)

    if not sender or not username or not password:
        raise RuntimeError("Email credentials are not configured")

    msg = EmailMessage()
    msg["Subject"] = "POS System Password Reset"
    msg["From"] = sender
    msg["To"] = to_email
    msg.set_content(
        "You requested a password reset.\n\n"
        f"Reset token: {token}\n\n"
        "This token expires in 15 minutes.\n"
        "If you did not request this, ignore this email."
    )

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        if use_tls:
            server.starttls()
        server.login(username, password)
        server.send_message(msg)

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


@user_bp.route("/forgot-password", methods=["POST", "OPTIONS"])
def forgot_password():
    if request.method == "OPTIONS":
        return jsonify({"message": "ok"}), 200

    data = request.json or {}
    email = (data.get("email") or "").strip().lower()

    # Return generic response regardless of user existence.
    generic_response = jsonify({
        "message": "If this email is registered, a reset token has been sent."
    }), 200

    if not email:
        return generic_response

    user = User.query.filter_by(username=email).first()
    if not user:
        return generic_response

    serializer = URLSafeTimedSerializer(current_app.config.get("SECRET_KEY"))
    token = serializer.dumps({"user_id": user.id}, salt="password-reset")

    try:
        _send_reset_email(email, token)
    except Exception as mail_err:
        return jsonify({"message": f"Failed to send email: {mail_err}"}), 500

    return generic_response


@user_bp.route("/reset-password", methods=["POST", "OPTIONS"])
def reset_password():
    if request.method == "OPTIONS":
        return jsonify({"message": "ok"}), 200

    data = request.json or {}
    token = data.get("token", "")
    new_password = data.get("new_password", "")

    if not token or not new_password:
        return jsonify({"message": "Token and new password are required"}), 400

    if len(new_password) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400

    serializer = URLSafeTimedSerializer(current_app.config.get("SECRET_KEY"))

    try:
        payload = serializer.loads(
            token,
            salt="password-reset",
            max_age=900,  # 15 minutes
        )
    except SignatureExpired:
        return jsonify({"message": "Reset token expired"}), 400
    except BadSignature:
        return jsonify({"message": "Invalid reset token"}), 400

    user = User.query.get(payload.get("user_id"))
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"message": "Password reset successful"}), 200


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