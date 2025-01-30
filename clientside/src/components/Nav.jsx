import React from "react";
import "../css/Nav.scss";
import { Link, useNavigate } from "react-router-dom";

const Nav = ({setName}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Successfully logged out!");
    location.reload()
  };

  return (
    <nav className="navbar">
      <div className="logo">Bajikart</div>
      <div className="search-bar">
        <input type="text" placeholder="Search for products, brands and more" onChange={(e) => setName(e.target.value)} />
        <button type="submit">Search</button>
      </div>
      <div className="nav-links">
        {token ? (
          <>
            <div className="dropdown">
              <button className="dropdown-btn">Account</button>
              <div className="dropdown-content">
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
