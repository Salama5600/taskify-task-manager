// Header component that displays navigation and user controls

import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { Link } from "react-router-dom";

// Main header component function
function Header() {
  // Get current user from context
  const { currentUser } = useContext(UserContext);

  return (
    <div className="line-div">
      <div className="header container">
        <div className="first-div">
          {/* Logo */}
          <h3>Taskify</h3>
        </div>
        <div className="left-header">
          {/* Display welcome message if user is logged in */}
          {currentUser ? (
            <h5>
              welcome back: <span>{currentUser.name} </span>
            </h5>
          ) : (
            <p>loading</p>
          )}
          {/* Logout link */}
          <Link className="logout-btn" to="/login">
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
