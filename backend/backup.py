import json
from app import app
from extensions import db

# Import models from your folders
from models.category import Category
from models.product import Product
from models.sales import Sale
from models.user import User


def backup():
    with app.app_context():

        # ✅ Categories
        categories = [
            {
                "id": c.id,
                "name": c.name
            }
            for c in Category.query.all()
        ]

        # ✅ Products
        products = [
            {
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "barcode": p.barcode,
                "stock": p.stock,
                "image_url": p.image_url,
                "category_id": p.category_id
            }
            for p in Product.query.all()
        ]

        # ✅ Users
        users = [
            {
                "id": u.id,
                "name": u.name,
                "username": u.username,
                "password": u.password,
                "role": u.role
            }
            for u in User.query.all()
        ]

        # ⚠️ Sales (safe version to avoid crash)
        sales = []
        try:
            sales = [
                {
                    "id": s.id,
                    "product_id": s.product_id,
                    "quantity": s.quantity,
                    "total_price": s.total_price
                }
                for s in Sale.query.all()
            ]
        except Exception as e:
            print("⚠️ Skipping sales backup due to mismatch:", e)

        # ✅ Combine all data
        data = {
            "categories": categories,
            "products": products,
            "users": users,
            "sales": sales
        }

        # ✅ Save to JSON
        with open("backup.json", "w") as f:
            json.dump(data, f, indent=4)

        print("✅ Backup successful! File saved as backup.json")


if __name__ == "__main__":
    backup()