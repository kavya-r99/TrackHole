import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiMessageSquare,
  FiBarChart2,
  FiLogOut,
  FiMap,
  FiActivity,
  FiLayers
} from "react-icons/fi";
import "../styles/adminstyles.css";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({});
  const [feedbackCount, setFeedbackCount] = useState(0);
  const navigate = useNavigate();

  const CARDS_DETAILS = [
    {
      path: "/admin/complaints",
      label: "Citizen Complaints",
      icon: <FiAlertCircle size={24} />,
      colorClass: "card-complaints"
    },
    {
      path: "/admin/work-status",
      label: "Work Order Status",
      icon: <FiActivity size={24} />,
      colorClass: "card-status"
    },
    {
      path: "/user/potholes-mapping",
      label: "Interactive Pothole Map",
      icon: <FiMap size={24} />,
      colorClass: "card-map"
    },
    {
      path: "/admin/feedbacks",
      label: "Citizens Feedback",
      icon: <FiMessageSquare size={24} />,
      colorClass: "card-feedbacks"
    },
    {
      path: "/admin/clients",
      label: "Registered Citizens",
      icon: <FiUsers size={24} />,
      colorClass: "card-citizens"
    },
    {
      path: "/admin/messages",
      label: "Support Messages",
      icon: <FiMessageSquare size={24} />,
      colorClass: "card-messages"
    },
    {
      path: "/admin/analytics",
      label: "Analytics & Trends",
      icon: <FiBarChart2 size={24} />,
      colorClass: "card-analytics"
    }
  ];

  const KPI_DETAILS = [
    {
      label: "Total Complaints",
      value: summary.total || 0,
      glowClass: "blue",
      icon: <FiLayers size={20} />
    },
    {
      label: "Pending Inspection",
      value: summary.pending || 0,
      glowClass: "red",
      icon: <FiAlertCircle size={20} />
    },
    {
      label: "In Active Repair",
      value: summary.inprogress || 0,
      glowClass: "amber",
      icon: <FiClock size={20} />
    },
    {
      label: "Resolved & Restored",
      value: summary.resolved || 0,
      glowClass: "green",
      icon: <FiCheckCircle size={20} />
    },
    {
      label: "User Feedbacks",
      value: feedbackCount || 0,
      glowClass: "teal",
      icon: <FiMessageSquare size={20} />
    }
  ];

  useEffect(() => {
    fetchSummary();
    fetchFeedbackCount();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/analytics/complaints/summary");
      setSummary(res.data || {});
    } catch (err) {
      console.error("Failed to load complaint summary:", err);
      setSummary({});
    }
  };

  const fetchFeedbackCount = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/feedbacks");
      setFeedbackCount(Array.isArray(res.data) ? res.data.length : 0);
    } catch (err) {
      console.error("Failed to load feedbacks:", err);
      setFeedbackCount(0);
    }
  };

  const handleLogout = () => {
    const isConfirm = window.confirm("Are you sure, do you want to Logout?");
    if (isConfirm === true) {
      localStorage.removeItem("uid");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      localStorage.removeItem("phone");
      window.location.href = "/login";
    }
  };

  document.title = "Admin | Home";

  return (
    <div className="admin-page dashboard-page">
      <h2>🛠️ Geo Tagging Pothole on Roads Within City</h2>
      <h4 className="gradient">Admin Control Center</h4>

      {/* NAVIGATION CARDS GRID */}
      <h5 className="section-title" style={{ marginTop: "24px" }}>Operations Control</h5>
      <div className="cards-grid">
        {CARDS_DETAILS.map((c, i) => (
          <Link to={c.path} key={i} className={`custom-card ${c.colorClass}`}>
            <span className="card-icon-wrapper">{c.icon}</span>
            <p className="title">{c.label}</p>
          </Link>
        ))}
        {/* LOGOUT CARD */}
        <div onClick={handleLogout} className="custom-card logout-card">
          <span className="card-icon-wrapper"><FiLogOut size={24} /></span>
          <p className="title">Logout Profile</p>
        </div>
      </div>

      {/* KPI METRICS ROW */}
      <h5 className="section-title" style={{ marginTop: "40px" }}>Real-time Statistics</h5>
      <div className="stats-dashboard-row">
        {KPI_DETAILS.map((kpi, i) => (
          <div key={i} className={`stat-glow-card ${kpi.glowClass}`}>
            <div className="stat-card-icon">
              {kpi.icon}
            </div>
            <div className="stat-card-data">
              <h3>{kpi.value}</h3>
              <span>{kpi.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
