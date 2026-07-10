// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import "../AdminDashboard.css";

// export default function Clients() {
//   const [clients, setClients] = useState([]);

//   // Fetch clients
//   const fetchClients = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/admin/clients"
//       );
//       setClients(res.data);
//     } catch (err) {
//       console.error("Error fetching clients", err);
//     }
//   };

//   useEffect(() => {
//     fetchClients();
//   }, []);

//   return (
//     <div className="admin-container">

//       {/* ================= SIDEBAR ================= */}
//       <div className="admin-sidebar">
//         <h2 className="sidebar-title">🚚 Logistics Admin</h2>

//         <ul className="admin-menu">
//           <li><Link to="/admin">🏠 Dashboard</Link></li>
//           <li><Link to="/admin/shipments">📦 Shipments</Link></li>
//           <li><Link to="/admin/trucks">🚛 Fleet</Link></li>
//           <li><Link to="/admin/drivers">🧑‍✈️ Drivers</Link></li>
//           <li><Link to="/admin/clients" className="active">👥 Clients</Link></li>
//           <li><Link to="/admin/payments">💳 Payments</Link></li>
//         </ul>
//       </div>

//       {/* ================= MAIN CONTENT ================= */}
//       <div className="admin-content">
//         <h2 className="text-center mt-4">👥 Registered Clients</h2>

//         <div className="table-responsive mt-4">
//           <table className="table table-bordered table-hover shadow">
//             <thead className="table-dark">
//               <tr>
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Phone</th>
//                 <th>Registered On</th>
//               </tr>
//             </thead>

//             <tbody>
//               {clients.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center">
//                     No clients found
//                   </td>
//                 </tr>
//               ) : (
//                 clients.map((client) => (
//                   <tr key={client.id}>
//                     <td>{client.id}</td>
//                     <td>{client.name}</td>
//                     <td>{client.email}</td>
//                     <td>{client.phone || "-"}</td>
//                     <td>
//                       {new Date(client.created_at).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

export default function Clients() {
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    try {
      await axios.get("http://localhost:5000/api/admin/clients")
      .then((res) => setClients(res.data))
      .catch(err => console.error("Error fetching clients", err));
    } catch (err) {
      console.error("Error fetching clients", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  document.title = "Admin | Clients";

  return (
    <div className="admin-page clients-page">
      <h2>📊 Geo Tagging Pothole on Roads Within City</h2>
      <h4 className="gradient">Registered Citizens</h4>
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email ID</th>
              <th>Phone number</th>
              <th>Registered on</th>
            </tr>
          </thead>
          <tbody>
            {
              clients.length === 0
                ? (
                  <tr>
                    <td colSpan={5}>No citizen found</td>
                  </tr>
                ) : (
                  clients.map((c) => {
                    const id = c.id;
                    const name = c.name;
                    const email = c.email;
                    const phone = c.phone;
                    const createdat = `${new Date(c.created_at).toLocaleDateString()} - ${new Date(c.created_at).toLocaleTimeString()}`;
                    return <tr key={c.id}>
                      <td>{id}</td>
                      <td>{name}</td>
                      <td>{email}</td>
                      <td>{phone}</td>
                      <td>{createdat}</td>
                    </tr>
                  })
                )
            }
          </tbody>
        </table>
      </div>
      {/* <div className="admin-main-content">
        <div style={styles.container}>
          <div style={styles.tableBox}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registered On</th>
                </tr>
              </thead>

              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={styles.noData}>
                      No citizen found
                    </td>
                  </tr>
                ) : (
                  clients.map((client, index) => {
                    const id = client.id || client.user_id || index;
                    const name = client.name || client.username || "-";
                    const email = client.email || "-";
                    const phone = client.phone || "-";
                    const createdAt =
                      client.created_at || client.createdAt || "-";

                    return (
                      <tr key={id} style={styles.row}>
                        <td>{id}</td>
                        <td>{name}</td>
                        <td>{email}</td>
                        <td>{phone}</td>
                        <td>
                          {createdAt !== "-"
                            ? new Date(createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div> */}
    </div>
  );
}

/* ===== STYLES OBJECT ===== */
const styles = {
  container: {
    minHeight: "100vh",
    padding: "30px",
    backgroundColor: "#032c55",
    fontFamily: "Arial, sans-serif",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eb7506ef",
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "30px",
  },
  mainTitle: {
    margin: 0,
  },
  subTitle: {
    margin: 0,
    fontWeight: "normal",
    opacity: 0.9,
  },
  button: {
    backgroundColor: "#4e84cf",
    color: "white",
    padding: "8px 15px",
    textDecoration: "none",
    borderRadius: "6px",
    transition: "0.3s",
  },
  activeButton: {
    backgroundColor: "#971d1d",
    fontWeight: "bold",
  },
  leftSidebar: {
    position: "fixed",
    left: 20,
    top: 120,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    zIndex: 200,
  },
  sideButton: {
    backgroundColor: "#4e84cf",
    color: "white",
    padding: "10px 14px",
    textDecoration: "none",
    borderRadius: "8px",
    transition: "0.2s",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },
  activeSideButton: {
    backgroundColor: "#971d1d",
    fontWeight: "700",
  },
  tableBox: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#0f172a",
    color: "white",
  },
  row: {
    textAlign: "center",
    borderBottom: "1px solid #ddd",
    height: "45px",
  },
  noData: {
    textAlign: "center",
    padding: "20px",
  },
};
