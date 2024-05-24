import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../styles/Navigation.css";

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="nav-brand">Goodreads</div>
      <div className="nav-user">
        {user ? (
          <>
            <span className="welcome">Welcome, {user.username}!</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <RouterLink to="/">Login</RouterLink>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;
