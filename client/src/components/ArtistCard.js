import React from "react";

function ArtistCard({ artist }) {
  console.log(artist);
  if (!artist) {
    return <p></p>; // Fallback message when artist is null
  }
  return (
    <div className="artist-card">
      <h2>{artist.name}</h2>
      <img src={artist.image} alt={artist.name} />
      <p>Genre: {artist.genre.name}</p>
      <p>Location: {artist.city.name}</p>
      {/* Add any other information you want to display about the artist */}
    </div>
  );
}

export default ArtistCard;
