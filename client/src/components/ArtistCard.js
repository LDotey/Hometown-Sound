import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "./AppContext";
import { useFormik } from "formik";

function ArtistCard({ artist }) {
  const { cities, genres, updateArtist, deleteArtist } = useContext(MyContext);
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
      <button onClick={handleDeleteClick}>Delete This Artist</button>
      {isEditing && (
        <button type="submit" onClick={formik.handleSubmit}>
          Submit changes
        </button>
      )}
    </div>
  );
}

export default ArtistCard;

// import React, { useContext, useEffect, useState } from "react";
// import { MyContext } from "./AppContext";
// import { useFormik } from "formik";

// function ArtistCard({ artist }) {
//   const { cities, updateArtist, deleteArtist } = useContext(MyContext);
//   const [isEditing, setIsEditing] = useState(false);
//   console.log(artist);

//   //   const { updateArtist, deleteArtist } = useContext(MyContext);
//   //   const [isEditing, setIsEditing] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       image: "",
//       genre: "",
//       location: "",
//     },
//     enableReinitialize: true,
//     onSubmit: async (values) => {
//       console.log("Values:", values);
//       // lookup city name using values.location (which will be the city_id)
//       const city = cities.find((c) => c.id === values.location);
//       const cityName = city ? city.name : ""; // default to empty string if not found

//       const updatedArtistData = {
//         ...values,
//         genre_id: artist.genre.id, // Ensure genre_id is included
//         city_id: values.location, // Ensure city_id is included
//         user_id: artist.user_id, // Add user_id from the artist object
//       };
//       console.log("Updated Artist Data:", updatedArtistData);

//       //  use it in your logic
//       console.log("Selected city name:", cityName);

//       // only update if the values are different than initial values
//       if (
//         values.name !== artist.name ||
//         values.image !== artist.image ||
//         values.genre !== artist.genre.name ||
//         values.location !== artist.city.name
//       ) {
//         updateArtist(artist.id, updatedArtistData);
//         console.log(artist);
//       }
//       setIsEditing(false);
//     },
//   });

//   // Update Formik initial values when the selected artist changes
//   useEffect(() => {
//     if (artist) {
//       formik.setValues({
//         name: artist.name,
//         image: artist.image,
//         genre: artist.genre, // Handling genre
//         location: cities.find((city) => city.id === artist.city_id)?.name || "", // Handling location
//       });
//     }
//   }, [artist, cities]);

//   const handleEditClick = () => {
//     setIsEditing(!isEditing);
//   };
//   if (!artist) {
//     return; //<p></p>; // Fallback message when artist is null
//   }

//   return (
//     <div className="artist-card">
//       {/* Artist Name */}
//       {isEditing ? (
//         <input
//           type="text"
//           name="name"
//           value={formik.values.name}
//           onChange={formik.handleChange}
//         />
//       ) : (
//         <h2>{artist.name}</h2>
//       )}
//       {/* Image */}
//       {isEditing ? (
//         <input
//           type="text"
//           name="image"
//           value={formik.values.image}
//           onChange={formik.handleChange}
//         />
//       ) : (
//         <img src={artist.image} alt={artist.name} />
//       )}
//       {/* Genre */}
//       {isEditing ? (
//         <input
//           type="text"
//           name="genre"
//           value={formik.values.genre}
//           onChange={formik.handleChange}
//         />
//       ) : (
//         <p>Genre: {artist.genre.name}</p>
//       )}
//       {isEditing ? (
//         <input
//           type="text"
//           name="location"
//           value={formik.values.location}
//           onChange={formik.handleChange}
//         />
//       ) : (
//         <p>
//           Location:{" "}
//           {artist.city_id
//             ? cities.find((city) => city.id === artist.city_id)?.name ||
//               "City not found"
//             : "City not assigned"}
//         </p>
//       )}
//       <button onClick={handleEditClick}>
//         {isEditing ? "Cancel" : "Edit this Artist"}
//       </button>
//       <br />
//       <button type="submit" onClick={formik.handleSubmit}>
//         {isEditing ? "Submit changes" : null}
//       </button>
//     </div>
//   );
// }

// export default ArtistCard;

{
  /* /* Genre Dropdown */
}
{
  /* {isEditing ? //( */
}
// <select
//   name="genre"
//   value={formik.values.genre} */}
//   onChange={formik.handleChange}
// >
//   <option value="">Select Genre</option>
//   {genres.map((genre) => (
//     <option key={genre.id} value={genre.id}>
//       {genre.name}
//     </option>
//   ))}
// </select>
// ) : (
// <p>Genre: {artist.genre ? artist.genre.name : "No genre assigned"}</p>
// )}

{
  /* Location Dropdown */
}
// {isEditing ? (
//   <select
//     name="location"
//     value={formik.values.location}
//     onChange={formik.handleChange}
//   >
//     <option value="">Select Location</option>
//     {cities.map((city) => (
//       <option key={city.id} value={city.id}>
//         {city.name}
//       </option>
//     ))}
//   </select>
// ) : (
//   <p>
//     Location:{" "}
//     {artist.city_id
//       ? cities.find((city) => city.id === artist.city_id)?.name ||
//         "City not found"
//       : "City not assigned"}
//   </p>
// )}
