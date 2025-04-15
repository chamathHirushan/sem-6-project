import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { useNavigate } from "react-router-dom";

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
    <>
      <p>{backendData}</p>
      <button onClick={() => navigate("/login")}>Go to Login</button>
    </>
  );
}
