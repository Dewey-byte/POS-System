from flask import Blueprint, request, jsonify
from extensions import db
from models.product import Product
from models.category import Category

product_bp = Blueprint("products", __name__)

# GET all products
@product_bp.route("/", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "category": p.category.name if p.category else "uncategorized",
            "stock": p.stock,
            "image": p.image_url if hasattr(p, 'image_url') else "",
            "sku": p.barcode
        }
        for p in products
    ])


# POST add new product
@product_bp.route("/", methods=["POST"])
def add_product():
    data = request.json

    required_fields = ["category_id", "name", "barcode", "price", "stock"]
    missing_fields = [f for f in required_fields if f not in data]
    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    category = Category.query.get(data["category_id"])
    if not category:
        return jsonify({"error": "Invalid category_id"}), 400

    new_product = Product(
        category_id=data["category_id"],
        name=data["name"],
        barcode=data["barcode"],
        price=data["price"],
        stock=data["stock"],
        image_url=data.get("image_url", ""),
    )

    try:
        db.session.add(new_product)
        db.session.commit()
        return jsonify({"message": "Product added", "id": new_product.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# PUT update a product
@product_bp.route("/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.json
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    # Optional: validate category_id if updating
    if "category_id" in data:
        category = Category.query.get(data["category_id"])
        if not category:
            return jsonify({"error": "Invalid category_id"}), 400
        product.category_id = data["category_id"]

    # Update fields
    product.name = data.get("name", product.name)
    product.barcode = data.get("barcode", product.barcode)
    product.price = data.get("price", product.price)
    product.stock = data.get("stock", product.stock)
    product.image_url = data.get("image_url", product.image_url)

    try:
        db.session.commit()
        return jsonify({"message": "Product updated"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# DELETE a product
@product_bp.route("/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500 