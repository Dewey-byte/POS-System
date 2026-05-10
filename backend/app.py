from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db
from db_bootstrap import ensure_database_exists

def create_app():
    # Ensure the database itself exists before SQLAlchemy connects.
    ensure_database_exists(Config.SQLALCHEMY_DATABASE_URI)

    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    # Allow React frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    from routes.user_routes import user_bp
    from routes.product_routes import product_bp
    from routes.sales_routes import sales_bp
    from routes.test_route import test_bp
    from routes.upload_bp import upload_bp
    from routes.mechanics_routes import mechanics_bp
    
    

    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(sales_bp, url_prefix="/api/sales")
    app.register_blueprint(test_bp, url_prefix="/api/test")
    app.register_blueprint(upload_bp, url_prefix="/api/upload")
    app.register_blueprint(mechanics_bp, url_prefix="/api/mechanics")
    

    with app.app_context():
        # Import models so create_all can discover all tables.
        from models.category import Category  # noqa: F401
        from models.product import Product  # noqa: F401
        from models.user import User  # noqa: F401
        from models.sales import Sale  # noqa: F401
        from models.sale_items import SaleItem  # noqa: F401
        from models.mechanics import Mechanic  # noqa: F401
        from models.service_record import ServiceRecord  # noqa: F401

        db.create_all()

        # Auto-seed only when backup.json exists and DB is still empty.
        try:
            from auto_seed import auto_seed
            auto_seed()
        except Exception as seed_err:
            # Keep app boot resilient if seed data is unavailable/invalid.
            print(f"⚠️ Auto-seed skipped: {seed_err}")

    return app


app = create_app()

if __name__ == "__main__":
    # We already load backend/.env in config.py, so disable Flask's dotenv tip.
    app.run(debug=True, load_dotenv=False)