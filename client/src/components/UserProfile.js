import React, { useContext } from "react";
import { MyContext } from "./AppContext";

function UserProfile() {
  const { user, isAuthenticated } = useContext(MyContext);

  if (!isAuthenticated) {
    return <div>You are not logged in.</div>;
  }
  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      {/* Display other user information */}
    </div>
  );
}

export default UserProfile;
