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
  const [searchTerm, setSearchTerm] = useState("");
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
    { label: "Technicians", subItems: [
      "AC Repairs", "CCTV", "Constructions", "Electricians", "Electronic Repairs", "Glass & Aluminium", "Iron Works",
      "Masonry", "Odd Jobs", "Pest Controllers", "Plumbing", "Wood Works"
    ]},
    { label: "Vehicles", subItems: [
      "Auto Mechanic", "Car Wash", "Delivery", "Drivers", "Spare Parts", "Transport", "Vehicle Rental"
    ]},
    { label: "IT", subItems: [
      "Computer Repairs", "Data Entry", "Design & Creative", "Phone Repairs", "Telecommunication", "Web, Mobile & Software"
    ]},
    { label: "Professional", subItems: [
      "Accountancy", "Arts & Crafts", "Hotels & Hospitality", "IT Consultancy", "Insurance Agents", "Legal Advice",
      "Loan Brokers", "Modeling", "Security", "Travel Agents", "Tuition"
    ]},
    { label: "Personalised Services", subItems: [
      "Caretaker / Home Nurse", "Caretakers", "Fitness Training", "Housemaids", "Sports"
    ]},
    { label: "Printing", subItems: [   
      "Printing", "T Shirts & Caps", "Type Setting"
    ]},
    { label: "House", subItems: [
      "Architects", "Boarding Places", "House Painting", "House Rental", "House/Office Cleaning", "Interior Design", "Landscaping"
    ]},
    { label: "Beauty & Event", subItems: [
      "Advertising & promotions", "Audio Hires", "Band, DJ & dancing", "Band, DJ & dancing", "Beauty Salon", "Catering & Food",
      "Dress Makers","Event Planners", "Flowers & Decos", "Health & Beauty Spa", "Photography", "Videography"] },
    { label: "Other", subItems: ["Other"] },
  ];



  const [tasks, setTasks] = useState([
    {
      id: "J133",
      image: jobImage,
      title: "Plumbing Services Near Galle Town and all house services that you need to repair your drainage system",
      location: "Galle",
      daysPosted: 3,
      taskType: "Plumbing",
      budget: 100,
      isBookmarked: true,
      isUrgent: false,
      isTrending: true,
    },
    {
      id: "J134",
      image: jobImage,
      title: "Painting Houses and Offices",
      location: "Colombo-7",
      daysPosted: 3,
      taskType: "Painting",
      budget: 100,
      isBookmarked: true,
      isUrgent: true,
      isTrending: true,
    },
    {
      id: "J135",
      image: jobImage,
      title: "Computer Repair, IT Support, and Networking",
      location: "Negombo",
      daysPosted: 3,
      taskType: "Repair",
      budget: 100,
      isBookmarked: true,
      isUrgent: true,
      isTrending: false,
    },
    {
      id: "J136",
      image: jobImage,
      title: "Shoe Repair & Polishing",
      location: "Matara",
      daysPosted: 3,
      taskType: "Repair",
      budget: 100,
      isBookmarked: true,
      isUrgent: false,
      isTrending: false,
    },
    {
      id: "J137",
      image: jobImage,
      title: "Cupboard Repair & Polishing",
      location: "Anuradhapura",
      daysPosted: 3,
      taskType: "Woodwork",
      budget: 100,
      isBookmarked: true,
      isUrgent: false,
      isTrending: false,
    },
    {
      id: "J138",
      image: jobImage,
      title: "Car, Bike, and Vehicle Repair",
      location: "Jaffna",
      daysPosted: 3,
      taskType: "Repair",
      budget: 100,
      isBookmarked: true,
      isUrgent: true,
      isTrending: false,
    },
  ]);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.taskType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleBookmark = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isBookmarked: !task.isBookmarked } : task
      )
    );
  };


return (
  <div style={{ display: "flex" }}>
    <SideMenu 
      menuItems={menuItems}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm} 
    />
    
    <div style={{ padding: "20px", width: "100%", display: "flex", flexDirection: "column" }}>
  
    {/* Header bar. It includes total tasks found result & grid/table view buttons*/}
    <div className="flex justify-between items-center mb-5 bg-gray-200 rounded-lg">
        <h2 style={{ fontSize: "16px", padding: "8px 16px" }}>
        <strong>{filteredTasks.length}</strong> tasks found.
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
            justifyItems: viewMode === "grid" ? "unset" : "center",
            flexWrap: viewMode === "list" ? "wrap" : undefined,
            flexDirection: "column",
            justifyContent: viewMode === "list" ? "center" : undefined,
            width: viewMode === "list" ? "100%" : "100%",
            margin: viewMode === "list" ? "0 auto" : undefined,
          }}
        >
        {filteredTasks.map((task, index) => (
          <TaskTile
            key={`${task.id}_${index}`}
            {...task}
            view={viewMode}
            onBookmarkToggle={toggleBookmark}
            budget={String(task.budget)}
          />
        ))}
      </div>
    </div>

    </div>
  </div>
);
}

