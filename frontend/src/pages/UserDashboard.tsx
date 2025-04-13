import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import {useAuth} from "../contexts/AuthContext";
import Logout from "../components/Logout";

export default function UserDashboard() {
      const [backendData, setBackendData] = useState<string>("Loading...");
      const {user} = useAuth();
    
      useEffect(() => {
        async function fetchData() {
          try {
            const response = await apiClient.get("/user/dashboard");
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

