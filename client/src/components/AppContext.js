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

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

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

  // *****************************************
  // users is an empty array. initial values
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
        // debugger;
        console.log("Updated artist:", updatedArtist);
        // });
        // const updatedArtist = {
        //   ...updatedArtistData,
        // };

        //  city and genre to update (check if they exist in the user's city/genre lists)
        let cityToUpdate = {
          ...user.cities.find((c) => c.id === updatedArtist.city_id),
        };
        let genreToUpdate = {
          ...user.genres.find((g) => g.id === updatedArtist.genre_id),
        };

        if (cityToUpdate && !cityToUpdate.artists) {
          cityToUpdate.artists = []; // initialize artists array
        }

        if (genreToUpdate && !genreToUpdate.artists) {
          genreToUpdate.artists = []; // initialize artists array
        }

        // update the artists data in the city and genre
        const updatedArtistsInCity = cityToUpdate.artists.map((artist) =>
          artist.id === updatedArtist.id ? updatedArtist : artist
        );

        const updatedArtistsInGenre = genreToUpdate.artists.map((artist) =>
          artist.id === updatedArtist.id ? updatedArtist : artist
        );

        cityToUpdate = { ...cityToUpdate, artists: updatedArtistsInCity };
        genreToUpdate = { ...genreToUpdate, artists: updatedArtistsInGenre };

        // update the city and genre with the updated artist
        // cityToUpdate.artists = updatedArtistsInCity;
        // genreToUpdate.artists = updatedArtistsInGenre;

        // update the user's cities and genres state
        const updatedUserCities = user.cities.map((city) =>
          city.id === cityToUpdate.id ? cityToUpdate : city
        );

        const updatedUserGenres = user.genres.map((genre) =>
          genre.id === genreToUpdate.id ? genreToUpdate : genre
        );

        const updatedUserState = {
          ...user,
          cities: updatedUserCities,
          genres: updatedUserGenres,
        };

        setUser(updatedUserState);
        setSelectedArtist(updatedArtist);

        // Log to confirm the update
        console.log("Updated user state:", updatedUserState);
      });
    // setUser({
    //   ...user,
    //   cities: updatedUserCities,
    //   genres: updatedUserGenres,
    // });
    // console.log("Updated user state:", {
    //   ...user,
    //   cities: updatedUserCities,
    //   genres: updatedUserGenres,
    // });
  };

  // fetch(`/artists/${id}`, {
  //   method: "PATCH",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(updatedArtistData),
  // })
  //   .then((response) => response.json())
  //   .then((updatedArtist) => {
  //     // console.log("Updated artist:", updatedArtist);

  //     const updatedUser = users.find(
  //       (user) => user.id === updatedArtist.user_id
  //     );
  //     console.log("Updated artist from PATCH response:", { updatedArtist });
  //     console.log({ users, updatedUser });

  //     // pdate the artist's data  for the logged-in user's artist
  //     if (updatedUser) {
  //       const updatedArtists = updatedUser.artists.map((artist) =>
  //         artist.id === updatedArtist.id ? updatedArtist : artist
  //       );
  //       console.log({ updatedArtists });

  //       //update users and artists state
  //       const updatedUsers = users.map((user) =>
  //         user.id === updatedArtist.user_id
  //           ? { ...updatedUser, artists: updatedArtists }
  //           : user
  //       );
  //       // console.log("Updated artist from PATCH response:", updatedArtist);
  //       console.log({ updatedUsers });

  //       setUsers(updatedUsers);
  //       setArtists(updatedArtists);
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("Error updating artist:", error);
  //   });

  // const updateArtist = (id, updatedArtistData) => {
  //   fetch(`/artists/${id}`, {
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(updatedArtistData),
  //   })
  //     .then((response) => response.json())
  //     .then((updatedArtist) => {
  //       console.log("Updated artist:", updatedArtist);
  //       console.log("Looking for user with user_id:", updatedArtist.user_id);
  //       console.log("Users array:", users);

  //       const updatedUser = users.find(
  //         (user) => user.id === updatedArtist.user_id
  //       );
  //       // Check if updatedUser exists and has artists property
  //       if (updatedUser && updatedUser.artists) {
  //         const updatedArtists = updatedUser.artists.map((artist) =>
  //           artist.id === updatedArtist.id ? updatedArtist : artist
  //         );
  //         updatedUser.artists = updatedArtists;

  //         const updatedUsers = users.map((user) =>
  //           user.id === updatedArtist.user_id ? updatedUser : user
  //         );

  //         // Update the users and artists state
  //         setUsers(updatedUsers);
  //         setArtists(updatedArtists);
  //       } else {
  //         console.error(
  //           "Error: updatedUser or updatedUser.artists is undefined"
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error updating artist:", error);
  //     });
  //   //   const updatedArtists = updatedUser.artists.map((artist) =>
  //   //     artist.id === updatedArtist.id ? updatedArtist : artist
  //   //   );
  //   //   updatedUser.artists = updatedArtists;
  //   //   const updatedUsers = users.map((user) =>
  //   //     user.id === updatedArtist.user_id ? updatedUser : user
  //   //   );
  //   //   setUsers(updatedUsers);
  //   //   setArtists(updatedArtists);
  //   // })
  //   // .catch((error) => {
  //   //   console.error("Error updating artist:", error);
  //   // });
  // };

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
    // debugger;
    let cityOfNewArtist = user.cities.find((c) => c.id === newArtist.city_id);

    // if (!cityOfNewArtist) {
    //   cityOfNewArtist = cities.find((c) => c.id === newArtist.city_id);
    if (!cityOfNewArtist) {
      // debugger;
      console.log("Creating new city for artist:", newArtist.city);
      cityOfNewArtist = {
        id: newArtist.city_id,
        name: newArtist.city.name,
        location: newArtist.city.location,
        artists: [],
      };

      // add new city to all cities
      cities.push(newArtist.city);
      user.cities.push(cityOfNewArtist);
    }

    let genreOfNewArtist = user.genres.find((g) => g.id === newArtist.genre_id);

    if (!genreOfNewArtist) {
      // debugger;
      console.log("Creating new genre for artist:", newArtist.genre);
      genreOfNewArtist = {
        id: newArtist.genre_id,
        name: newArtist.genre.name,
        color: generateRandomColor(),
        artists: [],
      };
      // add new genre to ALL genres
      genres.push(newArtist.genre);
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
