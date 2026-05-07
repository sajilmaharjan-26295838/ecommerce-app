import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate()
  const role = localStorage.getItem("role")

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <nav style={styles.nav}>
      <Link to="/products" style={styles.brand}>🛒 ShopEasy</Link>
      <div style={styles.links}>
        <Link to="/products" style={styles.link}>Products</Link>
        <Link to="/cart" style={styles.link}>My Cart</Link>
        {role === "admin" && <Link to="/admin" style={styles.link}>Admin</Link>}
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "#4f46e5", color: "white" },
  brand: { color: "white", textDecoration: "none", fontSize: "20px", fontWeight: "bold" },
  links: { display: "flex", gap: "1rem", alignItems: "center" },
  link: { color: "white", textDecoration: "none", fontSize: "15px" },
  logout: { background: "rgba(255,255,255,0.2)", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }
}