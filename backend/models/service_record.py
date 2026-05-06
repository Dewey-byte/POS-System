from datetime import datetime
from app import db


class ServiceRecord(db.Model):

    __tablename__ = "service_records"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    date = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    customer_name = db.Column(
        db.String(120),
        nullable=False
    )

    mechanic_name = db.Column(
        db.String(120),
        nullable=False
    )

    service_type = db.Column(
        db.String(120),
        nullable=False
    )

    motorcycle_brand = db.Column(
        db.String(120)
    )

    motorcycle_model = db.Column(
        db.String(120)
    )

    plate_number = db.Column(
        db.String(50)
    )

    parts_used = db.Column(
        db.JSON,
        default=[]
    )

    labor_cost = db.Column(
        db.Float,
        default=0
    )

    total = db.Column(
        db.Float,
        nullable=False
    )

    status = db.Column(
        db.String(50),
        default="pending"
    )
      # ✅ NEW FIELD
    estimated_completion = db.Column(
        db.DateTime,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )