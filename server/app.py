from flask import request, session, jsonify, make_response
from flask_restful import Resource
from config import app, db, api
from models import User, ReviewMetadata, Review, Coffee, CoffeeProfile


class ClearSession(Resource):
    def delete(self):
        session['user_id'] = None
        return {}, 204
    
class CheckSession(Resource):
    def get(self):
        user_id = session['user_id']
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            return user.to_dict(), 200
        return {}, 204
    
class Signup(Resource):
    def post(self):
        signup_data = request.get_json()
        user = User(
            username=signup_data['username'],
            email=signup_data['email']
        )
        user.password_hash=signup_data['password']
        db.session.add(user)
        db.session.commit()
        user_record = User.query.filter(User.username == user.username).first()
        if not user_record:
            return {}, 422
        session['user_id'] = user_record.id
        return user_record.to_dict(), 201
    
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
            return user.to_dict(), 200
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
       coffees = [coffee.to_dict() for coffee in Coffee.query.all()]
       return jsonify(coffees), 200
    
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return {}, 401
        data = request.get_json()
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
        new_coffee_data = Coffee.query.filter_by(id=new_coffee.id).first().to_dict()
        return new_coffee_data, 201
    
class CoffeeByID(Resource):
    def get(self, id):
        coffee = Coffee.query.filter_by(id=id).first()
        if not coffee:
            return {}, 404
        return coffee.to_dict(), 200
    
    #PATCH and DELETE for admin and user created the coffee
    #check serialization rules to show coffee details inside coffee object 

class CoffeeByIDReviews(Resource):
    def get(self, coffee_id):
       session[coffee_id] = coffee_id
       reviews_meta = [review_meta.to_dict() for review_meta in ReviewMetadata.query.filter_by(coffee_id = coffee_id).all()]
       return jsonify(reviews_meta), 200
    
    def post(self, coffee_id):
        session[coffee_id] = coffee_id
        if not session.get(coffee_id):
            return {}, 418
        user_id = session.get('user_id')
        if not user_id:
            return {}, 401
        data = request.get_json()
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

        new_review_metadata = ReviewMetadata(
            is_public = data['is_public']
        )
        new_review_metadata.review_id = new_review.id
        new_review_metadata.coffee_id = session.get('coffee_id')
        new_review_metadata.user_id = session.get('user_id')
        db.session.add(new_review_metadata)
        db.session.commit()
        new_review_data = Review.query.filter_by(id=new_review.id).first().to_dict()
        return new_review_data, 201

class Users(Resource):
    def get(self):
       users = [user.to_dict(rules=('-_password_hash',)) for user in User.query.all()]
       return users, 200

class UserByID(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {}, 404
        return user.to_dict(rules=('-_password_hash',)), 200

class UserByIDReviews(Resource):
    def get(self, id):
       reviews_meta = [review_meta.to_dict() for review_meta in ReviewMetadata.query.filter_by(user_id = id).all()]
       return reviews_meta, 200


# class CoffeeByIDReviewByID(Resource):
#     pass

# class UserByIDCoffees(Resource):
#     def get(self):
#         user_id = session.get('user_id')
#         if not user_id:
#             return {}, 404

        
@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(ClearSession, '/clear', endpoint='clear')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Coffees, '/coffee', endpoint='coffees')
api.add_resource(CoffeeByID, '/coffee/<int:id>', endpoint='coffee')
# api.add_resource(ReviewIndex, '/review', endpoint='all-reviews')
# api.add_resource(ReviewByID, '/review/<int:id>', endpoint='one-review')
api.add_resource(Users, '/user', endpoint='users')
api.add_resource(UserByID, '/user/<int:id>', endpoint='user')
api.add_resource(UserByIDReviews, '/user/<int:id>/review', endpoint='user-reviews')
api.add_resource(CoffeeByIDReviews, '/coffee/<int:id>/review', endpoint='coffee-reviews')
# api.add_resource(CoffeeByIDReviewByID, '/coffee/<int:id>/review/<int:id>', endpoint='coffee-review')
# api.add_resource(UserByIDCoffees, '/coffee/<int:id>/review/<int:id>', endpoint='user-coffees')

if __name__ == '__main__':
    app.run(port=5555, debug=True)