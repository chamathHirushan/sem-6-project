import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "../../assets/users.png";
import { toast } from "react-toastify";
import PaymentButton from "../../components/payhere";
import { useAuth } from "../../contexts/AuthContext";


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
    joinedDate: "2025-06-12",
  };
};

const fetchMydata = async (user): Promise<UserProfile> => {
    console.log("User data:", user);
    return {
      profilePicUrl: user?.profile_picture
 || "https://i.pinimg.com/236x/dd/f0/11/ddf0110aa19f445687b737679eec9cb2.jpg",
      firstName: user?.name,
      lastName: "-",
      email: user?.email || "chamath@gmail.com",
      phone: user.phone || "+94123456789",
      town: "Kandy",
      lastActive: "2025-06-20 17:00",
      joinedDate: "2025-15-31",
    };
  };

interface ProfileProps {
  my?: boolean;
}

export default function Profile({ my = true }: ProfileProps) {
  const navigate = useNavigate();
  const [user_, setUser] = useState<UserProfile | null>(null);
  const { user, userLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [premium, setPremium] = useState("");
  
  const boostTypes = [
    { label: "Standard Boost", value: 1 },
    { label: "Premium Boost", value: 2 },
  ];

  useEffect(() => {
    const loadUser = async () => {
      let data;
      if (!my) {
        data = await fetchUserProfile();
      } else {
        data = await fetchMydata(user);
      }
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
  
  const hadndleSubmit = async () => {
    //payment gateway
    localStorage.setItem("premium", JSON.stringify(premium));
  }

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

  if (!user_) return <div>Loading profile...</div>;

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
              src={user_.profilePicUrl || defaultProfilePic}
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
          onClick={() => navigate("/my-jobs")}
          style={{ marginTop: "0.5rem", background: "none", border: "none", color: "#205781", cursor: "pointer" }}
        >
          <h2>My Jobs</h2>
        </button>
        {/* <button
          onClick={() => navigate("/myfields")}
          style={{ marginTop: "0.5rem", background: "none", border: "none", color: "#205781", cursor: "pointer" }}
        >
          <h2>My Subscriptions</h2>
        </button> */}
        <br/>
        <div className="mb-3">
        <label className="block mb-1 font-medium">Upgrade to premium</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={premium}
                    onChange={e => setPremium(e.target.value)}
                  >
                    <option value="">Select boost type</option>
                   {boostTypes.map((item, index) => (
                      <option key={index} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

      {/* <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
      <button
          onClick={() => hadndleSubmit()}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#205781",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Upgrade
        </button> */}
        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <PaymentButton name="upgrade" value="400.00" itemname="Monthly subscription" onSubmit={() => hadndleSubmit()}/>
        </div>
      </div>


      {/* Right Side - Profile Info */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#F6F8D5",
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
                  value={user_.firstName}
                  onChange={(e) => setUser({ ...user_, firstName: e.target.value })}
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
                  value={user_.lastName}
                  onChange={(e) => setUser({ ...user_, lastName: e.target.value })}
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
                  value={user_.phone}
                  onChange={(e) => setUser({ ...user_, phone: e.target.value })}
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
                  value={user_.email}
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
                <label style={labelStyle}>Account Created On</label>
                <input
                  value={user_.joinedDate}
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
                  value={user_.town}
                  onChange={(e) => setUser({ ...user_, town: e.target.value })}
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