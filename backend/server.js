

const multer = require("multer");
const path = require("path");

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const randomString = require("randomstring");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kavyashetty951366@gmail.com",
    pass: "yffv ywmr ojdc djxt"   // app password
  },
  tls: {
    rejectUnauthorized: false
  }
});

// path
// =============================
// FILE UPLOAD CONFIG (MULTER)
// =============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

// =============================
// DATABASE CONNECTION
// =============================
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "pothole"
});

// create password_resets table if not exists
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
  } catch (err) {
    console.error('Failed to create password_resets table:', err);
  }
})();

// =============================
// AUTH - REGISTER
// =============================
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone, role = "customer" } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [exists] = await pool.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );
    if (exists.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    await pool.query(
      "INSERT INTO users (name,email,password,role,phone) VALUES (?,?,?,?,?)",
      [name, email, hashed, role, phone || null]
    );

    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// =============================
// AUTH - LOGIN
// =============================
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );
    if (rows.length === 0) {
      return res.status(200).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(200).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: (user.role === "" || user.role === null) ? "customer" : user.role,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error(err);
    res.status(200).json({ message: "Server error" });
  }
});
const OTPCache = {};
function generateOTP() {
  return randomString.generate({ length: 4, charset: "numeric" });
}

function sendOTP(email, otp) {
  const mailOptions = {
    from: "apothole497@gmail.com",
    to: email,
    subject: "Forgot Password OTP Verification",
    text: `Your OTP for verification is ${otp}`
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
    }
  });
}

app.post("/api/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const [isUserExists] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (isUserExists.length > 0) {
      const OTP = generateOTP();
      OTPCache[email] = OTP;
      sendOTP(email, OTP);
      res.status(200).json({ message: "SENT" });
    } else {
      res.status(200).json({ message: "NOUSER" });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "ERROR" });
  }
});

app.post("/api/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const [isUserExists] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (isUserExists.length > 0) {
      if (!OTPCache.hasOwnProperty(email)) {
        return res.status(200).json({ message: "ENF" });
      }
      if (OTPCache[email] === otp.trim()) {
        delete OTPCache[email];
        return res.status(200).json({ message: "VERIFIED" });
      } else {
        return res.status(200).json({ message: "INVALID" });
      }
    } else {
      res.status(200).json({ message: "NOUSER" });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "ERROR" });
  }
});

app.put("/api/change-password", async (req, res) => {
  try {
    const { email, new_password } = req.body;
    const [isUserExists] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (isUserExists.length > 0) {
      const matching = await bcrypt.compare(new_password, isUserExists[0].password);
      if (!matching) {
        const hashed = await bcrypt.hash(new_password, 10);
        await pool.query(
          "UPDATE users SET password = ? WHERE email = ?",
          [hashed, email]
        );
        res.status(200).json({ message: "SUCCESS" });
        const mailOptions = {
          from: "apothole497@gmail.com",
          to: email,
          subject: "Password updated successfully",
          html: `
            <h2>🎉Congratulations ${isUserExists[0].name},</h2>
            <h3>Your new password is updated successfully!</h3>
        `
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
          }
        });
      } else {
        res.status(200).json({ message: "SAME" });
      }

    } else {
      res.status(200).json({ message: "NOUSER" });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "ERROR" });
  }
});

//===========================
// FEEDBACK
//===========================
app.post("/api/auth/feedback", async (req, res) => {
  try {
    const { name, email, phone, feedback } = req.body;

    if (!name || !email || !phone || !feedback) {
      return res.status(400).json({ message: "Required fields missing" });
    }


    const [exists] = await pool.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );
    if (exists.length > 0) {
      await pool.query(
        "INSERT INTO feedback (name,email,phone, feedback, is_registered) VALUES (?,?,?,?,?)",
        [name, email, phone, feedback, true]
      );

      return res.json({ message: "message sent successfully" });
    }
    else {
      await pool.query(
        "INSERT INTO feedback (name,email,phone, feedback, is_registered) VALUES (?,?,?,?,?)",
        [name, email, phone, feedback, false]
      );

      return res.json({ message: "send message successfully" });
    }
  }
  catch (err) {
    console.error("FEEDBACK:", err);
    res.json({ message: "Server error" });
  }
});

