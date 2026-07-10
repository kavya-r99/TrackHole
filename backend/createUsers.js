const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
  const pool = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Pothole'
  });

  async function createUser(name, email, password, role, phone) {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?,?,?,?,?)',
      [name, email, hashed, role, phone]
    );
    console.log(`${role} user created: ${email}`);
  }

  await createUser('Admin', 'admin@food.com', 'admin123', 'admin', '9999999999');
  await createUser('Staff', 'staff@food.com', 'staff123', 'staff', '8888888888');

  console.log('✅ Admin and staff created successfully.');
  process.exit();
})();
