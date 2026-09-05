# 🗄️ Helpdesk & Support Ticket System - Backend API

This is the backend API for the Helpdesk and Support Ticket Management System, built using **Node.js, Express.js, and MongoDB**. It implements role-based ticket workflows, real-time status tracking, and an audit trail.

---

## 🌐 Live API Link
- **Backend API (Render):** https://helpdesk-backend-8s6x.onrender.com

> ⚠️ **Note:** The backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle time may take **30–60 seconds** to respond while the server wakes up.

---

## 🛠️ Tech Stack & Security
- **Runtime & Framework:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM), hosted on MongoDB Atlas
- **Authentication:** JWT (jsonwebtoken), bcryptjs for password hashing
- **Security Features:**
  - Passwords are encrypted and never returned in API responses.
  - Strict server-side validation for status transitions (cannot be bypassed via Postman).
  - All ticket/comment access is protected by ownership checks.

---

## ⚙️ Local Setup & Installation

### Prerequisites
- Node.js installed
- A MongoDB Atlas account (or local MongoDB instance)

### 1. Clone & Navigate
```bash
git clone <your-backend-repository-url>
cd server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables (.env Configuration)
Create a `.env` file inside the root of your `server/` directory and add the following:
```env
PORT=5000
HELPDESK_DB=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
FRONTEND_URL=<your-frontend-url>
```

### 4. Run the Server
```bash
npm run dev      # Run in development mode (with nodemon)
npm start        # Run in production mode
```

---

## 🔑 Core Features & Workflow

- **Role-Based Access Control (RBAC):** Tight server-side checks for Requester, Agent, and Admin roles.
- **Ticket Management:** Automatic sequential generation of ticket numbers (e.g., `TKT-1001`).
- **Enforced Status Workflow:** `Open → Assigned → In Progress → Resolved → Closed`. Mandatory resolution notes required.
- **Threaded Comments:** Internal/external visibility toggle (staff-only notes invisible to requesters).
- **Audit Trail:** Logs every single status change (Who, When, From State → To State).

---

## 📁 Project Structure
```text
server/
├── controllers/         # Request handlers & business logic
├── models/              # MongoDB schemas (User, Ticket, Category, etc.)
├── routes/              # API Endpoints
├── middleware/          # Auth & Role validation middleware
├── db-configuration/    # Database connection setup
└── server.js            # Entry point
```

---
Built by Rana Haseeb Hussain