import AllCities from "./components/CitiesPage";
import App from "./components/App";
import CreateLogin from "./components/LoginForm";
import UserProfile from "./components/UserProfile";
import AllGenres from "./components/GenresPage";
import SignUp from "./components/SignUpForm";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <CreateLogin />,
      },
      {
        path: "/users/signup",
        element: <SignUp />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/cities",
        element: <AllCities />,
      },
      {
        path: "/genres",
        element: <AllGenres />,
      },
    ],
  },
];

export default routes;
