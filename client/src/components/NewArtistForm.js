import React, { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { MyContext } from "./AppContext";

const CreateArtist = () => {
  const { cities, genres, user, artists, setArtists, addArtist } =
    useContext(MyContext);
  const [showSuccess, setShowSuccess] = useState(false);

  const formSchema = yup.object().shape({
    name: yup.string().required("Artist name is required"),
    image: yup.string().required("Must include a URL to an image"),
    user_id: yup
      .number()
      .required("User ID is required")
      .positive("User ID must be a positive number")
      .integer("User ID must be an integer"),

    // genre_id is always required
    genre_id: yup.string(),
    // .required("Genre ID is required")
    // .positive("Genre ID must be a positive number")
    // .integer("Genre ID must be an integer"),

    // genre_name is only required when genre_id is empty (for creating a new genre)
    genre_name: yup.string(),
    // .when("genre_id", {
    //   is: (genre_id) => !genre_id, // if no genre_id, then genre_name must be filled in
    //   then: yup.string().required("Genre name is required for new genre"),
    //   otherwise: yup.string().notRequired(),
    // }),
    city_id: yup.string(),
    city_name: yup.string(),
    city_location: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
      city_id: "",
      city_name: "",
      city_location: "",
      genre_id: "",
      genre_name: "",
      user_id: user.id,
    },

    validationSchema: formSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      console.log("I've been clicked");
      // Parse genre_id to an integer before submitting
      const genreId = values.genre_id ? parseInt(values.genre_id, 10) : null;

      // Make sure genre_id is set
      if (!genreId && !values.genre_name) {
        alert("Please select an existing genre or create a new genre.");
        return;
      }
      // if (!values.genre_id && !values.genre_name) {
      //   alert("Please select an existing genre or create a new genre.");
      //   return;
      // }
      console.log("Formik is valid:", formik.isValid);
      console.log("Formik errors:", formik.errors);

      if (!formik.isValid) {
        console.error("Form is invalid. Check errors above.");
        return; // pprevent form submission if invalid
      }
      console.log("Formik values at submission:", values);

      try {
        let body;

        if (values.city_id === "") {
          // if no city is selected (new city is being created)
          body = {
            name: values.name,
            image: values.image,
            city_name: values.city_name,
            city_location: values.city_location,
            genre_id: genreId,
            genre_name: values.genre_name,
            user_id: user.id,
          };
        } else {
          // if a city is selected from the dropdown
          body = {
            name: values.name,
            image: values.image,
            city_id: values.city_id,
            genre_id: genreId,
            genre_name: values.genre_name,
            user_id: user.id,
          };
        }
        if (values.genre_id === "") {
          // if no genre is selected create a new genre
          body.genre_name = values.genre_name;
        } else {
          // if an existing genre is selected use the genre_id
          body.genre_id = values.genre_id;
        }

        console.log("Body to send to server:", body);

        // send request to backend to create artist
        const response = await fetch("/artists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error("Failed to create artist");
        }

        const newArtist = await response.json();
        console.log("Artist created:", newArtist);

        setShowSuccess(true); // trigger success state
        addArtist(newArtist);

        setArtists((prevArtists) => [...prevArtists, newArtist]);

        formik.resetForm();

        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } catch (error) {
        console.error("Error creating artist:", error);
        alert("There was an error creating the artist.");
      }
    },
  });
  // useEffect(() => {
  //   console.log("Formik is valid:", formik.isValid);
  //   console.log("Formik errors:", formik.errors);
  // }, [formik.values]); //  triggers when form values change
  // useEffect(() => {
  //   console.log("Formik initial values:", formik.values);
  // }, [formik.values]); //  when formik values change

  return (
    <div class="create-artist-form">
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="name">Artist Name:</label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        {formik.errors.name && formik.touched.name && (
          <div className="error">{formik.errors.name}</div>
        )}

        <label htmlFor="image">Artist Image URL:</label>
        <input
          id="image"
          name="image"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.image}
        />
        {formik.errors.image && formik.touched.image && (
          <div className="error">{formik.errors.image}</div>
        )}
        {/* <br /> */}

        <div className="city-genre-options">
          <div>
            <label htmlFor="city_id">City:</label>
            <select
              id="city_id"
              name="city_id"
              onChange={formik.handleChange}
              value={formik.values.city_id}
            >
              <option value="">Select a City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            <br />
            {!formik.values.city_id && (
              <>
                <label htmlFor="city_name">New City Name:</label>
                <input
                  id="city_name"
                  name="city_name"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.city_name}
                />

                <label htmlFor="city_location">City Location:</label>
                <input
                  id="city_location"
                  name="city_location"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.city_location}
                />
              </>
            )}
          </div>

          <div>
            <label htmlFor="genre_id">Genre:</label>
            <select
              id="genre_id"
              name="genre_id"
              onChange={formik.handleChange}
              value={formik.values.genre_id}
            >
              <option value="">Select a Genre</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>

            {!formik.values.genre_id && (
              <>
                <label htmlFor="genre_name">New Genre Name:</label>
                <input
                  id="genre_name"
                  name="genre_name"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.genre_name}
                />
              </>
            )}
          </div>
        </div>

        <button type="submit">Create Artist</button>
      </form>

      {showSuccess && (
        <div className="success-message">
          <span>✔️</span> Artist created successfully!
        </div>
      )}
    </div>
  );
};

export default CreateArtist;

// // check if a new city is being created or selected
// body = {
//   name: values.name,
//   image: values.image,
//   city_id: values.city_id,
//   city_name: values.city_name,
//   city_location: values.city_location,
//   genre_id: values.genre_id,
// };

// onSubmit: async (values) => {
//   console.log("Formik is valid:", formik.isValid); // Logs whether the form is valid
//   console.log("Formik errors:", formik.errors); // Logs any validation errors

//   if (!formik.isValid) {
//     console.error("Form is invalid. Check errors above.");
//     return; // Prevent form submission if invalid
//   }
//   console.log("Formik values at submission:", values);

//   try {
//     let body;
//     if (values.city_id == 0) {
//       body = {
//         name: values.name,
//         image: values.image,
//         // city_id: values.city_id,
//         city_name: values.city_name,
//         city_location: values.city_location,
//         genre_id: values.genre_id,
//       };
//     } else {
//       body = {
//         name: values.name,
//         image: values.image,
//         city_id: values.city_id,
//         // city_name: values.city_name,
//         // city_location: values.city_location,
//         genre_id: values.genre_id,
//       };
//     }
//     console.log("Body to send to server:", body); // Log body before sending

//     const response = await fetch("/artists", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to create artist");
//     }

//     const newArtist = await response.json();
//     alert("Artist created successfully!");

//     setArtists((prevArtists) => [...prevArtists, newArtist]);

//     formik.resetForm();
//   } catch (error) {
//     console.error("Error creating artist:", error);
//     alert("There was an error creating the artist.");
//   }
// },
