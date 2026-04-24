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
    
    # POST checkout (decrease stock)
@product_bp.route("/checkout", methods=["POST"])
def checkout():
    data = request.json
    items = data.get("items", [])

    if not items:
        return jsonify({"error": "No items provided"}), 400

    try:
        for item in items:
            product_id = item.get("product_id")
            qty = item.get("quantity", 0)

            if not product_id or qty <= 0:
                return jsonify({"error": "Invalid item data"}), 400

            product = Product.query.get(product_id)
            if not product:
                return jsonify({"error": f"Product {product_id} not found"}), 404

            # ❗ Check stock availability
            if product.stock < qty:
                return jsonify({
                    "error": f"Insufficient stock for {product.name}"
                }), 400

            # ✅ Decrease stock
            product.stock -= qty

        db.session.commit()
        return jsonify({"message": "Checkout successful, stock updated"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500