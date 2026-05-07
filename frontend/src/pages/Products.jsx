import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { getProducts, addToCart } from "../api"

export default function Products() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const email = localStorage.getItem("email")

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(() => setError("Failed to load products"))
  }, [])

  const handleAddToCart = async (product) => {
    try {
      await addToCart(email, { product_id: product._id, name: product.name, price: product.price, quantity: 1 })
      setMessage(`"${product.name}" added to cart`)
      setTimeout(() => setMessage(""), 2000)
    } catch {
      setError("Failed to add to cart")
    }
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Products</h2>
        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}
        <div style={styles.grid}>
          {products.map(product => (
            <div key={product._id} style={styles.card}>
              <h3 style={styles.name}>{product.name}</h3>
              <p style={styles.description}>{product.description}</p>
              <p style={styles.price}>${product.price}</p>
              <button style={styles.button} onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))}
          {products.length === 0 && !error && (
            <p style={{ color: "#666" }}>No products available.</p>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: "2rem" },
  heading: { marginBottom: "1.5rem", fontSize: "24px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" },
  card: { background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  name: { margin: "0 0 0.5rem", fontSize: "18px" },
  description: { color: "#666", margin: "0 0 1rem", fontSize: "14px" },
  price: { fontWeight: "bold", fontSize: "16px", margin: "0 0 1rem", color: "#4f46e5" },
  button: { width: "100%", padding: "8px", background: "#4f46e5", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" },
  error: { color: "red", marginBottom: "1rem" },
  success: { color: "green", marginBottom: "1rem" },
}
