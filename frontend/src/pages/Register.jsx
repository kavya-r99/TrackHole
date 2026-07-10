import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
 FiPhone,
  FiLock
} from "react-icons/fi";

import {
  MdOutlineLocationOn
} from "react-icons/md";

import "./Register.css";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // HANDLE INPUT
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setErrors({
      ...errors,
      [e.target.name]: ""
    });
  };

  // VALIDATION
  const validate = () => {

    let e = {};

    // NAME
    if (!form.name.trim()) {
      e.name = "Name is required";
    }
    else if (form.name.length < 3) {
      e.name = "Minimum 3 characters required";
    }

    // PHONE
    if (!/^[0-9]{10}$/.test(form.phone)) {
      e.phone = "Phone number must contain 10 digits";
    }

    // EMAIL
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter valid email";
    }

    // PASSWORD
    if (!form.password.trim()) {
      e.password = "Password is required";
    }
    else if (form.password.length < 8) {
      e.password = "Minimum 8 characters required";
    }
    else if (!/[A-Z]/.test(form.password)) {
      e.password = "Add one uppercase letter";
    }
    else if (!/[0-9]/.test(form.password)) {
      e.password = "Add one number";
    }
    else if (!/[!@#$%^&*]/.test(form.password)) {
      e.password = "Add one special character";
    }

    // ROLE
    if (!form.role) {
      e.role = "Please select role";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (ev) => {

    ev.preventDefault();

    if (!validate()) return;

    try {

      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      alert("Account Created Successfully!");

      navigate("/login");

    }
    catch (err) {

      alert(
        err.response?.data?.message ||
        "Registration Failed"
      );

    }
    finally {

      setLoading(false);

    }
  };

  document.title = "GeoTag Detect | Register";

  return (

    <div className="register-page">

      {/* LEFT SIDE */}
      <div className="left-side">

        <div className="left-content">

          <div className="logo-box">

            <MdOutlineLocationOn className="logo-icon" />

            <h1>GeoTag Detect</h1>

          </div>

          <h2>
            Smart Geo Tagging
            & Pothole Monitoring
          </h2>

          <p>
            Create your account and help improve
            road safety using intelligent
            geo tagging systems.
          </p>

          <div className="feature-box">

            <div className="feature">
              📍 Live Geo Tracking
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
      <div className="right-side">

        <form
          onSubmit={handleSubmit}
          className="register-card"
        >

          <div className="heading">

            <h2>Create Account 🚀</h2>

            <p>
              Register to continue using GeoTag Detect
            </p>

          </div>

          {/* NAME */}
          <div className="input-group">

            <label>Full Name</label>

            <div className="input-wrapper">

              <FiUser className="input-icon" />

              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={form.name}
                onChange={handleChange}
              />

            </div>

            {
              errors.name &&
              <span className="field-error">
                {errors.name}
              </span>
            }

          </div>

          {/* PHONE */}
          <div className="input-group">

            <label>Phone Number</label>

            <div className="input-wrapper">

              <FiPhone className="input-icon" />

              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
              />

            </div>

            {
              errors.phone &&
              <span className="field-error">
                {errors.phone}
              </span>
            }

          </div>

          {/* EMAIL */}
          <div className="input-group">

            <label>Email Address</label>

            <div className="input-wrapper">

              <FiMail className="input-icon" />

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
              />

            </div>

            {
              errors.email &&
              <span className="field-error">
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
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
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
              <span className="field-error">
                {errors.password}
              </span>
            }

          </div>

          {/* ROLE */}
          <div className="input-group">

            <label>Select Role</label>

            <div className="input-wrapper">

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="role-select"
              >

                <option value="">
                  Choose your role
                </option>

                <option value="citizen">
                  👤 Citizen
                </option>

                <option value="staff">
                  🛠 Staff
                </option>

                <option value="admin">
                  ⚙ Admin
                </option>

              </select>

              <span className="select-arrow">
                ▼
              </span>

            </div>

            {
              errors.role &&
              <span className="field-error">
                {errors.role}
              </span>
            }

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >

            {
              loading
                ? "Please wait..."
                : "Register"
            }

          </button>

          {/* BOTTOM */}
          <p className="bottom">

            Already have an account?

            <Link to="/login">
              Login
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
}