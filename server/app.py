#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource
from flask_login import current_user, login_user, logout_user, login_required

# Local imports
from config import app, db, api, login_manager
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
        # breakpoint()
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
    
class Login(Resource):
    def post(self):
        json = request.get_json()
        username = json.get('username')
        password = json.get('password')

        if not username:
            return {'message': 'Username required'}, 400
        if not password:
            return {'message': 'Password required'}, 400
        
        user = User.query.filter_by(username=username).first()
        # user = User.query.first()

        # login_user() sets the ID in the session and marks them as authenticated
        if user and user.check_password(password):
            login_user(user, remember=True)

            return user.to_dict(rules=('-_password_hash',)), 201
        
        return {'message': 'Invalid credentials'}, 401
    
class Logout(Resource):
    @login_required
    def post(self):
        logout_user()
        return {'message': 'Logged out successfully'}, 200
    
# @login_required
class CurrentUser(Resource):
    @login_required
    def get(self):
        breakpoint()
        if current_user.is_authenticated:
            user_dict = current_user.to_dict()

            return user_dict, 200
        else:
            return False

api.add_resource(Users, '/users')
api.add_resource(Cities, '/cities')
api.add_resource(Genres, '/genres')
api.add_resource(Artists, '/artists')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CurrentUser, '/current_user')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

