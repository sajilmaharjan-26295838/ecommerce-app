import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { getAllUsers, getAllCarts, toggleUserStatus } from "../api"

export default function Admin() {
  const [users, setUsers] = useState([])
  const [carts, setCarts] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("users")

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [usersRes, cartsRes] = await Promise.all([getAllUsers(), getAllCarts()])
      setUsers(usersRes.data)
      setCarts(cartsRes.data)
    } catch {
      setMessage("Failed to load admin data")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (userId) => {
    try {
      await toggleUserStatus(userId)
      fetchData()
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to update user status")
    }
  }

  const adminEmails = new Set(users.filter(u => u.role === "admin").map(u => u.email))
  const regularUsers = users.filter(u => u.role !== "admin")
  const userCarts = carts.filter(c => !adminEmails.has(c.user_id))

  const getUserCart = (userEmail) => {
    if (adminEmails.has(userEmail)) return null
    return carts.find(c => c.user_id === userEmail)
  }

  if (loading) return (
    <div className="admin-page">
      <Navbar />
      <p className="admin-loading">Loading admin data…</p>
    </div>
  )

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">

        <h2 className="admin-title">
          <span>Overview</span>
          Dashboard
        </h2>

        {message && <p className="msg-error">{message}</p>}

        <div className="admin-stats">
          <div className="admin-stat-card">
            <p className="admin-stat-number">{regularUsers.length}</p>
            <p className="admin-stat-label">Total Users</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-number">
              {userCarts.filter(c => c.items?.length > 0).length}
            </p>
            <p className="admin-stat-label">Active Carts</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-number">
              {userCarts.reduce((sum, c) => sum + (c.items?.length || 0), 0)}
            </p>
            <p className="admin-stat-label">Items in Carts</p>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab${activeTab === "users" ? " admin-tab--active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            All Users
          </button>
          <button
            className={`admin-tab${activeTab === "carts" ? " admin-tab--active" : ""}`}
            onClick={() => setActiveTab("carts")}
          >
            All Carts
          </button>
        </div>

        {activeTab === "users" && (
          <div>
            {regularUsers.length === 0 ? (
              <p className="admin-empty">No users found</p>
            ) : (
              regularUsers.map((user, i) => {
                const userCart = getUserCart(user.email)
                const itemCount = userCart?.items?.length || 0
                const cartTotal = userCart?.items?.reduce((sum, item) =>
                  sum + (parseFloat(item.price) * item.quantity), 0) || 0

                return (
                  <div
                    key={i}
                    className="admin-user-card"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="admin-user-header">
                      <div className="admin-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="admin-user-info">
                        <p className="admin-user-name">{user.name}</p>
                        <p className="admin-user-email">{user.email}</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
                        <span
                          className="admin-role-badge"
                          style={{ background: user.role === "admin" ? "#c9a84c" : "#5db87c" }}
                        >
                          {user.role}
                        </span>
                        <span
                          className="admin-role-badge"
                          style={{ background: user.is_active === false ? "#ef4444" : "#22c55e" }}
                        >
                          {user.is_active === false ? "Deactivated" : "Active"}
                        </span>
                      </div>
                    </div>

                    <div className="admin-cart-summary">
                      <span className="admin-cart-info">
                        {itemCount} item{itemCount !== 1 ? "s" : ""} in cart
                      </span>
                      {cartTotal > 0 && (
                        <span className="admin-cart-total">
                          ${cartTotal.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {userCart?.items?.length > 0 && (
                      <div className="admin-items-list">
                        {userCart.items.map((item, j) => (
                          <div key={j} className="admin-item-row">
                            <span className="admin-item-name">{item.name}</span>
                            <span className="admin-item-qty">×{item.quantity}</span>
                            <span className="admin-item-price">
                              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Activate / Deactivate button */}
                    <div style={{ marginTop: "0.75rem", textAlign: "right" }}>
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        style={{
                          padding: "6px 16px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "600",
                          background: user.is_active === false ? "#22c55e" : "#ef4444",
                          color: "white"
                        }}
                      >
                        {user.is_active === false ? "Activate" : "Deactivate"}
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === "carts" && (
          <div>
            {userCarts.length === 0 ? (
              <p className="admin-empty">No carts found</p>
            ) : (
              userCarts.map((cart, i) => (
                <div
                  key={i}
                  className="admin-user-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <p className="admin-cart-user">{cart.user_id}</p>
                  {cart.items?.length === 0 ? (
                    <p className="admin-empty" style={{ padding: "1rem 0" }}>Empty cart</p>
                  ) : (
                    <div className="admin-items-list">
                      {cart.items?.map((item, j) => (
                        <div key={j} className="admin-item-row">
                          <span className="admin-item-name">{item.name}</span>
                          <span className="admin-item-qty">×{item.quantity}</span>
                          <span className="admin-item-price">
                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="admin-cart-total-row">
                        <span>Cart Total</span>
                        <span style={{ color: "var(--gold)" }}>
                          ${cart.items?.reduce((sum, item) =>
                            sum + (parseFloat(item.price) * item.quantity), 0
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
