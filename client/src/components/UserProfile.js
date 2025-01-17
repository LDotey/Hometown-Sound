import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
import CreateArtist from "./NewArtistForm";
import UserCities from "./UserCities";

function UserProfile() {
  const { user, setUser, isAuthenticated, setIsAuthenticated } =
    useContext(MyContext);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // include credentials for session cookies
    })
      .then((response) => {
        if (response.ok) {
          setUser(null); // Clear user data in context
          setIsAuthenticated(false); // Update the authentication state
          navigate("/login"); // Redirect to login page
        }
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        alert("An error occurred during logout.");
      });
  };

  const toggleCreateForm = () => {
    setShowCreateForm((prev) => !prev);
  };

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  } else if (!user) {
    return <div>Log in you loser</div>;
  } else {
    return (
      <div>
        <h1>Welcome {user.username}!</h1>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={toggleCreateForm}>
          {showCreateForm ? "Cancel" : "Add New Artist"}
        </button>
        {showCreateForm && <CreateArtist />}

        <UserCities />
      </div>
    );
  }
}

export default UserProfile;

/* <h2>Cities:</h2>
        <ul>
          {user.cities ? (
            user.cities.map((city) => <li key={city.id}>{city.name}</li>)
          ) : (
            <p>No cities associated with your profile.</p>
          )}
        </ul>
        <h2>Genres:</h2>
        <ul>
          {user.genres ? (
            user.genres.map((genre) => <li key={genre.id}>{genre.name}</li>)
          ) : (
            <p>No genres associated with your profile.</p>
          )}
        </ul> */
