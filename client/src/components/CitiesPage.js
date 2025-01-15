import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "./AppContext";

function AllCities() {
  const { cities } = useContext(MyContext);

  return (
    <div>
      <h1>All Cities</h1>
      <ul>
        {cities.length > 0 ? (
          cities.map((city) => <li key={city.id}>{city.name}</li>)
        ) : (
          <p>No cities available</p>
        )}
      </ul>
    </div>
  );
}

export default AllCities;
