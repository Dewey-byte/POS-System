from flask import Flask
from flask_cors import CORS
from routes.product_routes import product_bp

app = Flask(__name__)
CORS(app)  # <-- this allows all origins by default
app.register_blueprint(product_bp, url_prefix="/api/products")

# or to allow only your frontend
# CORS(app, origins=["http://localhost:5173"])