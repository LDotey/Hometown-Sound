import React, { useContext, useState } from "react";
import { MyContext } from "./AppContext";
import CreateGenre from "./NewGenreForm";

function AllGenres() {
  const { genres } = useContext(MyContext);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleCreateForm = () => {
    setShowCreateForm((prev) => !prev);
  };

  return (
    <div className="all-genres">
      <h1>All Genres</h1>
      <button className="add-button" onClick={toggleCreateForm}>
        {showCreateForm ? "Cancel" : "Add New Genre"}
      </button>
      {showCreateForm && <CreateGenre />}
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
