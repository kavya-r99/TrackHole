# Food Delivery App (Scaffold)
Stack: Node (Express) + MySQL (XAMPP) + React

This scaffold gives you:
- Backend: Express server with auth (JWT), user and product APIs, file-upload-ready endpoints.
- Frontend: React app skeleton with routes (Home, About, Contact, Register, Login, Forgot Password, Admin/Guest/Staff dashboards).
- Database: `db.sql` with schema for users, restaurants, products, orders.
- Instructions to run locally using XAMPP (MySQL), Node and npm/yarn.

## Quick start

### 1) MySQL (XAMPP)
1. Start XAMPP and MySQL.
2. Open phpMyAdmin (http://localhost/phpmyadmin).
3. Create a database named `food_delivery`.
4. Import `db.sql` found in this scaffold.

### 2) Backend
```
cd backend
cp .env.example .env
# edit .env with your MySQL credentials (DB_HOST, DB_USER, DB_PASS, DB_NAME)
npm install
npm run dev
```
Server runs at `http://localhost:5000` by default.

### 3) Frontend
```
cd frontend
npm install
npm start
```
Frontend runs at `http://localhost:3000`.

## Notes
- This scaffold is minimal and intended to jumpstart development. Replace placeholders, add validations, secure secrets, and harden before production.
- See inline comments in backend and frontend files for details.
