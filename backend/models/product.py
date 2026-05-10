from extensions import db

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False, default=0)
    barcode = db.Column(db.String(100), nullable=False, unique=True)
    stock = db.Column(db.Integer, nullable=False, default=0)
    image_url = db.Column(db.String(255), default="")

    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)

    
    category = db.relationship("Category", backref="products")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "barcode": self.barcode,
            "stock": self.stock,
            "image_url": self.image_url,
            "category_id": self.category_id,
        }