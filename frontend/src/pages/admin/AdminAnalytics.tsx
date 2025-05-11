import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { apiClient } from "../../api/client";
import PerformanceCard from "../../components/PerformanceCard";
import usersImg from "../../assets/users.png";

export default function AdminAnalytics() {
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
        <div className="flex flex-wrap gap-5 mb-5 justify-start">
                {/* Each card container */}
                <div className="flex-grow min-w-[250px] max-w-[calc(33%-1.25rem)] flex-1">
                  <PerformanceCard
                    img={usersImg}
                    title={"text9"}
                    value={10}
                    Info={"text15"}
                    isFiltered={false}
                    noDataText={"text31"}
                    displayTooltip={true}
                  />
                </div>
            </div>
        <p>Logged as level {user.role} user</p>
        <p>Admin Analytics page content goes here.</p>
        <p>{backendData}</p>
      </>
    );
  }