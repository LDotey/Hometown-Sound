import React, { useContext, useEffect } from "react";
import { MyContext } from "./AppContext";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const { user, isAuthenticated } = useContext(MyContext);
  const navigate = useNavigate();
  // const [finishedFlag, setFinishedFlag] = useState(false)

  useEffect(() => {
    if (user.username) {
      if (!isAuthenticated) {
        navigate("/login");
      }
    }
  }, [user, isAuthenticated, navigate]);

  // if (!isAuthenticated) {
  //   return <div>You are not logged in.</div>;
  // }
  // if (isAuthenticated) {
  if (user.username && !isAuthenticated) {
    return <div>Redirecting to login...</div>;
  } else if (!user.username) {
    return <div>Log in you loser</div>;
  } else {
    return (
      <div>
        <h1>Welcome {user.username}!</h1>
        <h2>Cities:</h2>
        <ul>
          {user.cities ? (
            user.cities.map((city) => <li key={city.id}>{city.name}</li>)
          ) : (
            <p>No cities associated with your profile.</p>
          )}
        </ul>
        <h2>Genres:</h2>
        <ul>
          {user.genres ? (
            user.genres.map((genre) => <li key={genre.id}>{genre.name}</li>)
          ) : (
            <p>No genres associated with your profile.</p>
          )}
        </ul>
      </div>
    );
  }
}

export default UserProfile;
