import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
import CreateArtist from "./NewArtistForm";
import UserCities from "./UserCities";
import UserGenres from "./UserGenres";
// import "./UserProfile.css";

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
      <div className="profile-container">
        <h1>Welcome {user.username}!</h1>
        {/* Buttons Row */}
        <div className="profile-buttons">
          <button onClick={toggleCreateForm}>
            {showCreateForm ? "Cancel" : "Add New Artist"}
          </button>

          <button onClick={toggleCities}>
            {showCities ? "Hide Cities" : "Show Cities"}
          </button>

          <button onClick={toggleGenres}>
            {showGenres ? "Hide Genres" : "Show Genres"}
          </button>

          <button onClick={handleLogout}>Logout</button>
        </div>

        {/* Conditionally render sections below */}
        {showCreateForm && (
          <div className="form-section">
            <CreateArtist />
          </div>
        )}

        {showCities && (
          <div className={`section ${showCities ? "section-show" : ""}`}>
            <UserCities />
          </div>
        )}

        {showGenres && (
          <div className={`section ${showGenres ? "section-show" : ""}`}>
            <UserGenres />
          </div>
        )}
      </div>
    );
  }
}

export default UserProfile;
