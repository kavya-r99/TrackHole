import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../Home.css";

export default function Home() {

  const cards = [
    {
      title: "Report Pothole",
      desc: "Citizens can instantly report potholes with geo-tagged images and exact location tracking.",
      img: "/potholes.jpg",
      link: "/login"
    },
    {
      title: "Explore City Map",
      desc: "Monitor all reported potholes across the city through live interactive mapping.",
      img: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop",
      link: "/map"
    },
    {
      title: "Smart Road Analytics",
      desc: "Track road conditions, pending repairs, and smart city maintenance updates.",
      img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
      link: "/dashboard"
    }
  ];

  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="top-navbar">
        <div className="logo">
          🚧 GeoTag
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Report</Link>
          <Link to="/map">Map</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-left">
          <h1>
            Smart GeoTagging <br />
            For Safer Roads
          </h1>
          <p>
            Detect, report, and track potholes across city roads using
            geo-tagged reports and smart mapping technology.
            A modern smart-city solution for safer transportation.
          </p>
          <div className="hero-buttons">
            <Link to="/login">
              <button className="primary-btn">
                Report Pothole
              </button>
            </Link>
          </div>
        </div>

        <motion.div
          className="map-card"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
            alt="city"
          />
        </motion.div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.05 }}
        >
          <h2>1,250+</h2>
          <p>Potholes Reported</p>
        </motion.div>

        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.05 }}
        >
          <h2>875+</h2>
          <p>Issues Resolved</p>
        </motion.div>

        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.05 }}
        >
          <h2>98%</h2>
          <p>Tracking Accuracy</p>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <h2>
          Smart City Features
        </h2>
        <div className="features-grid">
          {cards.map((item, index) => (
            <motion.div
              className="feature-card"
              key={index}
              whileHover={{ y: -10 }}
            >
              <img src={item.img} alt={item.title} />
              <div className="feature-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}