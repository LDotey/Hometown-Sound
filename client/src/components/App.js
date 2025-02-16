import React from "react";
// import { Switch, Route } from "react-router-dom";
import { MyProvider } from "./AppContext";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

function App() {
  return (
    <div>
      <MyProvider>
        <h1 className="app-title">Hometown Sound</h1>
        <NavBar />
        <Outlet />
      </MyProvider>
    </div>
  );
}

export default App;
