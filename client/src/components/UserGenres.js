import React, { useContext, useEffect } from "react";
import { MyContext } from "./AppContext";

function UserGenres() {
  const { user, artists, setArtists, selectedGenre, setSelectedGenre } =
    useContext(MyContext);

  useEffect(() => {
    // Clear artists and selected genre when the component mounts
    console.log("Resetting artists and selectedGenre.");
    setArtists([]); // Clear the artists state
    setSelectedGenre(null); // Clear the selected genre

    // Cleanup function to reset when the component unmounts
    return () => {
      setArtists([]);
      setSelectedGenre(null);
    };
  }, []);

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

    // instead of checking data.artists, set artists directly from data
    if (Array.isArray(data.artists)) {
      console.log("Setting artists:", data.artists); // log artists being set
      setArtists(data.artists); // directly set the array to artists state
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
