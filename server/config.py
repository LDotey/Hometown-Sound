# Standard library imports

# Remote library imports
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from datetime import timedelta

# Local imports
# from models import User

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Instantiate Bcrypt
bcrypt = Bcrypt(app)

# Used for encrypting session cookies
app.secret_key = b'5:\xdd\x16\xf3\xd7\x8f\xfc\xeel\xbe\x84\x966\xaep'
app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Important for cross-origin requests
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)  # Adjust session timeout as needed


# Instantiate LoginManager
login_manager = LoginManager()
login_manager.init_app(app)

# # Flask-Login User Loader
# @login_manager.user_loader
# def load_user(user_id):
#     return db.session.get(User, int(user_id))

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app, supports_credentials=True)

