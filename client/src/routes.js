import App from "./components/App";
import CreateLogin from "./components/LoginForm";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <CreateLogin />,
      },
    ],
  },
];

export default routes;
