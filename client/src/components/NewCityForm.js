import React, { useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { MyContext } from "./AppContext";
import { useNavigate } from "react-router-dom";

function CreateCity() {
  const { setCities } = useContext(MyContext);
  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    name: yup.string().required("City name is required"),
    location: yup.string().required("City location is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      location: "",
    },

    validationSchema: formSchema,
    onSubmit: (values) => {
      console.log("NewCity formdata submitted:", values);

      // send formdata to backend
      fetch("/cities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((resp) => resp.json())
        .then((newCity) => {
          console.log(newCity);
          setCities((prevCities) => [...prevCities, newCity]);

          formik.resetForm();
          navigate("/cities");
        })
        .catch((error) => {
          console.error("Error creating city:", error);
        });
      console.log(formik.values);
    },
  });
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="name">City Name:</label>
        <br />
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        <p style={{ color: "red" }}>{formik.errors.name}</p>

        <label htmlFor="location">Location:</label>
        <br />
        <input
          id="location"
          name="location"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.location}
        />
        <p style={{ color: "red" }}>{formik.errors.location}</p>

        <button type="submit">Create City</button>
      </form>
    </div>
  );
}

export default CreateCity;
