from flask import Blueprint, request, jsonify
from extensions import db
from models.sales import Sale
from models.sale_items import SaleItem
from models.product import Product   # ✅ ADD THIS

sales_bp = Blueprint("sales", __name__)


@sales_bp.route("/", methods=["POST"])
def create_sale():
    data = request.json

    # create sale summary
    new_sale = Sale(
        total_amount=data["total_amount"],
        payment_method=data["payment_method"]
    )

    db.session.add(new_sale)
    db.session.flush()  # get sale.id before commit

    # create sale items + stock deduction
    for item in data["items"]:

        # ✅ GET PRODUCT
        product = Product.query.get(item["product_id"])

        # ❌ VALIDATION: product exists
        if not product:
            return jsonify({"error": "Product not found"}), 404

        # ❌ VALIDATION: stock check
        if product.stock < item["quantity"]:
            return jsonify({
                "error": f"Not enough stock for product {product.id}"
            }), 400

        # ✅ REDUCE STOCK (THIS IS THE KEY PART YOU ASKED ABOUT)
        product.stock -= item["quantity"]

        # ✅ CREATE SALE ITEM
        sale_item = SaleItem(
            sale_id=new_sale.id,
            product_id=item["product_id"],
            quantity=item["quantity"],
            price=item["price"]
        )

        db.session.add(sale_item)

    db.session.commit()

    return jsonify({
    "message": "Sale recorded successfully",
    "sale_id": new_sale.id,
    "total_amount": new_sale.total_amount,
    "payment_method": new_sale.payment_method,
    "items": [
        {
            "name": item.product.name,
            "quantity": item.quantity,
            "price": item.price
        }
        for item in new_sale.items
    ]
}), 201