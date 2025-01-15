import React, { useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { MyContext } from "./AppContext";
import { useNavigate } from "react-router-dom";

function CreateLogin() {
  const { setUser, setIsAuthenticated } = useContext(MyContext);
  const navigate = useNavigate();

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
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Invalid credentials");
          }
          return response.json();
        })
        .then((user) => {
          if (user && user.username) {
            // user = {...userLogin, userFetchedFlag: true}
            setUser(user); //  the logged-in user in the context
            setIsAuthenticated(true);
            formik.resetForm();
            navigate("/profile");
          }
        })
        .catch((error) => {
          console.error("Login failed:", error);
          alert("Invalid login credentials. Please try again.");
        });
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
          type="password"
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

//   (values) => {
//     console.log("Login data submitted:", values);

//     fetch("/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(values),
//     })
//       .then((response) => response.json())
//       .then((userLogin) => {
//         if (userLogin) {
//           setUser(userLogin);
//           setIsAuthenticated(true);

//           // fetch the current user's profile data
//           fetch("/current_user")
//             .then((response) => response.json())
//             .then((userProfile) => {
//               setUser(userProfile);
//               setIsAuthenticated(true);
//               formik.resetForm();
//             })
//             .catch((err) => {
//               console.error("Error fetching current user:", err);
//               setIsAuthenticated(false);
//             });
//         }
//       })
//       .catch((error) => {
//         console.error("Error during login:", error);
//       });
//   },
// });
