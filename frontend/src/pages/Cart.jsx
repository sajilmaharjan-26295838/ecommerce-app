import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { getCart, removeFromCart, clearCart } from "../api"

export default function Cart() {
  const [cart, setCart] = useState({ items: [] })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const email = localStorage.getItem("email")

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const res = await getCart(email)
      setCart(res.data)
    } catch {
      setMessage("Failed to load cart")
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(email, productId)
      setMessage("Item removed!")
      fetchCart()
      setTimeout(() => setMessage(""), 2000)
    } catch {
      setMessage("Failed to remove item")
    }
  }

  const handleClear = async () => {
    if (!window.confirm("Clear entire cart?")) return
    try {
      await clearCart(email)
      setMessage("Cart cleared!")
      fetchCart()
      setTimeout(() => setMessage(""), 2000)
    } catch {
      setMessage("Failed to clear cart")
    }
  }

  // Calculate total price
  const total = cart.items?.reduce((sum, item) => {
    return sum + (parseFloat(item.price) * item.quantity)
  }, 0) || 0

  if (loading) return (
    <div style={styles.page}>
      <Navbar />
      <p style={styles.loading}>Loading cart...</p>
    </div>
  )

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>My Cart</h2>
          {cart.items?.length > 0 && (
            <button style={styles.clearBtn} onClick={handleClear}>
              Clear Cart
            </button>
          )}
        </div>

        {/* Message */}
        {message && <p style={styles.message}>{message}</p>}

        {/* Empty Cart */}
        {cart.items?.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyText}>Your cart is empty!</p>
            <a href="/products" style={styles.shopLink}>
              Continue Shopping
            </a>
          </div>
        ) : (
          <div>
            {/* Cart Items */}
            {cart.items.map((item, index) => (
              <div key={index} style={styles.card}>
                <div style={styles.cardLeft}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemQty}>Quantity: {item.quantity}</p>
                  <p style={styles.itemPrice}>
                    ${parseFloat(item.price).toFixed(2)} each
                  </p>
                </div>
                <div style={styles.cardRight}>
                  <p style={styles.itemTotal}>
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                  <button
                    style={styles.removeBtn}
                    onClick={() => handleRemove(item.product_id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Total */}
            <div style={styles.totalBox}>
              <span style={styles.totalLabel}>Total:</span>
              <span style={styles.totalAmount}>${total.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <button style={styles.checkoutBtn}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: "100vh", background: "#f0f2f5" },
  container: { maxWidth: "800px", margin: "0 auto", padding: "2rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },
  title: { fontSize: "28px", margin: 0 },
  clearBtn: { background: "#ef4444", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" },
  message: { background: "#d1fae5", color: "#065f46", padding: "10px 16px", borderRadius: "8px", marginBottom: "1rem" },
  loading: { textAlign: "center", marginTop: "3rem", color: "#666" },
  emptyBox: { textAlign: "center", padding: "4rem", background: "white", borderRadius: "12px" },
  emptyText: { fontSize: "18px", color: "#666", marginBottom: "1rem" },
  shopLink: { color: "#47510B", fontSize: "16px", textDecoration: "none", fontWeight: "500" },
  card: { background: "white", borderRadius: "12px", padding: "1.25rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  cardLeft: { flex: 1 },
  cardRight: { textAlign: "right" },
  itemName: { fontSize: "18px", margin: "0 0 0.25rem", fontWeight: "600" },
  itemQty: { color: "#666", margin: "0 0 0.25rem", fontSize: "14px" },
  itemPrice: { color: "#888", margin: 0, fontSize: "14px" },
  itemTotal: { fontSize: "20px", fontWeight: "bold", color: "#47510B", margin: "0 0 0.5rem" },
  removeBtn: { background: "#ef4444", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  totalBox: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", borderRadius: "12px", padding: "1.25rem", marginTop: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  totalLabel: { fontSize: "20px", fontWeight: "600" },
  totalAmount: { fontSize: "28px", fontWeight: "bold", color: "#47510B" },
  checkoutBtn: { width: "100%", padding: "14px", background: "#47510B", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", cursor: "pointer", marginTop: "1rem", fontWeight: "500" }
}