import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { getAllUsers, getAllCarts } from "../api"

export default function Admin() {
  const [users, setUsers] = useState([])
  const [carts, setCarts] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("users")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [usersRes, cartsRes] = await Promise.all([
        getAllUsers(),
        getAllCarts()
      ])
      setUsers(usersRes.data)
      setCarts(cartsRes.data)
    } catch {
      setMessage("Failed to load admin data")
    } finally {
      setLoading(false)
    }
  }

  // Find cart for a specific user
  const getUserCart = (userEmail) => {
    return carts.find(c => c.user_id === userEmail)
  }

  if (loading) return (
    <div style={styles.page}>
      <Navbar />
      <p style={styles.loading}>Loading admin data...</p>
    </div>
  )

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>

        {/* Header */}
        <h2 style={styles.title}>Admin Dashboard</h2>

        {/* Message */}
        {message && <p style={styles.message}>{message}</p>}

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{users.length}</p>
            <p style={styles.statLabel}>Total Users</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{carts.length}</p>
            <p style={styles.statLabel}>Active Carts</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>
              {carts.reduce((sum, c) => sum + (c.items?.length || 0), 0)}
            </p>
            <p style={styles.statLabel}>Total Items in Carts</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={activeTab === "users" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("users")}
          >
            All Users
          </button>
          <button
            style={activeTab === "carts" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("carts")}
          >
            All Carts
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            {users.length === 0 ? (
              <p style={styles.empty}>No users found</p>
            ) : (
              users.map((user, index) => {
                const userCart = getUserCart(user.email)
                const itemCount = userCart?.items?.length || 0
                const cartTotal = userCart?.items?.reduce((sum, item) =>
                  sum + (parseFloat(item.price) * item.quantity), 0) || 0

                return (
                  <div key={index} style={styles.userCard}>
                    <div style={styles.userHeader}>
                      <div style={styles.avatar}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={styles.userInfo}>
                        <h3 style={styles.userName}>{user.name}</h3>
                        <p style={styles.userEmail}>{user.email}</p>
                      </div>
                      <div style={styles.userBadge}>
                        <span style={{
                          ...styles.roleBadge,
                          background: user.role === "admin" ? "#47510B" : "#10b981"
                        }}>
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {/* User Cart Summary */}
                    <div style={styles.cartSummary}>
                      <span style={styles.cartInfo}>
                        🛒 {itemCount} items in cart
                      </span>
                      {cartTotal > 0 && (
                        <span style={styles.cartTotal}>
                          Total: ${cartTotal.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Cart Items */}
                    {userCart?.items?.length > 0 && (
                      <div style={styles.itemsList}>
                        {userCart.items.map((item, i) => (
                          <div key={i} style={styles.itemRow}>
                            <span style={styles.itemName}>{item.name}</span>
                            <span style={styles.itemQty}>x{item.quantity}</span>
                            <span style={styles.itemPrice}>
                              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Carts Tab */}
        {activeTab === "carts" && (
          <div>
            {carts.length === 0 ? (
              <p style={styles.empty}>No carts found</p>
            ) : (
              carts.map((cart, index) => (
                <div key={index} style={styles.userCard}>
                  <h3 style={styles.cartUser}>User: {cart.user_id}</h3>
                  {cart.items?.length === 0 ? (
                    <p style={styles.empty}>Empty cart</p>
                  ) : (
                    <div style={styles.itemsList}>
                      {cart.items?.map((item, i) => (
                        <div key={i} style={styles.itemRow}>
                          <span style={styles.itemName}>{item.name}</span>
                          <span style={styles.itemQty}>x{item.quantity}</span>
                          <span style={styles.itemPrice}>
                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div style={styles.cartTotalRow}>
                        <span>Cart Total:</span>
                        <span style={styles.cartTotal}>
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

const styles = {
  page: { minHeight: "100vh", background: "#f0f2f5" },
  container: { maxWidth: "900px", margin: "0 auto", padding: "2rem" },
  title: { fontSize: "28px", marginBottom: "1.5rem" },
  message: { background: "#fee2e2", color: "#991b1b", padding: "10px 16px", borderRadius: "8px", marginBottom: "1rem" },
  loading: { textAlign: "center", marginTop: "3rem", color: "#666" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" },
  statCard: { background: "white", borderRadius: "12px", padding: "1.5rem", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  statNumber: { fontSize: "36px", fontWeight: "bold", color: "#47510B", margin: "0 0 0.25rem" },
  statLabel: { color: "#666", margin: 0, fontSize: "14px" },
  tabs: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem" },
  tab: { padding: "8px 20px", border: "1px solid #ddd", borderRadius: "8px", background: "white", cursor: "pointer", fontSize: "14px", color: "#666" },
  activeTab: { padding: "8px 20px", border: "none", borderRadius: "8px", background: "#47510B", cursor: "pointer", fontSize: "14px", color: "white" },
  empty: { color: "#888", textAlign: "center", padding: "2rem" },
  userCard: { background: "white", borderRadius: "12px", padding: "1.25rem", marginBottom: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  userHeader: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" },
  avatar: { width: "44px", height: "44px", borderRadius: "50%", background: "#47510B", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold", flexShrink: 0 },
  userInfo: { flex: 1 },
  userName: { margin: "0 0 0.25rem", fontSize: "16px", fontWeight: "600" },
  userEmail: { margin: 0, color: "#666", fontSize: "14px" },
  userBadge: { },
  roleBadge: { padding: "4px 12px", borderRadius: "20px", color: "white", fontSize: "12px", fontWeight: "500" },
  cartSummary: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderTop: "1px solid #f0f0f0", marginTop: "0.5rem" },
  cartInfo: { color: "#666", fontSize: "14px" },
  cartTotal: { color: "#47510B", fontWeight: "600", fontSize: "14px" },
  itemsList: { marginTop: "0.75rem", borderTop: "1px solid #f0f0f0", paddingTop: "0.75rem" },
  itemRow: { display: "flex", justifyContent: "space-between", padding: "0.4rem 0", fontSize: "14px", borderBottom: "1px solid #fafafa" },
  itemName: { flex: 1, color: "#333" },
  itemQty: { color: "#888", margin: "0 1rem" },
  itemPrice: { fontWeight: "500", color: "#47510B" },
  cartUser: { margin: "0 0 0.75rem", fontSize: "16px", color: "#444" },
  cartTotalRow: { display: "flex", justifyContent: "space-between", marginTop: "0.75rem", fontWeight: "600", fontSize: "15px" }
}