import React from "react";
// import { Switch, Route } from "react-router-dom";
import { MyProvider } from "./AppContext";
import { Outlet } from "react-router-dom";
import CreateLogin from "./LoginForm";

function App() {
  return (
    <div>
      <MyProvider>
        <h1>Project Client</h1>
        <CreateLogin />
        <Outlet />
      </MyProvider>
    </div>
  );
}

export default App;

// import React from "react";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { MyProvider } from "./AppContext";
// import { Outlet } from "react-router-dom";
// import NavBar from "./NavBar";

// function App() {
//   return (
//     <div>
//       <MyProvider>
//         <h1>ROAD TRIP</h1>
//         <header>
//           <NavBar />
//         </header>
//         <Outlet />
//       </MyProvider>
//     </div>
//   );
// }

// export default App;
