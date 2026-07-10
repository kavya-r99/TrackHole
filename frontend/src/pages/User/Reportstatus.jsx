import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Reportstatus.css";

export default function ReportStatus() {
  // const [code, setCode] = useState("");
  // const [shipment, setShipment] = useState(null);
  // const [error, setError] = useState("");
  // const [newStatus, setNewStatus] = useState("");
  // const [location, setLocation] = useState("");
  // const [message, setMessage] = useState("");
  const [complaints, setComplaints] = useState([]);
  const userID = localStorage?.getItem("uid");

  // get current user from localStorage (if available)
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
      return null;
    }
  });

  // const fetchShipment = async () => {
  //   try {
  //     setError("");
  //     setMessage("");
  //     const res = await axios.get(`http://localhost:5000/api/shipments/track/${code}`);
  //     setShipment(res.data);
  //     setError("");
  //     setMessage("");
  //   } catch (err) {
  //     setShipment(null);
  //     setError("Shipment not found");
  //     setMessage("");
  //   }
  // };

  // Use existing admin update endpoint by resolving shipment_id first
  // const reportStatus = async () => {
  //   if (!code) return setError("Enter shipment code first");
  //   if (!newStatus) return setError("Select or enter a status to report");

  //   try {
  //     setError("");
  //     setMessage("");
  //     // get all shipments and find the id for the provided code
  //     const listRes = await axios.get("http://localhost:5000/api/shipments");
  //     const found = listRes.data.find((s) => s.shipment_code === code || s.shipment_code === (shipment && shipment.shipment_code));
  //     if (!found) {
  //       setError("Shipment record not found to update");
  //       return;
  //     }

  //     const id = found.shipment_id || found.id;
  //     await axios.put(`http://localhost:5000/api/admin/shipments/${id}/status`, {
  //       status: newStatus,
  //       tracking_location: location || null,
  //     });

  //     setMessage("Status reported successfully");
  //     setError("");
  //     // refresh displayed shipment info
  //     await fetchShipment();
  //     fetchComplaints();
  //   } catch (err) {
  //     console.error(err);
  //     setError("Failed to report status");
  //     setMessage("");
  //   }
  // };

  // Fetch user's complaints and show statuses
  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints");
      const all = res.data || [];

      const normalized = all.map((c) => ({
        id: c.complaintid || c.complaint_id || c.id || Math.random().toString(36).slice(2, 9),
        complaint_desc: c.complaint_desc || c.description || c.desc || "Complaint",
        location: c.location || c.address || c.loc || "",
        status: c.status || c.complaint_status || c.state || "Pending",
        complaint_date: c.complaint_date || c.date || c.created_at || null,
        userid: c.userid,
      }));

      setComplaints(normalized);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setComplaints([]);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="page pothole-mapping-page">
      <h2>📊 Geo Tagging Pothole on Roads Within City</h2>
      <h4 className="gradient">Reports Status</h4>
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Location</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {complaints.reverse().map((c) => (
              <tr key={c.complaintid} className={`complaint-row status-${c.status.toLowerCase().replace(/\s/g, "-")} ${(String(c.userid) === String(userID)) ? "highlight" : ""}`}>
                <td>
                  <div className="flow-column">
                    <p
                      title={c.complaint_desc}
                      className="pointer">{String(c.complaint_desc).substring(0, 25)}{(String(c.complaint_desc).length > 25) && "..."}</p>
                  </div>
                </td>
                <td>
                  <p
                    title={`Click to copy location: "${c.location}"`}
                    className="pointer"
                    onClick={() => navigator.clipboard.writeText(c.location)}
                  >{String(c.location).substring(0, 50)}...</p>
                </td>
                <td>{c.status}</td>
                <td>
                  <p>{new Date(c.complaint_date).toLocaleString()}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // return (
  //   <div className="track-container">
  //     <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-start" }}>
  //       <Link to="/user" style={{
  //         display: "inline-flex",
  //         alignItems: "center",
  //         padding: "10px 18px",
  //         background: "linear-gradient(135deg, #4e73df 0%, #224abe 100%)",
  //         color: "#fff",
  //         textDecoration: "none",
  //         borderRadius: "8px",
  //         fontWeight: 600,
  //         fontSize: "14px",
  //         boxShadow: "0 4px 12px rgba(78, 115, 223, 0.3)",
  //         transition: "all 0.3s ease",
  //         cursor: "pointer"
  //       }} onMouseEnter={(e) => {
  //         e.currentTarget.style.boxShadow = "0 8px 20px rgba(78, 115, 223, 0.5)";
  //         e.currentTarget.style.transform = "translateY(-2px)";
  //       }} onMouseLeave={(e) => {
  //         e.currentTarget.style.boxShadow = "0 4px 12px rgba(78, 115, 223, 0.3)";
  //         e.currentTarget.style.transform = "translateY(0)";
  //       }}>← Back to Dashboard</Link>
  //     </div>
  //     <h2>📝 Report Status</h2>



  //     {error && <p className="error">{error}</p>}
  //     {message && <p style={{ color: "green", fontWeight: 600 }}>{message}</p>}

  //     {shipment && (
  //       <div className="track-result">
  //         <h4>Current Status: {shipment.current_status}</h4>
  //         <p><strong>From:</strong> {shipment.origin}</p>
  //         <p><strong>To:</strong> {shipment.destination}</p>
  //         <p><strong>Current Location:</strong> {shipment.tracking_location}</p>
  //         <p><strong>Last Updated:</strong> {shipment.last_updated ? new Date(shipment.last_updated).toLocaleString() : "-"}</p>

  //         <div style={{ marginTop: 12 }} className="result-card">
  //           <label><strong>Report New Status</strong></label>
  //           <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
  //             <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
  //               <option value="">-- Select Status --</option>
  //               <option value="In Transit">In Transit</option>
  //               <option value="Delayed">Delayed</option>
  //               <option value="Out for Delivery">Out for Delivery</option>
  //               <option value="Delivered">Delivered</option>
  //               <option value="Exception">Exception</option>
  //             </select>
  //             <input
  //               type="text"
  //               placeholder="Location (optional)"
  //               value={location}
  //               onChange={(e) => setLocation(e.target.value)}
  //             />
  //             <button onClick={reportStatus}>Report</button>
  //           </div>
  //         </div>
  //       </div>
  //     )}

  //     {/* User complaints and their statuses */}
  //     <div style={{ marginTop: 20 }}>
  //       <h3>Our citizen Complaints</h3>
  //       {complaints.length === 0 ? (
  //         <p style={{ color: "#666" }}>No complaints found.</p>
  //       ) : (
  //         <div style={{
  //           border: "1px solid #ddd",
  //           borderRadius: "8px",
  //           overflow: "auto",
  //           maxHeight: "60vh",
  //           boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  //         }}>
  //           <table style={{
  //             borderCollapse: "collapse",
  //             width: "100%",
  //             minWidth: "700px",
  //             backgroundColor: "#fff"
  //           }}>
  //           <thead style={{
  //             position: "sticky",
  //             top: 0,
  //             background: "linear-gradient(135deg, #4e73df 0%, #224abe 100%)",
  //             zIndex: 10
  //           }}>
  //             <tr>
  //               <th style={{
  //                 textAlign: "left",
  //                 padding: "12px 16px",
  //                 fontWeight: 600,
  //                 color: "#fff",
  //                 fontSize: "13px",
  //                 letterSpacing: "0.5px",
  //                 borderBottom: "2px solid rgba(255,255,255,0.2)"
  //               }}>Description</th>
  //               <th style={{
  //                 textAlign: "left",
  //                 padding: "12px 16px",
  //                 fontWeight: 600,
  //                 color: "#fff",
  //                 fontSize: "13px",
  //                 letterSpacing: "0.5px",
  //                 borderBottom: "2px solid rgba(255,255,255,0.2)"
  //               }}>Location</th>
  //               <th style={{
  //                 textAlign: "center",
  //                 padding: "12px 16px",
  //                 fontWeight: 600,
  //                 color: "#fff",
  //                 fontSize: "13px",
  //                 letterSpacing: "0.5px",
  //                 borderBottom: "2px solid rgba(255,255,255,0.2)"
  //               }}>Status</th>
  //               <th style={{
  //                 textAlign: "left",
  //                 padding: "12px 16px",
  //                 fontWeight: 600,
  //                 color: "#fff",
  //                 fontSize: "13px",
  //                 letterSpacing: "0.5px",
  //                 borderBottom: "2px solid rgba(255,255,255,0.2)"
  //               }}>Date</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {complaints.map((c) => (
  //               <tr key={c.complaintid} style={{
  //                 borderBottom: "1px solid #f0f0f0",
  //                 transition: "background-color 0.2s ease",
  //                 cursor: "pointer"
  //               }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fbfd"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>

  //                 <td style={{
  //                   textAlign: "left",
  //                   padding: "12px 16px",
  //                   fontSize: "14px"
  //                 }}>
  //                   <div style={{ fontWeight: 600, color: "#222" }}>{c.complaint_desc || "Complaint"}</div>
  //                 </td>
  //                 <td style={{
  //                   textAlign: "left",
  //                   padding: "12px 16px",
  //                   fontSize: "13px",
  //                   maxWidth: "250px",
  //                   whiteSpace: "nowrap",
  //                   overflow: "hidden",
  //                   textOverflow: "ellipsis"
  //                 }}>
  //                   <div style={{ color: "#555" }} title={c.location}>{c.location || "-"}</div>
  //                 </td>
  //                 <td style={{
  //                   textAlign: "center",
  //                   padding: "12px 16px",
  //                   fontSize: "13px"
  //                 }}>
  //                   <span style={{
  //                     display: "inline-block",
  //                     padding: "4px 10px",
  //                     borderRadius: "16px",
  //                     fontWeight: 600,
  //                     fontSize: "12px",
  //                     backgroundColor: c.status === "Resolved" ? "#d4edda" : c.status === "In Progress" || c.status === "In Work" ? "#fff3cd" : "#e2e3e5",
  //                     color: c.status === "Resolved" ? "#155724" : c.status === "In Progress" || c.status === "In Work" ? "#856404" : "#383d41"
  //                   }}>{c.status || "Pending"}</span>
  //                 </td>
  //                 <td style={{
  //                   textAlign: "left",
  //                   padding: "12px 16px",
  //                   fontSize: "13px",
  //                   color: "#666",
  //                   whiteSpace: "nowrap"
  //                 }}>
  //                   {new Date(c.complaint_date || Date.now()).toLocaleString()}
  //                 </td>

  //               </tr>
  //             ))}
  //           </tbody>
  //           </table>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
}
