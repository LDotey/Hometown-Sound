import React, { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { MyContext } from "./AppContext";
import { useNavigate } from "react-router-dom";

function CreateCity() {
  const { cities, setCities } = useContext(MyContext);
  const [newLocation, setNewLocation] = useState(""); // track new location input

  const navigate = useNavigate();

  function capitalizeWords(str) {
    return str
      .split(" ") // Split the string into words
      .map(
        (
          word // Map each word
        ) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize the first letter, and make the rest lowercase
      )
      .join(" "); // Join the words back into a single string
  }

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

      // If the location is a new one, make sure to add it to global state and backend
      // const locationToSubmit = newLocation || values.location;

      // Format the city name and location
      const formattedCityName = capitalizeWords(values.name);
      const formattedLocation = newLocation
        ? capitalizeWords(newLocation)
        : capitalizeWords(values.location);

      // send formdata to backend
      fetch("/cities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formattedCityName,
          location: formattedLocation,
        }),
      })
        .then((resp) => resp.json())
        .then((newCity) => {
          console.log("Created city:", newCity);
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

  // Fetch existing cities from backend on component mount
  useEffect(() => {
    fetch("/cities")
      .then((resp) => resp.json())
      .then((cityData) => {
        setCities(cityData);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  }, [setCities]);

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
        <select
          id="location"
          name="location"
          onChange={(e) => {
            formik.handleChange(e);
            setNewLocation(""); // reset the new location when selecting from dropdown
          }}
          value={formik.values.location}
        >
          <option value="">Select a location</option>

          {/* make it unique locations */}
          {[...new Set(cities.map((city) => city.location))].map(
            (location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            )
          )}
          {/* <option value="">Select a location</option>
          {cities.map((city) => (
            <option key={city.id} value={city.location}>
              {city.location}
            </option>
          ))} */}
          <option value="new">Add a new location</option>
        </select>

        {/* Show an input field if the user selects to add a new location */}
        {formik.values.location === "new" && (
          <div>
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Enter new location"
            />
            <p style={{ color: "red" }}>
              {newLocation === "" && "New location is required"}
            </p>
          </div>
        )}

        <button type="submit">Create City</button>
      </form>
    </div>
  );
}

export default CreateCity;
