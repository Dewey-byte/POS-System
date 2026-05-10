import json

from flask import Blueprint, request, jsonify
from sqlalchemy import func
from datetime import datetime

from models.mechanics import Mechanic
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
def normalize_status(status):
    if not status:
        return "pending"
    return status.lower().replace(" ", "-")

@sales_bp.route("/service-records", methods=["GET"])
def service_records():
    records = ServiceRecord.query.order_by(
        ServiceRecord.date.desc()
    ).limit(20).all()

    return jsonify([
        {
            "id": f"SRV-{r.id}",
            "date": r.date.strftime("%Y-%m-%d") if r.date else None,

            "customer": r.customer_name,
            "type": r.service_type,
            "mechanic": r.mechanic_name,

            "brand": r.motorcycle_brand or "",
            "model": r.motorcycle_model or "",
            "plate": r.plate_number or "",
             
            "parts": json.loads(r.parts_used) if r.parts_used else [],
            "labor": float(r.labor_cost) if r.labor_cost else 0,
            "total": float(r.total) if r.total else 0,
           "estimated_completion": (
                r.estimated_completion.strftime("%Y-%m-%d")
                if hasattr(r.estimated_completion, "strftime")
                else r.estimated_completion
),
            # 🔥 FIXED STATUS
            "status": normalize_status(r.status)
        }
        for r in records
    ])
    
@sales_bp.route("/service-records", methods=["POST"])
def create_service_records():

    data = request.json

    if isinstance(data, dict):
        data = [data]

    created_records = []

    for item in data:

        record = ServiceRecord(
            customer_name=item.get("customer_name"),
            service_type=item.get("service_type"),
            motorcycle_brand=item.get("motorcycle_brand"),
            motorcycle_model=item.get("motorcycle_model"),
            plate_number=item.get("plate_number"),
            parts_used=json.dumps(item.get("parts_used", [])),
            labor_cost=item.get("labor_cost", 0),
            mechanic_name=item.get("mechanic_name"),
            estimated_completion=item.get("estimated_completion"),
            total=item.get("total", 0),
            status=(item.get("status") or "pending").lower().replace(" ", "-")
        )

        db.session.add(record)
        db.session.flush()  # 🔥 get ID before commit

        # =========================
        # 🔥 UPDATE MECHANIC HERE
        # =========================
        if record.mechanic_name:

            mechanic = Mechanic.query.filter_by(
                name=record.mechanic_name
            ).first()

            if mechanic:
                try:
                    active_jobs = json.loads(mechanic.active_jobs or "[]")
                except:
                    active_jobs = []

                # add new job
                active_jobs.append({
                    "id": f"SRV-{record.id}",
                    "customerName": record.customer_name,
                    "serviceType": record.service_type,
                    "status": record.status
                })

                mechanic.active_jobs = json.dumps(active_jobs)
                mechanic.current_jobs = (mechanic.current_jobs or 0) + 1
                mechanic.status = "busy"

        created_records.append(record)

    db.session.commit()

    return jsonify({
        "message": f"{len(created_records)} records created",
        "created": [
            {
                "id": f"SRV-{r.id}",
                "status": r.status
            }
            for r in created_records
        ]
    }), 201
    

@sales_bp.route("/service-records/<id>", methods=["PUT"])
def update_service_record(id):
    data = request.json or {}
    real_id = int(id.replace("SRV-", ""))
    record = ServiceRecord.query.get_or_404(real_id)

    if "customer_name" in data:
        record.customer_name = data.get("customer_name") or record.customer_name

    if "service_type" in data:
        service_type = data.get("service_type")
        if isinstance(service_type, list):
            service_type = ", ".join([str(t).strip() for t in service_type if str(t).strip()])
        record.service_type = service_type or record.service_type

    if "motorcycle_brand" in data:
        record.motorcycle_brand = data.get("motorcycle_brand", "")

    if "motorcycle_model" in data:
        record.motorcycle_model = data.get("motorcycle_model", "")

    if "plate_number" in data:
        record.plate_number = data.get("plate_number", "")

    if "mechanic_name" in data:
        record.mechanic_name = data.get("mechanic_name") or record.mechanic_name

    if "parts_used" in data:
        parts = data.get("parts_used") or []
        record.parts_used = parts if isinstance(parts, str) else json.dumps(parts)

    if "labor_cost" in data:
        try:
            record.labor_cost = float(data.get("labor_cost") or 0)
        except (TypeError, ValueError):
            record.labor_cost = 0

    if "estimated_completion" in data:
        estimated_completion = data.get("estimated_completion")
        if estimated_completion:
            try:
                record.estimated_completion = datetime.fromisoformat(estimated_completion)
            except ValueError:
                try:
                    record.estimated_completion = datetime.strptime(estimated_completion, "%Y-%m-%d")
                except ValueError:
                    record.estimated_completion = None
        else:
            record.estimated_completion = None

    if "total" in data:
        try:
            record.total = float(data.get("total") or 0)
        except (TypeError, ValueError):
            record.total = record.total or 0

    db.session.commit()

    return jsonify({
        "message": "Service record updated",
        "record": {
            "id": f"SRV-{record.id}",
            "customer": record.customer_name,
            "type": record.service_type,
            "mechanic": record.mechanic_name,
            "brand": record.motorcycle_brand or "",
            "model": record.motorcycle_model or "",
            "plate": record.plate_number or "",
            "labor": float(record.labor_cost) if record.labor_cost else 0,
            "total": float(record.total) if record.total else 0,
            "estimated_completion": (
                record.estimated_completion.strftime("%Y-%m-%d")
                if hasattr(record.estimated_completion, "strftime")
                else record.estimated_completion
            ),
            "status": normalize_status(record.status),
        }
    }), 200
    
    
@sales_bp.route("/service-records/<id>/status", methods=["PUT"])
def update_service_status(id):

    data = request.json
    new_status = normalize_status(data.get("status"))

    real_id = int(id.replace("SRV-", ""))  # or remove if using numeric only

    record = ServiceRecord.query.get_or_404(real_id)
    record.status = new_status

    mechanic = Mechanic.query.filter_by(
        name=record.mechanic_name
    ).first()

    if mechanic:
        try:
            active_jobs = json.loads(mechanic.active_jobs or "[]")
        except:
            active_jobs = []

        active_jobs = [
            j for j in active_jobs
            if j["id"] != f"SRV-{record.id}"
        ]

        mechanic.active_jobs = json.dumps(active_jobs)

        mechanic.current_jobs = max(0, (mechanic.current_jobs or 0) - 1)
        mechanic.completed_jobs = (mechanic.completed_jobs or 0) + 1

        mechanic.status = "available" if mechanic.current_jobs == 0 else "busy"

    db.session.commit()

    return jsonify({"message": "Status updated"})