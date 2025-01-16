import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
import CreateCity from "./NewCityForm";

function AllCities() {
  const { cities } = useContext(MyContext);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  const toggleCreateForm = () => {
    setShowCreateForm((prev) => !prev);
  };

  return (
    <div>
      <h1>All Cities</h1>
      <button onClick={toggleCreateForm}>
        {showCreateForm ? "Cancel" : "Add New City"}
      </button>

      {showCreateForm && <CreateCity />}
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
