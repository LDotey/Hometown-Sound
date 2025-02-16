import React, { useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { MyContext } from "./AppContext";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const { setUsers } = useContext(MyContext);
  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    username: yup.string().required("username is required"),
    password: yup
      .string()
      .required("password is required")
      .min(5, "Your password is too short."),
    confirmpassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error("Invalid credentials");
          }
          return resp.json();
        })
        .then((newUser) => {
          console.log(newUser);
          setUsers((prevUsers) => [...prevUsers, newUser]);

          formik.resetForm();
        })
        .catch((error) => {
          console.error("Error creating user", error);
        });
      console.log(formik.values);
      navigate("/login");
    },
  });

  return (
    <div className="signup-container">
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
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        <p style={{ color: "red" }}>{formik.errors.password}</p>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
