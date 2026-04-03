import click
from flask.cli import with_appcontext
from app import db
from models import Category, Product

@click.command("seed")
@with_appcontext
def seed():
    categories = [
        Category(name="Engine Parts"),
        Category(name="Electrical Parts"),
        Category(name="Brake System"),
        Category(name="Suspension"),
        Category(name="Tires & Wheels"),
        Category(name="Oils & Fluids"),
        Category(name="Accessories"),
        Category(name="Tools & Equipment")
    ]

    for c in categories:
        if not Category.query.filter_by(name=c.name).first():
            db.session.add(c)
    db.session.commit()

    # Demo products
    engine_cat = Category.query.filter_by(name="Engine Parts").first()
    if engine_cat and not Product.query.first():
        products = [
            Product(name="Spark Plug", price=150, stock=50, category=engine_cat),
            Product(name="Air Filter", price=250, stock=30, category=engine_cat)
        ]
        db.session.add_all(products)
        db.session.commit()

    print("Seeding completed!")

def seed_cli(app):
    app.cli.add_command(seed)