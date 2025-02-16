import React, { useContext, useState } from "react";
import { MyContext } from "./AppContext";
import CreateCity from "./NewCityForm";

function AllCities() {
  const { cities } = useContext(MyContext);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleCreateForm = () => {
    setShowCreateForm((prev) => !prev);
  };

  return (
    <div className="all-cities">
      <h1>All Cities</h1>
      <button className="add-button" onClick={toggleCreateForm}>
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
