import React, { useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
// import { MyContext } from "./AppContext";
// import { useNavigate } from "react-router-dom";

function CreateLogin() {
  const formSchema = yup.object().shape({
    username: yup.string().required("username is required"),
    password: yup.string().required("password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    validationSchema: formSchema,
    onSubmit: (values) => {
      console.log("Login data submitted:", values);

      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((userLogin) => {
          console.log(userLogin);

          formik.resetForm();
        });
      console.log(formik.values);
    },
  });
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="username">Username:</label>
        <br />
        <input
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        <p style={{ color: "red" }}>{formik.errors.username}</p>

        <label htmlFor="password">Password:</label>
        <br />
        <input
          id="password"
          name="password"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        <p style={{ color: "red" }}>{formik.errors.password}</p>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default CreateLogin;
