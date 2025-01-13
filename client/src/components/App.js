import React from "react";
// import { Switch, Route } from "react-router-dom";
import { MyProvider } from "./AppContext";
import { Outlet } from "react-router-dom";
import CreateLogin from "./LoginForm";
import NavBar from "./NavBar";

function App() {
  return (
    <div>
      <MyProvider>
        <h1>Project Client</h1>
        <NavBar />
        <Outlet />
      </MyProvider>
    </div>
  );
}

export default App;
