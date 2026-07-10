import React from "react";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiCompass,
  FiCamera,
  FiTarget,
  FiCheckCircle
} from "react-icons/fi";

export default function About() {
  document.title = "About - GeoTagging & Pothole Detection";

  // Framer Motion Animation Settings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const STATS = [
    { value: "1,250+", label: "Potholes Reported", sub: "Verified Reports" },
    { value: "< 24 Hrs", label: "Response Rate", sub: "Dispatch Time" },
    { value: "98.4%", label: "System Accuracy", sub: "Verification Rate" }
  ];

  const PROJECT_GOALS = [
    {
      icon: <FiMapPin className="card-icon-svg" />,
      tag: "Smart Civil Solution",
      title: "Community Reporting",
      desc: "Enables citizens to instantly report potholes with geo-tagged images and locations, helping cities take faster repair actions."
    },
    {
      icon: <FiCompass className="card-icon-svg" />,
      tag: "Road Infrastructure",
      title: "Socio-Economic Safety",
      desc: "Prevents vehicle damage, reduces city repair costs, and helps avoid severe accidents through rapid geolocation mapping."
    }
  ];

  const TIMELINE_STEPS = [
    {
      step: "01",
      title: "Snap & Report",
      icon: <FiCamera size={20} />,
      desc: "Citizen snaps a photo of a road pothole."
    },
    {
      step: "02",
      title: "Sync & Dispatch",
      icon: <FiTarget size={20} />,
      desc: "Admins verify coordinates and dispatch repair crews."
    },
    {
      step: "03",
      title: "Fix & Resolve",
      icon: <FiCheckCircle size={20} />,
      desc: "Road crew repairs the hazard and closes the ticket."
    }
  ];

  return (
    <motion.div
      className="page about-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* HEADER SECTION */}
      <motion.div className="about-header-section" variants={itemVariants}>
        <h1 className="about-title">Smart City Geo-Tagging</h1>
        <h4 className="gradient">Pothole Detection & Geolocation</h4>
        <p className="about-subtitle">
          An advanced civil telemetry dashboard designed to connect citizens
          and municipal engineering crews for safer road networks.
        </p>
        <div className="header-divider"></div>
      </motion.div>

      {/* TWO PILLARS SECTION */}
      <motion.div className="about-grid" variants={itemVariants}>
        <div className="about-cards-list">
          {PROJECT_GOALS.map((card, i) => (
            <motion.div
              className="about-info-card"
              key={i}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="about-card-icon-container">
                {card.icon}
              </div>
              <div className="about-card-content">
                <span className="about-card-tag">{card.tag}</span>
                <h3 className="about-card-title">{card.title}</h3>
                <p className="about-card-desc">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* IMAGE & STATS ROW */}
        <div className="about-media-panel">
          <div className="image-frame-container">
            <div className="image-frame">
              <img
                src="img 3.jpg"
                alt="About Pothole on Roads"
                className="main-showcase-img"
              />
            </div>
          </div>

          {/* TELEMETRY STATS ROW */}
          <div className="about-stats-row">
            {STATS.map((stat, i) => (
              <motion.div
                className="about-stat-box"
                key={i}
                whileHover={{ scale: 1.05 }}
              >
                <span className="stat-value">{stat.value}</span>
                <p className="stat-label">{stat.label}</p>
                <span className="stat-sub">{stat.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* SECTOR DIVIDER */}
      <motion.div className="section-divider-row" variants={itemVariants}>
        <div className="line-accent"></div>
        <span className="divider-tag">SYSTEM WORKFLOW</span>
        <div className="line-accent"></div>
      </motion.div>

      {/* CIVIL TIMELINE SECTION */}
      <motion.div className="about-timeline-section" variants={itemVariants}>
        <h2 className="timeline-section-title">How It Works</h2>
        <p className="timeline-section-desc">
          Four automated and citizen-guided phases to detect, prioritize, repair, and verify road anomalies.
        </p>

        <div className="timeline-flow-grid">
          {TIMELINE_STEPS.map((step, i) => (
            <motion.div
              className="timeline-card"
              key={i}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="timeline-card-header">
                <span className="step-num">{step.step}</span>
                <div className="step-icon-bg">
                  {step.icon}
                </div>
              </div>
              <h3 className="timeline-card-title">{step.title}</h3>
              <p className="timeline-card-desc">{step.desc}</p>
              {i < TIMELINE_STEPS.length - 1 && (
                <div className="timeline-step-arrow">➔</div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}