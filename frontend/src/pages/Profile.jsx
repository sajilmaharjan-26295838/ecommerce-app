import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { getProfile, updateProfile } from "../api"

export default function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "", role: "" })
  const [name, setName] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile()
      .then((res) => {
        setProfile(res.data)
        setName(res.data.name)
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false))
  }, [])

  const showMsg = (msg, isError = false) => {
    if (isError) { setError(msg); setMessage("") }
    else { setMessage(msg); setError("") }
    setTimeout(() => { setMessage(""); setError("") }, 3000)
  }

  const handleUpdateName = async (e) => {
    e.preventDefault()
    if (!name.trim()) return showMsg("Name cannot be empty", true)
    if (name.trim() === profile.name) return showMsg("No changes to save", true)
    try {
      await updateProfile({ name: name.trim() })
      setProfile((p) => ({ ...p, name: name.trim() }))
      showMsg("Name updated successfully!")
    } catch (err) {
      showMsg(err.response?.data?.detail || "Failed to update name", true)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword)
      return showMsg("All password fields are required", true)
    if (newPassword !== confirmPassword)
      return showMsg("New passwords do not match", true)
    if (newPassword.length < 6)
      return showMsg("New password must be at least 6 characters", true)
    try {
      await updateProfile({ current_password: currentPassword, new_password: newPassword })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      showMsg("Password changed successfully!")
    } catch (err) {
      showMsg(err.response?.data?.detail || "Failed to change password", true)
    }
  }

  if (loading) return <div><Navbar /><p style={styles.loading}>Loading...</p></div>

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>My Profile</h2>

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Account Info */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Account Information</h3>
          <div style={styles.infoRow}>
            <span style={styles.label}>Email</span>
            <span style={styles.value}>{profile.email}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Role</span>
            <span style={{ ...styles.badge, background: profile.role === "admin" ? "#47510B" : "#16a34a" }}>
              {profile.role}
            </span>
          </div>
        </div>

        {/* Edit Name */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Edit Name</h3>
          <form onSubmit={handleUpdateName} style={styles.form}>
            <input
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <button type="submit" style={styles.btn}>Save Name</button>
          </form>
        </div>

        {/* Change Password */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Change Password</h3>
          <form onSubmit={handleChangePassword} style={styles.form}>
            <input
              style={styles.input}
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="New password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" style={styles.btn}>Change Password</button>
          </form>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: "100vh", background: "#f5f5f0" },
  container: { maxWidth: "540px", margin: "2rem auto", padding: "0 1rem" },
  heading: { fontSize: "24px", fontWeight: "bold", color: "#47510B", marginBottom: "1.5rem" },
  loading: { textAlign: "center", marginTop: "2rem", color: "#666" },
  success: { background: "#dcfce7", color: "#15803d", padding: "10px 14px", borderRadius: "8px", marginBottom: "1rem", fontSize: "14px" },
  errorBox: { background: "#fee2e2", color: "#b91c1c", padding: "10px 14px", borderRadius: "8px", marginBottom: "1rem", fontSize: "14px" },
  card: { background: "white", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  cardTitle: { fontSize: "16px", fontWeight: "600", color: "#333", marginBottom: "1rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" },
  infoRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" },
  label: { color: "#666", fontSize: "14px" },
  value: { color: "#333", fontSize: "14px", fontWeight: "500" },
  badge: { color: "white", padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize" },
  form: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  input: { padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none" },
  btn: { background: "#47510B", color: "white", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
}
