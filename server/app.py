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