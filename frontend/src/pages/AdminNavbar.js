import React from "react";
import { Link } from "react-router-dom";
import "./AdminNavbar.css";

export default function AdminNavbar() {
  return (
    <nav className="admin-nav">
      <ul>
        <li><Link to="/admin">🏠 Dashboard</Link></li>
        <li><Link to="/admin/add-food">➕ Add Food</Link></li>
        <li><Link to="/admin/manage-food">📦 Manage Food</Link></li>
        <li><Link to="/logout">🚪 Logout</Link></li>
      </ul>
    </nav>
  );
}
