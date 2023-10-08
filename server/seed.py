import os
from dotenv import load_dotenv
from faker import Faker
from random import randint, choice
from models import User, Review, ReviewMetadata, Coffee, CoffeeProfile
from config import db, app
from coffee_seeds.coffee_seeds import seed_coffees

fake = Faker()
load_dotenv()

with app.app_context():
    print("Deleting all records...")
    ReviewMetadata.query.delete()
    Review.query.delete()
    CoffeeProfile.query.delete()
    Coffee.query.delete()
    User.query.delete()

    print("Seeding users...")
    users = []

    for i in range(20):
        user = User(
            username=fake.first_name().lower(),
            email=fake.email()
        )
        user.password_hash = user.username
        users.append(user)

    #creating admin account:
    admin = User(
        username='admin',
        email=os.environ.get('ADMIN_EMAIL'),
        is_admin=True
    )
    admin.password_hash = os.environ.get('ADMIN_PASSWORD')
    
    users.append(admin)
    db.session.add_all(users)

    print("Seeding coffees...")
    seed_coffees()

    print("Seeding reviews...")

    flavors = ['honey', 'cinnamon', 'rose', 'cherry', 'apple', 'grapefruit', 'wine', 'fresh', 'malt', 'cardboard', 'mold', 'fermented']
    tags = ['espresso', 'aeropress', 'moka pot', 'chemex', 'filter', 'instant', 'rare', 'basic', 'disgusting', 'bold', 'exquisite', 'everyday']
    reviews = []
    for i in range(50):
        review = Review(
            rate=randint(0, 100),
            price=randint(10, 20),
            acidity=randint(50, 90),
            body=randint(30, 80),
            aroma=randint(20, 80),
            flavor=choice(flavors),
            tag=choice(tags)
        )
        reviews.append(review)
    db.session.add_all(reviews)

    reviews_metadata = []
    for i in range(50):
        review_metadata = ReviewMetadata(
            user_id=randint(1, 20),
            coffee_id=randint(1, 5)
        )
        review_metadata.review_id = i + 1
        reviews_metadata.append(review_metadata)
    db.session.add_all(reviews_metadata)
    db.session.commit()
    print("Seeding complete.")

