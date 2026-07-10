// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip,
//   PieChart, Pie, Cell
// } from "recharts";
// import { useNavigate } from "react-router-dom";
// import "./Analytics.css";

// export default function AnalyticsDashboard() {
//   const navigate = useNavigate();
//   const [summary, setSummary] = useState({});
//   const [daily, setDaily] = useState([]);
//   const [locations, setLocations] = useState([]);

//   useEffect(() => {
//     loadAnalytics();
//   }, []);

//   const loadAnalytics = async () => {
//     const s = await axios.get("http://localhost:5000/api/analytics/complaints/summary");
//     const d = await axios.get("http://localhost:5000/api/analytics/complaints/daily");
//     const l = await axios.get("http://localhost:5000/api/analytics/complaints/locations");

//     setSummary(s.data);
//     setDaily(d.data);
//     setLocations(l.data);
//   };

//   const pieData = [
//     { name: "Pending", value: summary.pending },
//     { name: "In Progress", value: summary.inprogress },
//     { name: "Resolved", value: summary.resolved }
//   ];

//   const COLORS = ["#f72e13", "#f5f115", "#28a745"];

//   return (
//     <div className="analytics-container">
//       <div className="d-f">
//         <button onClick={() => navigate("/admin")}>Dashboard</button>
//         <h2>📊 Complaint Analytics Dashboard</h2>
//       </div>


//       {/* ===== SUMMARY CARDS ===== */}
//       <div className="stats-grid">
//         <div className="stat-card">Total<br /><b>{summary.total}</b></div>
//         <div className="stat-card pending">Pending<br /><b>{summary.pending}</b></div>
//         <div className="stat-card bg-primary">In Progress<br /><b>{summary.inprogress}</b></div>
//         <div className="stat-card resolved">Resolved<br /><b>{summary.resolved}</b></div>
//       </div>

//       {/* ===== PIE CHART ===== */}
//       <div className="chart-box">
//         <h3>Status Distribution</h3>
//         <PieChart width={350} height={300}>
//           <Pie data={pieData} dataKey="value" outerRadius={100}>
//             {pieData.map((_, i) => (
//               <Cell key={i} fill={COLORS[i]} />
//             ))}
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </div>

//       {/* ===== DAILY BAR CHART ===== */}
//       <div className="chart-box">
//         <h3>Complaints Per Day</h3>
//         <BarChart width={600} height={300} data={daily}>
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip />
//           <Bar dataKey="count" />
//         </BarChart>
//       </div>

//       {/* ===== TOP LOCATIONS ===== */}
//       <div className="chart-box">
//         <h3>Top Complaint Locations</h3>
//         <ul>
//           {locations.map(l => (
//             <li key={l.location}>
//               📍 {l.location} – {l.total}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );

// }
/*//////////////////////*/
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";
import "./Analytics.css";

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState({});
  const [daily, setDaily] = useState([]);
  const [locations, setLocations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const s = await axios.get("http://localhost:5000/api/analytics/complaints/summary");
      const d = await axios.get("http://localhost:5000/api/analytics/complaints/daily");
      const l = await axios.get("http://localhost:5000/api/analytics/complaints/locations");

      setSummary(s.data);
      setDaily(d.data);
      setLocations(l.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  document.title = "Admin | Analytics";

  // const pieData = [
  //   { name: "Pending", value: summary.pending || 0 },
  //   { name: "In Progress", value: summary.inprogress || 0 },
  //   { name: "Resolved", value: summary.resolved || 0 }
  // ];

  // const COLORS = ["#ff4d4f", "#fadb14", "#52c41a"];

  return (
    <div className="admin-page analytics-page">
      <h2>📊 Geo Tagging Pothole on Roads Within City</h2>
      <h4 className="gradient">City Pothole Analytics</h4>
      {/* ===== KPI CARDS ===== */}
      <div className="kpi-grid">
        <div className="kpi-card text-light">
          <span>Total Complaints</span>
          <h2>{summary.total || 0}</h2>
        </div>

        <div className="kpi-card danger">
          <span>Pending</span>
          <h2>{summary.pending || 0}</h2>
        </div>

        <div className="kpi-card warning">
          <span>In Progress</span>
          <h2>{summary.inprogress || 0}</h2>
        </div>

        <div className="kpi-card success">
          <span>Resolved</span>
          <h2>{summary.resolved || 0}</h2>
        </div>
      </div>

      <h4>Complaints Trend</h4>
      <div className="chart-card">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={daily}>
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== LOCATIONS TABLE ===== */}
      <h4>Top Problem Areas</h4>
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Total Complaints</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((l, i) => (
              <tr key={i}>
                <td className="nowrap" title={l.location}>
                  <p
                    title={l.location}
                    className="pointer">{String(l.location).substring(0, 70)}{(String(l.location).length > 70) && "..."}</p>
                </td>
                <td>{l.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="admin-main-content">
        <div className="analytics-container bg-dark p-4"> */}



      {/* ===== CHARTS ===== */}
      {/* <div className="chart-section"> */}

      {/* PIE CHART */}
      {/* <div className="chart-card text-light">
              <h3>Status Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={100}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div> */}

      {/* BAR CHART */}


      {/* </div> */}



      {/* </div>
      </div> */}
    </div>
  );
}
