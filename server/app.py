from flask import request, session, render_template, make_response
from flask_restful import Resource
from config import app, db, api, ma
from models import User, ReviewMetadata, Review, Coffee, CoffeeProfile

class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True
    id = ma.auto_field()
    username = ma.auto_field()
    reviews_metadata = ma.auto_field()

    url = ma.Hyperlinks(
        {
            "self": ma.URLFor(
                "user",
                values=dict(id="<id>")),
            # "collection": ma.URLFor("users")
        }
    )

user_schema = UserSchema()
users_schema = UserSchema(many=True)

class CoffeeSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Coffee
        load_instance = True
    id = ma.auto_field()
    name = ma.auto_field()
    producer = ma.auto_field()
    product_type = ma.auto_field()
    weight = ma.auto_field()
    is_decaf = ma.auto_field()
    image = ma.auto_field()
    roast = ma.auto_field()
    coffee_profile = ma.auto_field()
    
    url = ma.Hyperlinks(
        {
            "self": ma.URLFor(
                "coffee",
                values=dict(id="<id>")),
            "collection": ma.URLFor("coffees")
        }
    )

coffee_schema = CoffeeSchema()
coffees_schema = CoffeeSchema(many=True)

class ReviewSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Review
        load_instance = True
    id = ma.auto_field()
    rate = ma.auto_field()
    price = ma.auto_field()
    acidity = ma.auto_field()
    body = ma.auto_field()
    aroma = ma.auto_field()
    review_text = ma.auto_field()
    flavor = ma.auto_field()
    tag = ma.auto_field()
    review_metadata = ma.auto_field()

    url = ma.Hyperlinks(
        {
            "self": ma.URLFor(
                "review",
                values=dict(id="<id>")),
            # "collection": ma.URLFor("reviews")
        }
    )

review_schema = ReviewSchema()
reviews_schema = ReviewSchema(many=True)

class ReviewMetadataSchema(ma.SQLAlchemySchema):
    class Meta:
        model = ReviewMetadata
        load_instance = True
    id = ma.auto_field()
    is_public = ma.auto_field()
    user_id = ma.auto_field()
    coffee_id = ma.auto_field()
    review_id = ma.auto_field()
    review = ma.Nested(ReviewSchema)

    # url = ma.Hyperlinks(
    #     {
    #         "self": ma.URLFor(
    #             "review_metadata",
    #             values=dict(id="<id>")),
    #         "collection": ma.URLFor("reviews_metadata")
    #     }
    # )

review_metadata_schema = ReviewMetadataSchema()
reviews_metadata_schema = ReviewMetadataSchema(many=True)


class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            return make_response(
            user_schema.dump(user),
            200, )
        return {"message" : "user is not signed in"}, 204
    
class Signup(Resource):
    def post(self):
        signup_data = request.get_json()
        user = User(
            username=signup_data['username'],
            email=signup_data['email']
        )
        email_used = User.query.filter_by(email=user.email).first()
        if email_used:
            return {}, 422
        user.password_hash=signup_data['password']
        db.session.add(user)
        db.session.commit()
        user_record = User.query.filter(User.username == user.username).first()
        if not user_record:
            return {}, 422
        session['user_id'] = user_record.id
        return make_response(
            user_schema.dump(user),
            201,
        )
    
class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data['username']
        password = data['password']
        user = User.query.filter(User.username == username).first()
        if not user:
            return {}, 401
        if user.authenticate(password):
            session['user_id'] = user.id
            return make_response(
                user_schema.dump(user),
                200, )
        return {}, 401
    
class Logout(Resource):
    def delete(self):
        if session.get('user_id'):
            session['user_id'] = None
            return {}, 204
        session['user_id'] = None
        return {}, 401
    
class Coffees(Resource):
    def get(self):
        coffees = Coffee.query.all()
        if not coffees:
            return make_response(
                {"message": "Not found"}, 404,
            )
        return make_response(
            coffees_schema.dump(coffees),
            200,)
    
    def post(self):
        data = request.get_json()
        user_id = session.get('user_id')
        if not user_id:
            return {}, 401
        if 'name' not in data:
            return {}, 422
        if 'producer' not in data:
            return {}, 422

        new_coffee = Coffee(
            name = data['name'],
            producer = data['producer'],
            product_type = data['product_type'],
            weight = data['weight'],
            is_decaf = data['is_decaf'],
            image = data['image'],
            roast = data['roast']
        )
        db.session.add(new_coffee)
        db.session.commit()

        new_coffee_profile = CoffeeProfile(
            country = data['country'],
            region = data['region'],
            farm = data['farm'],
            continent = data['continent'],
            altitude = data['altitude'],
            process = data['process'],
            is_specialty = data['is_specialty'],
            variety = data['variety']
        )
        new_coffee_profile.coffee_id = new_coffee.id
        db.session.add(new_coffee_profile)
        db.session.commit()
        new_coffee_data = Coffee.query.filter_by(id=new_coffee.id).first()
        return make_response(
            coffee_schema.dump(new_coffee_data), 
            201,
        )
    
