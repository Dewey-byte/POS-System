from flask import Blueprint, request, jsonify
from extensions import db
from models.customer import Customer
from datetime import datetime

customer_bp = Blueprint("customers", __name__,)

# -----------------------------
# Get all customers
# -----------------------------
@customer_bp.route("/", methods=["GET"])
def get_customers():
    customers = Customer.query.all()
    data = []
    for c in customers:
        data.append({
            "id": c.id,
            "name": c.name,
            "phone": c.phone,
            "email": c.email,
            "address": c.address,
            "total_spent": c.total_spent,
            "LastVisit": c.LastVisit.isoformat() if c.LastVisit else None,
            "notes": c.notes,
            "isVip": c.isVip,
            "motorcycles": [
                {"brand": m.brand, "model": m.model, "plate_number": m.plate_number, "year": m.year}
                for m in c.motorcycles
            ],
            "service_history": [
                {"id": s.id, "service_date": s.service_date.isoformat(), "service_type": s.service_type, "cost": s.cost}
                for s in c.service_history
            ]
        })
    return jsonify(data), 200

# -----------------------------
# Get customer by ID
# -----------------------------
@customer_bp.route("/<customer_id>", methods=["GET"])
def get_customer(customer_id):
    c = Customer.query.get_or_404(customer_id)
    data = {
        "id": c.id,
        "name": c.name,
        "phone": c.phone,
        "email": c.email,
        "address": c.address,
        "total_spent": c.total_spent,
        "LastVisit": c.LastVisit.isoformat() if c.LastVisit else None,
        "notes": c.notes,
        "isVip": c.isVip,
        "motorcycles": [
            {"brand": m.brand, "model": m.model, "plate_number": m.plate_number, "year": m.year}
            for m in c.motorcycles
        ],
        "service_history": [
            {"id": s.id, "service_date": s.service_date.isoformat(), "service_type": s.service_type, "cost": s.cost}
            for s in c.service_history
        ]
    }
    return jsonify(data), 200

# -----------------------------
# Add a new customer
# -----------------------------
@customer_bp.route("/", methods=["POST"])
def add_customer():
    data = request.json
    customer = Customer(
        id=data.get("id"),
        name=data.get("name"),
        phone=data.get("phone"),
        email=data.get("email"),
        address=data.get("address"),
        total_spent=data.get("total_spent", 0),
        LastVisit=datetime.strptime(data.get("LastVisit"), "%Y-%m-%d") if data.get("LastVisit") else None,
        notes=data.get("notes"),
        isVip=data.get("total_spent", 0) > 10000
    )
    db.session.add(customer)
    db.session.commit()
    return jsonify({"message": "Customer added successfully"}), 201

# -----------------------------
# Update a customer
# -----------------------------
@customer_bp.route("/<customer_id>", methods=["PUT"])
def update_customer(customer_id):
    c = Customer.query.get_or_404(customer_id)
    data = request.json
    c.name = data.get("name", c.name)
    c.phone = data.get("phone", c.phone)
    c.email = data.get("email", c.email)
    c.address = data.get("address", c.address)
    c.total_spent = data.get("total_spent", c.total_spent)
    c.LastVisit = datetime.strptime(data.get("LastVisit"), "%Y-%m-%d") if data.get("LastVisit") else c.LastVisit
    c.notes = data.get("notes", c.notes)
    c.isVip = c.total_spent > 10000
    db.session.commit()
    return jsonify({"message": "Customer updated successfully"}), 200

# -----------------------------
# Delete a customer
# -----------------------------
@customer_bp.route("/<customer_id>", methods=["DELETE"])
def delete_customer(customer_id):
    c = Customer.query.get_or_404(customer_id)
    db.session.delete(c)
    db.session.commit()
    return jsonify({"message": "Customer deleted successfully"}), 200