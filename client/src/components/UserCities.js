import React, { useContext } from "react";
import { MyContext } from "./AppContext";

function UserCities() {
  const { user, city, artists, setArtists, selectedCity, setSelectedCity } =
    useContext(MyContext);

  const handleCityClick = async (city) => {
    if (!city || !city.id) {
      console.error("city obj or city.id is undefined");
      return;
    }
    console.log(city.id);
    console.log(user.id);
    setSelectedCity(city.id);

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

  return (
    <div>
      <h2>Cities:</h2>
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
              artists.map((artist) => <li key={artist.id}>{artist.name}</li>)
            ) : (
              <p>No artists found for this city.</p>
            )}
          </ul>
        </div>
      )}

      {/* <h2>Genres:</h2>
      <ul>
        {user.genres ? (
          user.genres.map((genre) => <li key={genre.id}>{genre.name}</li>)
        ) : (
          <p>No genres associated with your profile.</p>
        )}
      </ul> */}
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
