import { useEffect, useState, ChangeEvent } from "react";
import { apiClient } from "../../api/client";
import {useAuth} from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import jobIcon from "../../assets/sewa_favicon.png"

type Job = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  budget: string;
  category: "" | "Posted by Me" | "Applied by Me" | "Assigned to Me";
  subCategory: string;
  status: string;
};

export default function MyJobs() {
  // const [jobs, setJobs] = useState<Job[]>([]);
  // const [backendMessage, setBackendMessage] = useState<string>("Loading...");
  // const { user } = useAuth();
  const navigate = useNavigate();
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [editableJobs, setEditableJobs] = useState<Record<string, Job & { uploadedPhotos?: string[] }>>({});
  const [selectedCategory, setSelectedCategory] = useState<Job["category"]>("Posted by Me");

  const [appliedSubCategory, setAppliedSubCategory] = useState<"All" | "Accepted" | "Pending" | "Rejected">("All");
  const [postedSubCategory, setPostedSubCategory] = useState<"All" | "Pending" | "In Progress" | "Cancelled">("All");
  const [assignedSubCategory, setAssignedSubCategory] = useState<"All" | "Ongoing" | "Completed">("All");

  const [showSubCategories, setShowSubCategories] = useState<"" | "Applied by Me" | "Posted by Me" | "Assigned to Me">("");

  const [jobs, setJobs] = useState<Job[]>([
    // Applied by Me
    {
      id: "1",
      title: "Software Developer",
      description: "Build innovative web apps.",
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=80&q=80",
      budget: "$2500",
      category: "Applied by Me",
      subCategory: "Frontend",
      status: "Accepted",
    },
    {
      id: "2",
      title: "Backend Engineer",
      description: "Build robust backend systems.",
      imageUrl: "https://bambooagile.eu/wp-content/uploads/2021/02/custom-dev-scaled-2560x1280.jpg",
      budget: "$2200",
      category: "Applied by Me",
      subCategory: "Backend",
      status: "Pending",
    },
    {
      id: "3",
      title: "QA Tester",
      description: "Test software for bugs.",
      imageUrl: "https://bambooagile.eu/wp-content/uploads/2021/02/custom-dev-scaled-2560x1280.jpg",
      budget: "$1800",
      category: "Applied by Me",
      subCategory: "Quality Assurance",
      status: "Rejected",
    },

    // Posted by Me
    {
      id: "4",
      title: "UI/UX Designer",
      description: "Craft intuitive experiences.",
      imageUrl: "https://bambooagile.eu/wp-content/uploads/2021/02/custom-dev-scaled-2560x1280.jpg",
      budget: "$1800",
      category: "Posted by Me",
      subCategory: "Design",
      status: "Pending",
    },
    {
      id: "5",
      title: "Product Manager",
      description: "Lead project execution.",
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=80&q=80",
      budget: "$3000",
      category: "Posted by Me",
      subCategory: "Management",
      status: "In Progress",
    },
    {
      id: "6",
      title: "Tech Consultant",
      description: "Provide tech consultations.",
      imageUrl:
        "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/6VAOnHExwm5tWsPmHJoBvl/38581e711e68605fbe1925405b16552d/GettyImages-1444490806.jpg?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive&auto=format%2Ccompress&dpr=1&w=1000",
      budget: "$2600",
      category: "Posted by Me",
      subCategory: "Consulting",
      status: "Cancelled",
    },

    // Assigned to Me
    {
      id: "7",
      title: "Data Analyst",
      description: "Analyze data trends.",
      imageUrl: "https://bambooagile.eu/wp-content/uploads/2021/02/custom-dev-scaled-2560x1280.jpg",
      budget: "$2100",
      category: "Assigned to Me",
      subCategory: "Analytics",
      status: "Ongoing",
    },
    {
      id: "8",
      title: "Security Expert",
      description: "Ensure platform security.",
      imageUrl: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=80&q=80",
      budget: "$2900",
      category: "Assigned to Me",
      subCategory: "Cybersecurity",
      status: "Completed",
    },
  ]);

  const toggleExpand = (id: string) => {
    setExpandedJobId(id === expandedJobId ? null : id);
    const foundJob = jobs.find((job) => job.id === id);
    if (foundJob) {
      setEditableJobs((prev) => ({
        ...prev,
        [id]: { ...foundJob },
      }));
    }
  };

  const handleCancelEdit = (id: string) => {
    setExpandedJobId(null);
    setEditableJobs((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // Upload photos only for Assigned to Me jobs - stored only temporarily in editableJobs (not saved to jobs)
  const handlePhotoUpload = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setEditableJobs((prev) => {
          const job = prev[id];
          if (!job) return prev;
          const existingPhotos = job.uploadedPhotos || [];
          return {
            ...prev,
            [id]: {
              ...job,
              uploadedPhotos: [...existingPhotos, result],
            },
          };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const filteredJobs = jobs.filter((job) => {
    if (selectedCategory !== job.category) return false;
    if (selectedCategory === "Applied by Me") {
      return appliedSubCategory === "All" || job.status === appliedSubCategory;
    }
    if (selectedCategory === "Posted by Me") {
      return postedSubCategory === "All" || job.status === postedSubCategory;
    }
    if (selectedCategory === "Assigned to Me") {
      return assignedSubCategory === "All" || job.status === assignedSubCategory;
    }
    return true;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background: "linear-gradient(to bottom right, #205781, #4F959D, #98D2C0, #F6F8D5)",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "table",
          width: "100%",
          tableLayout: "fixed",
          borderSpacing: "0.2rem",
        }}
      >
        {/* Left Panel */}
        <div
          style={{
            display: "table-cell",
            width: "25%",
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "1.5rem",
            color: "#205781",
            verticalAlign: "top",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontWeight: "bold", fontSize: "1.2rem" }}>
            {["Posted by Me", "Applied by Me", "Assigned to Me"].map((cat) => (
              <div key={cat}>
                <div
                  onClick={() => {
                    setSelectedCategory(cat as Job["category"]);
                    setShowSubCategories((prev) => (prev === cat ? "" : (cat as typeof showSubCategories)));
                  }}
                  style={{
                    cursor: "pointer",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    backgroundColor: selectedCategory === cat ? "#205781" : "white",
                    color: selectedCategory === cat ? "white" : "#205781",
                  }}
                >
                  {cat}
                </div>
                {cat === showSubCategories && (
                  <div style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
                    {(cat === "Applied by Me"
                      ? ["All", "Accepted", "Pending", "Rejected"]
                      : cat === "Posted by Me"
                      ? ["All", "Pending", "In Progress", "Cancelled"]
                      : ["All", "Ongoing", "Completed"]
                    ).map((sub) => (
                      <div
                        key={sub}
                        onClick={() => {
                          if (cat === "Applied by Me") setAppliedSubCategory(sub as any);
                          if (cat === "Posted by Me") setPostedSubCategory(sub as any);
                          if (cat === "Assigned to Me") setAssignedSubCategory(sub as any);
                        }}
                        style={{
                          cursor: "pointer",
                          padding: "0.3rem 0.8rem",
                          borderRadius: "6px",
                          backgroundColor:
                            (cat === "Applied by Me" && appliedSubCategory === sub) ||
                            (cat === "Posted by Me" && postedSubCategory === sub) ||
                            (cat === "Assigned to Me" && assignedSubCategory === sub)
                              ? "#98D2C0"
                              : "transparent",
                          color:
                            (cat === "Applied by Me" && appliedSubCategory === sub) ||
                            (cat === "Posted by Me" && postedSubCategory === sub) ||
                            (cat === "Assigned to Me" && assignedSubCategory === sub)
                              ? "#123D5E"
                              : "#205781",
                          fontSize: "0.95rem",
                        }}
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div
          style={{
            display: "table-cell",
            backgroundColor: "#F6F8D5",
            borderRadius: "16px",
            padding: "2rem",
            color: "#205781",
            verticalAlign: "top",
            height: "85vh",
            overflowY: "auto",
          }}
        >
          <h2 style={{ marginTop: 0 }}>{selectedCategory}</h2>
          <div
            style={{
              backgroundColor: "#F6F8D5",
              borderRadius: "12px",
              padding: "1rem",
              marginTop: "1rem",
            }}
          >
            {filteredJobs.map((job) => {
              const isExpanded = expandedJobId === job.id;
              const editable = editableJobs[job.id] || job;
              return (
                <div
                  key={job.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                    padding: "1rem",
                    backgroundColor: "rgba(18, 61, 94, 0.69)",
                    boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
                    marginBottom: "1rem",
                    color: "white",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={job.imageUrl}
                      alt={job.title}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "12px",
                        objectFit: "cover",
                        marginRight: "1rem",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <h3 style={{ margin: "0 0 0.25rem 0" }}>{job.title}</h3>
                      <p style={{ margin: 0, fontWeight: "bold" }}>Budget: {job.budget}</p>
                      <p style={{ margin: "0.25rem 0", color: "#98D2C0" }}>{job.description}</p>
                      <p style={{ margin: 0 }}>Status: {editable.status}</p>
                    </div>
                    <button
                      onClick={() => toggleExpand(job.id)}
                      style={{
                        marginLeft: "auto",
                        backgroundColor: "#98D2C0",
                        color: "#123D5E",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                      }}
                    >
                      {isExpanded ? "▲" : "▼"}
                    </button>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: "1rem" }}>
                      <div style={{ marginBottom: "1rem" }}>
                        <label>Subcategory: </label>
                        <input
                          type="text"
                          value={editable.subCategory}
                          onChange={(e) =>
                            setEditableJobs((prev) => ({
                              ...prev,
                              [job.id]: {
                                ...prev[job.id],
                                subCategory: e.target.value,
                              },
                            }))
                          }
                          style={{ marginLeft: "0.5rem" }}
                        />
                      </div>

                      <div style={{ marginBottom: "1rem" }}>
                        <label>Status: </label>
                        <select
                          value={editable.status}
                          onChange={(e) =>
                            setEditableJobs((prev) => ({
                              ...prev,
                              [job.id]: {
                                ...prev[job.id],
                                status: e.target.value,
                              },
                            }))
                          }
                          style={{ marginLeft: "0.5rem" }}
                        >
                          {(job.category === "Applied by Me"
                            ? ["Accepted", "Pending", "Rejected"]
                            : job.category === "Posted by Me"
                            ? ["Pending", "In Progress", "Cancelled"]
                            : ["Ongoing", "Completed"]
                          ).map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Upload photos only for Assigned to Me */}
                      {job.category === "Assigned to Me" && (
                        <div style={{ marginBottom: "1rem" }}>
                          <label>Upload Proof Photos:</label>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(job.id, e)}
                            style={{ display: "block", marginTop: "0.5rem" }}
                          />
                          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            {(editable.uploadedPhotos || []).map((photo, index) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`Proof ${index + 1}`}
                                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <button
                          onClick={() => {
                            setJobs((prevJobs) =>
                              prevJobs.map((j) =>
                                j.id === job.id
                                  ? {
                                      ...j,
                                      subCategory: editableJobs[job.id]?.subCategory || j.subCategory,
                                      status: editableJobs[job.id]?.status || j.status,
                                    }
                                  : j
                              )
                            );
                            handleCancelEdit(job.id);
                          }}
                          style={{
                            marginRight: "1rem",
                            backgroundColor: "#205781",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleCancelEdit(job.id)}
                          style={{
                            backgroundColor: "#ccc",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "0.4rem",
          padding: "1rem 1.2rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#205781",
          color: "#fff",
          cursor: "pointer",
          display: "block",
          width: "fit-content",
          alignSelf: "center",
        }}
      >
        Go to dashboard
      </button>
    </div>
  );
}

