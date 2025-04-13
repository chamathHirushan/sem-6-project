import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

export default function LandingPage() {
  const [backendData, setBackendData] = useState<string>("Loading...");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiClient.get("/admin/new"); // Replace with actual API endpoint
        setBackendData(response.message || "No data received"); // Adjust based on API response
      } catch (error) {
        setBackendData("Error fetching data");
        console.error("API Error:", error);
      }
    }

    fetchData();
  }, []);

  return <p>{backendData}</p>;
}
