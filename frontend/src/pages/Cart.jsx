import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { getCart, removeFromCart, clearCart, updateCartItem } from "../api"
import { useCart } from "../context/CartContext"

export default function Cart() {
  const [cart, setCart] = useState({ items: [] })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const email = localStorage.getItem("email")
  const { refreshCart } = useCart()

  useEffect(() => { fetchCart() }, [])

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
      setMessage("Item removed")
      fetchCart()
      refreshCart()
      setTimeout(() => setMessage(""), 2000)
    } catch {
      setMessage("Failed to remove item")
    }
  }

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return
    try {
      await updateCartItem(email, productId, newQty)
      fetchCart()
      refreshCart()
    } catch {
      setMessage("Failed to update quantity")
    }
  }

  const handleClear = async () => {
    if (!window.confirm("Clear entire cart?")) return
    try {
      await clearCart(email)
      setMessage("Cart cleared")
      fetchCart()
      refreshCart()
      setTimeout(() => setMessage(""), 2000)
    } catch {
      setMessage("Failed to clear cart")
    }
  }

  const total = cart.items?.reduce((sum, item) =>
    sum + (parseFloat(item.price) * item.quantity), 0) || 0

  if (loading) return (
    <div className="cart-page">
      <Navbar />
      <p className="cart-loading">Loading cart…</p>
    </div>
  )

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-container">

        <div className="cart-header">
          <h2 className="cart-title">
            <span>Your</span>
            Cart
          </h2>
          {cart.items?.length > 0 && (
            <button className="cart-clear-btn" onClick={handleClear}>
              Clear All
            </button>
          )}
        </div>

        {message && <p className="msg-success">{message}</p>}

        {cart.items?.length === 0 ? (
          <div className="cart-empty">
            <p className="cart-empty__text">Your cart is empty</p>
            <a href="/products" className="cart-empty__link">Continue Shopping</a>
          </div>
        ) : (
          <div>
            {cart.items.map((item, i) => (
              <div
                key={i}
                className="cart-item"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="cart-item__left">
                  <h3 className="cart-item__name">{item.name}</h3>
                  <div className="cart-item__qty-row">
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                    >−</button>
                    <span className="cart-item__qty-num">{item.quantity}</span>
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                    >+</button>
                  </div>
                  <p className="cart-item__unit-price">
                    ${parseFloat(item.price).toFixed(2)} each
                  </p>
                </div>
                <div className="cart-item__right">
                  <p className="cart-item__total">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="cart-item__remove-btn"
                    onClick={() => handleRemove(item.product_id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-total-box">
              <span className="cart-total__label">Order Total</span>
              <span className="cart-total__amount">${total.toFixed(2)}</span>
            </div>

            <button className="cart-checkout-btn" disabled title="Coming soon">
              Proceed to Checkout — Coming Soon
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
