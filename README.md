# Helpdesk & Support Ticket System

A full-stack MERN Helpdesk & Support Ticket System where users can report support issues, agents can manage and resolve them, and administrators can manage users, categories, and the overall workflow.

## Live Application

- Frontend: [https://helpdesk-frontend-weld.vercel.app/](https://helpdesk-frontend-weld.vercel.app/)
- Backend API: [https://helpdesk-backend-8s6x.onrender.com](https://helpdesk-backend-8s6x.onrender.com)

> The backend is hosted on Render's free tier. If it has been inactive, the first request may take 30–60 seconds while the service wakes up.

## Features

- User registration and login with hashed passwords
- JWT-based authentication
- Role-based authorization for Requesters, Agents, and Admins
- Ticket creation, assignment, status updates, resolution, closure, and reopening
- Strict ticket workflow:
  `Open → Assigned → In Progress → Resolved → Closed`
- Resolution note required before a ticket can be marked as resolved
- Ownership checks to prevent unauthorized ticket access
- Internal comments that are visible only to Agents and Admins
- Ticket status history/audit trail
- Dashboard statistics: total, open, resolved, overdue, and priority breakdown
- Category management
- Admin user-role management
- Backend filtering and pagination for ticket lists
- Centralized backend error handling
- AuthContext for shared frontend authentication state
- Automatic session-expiry handling for expired JWT tokens

## User Roles

| Role | Main permissions |
|---|---|
| Requester | Create tickets, view own tickets, comment, and reopen eligible closed tickets |
| Agent | View assigned tickets, add internal/external comments, update valid ticket statuses, and add resolution notes |
| Admin | View and manage all tickets, users, roles, categories, assignments, and dashboard data |

## Technology Stack

### Frontend

- React with Vite
- React Router
- React-Bootstrap
- Axios
- Framer Motion
- React Icons

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

## Project Structure

```text
helpdesk-support-ticket-system/
├── client/                    # React/Vite frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── theme.js
│   └── package.json
│
├── server/                    # Node.js/Express backend
│   ├── controllers/
│   ├── db-configuration/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Local Installation

### Prerequisites

- Node.js installed
- npm installed
- MongoDB Atlas account, or a local MongoDB database

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/helpdesk-support-ticket-system.git
cd helpdesk-support-ticket-system
```

### 2. Configure and run the backend

```bash
cd server
npm install
```

Create a `server/.env` file:

```env
PORT=5000
HELPDESK_DB=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

For production mode:

```bash
npm start
```

### 3. Configure and run the frontend

Open a second terminal:

```bash
cd client
npm install
```

Create a `client/.env` file:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The Vite development server will display the local frontend URL, usually `http://localhost:5173`.

## Security and Business Rules

- Passwords are hashed using bcryptjs before being saved.
- JWT tokens protect authenticated API routes.
- The backend verifies both user role and ticket ownership before allowing actions.
- Requesters cannot see internal staff comments.
- Ticket status transitions are validated on the server and cannot be skipped through a direct API request.
- Only a Requester or Admin can reopen a closed ticket.
- MongoDB indexes support common ticket lookups, such as by requester, assigned agent, status, and due date.

## Demo Accounts

> Create dedicated demo-only accounts before submitting a public repository. Do not publish personal email accounts or passwords.

| Role | Email | Password |
|---|---|---|
| Admin | `replace-with-demo-admin-email` | `replace-with-demo-admin-password` |
| Requester | `replace-with-demo-requester-email` | `replace-with-demo-requester-password` |
| Agent | `replace-with-demo-agent-email` | `replace-with-demo-agent-password` |

## Deployment

- Frontend is deployed on Vercel.
- Backend is deployed on Render.
- Database is hosted on MongoDB Atlas.

## Author

Rana Haseeb Hussain