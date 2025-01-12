import App from "./components/App";
import CreateLogin from "./components/LoginForm";
import UserProfile from "./components/UserProfile";

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
        path: "/profile",
        element: <UserProfile />,
      },
    ],
  },
];

export default routes;
