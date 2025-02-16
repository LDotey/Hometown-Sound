#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from config import bcrypt
from models import db, User, City, Genre, Artist

users_data = [
    {"username": "JoJo Chintoh", "_password_hash": "citytv416"},
    {"username": "Jeannie Becker", "_password_hash": "fashion123"},
    {"username": "Jessica Kate", "_password_hash": "jupiter"},
    {"username": "Vincent Moreno", "_password_hash": "christophe"}


]

cities_data = [
    {"name": "New York", "location": "New York"},
    {"name": "Boston", "location": "Massachusetts"},
    {"name": "Athens", "location": "Georgia"},
    {"name": "Chicago", "location":"Illinois"},
    {"name": "Houston", "location": "Texas"}
]

genres_data = [
    {"name": "Rock", "color": "Red"},
    {"name": "Pop", "color": "Green"},
    {"name": "Rap", "color": "Yellow"},
    {"name": "R&B", "color": "Purple"}
]

artists_data = [
    # {"name": "image": "user_id": "city_id": "genre_id":},
    {"name": "Patti Smith", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT47U7jWrLNskCtqOIWyDci4gYjXVdISfQO8w&s", "user_id":1, "city_id":1, "genre_id":1},
    {"name": "The Pixies", "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2egbVaX7A3IWEmz93dq0jj54C37E7C2gulQ&s", "user_id":1, "city_id":2, "genre_id":1},
    {"name": "REM", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa1IWuUFtwF27GkYBb1n-ured1r00rZaFYbA&s", "user_id":1, "city_id":3, "genre_id":1},
    {"name": "Biggie Smalls", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6RjomlgKTIfCgDCjYx4A6HKKiw4fobJ5Mhw&s", "user_id":1, "city_id":1, "genre_id":3},
    {"name": "Black Francis", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQev7XbfKu3UqQIrSLt17RqQp_1sexLZDQ7yFoL5k3f80g3eBAf", "user_id":1, "city_id":2, "genre_id":1},
    {"name": "The B-52's", "image": "https://bunny-wp-pullzone-cjamrcljf0.b-cdn.net/wp-content/uploads/2021/02/the-b-52_s_001-1024x1012.jpg", "user_id":1, "city_id":3, "genre_id":2},
    {"name": "Patti Smith", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT47U7jWrLNskCtqOIWyDci4gYjXVdISfQO8w&s", "user_id":2, "city_id":1, "genre_id":1},
    {"name": "The Pixies", "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2egbVaX7A3IWEmz93dq0jj54C37E7C2gulQ&s", "user_id":2, "city_id":2, "genre_id":1},
    {"name": "REM", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa1IWuUFtwF27GkYBb1n-ured1r00rZaFYbA&s", "user_id":2, "city_id":3, "genre_id":1},
    {"name": "Biggie Smalls", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6RjomlgKTIfCgDCjYx4A6HKKiw4fobJ5Mhw&s", "user_id":2, "city_id":1, "genre_id":3},
    {"name": "Black Francis", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQev7XbfKu3UqQIrSLt17RqQp_1sexLZDQ7yFoL5k3f80g3eBAf", "user_id":2, "city_id":2, "genre_id":1},
    {"name": "The B-52's", "image": "https://bunny-wp-pullzone-cjamrcljf0.b-cdn.net/wp-content/uploads/2021/02/the-b-52_s_001-1024x1012.jpg", "user_id":2, "city_id":3, "genre_id":2},
    # {"name": "image":"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Iggy_Pop_-_pinkpop87.jpg/220px-Iggy_Pop_-_pinkpop87.jpg" "user_id": "city_id": "genre_id":},
    # {"name": "image": "user_id": "city_id": "genre_id":},
    # {"name": "image": "user_id": "city_id": "genre_id":},
    # {"name": "image": "user_id": "city_id": "genre_id":},
    # {"name": "image": "user_id": "city_id": "genre_id":},
    # {"name": "image": "user_id": "city_id": "genre_id":},
    # {"name": "image": "user_id": "city_id": "genre_id":},
]

def seed_users():
    User.query.delete()
    users = []
    # hashed_password = bcrypt.generate_password_hash(user_data["password"]).decode('utf-8')


    for user_data in users_data:
        hashed_password = bcrypt.generate_password_hash(user_data["_password_hash"]).decode('utf-8')

        user = User(
            username=user_data['username'],
            _password_hash=hashed_password
        )
        users.append(user)
    db.session.add_all(users)
    db.session.commit()

    print(f"Seeded {len(users)} users for all users")


def seed_cities():
    City.query.delete()
    cities = []

    for city_data in cities_data:
        city = City(
            name=city_data['name'],
            location=city_data['location']
        )
        cities.append(city)
        db.session.add_all(cities)
        db.session.commit()

    print(f"Seeded {len(cities)} cities for all cities")

def seed_genres():
    Genre.query.delete()
    genres = []

    for genre_data in genres_data:
        genre = Genre(
            name=genre_data['name'],
            color=genre_data['color']
        )
        genres.append(genre)
        db.session.add_all(genres)
        db.session.commit()

    print(f"Seeded {len(genres)} genres for all genres")

def seed_artists():
    Artist.query.delete()
    artists = []

    for artist_data  in artists_data:
        artist = Artist(
            name=artist_data['name'],
            image=artist_data['image'],
            user_id=artist_data['user_id'],
            city_id=artist_data['city_id'],
            genre_id=artist_data['genre_id']
        )
        artists.append(artist)
        db.session.add_all(artists)
        db.session.commit()

    print(f"Seeded {len(artists)} artists for all artists")

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        seed_users()
        seed_cities()
        seed_genres()
        seed_artists()
