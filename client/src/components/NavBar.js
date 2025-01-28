import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MyContext } from "./AppContext";

function NavBar() {
  const { isAuthenticated, logoutUser } = useContext(MyContext);

  // useEffect(() => {
  //   console.log("authenticating!!", isAuthenticated);
  // }, [isAuthenticated]);

  return (
    <nav className="navbar">
      {isAuthenticated !== 1 && !isAuthenticated ? (
        <NavLink to="/signup" activeclassname="active">
          Sign Up
        </NavLink>
      ) : (
        <NavLink
          to="/logout" // This is still a `NavLink`, but it won't actually navigate anywhere.
          onClick={logoutUser}
          activeclassname="active"
        >
          LogOut
        </NavLink>
      )}

      {isAuthenticated !== 1 && !isAuthenticated ? (
        <NavLink to="/login" activeclassname="active">
          Sign In
        </NavLink>
      ) : (
        <NavLink to="/profile" activeclassname="active">
          Profile
        </NavLink>
      )}

      {isAuthenticated && (
        <>
          <NavLink to="/genres" activeclassname="active">
            Genres
          </NavLink>
          <NavLink to="/cities" activeclassname="active">
            Cities
          </NavLink>
        </>
      )}
    </nav>
  );
}

export default NavBar;
