from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/your_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)

    # Import your blueprints
    from routes.user_routes import user_bp
    from routes.product_routes import product_bp
    from routes.sales_routes import sales_bp
    from routes.test_route import test_bp
    from routes.upload_bp import upload_bp
    from routes.customer_routes import  customer_bp    
    

    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(sales_bp, url_prefix="/api/sales")
    app.register_blueprint(test_bp, url_prefix="/api/test")
    app.register_blueprint(upload_bp, url_prefix="/api/upload")

    # Import models so Flask-Migrate can detect them
    from models import category
    from models import product
    from models import sales
    from models import user 
    from models import Customer
    from models import Motorcycle
    from models import ServiceHistory
    from models import Sale
    from models import SaleItem
    # Seed CLI
    from app.seed import seed_cli
    seed_cli(app)

    return app