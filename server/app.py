#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource
from flask_login import current_user, login_user, logout_user, login_required, login_remembered

# Local imports
from config import app, db, api, login_manager
from flask_cors import CORS
 
# Add your model imports
from models import User, City, Genre, Artist


CORS(app)


# Views go here!
def capitalize_words(input_str):
    return ' '.join([word.capitalize() for word in input_str.split()])

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
    
    def post(self):
        data = request.get_json()

        # Capitalize the city name and location
        city_name = capitalize_words(data['name'])
        city_location = capitalize_words(data['location'])

        new_city = City(
            name=city_name,
            location=city_location        
        )
        
        db.session.add(new_city)
        db.session.commit()

        return new_city.to_dict(), 201
    
class Genres(Resource):
    def get(self):
        genres = [genre.to_dict() for genre in Genre.query.all()]
        return genres, 200
    
class Artists(Resource):
    def get(self):
        artists = [artist.to_dict() for artist in Artist.query.all()]
        return artists, 200
    
    def post(self):
        data = request.get_json()
        breakpoint()

        # Fetch or create city
        city_name = data.get("city_name")
        city_location = data.get("city_location")
        city = City.query.filter_by(name=city_name).first()

        if not city:
            # If city doesn't exist, create it
            city = City(name=city_name, location=city_location)
            db.session.add(city)
            db.session.commit()

        # Create the artist
        artist = Artist(
            name=data.get("artist_name"),
            image=data.get("artist_image"),
            user_id=current_user.id,
            city_id=city.id,
            genre_id=data.get("genre_id"),
        )
        
        db.session.add(artist)
        db.session.commit()

        return {"message": "Artist created successfully"}, 201
    
class ArtistsByCity(Resource):
    def get(self, user_id, city_id):

        user = User.query.filter(User.id == user_id).first()
        if not user:
            return {"message": "User not found"}, 404
        artists = Artist.query.filter(Artist.user_id == user.id, Artist.city_id == city_id).all()

        users_artists = [artist.to_dict() for artist in artists]

        return {'artists': users_artists}, 200
    

class ArtistsByGenre(Resource):
    def get(self, user_id, genre_id):

        user = User.query.filter(User.id == user_id).first()
        if not user:
            return {"message": "User not found"}, 404
        artists = Artist.query.filter(Artist.user_id == user.id, Artist.genre_id == genre_id).all()

        users_artists = [artist.to_dict() for artist in artists]

        return {'artists': users_artists}, 200

    
# class TrailsByHikerID(Resource):
#     def get(self, hiker_id):

#         trails = Trail.query.filter_by(hiker_id=hiker_id).all()
#         trails = [trail.to_dict() for trail in trails if trail.hiker_id==hiker_id]

#         return {'trails': trails}, 200
    
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

            print(current_user) # check if current user is set correctly
            print(session)
            print(user)

            return user.to_dict(rules=('-_password_hash',)), 201
        
        return {'message': 'Invalid credentials'}, 401
    
class Logout(Resource):
    @login_required
    def post(self):
        logout_user()
        session.clear()
        return {'message': 'Logged out successfully'}, 200
    

class CurrentUser(Resource):
    @login_required 

    def get(self):
        # if current_user:
        #      logout_user()
        # logout_user()
        # breakpoint()
        print("Session data:", session)  
        print("Current user:", current_user)  
        print("Is authenticated?", current_user.is_authenticated)  

        if current_user.is_authenticated:
            # breakpoint()
            user_dict = current_user.to_dict()  
            return user_dict, 200
        else:
            return {'message': 'User not authenticated'}, 401
        
class CheckSession(Resource):
    def get(self):
        # fetch the user based on the logged-in user's id
        user = User.query.filter(User.id == current_user.id).first()

        if not user:
            return {'message': 'User not found'}, 404

        # initialize lists to hold the filtered cities and genres (sets won't allow duplicates)
        user_cities = set()
        user_genres = set()

        # loop through the user's artists and collect their cities and genres
        for artist in user.artists:
            # Check if the artist's city belongs to the current user
            if artist.city and artist.city.id == artist.user_id:  # Corrected: check city for the user_id
                user_cities.add(artist.city)

            # Add the artist's genre to the set of user_genres
            if artist.genre:
                user_genres.add(artist.genre)

        # Return cities and genres associated with the user
        return {
            'cities': [{'id': city.id, 'name': city.name, 'location': city.location} for city in user_cities],
            'genres': [{'id': genre.id, 'name': genre.name, 'color': genre.color} for genre in user_genres]
        }, 200
    
class GenresByCity(Resource):
    @login_required
    def get(self, city_id):
        # Fetch the user
        user = User.query.filter(User.id == current_user.id).first()

        if not user:
            return {'message': 'User not found'}, 404

        #  a set to hold the genres
        genres_count = {}

        # Loop through the user's artists and collect genres for a specific city
        for artist in user.artists:
            if artist.city and artist.city.id == city_id:
                genre_name = artist.genre.name
                if genre_name in genres_count:
                    genres_count[genre_name] += 1
                else:
                    genres_count[genre_name] = 1

        # Return the genres and their counts
        return {
            'genres': [{'name': genre, 'count': count} for genre, count in genres_count.items()]
        }, 200



            

api.add_resource(Users, '/users')
api.add_resource(Cities, '/cities')
api.add_resource(Genres, '/genres')
api.add_resource(Artists, '/artists')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CurrentUser, '/current_user')
api.add_resource(CheckSession, '/checksession')
api.add_resource(GenresByCity, '/')
api.add_resource(ArtistsByCity, '/artists/user/<int:user_id>/city/<int:city_id>')
api.add_resource(ArtistsByGenre, '/artists/user/<int:user_id>/genre/<int:genre_id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)


        
        

        # bucket is artist
        # item is genre / city

#         Data Structure Mismatch:

# Ensure that the data you are sending 
# from the backend has the expected structure. 
# For example, if the backend is sending { cities: [] }, 
# your frontend code should be looking for user.cities.

# If the data structure changes 
# (for example, if it's wrapped in an additional object), 
# your frontend will need to adjust accordingly.

