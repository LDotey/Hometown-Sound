#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource
from flask_login import current_user, login_user, logout_user, login_required, login_remembered
from copy import copy, deepcopy

# Local imports
from config import app, db, api, login_manager, bcrypt
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
    
    # def get(self):
    #     # breakpoint()
    #     users = [user.to_dict() for user in User.query.all()]
    #     return users, 200
    
    def post(self):
        data = request.get_json()
        if not data:
            print("No data received")
            return {"message": "No data received"}, 400

         # Hash the password using bcrypt
        hashed_password = bcrypt.generate_password_hash(data["password"]).decode('utf-8')

        # Create new user instance with hashed password
        new_user = User(
            username=data["username"],
            _password_hash=hashed_password  # Store the hashed password
        )
        db.session.add(new_user)
        db.session.commit()

        return new_user.to_dict(), 201

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
        # breakpoint()

        city_name = data.get("city_name")
        city_location = data.get("city_location")
        city_id = data.get("city_id")
        genre_id = data.get("genre_id")
        genre_name = data.get("genre_name")
        genre_color = data.get("genre_color")

        # check if city_id is provided, if not, create a new city
        if not city_id and city_name and city_location:
            city = City.query.filter_by(name=city_name).first()
            if not city:                
                city = City(name=city_name, location=city_location)
                # breakpoint()
                db.session.add(city)
                db.session.commit()
            city_id = city.id  # use the ID of the new or existing city

        if not genre_id and genre_name:
            genre = Genre.query.filter_by(name=genre_name).first()
            if not genre:
                genre = Genre(name=genre_name, color=genre_color)
                db.session.add(genre)
                db.session.commit()
            genre_id = genre.id
        
        # create the artist
        new_artist = Artist(
            name=data.get("name"),
            image=data.get("image"),
            user_id=data.get("user_id"),
            city_id=city_id,
            genre_id=genre_id,
        )
        
        db.session.add(new_artist)
        db.session.commit()

        return new_artist.to_dict(), 201

        # return {"message": "Artist created successfully"}, 201
    # def patch(self, id):
    #     data = request.get_json()
    #     artist = Artist.query.get(id)
    #     if not artist:
    #         return {"error": "Artist not found"}, 404
        
    #     artist.name = data.get("name", artist.name)
    #     artist.image = data.get("image", artist.image)
    #     artist.genre_id = data.get("genre_id", artist.genre_id)
    #     artist.city_id = data.get("city_id", artist.city_id)
        
    #     db.session.commit()
    
    #     return artist.to_dict(), 200
    def patch(self, id):
        data = request.get_json()
        artist = Artist.query.get(id)
               
        
        artist.name = data.get("name", artist.name)
        artist.image = data.get("image", artist.image)

        print("Incoming PATCH data:", data)

        artist.user_id = current_user.id     
        artist.city_id = data.get('city_id', artist.city_id)
        artist.genre_id = data.get('genre_id', artist.genre_id)

        # {"name": artist.name,
        #          "id": artist.id,
        #          "image": artist.image,
        #          "genre": artist.genre,
        #          "city_id": artist.city_id
        #          }

        # city = City.query.get(artist.city_id)
        # if city:
        #     artist.city = city.name

        # genre = Genre.query.get(artist.genre_id)  
        # if genre:
        #     artist.genre = genre.name  

        print("Updated artist genre:", artist.genre)  # Debugging
        
        db.session.commit()

        # artist = Artist.query.get(id)  # refresh ??

        print("Final artist object:", artist)

        return artist.to_dict(), 200

    # def patch(self, id):
    #     data= request.get_json()
    #     artist = Artist.query.get(id)
    #     if not artist:
    #         return {"error": "Artist not found"}, 404
        
    #     artist.name = data.get("name", artist.name)
    #     artist.image = data.get("image", artist.image)
    #     # artist.user_id = data.get("user_id", artist.user_id)
    #     artist.city_id = data.get("city_id", artist.city_id)
    #     artist.genre_id = data.get("genre_id", artist.genre_id)

    #     db.session.commit()

    #     return artist.to_dict(), 200
    
    def delete(self, id):
        artist = Artist.query.get(id)
        if not artist:
            return {"error": "Artist not found"}, 404
        
        db.session.delete(artist)
        db.session.commit()

        return {"message": "Artist deleted successfully", "id": id}
        
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
        if not current_user.is_authenticated:
            return {'message': 'User not authenticated'}, 401

        # init the response data structure
        user_data = {
            "id": current_user.id,
            "username": current_user.username,
            "cities": [],
            "genres": []
        }
       
        for city in current_user.cities:
            artists_in_city = [
                {"name": artist.name,
                 "id": artist.id,
                 "image": artist.image,
                 "genre": artist.genre,
                 "city_id": artist.city_id
                 }

                 for artist in city.artists if artist.user_id == current_user.id
            ]
            
            # populate the resp. data structure with each city instance
            # list of city objects (dictionaries)
            user_data["cities"].append({
                "id": city.id,
                "name": city.name,
                "location": city.location,
                "artists": artists_in_city
                # [artist.to_dict() for artist in artists_in_city]
            })
        
        for genre in current_user.genres:
            artists_in_genre = [
                artist for artist in genre.artists if artist.user_id == current_user.id
            ]
            user_data["genres"].append({
                "id": genre.id,
                "name": genre.name,
                "color": genre.color,
                "artists": [artist.to_dict() for artist in artists_in_genre]
            })

        return user_data, 200
    
# class CurrentUser(Resource):
#     @login_required 

#     def get(self):
#         # if current_user:
#         #      logout_user()
#         # logout_user()
#         # breakpoint()
#         print("Session data:", session)  
#         print("Current user:", current_user)  
#         print("Is authenticated?", current_user.is_authenticated)  

#         if current_user.is_authenticated:
#             user = {
#                 id: current_user.id,
#                 username: current_user.username,
#                 _password_hash: current_user._password_hash
#                 cities: []
#             }

#             # user = deepcopy(current_user)
#             # adjArtists = []
#             # cities = deepcopy(user.cities)
#             for cit in current_user.cities:
#                 append each cit in to fakeUser.cities
#                 # artists = cit.artists
#                 for art in cit.artists:
#                 # breakpoint()
#                     # if art.user_id == current_user.id:
#                         # adjArtists.append(art)
#                 adjArtists = [art for art in cit.artists if art.user_id == user.id]
#                 # breakpoint()
#                 cit.artists = adjArtists
#             breakpoint()
#             user_dict = user.to_dict()  
#             return user_dict, 200
#         else:
#             return {'message': 'User not authenticated'}, 401
        
        
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



            

api.add_resource(Users, '/users', '/signup')
api.add_resource(Cities, '/cities')
api.add_resource(Genres, '/genres')
api.add_resource(Artists, '/artists', '/artists/<int:id>')
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

