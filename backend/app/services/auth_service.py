from app.models.user import User
from app.extensions.db import db
from app.utils.password_hash import hash_password, verify_password

def register_user(name, email, password):
    user = User(
        name=name,
        email=email,
        password=hash_password(password)
    )
    db.session.add(user)
    db.session.commit()
    return user

def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()
    if user and verify_password(password, user.password):
        return user
    return None
