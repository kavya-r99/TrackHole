import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FiMapPin,
  FiCalendar,
  FiAlertCircle,
  FiExternalLink,
  FiActivity,
  FiList,
  FiArrowLeft
} from "react-icons/fi";

// Custom helper to recenter Leaflet map when selection changes
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15, { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function PotholeMapping() {
  const [complaints, setComplaints] = useState([]);
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]); // Bengaluru default center
  const [selectedId, setSelectedId] = useState(null);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints");
      const all = res.data || [];
      
      // Normalize status and extract coordinates
      const mapped = all.map(c => {
        const coords = parseCoords(c.location);
        return {
          ...c,
          id: c.complaintid || c.id,
          coords: coords,
          normalizedStatus: getNormalizedStatus(c.status)
        };
      });

      setComplaints(mapped);
      
      // If there are valid coordinates, center map on first parsed item
      const withCoords = mapped.filter(c => c.coords);
      if (withCoords.length > 0) {
        setMapCenter(withCoords[0].coords);
        setSelectedId(withCoords[0].id);
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Parse Latitude and Longitude from Google Maps URLs (e.g. @12.9716,77.5946)
  const parseCoords = (locString) => {
    if (!locString) return null;
    
    // Format: @latitude,longitude
    let match = locString.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return [parseFloat(match[1]), parseFloat(match[2])];
    }
    
    // Format: query param or text coordinates (e.g. 13.033,77.524)
    match = locString.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
    if (match) {
      return [parseFloat(match[1]), parseFloat(match[2])];
    }
    
    return null;
  };

  const getNormalizedStatus = (status) => {
    const s = String(status || "").trim().toLowerCase();
    if (s === "reslove" || s === "resolved") return "Resolved";
    if (s === "in progress" || s === "inwork" || s === "in work") return "In Progress";
    return "Pending";
  };

  // Custom marker pin generator using SVGs for premium visuals
  const getMarkerIcon = (status) => {
    const norm = getNormalizedStatus(status);
    let color = "#ef4444"; // Red for pending
    if (norm === "Resolved") {
      color = "#10b981"; // Green
    } else if (norm === "In Progress") {
      color = "#f59e0b"; // Amber
    }

    const svgHtml = `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="${color}" stroke="#ffffff" stroke-width="1.5" filter="drop-shadow(0px 3px 5px rgba(0,0,0,0.4))"/>
    </svg>`;

    return L.divIcon({
      html: svgHtml,
      className: "custom-pothole-icon",
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -34]
    });
  };

  const handleRowClick = (c) => {
    setSelectedId(c.id);
    if (c.coords) {
      setMapCenter(c.coords);
    }
  };

  const role = String(localStorage.getItem("role") || "").trim().toLowerCase();
  const backLink = role === "admin" ? "/admin" : "/user";

  return (
    <div className="page pothole-mapping-page">
      <div className="admin-status-header">
        <Link to={backLink} className="back-to-admin-link">
          <FiArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h2>📊 Geo Tagging Pothole Map</h2>
        <p>Interactive location analysis of damaged roads and restoration tagging.</p>
      </div>

      <div className="mapping-dashboard-layout">
        
        {/* LEFT PANE: MAP AREA */}
        <div className="map-view-container">
          <MapContainer
            center={mapCenter}
            zoom={13}
            className="leaflet-map-wrapper"
            style={{ height: "100%", width: "100%", borderRadius: "16px" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {complaints.filter(c => c.coords).map((c) => (
              <Marker
                key={c.id}
                position={c.coords}
                icon={getMarkerIcon(c.status)}
              >
                <Popup className="premium-leaflet-popup">
                  <div className="popup-content-box">
                    <div className="popup-header">
                      <strong>Complaint #{c.id}</strong>
                      <span className={`status-badge-pill small ${c.normalizedStatus.toLowerCase().replace(/\s+/g, "")}`}>
                        {c.normalizedStatus}
                      </span>
                    </div>
                    <p className="popup-desc">{c.complaint_desc}</p>
                    <div className="popup-meta">
                      <FiCalendar size={12} />
                      <span>{new Date(c.complaint_date).toLocaleDateString()}</span>
                    </div>
                    
                    {c.picture && (
                      <div className="popup-thumb-wrapper">
                        <img
                          src={`http://localhost:5000/uploads/${c.picture}`}
                          alt="preview"
                          className="popup-thumb-img"
                        />
                      </div>
                    )}
                    
                    {c.location && (
                      <a
                        href={c.location}
                        target="_blank"
                        rel="noreferrer"
                        className="popup-link"
                      >
                        <FiExternalLink size={12} /> View on Google Maps
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

            <RecenterMap center={mapCenter} />
          </MapContainer>
        </div>

        {/* RIGHT PANE: LIST/TABLE PANEL */}
        <div className="mapping-list-container">
          <h3><FiList size={18} style={{ marginRight: 8 }} /> Potholes List</h3>
          
          <div className="scrollable-mapping-list">
            {complaints.length === 0 ? (
              <p className="empty-text">No complaints reported.</p>
            ) : (
              complaints.map((c) => {
                const isActive = selectedId === c.id;
                return (
                  <div
                    key={c.id}
                    className={`mapping-list-card ${isActive ? "active" : ""} ${c.coords ? "has-coords" : "no-coords"}`}
                    onClick={() => handleRowClick(c)}
                  >
                    <div className="card-top">
                      <strong className="card-id">#{c.id}</strong>
                      <span className={`status-badge-pill ${c.normalizedStatus.toLowerCase().replace(/\s+/g, "")}`}>
                        {c.normalizedStatus}
                      </span>
                    </div>
                    <p className="card-desc" title={c.complaint_desc}>
                      {c.complaint_desc.substring(0, 50)}
                      {c.complaint_desc.length > 50 && "..."}
                    </p>
                    <div className="card-bottom">
                      <span className="card-date">
                        <FiCalendar size={12} />
                        {new Date(c.complaint_date).toLocaleDateString()}
                      </span>
                      {c.coords ? (
                        <span className="geo-tag-pill success">📍 Geotagged</span>
                      ) : (
                        <span className="geo-tag-pill warning">⚠️ No Geotag</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
