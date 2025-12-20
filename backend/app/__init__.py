from flask import Flask
from .config import Config
from .extensions.db import db
from .extensions.jwt import jwt
from .extensions.cors import cors

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)

    # Register routes
    from .routes.auth_routes import auth_bp
    from .routes.product_routes import product_bp
    from .routes.sales_routes import sales_bp
    from .routes.user_routes import user_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(product_bp, url_prefix="/products")
    app.register_blueprint(sales_bp, url_prefix="/sales")
    app.register_blueprint(user_bp, url_prefix="/users")

    return app
