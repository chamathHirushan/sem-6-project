import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
// import {useAuth} from "../../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
import SideMenu from "../../components/SideMenu/SideMenu";
import TaskTile from "../../components/TaskTile/TaskTile";
import {Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/solid";
import jobImage from "../../assets/get-a-job-with-no-experience.png"
import { useSearchParams, useLocation } from "react-router-dom";

export default function Hires() {
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

  const [tasks, setTasks] = useState([
    {
      id: "J133",
      image: jobImage,
      address: "133 Main St, New York, NY",
      daysPosted: 3,
      taskType: "Full-Time",
      isBookmarked: false,
    },
    {
      id: "J134",
      image: jobImage,
      address: "456 Elm St, Los Angeles, CA",
      daysPosted: 7,
      taskType: "Part-Time",
      isBookmarked: true,
    },
    {
      id: "J135",
      image: jobImage,
      address: "456 Elm St, Los Angeles, CA",
      daysPosted: 7,
      taskType: "Part-Time",
      isBookmarked: true,
    },
    {
      id: "J136",
      image: jobImage,
      address: "456 Elm St, Los Angeles, CA",
      daysPosted: 7,
      taskType: "Part-Time",
      isBookmarked: true,
    },
    {
      id: "J137",
      image: jobImage,
      address: "456 Elm St, Los Angeles, CA",
      daysPosted: 7,
      taskType: "Part-Time",
      isBookmarked: true,
    },
    {
      id: "J138",
      image: jobImage,
      address: "456 Elm St, Los Angeles, CA",
      daysPosted: 7,
      taskType: "Part-Time",
      isBookmarked: true,
    },
  ]);

  const toggleBookmark = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isBookmarked: !task.isBookmarked } : task
      )
    );
  };


return (
  <div style={{ display: "flex" }}>
    <SideMenu menuItems={menuItems} />
    <div style={{ marginLeft: "270px", padding: "20px", width: "100%" }}>
  
    {/* Header bar. It includes total tasks found result & grid/table view buttons*/}
    <div className="flex justify-between items-center mb-5">
        <h2 style={{ fontSize: "16px" }}>
          <strong>{tasks.length}</strong> tasks found.
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
            <ListBulletIcon className="w-5 h-5"/>
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
        {tasks.map((task) => (
          <TaskTile
            key={task.id}
            {...task}
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

