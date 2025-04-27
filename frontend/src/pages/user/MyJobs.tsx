import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import {useAuth} from "../../contexts/AuthContext";
import SideMenu from "../../components/SideMenu/SideMenu";
import JobTile from "../../components/JobTile/JobTile";


export default function MyJobs() {
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

      const menuItems = [
        { label: "House", subItems: ["Painting", "Plumbing", "Electrical"] },
        { label: "Office", subItems: ["Cleaning", "IT Support", "Security"] },
        { label: "Freelance", subItems: ["Writing", "Graphic Design", "Web Development"] },
        { label: "Other", subItems: ["Miscellaneous"] },
      ];

      const [jobs, setJobs] = useState([
        {
          id: "J123",
          image: "https://via.placeholder.com/150",
          address: "123 Main St, New York, NY",
          daysPosted: 3,
          jobType: "Full-Time",
          isBookmarked: false,
        },
        {
          id: "J124",
          image: "https://via.placeholder.com/150",
          address: "456 Elm St, Los Angeles, CA",
          daysPosted: 7,
          jobType: "Part-Time",
          isBookmarked: true,
        },
      ]);

      const toggleBookmark = (id: string) => {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === id ? { ...job, isBookmarked: !job.isBookmarked } : job
          )
        );
      };

    return (
      <div style={{ display: "flex" }}>
        <SideMenu menuItems={menuItems} />
        <div style={{ marginLeft: "270px", padding: "20px", width: "100%" }}>
      
        {/* Header bar. It includes total jobs found result & grid/table view buttons*/}
        <div>
            <h2 style={{ fontSize: "16px", marginBottom: "20px" }}>
            <strong>{jobs.length}</strong> jobs found.
            </h2>

            

        </div>

        <div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {jobs.map((job) => (
              <JobTile
                key={job.id}
                {...job}
                view="portrait" // Change to "landscape" for table view
                onBookmarkToggle={toggleBookmark}
              />
            ))}
          </div>
        </div>

        </div>
      </div>
    );
  }