class CoffeeByID(Resource):
    def get(self, id):
        coffee = Coffee.query.filter_by(id=id).first()
        if not coffee:
            return {'message': 'Not found'}, 404
        return make_response(
            coffee_schema.dump(coffee), 
            200,
        )

class CoffeeByIDReviews(Resource):
    #get all review for this coffee
    def get(self, id):
       session['coffee_id'] = id
       reviews_meta = ReviewMetadata.query.filter_by(coffee_id = id).all()
       return make_response(
           reviews_metadata_schema.dump(reviews_meta), 
           200,
       )
    
    #create a new review for this coffee
    def post(self, id):
        data = request.get_json()
        session["coffee_id"] = id
        if not session.get("coffee_id"):
             return {}, 403
        user_id = session.get('user_id')
        if not user_id:
            return {}, 401
        if 'rate' not in data:
            return {}, 422
        new_review = Review(
            rate = data['rate'],
            price = data['price'],
            acidity = data['acidity'],
            body = data['body'],
            aroma = data['aroma'],
            review_text = data['review_text'],
            flavor = data['flavor'],
            tag = data['tag']
        )
        db.session.add(new_review)
        db.session.commit()
        new_review_metadata = ReviewMetadata(
            id = new_review.id,
            is_public = data['is_public']
        )
        new_review_metadata.review_id = new_review.id
        new_review_metadata.coffee_id = session.get('coffee_id')
        new_review_metadata.user_id = session.get('user_id')
        db.session.add(new_review_metadata)
        db.session.commit()
        new_review_data = Review.query.filter_by(id=new_review.id).first()
        return make_response(
            review_schema.dump(new_review_data), 
            201,
        )
    
class CoffeeByIDAverage(Resource):
    def get(self, id):
        session["coffee_id"] = id
        if not session.get("coffee_id"):
             return {}, 403
        reviews_meta = ReviewMetadata.query.filter_by(coffee_id = id).all()
        reviews_meta_query = ReviewMetadata.query.filter_by(coffee_id = id).all()
        reviews_meta = reviews_metadata_schema.dump(reviews_meta_query)
        rates = [review_meta['review']['rate'] for review_meta in reviews_meta]
        if len(rates) <= 0:
            return {"average_rate": 0}, 200
        average = sum(rates) / len(rates)
        return {"average_rate": average}, 200
          
class UserByID(Resource):
    def get(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {}, 401
        user = User.query.filter_by(id=id).first()
        if not user:
            return {}, 404
        response = make_response(
            user_schema.dump(user),
            200,
        )
        return response

class UserByIDReviews(Resource):
    #all reviews left by this user
    def get(self):
        id = session.get('user_id')
        if not id:
            return {}, 401
        reviews_meta = ReviewMetadata.query.filter_by(user_id = id).all()
        return make_response(
            reviews_metadata_schema.dump(reviews_meta), 
            200,
        )
    
class ReviewByID(Resource):
    
    def delete(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {}, 401
        review_metadata = ReviewMetadata.query.filter_by(id=id).first()
        if not review_metadata:
            return {}, 404
        review = Review.query.filter_by(id=id).first()
        if not review:
            return {}, 404
        db.session.delete(review)
        db.session.commit()
        db.session.delete(review_metadata)
        db.session.commit()
        return {}, 204
    
    def patch(self, id):
        data = request.get_json()
        user_id = session.get('user_id')
        if not user_id:
            return {}, 401
        if 'rate' not in data:
            return {}, 422
        review_metadata = ReviewMetadata.query.filter_by(id=id).first()
        if not review_metadata:
            return {}, 404
        review = Review.query.filter_by(id=id).first()
        if not review:
            return {}, 404
        for attr in data:
            setattr(review, attr, data[attr])
        db.session.add(review)
        db.session.commit()
        updated_review = Review.query.filter_by(id=review_metadata.review_id).first()
        return make_response(
            review_schema.dump(updated_review), 
        202,
        )
    
api.add_resource(CheckSession, '/check_session', endpoint='check-session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Coffees, '/coffees', endpoint='coffees')
api.add_resource(CoffeeByID, '/coffees/<int:id>', endpoint='coffee')
api.add_resource(UserByID, '/users/<int:id>', endpoint='user')
api.add_resource(UserByIDReviews, '/user-reviews', endpoint='user-reviews')
api.add_resource(CoffeeByIDReviews, '/coffees/<int:id>/reviews', endpoint='coffee-reviews')
api.add_resource(CoffeeByIDAverage, '/coffees/<int:id>/reviews/average', endpoint='coffee-reviews-average')
api.add_resource(ReviewByID, '/reviews/<int:id>', endpoint='review')


@app.route('/')
@app.route('/check-session')
@app.route('/login')
@app.route('/logout')
@app.route('/signup')
@app.route('/coffees')
@app.route('/coffees/<int:id>')
@app.route('/users/<int:id>')
@app.route('/user-reviews')
@app.route('/coffees/<int:id>/reviews')
@app.route('/coffees/int:id>/reviews/average')
@app.route('/reviews/<int:id>')

def index(id=0):
    return render_template("index.html")

if __name__ == '__main__':
    app.run()