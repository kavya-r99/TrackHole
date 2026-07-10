import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Complaints.css";

const ImagePreview = ({ path, HandleClick }) => {
  return (
    <div className="image-preview">
      <img src={`http://localhost:5000/uploads/${path}`} alt="image preview" />
      <button onClick={HandleClick}>Close</button>
    </div>
  );
};

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [image, setImage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef(null);
  const tableWrapperRef = useRef(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints");
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await axios.put(`http://localhost:5000/api/complaints/${id}/status`, { status: newStatus });

      setComplaints((prev) =>
        prev.map((c) => (c.complaintid === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleScroll = (e) => {
    setShowScrollTop(e.currentTarget.scrollTop > 250);
  };

  // const scrollToTop = () => {
  //   if (containerRef.current) {
  //     containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
  //   }
  // };

  document.title = "Admin | Complaints";

  return (
    <div ref={containerRef} onScroll={handleScroll} className="admin-page complaints-page">
      <h2>Geo Tagging Pothole on Roads Within City</h2>
      <h4 className="gradient">Customer complaints</h4>
      <div ref={tableWrapperRef} className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th className="nowrap">Description</th>
              <th className="max-width nowrap">Location</th>
              <th>Image</th>
              <th>Status</th>
              <th className="nowrap">Submitted By</th>
            </tr>
          </thead>
          <tbody>
            {[...complaints].reverse().map((c) => (
              <tr key={c.complaintid}>
                <td>{c.complaintid}</td>
                <td className="nowrap">{new Date(c.complaint_date).toLocaleString()}</td>
                <td className="nowrap">
                  <p title={c.complaint_desc} className="pointer">
                    {String(c.complaint_desc).substring(0, 25)}
                    {String(c.complaint_desc).length > 25 && "..."}
                  </p>
                </td>
                <td title={c.location}>
                  <p title={c.location} className="pointer">
                    {String(c.location).substring(0, 70)}
                    {String(c.location).length > 70 && "..."}
                  </p>
                </td>
                <td>
                  <img
                    src={`http://localhost:5000/uploads/${c.picture}`}
                    alt="complaint"
                    className="complaint-img"
                    onClick={() => setImage(c.picture)}
                  />
                </td>
                <td>
                  <select
                    value={c.status || "Pending"}
                    onChange={(e) => updateStatus(c.complaintid, e.target.value)}
                    className={`status-select ${c.status}`}
                    disabled={updatingId === c.complaintid}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td>{c.userid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {image !== null && <ImagePreview path={image} HandleClick={() => setImage(null)} />}

      
    </div>
  );
}
