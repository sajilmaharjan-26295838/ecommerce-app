import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { getCart, removeFromCart, clearCart } from "../api"

export default function Cart() {
  const [cart, setCart] = useState({ items: [] })
  const [error, setError] = useState("")
  const email = localStorage.getItem("email")

  const fetchCart = () => {
    getCart(email)
      .then(res => setCart(res.data))
      .catch(() => setError("Failed to load cart"))
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(email, productId)
      fetchCart()
    } catch {
      setError("Failed to remove item")
    }
  }

  const handleClear = async () => {
    try {
      await clearCart(email)
      fetchCart()
    } catch {
      setError("Failed to clear cart")
    }
  }

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>My Cart</h2>
        {error && <p style={styles.error}>{error}</p>}
        {cart.items.length === 0 ? (
          <p style={{ color: "#666" }}>Your cart is empty.</p>
        ) : (
          <>
            {cart.items.map((item, idx) => (
              <div key={idx} style={styles.item}>
                <div>
                  <p style={styles.itemName}>{item.name}</p>
                  <p style={styles.itemMeta}>Qty: {item.quantity} &times; ${item.price}</p>
                </div>
                <div style={styles.itemRight}>
                  <p style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</p>
                  <button style={styles.removeBtn} onClick={() => handleRemove(item.product_id)}>Remove</button>
                </div>
              </div>
            ))}
            <div style={styles.footer}>
              <p style={styles.total}>Total: <strong>${total.toFixed(2)}</strong></p>
              <button style={styles.clearBtn} onClick={handleClear}>Clear Cart</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { padding: "2rem", maxWidth: "700px", margin: "0 auto" },
  heading: { marginBottom: "1.5rem", fontSize: "24px" },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", borderRadius: "10px", padding: "1rem 1.5rem", marginBottom: "1rem", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" },
  itemName: { margin: 0, fontWeight: "600", fontSize: "16px" },
  itemMeta: { margin: "4px 0 0", color: "#666", fontSize: "14px" },
  itemRight: { textAlign: "right" },
  itemTotal: { margin: "0 0 6px", fontWeight: "bold", color: "#4f46e5" },
  removeBtn: { background: "#ef4444", color: "white", border: "none", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "13px" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" },
  total: { fontSize: "18px", margin: 0 },
  clearBtn: { background: "#6b7280", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "14px" },
  error: { color: "red", marginBottom: "1rem" },
}
