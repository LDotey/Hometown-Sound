import React, { createContext, useState, useEffect } from "react";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated when the app loads
    fetch("/current_user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setUser(data);
          setIsAuthenticated(true);
        }
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
        setIsAuthenticated(false);
      });
  }, []);

  return (
    <MyContext.Provider
      value={{ user, setUser, isAuthenticated, setIsAuthenticated }}
    >
      {children}
    </MyContext.Provider>
  );
};
export { MyContext, MyProvider };
