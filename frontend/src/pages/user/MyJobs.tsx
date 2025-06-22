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

  const [jobs, setJobs] = useState<Job[]>([
    // Applied by Me
    {
      id: "1",
      title: "Security Duty",
      description: "My shop requires a security for 3 days.",
      imageUrl: "https://www.clearway.co.uk/wp-content/uploads/2023/06/What-does-a-security-guard-do.webp",
      budget: "Rs.4,000/day",
      category: "Applied by Me",
      subCategory: "Security",
      status: "Accepted",
    },
    {
      id: "2",
      title: "House Keeping",
      description: "This job required to keep the house clean for 3 days.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Gd7wAtzBzPsnFZhvcivvJsOM52_ZZvQsGQ&s",
      budget: "Rs.2,000/day",
      category: "Applied by Me",
      subCategory: "Cleaing",
      status: "Pending",
    },
    {
      id: "3",
      title: "Garden Cleaning",
      description: "Need assistance in cleaning the yard owned by an shop owner.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuMXucuJjvBA8wSU1WP2xcVkro6N0YtJzY5g&s",
      budget: "Rs.10,000/day",
      category: "Applied by Me",
      subCategory: "Landscaping",
      status: "Pending",
    },

    // Posted by Me
    {
      id: "4",
      title: "Mason",
      description: "Need urgent help in reparing the walls of the back entrance of the gate. Some of the walls are cracked and need to repair them as well.",
      imageUrl: "https://media.istockphoto.com/id/610442626/photo/master-mason.jpg?s=612x612&w=0&k=20&c=8JlF8evy9RJRSup-WM6_G1XJh0Hd3tWAPUoLYERyoqk=",
      budget: "Rs.800/hour",
      category: "Posted by Me",
      subCategory: "Landscaping",
      status: "Pending",
    },
    {
      id: "5",
      title: "Carpenter",
      description: "Need the expertise to create a couple of furniture items in the household and repair and paint the wooden staircase.",
      imageUrl: "https://media.licdn.com/dms/image/v2/D5612AQHJ4JMQKvFwpA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1709617139736?e=2147483647&v=beta&t=zYP7vqo4oudV-Fc7hsuzb1r7E7MX9ndL1dVpn80ssd4",
      budget: "Rs.5,000/day",
      category: "Posted by Me",
      subCategory: "Designing",
      status: "In Progress",
    },
    {
      id: "6",
      title: "Architectural Engineer",
      description: "Searching for an expert to design and plan out the bedroom that currently in the construction period.",
      imageUrl:
        "https://asset.velvetjobs.com/job-description-samples/covers/w992/architectural-engineer.jpeg",
      budget: "Rs.10,000/day",
      category: "Posted by Me",
      subCategory: "Designing",
      status: "Cancelled",
    },

    // Assigned to Me
    {
      id: "7",
      title: "Garden Cleaning",
      description: "This is an urgent cleaning task categorized under House > Landscaping, based in Polgahawela, Sri Lanka.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuMXucuJjvBA8wSU1WP2xcVkro6N0YtJzY5g&s",
      budget: "Rs.9,000/day",
      category: "Assigned to Me",
      subCategory: "Landscaping",
      status: "Ongoing",
    },
    {
      id: "8",
      title: "House Keeping",
      description: "This job required to keep the house clean for 2 days since the owners have been gone on a family trip.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Gd7wAtzBzPsnFZhvcivvJsOM52_ZZvQsGQ&s",
      budget: "Rs.3,000/day",
      category: "Assigned to Me",
      subCategory: "Landscaping",
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

