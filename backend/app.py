from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db

def create_app():
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
    from routes.customer_routes import customer_bp
    

    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(sales_bp, url_prefix="/api/sales")
    app.register_blueprint(test_bp, url_prefix="/api/test")
    app.register_blueprint(customer_bp, url_prefix="/api/customers")
    app.register_blueprint(upload_bp, url_prefix="/api/upload")
    

    

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)