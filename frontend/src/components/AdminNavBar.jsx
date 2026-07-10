import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminNavBar.css";

export default function AdminNavBar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-navbar">

      {/* LEFT */}
      <div className="admin-logo">
        🚧 Pothole Admin
      </div>

      {/* CENTER */}
      <div className="admin-links">

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive ? "admin-link active-link" : "admin-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/complaints"
          className={({ isActive }) =>
            isActive ? "admin-link active-link" : "admin-link"
          }
        >
          Complaints
        </NavLink>

        <NavLink
          to="/admin/clients"
          className={({ isActive }) =>
            isActive ? "admin-link active-link" : "admin-link"
          }
        >
          Citizens
        </NavLink>

        <NavLink
          to="/admin/messages"
          className={({ isActive }) =>
            isActive ? "admin-link active-link" : "admin-link"
          }
        >
          Messages
        </NavLink>

        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            isActive ? "admin-link active-link" : "admin-link"
          }
        >
          Analytics
        </NavLink>

      </div>

      {/* RIGHT */}
      <div className="admin-right">

        <span className="admin-user">
          👨‍💼 Admin
        </span>

        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>

      </div>

    </div>
  );
}