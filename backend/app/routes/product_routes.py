from flask import Blueprint, request
from app.models.product import Product
from app.extensions.db import db
from app.utils.response import success

product_bp = Blueprint("products", __name__)

@product_bp.route("/", methods=["GET"])
def get_products():
    products = Product.query.all()
    return success([
        {"id": p.id, "name": p.name, "price": p.price, "stock": p.stock}
        for p in products
    ])

@product_bp.route("/", methods=["POST"])
def add_product():
    data = request.json
    product = Product(**data)
    db.session.add(product)
    db.session.commit()
    return success(message="Product added")
