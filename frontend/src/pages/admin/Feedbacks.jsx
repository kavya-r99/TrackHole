import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/feedbacks");
      setFeedbacks(res.data || []);
    } catch (err) {
      console.error("Failed to load feedbacks:", err);
      setFeedbacks([]);
    }
  };

  document.title = "Admin | Feedbacks";

  return (
    <div className="admin-page feedbacks-page">
      <h2>Geo Tagging Pothole on Roads Within City</h2>
      <h4 className="gradient">User Feedbacks</h4>
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Feedback</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 ? (
              <tr>
                <td colSpan={7}>No feedback found.</td>
              </tr>
            ) : (
              feedbacks.map((f, index) => (
                <tr key={f.id || index}>
                  <td>{f.id || "-"}</td>
                  <td>{f.name || "-"}</td>
                  <td>{f.email || "-"}</td>
                  <td>{f.phone || "-"}</td>
                  <td title={f.feedback || ""}>
                    <p className="pointer">
                      {String(f.feedback || "").substring(0, 80)}
                      {String(f.feedback || "").length > 80 ? "..." : ""}
                    </p>
                  </td>
                  <td>{f.is_registered ? "Registered" : "Guest"}</td>
                  <td>
                    {f.created_at ? new Date(f.created_at).toLocaleString() : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