app.get("/api/auth/feedbacks", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM feedback ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("FEEDBACKS:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// =============================
// ADD SHIPMENT (ADMIN / USER)
// =============================
app.post("/api/shipments/add", async (req, res) => {
  try {
    const d = req.body;

    const sql = `
      INSERT INTO shipments (
        shipment_code, shipment_type,
        sender_name, sender_phone, sender_email, sender_address,
        receiver_name, receiver_phone, receiver_email, receiver_address,
        cargo_type, cargo_weight, cargo_volume, quantity, packaging_type,
        origin, destination, mode_of_transport,
        current_status, expected_delivery,
        shipment_cost, payment_status, payment_method
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    const values = [
      d.shipment_code,
      d.shipment_type,
      d.sender_name,
      d.sender_phone,
      d.sender_email,
      d.sender_address,
      d.receiver_name,
      d.receiver_phone,
      d.receiver_email,
      d.receiver_address,
      d.cargo_type,
      d.cargo_weight,
      d.cargo_volume || null,
      d.quantity || 1,
      d.packaging_type || null,
      d.origin,
      d.destination,
      d.mode_of_transport,
      "Booked",
      d.expected_delivery || null,
      d.shipment_cost,
      "Unpaid",
      d.payment_method || null
    ];

    await pool.query(sql, values);

    res.json({ success: true, message: "Shipment added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add shipment" });
  }
});



// =============================
// GET ALL SHIPMENTS (ADMIN)
// =============================
app.get("/api/shipments", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM shipments ORDER BY shipment_id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch shipments" });
  }
});

// =============================
// DELETE SHIPMENT (ADMIN)
// =============================
app.delete("/api/shipments/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM shipments WHERE shipment_id=?",
      [req.params.id]
    );
    res.json({ message: "Shipment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

// =============================
// UPDATE SHIPMENT STATUS (ADMIN)
// =============================
app.put("/api/admin/shipments/:id/status", async (req, res) => {
  try {
    const { status, tracking_location } = req.body;

    await pool.query(
      `UPDATE shipments
       SET current_status=?, tracking_location=?, updated_at=NOW()
       WHERE shipment_id=?`,
      [status, tracking_location || null, req.params.id]
    );

    res.json({ message: "Shipment status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

// // =============================
// // TRACK SHIPMENT (PUBLIC)
// // =============================
// app.get("/api/shipments/track/:code", async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT shipment_code,current_status,tracking_location,origin,destination,updated_at
//        FROM shipments WHERE shipment_code=?`,
//       [req.params.code]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Shipment not found" });
//     }

//     res.json(rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Tracking failed" });
//   }
// });

app.get("/api/shipments/track/:code", async (req, res) => {
  const shipmentCode = req.params.code;

  try {
    const [rows] = await pool.query(
      `SELECT shipment_code, current_status, tracking_location, origin, destination, updated_at AS last_updated
       FROM shipments 
       WHERE shipment_code = ?`,
      [shipmentCode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: `Shipment ${shipmentCode} not found` });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Tracking error for code:", shipmentCode, err);
    res.status(500).json({ message: "Tracking failed" });
  }
});


// =============================
// USER SHIPMENTS (PAYMENT PAGE)
// =============================
app.get("/api/user/shipments/:email", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT shipment_id, shipment_code, receiver_name, shipment_cost, payment_status
       FROM shipments WHERE sender_email=?`,
      [req.params.email]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user shipments" });
  }
});

// =============================
// UPI PAYMENT
// =============================
app.post("/api/payments/upi", async (req, res) => {
  try {
    const { shipment_id, upi_txn_id } = req.body;

    await pool.query(
      `UPDATE shipments
       SET payment_status='Paid',
           payment_method='UPI',
           upi_txn_id=?
       WHERE shipment_id=?`,
      [upi_txn_id, shipment_id]
    );

    res.json({ success: true, message: "Payment successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
});

// =============================
// FLEET MANAGEMENT - TRUCKS
// =============================

// GET ALL TRUCKS
app.get("/api/trucks", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM trucks ORDER BY truck_id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch trucks" });
  }
});

// ADD TRUCK
app.post("/api/trucks/add", async (req, res) => {
  try {
    const {
      vehicle_number,
      vehicle_type,
      capacity,
      driver_name,
      status
    } = req.body;

    await pool.query(
      `INSERT INTO trucks 
      (vehicle_number, truck_type, capacity, driver_name, status)
      VALUES (?, ?, ?, ?, ?)`,
      [vehicle_number, vehicle_type, capacity, driver_name || null, status]
    );

    res.json({ message: "Truck added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add truck" });
  }
});

// DELETE TRUCK
app.delete("/api/trucks/delete/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM trucks WHERE truck_id=?",
      [req.params.id]
    );
    res.json({ message: "Truck deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete truck" });
  }
});

// =============================
// PRODUCTS (MENU ITEMS) - minimal CRUD for frontend
// =============================
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id=?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to fetch product:", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const d = req.body;
    const image = req.file ? req.file.filename : null;
    const sql = `INSERT INTO products (name, description, price, image) VALUES (?,?,?,?)`;
    const [result] = await pool.query(sql, [d.name, d.description, d.price || 0, image]);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Failed to add product:", err);
    res.status(500).json({ message: "Failed to add product" });
  }
});

app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  try {
    const d = req.body;
    const image = req.file ? req.file.filename : d.existingImage || null;
    await pool.query(
      "UPDATE products SET name=?, description=?, price=?, image=? WHERE id=?",
      [d.name, d.description, d.price || 0, image, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to update product:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete product:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// =============================
// GET ALL CLIENTS (ADMIN)
// =============================
app.get("/api/admin/clients", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE role != 'admin'`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch clients" });
  }
});


// =============================
// SUBMIT COMPLAINT
// =============================
app.post("/complaints", upload.single("picture"), async (req, res) => {
  try {
    const { complaint_date, complaint_desc, location, userid } = req.body;
    const picture = req.file ? req.file.filename : null;
    const [result] = await pool.query(
      `INSERT INTO complaints 
       (complaint_date, complaint_desc, location, picture, userid, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [complaint_date, complaint_desc, location, picture, userid, "Pending"]
    );

    // try to fetch user email (if userid provided)
    let userEmail = null;
    let userName = 'User';
    try {
      if (userid) {
        const [users] = await pool.query('SELECT email, name FROM users WHERE id=?', [userid]);
        if (users && users.length > 0) {
          userEmail = users[0].email;
          userName = users[0].name || userName;
        }
      }
    } catch (e) {
      console.error('Failed to fetch user for complaint email:', e);
    }

    // send acknowledgement email if SMTP configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
          secure: !!process.env.SMTP_SECURE,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });

        const toAddress = userEmail || process.env.ADMIN_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER;

        const mailHtml = `
          <p>Dear ${userName},</p>
          <p>We have received your complaint. Details below:</p>
          <ul>
            <li><strong>Date:</strong> ${complaint_date || new Date().toISOString()}</li>
            <li><strong>Location:</strong> ${location || 'N/A'}</li>
            <li><strong>Description:</strong> ${complaint_desc || 'N/A'}</li>
            <li><strong>Complaint ID:</strong> ${result.insertId || 'N/A'}</li>
          </ul>
          <p>Our team will review and update the status shortly.</p>
          <p>Regards,<br/>Support Team</p>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: toAddress,
          subject: 'Complaint received',
          html: mailHtml
        });
      } catch (mailErr) {
        console.error('Failed to send complaint acknowledgement email:', mailErr);
      }
    } else {
      console.log('SMTP not configured - skipping complaint email');
    }

    res.json({ success: true, message: "Complaint submitted successfully", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Complaint submission failed" });
  }
});

// =============================
// GET ALL COMPLAINTS (ADMIN)
// =============================
app.get("/api/admin/complaints", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM complaints`
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

// =============================
// UPDATE COMPLAINT STATUS (ADMIN)
// =============================
// UPDATE COMPLAINT STATUS (ADMIN)
app.put("/api/complaints/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    await pool.query(
      "UPDATE complaints SET status=? WHERE complaintid=?",
      [status, req.params.id]
    );

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

// GET ALL COMPLAINTS (ADMIN)
app.get("/api/complaints", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM complaints ORDER BY complaintid DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

app.get("/api/analytics/complaints/summary", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(status='Pending') AS pending,
        SUM(status='In Progress') AS inprogress,
        SUM(status='Resolved') AS resolved
      FROM complaints
    `);

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Analytics failed" });
  }
});

