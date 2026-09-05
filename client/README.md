# 🎨 Helpdesk & Support Ticket System - Frontend Client

This is the responsive frontend user interface for the Helpdesk and Support Ticket Management System, built using **React (Vite) and React-Bootstrap**.

---

## 🔗 Live Application Link
- **Frontend UI (Vercel):** https://helpdesk-frontend-weld.vercel.app/

---

## 🛠️ Tech Stack
- **Framework:** React (Vite)
- **Routing:** React Router
- **Styling:** React-Bootstrap, React-Icons
- **API Client:** Axios (for connecting to the Backend API)

---

## ⚙️ Local Setup & Installation

### Prerequisites
- Node.js installed
- Running Backend API (Local or Live)

### 1. Clone & Navigate
```bash
git clone <your-frontend-repository-url>
cd client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables (.env Configuration)
Create a `.env` file inside the root of your `client/` directory and map it to your backend URL:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Start Development Server
```bash
npm run dev
```

---

## 📌 UI Features & Dashboards

- **Dynamic Dashboards:** Real-time aggregated stats (total, open, resolved, overdue tickets, and priority breakdown).
- **Responsive Layout:** Mobile-friendly design implementing ticket filtering and creation.
- **Role-Based Views:** 
  - **Requester View:** Create tickets, add comments, reopen closed tickets.
  - **Agent View:** View assigned tickets, update priorities, leave internal/external staff notes.
  - **Admin Panel:** Manage user roles, assign tickets to agents, create/delete categories.

---

## 🔑 Test Credentials
For testing different dashboard views, use the following roles:

| Role | Email | Password |
|------|-------|----------|
| Admin | haseeb9420@gmail.com | haseeb9420 |
| Requester | zohaibali01@gmail.com | zohaibali01 |
| Agent | harisali123@gmail.com | harisali123 |

---

## 📁 Project Structure
```text
client/
├── src/
│   ├── components/      # Reusable UI Elements (Navbar, Sidebar, Ticket Card)
│   ├── pages/           # Dashboard, Login, Ticket Details, Admin Panel
│   ├── App.jsx          # Routes definition
│   └── main.jsx         # App bootstrapping
```

---
Built by Rana Haseeb Hussain