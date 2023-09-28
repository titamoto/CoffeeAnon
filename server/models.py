import re
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy import CheckConstraint

from config import db, bcrypt


class User(db.Model, SerializerMixin):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String(250), unique=True, nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    _password_hash = db.Column(db.String(60), nullable=False)

    reviews = db.relationship("Review", backref="user")
    serialize_rules = ("-review.user")

    @validates("email")
    def validate_email(self, key, address):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", address):
            raise ValueError("Invalid email address")
        return address

    @hybrid_property
    def password_hash(self):
        raise Exception("Password hashes may not be viewed")

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
        self._password_hash = password_hash.decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))

    def __repr__(self):
        return f"\n<User id={self.id} username={self.username} email={self.email}\
              admin={self.admin} created at={self.created_at} updated at={self.updated_at}>"
    
class ReviewMetadata(db.Model, SerializerMixin):
    __tablename__ = "review_metadata"

    id = db.Column(db.Integer, primary_key=True)
    is_public = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    coffee_id = db.Column(db.Integer, db.ForeignKey("coffee.id"))

    serialize_rules = ("-user.review_metadata")
    serialize_rules = ("-coffee.review_metadata")
    serialize_rules = ("-review.review_metadata")

    def __repr__(self):
        return f"\n<Review metadata id={self.id} public={self.is_public}\
              created at={self.created_at} updated at={self.updated_at}\
                user id={self.user_id} coffee id={self.coffee_id}>"

class Review(db.Model, SerializerMixin):
    __tablename__ = "review"

    __table_args__ = (
        CheckConstraint('rate >= 0 AND rate <= 10', name='check_rate_range'),
        CheckConstraint('acidity >= 0 AND acidity <= 10', name='check_acidity_range'),
        CheckConstraint('body >= 0 AND body <= 10', name='check_body_range'),
        CheckConstraint('aroma >= 0 AND aroma <= 10', name='check_aroma_range')
    )

    id = db.Column(db.Integer, primary_key=True)
    rate = db.Column(db.Integer)
    price = db.Column(db.Integer)
    acidity = db.Column(db.Integer)
    body = db.Column(db.Integer)
    aroma = db.Column(db.Integer)
    flavor = db.Column(db.Integer) #flavors as tag bubbles: cocoa, berries, etc.
    tag = db.Column(db.String) #tag bubbles with non-flavor features: for espresso, for french press, etc.

    review_metadata_id = db.Column(db.Integer, db.ForeignKey("review_metadata.id"))
 
class Coffee(db.Model, SerializerMixin):
    pass 

class CoffeeProfile(db.Model, SerializerMixin): 
    pass

# class CoffeeList(db.Model, SerializerMixin):
#     pass
