import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="nav-brand">
          <span className="nav-brand-mark">No. 01</span>
          <span className="nav-brand-name">HouseHunt</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/listings" className="nav-link">Listings</NavLink>
          <NavLink to="/about" className="nav-link">About</NavLink>
          <NavLink to="/contact" className="nav-link">Contact</NavLink>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              {(user.role === "agent" || user.role === "admin") && (
                <Link to="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
              )}
              <button onClick={handleLogout} className="btn btn-primary btn-sm">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
