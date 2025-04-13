import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

export default function LandingPage() {
  const [backendData, setBackendData] = useState<string>("Loading...");

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

  return <p>{backendData}</p>;
}
