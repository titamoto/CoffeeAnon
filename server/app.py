from flask import request, session, jsonify
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
    
class CoffeeIndex(Resource):
    def get(self):
       coffees = [coffee.to_dict() for coffee in Coffee.query.all()]
       return jsonify(coffees), 200
    
    def post(self):
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
        new_coffee_data = Coffee.query.filter(id == new_coffee.id).first().to_dict()
        return new_coffee_data, 201

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(ClearSession, '/clear', endpoint='clear')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CoffeeIndex, '/coffee', endpoint='all-coffees')
api.add_resource(CoffeeByID, '/coffee/<int:id>', endpoint='one-coffee')
api.add_resource(ReviewIndex, '/review/<int:id>', endpoint='all-reviews')
api.add_resource(ReviewByID, '/review/<int:id>', endpoint='one-review')
api.add_resource(UserIndex, '/user/<int:id>', endpoint='all-users')
api.add_resource(UserByID, '/user/<int:id>', endpoint='one-user')
api.add_resource(OneUserReviews, '/user/<int:id>/review', endpoint='one-user-reviews')
api.add_resource(OneCoffeerReviews, '/coffee/<int:id>/review', endpoint='one-coffee-reviews')

if __name__ == '__main__':
    app.run(port=5555, debug=True)