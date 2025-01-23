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
  const [selectedArtist, setSelectedArtist] = useState(null);

  // check if user is logged in after the component mounts
  //'/current_user'
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

  // useEffect(() => {
  //   // Fetch the current logged-in user
  //   fetch("/current_user", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Current User Data:", data);

  //       if (data) {
  //         setUser({
  //           ...data,
  //           cities: data.cities || [],
  //           genres: data.genres || [],
  //         });
  //         setIsAuthenticated(true);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching current user:", err);
  //       setIsAuthenticated(false);
  //     });
  // }, []);

  useEffect(() => {
    console.log(user); // Check if cities and genres are in the user state
  }, [user]);

  // '/cities'
  useEffect(() => {
    fetch("/cities")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("Error fetching cities:", err));
  }, []);
  // '/genres'
  useEffect(() => {
    fetch("/genres")
      .then((response) => response.json())
      .then((data) => setGenres(data))
      .catch((err) => console.error("Error fetching genres:", err));
  }, []);

  const updateArtist = (id, updatedArtistData) => {
    fetch(`/artists/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedArtistData),
    })
      .then((response) => response.json())
      .then((updatedArtist) => {
        const updatedUser = users.find(
          (user) => user.id === updatedArtist.user_id
        );
        const updatedArtists = updatedUser.artists.map((artist) =>
          artist.id === updatedArtist.id ? updatedArtist : artist
        );
        updatedUser.artists = updatedArtists;
        const updatedUsers = users.map((user) =>
          user.id === updatedArtist.user_id ? updatedUser : user
        );
        setUsers(updatedUsers);
        setArtists(updatedArtists);
      })
      .catch((error) => {
        console.error("Error updating artist:", error);
      });
  };

  const deleteArtist = (id) => {
    fetch(`/artists/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("deleted artist response:", data);

        if (data.message === "Artist deleted successfully") {
          const updatedUsers = users.map((user) => {
            if (user.id === data.user_id) {
              // filter out the deleted artist from the user's artists array
              user.artists = user.artists.filter((artist) => artist.id !== id);
            }
            return users;
          });
          console.log("updated Users after deleting artist:", updatedUsers);
          setUsers(updatedUsers);

          const updatedArtists = artists.filter((artist) => artist.id !== id);
          setArtists(updatedArtists);
        } else {
          console.error("failed to delete artist:", data);
        }
      })
      .catch((error) => {
        console.error("Error deleting artist:", error);
      });
  };

  const addArtist = (newArtist) => {
    let cityOfNewArtist = user.cities.find((c) => c.id === newArtist.city_id);

    // if (!cityOfNewArtist) {
    //   cityOfNewArtist = cities.find((c) => c.id === newArtist.city_id);
    if (!cityOfNewArtist) {
      console.log("Creating new city for artist:", newArtist.city);
      cityOfNewArtist = {
        id: newArtist.city_id,
        name: newArtist.city.name,
        location: newArtist.city.location,
        artists: [],
      };

      // add new city to all cities
      cities.push(cityOfNewArtist);
      user.cities.push(cityOfNewArtist);
    }
    // ADD city to users cities
    if (cityOfNewArtist) {
      user.cities.push(cityOfNewArtist);
    }

    let genreOfNewArtist = user.genres.find((g) => g.id === newArtist.genre_id);

    if (!genreOfNewArtist) {
      console.log("Creating new genre for artist:", newArtist.genre);
      genreOfNewArtist = {
        id: newArtist.genre_id,
        name: newArtist.genre.name,
        color: newArtist.genre.color,
        artists: [],
      };
      // add new genre to ALL genres
      genres.push(genreOfNewArtist);
      user.genres.push(genreOfNewArtist);
    }
    // add genre to users genres
    if (genreOfNewArtist) {
      user.genres.push(genreOfNewArtist);
    }

    const updatedArtists = [
      ...cityOfNewArtist.artists,
      {
        id: newArtist.id,
        name: newArtist.name,
        image: newArtist.image,
        genre: newArtist.genre.name,
        city_id: newArtist.city_id,
        genre_id: newArtist.genre_id,
      },
    ];

    const updatedUserCity = { ...cityOfNewArtist, artists: updatedArtists };
    const updatedUserCities = user.cities.map((c) =>
      c.id === updatedUserCity.id ? updatedUserCity : c
    );
    const updatedUserGenre = { ...genreOfNewArtist, artists: updatedArtists };
    const updatedUserGenres = user.genres.map((g) =>
      g.id === updatedUserGenre.id ? updatedUserGenre : g
    );
    // debugger;

    setUser({
      ...user,
      cities: updatedUserCities,
      genres: updatedUserGenres,
    });

    // // check if the genre already exists using filter
    // const genreExists =
    //   user.genres.filter((genre) => genre.id === newArtist.genre_id).length ===
    //   0;
    // if (genreExists) {
    //   const artistGenre = genres.find(
    //     (genre) => genre.id === newArtist.genre_id
    //   );
    //   user.genres = [...user.genres, artistGenre];
    // }

    // // add the new artist to the artists array
    // user.artists = [...user.artists, newArtist];

    // setUser(user);
  };

  return (
    <MyContext.Provider
      value={{
        addArtist,
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
        selectedArtist,
        setSelectedArtist,
        selectedCity,
        setSelectedCity,
        selectedGenre,
        setSelectedGenre,
        isAuthenticated,
        setIsAuthenticated,
        updateArtist,
        deleteArtist,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
export { MyContext, MyProvider };
