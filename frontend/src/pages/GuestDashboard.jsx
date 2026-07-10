
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./DashBoard.css";

// const GuestDashboard = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("role");
//     localStorage.removeItem("token");
//     localStorage.removeItem("email"); // remove email on logout if stored
//     navigate("/login");
//   };

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-header">
//         <h1>🕳️ Citizen Dashboard</h1>
//         <button className="logout-btn" onClick={handleLogout}>
//           Logout
//         </button>
//       </header>

//        <p className="dashboard-subtitle">
//         Report potholes, track repair status, and help improve road safety.
//       </p>

//       <div className="dashboard-sections">
//         <div className="card">
//           <h2>📍 Report Pothole</h2>
//           <p>Submit a pothole report with location and images.</p>
//           <button
//             className="action-btn"
//             onClick={() =>navigate("/user/report-pothole")}
//           >
//             Report Now
//           </button>
//         </div>

//         <div className="card">
//           <h2>🚧 Repair Status</h2>
//           <p>Check whether reported potholes are fixed or in progress.</p>
//           <button
//             className="action-btn"
//             onClick={() => navigate("/user/tracking")}
//           >
//              View Status
//           </button>
//         </div>

//         <div className="card">
//           <h2>🗺️ Pothole Map</h2>
//           <p>View all reported potholes on a live geo-tagged map.</p>
//           <button
//             className="action-btn"
//             onClick={() => navigate("/user/payments")}
//           >
//             view map

//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestDashboard;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashBoard.css";

const GuestDashboard = () => {
  const [feedbacks, setFeedbacks] = React.useState([]);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/feedbacks");
      const data = res.data || [];
      setFeedbacks(data);
    } catch (err) {
      console.error("Failed to load feedbacks:", err);
      setFeedbacks([]);
    }
  };

  React.useEffect(() => {
    fetchFeedbacks();
  }, []);

  const [summaries, setSummaries] = React.useState({});

  const fetchSummaries = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/analytics/complaints/summary");
      const data = await res.json();
      setSummaries(data);
    } catch (err) {
      console.error("Failed to load summaries:", err);
      setSummaries({});
    }
  };

  React.useEffect(() => {
    fetchSummaries();
  }, []);

  const CARDS_DETAILS = [
    {
      emoji: "📍",
      title: "Report Pothole",
      description: "Submit a Pothole Complaint with location & image",
      path: "/user/new-complaint"
    },
    {
      emoji: "🚧",
      title: "Reports Status",
      description: "Check whether reported potholes are fixed or in progress",
      path: "/user/reports-status"
    },
    {
      emoji: "🗺️",
      title: "Potholes Mapping",
      description: "View all reported potholes on a live geo-tagged map",
      path: "/user/potholes-mapping"
    },
    {
      emoji: "📨",
      title: "Feedback",
      description: "Give feedback about the service",
      path: "/user/feedback"
    },
    // {
    //   emoji: "📞",
    //   title: "Contact Support",
    //   description: "Get in touch with our support team",
    //   path: "/user/message"
    // }
  ];

  const KPI_DETAILS = [
    {
      label: "Pending",
      value: summaries.pending || 0
    },
    {
      label: "In Progress",
      value: summaries.inprogress || 0
    },
    {
      label: "Resolve",
      value: summaries.resolved || 0
    },
    {
      label: "Feedbacks",
      value: feedbacks.length || 0
    },
  ];

  return (
    <div className="page user-dashboard-page">
      <h2>📊 Geo Tagging Pothole on Roads Within City</h2>
      <h4 className="gradient">Hello, {localStorage?.getItem("name")}!</h4>
      <h6 className="align-left">Your actions</h6>
      <div className="cards-grid">
        {CARDS_DETAILS.map((c, i) => (
          <Link to={c.path} className="custom-card" key={i} title={c.description}>
            <p className="emoji">{c.emoji}</p>
            <p className="title">{c.title}</p>
            <p className="description">{c.description}</p>
          </Link>
        ))}
      </div>
        <h6 className="align-left">Our KPIs</h6>
      <div className="cards-grid">
        {KPI_DETAILS.map((c, i) => (
          <div className="custom-card" key={i} title={c.label}>
            <p className="title">{c.label}</p>
            <p className="description">({c.value})</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestDashboard;
