import os
from faker import Faker
from models import User, Review, ReviewMetadata, Coffee, CoffeeProfile
from config import db, app, bcrypt

fake = Faker()

with app.app_context():
    print("Deleting all records...")
    User.query.delete()
    Review.query.delete()
    ReviewMetadata.query.delete()
    Coffee.query.delete()
    CoffeeProfile.query.delete()

    print("Creating users...")
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
        user.password_hash = fake.password()
        users.append(user)

    #creating admin account:
    admin = User(
        username='admin',
        email=os.environ.get('ADMIN_EMAIL')
        is_admin=True
    )
    admin.password_hash = os.environ.get('ADMIN_PASSWORD')
    db.session.add(admin)
    db.session.add_all(users)

    #seed coffee
    #seed coffee profile
    #seed review metadata
    #seed review

    db.session.commit()
    print("Seeding complete.")

