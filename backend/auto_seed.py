import json
import os
from extensions import db
from models.category import Category
from models.product import Product
from models.user import User
from models.sales import Sale
from models.sale_items import SaleItem
from models.mechanics import Mechanic
from models.service_record import ServiceRecord

def auto_seed():
    # If DB already has data → skip
    if Category.query.first():
        print("✅ Database already seeded, skipping...")
        return

    # Check if backup exists
    if not os.path.exists("backup.json"):
        print("⚠️ No backup.json found, skipping seed")
        return

    with open("backup.json") as f:
        data = json.load(f)

    # Insert categories
    for c in data.get("categories", []):
        db.session.add(Category(**c))

    # Insert products
    for p in data.get("products", []):
        db.session.add(Product(**p))

    # Insert users
    for u in data.get("users", []):
        db.session.add(User(**u))

    # Insert mechanics
    for m in data.get("mechanics", []):
        db.session.add(Mechanic(**m))

    # Insert service records
    for sr in data.get("service_records", []):
        db.session.add(ServiceRecord(**sr))

    # Insert sales (safe)
    try:
        for s in data.get("sales", []):
            db.session.add(Sale(**s))
    except Exception as e:
        print("⚠️ Skipping sales:", e)

    # Insert sale items (safe)
    try:
        for si in data.get("sale_items", []):
            db.session.add(SaleItem(**si))
    except Exception as e:
        print("⚠️ Skipping sale_items:", e)

    db.session.commit()
    print("✅ Database auto-seeded from backup.json!")