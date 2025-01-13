import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <p>
        <NavLink to="/login">Login</NavLink>
      </p>
    </nav>
  );
}

export default NavBar;
