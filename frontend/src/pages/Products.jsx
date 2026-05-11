import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { getProducts, createProduct, updateProduct, deleteProduct, addToCart } from "../api"

export default function Products() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState("")
  const [message, setMessage] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({ name: "", price: "", description: "", image: "" })
  const role = localStorage.getItem("role")
  const email = localStorage.getItem("email")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await getProducts()
      setProducts(res.data)
    } catch {
      setMessage("Failed to load products")
    }
  }

  // Live search — filters in state, no API call needed
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description?.toLowerCase().includes(query.toLowerCase())
  )

  const handleAddToCart = async (product) => {
    try {
      await addToCart(email, {
        product_id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1
      })
      setMessage(`${product.name} added to cart!`)
      setTimeout(() => setMessage(""), 2000)
    } catch {
      setMessage("Failed to add to cart")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, form)
        setMessage("Product updated!")
      } else {
        await createProduct(form)
        setMessage("Product created!")
      }
      setForm({ name: "", price: "", description: "", image: "" })
      setShowForm(false)
      setEditingProduct(null)
      fetchProducts()
      setTimeout(() => setMessage(""), 2000)
    } catch {
      setMessage("Failed to save product")
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || "",
      image: product.image || ""
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return
    try {
      await deleteProduct(id)
      setMessage("Product deleted!")
      fetchProducts()
      setTimeout(() => setMessage(""), 2000)
    } catch {
      setMessage("Failed to delete product")
    }
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Products</h2>
          {role === "admin" && (
            <button
              style={styles.addBtn}
              onClick={() => { setShowForm(!showForm); setEditingProduct(null); setForm({ name: "", price: "", description: "", image: "" }) }}
            >
              {showForm ? "Cancel" : "+ Add Product"}
            </button>
          )}
        </div>

        {/* Message */}
        {message && <p style={styles.message}>{message}</p>}

        {/* Admin Form */}
        {showForm && role === "admin" && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                style={styles.input}
                placeholder="Product name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                style={styles.input}
                placeholder="Price (e.g. 29.99)"
                type="number"
                step="0.01"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                required
              />
              <input
                style={styles.input}
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Image URL (optional)"
                value={form.image}
                onChange={e => setForm({ ...form, image: e.target.value })}
              />
              <button style={styles.submitBtn} type="submit">
                {editingProduct ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        )}

        {/* Live Search Bar */}
        <input
          style={styles.search}
          placeholder="Search products..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <p style={styles.empty}>
            {query ? `No products found for "${query}"` : "No products available."}
          </p>
        ) : (
          <div style={styles.grid}>
            {filtered.map(product => (
              <div key={product._id} style={styles.card}>
                {product.image && (
                  <img src={product.image} alt={product.name} style={styles.image} />
                )}
                <div style={styles.cardBody}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.productDesc}>{product.description}</p>
                  <p style={styles.productPrice}>${parseFloat(product.price).toFixed(2)}</p>
                  <button
                    style={styles.cartBtn}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  {role === "admin" && (
                    <div style={styles.adminBtns}>
                      <button style={styles.editBtn} onClick={() => handleEdit(product)}>Edit</button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(product._id)}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: "100vh", background: "#f0f2f5" },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "2rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
  title: { fontSize: "28px", margin: 0 },
  addBtn: { background: "#47510B", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "15px" },
  message: { background: "#d1fae5", color: "#065f46", padding: "10px 16px", borderRadius: "8px", marginBottom: "1rem" },
  formCard: { background: "white", padding: "1.5rem", borderRadius: "12px", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  formTitle: { margin: "0 0 1rem", fontSize: "18px" },
  input: { width: "100%", padding: "10px", marginBottom: "0.75rem", borderRadius: "8px", border: "1px solid #ddd", fontSize: "15px", boxSizing: "border-box" },
  submitBtn: { background: "#", color: "white", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "15px" },
  search: { width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "16px", marginBottom: "1.5rem", boxSizing: "border-box" },
  empty: { color: "#888", fontSize: "16px", textAlign: "center", marginTop: "2rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" },
  card: { background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  image: { width: "100%", height: "180px", objectFit: "cover" },
  cardBody: { padding: "1rem" },
  productName: { fontSize: "18px", margin: "0 0 0.5rem", fontWeight: "600" },
  productDesc: { color: "#666", fontSize: "14px", margin: "0 0 0.5rem" },
  productPrice: { fontSize: "20px", fontWeight: "bold", color: "#47510B", margin: "0 0 0.75rem" },
  cartBtn: { width: "100%", padding: "8px", background: "#47510B", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", marginBottom: "0.5rem" },
  adminBtns: { display: "flex", gap: "0.5rem", marginTop: "0.5rem" },
  editBtn: { flex: 1, padding: "6px", background: "#f59e0b", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  deleteBtn: { flex: 1, padding: "6px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }
}