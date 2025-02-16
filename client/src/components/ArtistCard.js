import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "./AppContext";
import { useFormik } from "formik";

function ArtistCard({ artist }) {
  const { updateArtist, deleteArtist } = useContext(MyContext);
  const [isEditing, setIsEditing] = useState(false);
  // console.log({ source: "artist card", artist });

  useEffect(() => {
    if (artist) {
      formik.setValues({
        name: artist.name,
        image: artist.image,
        genre: artist.genre ? artist.genre.id : "", // use the genre's id to set the initial value
        location: artist.city_id || "", // use the city_id for the initial location value
      });
    }
  }, [artist]);

  const formik = useFormik({
    initialValues: {
      name: artist.name || "",
      image: artist.image || "",
      genre: artist.genre ? artist.genre.id : "", //  the genre's id to set the initial value
      location: artist.city_id || "", //  the city_id for the initial location value
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log({ artist });

      //  an object for the updated artist data
      const updatedArtistData = {
        ...values,
        genre_id: values.genre, //  genre_id based on selected genre
        city_id: values.location, //  city_id based on selected location

        // user_id: artist.user_id, //  the user_id to update the correct artist for the logged-in user
      };

      // ;og for debugging
      console.log("Updated Artist Data:", updatedArtistData);

      // call update artist
      updateArtist(artist, updatedArtistData);

      setIsEditing(false);
    },
  });

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleDeleteClick = () => {
    deleteArtist(artist.id);
  };

  if (!artist) {
    return <p>Loading...</p>;
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

      <button onClick={handleEditClick}>
        {isEditing ? "Cancel" : "Edit this Artist"}
      </button>
      <br />
      {isEditing ? (
        ""
      ) : (
        <button onClick={handleDeleteClick}>Delete This Artist</button>
      )}
      {/* <button onClick={handleDeleteClick}>Delete This Artist</button> */}
      {isEditing && (
        <button type="submit" onClick={formik.handleSubmit}>
          Submit changes
        </button>
      )}
    </div>
  );
}

export default ArtistCard;
