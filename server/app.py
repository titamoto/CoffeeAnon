from flask import request, session
from flask_restful import Resource
from config import app, db, api
from models import User, ReviewMetadata, Review, Coffee, CoffeeProfile


class ClearSession(Resource):
    def delete(self):
        session['user_id'] = None
        return {}, 204
    
class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            return {"id": user.to_dict()["id"],
                    "username": user.to_dict()["username"]}, 200
            # return user.to_dict(), 200
        return {"message" : "user is not signed in"}, 204
    
class Signup(Resource):
    def post(self):
        signup_data = request.get_json()
        user = User(
            username=signup_data['username'],
            email=signup_data['email']
        )
        emailUsed = User.query.filter_by(email=user.email).first()
        if emailUsed:
            return {}, 422
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
            # return user.to_dict(), 200
            return {"id": user.to_dict()["id"],
                    "username": user.to_dict()['username']}, 200
        return {}, 401
    
class Logout(Resource):
    def delete(self):
        print(session.get('user_id'))
        if session.get('user_id'):
            session['user_id'] = None
            return {}, 204
        session['user_id'] = None
        return {}, 401
    
class Coffees(Resource):
    def get(self):
       coffees = [coffee.to_dict() for coffee in Coffee.query.all()]
       return coffees, 200
    
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
        print(new_coffee_profile)
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

class CoffeeByIDReviews(Resource):
    #get all review for this coffee
    def get(self, id):
       session['coffee_id'] = id
       reviews_meta = [review_meta.to_dict(rules=('-user',)) for review_meta in ReviewMetadata.query.filter_by(coffee_id = id).all()]
       return reviews_meta, 200
    
    # delete review for this coffee
    def delete(self, id):
        session["coffee_id"] = id
        if not session.get("coffee_id"):
             return {}, 403
        user_id = session.get('user_id')
        if not user_id:
            return {}, 401
        review_metadata = ReviewMetadata.query.filter_by(coffee_id=id).first()
        if not review_metadata:
            return {}, 404
        review = Review.query.filter_by(id=review_metadata.review_id).first()
        if not review:
            return {}, 404
        db.session.delete(review)
        db.session.commit()
        db.session.delete(review_metadata)
        db.session.commit()
        return {}, 204

    #create a new review for this coffee
    def post(self, id):
        session["coffee_id"] = id
        if not session.get("coffee_id"):
             return {}, 403
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
        db.session.commit()
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
    
    # edit review for this coffee
    def patch(self, id):
        session["coffee_id"] = id
        if not session.get("coffee_id"):
             return {}, 403
        user_id = session.get('user_id')
        if not user_id:
            return {}, 401
        data = request.get_json()
        if 'rate' not in data:
            return {}, 422
        review_metadata = ReviewMetadata.query.filter_by(coffee_id=id).first()
        if not review_metadata:
            return {}, 404
        review = Review.query.filter_by(id=review_metadata.review_id).first()
        if not review:
            return {}, 404
        for attr in data:
            setattr(review, attr, data[attr])
        db.session.add(review)
        db.session.commit()
        review2 = Review.query.filter_by(id=review_metadata.review_id).first()
        return review2.to_dict(), 202

class CoffeeByIDAverage(Resource):
    def get(self, id):
        session["coffee_id"] = id
        if not session.get("coffee_id"):
             return {}, 403
        reviews_meta = [review_meta.to_dict(rules=('-user',)) for review_meta in ReviewMetadata.query.filter_by(coffee_id = id).all()]
        rates = [review_meta['review']['rate'] for review_meta in reviews_meta]
        if len(rates) <= 0:
            return {"average_rate": 0}, 200
        average = sum(rates) / len(rates)
        return {"average_rate": average}, 200
          

class Users(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {}, 401
        users = [user.to_dict(rules=('-_password_hash',)) for user in User.query.all()]
        return users, 200

class UserByID(Resource):
    def get(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {}, 401
        user = User.query.filter_by(id=id).first()
        if not user:
            return {}, 404
        return user.to_dict(rules=('-_password_hash',)), 200

class UserByIDReviews(Resource):
    #all reviews left by this user
    def get(self):
        print(session)
        id = session.get('user_id')
        if not id:
            return {}, 401
        reviews_meta = [review_meta.to_dict(rules=('-user',)) for review_meta in ReviewMetadata.query.filter_by(user_id = id).all()]
        return reviews_meta, 200

        
@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(ClearSession, '/clear', endpoint='clear')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Coffees, '/coffees', endpoint='coffees')
api.add_resource(CoffeeByID, '/coffees/<int:id>', endpoint='coffee')
api.add_resource(Users, '/users', endpoint='users')
api.add_resource(UserByID, '/users/<int:id>', endpoint='user')
api.add_resource(UserByIDReviews, '/user-reviews', endpoint='user-reviews')
api.add_resource(CoffeeByIDReviews, '/coffees/<int:id>/reviews', endpoint='coffee-reviews')
api.add_resource(CoffeeByIDAverage, '/coffees/<int:id>/reviews/average', endpoint='coffee-reviews-average')

if __name__ == '__main__':
    app.run(port=5555, debug=True)