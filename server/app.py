from flask import request, session
from flask_restful import Resource

from config import app, db, api
from models import User, ReviewMetadata, Review, Coffee, CoffeeProfile

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

if __name__ == '__main__':
    app.run(port=4000, debug=True)