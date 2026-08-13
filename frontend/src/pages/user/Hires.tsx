import { useEffect, useState } from "react";
import SideMenu from "../../components/SideMenu/SideMenu";
import TaskTile from "../../components/TaskTile/TaskTile";
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/solid";
import { useSearchParams, useLocation } from "react-router-dom";
import { getAllAvailableServices, addBookmark } from "../../api/userAPI";
import { toast } from "react-toastify";

export default function Hires() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubItems, setSelectedSubItems] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultView = (searchParams.get("view") as "grid" | "list") || "grid";
  const [viewMode, setViewMode] = useState<"grid" | "list">(defaultView);
  const location = useLocation();

  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    setSearchParams({ view: mode });
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
    if (location.state?.scrollPosition !== undefined) {
      setTimeout(() => {
        window.scrollTo(0, location.state.scrollPosition);
      }, 0);
    }
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
      "Advertising & promotions", "Audio Hires", "Band, DJ & dancing", "Beauty Salon", "Catering & Food",
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

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedServices = await getAllAvailableServices();
        setTasks(Array.isArray(fetchedServices) ? fetchedServices : []);
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Could not load services.");
        setTasks([]);
      }
    }
    fetchData();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (selectedSubItems.length > 0) {
      return selectedSubItems
        .map((s) => s.toLowerCase())
        .includes((task.subCategory || "").toLowerCase());
    } else if (searchTerm.trim() !== "") {
      return (
        (task.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.location || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  const toggleBookmark = async (id: string) => {
    const current = tasks.find((task) => task.id === id);
    const nextState = !current?.isBookmarked;
    setTasks((prev) =>
      prev.map((task) => task.id === id ? { ...task, isBookmarked: nextState } : task)
    );
    try {
      await addBookmark(id, nextState, "service");
    } catch (error) {
      console.error("Failed to update bookmark:", error);
      toast.error("Could not update bookmark.");
      setTasks((prev) =>
        prev.map((task) => task.id === id ? { ...task, isBookmarked: !nextState } : task)
      );
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / itemsPerPage));
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
            setCurrentPage(1);
          }}
          selectedSubItem={null}
          showAdvertisement={true}
        />
    
    <div style={{ padding: "20px", width: "100%", display: "flex", flexDirection: "column" }}>
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
            width: "100%",
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
    
    <div className="flex justify-between items-center mt-8">
      <div className="text-sm text-gray-600 font-medium">
        {`Showing ${filteredTasks.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredTasks.length)} of ${filteredTasks.length} Entries`}
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
