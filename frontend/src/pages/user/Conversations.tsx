import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import {useAuth} from "../../contexts/AuthContext";

export default function Conversations() {
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
      <div className="flex flex-col flex-1 px-4 py-6">
        <p>Logged as level {user.role} user</p>
        <p>Conversations page content goes here.</p>
        <p>{backendData}</p>
    </div>
    );
  }

