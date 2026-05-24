import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { getProducts, createProduct, updateProduct, deleteProduct, addToCart } from "../api"
import { useCart } from "../context/CartContext"

export default function Products() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({ name: "", price: "", description: "", image: "" })
  const role = localStorage.getItem("role")
  const email = localStorage.getItem("email")
  const { refreshCart } = useCart()

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const res = await getProducts()
      setProducts(res.data)
    } catch {
      setMessage("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  // Client-side filter — no extra API call; derived from already-fetched list
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
      refreshCart()
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
    <div className="products-page">
      <Navbar />
      <div className="products-container">

        <div className="products-header">
          <h2 className="products-title">
            <span>BgMart</span>
            Products
          </h2>
          {role === "admin" && (
            <button
              className="products-add-btn"
              onClick={() => {
                setShowForm(!showForm)
                setEditingProduct(null)
                setForm({ name: "", price: "", description: "", image: "" })
              }}
            >
              {showForm ? "Cancel" : "+ Add Product"}
            </button>
          )}
        </div>

        {message && <p className="msg-success">{message}</p>}

        {showForm && role === "admin" && (
          <div className="products-form-card">
            <h3 className="products-form-title">
              {editingProduct ? "Edit Product" : "New Product"}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                className="products-input"
                placeholder="Product name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                className="products-input"
                placeholder="Price (e.g. 29.99)"
                type="number"
                step="0.01"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                required
              />
              <input
                className="products-input"
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
              <input
                className="products-input"
                placeholder="Image URL (optional)"
                value={form.image}
                onChange={e => setForm({ ...form, image: e.target.value })}
              />
              <button className="products-submit" type="submit">
                {editingProduct ? "Update" : "Create"}
              </button>
            </form>
          </div>
        )}

        <input
          className="products-search"
          placeholder="Search products..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        {loading ? (
          <div className="products-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="product-card">
                <div className="skeleton skeleton--block" />
                <div className="product-card__body">
                  <div className="skeleton skeleton--title" />
                  <div className="skeleton skeleton--text" />
                  <div className="skeleton skeleton--price" />
                  <div className="skeleton skeleton--btn" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="products-empty">
            {query ? `No results for "${query}"` : "No products available."}
          </p>
        ) : (
          <div className="products-grid">
            {filtered.map((product, i) => (
              <div
                key={product._id}
                className="product-card"
                style={{ animationDelay: `${i * 0.05}s` }} /* stagger card entrance */
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-card__image"
                  />
                )}
                <div className="product-card__body">
                  <h3 className="product-card__name">{product.name}</h3>
                  <p className="product-card__desc">{product.description}</p>
                  <p className="product-card__price">
                    ${parseFloat(product.price).toFixed(2)}
                  </p>
                  {role !== "admin" && (
                    <button
                      className="product-card__cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  )}
                  {role === "admin" && (
                    <div className="product-card__admin-btns">
                      <button
                        className="product-card__edit-btn"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="product-card__delete-btn"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
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
