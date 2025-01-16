import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { MyContext } from "./AppContext";

function NavBar() {
  const { isAuthenticated } = useContext(MyContext);

  return (
    <nav className="navbar">
      {/* Conditionally render Login or Profile link based on authentication */}
      {isAuthenticated ? (
        <NavLink to="/profile" activeclassname="active">
          Profile
        </NavLink>
      ) : (
        <NavLink to="/login" activeclassname="active">
          Login
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
