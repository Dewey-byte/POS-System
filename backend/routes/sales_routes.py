from flask import Blueprint, request, jsonify
from sqlalchemy import func
from datetime import datetime

from extensions import db
from models.sales import Sale
from models.sale_items import SaleItem
from models.product import Product
from models.service_record import ServiceRecord


sales_bp = Blueprint("sales", __name__)


###########################################################
# CREATE SALE (ALREADY USED BY POS)
###########################################################

@sales_bp.route("/", methods=["POST"])
def create_sale():

    data = request.json

    new_sale = Sale(
        total_amount=data["total_amount"],
        payment_method=data["payment_method"]
    )

    db.session.add(new_sale)
    db.session.flush()

    for item in data["items"]:

        product = Product.query.get(item["product_id"])

        if not product:
            return jsonify({
                "error": "Product not found"
            }), 404

        if product.stock < item["quantity"]:
            return jsonify({
                "error": f"Not enough stock for product {product.id}"
            }), 400

        product.stock -= item["quantity"]

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
        "payment_method": new_sale.payment_method
    }), 201


###########################################################
# SALES REPORT CHART DATA
###########################################################

@sales_bp.route("/reports", methods=["GET"])
def get_sales_reports():

    date_from = request.args.get("date_from")
    date_to = request.args.get("date_to")

    query = db.session.query(
        func.date(Sale.created_at).label("date"),
        func.sum(Sale.total_amount).label("sales"),
        func.count(Sale.id).label("transactions")
    )

    if date_from:
        query = query.filter(Sale.created_at >= date_from)

    if date_to:
        query = query.filter(Sale.created_at <= date_to)

    results = query.group_by(
        func.date(Sale.created_at)
    ).all()

    return jsonify([
        {
            "date": str(row.date),
            "sales": float(row.sales),
            "transactions": row.transactions
        }
        for row in results
    ])


###########################################################
# RECENT TRANSACTIONS TABLE
###########################################################

@sales_bp.route("/transactions", methods=["GET"])
def get_transactions():

    sales = Sale.query.order_by(
        Sale.created_at.desc()
    ).limit(20).all()

    return jsonify([
        {
            "id": f"TXN-{sale.id}",
            "date": sale.created_at.strftime("%Y-%m-%d %H:%M"),
            "customer": "Walk-in Customer",
            "items": len(sale.items),
            "total": sale.total_amount,
            "payment": sale.payment_method
        }
        for sale in sales
    ])


###########################################################
# SERVICE CHART DATA
###########################################################

@sales_bp.route("/service-reports", methods=["GET"])
def service_reports():

    results = db.session.query(
        func.date(ServiceRecord.date).label("date"),
        func.sum(ServiceRecord.total).label("revenue"),
        func.count(ServiceRecord.id).label("services")
    ).group_by(
        func.date(ServiceRecord.date)
    ).all()

    return jsonify([
        {
            "date": str(row.date),
            "revenue": float(row.revenue or 0),
            "services": row.services
        }
        for row in results
    ])


###########################################################
# SERVICE RECORDS TABLE
###########################################################

@sales_bp.route("/service-records", methods=["GET"])
def service_records():

    records = ServiceRecord.query.order_by(
        ServiceRecord.date.desc()
    ).limit(20).all()

    return jsonify([
        {
            "id": f"SRV-{record.id}",
            "date": record.date.strftime("%Y-%m-%d"),

            "customer": record.customer_name,
            "type": record.service_type,
            "mechanic": record.mechanic_name,

            "brand": record.motorcycle_brand,
            "model": record.motorcycle_model,
            "plate": record.plate_number,

            "parts": record.parts_used or [],
            "labor": record.labor_cost or 0,

            "total": record.total,
            "status": record.status
        }
        for record in records
    ])