from extensions import db
from datetime import datetime


class Sale(db.Model):
    __tablename__ = "sales"

    id = db.Column(db.Integer, primary_key=True)

    total_amount = db.Column(db.Float, nullable=False)

    payment_method = db.Column(db.String(50), nullable=False)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    items = db.relationship(
        "SaleItem",
        backref="sale",
        cascade="all, delete-orphan"
    )

    def to_dict(self, include_items=False):
        payload = {
            "id": self.id,
            "total_amount": self.total_amount,
            "payment_method": self.payment_method,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_items:
            payload["items"] = [item.to_dict() for item in self.items]
        return payload