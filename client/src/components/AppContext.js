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

  // useEffect(() => {
  //   console.log(user); // Check if cities and genres are in the user state
  // }, [user]);

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

  // *****************************************
  // const updateArtist = (artist, updatedArtistData) => {
  //   let updatedArtist;

  //   fetch(`/artists/${artist.id}`, {
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(updatedArtistData),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       updatedArtist = data;
  //       // debugger;
  //       console.log("Updated artist:", updatedArtist);

  //       let adjUser = { ...user };

  //       // Step 1: handle city change
  //       if (artist.city_id !== updatedArtistData.city_id) {
  //         let cityToUpdate = adjUser.cities.find(
  //           (c) => c.id === updatedArtistData.city_id
  //         );

  //         if (!cityToUpdate) {
  //           cityToUpdate = {
  //             id: updatedArtistData.city_id,
  //             name: updatedArtistData.city.name,
  //             location: updatedArtistData.city.location,
  //             artists: [updatedArtist],
  //           };
  //           adjUser.cities = [...adjUser.cities, cityToUpdate]; // **CHANGED**: Used spread to ensure immutability
  //         } else {
  //           // Update the city with the new artist data
  //           cityToUpdate = {
  //             ...cityToUpdate,
  //             artists: cityToUpdate.artists.map((art) =>
  //               art.id === updatedArtist.id ? updatedArtist : art
  //             ),
  //           };

  //           // **CHANGED**: Reassign the updated city array in adjUser
  //           adjUser.cities = adjUser.cities.map((city) =>
  //             city.id === cityToUpdate.id ? cityToUpdate : city
  //           );
  //         }

  //         // if (!cityToUpdate) {
  //         //   const city = cities.find((c) => c.id === updatedArtistData.city_id);
  //         //   cityToUpdate = { ...city, artists: [updatedArtist] };
  //         //   adjUser.cities.push(cityToUpdate); // *** add the new city ***
  //         // } else {
  //         //   const updatedArtistsList = cityToUpdate.artists.map((artist) =>
  //         //     artist.id === updatedArtist.id ? updatedArtist : artist
  //         //   );
  //         //   cityToUpdate = { ...cityToUpdate, artists: updatedArtistsList };
  //         // }
  //         // ***********************

  //         //   const originalCity = user.cities.find((c) => c.id === artist.city_id);
  //         //   if (originalCity) {
  //         //     originalCity.artists = originalCity.artists.filter(
  //         //       (art) => art.id !== updatedArtist.id
  //         //     );
  //         //   }
  //         // }

  //         const originalCity = adjUser.cities.find(
  //           (c) => c.id === artist.city_id
  //         );
  //         if (originalCity) {
  //           const updatedOriginalCity = {
  //             ...originalCity,
  //             artists: originalCity.artists.filter(
  //               (art) => art.id !== updatedArtist.id
  //             ),
  //           };

  //           // **CHANGED**: If the original city is empty after editing, remove it
  //           if (updatedOriginalCity.artists.length === 0) {
  //             adjUser.cities = adjUser.cities.filter(
  //               (city) => city.id !== updatedOriginalCity.id
  //             );
  //           } else {
  //             // **CHANGED**: Otherwise, update the city with the modified artist list
  //             adjUser.cities = adjUser.cities.map((city) =>
  //               city.id === updatedOriginalCity.id ? updatedOriginalCity : city
  //             );
  //           }
  //         }
  //       }
  //       // ***********************************

  //       // ***********************************
  //       if (artist.genre_id !== updatedArtistData.genre_id) {
  //         let genreToUpdate = adjUser.genres.find(
  //           (g) => g.id === updatedArtistData.genre_id
  //         );
  //         if (!genreToUpdate) {
  //           // Create the genre if it doesn't exist for this user
  //           genreToUpdate = {
  //             id: updatedArtistData.genre_id,
  //             name: updatedArtistData.genre.name,
  //             color: generateRandomColor(),
  //             artists: [updatedArtist],
  //           };
  //           adjUser.genres = [...adjUser.genres, genreToUpdate]; // **CHANGED**: Used spread to ensure immutability
  //         } else {
  //           // Update the genre with the new artist data
  //           genreToUpdate = {
  //             ...genreToUpdate,
  //             artists: genreToUpdate.artists.map((art) =>
  //               art.id === updatedArtist.id ? updatedArtist : art
  //             ),
  //           };
  //           // **CHANGED**: Reassign the updated genre array in adjUser
  //           adjUser.genres = adjUser.genres.map((genre) =>
  //             genre.id === genreToUpdate.id ? genreToUpdate : genre
  //           );
  //         }

  //         // Remove artist from the old genre if genre is changed
  //         // const originalGenre = user.genres.find(
  //         //   (g) => g.id === artist.genre_id
  //         // );
  //         // if (originalGenre) {
  //         //   originalGenre.artists = originalGenre.artists.filter(
  //         //     (art) => art.id !== updatedArtist.id
  //         //   );
  //         // }

  //         // if (!genreToUpdate) {
  //         //   const genre = genres.fins(
  //         //     (g) => g.id === updatedArtistData.genre_id
  //         //   );
  //         //   genreToUpdate = { ...genre, artists: [updatedArtist] };
  //         //   adjUser.genres.push(genreToUpdate); // *** add the new genre **
  //         // } else {
  //         //   const updatedArtistsList = genreToUpdate.artists.map((artist) =>
  //         //     artist.id === updatedArtist.id ? updatedArtist : artist
  //         //   );

  //         //   genreToUpdate = { ...genreToUpdate, artists: updatedArtistsList };
  //         // }

  //         const originalGenre = adjUser.genres.find(
  //           (g) => g.id === artist.genre_id
  //         );
  //         if (originalGenre) {
  //           const updatedOriginalGenre = {
  //             ...originalGenre,
  //             artists: originalGenre.artists.filter(
  //               (artist) => artist.id !== updatedArtist.id
  //             ),
  //           };

  //           // **CHANGED**: If the original genre is empty after editing, remove it
  //           if (updatedOriginalGenre.artists.length === 0) {
  //             adjUser.genres = adjUser.genres.filter(
  //               (genre) => genre.id !== updatedOriginalGenre.id
  //             );
  //           } else {
  //             // **CHANGED**: Otherwise, update the genre with the modified artist list
  //             adjUser.genres = adjUser.genres.map((genre) =>
  //               genre.id === updatedOriginalGenre.id
  //                 ? updatedOriginalGenre
  //                 : genre
  //             );
  //           }
  //         }
  //       }
  //       console.log("Current User:", user);
  //       console.log("Updating Artist:", updatedArtist);
  //       console.log("Updated User:", adjUser);

  //       // Update the user data by fetching the current user's data
  //       fetch("/current_user") // Re-fetch the current user data
  //         .then((response) => response.json())
  //         .then((updatedUserData) => {
  //           console.log("Updated user data:", updatedUserData);
  //           setUser(updatedUserData); // Update state with new user data
  //           setSelectedArtist(updatedArtist); // Update selected artist
  //         })
  //         .catch((error) =>
  //           console.error("Error fetching updated user data:", error)
  //         );
  //     })
  //     .catch((error) => console.error("Error updating artist:", error));
  // };
  //       setUser(adjUser);

  //       setSelectedArtist(updatedArtist);
  //     });
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
