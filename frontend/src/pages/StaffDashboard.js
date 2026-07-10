import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StaffDashboard.css";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  useEffect(() => {
    const role = String(localStorage.getItem("role") || "").trim().toLowerCase();
    if (role !== "staff") {
      navigate("/login");
      return;
    }

    const fetchComplaints = async () => {
      try {
        setLoading(true);
        let res;
        try {
          res = await axios.get("http://localhost:5000/api/complaints");
        } catch {
          res = await axios.get("http://localhost:5000/complaints");
        }
        const rows = Array.isArray(res.data) ? res.data : [];
        setComplaints(rows);
      } catch (err) {
        setError("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="page">
      <h2 className="text-center mt-4">Uploaded Complaints</h2>

      {loading && <p className="staff-state">Loading complaints...</p>}
      {error && <p className="staff-state error">{error}</p>}

      <div className="table-wrapper">
        <table className="custom-table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Description</th>
              <th>Location</th>
              <th>Status</th>
              <th>Image</th>
              <th>Submitted By</th>
            </tr>
          </thead>
          <tbody>
            {[...complaints].reverse().map((c, idx) => (
              <tr key={c.complaintid || c.id || idx}>
                <td>{c.complaintid || c.id || "-"}</td>
                <td>{c.complaint_date ? new Date(c.complaint_date).toLocaleString() : "-"}</td>
                <td title={c.complaint_desc || c.description || "-"}>
                  {String(c.complaint_desc || c.description || "-").substring(0, 40)}
                  {String(c.complaint_desc || c.description || "-").length > 40 ? "..." : ""}
                </td>
                <td title={c.location || "-"}>
                  {c.location && c.location !== "-" ? (
                    <a
                      href={c.location.startsWith("http") ? c.location : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="location-link"
                    >
                      {String(c.location).substring(0, 50)}
                      {String(c.location).length > 50 ? "..." : ""}
                    </a>
                  ) : "-"}
                </td>
                <td>
                  {(() => {
                    const rawStatus = c.status || "Pending";
                    const normalizedStatus = rawStatus.trim().toLowerCase() === "reslove" || rawStatus.trim().toLowerCase() === "resolved"
                      ? "Resolved"
                      : rawStatus.trim().toLowerCase() === "in progress" || rawStatus.trim().toLowerCase() === "inwork" || rawStatus.trim().toLowerCase() === "in work"
                      ? "In Progress"
                      : "Pending";
                    return (
                      <span className={`staff-status ${normalizedStatus.replace(/\s+/g, "-").toLowerCase()}`}>
                        {normalizedStatus}
                      </span>
                    );
                  })()}
                </td>
                <td>
                  {(c.picture || c.image_url || c.image) ? (
                    <img
                      src={
                        c.picture
                          ? `http://localhost:5000/uploads/${c.picture}`
                          : (c.image_url || c.image)
                      }
                      alt="complaint"
                      className="staff-complaint-img"
                      onClick={() => setImage(c.picture || c.image_url || c.image)}
                    />
                  ) : "No image"}
                </td>
                <td>{c.userid || c.user_id || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {image && (
        <div className="staff-image-preview" onClick={() => setImage(null)}>
          <img
            src={image.startsWith("http") ? image : `http://localhost:5000/uploads/${image}`}
            alt="complaint preview"
          />
        </div>
      )}
    </div>
  );
}
