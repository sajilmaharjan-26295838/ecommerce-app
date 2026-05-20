# BgMart — E-Commerce Shopping Cart

A full-stack single-page e-commerce application built with React, FastAPI, and MongoDB.

## Problem Statement
 BgMart solves the need for a simple, fast, and intuitive online shopping experience. Users can browse products, search in real-time, and manage their shopping cart. Admins can manage products and monitor all user activity and carts from a dedicated dashboard.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | FastAPI (Python) |
| Database | MongoDB (local) with Motor (async driver) |
| Authentication | JWT (python-jose) + bcrypt password hashing |

## Features
- User registration and login with JWT authentication
- Role-based access control (user vs admin)
- Live product search — filters in real-time as you type
- Full CRUD operations on products (admin only)
- Shopping cart — add, remove, and clear items
- Admin dashboard — view all users and their carts
- Single-page application — no page reloads

## How to Run

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (running locally on port 27017)

### Step 1 — Start MongoDB
Make sure MongoDB is running:
```bash
brew services start mongodb-community
```

### Step 2 — Start Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```
Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### Step 3 — Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

### Default Test Accounts
| Role | Email | Password |
|---|---|---|
| Admin | admin@shop.com | admin123 |
| User | sajil@shop.com | sajil123 |

## Folder Structure
```
ecommerce-app/
├── backend/
│   ├── routes/
│   │   ├── auth.py
│   │   ├── products.py
│   │   ├── cart.py
│   │   └── admin.py
│   ├── main.py
│   ├── database.py
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Products.jsx
│       │   ├── Cart.jsx
│       │   └── Admin.jsx
│       ├── components/
│       │   └── Navbar.jsx
│       ├── api/
│       │   └── index.js
│       └── App.jsx
├── database/
│   ├── users.json
│   ├── products.json
│   └── carts.json
└── README.md
```
## Workload
This project was completed individually by Sajil Maharjan.

All files were written by Sajil Maharjan including:
- Backend: main.py, database.py, routes/auth.py, routes/products.py, routes/cart.py, routes/admin.py
- Frontend: App.jsx, pages/Login.jsx, pages/Register.jsx, pages/Products.jsx, pages/Cart.jsx, pages/Admin.jsx, components/Navbar.jsx, api/index.js