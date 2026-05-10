from datetime import datetime
from extensions import db


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
        default=list
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

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.isoformat() if self.date else None,
            "customer_name": self.customer_name,
            "mechanic_name": self.mechanic_name,
            "service_type": self.service_type,
            "motorcycle_brand": self.motorcycle_brand,
            "motorcycle_model": self.motorcycle_model,
            "plate_number": self.plate_number,
            "parts_used": self.parts_used or [],
            "labor_cost": self.labor_cost,
            "total": self.total,
            "status": self.status,
            "estimated_completion": (
                self.estimated_completion.isoformat()
                if hasattr(self.estimated_completion, "isoformat")
                else self.estimated_completion
            ),
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }