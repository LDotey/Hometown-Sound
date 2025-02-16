import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "./AppContext";
import ArtistCard from "./ArtistCard";

function UserCities() {
  const {
    user,
    artists,
    setArtists,
    selectedCity,
    setSelectedCity,
    selectedArtist,
    setSelectedArtist,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  // console.log("Rendering UserCities with user data:", user); // Debug log
  // console.log("User cities in UserCities:", user.cities); // Debug log

  // ***** don't need this because now state is updatting correctly.??
  useEffect(() => {
    // clear artists and selected genre when the component mounts
    console.log("Resetting artists and selectedCity.");
    setSelectedCity(null);

    // cleanup function to reset when the component unmounts
    return () => {
      setSelectedCity(null);
    };
  }, []);
  const handleCityClick = async (city) => {
    if (!city || !city.id) {
      console.error("city obj or city.id is undefined");
      return;
    }

    console.log("Selected city ID:", city.id);
    console.log("Logged-in user ID:", user.id); // Check user.id

    // Set the selected city
    setSelectedCity(city.id);
    setSelectedArtist(null); // Reset selected artist when city changes

    setLoading(true);

    // Find the selected city in the user data
    const selectedCityData = user.cities.find((c) => c.id === city.id);
    if (!selectedCityData) {
      console.error("City not found in user data.");
      setLoading(false);
      return;
    }

    // Check the artists array before filtering
    console.log("All artists in selected city:", selectedCityData.artists);
    // Log the `city_id` and `user_id` of each artist
    selectedCityData.artists.forEach((artist) => {
      console.log(
        `Artist ID: ${artist.id}, City ID: ${artist.city_id}, User ID: ${artist.user_id}`
      );
    });

    // Filter artists for this city and make sure to include only those belonging to the logged-in user
    // const cityArtists = selectedCityData.artists.filter(
    //   (artist) => artist.user_id === user.id
    // );
    // Filter artists by city and user_id to ensure that only the logged-in user's artists are shown
    const cityArtists = selectedCityData.artists.filter(
      (artist) => artist.city_id === city.id && artist.user_id === user.id
    );
    // const cityArtists = selectedCityData.artists.filter(
    //   (artist) => artist.city_id === city.id
    // );

    console.log("Filtered city artists:", cityArtists); // Check what artists are being returned

    if (Array.isArray(cityArtists)) {
      setArtists(cityArtists); // Set the filtered artists
    } else {
      console.error("Artist data for city is not an array", cityArtists);
    }

    setLoading(false);
  };

  // const handleCityClick = async (city) => {
  //   if (!city || !city.id) {
  //     console.error("city obj or city.id is undefined");
  //     return;
  //   }
  //   console.log("selected city id:", city.id);
  //   console.log(user.id);
  //   setSelectedCity(city.id);
  //   setSelectedArtist(null);

  //   setLoading(true);

  //   const cityArtists =
  //     user.cities.find((c) => c.id === city.id)?.artists || [];

  //   if (Array.isArray(cityArtists)) {
  //     setArtists(cityArtists);
  //   } else {
  //     console.error("artist data for city is not an array", cityArtists);
  //   }
  //   setLoading(false);
  // };

  const handleArtistClick = (artist) => {
    console.log("Artist clicked:", artist); // Debug log

    // update  state when an artist is clicked
    setSelectedArtist(artist);
  };
  // Effect hook to ensure the artists list is cleared when the selected city has no artists
  useEffect(() => {
    // If no artists in the selected city, reset the artist list and clear selected artist
    if (selectedCity) {
      const city = user.cities.find((c) => c.id === selectedCity);
      if (city && (!city.artists || city.artists.length === 0)) {
        setArtists([]); // Clear the artists list
        setSelectedArtist(null); // Clear selected artist as well
      }
    }
  }, [selectedCity, user.cities, setArtists, setSelectedArtist]);

  useEffect(() => {
    if (user.cities && selectedCity) {
      const selectedCityData = user.cities.find((c) => c.id === selectedCity);
      if (!selectedCityData || selectedCityData.artists.length === 0) {
        setSelectedCity(null); // Clear selected city if it has no artists
      }
    }
  }, [user.cities, selectedCity, setSelectedCity]);

  return (
    <div className="user-cities-container">
      <div className="cities-list">
        {/* <h2>Cities:</h2> */}
        <ul>
          {user.cities && user.cities.length > 0 ? (
            user.cities.map((city) => (
              <li key={city.id} onClick={() => handleCityClick(city)}>
                {city.name}
              </li>
            ))
          ) : (
            <p>No cities associated with your profile.</p>
          )}
        </ul>
        {selectedCity && (
          <div>
            <h3>
              Artists in{" "}
              {user.cities.find((city) => city.id === selectedCity)?.name}:
            </h3>
            <ul>
              {artists && artists.length > 0 ? (
                artists.map((artist) => (
                  <li key={artist.id} onClick={() => handleArtistClick(artist)}>
                    {artist.name}
                  </li>
                ))
              ) : (
                <p>No artists found for this city.</p>
              )}
            </ul>
          </div>
        )}
        {/* {selectedArtist && <ArtistCard artist={selectedArtist} />}{" "} */}
        {/* Render ArtistCard from context */}
      </div>
      {/* Artist Card */}
      {selectedCity && artists.length > 0 && (
        <div className="artist-card-container">
          {selectedArtist ? (
            <ArtistCard artist={selectedArtist} />
          ) : (
            <p>No artist selected</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserCities;

// return (
//   <div>
//     <h1>Artists for Selected City</h1>
//     <ul>
//       {cities.map((city) => (
//         <li key={city.id} onClick={() => handleCityClick(city.id)}>
//           {city.name}
//         </li>
//       ))}
//     </ul>

//     <h2>Artists:</h2>
//     <ul>
//       {artists.map((artist) => (
//         <li key={artist.id}>{artist.name}</li>
//       ))}
//     </ul>
//   </div>
// );
// }

// export default CityArtists;

// // Fetch artists for the selected city
// const response = await fetch(`/artists/user/${user.id}/city/${city.id}`);
// const data = await response.json();
// console.log("Full response:", data);
//   const artistsInCity = user.artists.filter(
//     (artist) => artist.city_id === city.id
//   );
//   console.log("artists in seleccted city:", artistsInCity);

//   if (Array.isArray(artistsInCity)) {
//     setArtists(artistsInCity);
//   } else {
//     console.error("artists data not found or is not an array", artistsInCity);
//   }
// };
//   // Instead of checking data.artists, set artists directly from data
//   if (Array.isArray(data.artists)) {
//     console.log("Setting artists:", data.artists); // Log artists being set
//     setArtists(data.artists); // Directly set the array to artists state
//   } else {
//     console.error("Artists data not found or is not an array:", data.artists);
//   }
// };
// useEffect(() => {
//   console.log("Rendering UserCities component");
// }, []);
