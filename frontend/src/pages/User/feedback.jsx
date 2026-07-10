import React, { useState } from "react";
import axios from "axios";
import "./feedback.css"
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: localStorage?.getItem("name"),
    email: localStorage?.getItem("email"),
    phone: localStorage?.getItem("phone"),
    feedback: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/auth/feedback", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        feedback: formData.feedback
      })
        .then(res => {
          setMessage(res.data?.message || "Feedback sent!");
          setFormData({
            name: "",
            email: "",
            phone: "",
            feedback: "",
          });
        }).catch(err => console.error(err));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="page feedback-page">
      <h2>📊 Geo Tagging Pothole on Roads Within City</h2>
      <form onSubmit={handleSubmit} className="custom-form">
        <div className="heading">
          <h3>Feedback</h3>
        </div>
        <div className="input-field">
          <p>Write your Feedback</p>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default Feedback;