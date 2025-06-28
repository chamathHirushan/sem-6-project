import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
// import {useAuth} from "../../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
import SideMenu from "../../components/SideMenu/SideMenu";
import TaskTile from "../../components/TaskTile/TaskTile";
import {Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/solid";
import jobImage from "../../assets/get-a-job-with-no-experience.png"
import { useSearchParams, useLocation } from "react-router-dom";
import {getAllAvailableServices} from "../../api/userAPI";
import jobImage3 from "../../assets/s3.jpeg"
import jobImage2 from "../../assets/s2.jpeg"
import jobImage1 from "../../assets/s1.jpeg"
import jobImage4 from "../../assets/s4.jpeg"
import jobImage5 from "../../assets/s5.jpeg"
import jobImage6 from "../../assets/s6.jpeg"
import jobImage7 from "../../assets/19.jpeg"

export default function Hires() {
  const [backendData, setBackendData] = useState<string>("Loading...");
  // const {user} = useAuth();
  // const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);
  const [selectedSubItems, setSelectedSubItems] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultView = (searchParams.get("view") as "grid" | "list") || "grid";
  const [viewMode, setViewMode] = useState<"grid" | "list">(defaultView);
  const location = useLocation();


  // When user changes view, update URL param too
  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    setSearchParams({ view: mode });  // Updates the URL
  };
  
  const handleSubItemSelect = (subItem: string) => {
    if (!selectedSubItems.includes(subItem)) {
      setSelectedSubItems((prev) => [...prev, subItem]);
    }
  };
  
  const clearSelectedSubItem = (subItem: string) => {
    setSelectedSubItems((prev) => prev.filter((item) => item !== subItem));
  };
  
  const clearAllSelectedSubItems = () => {
    setSelectedSubItems([]);
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
        const fetchedServices = await getAllAvailableServices();
        setTasks(fetchedServices);
      } catch (error) {
        //setTasks(fetchedServices);
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

  interface Task {
    id: string;
    title: string;
    category: string;
    subCategory: string;
    image: string;
    location: string;
    daysPosted: number;
    taskType?: string;
    budget?: number;
    isUrgent: boolean;
    isTrending?: boolean;
    isBookmarked: boolean;
  }

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "J133",
      image: jobImage1,
      category: "Plumbing",
      subCategory: "Plumbing",
      title: "Plumbing Services Near Galle Town and all house services that you need to repair your drainage system",
      location: "Galle",
      daysPosted: 3,
      taskType: "Plumbing",
      budget: 100,
      isBookmarked: false,
      isUrgent: false,
      isTrending: true,
    },
    {
      id: "J134",
      image: jobImage2,
      category: "Painting",
      subCategory: "House Painting",
      title: "Painting Houses and Offices",
      location: "Colombo-7",
      daysPosted: 3,
      taskType: "Painting",
      budget: 100,
      isBookmarked: false,
      isUrgent: true,
      isTrending: true,
    },
    {
      id: "J135",
      image: jobImage3,
      category: "IT Support",
      subCategory: "Computer Repair",
      title: "Computer Repair, IT Support, and Networking",
      location: "Negombo",
      daysPosted: 3,
      taskType: "Repair",
      budget: 100,
      isBookmarked: false,
      isUrgent: true,
      isTrending: false,
    },
    {
      id: "J136",
      image: jobImage4,
      category: "Repairings",
      subCategory: "Bag Repair",
      title: "බෑග්, Shoes අලුත්වැඩියා කිරීම",
      location: "Matara",
      daysPosted: 3,
      taskType: "Repair",
      budget: 100,
      isBookmarked: false,
      isUrgent: false,
      isTrending: false,
    },
    {
      id: "J137",
      image: jobImage5,
      category: "Woodwork",
      subCategory: "Cupboard Repair",
      title: "Cupboard Repair & Polishing",
      location: "Anuradhapura",
      daysPosted: 3,
      taskType: "Woodwork",
      budget: 100,
      isBookmarked: false,
      isUrgent: false,
      isTrending: false,
    },
    {
      id: "J138",
      image: jobImage6,
      category: "Vehicle Repair",
      subCategory: "Car, Bike, and Vehicle Repair",
      title: "Car, Bike, and Vehicle Repair",
      location: "Anuradapura, Sri Lanka",
      daysPosted: 3,
      taskType: "Repair",
      budget: 100,
      isBookmarked: false,
      isUrgent: true,
      isTrending: false,
    },
  ]);

        useEffect(() => {
        const initialize = () => {
          setTimeout(() => {
            setTasks((prevJobs) => {
              if (prevJobs.some(job => job.id === "J199")) {
                return prevJobs;
              }
              return [
                ...prevJobs,
                  {
                  id: "J199",
                  image: jobImage7,
                  category: "Technicians",
                  subCategory: "Electricians",
                  title: "Wiring & Socket Repair",
                  location: "Kandy",
                  daysPosted: 2,
                  taskType: "Cleaning",
                  budget: 150,
                  isBookmarked: false,
                  isUrgent: true,
                  isTrending: true,
                }
              ];
            });
          }, 1500); // 1.5 seconds delay
        };

        window.addEventListener("addService", initialize);

        return () => {
          window.removeEventListener("addService", initialize);
        };
      }, []);


  const filteredTasks = tasks.filter((task) => {
    if (selectedSubItems.length > 0) {
      return selectedSubItems
        .map((s) => s.toLowerCase())
        .includes(task.subCategory.toLowerCase());
    } else if (searchTerm.trim() !== "") {
      return (
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });


  const toggleBookmark = (id: string) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, isBookmarked: !task.isBookmarked } : task
      );

      // Get current bookmarked tasks from localStorage
      let bookmarkedTasks: Task[] = [];
      const stored = localStorage.getItem("bookmarkedTasks");
      if (stored) {
        try {
          bookmarkedTasks = JSON.parse(stored);
        } catch {
          bookmarkedTasks = [];
        }
      }

      // Find the toggled task
      const toggledTask = updatedTasks.find((task) => task.id === id);
      if (toggledTask) {
        if (toggledTask.isBookmarked) {
          // Add to bookmarks if not already present
          if (!bookmarkedTasks.some((task) => task.id === id)) {
            bookmarkedTasks.push(toggledTask);
          }
        } else {
          // Remove from bookmarks
          bookmarkedTasks = bookmarkedTasks.filter((task) => task.id !== id);
        }
      }

      localStorage.setItem("bookmarkedTasks", JSON.stringify(bookmarkedTasks));
      return updatedTasks;
    });
  };

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);


