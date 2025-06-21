import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "../../assets/users.png";

interface UserProfile {
  profilePicUrl: string | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
}

const fetchUserProfile = async (): Promise<UserProfile> => {
  await new Promise((res) => setTimeout(res, 500));

  return {
    profilePicUrl: null,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    address: "123 Main Street, City, Country",
    joinedDate: "2023-01-15",
  };
};

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    const loadUser = async () => {
      const data = await fetchUserProfile();
      setUser(data);
    };
    loadUser();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUser((prev) =>
        prev ? { ...prev, profilePicUrl: URL.createObjectURL(e.target.files![0]) } : prev
      );
    }
  };

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/login");
  };

  const fieldContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1.5rem",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: "bold",
    marginBottom: "0.3rem",
    color: "#205781",
  };

  const inputBaseStyle: React.CSSProperties = {
    padding: "0.5rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    color: "#333",
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(to right, #205781, #F6F8D5)",
        padding: "2rem",
        color: "#333",
      }}
    >
      {/* Left side - Profile Picture and Navigation */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#4F959D",
          borderRadius: "32px",
          padding: "2rem 1rem",
          marginRight: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "4px solid #98D2C0",
          }}
        >
          <label htmlFor="profile-upload" style={{ cursor: "pointer" }}>
            <img
              src={user.profilePicUrl || defaultProfilePic}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.3s",
                color: "#F6F8D5",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
              className="hover-overlay"
            >
              + Add Photo
            </div>
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>

        <button
          onClick={() => setActiveTab("details")}
          style={{ marginTop: "1rem", background: "none", border: "none", color: "#F6F8D5", cursor: "pointer" }}
        >
          <h2>Profile Information</h2>
        </button>
        <button
          onClick={() => navigate("/myjobs")}
          style={{ marginTop: "0.5rem", background: "none", border: "none", color: "#F6F8D5", cursor: "pointer" }}
        >
          <h2>My Jobs</h2>
        </button>
        <button
          onClick={() => navigate("/myfields")}
          style={{ marginTop: "0.5rem", background: "none", border: "none", color: "#F6F8D5", cursor: "pointer" }}
        >
          <h2>My Subscriptions</h2>
        </button>
      </div>

      {/* Right side - Information */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#98D2C0",
          borderRadius: "16px",
          padding: "2rem",
          maxWidth: "100%",
        }}
      >
        {activeTab === "details" && (
          <>
            <h2 style={{ color: "#205781", marginBottom: "1.5rem" }}>Profile Information</h2>

            <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem" }}>
              <div style={{ flex: 1, ...fieldContainerStyle }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  disabled={!isEditing}
                  style={{
                    ...inputBaseStyle,
                    backgroundColor: isEditing ? "#fff" : "transparent",
                    borderColor: isEditing ? "#ccc" : "transparent",
                    outline: isEditing ? undefined : "none",
                    cursor: isEditing ? "text" : "default",
                  }}
                />
              </div>

              <div style={{ flex: 1, ...fieldContainerStyle }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  value={user.email}
                  disabled
                  style={{
                    ...inputBaseStyle,
                    borderColor: "transparent",
                    cursor: "default",
                    color: "#555",
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem" }}>
              <div style={{ flex: 1, ...fieldContainerStyle }}>
                <label style={labelStyle}>Phone Number</label>
                <input
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  disabled={!isEditing}
                  style={{
                    ...inputBaseStyle,
                    backgroundColor: isEditing ? "#fff" : "transparent",
                    borderColor: isEditing ? "#ccc" : "transparent",
                    outline: isEditing ? undefined : "none",
                    cursor: isEditing ? "text" : "default",
                  }}
                />
              </div>

              <div style={{ flex: 1, ...fieldContainerStyle }}>
                <label style={labelStyle}>Joined Date</label>
                <input
                  value={user.joinedDate}
                  disabled
                  style={{
                    ...inputBaseStyle,
                    borderColor: "transparent",
                    cursor: "default",
                    color: "#555",
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Address</label>
              <textarea
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                disabled={!isEditing}
                rows={3}
                style={{
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: isEditing ? "1px solid #ccc" : "1px solid transparent",
                  backgroundColor: isEditing ? "#fff" : "transparent",
                  resize: "none",
                  color: "#333",
                  fontSize: "1rem",
                  cursor: isEditing ? "text" : "default",
                }}
              />
            </div>

            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
              {isEditing ? (
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#205781",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#FFA500",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              )}

              <button
                onClick={handleLogout}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
