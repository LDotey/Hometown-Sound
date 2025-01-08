#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
from flask_cors import CORS
 
# Add your model imports
from models import User, City, Genre, Artist


CORS(app)


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return users, 200


class Cities(Resource):
    def get(self):
        cities = [city.to_dict() for city in City.query.all()]
        return cities, 200
    
class Genres(Resource):
    def get(self):
        genres = [genre.to_dict() for genre in Genre.query.all()]
        return genres, 200
    
class Artists(Resource):
    def get(self):
        artists = [artist.to_dict() for artist in Artist.query.all()]
        return artists, 200

api.add_resource(Users, '/users')
api.add_resource(Cities, '/cities')
api.add_resource(Genres, '/genres')
api.add_resource(Artists, '/artists')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

