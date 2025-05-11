import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import {useAuth} from "../../contexts/AuthContext";
import SideMenu from "../../components/SideMenu/SideMenu";
import JobTile from "../../components/JobTile/JobTile";
import { BsFillGridFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import jobImage from "../../assets/get-a-job-with-no-experience.png"
import { ColorPicker } from "antd";

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
          image: jobImage,
          address: "123 Main St, New York, NY",
          daysPosted: 3,
          jobType: "Full-Time",
          isBookmarked: false,
        },
        {
          id: "J124",
          image: jobImage,
          address: "456 Elm St, Los Angeles, CA",
          daysPosted: 7,
          jobType: "Part-Time",
          isBookmarked: true,
        },
        {
          id: "J124",
          image: jobImage,
          address: "456 Elm St, Los Angeles, CA",
          daysPosted: 7,
          jobType: "Part-Time",
          isBookmarked: true,
        },
        {
          id: "J124",
          image: jobImage,
          address: "456 Elm St, Los Angeles, CA",
          daysPosted: 7,
          jobType: "Part-Time",
          isBookmarked: true,
        },
        {
          id: "J124",
          image: jobImage,
          address: "456 Elm St, Los Angeles, CA",
          daysPosted: 7,
          jobType: "Part-Time",
          isBookmarked: true,
        },
        {
          id: "J124",
          image: jobImage,
          address: "456 Elm St, Los Angeles, CA",
          daysPosted: 7,
          jobType: "Part-Time",
          isBookmarked: true,
        },
      ]);

      const [viewMode, setViewMode] = useState<"grid" | "list">("grid");


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
        <div className="flex justify-between items-center mb-5">
            <h2 style={{ fontSize: "16px" }}>
              <strong>{jobs.length}</strong> jobs found.
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  color: viewMode === "grid" ? 'black' : "gray",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                <BsFillGridFill/>
              </button>

              <button
                onClick={() => setViewMode("list")}
                style={{
                  color: viewMode === "list" ? "black" : "gray",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                <FaThList/>
              </button>
            </div>
        </div>

        <div>
           <div
              style={{
                display: viewMode === "grid" ? "grid" : "flex",
                gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(200px, 1fr))" : undefined,
                gridAutoRows: viewMode === "grid" ? "minmax(200px, auto)" : undefined,
                gap: "12px",
                justifyItems: "center",
                flexWrap: viewMode === "list" ? "wrap" : undefined,
                flexDirection: "column",
                justifyContent: viewMode === "list" ? "center" : undefined,
                width: viewMode === "list" ? "100%" : "100%",
                margin: viewMode === "list" ? "0 auto" : undefined, // <-- Add this line
              }}
            >
            {jobs.map((job) => (
              <JobTile
                key={job.id}
                {...job}
                view={viewMode}
                onBookmarkToggle={toggleBookmark}
              />
            ))}
          </div>
        </div>

        </div>
      </div>
    );
  }

