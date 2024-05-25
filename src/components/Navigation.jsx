import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../styles/Navigation.css";
import { useState } from "react";

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfile = () => {
    navigate(`/user/${user.id}`);
    setShowDropdown(false);
  };

  return (
    <div className="navbar">
      <div className="nav-brand">Goodreads</div>
      <div className="nav-user">
        {user ? (
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Welcome, {user.username}!
            </button>
            <ul className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
              <li>
                <button className="dropdown-item" onClick={handleProfile}>
                  Profile
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <RouterLink to="/">Login</RouterLink>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;