return (
  <div style={{ display: "flex" }}>
    <SideMenu 
          menuItems={menuItems}
          selectedSubItems={selectedSubItems}
          onSubItemSelect={handleSubItemSelect}
          clearSelectedSubItem={clearSelectedSubItem}
          clearAllSelectedSubItems={clearAllSelectedSubItems}
          searchTerm={searchTerm}
          setSearchTerm={(term) => {
            setSearchTerm(term);
            setCurrentPage(1); // Reset to first page on new search
          }}
          selectedSubItem={null}
          showAdvertisement={true} // Hide advertisement for this page
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

     {/* Main job listing area that takes all remaining height */}
     <div style={{ flex: 1, overflowY: "auto" }}>
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
        {paginatedTasks.map((task, index) => (
          <TaskTile
            key={`${task.id}_${index}`}
            {...task}
            view={viewMode}
            onBookmarkToggle={toggleBookmark}
          />
        ))}
      </div>
    </div>
    
    {/* Tailwind Pagination Controls */}
    <div className="flex justify-between items-center mt-8">
      <div className="text-sm text-gray-600 font-medium">
        {`Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, tasks.length)} of ${tasks.length} Entries`}
      </div>
      
      <div className="flex space-x-1">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-l-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-blue-100 transition ${currentPage === i + 1 ? "bg-cyan-500 text-white font-bold" : "hover:bg-cyan-100"}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-r-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
        >
          Next
        </button>
      </div>
        </div>

    </div>
  </div>
);
}

