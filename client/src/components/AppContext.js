import React, { createContext, useState, useEffect } from "react";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [user, setUser] = useState({
    cities: [],
    genres: [],
    userFetchedFlag: false,
  });
  const [users, setUsers] = useState([]);

  const [cities, setCities] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [artists, setArtists] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);

  // Check if user is logged in after the component mounts
  useEffect(() => {
    fetch("/current_user", {
      method: "GET",
      credentials: "include", // send cookies with the request
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.username) {
          // if user data is found, set the user and mark as authenticated
          setUser(data);
          setIsAuthenticated(true);
        } else {
          // if not, reset the user and mark as not authenticated
          setUser({ cities: [], genres: [] });
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
        setIsAuthenticated(false); // in case the user is not logged in
      });
  }, []);

  useEffect(() => {
    // Fetch the current logged-in user
    fetch("/current_user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Current User Data:", data);

        if (data) {
          setUser({
            ...data,
            cities: data.cities || [],
            genres: data.genres || [],
          });
          setIsAuthenticated(true);
        }
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
        setIsAuthenticated(false);
      });
  }, []);
  useEffect(() => {
    console.log(user); // Check if cities and genres are in the user state
  }, [user]);

  useEffect(() => {
    fetch("/cities")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("Error fetching cities:", err));
  }, []);

  useEffect(() => {
    fetch("/genres")
      .then((response) => response.json())
      .then((data) => setGenres(data))
      .catch((err) => console.error("Error fetching genres:", err));
  }, []);

  return (
    <MyContext.Provider
      value={{
        user,
        setUser,
        users,
        setUsers,
        cities,
        setCities,
        genres,
        setGenres,
        artists,
        setArtists,
        selectedCity,
        setSelectedCity,
        selectedGenre,
        setSelectedGenre,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
export { MyContext, MyProvider };

// useEffect(() => {
//   // Check if the user is authenticated when the app loads
//   fetch("/current_user", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (data) {
//         setUser(data);
//         setIsAuthenticated(true);
//       }
//     })
//     .catch((err) => {
//       console.error("Error fetching current user:", err);
//       setIsAuthenticated(false);
//     });
// }, []);
