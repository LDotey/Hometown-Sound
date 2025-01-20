import React, { useContext, useEffect } from "react";
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
  console.log("Rendering UserCities with user data:", user); // Debug log
  console.log("User cities in UserCities:", user.cities); // Debug log

  useEffect(() => {
    // clear artists and selected genre when the component mounts
    console.log("Resetting artists and selectedCity.");
    setArtists([]);
    setSelectedCity(null);
    setSelectedArtist(null);

    // cleanup function to reset when the component unmounts
    return () => {
      setArtists([]);
      setSelectedCity(null);
      setSelectedArtist(null);
    };
  }, []);

  const handleCityClick = async (city) => {
    if (!city || !city.id) {
      console.error("city obj or city.id is undefined");
      return;
    }
    console.log(city.id);
    console.log(user.id);
    setSelectedCity(city.id);
    setSelectedArtist(null);

    // Fetch artists for the selected city
    const response = await fetch(`/artists/user/${user.id}/city/${city.id}`);
    const data = await response.json();
    console.log("Full response:", data);

    // Instead of checking data.artists, set artists directly from data
    if (Array.isArray(data.artists)) {
      console.log("Setting artists:", data.artists); // Log artists being set
      setArtists(data.artists); // Directly set the array to artists state
    } else {
      console.error("Artists data not found or is not an array:", data.artists);
    }
  };
  useEffect(() => {
    console.log("Rendering UserCities component");
  }, []);

  const handleArtistClick = (artist) => {
    // Update the global selectedArtist state when an artist is clicked
    setSelectedArtist(artist);
  };

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
          <ArtistCard artist={selectedArtist} />
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
