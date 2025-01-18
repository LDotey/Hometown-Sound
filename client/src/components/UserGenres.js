import React, { useContext } from "react";
import { MyContext } from "./AppContext";

function UserGenres() {
  const { user, genre, artists, setArtists, selectedGenre, setSelectedGenre } =
    useContext(MyContext);

  const handleGenreClick = async (genre) => {
    if (!genre || !genre.id) {
      console.error("genre obj or genre.id is undefined");
      return;
    }
    console.log(genre.id);
    console.log(user.id);
    setSelectedGenre(genre.id);

    // Fetch artists for the selected genre
    const response = await fetch(`/artists/user/${user.id}/genre/${genre.id}`);
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
      <h2>Genres:</h2>
      <ul>
        {user.genres && user.genres.length > 0 ? (
          user.genres.map((genre) => (
            <li key={genre.id} onClick={() => handleGenreClick(genre)}>
              {genre.name}
            </li>
          ))
        ) : (
          <p>No genres associated with your profile.</p>
        )}
      </ul>
      {selectedGenre && (
        <div>
          <h3>
            Artists in{" "}
            {user.genres.find((genre) => genre.id === selectedGenre)?.name}:
          </h3>
          <ul>
            {artists && artists.length > 0 ? (
              artists.map((artist) => <li key={artist.id}>{artist.name}</li>)
            ) : (
              <p>No artists found for this genre.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserGenres;
