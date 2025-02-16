import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
import CreateArtist from "./NewArtistForm";
import UserCities from "./UserCities";
import UserGenres from "./UserGenres";
// import "./UserProfile.css";

function UserProfile() {
  const { user, setArtists, isAuthenticated } = useContext(MyContext);
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
    if (!isAuthenticated && isAuthenticated === 1) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // const handleLogout = () => {
  //   fetch("/logout", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include", // include credentials for session cookies
  //   })
  //     .then((response) => {
  //       if (response.ok) {
  //         setUser(null); // Clear user data in context
  //         setIsAuthenticated(false); // Update the authentication state
  //         navigate("/login"); // Redirect to login page
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Logout failed:", err);
  //       alert("An error occurred during logout.");
  //     });
  // };

  const toggleCreateForm = () => {
    setShowCreateForm((prev) => {
      // Close any other views when CreateArtist form is toggled
      if (!prev) {
        setViewCities(false);
        setViewGenres(false);
      }
      return !prev;
    });
  };

  const toggleViewCities = () => {
    console.log("Toggling View Cities");
    setViewCities((prev) => {
      if (!prev) {
        setShowCreateForm(false); // close artist form
        setViewGenres(false); // close genres view
      }
      return !prev;
    });
  };

  const toggleViewGenres = () => {
    console.log("Toggling View Genres");
    setViewGenres((prev) => {
      if (!prev) {
        setShowCreateForm(false); // close artist form
        setViewCities(false); // close cities view
      }
      return !prev;
    });
  };

  useEffect(() => {
    console.log("User data:", user);
  }, [user]);
  useEffect(() => {
    console.log("User cities:", user.cities); // Debug log to check the cities data
  }, [user]); // Log whenever user data changes

  if (isAuthenticated !== 1 && !isAuthenticated) {
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
            {viewCities ? "Hide My Cities" : "View My Cities"}
          </button>

          <button onClick={toggleViewGenres}>
            {viewGenres ? "Hide My Genres" : "View My Genres"}
          </button>

          {/* <button onClick={handleLogout}>Logout</button> */}
        </div>
        <hr />
        <br />

        {/* Conditionally render sections below */}
        {showCreateForm && (
          <div className="form-section">
            <CreateArtist />
          </div>
        )}

        {/* Conditionally render Cities section */}
        {viewCities && (
          <div className={`section ${viewCities ? "section-show" : ""}`}>
            <h3>Select a City</h3>
            <UserCities />
          </div>
        )}

        {/* Conditionally render Genres section */}
        {viewGenres && (
          <div className={`section ${viewGenres ? "section-show" : ""}`}>
            <h3>Select a Genre</h3>
            <UserGenres />
          </div>
        )}
      </div>
    );
  }
}

export default UserProfile;
