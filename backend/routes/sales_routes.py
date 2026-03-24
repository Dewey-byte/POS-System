from flask import Blueprint, request, jsonify
from extensions import db
from models.sales import Sale

sales_bp = Blueprint("sales", __name__)

@sales_bp.route("/", methods=["POST"])
def create_sale():
    data = request.json

    new_sale = Sale(
        user_id=data["user_id"],
        total=data["total"],
        tax=data["tax"],
        discount=data["discount"],
        grand_total=data["grand_total"],
        status="completed"
    )

    db.session.add(new_sale)
    db.session.commit()

    return jsonify({"message": "Sale recorded"}), 201