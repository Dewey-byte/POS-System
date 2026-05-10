from flask import Blueprint, request, jsonify
from models.mechanics import Mechanic
from extensions import db

mechanics_bp = Blueprint("mechanics", __name__)

def normalize_phone(value):
    if not value:
        return ""
    return "".join(ch for ch in str(value) if ch.isdigit())

def normalize_specialization(value):
    if isinstance(value, list):
        return ", ".join([str(item).strip() for item in value if str(item).strip()])
    return value

# GET ALL MECHANICS
@mechanics_bp.route("/", methods=["GET"])
def fetch_all():
    mechanics = Mechanic.query.all()

    return jsonify([
        {
            "id": m.id,
            "name": m.name,
            "phone": m.phone,
            "email": m.email,
            "specialization": m.specialization,
            "experience": m.experience,
            "status": m.status,
            "current_jobs": m.current_jobs,
            "completed_jobs": m.completed_jobs,
            
        }
        for m in mechanics
    ])


# GET SINGLE MECHANIC
@mechanics_bp.route("/<int:mech_id>", methods=["GET"])
def fetch_one(mech_id):
    mech = Mechanic.query.get(mech_id)

    if not mech:
        return jsonify({"error": "Mechanic not found"}), 404

    return jsonify({
        "id": mech.id,
        "name": mech.name,
        "phone": mech.phone,
        "email": mech.email,
        "specialization": mech.specialization,
        "experience": mech.experience,
        "status": mech.status,
        "current_jobs": mech.current_jobs,
        "completed_jobs": mech.completed_jobs,
        
    })


# CREATE MECHANIC
@mechanics_bp.route("/", methods=["POST"])
def create_mechanic():
    data = request.json

    new_mech = Mechanic(
        name=data.get("name"),
        phone=normalize_phone(data.get("phone")),
        email=data.get("email"),
        specialization=normalize_specialization(data.get("specialization")),
        experience=data.get("experience", 0),
        status=data.get("status", "available"),
        
    )

    db.session.add(new_mech)
    db.session.commit()

    return jsonify({"message": "Mechanic created successfully"}), 201

# UPDATE MECHANIC DETAILS
@mechanics_bp.route("/<int:mech_id>", methods=["PUT"])
def update_mechanic(mech_id):
    data = request.json

    mech = Mechanic.query.get(mech_id)

    if not mech:
        return jsonify({"error": "Mechanic not found"}), 404

    # Update fields if provided, otherwise keep existing values
    mech.name = data.get("name", mech.name)
    mech.phone = normalize_phone(data.get("phone", mech.phone))
    mech.email = data.get("email", mech.email)
    mech.specialization = normalize_specialization(
        data.get("specialization", mech.specialization)
    )
    mech.experience = data.get("experience", mech.experience)

    db.session.commit()

    return jsonify({
        "message": "Mechanic updated successfully",
        "mechanic": {
            "id": mech.id,
            "name": mech.name,
            "phone": mech.phone,
            "email": mech.email,
            "specialization": mech.specialization,
            "experience": mech.experience
        }
    })


# UPDATE STATUS
@mechanics_bp.route("/<int:mech_id>/status", methods=["PUT"])
def change_status(mech_id):
    data = request.json

    mech = Mechanic.query.get(mech_id)

    if not mech:
        return jsonify({"error": "Mechanic not found"}), 404

    mech.status = data.get("status", mech.status)

    db.session.commit()

    return jsonify({
        "message": "Status updated",
        "mechanic": {
            "id": mech.id,
            "status": mech.status
        }
    })
    
    # DELETE MECHANIC
@mechanics_bp.route("/<int:mech_id>", methods=["DELETE"])
def delete_mechanic(mech_id):
    mech = Mechanic.query.get(mech_id)

    if not mech:
        return jsonify({"error": "Mechanic not found"}), 404

    db.session.delete(mech)
    db.session.commit()

    return jsonify({"message": "Mechanic deleted successfully"})