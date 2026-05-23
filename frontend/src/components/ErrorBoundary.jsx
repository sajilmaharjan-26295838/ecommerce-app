import { Component } from "react"

// Class component required — React error boundaries cannot be written as function components
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.box}>
            <h2 style={styles.title}>Something went wrong</h2>
            <p style={styles.message}>
              An unexpected error occurred. Please refresh the page or try again later.
            </p>
            <button
              style={styles.btn}
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" },
  box: { background: "white", padding: "2.5rem", borderRadius: "12px", maxWidth: "420px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" },
  title: { color: "#47510B", fontSize: "22px", marginBottom: "0.75rem" },
  message: { color: "#666", fontSize: "15px", marginBottom: "1.5rem", lineHeight: 1.6 },
  btn: { background: "#47510B", color: "white", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "600" },
}
