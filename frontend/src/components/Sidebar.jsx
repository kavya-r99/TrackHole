import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiAlertCircle,
  FiUsers,
  FiMessageSquare,
  FiBarChart2,
  FiInfo,
  FiPhone,
  FiLogIn,
  FiUserPlus,
  FiPlus,
  FiActivity,
  FiMap,
  FiPhoneCall,
  FiLogOut
} from "react-icons/fi";
import "./Sidebar.css";

function Sidebar({ showDefault = Boolean }) {
  const rawRole = String(localStorage.getItem("role") || "").trim().toLowerCase();
  const role = rawRole === "citizen" ? "customer" : rawRole;
  const isCitizenRole = ["customer", "user"].includes(role);
  const name = localStorage?.getItem("name") || "";
  const email = localStorage?.getItem("email") || "";
  const sidebarWrapperRef = useRef(null);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(showDefault);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(prev => {
      if (prev === true) {
        document.body.style.overflow = "auto";
        document.querySelector(".sidebar-wrapper").style.display = "none"
      } else {
        document.body.style.overflow = "hidden";
        document.querySelector(".sidebar-wrapper").style.display = "flex"
      }
      return !prev;
    });
  };

  const isActive = (path) => {
    return (location.pathname === path) ? "active" : ""
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
    } else {
      return;
    }
  }

  return (
    <>
      {(isActive && window.innerWidth < 726) && <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>}

      <div ref={sidebarWrapperRef} className={`sidebar-wrapper ${(window.innerWidth < 726) ? "is-mobile" : ""} ${((isOpen) ? "open" : "")}`}>
        {<div className="sidebar">
          {/* USER PROFILE SECTION */}
          {role ? (
            <div className="sidebar-profile">
              <div className="profile-avatar">
                {name ? name.charAt(0).toUpperCase() : role.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <div className="profile-name" title={name}>{name || "Citizen"}</div>
                <div className="profile-role-badge-wrapper">
                  <span className={`profile-role-badge ${role}`}>
                    {role === "customer" || role === "user" ? "Citizen" : role.toUpperCase()}
                  </span>
                </div>
                <div className="profile-email" title={email}>{email}</div>
              </div>
            </div>
          ) : (
            <div className="sidebar-profile guest">
              <div className="profile-avatar">G</div>
              <div className="profile-info">
                <div className="profile-name">Guest Citizen</div>
                <div className="profile-role-badge-wrapper">
                  <span className="profile-role-badge guest">GUEST</span>
                </div>
              </div>
            </div>
          )}

          <div className="divider"></div>
          <div className="sidebar-nav-wrapper">
            <nav className="sidebar-nav">

              {/* Common Links */}
              {(role === "") && <Link
                onClick={() => {
                  if (window.innerWidth < 726) {
                    toggleSidebar();
                  }
                }}
                to="/"
                className={`custom-nav-link ${isActive("/") ? "active" : ""}`}
              >
                <FiHome size={20} />
                <span>Home</span>
              </Link>}
              {(role === "") && <Link
                onClick={() => {
                  if (window.innerWidth < 726) {
                    toggleSidebar();
                  }
                }}
                to="/about"
                className={`custom-nav-link ${isActive("/about") ? "active" : ""}`}
              >
                <FiInfo size={20} />
                <span>About</span>
              </Link>}
              {(role === "") && <Link
                onClick={() => {
                  if (window.innerWidth < 726) {
                    toggleSidebar();
                  }
                }}
                to="/contact"
                className={`custom-nav-link ${isActive("/contact") ? "active" : ""}`}
              >
                <FiPhone size={20} />
                <span>Contact</span>
              </Link>}
              {(role === "") && <Link
                onClick={() => {
                  if (window.innerWidth < 726) {
                    toggleSidebar();
                  }
                }}
                to="/register"
                className={`custom-nav-link ${isActive("/register") ? "active" : ""}`}
              >
                <FiUserPlus size={20} />
                <span>Register</span>
              </Link>}
              {(role === "") && <Link
                onClick={() => {
                  if (window.innerWidth < 726) {
                    toggleSidebar();
                  }
                }}
                to="/login"
                className={`custom-nav-link ${isActive("/login") ? "active" : ""}`}
              >
                <FiLogIn size={20} />
                <span>Login</span>
              </Link>}

              {/* Admin Links */}
              {role === "admin" && <Link
                onClick={() => {
                  if (window.innerWidth < 726) {
                    toggleSidebar();
                  }
                }}
                to="/admin"
                className={`custom-nav-link ${isActive("/admin") ? "active" : ""}`}
              >
                <FiHome size={20} />
                <span>Dashboard</span>
              </Link>}
              {role === "admin" && <Link
                onClick={() => {
                  if (window.innerWidth < 726) {
                    toggleSidebar();
                  }
                }}
                to="/admin/complaints"
                className={`custom-nav-link ${isActive("/admin/complaints") ? "active" : ""}`}
              >
                <FiAlertCircle size={20} />
                <span>Complaints</span>
              </Link>}
              {role === "admin" && <Link
                onClick={() => {
                  if (window.innerWidth < 726) {
                    toggleSidebar();
                  }
                }}
                to="/admin/work-status"
                className={`custom-nav-link ${isActive("/admin/work-status") || isActive("/admin/tracking") ? "active" : ""}`}
              >
                <FiActivity size={20} />
                <span>Work Status</span>
              </Link>}
              {role === "admin" && <Link
                onClick={() => {
                  if (window.innerWidth < 726) {
                    toggleSidebar();
                  }
                }}
                to="/user/potholes-mapping"
                className={`custom-nav-link ${isActive("/user/potholes-mapping") ? "active" : ""}`}
              >
                <FiMap size={20} />
                <span>Pothole Map</span>
              </Link>}
              {role === "admin" && <Link
                onClick={() => {
                  if (window.innerWidth < 726) {
                    toggleSidebar();
                  }
                }}
                to="/admin/feedbacks"
                className={`custom-nav-link ${isActive("/admin/feedbacks") ? "active" : ""}`}
              >
                <FiMessageSquare size={20} />
                <span>Feedbacks</span>
              </Link>}
              {role === "admin" && <Link
                onClick={() => {
                  if (window.innerWidth < 726) {
                    toggleSidebar();
                  }
                }}
                to="/admin/clients"
                className={`custom-nav-link ${isActive("/admin/clients") ? "active" : ""}`}
              >
                <FiUsers size={20} />
                <span>Citizens</span>
              </Link>}
              {role === "admin" && <Link
                onClick={() => {
                  if (window.innerWidth < 726) {
                    toggleSidebar();
                  }
                }}
                to="/admin/messages"
                className={`custom-nav-link ${isActive("/admin/messages") ? "active" : ""}`}
              >
                <FiMessageSquare size={20} />
                <span>Messages</span>
              </Link>}
              {role === "admin" && <Link
                onClick={() => {
                  if (window.innerWidth < 726) {
                    toggleSidebar();
                  }
                }}
                to="/admin/analytics"
                className={`custom-nav-link ${isActive("/admin/analytics") ? "active" : ""}`}
              >
                <FiBarChart2 size={20} />
                <span>Analytics</span>
              </Link>}

              {/* Staff Links */}
              {role === "staff" && <Link
                onClick={() => {
                  if (window.innerWidth < 726) {
                    toggleSidebar();
                  }
                }}
                to="/staff"
                className={`custom-nav-link ${isActive("/staff") ? "active" : ""}`}
              >
                <FiHome size={20} />
                <span>Dashboard</span>
              </Link>}

              {/* User Links */}
              {isCitizenRole && <>
                <Link
                  onClick={() => {
                    if (window.innerWidth < 726) {
                      toggleSidebar();
                    }
                  }}
                  to="/user"
                  className={`custom-nav-link ${isActive("/user") ? "active" : ""}`}
                >
                  <FiHome size={20} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  onClick={() => {
                    if (window.innerWidth < 726) {
                      toggleSidebar();
                    }
                  }}
                  to="/user/new-complaint"
                  className={`custom-nav-link ${isActive("/user/new-complaint") ? "active" : ""}`}
                >
                  <FiPlus size={20} />
                  <span>Complaint</span>
                </Link>
                <Link
                  onClick={() => {
                    if (window.innerWidth < 726) {
                      toggleSidebar();
                    }
                  }}
                  to="/user/reports-status"
                  className={`custom-nav-link ${isActive("/user/reports-status") ? "active" : ""}`}
                >
                  <FiActivity size={20} />
                  <span>Status</span>
                </Link>
                <Link
                  onClick={() => {
                    if (window.innerWidth < 726) {
                      toggleSidebar();
                    }
                  }}
                  to="/user/potholes-mapping"
                  className={`custom-nav-link ${isActive("/user/potholes-mapping") ? "active" : ""}`}
                >
                  <FiMap size={20} />
                  <span>Mapping</span>
                </Link>
                <Link
                  onClick={() => {
                    if (window.innerWidth < 726) {
                      toggleSidebar();
                    }
                  }}
                  to="/user/feedback"
                  className={`custom-nav-link ${isActive("/user/feedback") ? "active" : ""}`}
                >
                  <FiMessageSquare size={20} />
                  <span>Feedback</span>
                </Link>
                <Link
                  onClick={() => {
                    if (window.innerWidth < 726) {
                      toggleSidebar();
                    }
                  }}
                  to="/user/message"
                  className={`custom-nav-link ${isActive("/user/message") ? "active" : ""}`}
                >
                  <FiPhoneCall size={20} />
                  <span>Support</span>
                </Link>
              </>}
            </nav>
          </div>

          {/* Logout Button */}
          {role && <div className="logout-btn-wrapper">
            <button onClick={handleLogout} className="admin-logout-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiLogOut size={16} style={{ marginRight: "8px" }} />
              Logout
            </button>
          </div>}
        </div>}
      </div>
      {/* OVERLAY FOR MOBILE */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
}

export default Sidebar;
