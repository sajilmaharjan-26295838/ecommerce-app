import axios from "axios"

const API = axios.create({ baseURL: "http://localhost:8000" })

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on expired / invalid token
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = "/"
    }
    return Promise.reject(err)
  }
)

// Auth
export const register = (data) => API.post("/auth/register", data)
export const login = (data) => API.post("/auth/login", data)
export const getProfile = () => API.get("/auth/profile")
export const updateProfile = (data) => API.put("/auth/profile", data)

// Products
export const getProducts = () => API.get("/products/")
export const createProduct = (data) => API.post("/products/", data)
export const updateProduct = (id, data) => API.put(`/products/${id}`, data)
export const deleteProduct = (id) => API.delete(`/products/${id}`)

// Cart
export const getCart = (userId) => API.get(`/cart/${userId}`)
export const addToCart = (userId, item) => API.post(`/cart/${userId}/add`, item)
export const updateCartItem = (userId, productId, quantity) =>
  API.put(`/cart/${userId}/update/${productId}`, { quantity })
export const removeFromCart = (userId, productId) => API.delete(`/cart/${userId}/remove/${productId}`)
export const clearCart = (userId) => API.delete(`/cart/${userId}/clear`)

// Admin
export const getAllUsers = () => API.get("/admin/users")
export const getAllCarts = () => API.get("/admin/carts")