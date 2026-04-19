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