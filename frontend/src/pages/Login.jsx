import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock
} from "react-icons/fi";

import {
  MdOutlineLocationOn
} from "react-icons/md";

import "./Login.css";

export default function Login({ setRole }) {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // HANDLE INPUT
  const handleChange = (e) => {

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: ""
    }));
  };

  // VALIDATION
  const validateForm = () => {

    let newErrors = {};

    // EMAIL
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter valid email";
    }

    // PASSWORD
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }
    else if (form.password.length < 8) {
      newErrors.password = "Minimum 8 characters required";
    }
    else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Add at least one uppercase letter";
    }
    else if (!/[0-9]/.test(form.password)) {
      newErrors.password = "Add at least one number";
    }
    else if (!/[!@#$%^&*]/.test(form.password)) {
      newErrors.password = "Add one special character";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // LOGIN
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      const user = res?.data?.user;
      const userRole = user?.role;

      alert(res?.data?.message || "Login successful");

      localStorage.setItem("uid", user?.id);
      localStorage.setItem("name", user?.name);
      localStorage.setItem("email", user?.email);
      localStorage.setItem("phone", user?.phone);
      localStorage.setItem("role", userRole);

      if (setRole) {
        setRole(userRole);
      }

      // ROLE NAVIGATION
      if (userRole === "admin") {
        navigate("/admin");
      }
      else if (userRole === "staff") {
        navigate("/staff");
      }
      else {
        navigate("/user");
      }

    }
    catch (err) {

      alert(
        err.response?.data?.message || "Login failed"
      );

    }
    finally {

      setLoading(false);

    }
  };

  document.title = "GeoTag Detect | Login";

  return (

    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="left-section">

        <div className="overlay"></div>

        <div className="left-content">

          <div className="logo-box">

            <MdOutlineLocationOn className="logo-icon" />

            <h1>GeoTag Detect</h1>

          </div>

          <h2>
            Smart Pothole Detection
            & Geo Tagging
          </h2>

          <p>
            Monitor damaged roads, detect potholes
            and manage road safety using intelligent
            geo tagging systems.
          </p>

          <div className="feature-box">

            <div className="feature">
              📍 Live Location Tracking
            </div>

            <div className="feature">
              🛣 Smart Road Monitoring
            </div>

            <div className="feature">
              ⚡ Faster Complaint Management
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="right-section">

        <form
          className="login-card"
          onSubmit={handleSubmit}
        >

          <div className="form-heading">

            <h2>Welcome Back 👋</h2>

            <p>
              Login to continue monitoring city roads
            </p>

          </div>

          {/* EMAIL */}
          <div className="input-group">

            <label>Email Address</label>

            <div className="input-wrapper">

              <FiMail className="input-icon" />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                autoComplete="off"
              />

            </div>

            {
              errors.email &&
              <span className="error">
                {errors.email}
              </span>
            }

          </div>

          {/* PASSWORD */}
          <div className="input-group">

            <label>Password</label>

            <div className="input-wrapper">

              <FiLock className="input-icon" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="off"
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >

                {
                  showPassword
                    ? <FiEyeOff />
                    : <FiEye />
                }

              </button>

            </div>

            {
              errors.password &&
              <span className="error">
                {errors.password}
              </span>
            }

          </div>

          {/* FORGOT PASSWORD */}
          <div className="forgot-link">

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >

            {
              loading
                ? "Please wait..."
                : "Login"
            }

          </button>

          {/* REGISTER */}
          <div className="bottom-text">

            Don&apos;t have an account?

            <Link to="/register">
              Register
            </Link>

          </div>

        </form>

      </div>

    </div>
  );
}