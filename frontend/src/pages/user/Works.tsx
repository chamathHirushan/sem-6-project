import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
// import {useAuth} from "../../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
import SideMenu from "../../components/SideMenu/SideMenu";
import JobTile from "../../components/JobTile/JobTile";
import {Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/solid";
import jobImage from "../../assets/get-a-job-with-no-experience.png"
import { useSearchParams, useLocation } from "react-router-dom";


export default function Works() {
      const [backendData, setBackendData] = useState<string>("Loading...");
      // const {user} = useAuth();
      // const navigate = useNavigate();
      const [searchParams, setSearchParams] = useSearchParams();
      const defaultView = (searchParams.get("view") as "grid" | "list") || "grid";
      const [viewMode, setViewMode] = useState<"grid" | "list">(defaultView);
      const location = useLocation();

      // When user changes view, update URL param too
      const handleViewChange = (mode: "grid" | "list") => {
        setViewMode(mode);
        setSearchParams({ view: mode });  // Updates the URL
      };
      
      useEffect(() => {
        // Restore scroll position if available
        console.log("Restoring scroll position: ", location.state?.scrollPosition);
        if (location.state?.scrollPosition !== undefined) {
          console.log("Restoring scroll to:", location.state.scrollPosition);
          setTimeout(() => {
            window.scrollTo(0, location.state.scrollPosition);
          }, 0);
        } else {
          console.log("No scroll position to restore.");
        }
      }, []);


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
          title: "Software Engineer",
          image: jobImage,
          location: "123 Main St, New York, NY",
          daysPosted: 3,
          jobType: "Full-Time",
          budget: 5000,
          isUrgent: true,
          isTrending: true,
          isBookmarked: false,
        },
        {
          id: "J124",
          title: "Data Analyst",
          image: jobImage,
          location: "456 Elm St, Los Angeles, CA",
          daysPosted: 7,
          jobType: "Part-Time",
          budget: 5000,
          isUrgent: true,
          isTrending: true,
          isBookmarked: true,
        },
        {
          id: "J125",
          title: "Web Developer",
          image: jobImage,
          location: "456 Elm St, Los Angeles, CA",
          daysPosted: 7,
          jobType: "Part-Time",
          budget: 5000,
          isUrgent: true,
          isTrending: true,
          isBookmarked: true,
        },
        {
          id: "J126",
          title: "Graphic Designer",
          image: jobImage,
          location: "456 Elm St, Los Angeles, CA",
          daysPosted: 7,
          jobType: "Part-Time",
          budget: 5000,
          isUrgent: true,
          isTrending: true,
          isBookmarked: true,
        },
        {
          id: "J127",
          title: "Project Manager",
          image: jobImage,
          location: "456 Elm St, Los Angeles, CA",
          daysPosted: 7,
          jobType: "Part-Time",
          budget: 5000,
          isUrgent: true,
          isTrending: true,
          isBookmarked: true,
        },
        {
          id: "J128",
          title: "UX/UI Designer",
          image: jobImage,
          location: "456 Elm St, Los Angeles, CA",
          daysPosted: 7,
          jobType: "Part-Time",
          budget: 5000,
          isUrgent: true,
          isTrending: true,
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
        <div className="flex justify-between items-center mb-5">
            <h2 style={{ fontSize: "16px" }}>
              <strong>{jobs.length}</strong> jobs found.
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleViewChange("grid")}
                style={{
                  color: viewMode === "grid" ? 'black' : "gray",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                <Squares2X2Icon className="w-5 h-5"/>
              </button>

              <button
                onClick={() => handleViewChange("list")}
                style={{
                  color: viewMode === "list" ? "black" : "gray",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                <ListBulletIcon className="w-6 h-6"/>
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

