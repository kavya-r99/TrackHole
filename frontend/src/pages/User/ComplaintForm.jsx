import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPaperPlane, FaClock, FaMapMarkerAlt, FaImage } from "react-icons/fa";
import "./ComplaintForm.css";

export default function ComplaintForm() {
  const email = localStorage.getItem("email");
  const uid = localStorage.getItem("uid");
  const name = localStorage?.getItem("name");
  const [form, setForm] = useState({
    complaint_date: "",
    complaint_desc: "",
    location: "",
    userid: "",
    picture: null
  });
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 19).replace("T", " ");

    setForm(prev => ({
      ...prev,
      complaint_date: formatted,
      userid: uid || "anonymous"
    }));

    fetchComplaints();
  }, []);

  setInterval(() => {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 19).replace("T", " ");

    setForm(prev => ({
      ...prev,
      complaint_date: formatted,
      userid: uid || "anonymous"
    }));
  }, 1000);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = e => {
    setForm({ ...form, picture: e.target.files[0] });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));

    try {
      try {
        await axios.post("http://localhost:5000/api/complaints", data);
      } catch {
        await axios.post("http://localhost:5000/complaints", data);
      }
      alert("✅ Complaint Submitted Successfully");

      setForm(prev => ({
        ...prev,
        complaint_desc: "",
        location: "",
        picture: null
      }));

      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit complaint");
    }
  };

  document.title = `${name} | Report Complaint`;

  return (
    <div className="page report-pothole-page">
      <h2>📊 Geo Tagging Pothole on Roads Within City</h2>
      <form onSubmit={handleSubmit} className="custom-form">
        <div className="heading">
          <h3>Report Complaint</h3>
        </div>
        <div className="input-field">
          <p>Date & Time</p>
          <input
            type="text"
            value={form.complaint_date}
            disabled
          />
        </div>

        <div className="input-field">
          <p>Description</p>
          <textarea
            name="complaint_desc"
            value={form.complaint_desc}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-field">
          <p>Location</p>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-field">
          <p>Upload Image</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            required  
          />
        </div>

        <div className="input-field">
          <p>Submitted By</p>
          <input
            type="email"
            value={email}
            disabled
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}


