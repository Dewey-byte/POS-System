from app import db
from .category import Category

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    price = db.Column(db.Float)
    barcode = db.Column(db.String(100))
    stock = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(255))

    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))

    
    category = db.relationship("Category", backref="products")