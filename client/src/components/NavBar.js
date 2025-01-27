import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MyContext } from "./AppContext";

function NavBar() {
  const { isAuthenticated } = useContext(MyContext);

  useEffect(() => {
    console.log("authenticating!!", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <nav className="navbar">
      <NavLink to="/signup" activeclassname="active">
        Sign Up
      </NavLink>

      {/* Conditionally render Login or Profile link based on authentication */}
      {/* {if (isAuthenticated){
        return (<NavLink to="/profile" activeclassname="active">
        Profile
      </NavLink>)
      }} */}
      {isAuthenticated !== 1 && !isAuthenticated ? (
        <NavLink to="/login" activeclassname="active">
          Sign In
        </NavLink>
      ) : (
        <NavLink to="/profile" activeclassname="active">
          Profile
        </NavLink>
      )}
      <NavLink to="/genres" activeclassname="active">
        Genres
      </NavLink>
      <NavLink to="/cities" activeclassname="active">
        Cities
      </NavLink>
    </nav>
  );
}

export default NavBar;
