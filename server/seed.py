import os
from faker import Faker
from random import randint, choice
from models import User, Review, ReviewMetadata, Coffee, CoffeeProfile
from config import db, app
from server.coffee_seeds.coffee_seeds import seed_coffees

fake = Faker()

with app.app_context():
    print("Deleting all records...")
    User.query.delete()
    Review.query.delete()
    ReviewMetadata.query.delete()
    Coffee.query.delete()
    CoffeeProfile.query.delete()

    print("Seeding users...")
    users = []
    # usernames = []

    for i in range(20):
        # username = fake.simple_profile()['username']
        # while username in usernames:
        #     username = fake.simple_profile()['username']
        # usernames.append(username)

        user = User(
            username=fake.unique.simple_profile()['username'],
            email=fake.email()
        )
        # user.password_hash = fake.password()
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
    reviews_metadata = []
    for i in range(50):
        review_metadata = ReviewMetadata(
            user_id=randint(1, 20),
            coffee_id=choice(1, 5)
        )
        reviews_metadata.append(review_metadata)
    db.session.add_all(reviews_metadata)

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
        review.review_metadata_id=i+1
        reviews.append(review)

    db.session.add_all(reviews)
    db.session.commit()
    print("Seeding complete.")

