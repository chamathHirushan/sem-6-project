import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../api/client";
import Logout from "../components/Logout";

export default function AdminDashboard() {
    const [backendData, setBackendData] = useState<string>("Loading...");
      const {user} = useAuth();
    
      useEffect(() => {
        async function fetchData() {
          try {
            const response = await apiClient.get("/admin/dashboard");
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
        <p>Logged as level {user.role} user</p>
        <p>{backendData}</p>
        <Logout/>
      </>
    );
  }