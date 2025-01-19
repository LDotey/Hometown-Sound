import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
import CreateArtist from "./NewArtistForm";
import UserCities from "./UserCities";
import UserGenres from "./UserGenres";
// import "./UserProfile.css";

function UserProfile() {
  const { user, setUser, setArtists, isAuthenticated, setIsAuthenticated } =
    useContext(MyContext);
  const [viewCities, setViewCities] = useState(false);
  const [viewGenres, setViewGenres] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  // Clear artists list when switching views (Cities/Genres)
  useEffect(() => {
    console.log("Clearing artists due to view change");
    setArtists([]); // Clear the artists whenever the view is changed
  }, [viewCities, setArtists]);

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

  const toggleViewCities = () => {
    console.log("Toggling View Cities");
    setViewCities((prev) => {
      console.log("Previous viewCities:", prev);
      return !prev; // Toggle the viewCities state
    });
    setViewGenres(false); // Hide genres when switching to cities
  };

  const toggleViewGenres = () => {
    console.log("Toggling View Genres");
    setViewGenres((prev) => {
      console.log("Previous viewGenres:", prev);
      return !prev; // Toggle the viewGenres state
    });
    setViewCities(false); // Hide cities when switching to genres
  };
  // const toggleViewCities = () => {
  //   setViewCities(true); // Set cities to visible
  //   setViewGenres(false); // Hide genres when switching to cities
  // };

  // const toggleViewGenres = () => {
  //   setViewGenres(true); // Set genres to visible
  //   setViewCities(false); // Hide cities when switching to genres
  // };

  // const toggleViewCities = () => {
  //   console.log("Toggling to Cities");
  //   setViewCities(true); // Show Cities view
  //   setArtists([]); // Clear the artists when switching views
  // };

  // const toggleViewGenres = () => {
  //   console.log("Toggling to Genres");
  //   setViewCities(false); // Show Genres view
  //   setArtists([]); // Clear the artists when switching views
  // };
  useEffect(() => {
    console.log("User data:", user);
  }, [user]);
  useEffect(() => {
    console.log("User cities:", user.cities); // Debug log to check the cities data
  }, [user]); // Log whenever user data changes

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

          {/* Always visible toggle buttons for Cities and Genres */}
          <button onClick={toggleViewCities}>
            {viewCities ? "Hide Cities" : "View Cities"}
          </button>

          <button onClick={toggleViewGenres}>
            {viewGenres ? "Hide Genres" : "View Genres"}
          </button>

          <button onClick={handleLogout}>Logout</button>
        </div>

        {/* Conditionally render sections below */}
        {showCreateForm && (
          <div className="form-section">
            <CreateArtist />
          </div>
        )}

        {/* Conditionally render Cities section */}
        {viewCities && (
          <div className={`section ${viewCities ? "section-show" : ""}`}>
            <h2>Select a City</h2>
            <UserCities />
          </div>
        )}

        {/* Conditionally render Genres section */}
        {viewGenres && (
          <div className={`section ${viewGenres ? "section-show" : ""}`}>
            <h2>Select a Genre</h2>
            <UserGenres />
          </div>
        )}
      </div>
    );
  }
}

export default UserProfile;
