import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import {useAuth} from "../../contexts/AuthContext";
import SideMenu from "../../components/SideMenu/SideMenu";
import {Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/solid";
import { useSearchParams,useNavigate, useLocation } from "react-router-dom";
import jobImage from "../../assets/get-a-job-with-no-experience.png"
import TaskTile from "../../components/TaskTile/TaskTile";
import JobTile from "../../components/JobTile/JobTile";


export default function Fav() {
    const [backendData, setBackendData] = useState<string>("Loading...");
    const {user} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedSubItems, setSelectedSubItems] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultView = (searchParams.get("view") as "grid" | "list") || "grid";
    const [viewMode, setViewMode] = useState<"grid" | "list">(defaultView);
    const [activeTab, setActiveTab] = useState<"jobs" | "tasks">("tasks");


    interface Job {
      id: string;
      title: string;
      category: string;
      subCategory: string;
      image: string;
      location: string;
      daysPosted: number;
      jobType: string;
      budget: number;
      isUrgent: boolean;
      isTrending: boolean;
      isBookmarked: boolean;
    }
    
    const [jobs, setJobs] = useState<Job[]>([
      // {
      //   id: "J123",
      //   title: "Software Engineer",
      //   category: "IT",
      //   subCategory: "Web, Mobile & Software",
      //   image: jobImage,
      //   location: "123 Main St, New York, NY",
      //   daysPosted: 3,
      //   jobType: "Full-Time",
      //   budget: 5000,
      //   isUrgent: true,
      //   isTrending: true,
      //   isBookmarked: false,
      // },
      // {
      //   id: "J124",
      //   title: "Data Analyst",
      //   category: "IT",
      //   subCategory: "Data Entry",
      //   image: jobImage,
      //   location: "456 Elm St, Los Angeles, CA",
      //   daysPosted: 7,
      //   jobType: "Part-Time",
      //   budget: 5000,
      //   isUrgent: true,
      //   isTrending: true,
      //   isBookmarked: true,
      // },
      // {
      //   id: "J125",
      //   title: "Web Developer",
      //   category: "IT",
      //   subCategory: "Web, Mobile & Software",
      //   image: jobImage,
      //   location: "456 Elm St, Los Angeles, CA",
      //   daysPosted: 7,
      //   jobType: "Part-Time",
      //   budget: 5000,
      //   isUrgent: true,
      //   isTrending: true,
      //   isBookmarked: true,
      // },
      // {
      //   id: "J126",
      //   title: "Graphic Designer",
      //   category: "IT",
      //   subCategory: "Design & Creative",
      //   image: jobImage,
      //   location: "456 Elm St, Los Angeles, CA",
      //   daysPosted: 7,
      //   jobType: "Part-Time",
      //   budget: 5000,
      //   isUrgent: true,
      //   isTrending: true,
      //   isBookmarked: true,
      // },
      // {
      //   id: "J127",
      //   title: "Project Manager",
      //   category: "Professional",
      //   subCategory: "IT Consultancy",
      //   image: jobImage,
      //   location: "456 Elm St, Los Angeles, CA",
      //   daysPosted: 7,
      //   jobType: "Part-Time",
      //   budget: 5000,
      //   isUrgent: true,
      //   isTrending: true,
      //   isBookmarked: true,
      // },
    ]);


    interface Task {
      id: string;
      title: string;
      category: string;
      subCategory: string;
      image: string;
      location: string;
      daysPosted: number;
      taskType: string;
      budget: number;
      isUrgent: boolean;
      isTrending: boolean;
      isBookmarked: boolean;
    }

    useEffect(() => {
      // Reset filters when view mode changes
      const stored = localStorage.getItem("bookmarkedTasks");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
        setTasks(parsed);
          }
        } catch (e) {
          console.error("Failed to parse bookmarkedTasks from localStorage", e);
        }
      }

      const stored1 = localStorage.getItem("bookmarkedJobs");
      if (stored1) {
        try {
          const parsed = JSON.parse(stored1);
          if (Array.isArray(parsed)) {
        setJobs(parsed);
          }
        } catch (e) {
          console.error("Failed to parse bookmarkedJobs from localStorage", e);
        }
      }
    },[]);

    const [tasks, setTasks] = useState<Task[]>([
      // {
      //   id: "J133",
      //   image: jobImage,
      //   category: "Plumbing",
      //   subCategory: "Plumbing",
      //   title: "Plumbing Services Near Galle Town and all house services that you need to repair your drainage system",
      //   location: "Galle",
      //   daysPosted: 3,
      //   taskType: "Plumbing",
      //   budget: 100,
      //   isBookmarked: true,
      //   isUrgent: false,
      //   isTrending: true,
      // },
      // {
      //   id: "J134",
      //   image: jobImage,
      //   category: "Painting",
      //   subCategory: "House Painting",
      //   title: "Painting Houses and Offices",
      //   location: "Colombo-7",
      //   daysPosted: 3,
      //   taskType: "Painting",
      //   budget: 100,
      //   isBookmarked: true,
      //   isUrgent: true,
      //   isTrending: true,
      // },
      // {
      //   id: "J135",
      //   image: jobImage,
      //   category: "IT Support",
      //   subCategory: "Computer Repair",
      //   title: "Computer Repair, IT Support, and Networking",
      //   location: "Negombo",
      //   daysPosted: 3,
      //   taskType: "Repair",
      //   budget: 100,
      //   isBookmarked: true,
      //   isUrgent: true,
      //   isTrending: false,
      // },
      // {
      //   id: "J136",
      //   image: jobImage,
      //   category: "Shoe Repair",
      //   subCategory: "Shoe Polishing",
      //   title: "Shoe Repair & Polishing",
      //   location: "Matara",
      //   daysPosted: 3,
      //   taskType: "Repair",
      //   budget: 100,
      //   isBookmarked: true,
      //   isUrgent: false,
      //   isTrending: false,
      // },
      // {
      //   id: "J137",
      //   image: jobImage,
      //   category: "Woodwork",
      //   subCategory: "Cupboard Repair",
      //   title: "Cupboard Repair & Polishing",
      //   location: "Anuradhapura",
      //   daysPosted: 3,
      //   taskType: "Woodwork",
      //   budget: 100,
      //   isBookmarked: true,
      //   isUrgent: false,
      //   isTrending: false,
      // },
      // {
      //   id: "J138",
      //   image: jobImage,
      //   category: "Vehicle Repair",
      //   subCategory: "Car, Bike, and Vehicle Repair",
      //   title: "Car, Bike, and Vehicle Repair",
      //   location: "Jaffna",
      //   daysPosted: 3,
      //   taskType: "Repair",
      //   budget: 100,
      //   isBookmarked: true,
      //   isUrgent: true,
      //   isTrending: false,
      // },
    ]);

    const handleJobClick = (jobId: string) => {
      navigate(`/job/${jobId}`, {
        state: {
          from: location,  // track previous route
          scrollPosition: window.scrollY,
        },
      });
    };
    
    const handleTaskClick = (taskId: string) => {
      navigate(`/task/${taskId}`, {
        state: {
          from: location,
          scrollPosition: window.scrollY,
        },
      });
    };

    
    // Generate menuItems from tasks
    const taskMenuItems = Object.values(
      tasks.reduce((acc, task) => {
        if (!acc[task.category]) {
          acc[task.category] = { label: task.category, subItems: [] };
        }
        if (!acc[task.category].subItems.includes(task.subCategory)) {
          acc[task.category].subItems.push(task.subCategory);
        }
        return acc;
      }, {} as Record<string, { label: string; subItems: string[] }>)
    );
    
    const jobMenuItems = Object.values(
      jobs.reduce((acc, job) => {
        if (!acc[job.category]) {
          acc[job.category] = { label: job.category, subItems: [] };
        }
        if (!acc[job.category].subItems.includes(job.subCategory)) {
          acc[job.category].subItems.push(job.subCategory);
        }
        return acc;
      }, {} as Record<string, { label: string; subItems: string[] }>)
    );
    
  
    const toggleBookmark = (id: string) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, isBookmarked: !task.isBookmarked } : task
        )
      );
    };

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

    const filteredTasks = tasks.filter((task) => {
      if (selectedSubItems.length > 0) {
        return selectedSubItems
          .map((s) => s.toLowerCase())
          .includes(task.subCategory.toLowerCase());
      } else if (searchTerm.trim() !== "") {
        return (
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.taskType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    });
    


    // Reset filters when tab changes
    useEffect(() => {
      setSelectedSubItems([]);
      setSearchTerm("");
      setCurrentPage(1);
    }, [activeTab]);

    // Fetch data once on mount
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

   
    
    const itemsPerPage = 20;
    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);
  
    return (
      <div style={{ display: "flex" }}>
        {/* display the categories of bookmarked services/jobs on left side */}
        <SideMenu 
          menuItems={activeTab === "tasks" ? taskMenuItems : jobMenuItems}
          selectedSubItems={selectedSubItems}
          onSubItemSelect={handleSubItemSelect}
          clearSelectedSubItem={clearSelectedSubItem}
          clearAllSelectedSubItems={clearAllSelectedSubItems}
          searchTerm={searchTerm}
          setSearchTerm={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
          selectedSubItem={null}
          showAdvertisement={false}
        />


          {/* Display the list of services/jobs on right side*/}
          <div style={{ padding: "20px", width: "100%", display: "flex", flexDirection: "column" }}>
              {/* Header bar. It includes total tasks found result & grid/table view buttons*/}
              <div className="flex flex-col justify-center items-center mb-5 bg-gray-200 rounded-lg">
                {/* Toggle button for jobs/task selection */}
                <div className="flex flex-row justify-center items-center w-full p-4 pb-0 pt-3">
                  <button
                    onClick={() => setActiveTab("jobs")}
                    className={`flex-1 flex justify-center items-center text-lg font-semibold h-8 rounded-lg transition
                      ${activeTab === "jobs" ? "bg-cyan-600 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    Task posts
                  </button>
                  <button
                    onClick={() => setActiveTab("tasks")}
                    className={`flex-1 flex justify-center items-center text-lg font-semibold h-8 rounded-lg transition
                      ${activeTab === "tasks" ? "bg-cyan-600 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    Service posts
                  </button>
                </div>


                {/* searched result header and list/grid toggle buttons */}
                <div className="flex justify-between items-center w-full">
                  <h2 style={{ fontSize: "16px", padding: "8px 16px" }}>
                    <strong>{activeTab === "tasks" ? filteredTasks.length : jobs.length}</strong> {activeTab} found.
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
                {activeTab === "tasks" ? (
                  paginatedTasks.map((task, index) => (
                    <TaskTile
                      key={`${task.id}_${index}`}
                      {...task}
                      view={viewMode}
                      onBookmarkToggle={toggleBookmark}
                      budget={String(task.budget)}
                    />
                  ))
                ) : (
                  jobs.map((job, index) => (
                    <JobTile
                      key={`${job.id}_${index}`}
                      {...job}
                      view={viewMode}
                      budget={String(job.budget)}
                    />
                  ))
                )}

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