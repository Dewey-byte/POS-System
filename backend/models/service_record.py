from extensions import db
from datetime import datetime


class ServiceRecord(db.Model):

    __tablename__ = "service_records"

    id = db.Column(db.Integer, primary_key=True)

    customer_name = db.Column(
        db.String(120)
    )

    service_type = db.Column(
        db.String(120)
    )

    mechanic_name = db.Column(
        db.String(120)
    )

    total = db.Column(
        db.Float,
        default=0
    )

    status = db.Column(
        db.String(50)
    )

    date = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )