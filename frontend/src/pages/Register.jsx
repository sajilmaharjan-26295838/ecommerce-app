import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { register } from "../api"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const validate = () => {
    if (!name.trim() || !email.trim() || !password) return "All fields are required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address"
    if (password.length < 6) return "Password must be at least 6 characters"
    return null
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) return setError(validationError)
    setError("")
    try {
      await register({ name, email, password })
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="auth-brand">BgMart</span>
        <div className="auth-divider" />
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Join us today</p>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            className="auth-input"
            type="text"
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
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
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="auth-btn" type="submit">Create Account</button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
