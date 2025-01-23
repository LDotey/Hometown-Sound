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
    genre_id: yup
      .number()
      .required("Genre ID is required")
      .positive("Genre ID must be a positive number")
      .integer("Genre ID must be an integer"),
    city_id: yup.number(),
    city_name: yup.string(),
    city_location: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
      city_id: 0,
      city_name: "",
      city_location: "",
      genre_id: "",
      user_id: user.id,
    },

    validationSchema: formSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      console.log("Formik is valid:", formik.isValid);
      console.log("Formik errors:", formik.errors);

      if (!formik.isValid) {
        console.error("Form is invalid. Check errors above.");
        return; // pprevent form submission if invalid
      }
      console.log("Formik values at submission:", values);

      try {
        let body;

        if (values.city_id === 0) {
          // if no city is selected (new city is being created)
          body = {
            name: values.name,
            image: values.image,
            city_name: values.city_name,
            city_location: values.city_location,
            genre_id: values.genre_id,
            user_id: user.id,
          };
        } else {
          // if a city is selected from the dropdown
          body = {
            name: values.name,
            image: values.image,
            city_id: values.city_id,
            genre_id: values.genre_id,
            user_id: user.id,
          };
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
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="name">Artist Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
        </div>
        <br />
        <div>
          <label htmlFor="image">Artist Image URL:</label>
          <input
            id="image"
            name="image"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.image}
          />
        </div>
        <br />
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
        </div>
        <div>
          <h5>OR</h5>
        </div>
        {/* if no city is selected show fields for adding a new city / location */}
        {!formik.values.city_id && (
          <div>
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
          </div>
        )}
        <br />

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
        </div>
        <br />

        <button type="submit">Create Artist</button>
      </form>

      {/* success notification */}
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
