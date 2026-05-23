import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { login } from "../api"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const validate = () => {
    if (!email.trim() || !password) return "All fields are required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address"
    return null
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) return setError(validationError)
    setError("")
    try {
      const res = await login({ email, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)
      localStorage.setItem("email", email)
      navigate("/products")
    } catch {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="auth-brand">BgMart</span>
        <div className="auth-divider" />
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account</p>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="auth-btn" type="submit">Sign In</button>
        </form>
        <p className="auth-link">
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
