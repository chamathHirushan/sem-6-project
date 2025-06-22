import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
// import {useAuth} from "../../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
import SideMenu from "../../components/SideMenu/SideMenu";
import JobTile from "../../components/JobTile/JobTile";
import {Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/solid";
import jobImage from "../../assets/1.jpeg"
import jobImage2 from "../../assets/2.jpeg"
import jobImage3 from "../../assets/3.jpeg"
import jobImage4 from "../../assets/4.jpeg"
import jobImage5 from "../../assets/5.jpeg"
import jobImage6 from "../../assets/6.jpeg"
import jobImage7 from "../../assets/7.jpeg"
import jobImage8 from "../../assets/8.jpeg"
import { useSearchParams, useLocation } from "react-router-dom";
import {getAvailableJobs} from "../../api/userAPI";
import { toast } from "react-toastify";


export default function Works() {
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


      // useEffect(() => {
      //   async function fetchData() {
      //     try {
      //       const response = await apiClient.get("/user/dashboard");
      //       setBackendData(response.message || "No data received");
      //     } catch (error) {
      //       setBackendData("Error fetching data");
      //       console.error("API Error:", error);
      //     }
      //   }
    
      //   fetchData();
      // }, []);


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
          "Advertising & promotions", "Audio Hires", "Band, DJ & dancing", "Beauty Salon", "Catering & Food",
          "Dress Makers","Event Planners", "Flowers & Decos", "Health & Beauty Spa", "Photography", "Videography"] },
        { label: "Other", subItems: ["Other"] },
      ];

      
      interface Job {
        id: string;
        title: string;
        category: string;
        subCategory: string;
        image: string;
        location: string;
        daysPosted: number;
        jobType?: string;
        budget: string | number;
        isUrgent: boolean;
        isTrending?: boolean;
        isBookmarked: boolean;
      }

      useEffect(() => {
        async function fetchJobs() {
          try {
            const fetchedjobs = await getAvailableJobs();//TODO
            if (!fetchedjobs || fetchedjobs.length === 0) {
              //toast.error("Please try again.");
              return;
            }
            setJobs(fetchedjobs);
          } catch (error) {
            //toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
            console.error("Error fetching jobs:", error);
          }
        }
        fetchJobs();
      }, []);
      
      const [jobs, setJobs] = useState<Job[]>([
        {
          id: "J123",
          title: "Reparement for the ceiling",
          category: "Technicians",
          subCategory: "Masonry",
          image: jobImage,
          location: "Mawanella, Kegalle",
          daysPosted: 3,
          jobType: "Full-Time",
          budget: 10000,
          isUrgent: true,
          isTrending: true,
          isBookmarked: false,
        },
        {
          id: "J124",
          title: "Install a new water tank",
          category: "Technicians",
          subCategory: "Plumbing",
          image: jobImage2,
          location: "Panadura, Sri Lanka",
          daysPosted: 7,
          jobType: "Part-Time",
          budget: 8000,
          isUrgent: true,
          isTrending: true,
          isBookmarked: true,
        },
        {
          id: "J125",
          title: "කොන්ක්‍රීට් slab එක waterproof කිරීම",
          category: "Technicians",
          subCategory: "Masonry",
          image: jobImage3,
          location: "Panadura, Sri Lanka",
          daysPosted: 7,
          jobType: "Part-Time",
          budget: " -",
          isUrgent: true,
          isTrending: true,
          isBookmarked: true,
        },
        {
          id: "J126",
          title: "House Painting",
          category: "House",
          subCategory: "House Painting",
          image: jobImage4,
          location: "Kaluthara, Sri Lanka",
          daysPosted: 7,
          jobType: "Part-Time",
          budget: 25000,
          isUrgent: true,
          isTrending: true,
          isBookmarked: true,
        },
        {
          id: "J127",
          title: "Fix Power trip issues",
          category: "Technicians",
          subCategory: "Electricians",
          image: jobImage5,
          location: "Molple, Katubedda",
          daysPosted: 7,
          jobType: "Part-Time",
          budget: 5000,
          isUrgent: true,
          isTrending: true,
          isBookmarked: true,
        },
        {
          id: "J128",
          title: "Leakage in bathroom pipes",
          category: "Technicians",
          subCategory: "Plumbing",
          image: jobImage6,
          location: "Kottawa, Sri Lanka",
          daysPosted: 2,
          jobType: "Part-Time",
          budget: 6000,
          isUrgent: true,
          isTrending: true,
          isBookmarked: true,
        },
        {
          id: "J130",
          title: "බුදු මැදුරක් තැනීම",
          category: "House",
          subCategory: "Construction",
          image: jobImage8,
          location: "Gampaha, Sri Lanka",
          daysPosted: 5,
          jobType: "Full-Time",
          budget: 30000,
          isUrgent: true,
          isTrending: false,
          isBookmarked: false,
        },
        {
          id: "J129",
          title: "Garden Cleaning",
          category: "House",
          subCategory: "Landscaping ",
          image: jobImage7,
          location: "Polgahawela, Sri Lanka",
          daysPosted: 2,
          jobType: "Full-Time",
          budget: 9000,
          isUrgent: false,
          isTrending: true,
          isBookmarked: false,
        },
      ]);

      const filteredJobs = jobs.filter((job) => {
        if (selectedSubItems.length > 0) {
          return selectedSubItems
            .map((s) => s.toLowerCase())
            .includes(job.subCategory.toLowerCase());
        } else if (searchTerm.trim() !== "") {
          return (
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return true;
      });
      
      

      const toggleBookmark = (id: string) => {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === id ? { ...job, isBookmarked: !job.isBookmarked } : job
          )
        );
      };

      // Pagination logic
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 20;
      const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const paginatedJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);


    return (
      <div style={{ display: "flex"}}>
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

        {/* Header bar. It includes total jobs found result & grid/table view buttons*/}
        <div className="flex justify-between items-center mb-5  bg-gray-200 rounded-lg">
            <h2 style={{ fontSize: "16px", padding: "8px 16px" }}>
              <strong>{filteredJobs.length}</strong> jobs found.
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
                justifyItems: "center",
                flexWrap: viewMode === "list" ? "wrap" : undefined,
                flexDirection: "column",
                justifyContent: viewMode === "list" ? "center" : undefined,
                width: viewMode === "list" ? "100%" : "100%",
                margin: viewMode === "list" ? "0 auto" : undefined,
              }}
            >
            {paginatedJobs.map((job, index) => (
              <JobTile
                key={`${job.id}_${index}`}
                {...job}
                view={viewMode}
                onBookmarkToggle={toggleBookmark}
                budget={String(job.budget)}
              />
            ))}
          </div>
        </div>
        {/* Tailwind Pagination Controls */}
        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-gray-600 font-medium">
            {`Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, jobs.length)} of ${jobs.length} Entries`}
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

