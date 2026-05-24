# BgMart — E-Commerce Shopping Cart

A full-stack single-page e-commerce application built with React, FastAPI, and MongoDB.

## Problem Statement

BgMart solves the need for a simple, fast, and intuitive online shopping experience. Users can browse products, search in real-time, and manage their shopping cart. Admins can manage products and monitor all user activity and carts from a dedicated dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (Vite), React Router DOM, Axios |
| Backend | FastAPI (Python) |
| Database | MongoDB (local) with Motor (async driver) |
| Authentication | JWT (python-jose) + bcrypt password hashing |

## Features

- User registration and login with JWT authentication
- Role-based access control (user vs admin)
- Live product search — filters in real-time as you type
- Full CRUD operations on products (admin only)
- Shopping cart — add, remove, update quantity, clear items, and checkout
- Checkout — order confirmation modal with item summary, total, and auto-redirect
- Admin dashboard — view all users and their carts
- User profile — update display name and change password
- Single-page application — no page reloads

## How to Run

### Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB (running locally on port 27017)

### Step 1 — Start MongoDB

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

### Environment Variables

The backend reads from `backend/.env`. A template is provided at `backend/.env.example`:

```
MONGO_URL=mongodb://localhost:27017
JWT_SECRET=your_secret_key_here
```

### Default Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@shop.com | admin123 |
| User | sajil@shop.com | sajil123 |

## Folder Structure

```
ecommerce-app/
├── backend/                    # FastAPI application
│   ├── routes/                 # One route file per entity
│   │   ├── auth.py             # Register, login, get/update profile
│   │   ├── products.py         # Product CRUD (admin-protected write ops)
│   │   ├── cart.py             # Per-user cart management (add, update, remove, clear)
│   │   └── admin.py            # Admin dashboard: list all users and carts
│   ├── deps.py                 # JWT auth dependencies (require_auth, require_admin)
│   ├── database.py             # Async MongoDB connection via Motor
│   ├── main.py                 # FastAPI app setup, CORS configuration, router registration
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Local environment variables (not committed)
│   └── .env.example            # Template for environment variables
│
├── frontend/                   # React application (Vite)
│   └── src/
│       ├── pages/              # One component per route/view
│       │   ├── Login.jsx       # Login form with JWT storage
│       │   ├── Register.jsx    # New user registration form
│       │   ├── Products.jsx    # Product listing with live search, admin CRUD controls
│       │   ├── Cart.jsx        # Shopping cart with quantity controls and checkout modal
│       │   ├── Admin.jsx       # Admin dashboard: user list and all cart summaries
│       │   └── Profile.jsx     # Logged-in user's name and password management
│       ├── components/         # Reusable UI components
│       │   ├── Navbar.jsx      # Top navigation bar with cart item badge
│       │   └── ErrorBoundary.jsx # Catches unhandled React errors; prevents blank-screen crashes
│       ├── context/            # React Context for shared global state
│       │   └── CartContext.jsx # Provides cart item count to Navbar across the app
│       ├── api/                # Centralised Axios client and typed API call functions
│       │   └── index.js        # Axios instance with JWT interceptor and 401 redirect
│       ├── App.jsx             # Route definitions, PrivateRoute and AdminRoute guards
│       ├── main.jsx            # React entry point; wraps app in CartProvider
│       └── index.css           # Global styles (dark theme)
│
├── database/                   # Sample data exports for MongoDB seeding
│   ├── users.json              # Two seed accounts (admin + regular user)
│   ├── products.json           # Four sample products
│   └── carts.json              # Sample cart data
│
└── .gitignore
```

## Design Decisions

- **useState over useReducer**: Cart item state is simple scalar values (add/remove/clear). useReducer would add boilerplate without benefit for this use case.
- **Context API over Redux**: The only shared global state is the cart item count displayed in the Navbar badge. Context API handles this with far less overhead than Redux.
- **useCallback in CartContext**: `refreshCart` is passed as a dependency to `useEffect` in Cart.jsx. Without `useCallback`, it would be recreated on every render, causing an infinite re-render loop.
- **Client-side live search**: The product list is small (<100 items fetched once), so filtering on the client avoids extra API round-trips and gives instant, zero-latency feedback.
- **Class component for ErrorBoundary**: React's `componentDidCatch` lifecycle is only available in class components. This is the only class component in the project, and it is justified by this React constraint.
- **Soft-delete for users (deactivation)**: Admins toggle `is_active` rather than permanently deleting accounts. This preserves cart history and provides a recoverable action — a standard pattern in production systems.
- **JWT stored in localStorage**: Keeps the auth flow stateless and simple for a client-side SPA. The token is cleared on logout or 401 response.
- **Axios interceptors for auth**: Attaching the Bearer token and handling 401 redirects in a single place (api/index.js) avoids repeating auth logic in every component.

## Workload

This project was completed individually by Sajil Maharjan.

All files were written by Sajil Maharjan including:

**Backend:**
- `main.py`, `database.py`, `deps.py`
- `routes/auth.py`, `routes/products.py`, `routes/cart.py`, `routes/admin.py`

**Frontend:**
- `App.jsx`, `main.jsx`
- `pages/Login.jsx`, `pages/Register.jsx`, `pages/Products.jsx`, `pages/Cart.jsx`, `pages/Admin.jsx`, `pages/Profile.jsx`
- `components/Navbar.jsx`, `components/ErrorBoundary.jsx`
- `context/CartContext.jsx`
- `api/index.js`
