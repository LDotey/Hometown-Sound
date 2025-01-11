import React, { createContext, useState, useEffect } from "react";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);

  return <MyContext.Provider value={{}}> {children} </MyContext.Provider>;
};
export { MyContext, MyProvider };
