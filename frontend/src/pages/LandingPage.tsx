import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-removed.png";

export default function LandingPage() {
  const [backendData, setBackendData] = useState<string>("Loading...");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiClient.get("/");
        setBackendData(response.message || "No data received");
      } catch (error) {
        setBackendData("Error fetching data");
        console.error("API Error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "5rem",
        background: "linear-gradient(to bottom right, #205781, #4F959D, #98D2C0, #F6F8D5)",
        color: "#fff",
        textAlign: "center",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <h1>Welcome to</h1>

    <img
        src={logo}
        alt="Sewa.lk Logo"
        style={{
            width: "400px",
            height: "auto",
            margin: "20px auto",
            display: "block"
        }}
    />

      <p>{backendData}</p>
      <button
        onClick={() => navigate("/login")}
        style={{
          marginTop: "1rem",
          padding: "0.7rem 1.2rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#205781",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        Enter Site
      </button>

      <div
        style={{
        backgroundColor: "rgba(18, 61, 94, 0.43)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        padding: "1.5rem",
        borderRadius: "12px",
        margin: "20px auto",
        maxWidth: "auto",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", 
        color: "#fff",
        }}
      >
        <h2>What is Sewa.lk?</h2>
        <p>
          Sewa.lk is a Sri Lankan online platform dedicated to connecting job seekers with employers across various industries. 
          It focuses on making the job search process easier and more accessible by offering curated job listings, filtering tools, 
          and employer insights. Whether you're seeking your first job or looking to take the next step in your career, 
          Sewa.lk aims to support you with a reliable and user-friendly job-finding experience tailored for the Sri Lankan workforce.
        </p>
      </div>

      <div
        style={{
        backgroundColor: "rgba(18, 61, 94, 0.43)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        padding: "1.5rem",
        borderRadius: "12px",
        margin: "20px auto",
        maxWidth: "auto",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", 
        color: "#fff",
        }}
      >
        <h2>Why use Sewa.lk?</h2>
        <p>
          Sewa.lk is your trusted platform to connect with the right job opportunities across Sri Lanka.
          Whether you're a fresh graduate or an experienced professional, Sewa.lk simplifies the job search
          by offering personalized listings, employer insights, and smart filtering options to help you
          find your next career move efficiently.
        </p>
      </div>

    </div>
  );
};
