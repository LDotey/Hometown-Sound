import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "./AppContext";
import { useFormik } from "formik";

function ArtistCard({ artist }) {
  const { cities, updateArtist, deleteArtist } = useContext(MyContext);
  const [isEditing, setIsEditing] = useState(false);
  console.log(artist);

  //   const { updateArtist, deleteArtist } = useContext(MyContext);
  //   const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
      genre: "",
      location: "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("Values:", values);
      // lookup city name using values.location (which will be the city_id)
      const city = cities.find((c) => c.id === values.location);
      const cityName = city ? city.name : ""; // default to empty string if not found

      // You can then send this value to your server or use it in your logic
      console.log("Selected city name:", cityName);

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

  // Update Formik initial values when the selected artist changes
  useEffect(() => {
    if (artist) {
      formik.setValues({
        name: artist.name,
        image: artist.image,
        genre: artist.genre, // Handling genre
        location: cities.find((city) => city.id === artist.city_id)?.name || "", // Handling location
      });
    }
  }, [artist, cities]);

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
        <p>Genre: {artist.genre}</p>
      )}
      {isEditing ? (
        <input
          type="text"
          name="location"
          value={formik.values.location}
          onChange={formik.handleChange}
        />
      ) : (
        <p>
          Location:{" "}
          {artist.city_id
            ? cities.find((city) => city.id === artist.city_id)?.name ||
              "City not found"
            : "City not assigned"}
        </p>
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
