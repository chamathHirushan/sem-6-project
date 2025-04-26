import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import {useAuth} from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Works() {
      const [backendData, setBackendData] = useState<string>("Loading...");
      const {user} = useAuth();
      const navigate = useNavigate();
    
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
        <p>Works page content goes here.</p>
        <button onClick={() => navigate("/")}>Go to dashboard</button>
        <p>{backendData}</p>
      </>
    );
  }

