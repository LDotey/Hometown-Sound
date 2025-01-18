import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
import CreateArtist from "./NewArtistForm";
import UserCities from "./UserCities";
import UserGenres from "./UserGenres";

function UserProfile() {
  const { user, setUser, isAuthenticated, setIsAuthenticated } =
    useContext(MyContext);
  const [showCities, setShowCities] = useState(false); // State for Cities section
  const [showGenres, setShowGenres] = useState(false); // State for Genres section
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

  const toggleCities = () => {
    setShowCities((prev) => !prev); // Toggle Cities section visibility
  };

  const toggleGenres = () => {
    setShowGenres((prev) => !prev); // Toggle Genres section visibility
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

        <div>
          <h2
            onClick={toggleCities}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {showCities ? "Hide Cities" : "Show Cities"}
          </h2>
          {showCities && <UserCities />}
        </div>

        <div>
          <h2
            onClick={toggleGenres}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {showGenres ? "Hide Genres" : "Show Genres"}
          </h2>
          {showGenres && <UserGenres />}
        </div>
      </div>
    );
  }
}

export default UserProfile;
