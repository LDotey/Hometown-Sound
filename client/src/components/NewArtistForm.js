import React, { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { MyContext } from "./AppContext";

const CreateArtist = () => {
  const { cities, genres, user, artists, setArtists } = useContext(MyContext);

  const formSchema = yup.object().shape({
    name: yup.string().required("Artist name is required"),
    image: yup.string().required("Must include a URL to an image"),
    user_id: yup
      .number()
      .required("User ID is required")
      .positive("User ID must be a positive number")
      .integer("User ID must be an integer"),
    // city_id: yup
    //   .number()
    //   .required("City ID is required")
    //   .positive("City ID must be a positive number")
    //   .integer("City ID must be an integer"),
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
    },
    // initialValues: {
    //   name: "",
    //   image: "",
    //   user_id: "",
    //   city_id: "",
    //   genre_id: "",
    // },
    validationSchema: formSchema,

    onSubmit: async (values) => {
      console.log("Form data submitted: ", values);

      try {
        let body;
        if (values.city_id == 0) {
          body = {
            name: values.name,
            image: values.image,
            // city_id: values.city_id,
            city_name: values.city_name,
            city_location: values.city_location,
            genre_id: values.genre_id,
          };
        } else {
          body = {
            name: values.name,
            image: values.image,
            city_id: values.city_id,
            // city_name: values.city_name,
            // city_location: values.city_location,
            genre_id: values.genre_id,
          };
        }

        // // check if a new city is being created or selected
        // body = {
        //   name: values.name,
        //   image: values.image,
        //   city_id: values.city_id,
        //   city_name: values.city_name,
        //   city_location: values.city_location,
        //   genre_id: values.genre_id,
        // };

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
        alert("Artist created successfully!");

        setArtists((prevArtists) => [...prevArtists, newArtist]);

        formik.resetForm();
      } catch (error) {
        console.error("Error creating artist:", error);
        alert("There was an error creating the artist.");
      }
    },
  });

  return (
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

      {/* If no city is selected, show fields for creating a new city */}
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

      <button type="submit">Create Artist</button>
    </form>
  );
};

export default CreateArtist;
