from validate_email import validate_email
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

    serialize_rules = ("-reviews_metadata.user",)
    reviews_metadata = db.relationship("ReviewMetadata", backref="user")
    
    @validates('username')
    def validate_username(self, key, username):
        if not username: 
            raise ValueError('Username is required')
        return username

    @validates("email")
    def validate_email(self, key, address):
        is_valid = validate_email(address)
        if not is_valid:
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
              admin={self.is_admin} created at={self.created_at} updated at={self.updated_at}>"
    
class ReviewMetadata(db.Model, SerializerMixin):
    __tablename__ = "review_metadata"

    id = db.Column(db.Integer, primary_key=True)
    is_public = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    coffee_id = db.Column(db.Integer, db.ForeignKey("coffee.id"))
    review_id = db.Column(db.Integer, db.ForeignKey("review.id"))
    
    # serialize_rules = ("-coffee.review_metadata")
    serialize_rules = ("-review.review_metadata",)
    serialize_rules = ("-user.reviews_metadata",)

    def __repr__(self):
        return f"\n<Review metadata id={self.id} public={self.is_public}\
              created at={self.created_at} updated at={self.updated_at}\
                user id={self.user_id} coffee id={self.coffee_id}>"

class Review(db.Model, SerializerMixin):
    __tablename__ = "review"

    __table_args__ = (
        CheckConstraint('rate >= 0 AND rate <= 100', name='check_rate_range'),
        CheckConstraint('acidity >= 0 AND acidity <= 100', name='check_acidity_range'),
        CheckConstraint('body >= 0 AND body <= 100', name='check_body_range'),
        CheckConstraint('aroma >= 0 AND aroma <= 100', name='check_aroma_range')
    )

    id = db.Column(db.Integer, primary_key=True)
    rate = db.Column(db.Integer)
    price = db.Column(db.Integer)
    acidity = db.Column(db.Integer)
    body = db.Column(db.Integer)
    aroma = db.Column(db.Integer)
    review_text = db.Column(db.String(5000))
    flavor = db.Column(db.String(50)) #flavors as tag bubbles: cocoa, berries, etc.
    tag = db.Column(db.String(50)) #tag bubbles with non-flavor features: for espresso, for french press, etc.
    #!!! created_at and edited_at or find a way to connect to the metadata 

    serialize_rules = ("-review_metadata.review",)
    review_metadata = db.relationship("ReviewMetadata", backref="review")
    # review_metadata_id = db.Column(db.Integer, db.ForeignKey("review_metadata.id"))

    def __repr__(self):
        return f"\n<Review id={self.id} rate={self.rate}\
              price={self.price} acidity={self.acidity}\
                body={self.body} aroma={self.aroma}\
                    flavor={self.flavor} tag={self.tag} review_metadata_id={self.review_metadata_id}>"
 
class Coffee(db.Model, SerializerMixin):
    __tablename__ = "coffee"  

    __table_args__ = (
        CheckConstraint('roast >= 0 AND roast <= 100', name='check_roast_range'),
    )  

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    producer = db.Column(db.String(100), nullable=False)
    product_type = db.Column(db.String(50))
    weight = db.Column(db.Integer, default=340)
    is_decaf = db.Column(db.Boolean, default=False)
    image = db.Column(db.String(1000), default='coffee_seeds/coffee_placeholder.jpg')
    roast = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # coffee_profile = db.relationship("CoffeeProfile", backref="coffee") #corresponding coffee profile
    # reviews_metadata = db.relationship("ReviewMetadata", backref="coffee") #all reviews for this coffee

    # serialize_rules = ("-coffee_profile.coffee")
    # serialize_rules = ("-review_metadata.coffee")
    
    @validates('name')
    def validate_title(self, key, name):
        if name == None:
            raise ValueError('Coffee name is required')
        return name
    
    @validates("image")
    def validate_image(self, key, image_path):
        if ".jpg" not in image_path:
            raise ValueError("Image file type must be a jpg")
        return image_path

    def __repr__(self):
        return f"\n<Coffee id={self.id} name={self.name}\
              producer={self.producer} product type={self.product_type}\
                weight={self.weight} image={self.image}\
                    roast={self.roast} decaf={self.is_decaf}\
                          created at={self.created_at} updated at={self.updated_at}>"

class CoffeeProfile(db.Model, SerializerMixin): 
    __tablename__ = "coffee_profile"    

    id = db.Column(db.Integer, primary_key=True)
    country = db.Column(db.String(100))
    region = db.Column(db.String(100))
    farm = db.Column(db.String(100))
    continent = db.Column(db.String(50))
    altitude = db.Column(db.String(50))
    process = db.Column(db.String(50))
    is_specialty = db.Column(db.Boolean, default=False)
    variety = db.Column(db.String(100))
    #!!! created_at and edited_at or find a way to connect to the metadata 

    coffee_id = db.Column(db.Integer, db.ForeignKey("coffee.id"))
    # serialize_rules = ("-coffee.coffee_profile")  

    def __repr__(self):
        return f"\n<CoffeeProfile id={self.id} country={self.country}\
              region={self.region} region={self.region}\
                farm={self.farm} continent={self.continent}\
                    altitude={self.altitude} process={self.process}\
                          specialty={self.is_specialty} variety={self.variety} coffee_id={self.coffee_id}>"

# class CoffeeList(db.Model, SerializerMixin):
#     pass
