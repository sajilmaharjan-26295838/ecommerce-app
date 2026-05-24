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

  if (loading) return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <h2 className="profile-heading">Profile</h2>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="profile-card" style={{ minHeight: "90px" }}>
            <div className="skeleton skeleton--title" style={{ width: "40%", marginBottom: "1rem" }} />
            <div className="skeleton skeleton--text" />
            <div className="skeleton skeleton--text" style={{ width: "60%" }} />
          </div>
        ))}
      </div>
    </div>
  )

  const badgeColor = profile.role === "admin" ? "#c9a84c" : "#5db87c"

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <h2 className="profile-heading">Profile</h2>

        {message && <div className="msg-success">{message}</div>}
        {error   && <div className="msg-error">{error}</div>}

        <div className="profile-card">
          <p className="profile-card__title">Account Information</p>
          <div className="profile-info-row">
            <span className="profile-label">Email</span>
            <span className="profile-value">{profile.email}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-label">Role</span>
            <span
              className="profile-badge"
              style={{ background: badgeColor }}
            >
              {profile.role}
            </span>
          </div>
        </div>

        <div className="profile-card">
          <p className="profile-card__title">Edit Name</p>
          <form onSubmit={handleUpdateName} className="profile-form">
            <input
              className="profile-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <button type="submit" className="profile-btn">Save Name</button>
          </form>
        </div>

        <div className="profile-card">
          <p className="profile-card__title">Change Password</p>
          <form onSubmit={handleChangePassword} className="profile-form">
            <input
              className="profile-input"
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              className="profile-input"
              type="password"
              placeholder="New password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              className="profile-input"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" className="profile-btn">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  )
}
