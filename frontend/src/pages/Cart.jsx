import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { getCart, removeFromCart, clearCart, updateCartItem } from "../api"
import { useCart } from "../context/CartContext"

export default function Cart() {
  const [cart, setCart] = useState({ items: [] })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderSummary, setOrderSummary] = useState({ items: [], total: 0 })
  const [countdown, setCountdown] = useState(3)
  const email = localStorage.getItem("email")
  const { refreshCart } = useCart()
  const navigate = useNavigate()

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

  const handleCheckout = async () => {
    try {
      // Snapshot cart contents before clearing — the modal needs this data after the cart is empty
      const items = cart.items
      const total = items.reduce((sum, item) =>
        sum + (parseFloat(item.price) * item.quantity), 0)
      await clearCart(email)
      refreshCart()
      setOrderSummary({ items, total })
      setCountdown(7)
      setOrderPlaced(true)
    } catch {
      setMessage("Checkout failed. Please try again.")
    }
  }

  // Countdown timer — ticks every second and navigates when it hits 0.
  // Cleanup (return clearTimeout) prevents a stale tick firing if the component unmounts early.
  useEffect(() => {
    if (!orderPlaced) return
    if (countdown === 0) { navigate("/products"); return }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [orderPlaced, countdown, navigate])

  const total = cart.items?.reduce((sum, item) =>
    sum + (parseFloat(item.price) * item.quantity), 0) || 0

  if (loading) return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-container">
        <div className="cart-header">
          <h2 className="cart-title"><span>Your</span>Cart</h2>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="cart-item">
            <div className="cart-item__left" style={{ flex: 1 }}>
              <div className="skeleton skeleton--title" />
              <div className="skeleton skeleton--text" />
              <div className="skeleton skeleton--price" />
            </div>
            <div className="cart-item__right">
              <div className="skeleton skeleton--price" style={{ width: "60px" }} />
            </div>
          </div>
        ))}
      </div>
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

            <button className="cart-checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* Order confirmation modal */}
      {orderPlaced && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">🎉</div>
            <h2 className="modal-title">Order Placed!</h2>
            <p className="modal-subtitle">Thank you for your purchase.</p>

            <div className="modal-items">
              {orderSummary.items.map((item, i) => (
                <div key={i} className="modal-item-row">
                  <span className="modal-item-name">{item.name}</span>
                  <span className="modal-item-qty">×{item.quantity}</span>
                  <span className="modal-item-subtotal">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="modal-total-row">
              <span className="modal-total-label">Total Paid</span>
              <span className="modal-total-amount">${orderSummary.total.toFixed(2)}</span>
            </div>

            <p className="modal-countdown">
              Redirecting in <strong>{countdown}s</strong>…
            </p>
            <button className="modal-btn" onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
