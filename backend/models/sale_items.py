from extensions import db

class SaleItem(db.Model):
    __tablename__ = "sale_items"

    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(
        db.Integer,
        db.ForeignKey("sales.id"),
        nullable=False
    )
    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"), # ✅ Add FK to link to products table
        nullable=False
    )
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

    # ✅ RELATIONSHIPS
    # This allows you to access product info (like name) directly from a sale item
    product = db.relationship("Product", backref="sale_items")