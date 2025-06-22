import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "../../assets/users.png";

interface UserProfile {
  profilePicUrl: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  town: string;
  lastActive: string;
  joinedDate: string;
}

const fetchUserProfile = async (): Promise<UserProfile> => {
  await new Promise((res) => setTimeout(res, 500));
  return {
    profilePicUrl: "https://i.pinimg.com/236x/dd/f0/11/ddf0110aa19f445687b737679eec9cb2.jpg",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    town: "Colombo",
    lastActive: "2025-06-20 16:45",
    joinedDate: "2023-01-15",
  };
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);

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

  if (!user) return <div>Loading profile...</div>;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #205781, #4F959D, #98D2C0, #F6F8D5)",
        padding: "2rem",
        color: "#333",
      }}
    >
      {/* Left Side - Profile Pic & Nav */}
      <div
        style={{
          width: "350px",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "2rem 1rem",
          marginRight: "0.2rem",
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
            border: "4px solid black",
          }}
        >
          <label htmlFor="profile-upload" style={{ cursor: "pointer" }}>
            <img
              src={user.profilePicUrl || defaultProfilePic}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
          style={{ marginTop: "1rem", background: "none", border: "none", color: "#205781", cursor: "pointer" }}
        >
          <h2>Profile Information</h2>
        </button>
        <button
          onClick={() => navigate("/myjobs")}
          style={{ marginTop: "0.5rem", background: "none", border: "none", color: "#205781", cursor: "pointer" }}
        >
          <h2>My Jobs</h2>
        </button>
        <button
          onClick={() => navigate("/myfields")}
          style={{ marginTop: "0.5rem", background: "none", border: "none", color: "#205781", cursor: "pointer" }}
        >
          <h2>My Subscriptions</h2>
        </button>
      </div>

      {/* Right Side - Profile Info */}
      <div
        style={{
          flex: 1,
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "4rem",
          maxWidth: "100%",
        }}
      >
        {activeTab === "details" && (
          <>
            <h2 style={{ color: "#205781", marginBottom: "1.5rem" }}>Profile Information</h2>

            {/* First & Last Name */}
            <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem" }}>
              <div style={{ flex: 1, ...fieldContainerStyle }}>
                <label style={labelStyle}>First Name</label>
                <input
                  value={user.firstName}
                  onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  disabled={!isEditing}
                  style={{
                    ...inputBaseStyle,
                    backgroundColor: isEditing ? "#fff" : "transparent",
                    borderColor: isEditing ? "#ccc" : "transparent",
                    cursor: isEditing ? "text" : "default",
                  }}
                />
              </div>
              <div style={{ flex: 1, ...fieldContainerStyle }}>
                <label style={labelStyle}>Last Name</label>
                <input
                  value={user.lastName}
                  onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                  disabled={!isEditing}
                  style={{
                    ...inputBaseStyle,
                    backgroundColor: isEditing ? "#fff" : "transparent",
                    borderColor: isEditing ? "#ccc" : "transparent",
                    cursor: isEditing ? "text" : "default",
                  }}
                />
              </div>
            </div>

            {/* Phone & Email */}
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
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                    cursor: "default",
                    color: "#555",
                  }}
                />
              </div>
            </div>

            {/* Last Active & Town */}
            <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem" }}>
              <div style={{ flex: 1, ...fieldContainerStyle }}>
                <label style={labelStyle}>Last Active</label>
                <input
                  value={user.lastActive}
                  disabled
                  style={{
                    ...inputBaseStyle,
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                    cursor: "default",
                    color: "#555",
                  }}
                />
              </div>
              <div style={{ flex: 1, ...fieldContainerStyle }}>
                <label style={labelStyle}>Town</label>
                <input
                  value={user.town}
                  onChange={(e) => setUser({ ...user, town: e.target.value })}
                  disabled={!isEditing}
                  style={{
                    ...inputBaseStyle,
                    backgroundColor: isEditing ? "#fff" : "transparent",
                    borderColor: isEditing ? "#ccc" : "transparent",
                    cursor: isEditing ? "text" : "default",
                  }}
                />
              </div>
            </div>

            {/* Buttons */}
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