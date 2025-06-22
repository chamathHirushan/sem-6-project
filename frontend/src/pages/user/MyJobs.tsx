import { useEffect, useState } from "react";
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
  status: string;
};

export default function MyJobs() {
  // const [jobs, setJobs] = useState<Job[]>([]);
  // const [backendMessage, setBackendMessage] = useState<string>("Loading...");
  // const { user } = useAuth();
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [editableJobs, setEditableJobs] = useState<Record<string, Job>>({});
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Example job list (Delete the following when connecting the backend)
    const [jobs, setJobs] = useState<Job[]>([
    {
      id: "1",
      title: "Software Developer",
      description:
        "Join our dynamic team to build innovative web applications and solve real-world problems.",
      imageUrl:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=80&q=80",
      budget: "$2500",
      status: "applied by me",
    },
    {
      id: "2",
      title: "UI/UX Designer",
      description:
        "Craft intuitive user experiences and elegant interfaces for our growing product suite.",
      imageUrl:
        "https://bambooagile.eu/wp-content/uploads/2021/02/custom-dev-scaled-2560x1280.jpg",
      budget: "$1800",
      status: "pending",
    },
    {
      id: "3",
      title: "Marketing Intern",
      description:
        "Assist in creating digital marketing campaigns and analyzing engagement metrics.",
      imageUrl:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=80&q=80",
      budget: "$500",
      status: "rejected",
    },
    {
      id: "4",
      title: "Data Analyst",
      description:
        "Analyze data trends and generate actionable insights to improve business performance.",
      imageUrl:
        "https://bambooagile.eu/wp-content/uploads/2021/02/custom-dev-scaled-2560x1280.jpg",
      budget: "$2100",
      status: "expired",
    },
    {
      id: "5",
      title: "DevOps Engineer",
      description:
        "Streamline deployment pipelines and maintain infrastructure for high availability systems.",
      imageUrl:
        "https://bambooagile.eu/wp-content/uploads/2021/02/custom-dev-scaled-2560x1280.jpg",
      budget: "$2700",
      status: "pending",
    },
  ]);

  const handleFilterChange = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

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

  const handleStatusChange = (id: string, newStatus: string) => {
    setEditableJobs((prev) => ({
      ...prev,
      [id]: { ...prev[id], status: newStatus },
    }));
  };

  const handleCancelJob = (id: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === id ? { ...job, status: "rejected" } : job
      )
    );
    setExpandedJobId(null);
  };

  const handleCompleteTask = (id: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    setExpandedJobId(null);
  };

  const handleSave = (id: string) => {
    if (!editableJobs[id]) return;
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === id ? { ...job, status: editableJobs[id].status } : job
      )
    );
    setExpandedJobId(null);
    setEditableJobs((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleCancelEdit = (id: string) => {
    setExpandedJobId(null);
    setEditableJobs((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const filteredJobs = selectedStatuses.length
    ? jobs.filter((job) => selectedStatuses.includes(job.status))
    : jobs;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background:
          "linear-gradient(to bottom right, #205781, #4F959D, #98D2C0, #F6F8D5)",
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
        <div
          style={{
            display: "table-cell",
            width: "25%",
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "1.5rem",
            color: "#205781",
            verticalAlign: "top",
            position: "relative",
          }}
        >
          <div
            onClick={() => setFilterDropdownOpen((prev) => !prev)}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              paddingTop: "1rem",
              fontSize: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Filter by Status{" "}
            <span>{filterDropdownOpen ? "▲" : "▼"}</span>
          </div>

          {filterDropdownOpen && (
            <div style={{ marginTop: "1rem" }}>
              {["applied by me", "pending", "rejected", "expired"].map(
                (status) => (
                  <div key={status}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status)}
                        onChange={() => handleFilterChange(status)}
                        style={{ marginRight: "0.5rem" }}
                      />
                      {status}
                    </label>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div
          style={{
            display: "table-cell",
            backgroundColor: "#F6F8D5",
            borderRadius: "16px",
            padding: "2rem",
            color: "#205781",
            verticalAlign: "top",
          }}
        >
          <h2 style={{ marginTop: 0 }}>My Jobs</h2>

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
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        Budget: {job.budget}
                      </p>
                      <p style={{ margin: "0.25rem 0", color: "#98D2C0" }}>
                        {job.description}
                      </p>
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
                      {["pending"].includes(job.status) && (
                        <div style={{ marginBottom: "1rem" }}>
                          <label>Upload Proof of Work: </label>
                          <input type="file" />
                        </div>
                      )}
                      <div style={{ marginBottom: "1rem" }}>
                        <label>Edit Status: </label>
                        <select
                          value={editable.status}
                          onChange={(e) =>
                            handleStatusChange(job.id, e.target.value)
                          }
                        >
                          <option value="applied by me">Applied by me</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                          <option value="expired">Expired</option>
                        </select>
                      </div>
                      <div>
                        <button
                          onClick={() => handleSave(job.id)}
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
                            marginRight: "1rem",
                            backgroundColor: "#ccc",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                        {["applied by me", "pending"].includes(job.status) && (
                          <button
                            onClick={() => handleCancelJob(job.id)}
                            style={{
                              backgroundColor: "#c0392b",
                              color: "white",
                              border: "none",
                              padding: "0.5rem 1rem",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          >
                            Cancel Job
                          </button>
                        )}
                      </div>
                      {job.status === "pending" && (
                        <button
                          onClick={() => handleCompleteTask(job.id)}
                          style={{
                            marginTop: "0.5rem",
                            backgroundColor: "#27ae60",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "block",
                          }}
                        >
                          Complete Task
                        </button>
                      )}
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
          marginTop: "2rem",
          padding: "0.75rem 1.2rem",
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

