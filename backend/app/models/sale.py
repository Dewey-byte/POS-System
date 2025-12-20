from app.extensions.db import db
from datetime import datetime

class Sale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    total = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
