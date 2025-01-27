import React, { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { MyContext } from "./AppContext";
import { useNavigate } from "react-router-dom";

function CreateGenre() {
  const { setGenres } = useContext(MyContext);
  //   const [newGenre, setNewGenre] = useState("");
  const navigate = useNavigate();

  function capitalizeWords(str) {
    return str
      .split(" ") // splits the string into words
      .map(
        (
          word // map each word
        ) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  }

  const formSchema = yup.object().shape({
    name: yup.string().required("Genre name is required"),
  });
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      console.log("new genre formdata submitted:", values);

      const formattedGenreName = capitalizeWords(values.name);

      fetch("/genres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formattedGenreName,
        }),
      })
        .then((resp) => resp.json())
        .then((newGenre) => {
          console.log("grreated gnere:", newGenre);
          setGenres((prevGenres) => [...prevGenres, newGenre]);

          formik.resetForm();
          navigate("/genres");
        })
        .catch((error) => {
          console.error("Error creating genre:", error);
        });
      console.log(formik.values);
    },
  });

  useEffect(() => {
    fetch("/genres")
      .then((resp) => resp.json())
      .then((genreData) => {
        setGenres(genreData);
      })
      .catch((error) => {
        console.error("error fetching genres:", error);
      });
  }, [setGenres]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="name">Genre Name:</label>
        <br />
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        <p style={{ color: "red" }}>{formik.errors.name}</p>
        <br />
        <button type="submit">Create Genre</button>
      </form>
    </div>
  );
}

export default CreateGenre;
