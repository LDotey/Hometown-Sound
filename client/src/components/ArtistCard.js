import React, { useContext, useState } from "react";
import { MyContext } from "./AppContext";
import { useFormik } from "formik";

function ArtistCard({ artist }) {
  const { updateArtist, deleteArtist } = useContext(MyContext);
  const [isEditing, setIsEditing] = useState(false);
  console.log(artist);

  //   const { updateArtist, deleteArtist } = useContext(MyContext);
  //   const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: artist.name,
      image: artist.image,
      genre: artist.genre.name,
      location: artist.city.name,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log("Values:", values);

      // only update if the values are different than initial values
      if (
        values.name !== artist.name ||
        values.image !== artist.image ||
        values.genre !== artist.genre.name ||
        values.location !== artist.city.name
      ) {
        updateArtist(artist.id, values);
        console.log(artist);
      }
      setIsEditing(false);
    },
  });

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  if (!artist) {
    return; //<p></p>; // Fallback message when artist is null
  }

  return (
    <div className="artist-card">
      {/* Artist Name */}
      {isEditing ? (
        <input
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
      ) : (
        <h2>{artist.name}</h2>
      )}
      {/* Image */}
      {isEditing ? (
        <input
          type="text"
          name="image"
          value={formik.values.image}
          onChange={formik.handleChange}
        />
      ) : (
        <img src={artist.image} alt={artist.name} />
      )}
      {/* Genre */}
      {isEditing ? (
        <input
          type="text"
          name="genre"
          value={formik.values.genre}
          onChange={formik.handleChange}
        />
      ) : (
        <p>Genre: {artist.genre.name}</p>
      )}
      {isEditing ? (
        <input
          type="text"
          name="location"
          value={formik.values.location}
          onChange={formik.handleChange}
        />
      ) : (
        <p>Location: {artist.city.name}</p>
      )}
      <button onClick={handleEditClick}>
        {isEditing ? "Cancel" : "Edit this Artist"}
      </button>
      <br />
      <button type="submit" onClick={formik.handleSubmit}>
        {isEditing ? "Submit changes" : null}
      </button>
    </div>
  );
}

export default ArtistCard;
