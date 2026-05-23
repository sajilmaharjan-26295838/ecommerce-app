import { useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useCart } from "../context/CartContext"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = localStorage.getItem("role")
  const { cartCount, refreshCart } = useCart()

  useEffect(() => {
    refreshCart()
  }, [location.pathname, refreshCart])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <Link to="/products" className="navbar__brand">BgMart</Link>
      <div className="navbar__links">
        <Link to="/products" className="navbar__link">Products</Link>
        {role !== "admin" && (
          <Link to="/cart" className="navbar__cart-link">
            Cart
            {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
          </Link>
        )}
        {role === "admin" && <Link to="/admin" className="navbar__link">Admin</Link>}
        <Link to="/profile" className="navbar__link">Profile</Link>
        <button onClick={handleLogout} className="navbar__logout">Logout</button>
      </div>
    </nav>
  )
}
