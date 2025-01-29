# Hometown Sound

The **Hometown Sound** App is a web application built with Flask and SQLAlchemy that allows users to create a profile of their musical artist collection. Artists are grouped by city and genre, enabling users to explore the geographical and genre-based diversity of their favorite music.

Users can track and visualize the concentration of artists from different cities and genres. Future features include a geo-location tool to display a heatmap-style visualization of where users' favorite sounds originate, encouraging exploration of music from around the world.

## Features

**User Authentication:** Users can sign up and log in to manage their collection.

**Manage Artists:** Add, view, edit, and delete musical artists.

**Organize by City & Genre**: Group artists by their city of origin and music genre.

**RESTful API:** All interactions (CRUD operations) are available via a RESTful API.

**Future Enhancements:** Geo-location tool with visualizations of music concentrations (heatmap).

## Tech Stack

### Backend

- **Python** 3.x

- **Flask** – Web framework for building the app.

- **Flask-SQLAlchemy** – ORM for interacting with the database.

- **Flask-Login** – For managing user authentication and session management.
- **Flask-Cors** – For enabling cross-origin requests.

### Database

- **SQLite** - For storing artist, city, and genre data.

### API

- **Flask-RESTful** – For creating RESTful APIs.

### Migrations

- **Flask-Migrate** – Database schema migrations.

### Security & Authentication

**Flask-Bcrypt** – For securely hashing user passwords.

**bcrypt** – Low-level password hashing library.

### Development Tools

**Faker** – For generating fake data (optional, if used for testing or development).

**Alembic** – Database migration tool used by Flask-Migrate.

## Installation

**Prerequisites**  
Make sure you have **Python 3.x** and **pip** installed on your system.

**Steps to SetUp**

1. Clone this repository
2. Create a virtual environment
   ```
   pipenv install && pipenv start
   ```
3. Install the required dependencies

   ```
   pip install -r requirements.txt
   ```

4. Initialize the database

   ```
    flask db init
    flask db migrate
    flask db upgrade
   ```

5. cd into the server directory and run the app

   ```
   cd server
   flask run
   ```

   This will run the app on http://127.0.0.1:5555/

6. In a new terminal cd into the client directory to install the front-end dependencies and to run the React app
   ```
   cd client
   npm install
   npm start
   ```
   The webpage should be running at http://localhost:3000

## Usage

- **Sign Up / Log In:** Create an account or log in to start managing your music collection.

* **CRUD Operations:**
  - **Add:** Add new artists, cities, and genres.
  - **View:** Browse your collection by city or genre.
  - **Edit:** Modify existing artist or city entries.
  - **Delete:** Remove artists, cities, or genres.

## Contributing

We welcome contributions to Hometown Sound! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Push your changes to your forked repository.
5. Open a pull request.
