import React, { useContext, useEffect } from "react";
import { MyContext } from "./AppContext";
import ArtistCard from "./ArtistCard";

function UserGenres() {
  const {
    user,
    artists,
    setArtists,
    selectedArtist,
    setSelectedArtist,
    selectedGenre,
    setSelectedGenre,
  } = useContext(MyContext);

  useEffect(() => {
    // Clear artists and selected genre when the component mounts
    console.log("Resetting artists and selectedGenre.");
    setSelectedGenre(null); // Clear the selected genre

    // Cleanup function to reset when the component unmounts
    return () => {
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
    setSelectedArtist(null);
    // Reset selected artist when city changes *******

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
  const handleArtistClick = (artist) => {
    console.log({ artist });

    setSelectedArtist(artist);
  };

  // hook to clear the artist list when the genre has no artists
  useEffect(() => {
    if (selectedGenre) {
      const genre = user.genres.find((g) => g.id === selectedGenre);
      if (genre && (!genre.artists || genre.artists.length === 0)) {
        setArtists([]);
        setSelectedArtist(null);
      }
    }
  }, [selectedGenre, user.genres, setArtists, setSelectedArtist]);

  useEffect(() => {
    if (user.genres && selectedGenre) {
      const selectedGenreData = user.genres.find((g) => g.id === selectedGenre);
      if (!selectedGenreData || selectedGenreData.artists.length === 0) {
        setSelectedGenre(null); //clear selected genre if it has no artists
      }
    }
  }, [user.genres, selectedGenre, setSelectedGenre]);

  return (
    <div className="user-cities-container">
      <div className="cities-list">
        {/* <h2>Genres:</h2> */}
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
                artists.map((artist) => (
                  <li key={artist.id} onClick={() => handleArtistClick(artist)}>
                    {artist.name}
                  </li>
                ))
              ) : (
                <p>No artists found for this genre.</p>
              )}
            </ul>
          </div>
        )}
      </div>
      {selectedGenre && artists.length > 0 && (
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

export default UserGenres;
