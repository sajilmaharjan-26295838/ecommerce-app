import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { login } from "../api"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const res = await login({ email, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)
      // Store user email as a simple user id reference
      localStorage.setItem("email", email)
      navigate("/products")
    } catch (err) {
      setError("Invalid email or password")
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to your account</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">Login</button>
        </form>
        <p style={styles.link}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" },
  card: { background: "#e4ebb1", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "400px", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" },
  title: { margin: "0 0 0.5rem", color: "#050505", fontSize: "24px" },
  subtitle: { margin: "0 0 1.5rem", color: "#666" },
  input: { background: "#FFFFFF", color: "#000000", width: "100%", padding: "10px", marginBottom: "1rem", borderRadius: "8px", border: "1px solid #ddd", fontSize: "15px", boxSizing: "border-box" },
  button: { width: "100%", padding: "10px", background: "#4f46e5", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
  error: { color: "red", marginBottom: "1rem" },
  link: { textAlign: "center", marginTop: "1rem", color: "#666" }
}