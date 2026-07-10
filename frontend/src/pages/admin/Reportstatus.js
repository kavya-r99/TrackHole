import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiFileText,
  FiTool,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiCalendar,
  FiActivity,
  FiInbox,
  FiTrendingUp,
  FiClock
} from "react-icons/fi";
import "../User/Reportstatus.css"; // We will also add more styles in index.css

export default function AdminReportStatus() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:5000/api/complaints");
      const all = res.data || [];

      // Normalize complaints
      const normalized = all.map((c) => ({
        id: c.complaintid || c.id,
        complaint_desc: c.complaint_desc || c.description || "Pothole Complaint",
        location: c.location || "",
        status: c.status || "Pending",
        complaint_date: c.complaint_date || new Date().toISOString(),
        picture: c.picture || null,
        userid: c.userid
      }));

      setComplaints(normalized);

      // Select first complaint if none selected or keep selection updated
      if (normalized.length > 0) {
        setSelectedComplaint(prev => {
          if (!prev) return normalized[0];
          const found = normalized.find(c => c.id === prev.id);
          return found || normalized[0];
        });
      }
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setError("Failed to fetch complaints from the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdating(true);
      setError("");
      setMessage("");
      
      await axios.put(`http://localhost:5000/api/complaints/${id}/status`, {
        status: newStatus
      });

      setMessage(`Complaint #${id} marked as "${newStatus}" successfully!`);
      
      // Refresh local list
      await fetchComplaints();
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update complaint status");
    } finally {
      setUpdating(false);
      // Auto dismiss success message
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  };

  // Helper to normalize reslove -> Resolved
  const getNormalizedStatus = (status) => {
    const s = String(status || "").trim().toLowerCase();
    if (s === "reslove" || s === "resolved") return "Resolved";
    if (s === "in progress" || s === "inwork" || s === "in work") return "In Progress";
    return "Pending";
  };

  // Calculate dynamic stats
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => getNormalizedStatus(c.status) === "Pending").length;
  const inProgressCount = complaints.filter(c => getNormalizedStatus(c.status) === "In Progress").length;
  const resolvedCount = complaints.filter(c => getNormalizedStatus(c.status) === "Resolved").length;

  return (
    <div className="admin-page admin-report-status-page">
      <div className="admin-status-header">
        <Link to="/admin" className="back-to-admin-link">
          <FiArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h2>🛠️ Complaint Repair Status Tracker</h2>
        <p>Monitor reports, assign work orders, and trace restoration progress.</p>
      </div>

      {/* DYNAMIC STATISTICS ROW */}
      <div className="stats-dashboard-row">
        <div className="stat-glow-card blue">
          <div className="stat-card-icon">
            <FiActivity size={24} />
          </div>
          <div className="stat-card-data">
            <h3>{totalCount}</h3>
            <span>Total Potholes</span>
          </div>
        </div>
        <div className="stat-glow-card red">
          <div className="stat-card-icon">
            <FiAlertCircle size={24} />
          </div>
          <div className="stat-card-data">
            <h3>{pendingCount}</h3>
            <span>Pending Inspection</span>
          </div>
        </div>
        <div className="stat-glow-card amber">
          <div className="stat-card-icon">
            <FiClock size={24} />
          </div>
          <div className="stat-card-data">
            <h3>{inProgressCount}</h3>
            <span>In Active Repair</span>
          </div>
        </div>
        <div className="stat-glow-card green">
          <div className="stat-card-icon">
            <FiCheckCircle size={24} />
          </div>
          <div className="stat-card-data">
            <h3>{resolvedCount}</h3>
            <span>Resolved & Restored</span>
          </div>
        </div>
      </div>

      {error && <p className="error-banner">{error}</p>}
      {message && <p className="success-banner">{message}</p>}

      {/* MAIN TWO-PANE LAYOUT */}
      <div className="tracker-split-layout">
        
        {/* LEFT PANE: COMPLAINTS LIST */}
        <div className="list-pane-container">
          <h3>Citizen Reports ({complaints.length})</h3>
          {loading && complaints.length === 0 ? (
            <p className="loading-text">Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <div className="empty-state">
              <FiInbox size={48} />
              <p>No complaints reported yet.</p>
            </div>
          ) : (
            <div className="scrollable-complaints-list">
              {complaints.map((c) => {
                const normStatus = getNormalizedStatus(c.status);
                const isActive = selectedComplaint && selectedComplaint.id === c.id;

                return (
                  <div
                    key={c.id}
                    className={`complaint-tracker-item ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedComplaint(c)}
                  >
                    <div className="item-header">
                      <span className="item-id">#{c.id}</span>
                      <span className={`status-badge-pill ${normStatus.toLowerCase().replace(/\s+/g, "")}`}>
                        {normStatus}
                      </span>
                    </div>
                    <p className="item-desc">
                      {c.complaint_desc.substring(0, 45)}
                      {c.complaint_desc.length > 45 && "..."}
                    </p>
                    <div className="item-footer">
                      <FiCalendar size={12} />
                      <span>{new Date(c.complaint_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT PANE: DETAIL INSPECTOR & STEPPER */}
        <div className="inspector-pane-container">
          {selectedComplaint ? (
            <div className="inspector-card">
              <div className="inspector-header">
                <h3>Complaint Inspection — ID #{selectedComplaint.id}</h3>
                <span className={`status-badge-pill large ${getNormalizedStatus(selectedComplaint.status).toLowerCase().replace(/\s+/g, "")}`}>
                  Current: {getNormalizedStatus(selectedComplaint.status)}
                </span>
              </div>

              <div className="inspector-grid">
                <div className="inspector-details">
                  <div className="detail-group">
                    <label><FiCalendar size={14} /> Reported Date</label>
                    <p>{new Date(selectedComplaint.complaint_date).toLocaleString()}</p>
                  </div>
                  
                  <div className="detail-group">
                    <label><FiMapPin size={14} /> Location</label>
                    <p>{selectedComplaint.location || "No address provided"}</p>
                    {selectedComplaint.location && (
                      <a
                        href={selectedComplaint.location}
                        target="_blank"
                        rel="noreferrer"
                        className="map-shortcut-btn"
                      >
                        Open in Google Maps
                      </a>
                    )}
                  </div>

                  <div className="detail-group">
                    <label><FiAlertCircle size={14} /> Description</label>
                    <p className="desc-box">{selectedComplaint.complaint_desc}</p>
                  </div>

                  <div className="detail-group">
                    <label>Citizen User ID</label>
                    <p>{selectedComplaint.userid ? `User #${selectedComplaint.userid}` : "Anonymous"}</p>
                  </div>
                </div>

                <div className="inspector-image-wrapper">
                  <label>Pothole Snapshot</label>
                  {selectedComplaint.picture ? (
                    <div className="snapshot-preview-container">
                      <img
                        src={`http://localhost:5000/uploads/${selectedComplaint.picture}`}
                        alt="pothole snapshot"
                        className="snapshot-img"
                      />
                    </div>
                  ) : (
                    <div className="no-snapshot-placeholder">
                      <p>No image uploaded for this complaint.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* VISUAL TIMELINE STEPPER */}
              <div className="visual-stepper-box">
                <h4>Restoration Timeline Progress</h4>
                <div className="stepper-track-wrapper">
                  
                  {/* STEP 1: REPORTED */}
                  <div className={`stepper-node ${getNormalizedStatus(selectedComplaint.status) !== "" ? "completed" : ""}`}>
                    <div className="node-circle">
                      <FiFileText size={18} />
                    </div>
                    <span className="node-label">Reported</span>
                    <span className="node-time">Received</span>
                  </div>

                  <div className={`stepper-connector ${getNormalizedStatus(selectedComplaint.status) === "In Progress" || getNormalizedStatus(selectedComplaint.status) === "Resolved" ? "active" : ""}`}></div>

                  {/* STEP 2: IN PROGRESS */}
                  <div className={`stepper-node ${getNormalizedStatus(selectedComplaint.status) === "In Progress" || getNormalizedStatus(selectedComplaint.status) === "Resolved" ? "completed" : ""}`}>
                    <div className="node-circle">
                      <FiTool size={18} />
                    </div>
                    <span className="node-label">In Repair</span>
                    <span className="node-time">
                      {getNormalizedStatus(selectedComplaint.status) === "In Progress" ? "Active" : getNormalizedStatus(selectedComplaint.status) === "Resolved" ? "Done" : "Pending"}
                    </span>
                  </div>

                  <div className={`stepper-connector ${getNormalizedStatus(selectedComplaint.status) === "Resolved" ? "active" : ""}`}></div>

                  {/* STEP 3: RESOLVED */}
                  <div className={`stepper-node ${getNormalizedStatus(selectedComplaint.status) === "Resolved" ? "completed resolved" : ""}`}>
                    <div className="node-circle">
                      <FiCheckCircle size={18} />
                    </div>
                    <span className="node-label">Restored</span>
                    <span className="node-time">
                      {getNormalizedStatus(selectedComplaint.status) === "Resolved" ? "Closed" : "Pending"}
                    </span>
                  </div>

                </div>
              </div>

              {/* STATUS ACTIONS PANEL */}
              <div className="status-control-actions">
                <h4>Update Status</h4>
                <div className="action-buttons-group">
                  {getNormalizedStatus(selectedComplaint.status) === "Pending" && (
                    <>
                      <button
                        className="action-btn assign"
                        disabled={updating}
                        onClick={() => handleStatusChange(selectedComplaint.id, "In Progress")}
                      >
                        <FiTool size={16} /> Start Repair Work
                      </button>
                      <button
                        className="action-btn resolve"
                        disabled={updating}
                        onClick={() => handleStatusChange(selectedComplaint.id, "Resolved")}
                      >
                        <FiCheckCircle size={16} /> Resolve Complaint
                      </button>
                    </>
                  )}

                  {getNormalizedStatus(selectedComplaint.status) === "In Progress" && (
                    <>
                      <button
                        className="action-btn resolve"
                        disabled={updating}
                        onClick={() => handleStatusChange(selectedComplaint.id, "Resolved")}
                      >
                        <FiCheckCircle size={16} /> Complete Repair & Close
                      </button>
                      <button
                        className="action-btn revert"
                        disabled={updating}
                        onClick={() => handleStatusChange(selectedComplaint.id, "Pending")}
                      >
                        <FiAlertCircle size={16} /> Revert to Pending
                      </button>
                    </>
                  )}

                  {getNormalizedStatus(selectedComplaint.status) === "Resolved" && (
                    <button
                      className="action-btn revert"
                      disabled={updating}
                      onClick={() => handleStatusChange(selectedComplaint.id, "Pending")}
                    >
                      <FiActivity size={16} /> Reopen Complaint
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="inspector-placeholder-card">
              <FiInbox size={64} className="glowing-icon" />
              <h3>No Complaint Selected</h3>
              <p>Select a complaint from the left-hand panel to view its details, visualize its repair stepper, and update its status.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

