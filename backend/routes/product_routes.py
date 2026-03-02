from flask import Blueprint, request, jsonify
from extensions import db
from models import Product

product_bp = Blueprint("products", __name__)

@product_bp.route("/", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "barcode": p.barcode
        } for p in products
    ])

@product_bp.route("/", methods=["POST"])
def add_product():
    data = request.json

    new_product = Product(
        category_id=data["category_id"],
        name=data["name"],
        barcode=data["barcode"],
        price=data["price"],
        cost=data["cost"]
    )

    db.session.add(new_product)
    db.session.commit()

    return jsonify({"message": "Product added"}), 201