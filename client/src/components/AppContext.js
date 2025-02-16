import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const [isAuthenticated, setIsAuthenticated] = useState(1);
  const [artists, setArtists] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const navigate = useNavigate();

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

  const logoutUser = (e) => {
    e.preventDefault();
    // const handleLogout = () => {
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

  const updateArtist = (artist, updatedArtistData) => {
    const { name, image } = updatedArtistData;

    fetch(`/artists/${artist.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, image }),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedArtist = data;
        console.log("Updated artist:", updatedArtist);

        let adjUser = { ...user };

        // Step 1: Update the artist in the user's city
        adjUser.cities = adjUser.cities.map((city) => {
          if (city.id === artist.city_id) {
            city.artists = city.artists.map((art) =>
              art.id === updatedArtist.id ? updatedArtist : art
            );
          }
          return city;
        });

        // Step 2: Ensure adjUser.artists is always an array
        adjUser.artists = Array.isArray(adjUser.artists)
          ? adjUser.artists.map((art) =>
              art.id === updatedArtist.id ? updatedArtist : art
            )
          : [updatedArtist]; // If adjUser.artists was undefined, initialize it

        // Step 3: Update the user state with the new artist data
        console.log("Updated User:", adjUser);

        setUser(adjUser); // Update user state with the modified data
        setSelectedArtist(updatedArtist); // Update selected artist in the state

        // Step 4: Update the artists state (for the UserCities page) to reflect the changes
        setArtists((prevArtists) =>
          prevArtists.map((art) =>
            art.id === updatedArtist.id ? updatedArtist : art
          )
        );

        console.log("Artists after update:", adjUser.artists);
      })
      .catch((error) => console.error("Error updating artist:", error));
  };

  const deleteArtist = (id) => {
    fetch(`/artists/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete artist");
        }
        return response.json();
      })
      .then((data) => {
        console.log("deleted artist response:", data);

        if (data.message === "Artist deleted successfully") {
          // Assuming `artists` is an array in the state, let's filter it out
          const updatedArtists = artists.filter((artist) => artist.id !== id);

          // Now update the state for artists
          setArtists(updatedArtists); // This should trigger a re-render for the artist list

          // Additional logic to clean up users, cities, genres (keeping this)
          const updatedUsers = users.map((user) => {
            if (user.id === data.user_id) {
              user.artists = user.artists.filter((artist) => artist.id !== id);
            }
            return user;
          });

          const updatedCities = user.cities
            .map((city) => {
              city.artists = city.artists.filter((artist) => artist.id !== id);

              if (city.artists.length === 0) {
                return null; // marks city for removal
              }

              return city;
            })
            .filter((city) => city !== null);

          const updatedGenres = user.genres
            .map((genre) => {
              genre.artists = genre.artists.filter(
                (artist) => artist.id !== id
              );

              if (genre.artists.length === 0) {
                return null; // marks genre for removal
              }

              return genre;
            })
            .filter((genre) => genre !== null);

          // Update the global users and cities/genres state
          setUsers(updatedUsers);
          setUser({
            ...user,
            cities: updatedCities,
            genres: updatedGenres,
          });
        } else {
          console.error("Failed to delete artist:", data);
        }
      })
      .catch((error) => {
        console.error("Error deleting artist:", error);
      });
  };

  // const deleteArtist = (id) => {
  //   fetch(`/artists/${id}`, {
  //     method: "DELETE",
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to delete artist");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("deleted artist response:", data);

  //       if (data.message === "Artist deleted successfully") {
  //         // update users' artists
  //         const updatedUsers = users.map((user) => {
  //           if (user.id === data.user_id) {
  //             user.artists = user.artists.filter((artist) => artist.id !== id);
  //           }
  //           return user;
  //         });

  //         // update cities
  //         const updatedCities = user.cities
  //           .map((city) => {
  //             city.artists = city.artists.filter((artist) => artist.id !== id);

  //             // remove city if there are no artists left
  //             if (city.artists.length === 0) {
  //               return null; // this marks city for removal
  //             }

  //             return city; // Keep city if there are  artists
  //           })
  //           .filter((city) => city !== null); // filter out  cities marked for removal

  //         //update genres
  //         const updatedGenres = user.genres
  //           .map((genre) => {
  //             genre.artists = genre.artists.filter(
  //               (artist) => artist.id !== id
  //             );

  //             //remove genre if there are no artists left
  //             if (genre.artists.length === 0) {
  //               return null; // mark  for removal
  //             }

  //             return genre; // keep genre if there are  artists
  //           })
  //           .filter((genre) => genre !== null);

  //         // update the users state with the cleaned-up data
  //         setUsers(updatedUsers);

  //         // update the cities and genres for the user
  //         setUser({
  //           ...user,
  //           cities: updatedCities,
  //           genres: updatedGenres,
  //         });

  //         // update the artists state
  //         const updatedArtists = artists.filter((artist) => artist.id !== id);
  //         setArtists(updatedArtists);

  //         console.log("Updated user data after artist deletion:", user);
  //       } else {
  //         console.error("Failed to delete artist:", data);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error deleting artist:", error);
  //     });
  // };

  // const addArtist = (newArtist) => {
  //   // Get city using city_id from the user.cities array
  //   let cityOfNewArtist = user.cities.find((c) => c.id === newArtist.city_id);
  //   let updatedCities = [...user.cities]; // Initialize updatedCities as a copy of the current cities array

  //   if (!cityOfNewArtist) {
  //     // If it doesn't exist, create it using city_id and related data
  //     console.log("Creating new city for artist:", newArtist.city_id);
  //     cityOfNewArtist = {
  //       id: newArtist.city_id,
  //       name: newArtist.city_name,
  //       location: newArtist.city_location,
  //       artists: [],
  //     };

  //     // Create a new array for cities that includes the new city
  //     updatedCities = [...user.cities, cityOfNewArtist]; // Add the new city to the updated array
  //   } else {
  //     // If city exists, just update its artists array
  //     updatedCities = user.cities.map((city) =>
  //       city.id === cityOfNewArtist.id
  //         ? { ...city, artists: [...city.artists, newArtist] }
  //         : city
  //     );
  //   }

  //   // Get genre using genre_id from the user.genres array
  //   let genreOfNewArtist = user.genres.find((g) => g.id === newArtist.genre_id);
  //   let updatedGenres = [...user.genres]; // Initialize updatedGenres as a copy of the current genres array

  //   if (!genreOfNewArtist) {
  //     // If the genre doesn't exist, create it using genre_id and related data
  //     console.log("Creating new genre for artist:", newArtist.genre_id);
  //     genreOfNewArtist = {
  //       id: newArtist.genre_id,
  //       name: newArtist.genre_name,
  //       color: generateRandomColor(),
  //       artists: [],
  //     };

  //     // Create a new array for genres that includes the new genre
  //     updatedGenres = [...user.genres, genreOfNewArtist]; // Add the new genre to the updated array
  //   } else {
  //     // If genre exists, just update its artists array
  //     updatedGenres = user.genres.map((genre) =>
  //       genre.id === genreOfNewArtist.id
  //         ? { ...genre, artists: [...genre.artists, newArtist] }
  //         : genre
  //     );
  //   }

  //   // **Update the selected artist state**
  //   setSelectedArtist(newArtist);

  //   // Update the user's state with the new cities and genres
  //   setUser((prevUser) => ({
  //     ...prevUser,
  //     cities: updatedCities, // Updated cities with the new artist
  //     genres: updatedGenres, // Updated genres with the new artist
  //   }));
  // };

  const addArtist = (newArtist) => {
    // get  city using city_id from the user.cities array
    let cityOfNewArtist = user.cities.find((c) => c.id === newArtist.city_id);

    if (!cityOfNewArtist) {
      //if doesn't exist, create it using city_id and related data
      // console.log("Creating new city for artist:", newArtist.city_id);
      cityOfNewArtist = {
        id: newArtist.city_id,
        name: newArtist.city_name,
        location: newArtist.city_location,
        artists: [],
      };

      // add the new city to the cities array
      user.cities.push(cityOfNewArtist);
    }

    // get the genre using genre_id from the user.genres array
    let genreOfNewArtist = user.genres.find((g) => g.id === newArtist.genre_id);

    if (!genreOfNewArtist) {
      // if the genre doesn't exist, create it using genre_id and related data
      console.log("Creating new genre for artist:", newArtist.genre_id);
      genreOfNewArtist = {
        id: newArtist.genre_id,
        name: newArtist.genre_name,
        color: generateRandomColor(),
        artists: [],
      };

      // add  new genre to genres array
      user.genres.push(genreOfNewArtist);
    }

    //  update the city and genre with the new artist
    const updatedArtist = {
      id: newArtist.id,
      name: newArtist.name,
      image: newArtist.image,
      genre: newArtist.genre_name,
      city_id: newArtist.city_id,
      genre_id: newArtist.genre_id,
    };

    // update the artist list for the city
    const updatedArtists = [...cityOfNewArtist.artists, updatedArtist];
    // Update the city object with the new artist
    const updatedUserCity = { ...cityOfNewArtist, artists: updatedArtists };
    const updatedUserCities = user.cities.map((c) =>
      c.id === updatedUserCity.id ? updatedUserCity : c
    );

    // Update the artist list for the genre
    const updatedUserGenre = { ...genreOfNewArtist, artists: updatedArtists };
    const updatedUserGenres = user.genres.map((g) =>
      g.id === updatedUserGenre.id ? updatedUserGenre : g
    );

    setUser((prevUser) => ({
      ...prevUser, // Preserve all the existing user state
      cities: updatedUserCities, // Update the cities with the new artist
      genres: updatedUserGenres, // Update the genres with the new artist
    }));

    // **Update the selected artist state**
    setSelectedArtist(updatedArtist);
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
        logoutUser,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
export { MyContext, MyProvider };

// take city out and eliminate old city if necessary **adjusting orig city
// add new city if necessary and add artist to existing or new city

// if (artist.city_id !== updatedArtistData.city_id) {
//   let cityToUpdate = user.cities.find(
//     (c) => c.id === updatedArtist.city_id
//   );
//   let originalCity = user.cities.find((c) => c.id === artist.city_id);
//   if (!cityToUpdate) {
//     const city = cities.find((c) => c.id === updatedArtist.city_id);
//     cityToUpdate = { ...city, artists: [updatedArtist] };
//   } //else {}
//   // if (cityToUpdate && !cityToUpdate.artists) {
//   //   cityToUpdate.artists = []; // initialize artists array
//   // }
//   // step 1 : 2 possibilities
//   // 1. it wasn't in their cities so we added the new to them city and the artist so cityToUpdate is good
//   // 2. it WAS in their cities so we need to add it to that city AND take it out of the other one
//   // step 2 : ? possibilities
//   // 1. the original city still has artists
//   // 2. the origianl city does NOT have artists
//   const updatedArtistsList = cityToUpdate.artists.map((artist) =>
//     artist.id === updatedArtist.id ? updatedArtist : artist
//   );
//   const updatedCity = { ...cityToUpdate, artists: updatedArtistsList };
//   const updatedUserCities = user.cities
//     .map((city) => (city.id === updatedCity.id ? updatedCity : city))
//     .filter((city) => city.artists.length > 0);
//   adjUser = { ...adjUser, cities: updatedUserCities };
// }

// const genreToUpdate = {
//   ...user.genres.find((g) => g.id === updatedArtist.genre_id),
// };

// if (genreToUpdate && !genreToUpdate.artists) {
//   genreToUpdate.artists = []; // initialize artists array
// }

// update the artists data in the city and genre
// const updatedArtistsInCity = cityToUpdate.artists.map((artist) =>
//   artist.id === updatedArtist.id ? updatedArtist : artist
// );

// const updatedArtistsInGenre = genreToUpdate.artists.map((artist) =>
//   artist.id === updatedArtist.id ? updatedArtist : artist
// );

// // const editedCity = { ...cityToUpdate, artists: updatedArtistsInCity };
// const editedGenre = {
//   ...genreToUpdate,
//   artists: updatedArtistsInGenre,
// };

// update the city and genre with the updated artist
// cityToUpdate.artists = updatedArtistsInCity;
// genreToUpdate.artists = updatedArtistsInGenre;

// update the user's cities and genres state
// const updatedUserCities = user.cities
//   .map((city) => (city.id === editedCity.id ? editedCity : city))
//   .filter((city) => city.artists.length > 0);

//     const updatedUserGenres = user.genres
//       .map((genre) =>
//         genre.id === editedGenre.id ? editedGenre : genre
//       )
//       .filter((genre) => genre.artists.length > 0);
//     adjUser = { ...adjUser, genres: updatedUserGenres };
//   }
// }
