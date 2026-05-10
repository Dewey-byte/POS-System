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

    def to_dict(self):
        return {
            "id": self.id,
            "sale_id": self.sale_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "price": self.price,
        }