# models.py
from app import db

from datetime import datetime


class Customer(db.Model):
    __tablename__ = 'customers'
    id = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))
    address = db.Column(db.String(255))
    total_spent = db.Column(db.Float, default=0)
    LastVisit = db.Column(db.Date)
    notes = db.Column(db.Text)
    isVip = db.Column(db.Boolean, default=False)

    motorcycles = db.relationship('Motorcycle', backref='customer', cascade="all, delete-orphan", lazy=True)
    service_history = db.relationship('ServiceHistory', backref='customer', cascade="all, delete-orphan", lazy=True)


class Motorcycle(db.Model):
    __tablename__ = 'motorcycles'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.String(20), db.ForeignKey('customers.id'), nullable=False)
    brand = db.Column(db.String(50))
    model = db.Column(db.String(50))
    plate_number = db.Column(db.String(20))
    year = db.Column(db.Integer)


class ServiceHistory(db.Model):
    __tablename__ = 'service_history'
    id = db.Column(db.String(20), primary_key=True)
    customer_id = db.Column(db.String(20), db.ForeignKey('customers.id'), nullable=False)
    service_date = db.Column(db.Date)
    service_type = db.Column(db.String(100))
    cost = db.Column(db.Float)  