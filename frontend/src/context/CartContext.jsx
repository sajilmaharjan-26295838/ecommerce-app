import { createContext, useContext, useState, useCallback } from "react"
import { getCart } from "../api"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0)

  // Fetches the current user's cart and updates the count in context.
  // useCallback ensures a stable reference so callers don't re-render unnecessarily.
  const refreshCart = useCallback(async () => {
    const email = localStorage.getItem("email")
    const role = localStorage.getItem("role")
    if (!email || role === "admin") {
      setCartCount(0)
      return
    }
    try {
      const res = await getCart(email)
      const total = res.data.items?.reduce((sum, i) => sum + i.quantity, 0) || 0
      setCartCount(total)
    } catch {
      // Silently ignore — count just won't update if the request fails
    }
  }, [])

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
