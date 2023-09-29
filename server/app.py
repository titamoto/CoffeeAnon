from flask import request, session
from flask_restful import Resource

from config import app, db, api
from models import User, ReviewMetadata, Review, Coffee, CoffeeProfile




@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(ClearSession, '/clear', endpoint='clear')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Coffee, '/coffee', endpoint='all-coffees')
api.add_resource(CoffeeByID, '/coffee/<int:id>', endpoint='one-coffee')
api.add_resource(Review, '/review/<int:id>', endpoint='all-reviews')
api.add_resource(ReviewByID, '/review/<int:id>', endpoint='one-review')
api.add_resource(User, '/user/<int:id>', endpoint='all-users')
api.add_resource(UserByID, '/user/<int:id>', endpoint='one-user')
api.add_resource(OneUserReviews, '/user/<int:id>/review', endpoint='one-user-reviews')
api.add_resource(OneCoffeerReviews, '/coffee/<int:id>/review', endpoint='one-coffee-reviews')

if __name__ == '__main__':
    app.run(port=5555, debug=True)