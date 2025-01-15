import React, { useContext } from "react";
import { MyContext } from "./AppContext";

function AllGenres() {
  const { genres } = useContext(MyContext);

  return (
    <div>
      <h1>All Genres</h1>
      <ul>
        {genres.length > 0 ? (
          genres.map((genre) => <li key={genre.id}>{genre.name}</li>)
        ) : (
          <p>No genres available</p>
        )}
      </ul>
    </div>
  );
}

export default AllGenres;
