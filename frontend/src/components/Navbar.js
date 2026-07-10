import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {

  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const handleLogout = () => {

    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("uid");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    navigate("/");
  };

  return (

    <header className="main-navbar">

      {/* LOGO */}

      <div className="navbar-logo">
        🚧 GeoTag
      </div>

      {/* LINKS */}

      <nav className="navbar-links">

        <Link to="/">Home</Link>

        <Link to="/about">About</Link>

        <Link to="/contact">Contact</Link>

        {!role && (
          <>
            <Link to="/register">Register</Link>

            <Link to="/login">Login</Link>
          </>
        )}

        {role === "admin" && (
          <Link to="/admin">
            Admin Panel
          </Link>
        )}

        {role === "staff" && (
          <Link to="/staff">
            Staff Dashboard
          </Link>
        )}

        {role === "customer" && (
          <Link to="/user">
            User Dashboard
          </Link>
        )}

        {role && (
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

      </nav>

    </header>
  );
}