from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from flask_login import UserMixin

from config import db, bcrypt, login_manager

# Models go here!

class User(db.Model, UserMixin, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)

    artists = db.relationship('Artist', back_populates='user')

    def set_password(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)

    # Flask-Login required properties:
    def get_id(self):
        return str(self.id)
    
    @property
    def is_authenticated(self):
        return True
    
    @property
    def is_active(self):
        return True
    
    @property
    def is_anonymous(self):
        return False
     
      # Flask-Login User Loader
    @login_manager.user_loader
    def load_user(user_id):
        
        return db.session.get(User, int(user_id))   

    


    def __repr__(self):
        return f'<User {self.id}, {self.username}>'

class City(db.Model, SerializerMixin):
    __tablename__ = "cities"
    serialize_rules = ('-artists',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    location = db.Column(db.String)

    artists = db.relationship('Artist', back_populates='city')


    def __repr__(self):
        return f'<City {self.id}, {self.name}, {self.location}>'
    

class Genre(db.Model, SerializerMixin):
    __tablename__ = "genres"
    serialize_rules = ('-artists',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    color = db.Column(db.String)

    artists = db.relationship('Artist', back_populates='genre')

    

    def __repr__(self):
        return f'<Genre {self.id}, {self.name}, {self.color}>'
    

class Artist(db.Model, SerializerMixin):
    __tablename__ = "artists"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    # album = db.Column(db.String)
    image = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey('cities.id'), nullable=False)
    genre_id = db.Column(db.Integer, db.ForeignKey('genres.id'), nullable=False)
    
    user = db.relationship('User', back_populates='artists')
    city = db.relationship('City', back_populates='artists')
    genre = db.relationship('Genre', back_populates='artists')

    serialize_rules = ('-user', '-user.artists', '-city.artists', '-genre.artists', '-genre_id', '-user_id', '-user.username')

    def __repr__(self):
        return f'<Artist {self.id}, User: {self.user_id}, City: {self.city_id}, Genre: {self.genre_id}'
    