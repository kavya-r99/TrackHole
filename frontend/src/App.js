import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";

import Sidebar from "./components/Sidebar";

// ================= PUBLIC PAGES =================
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// ================= ADMIN PAGES =================
import AdminDashboard from "./pages/AdminDashboard";
import Clients from "./pages/admin/Clients";
import Complaints from "./pages/admin/Complaints";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import AdminReportStatus from "./pages/admin/Reportstatus";
import Feedbacks from "./pages/admin/Feedbacks";

// ================= USER PAGES =================
import GuestDashboard from "./pages/GuestDashboard";
import ReportStatus from "./pages/User/Reportstatus";
import ComplaintForm from "./pages/User/ComplaintForm";
import Feedback from "./pages/User/feedback";
import Messages from "./pages/admin/Messages";
import PotholeMapping from "./pages/User/potholemapping";
import Message from "./pages/User/message";

// ================= STAFF PAGES =================
import StaffDashboard from "./pages/StaffDashboard";


function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  useEffect(() => {
    const root = document?.querySelector("#root");
    if (!root) return;
    const normalizedRole = String(role || "").trim().toLowerCase();

    if (normalizedRole === "admin" || normalizedRole === "staff") {
      root.classList.add("admin-pages");
      root.classList.remove("user-pages");
    }
    if (["user", "customer", "citizen"].includes(normalizedRole)) {
      root.classList.add("user-pages");
      root.classList.remove("admin-pages");
    }
    if (normalizedRole === "") {
      root.classList.remove("user-pages");
      root.classList.remove("admin-pages");
    }
  }, [role]);
  return (
    <Router>
      <Sidebar showDefault={window.innerWidth < 726 ? false : true } />
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/clients" element={<Clients />} />
        <Route path="/admin/complaints" element={<Complaints />} />
        <Route path="/admin/feedbacks" element={<Feedbacks />} />
        <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
        <Route path="/admin/messages" element={<Messages />} />
        <Route path="/admin/tracking" element={<AdminReportStatus />} />
        <Route path="/admin/work-status" element={<AdminReportStatus />} />

        {/* TEMP PLACEHOLDERS */}
        <Route path="/admin/warehouses" element={<div>Warehouses Page</div>} />
        <Route path="/admin/routes" element={<div>Routes Page</div>} />
        <Route path="/admin/payments" element={<div>Payments Page</div>} />
        <Route path="/admin/support" element={<div>Support Page</div>} />
        <Route path="/admin/reports" element={<div>Reports Page</div>} />
        <Route path="/admin/settings" element={<div>Settings Page</div>} />

        {/* ================= USER ROUTES ================= */}
        <Route path="/user" element={<GuestDashboard />} />
        <Route path="/user/reports-status" element={<ReportStatus />} />
        <Route path="/user/new-complaint" element={<ComplaintForm />} />
        <Route path="/user/feedback" element={<Feedback />} />
        <Route path="/user/potholes-mapping" element={<PotholeMapping />} />
        <Route path="/user/message" element={<Message />} />


        {/* ================= STAFF ROUTES ================= */}
        <Route path="/staff" element={<StaffDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