app.get("/api/analytics/complaints/daily", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DATE(complaint_date) as date, COUNT(*) as count
      FROM complaints
      GROUP BY DATE(complaint_date)
      ORDER BY date
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Daily analytics failed" });
  }
});


app.get("/api/analytics/complaints/locations", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT location, COUNT(*) as total
      FROM complaints
      GROUP BY location
      ORDER BY total DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Location analytics failed" });
  }
});


// =============================
// AUTH - contact
// =============================
app.post("/api/auth/contact", async (req, res) => {
  try {
    let { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let uid;

    if (uid) {
      const [users] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
      if (users.length > 0) {
        uid = users[0].id;
      } else {
        uid = null;
      }
    }

    await pool.query(
      "INSERT INTO user_messages (user_id, name, email, message, sender) VALUES (?, ?, ?, ?, ?)",
      [uid, name, email, message, "user"]
    );

    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// =====================================================
// ADMIN SIDE
// =====================================================

// 1️⃣ Get all conversations (group by email)
app.get("/api/admin/conversations", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT email, MAX(created_at) as last_message
      FROM user_messages
      GROUP BY email
      ORDER BY last_message DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 2️⃣ Get messages by email
app.get("/api/admin/messages/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const [messages] = await pool.query(
      "SELECT * FROM user_messages WHERE email = ? ORDER BY created_at ASC",
      [email]
    );

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 3️⃣ Admin reply
app.post("/api/admin/reply", async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await pool.query(
      "INSERT INTO user_messages (name,email,message,sender) VALUES (?,?,?,?)",
      ["Admin", email, message, "admin"]
    );

    res.json({ message: "Reply sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// =============================
app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
