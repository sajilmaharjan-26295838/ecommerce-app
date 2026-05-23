import { useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useCart } from "../context/CartContext"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = localStorage.getItem("role")
  const { cartCount, refreshCart } = useCart()

  // Refresh cart count whenever the route changes
  useEffect(() => {
    refreshCart()
  }, [location.pathname, refreshCart])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <nav style={styles.nav}>
      <Link to="/products" style={styles.brand}>🛍️ BgMart</Link>
      <div style={styles.links}>
        <Link to="/products" style={styles.link}>Products</Link>
        {role !== "admin" && (
          <Link to="/cart" style={styles.cartLink}>
            My Cart
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>
        )}
        {role === "admin" && <Link to="/admin" style={styles.link}>Admin</Link>}
        <Link to="/profile" style={styles.link}>Profile</Link>
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "#47510B", color: "white" },
  brand: { color: "white", textDecoration: "none", fontSize: "20px", fontWeight: "bold" },
  links: { display: "flex", gap: "1rem", alignItems: "center" },
  link: { color: "white", textDecoration: "none", fontSize: "15px" },
  cartLink: { color: "white", textDecoration: "none", fontSize: "15px", display: "flex", alignItems: "center", gap: "6px", position: "relative" },
  badge: { background: "#ef4444", color: "white", borderRadius: "50%", fontSize: "11px", fontWeight: "bold", minWidth: "18px", height: "18px", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 4px" },
  logout: { background: "rgba(255,255,255,0.2)", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }
}
