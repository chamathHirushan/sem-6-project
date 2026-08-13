import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFields, updateUserField } from "../../api/userAPI";
import { toast } from "react-toastify";

interface Job {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  budget: string;
  status: string;
}

export default function MyFields() {
  const navigate = useNavigate();
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [editableJobs, setEditableJobs] = useState<Record<string, Job>>({});
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function loadFields() {
      try {
        const data = await getUserFields();
        setJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load fields", error);
        toast.error("Could not load working fields.");
        setJobs([]);
      }
    }
    loadFields();
  }, []);

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

  const handleSave = async (id: string) => {
    if (!editableJobs[id]) return;
    try {
      await updateUserField(id, {
        status: editableJobs[id].status,
        description: editableJobs[id].description,
      });
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === id ? { ...job, status: editableJobs[id].status, description: editableJobs[id].description } : job
        )
      );
      setExpandedJobId(null);
      setEditableJobs((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      toast.success("Field updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update field.");
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

  const handleFilterChange = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredJobs = selectedStatuses.length
    ? jobs.filter((job) => selectedStatuses.includes(job.status))
    : jobs;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background: "linear-gradient(to bottom right, #205781, #4F959D, #98D2C0, #F6F8D5)",
        color: "#205781",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
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
        {/* Sidebar */}
        <div
          style={{
            display: "table-cell",
            width: "25%",
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "1.5rem",
            color: "#205781",
            verticalAlign: "top",
          }}
        >
          <h3
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Filter by Status{" "}
            <span style={{ fontSize: "1rem" }}>
              {isFilterOpen ? "▲" : "▼"}
            </span>
          </h3>
          {isFilterOpen &&
            ["pending", "completed", "rejected"].map((status) => (
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
            ))}
        </div>

        {/* Job Cards */}
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
          <h2 style={{ marginTop: 0 }}>My Subscriptions</h2>

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
                      <h3 style={{ margin: "0 0 0.25rem 0", color: "white" }}>
                        {job.title}
                      </h3>
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        Budget: {job.budget}
                      </p>
                      <p style={{ margin: 0, color: "#98D2C0" }}>
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
                      <div style={{ marginBottom: "1rem" }}>
                        <label>Edit Status: </label>
                        <select
                          value={editable.status}
                          onChange={(e) =>
                            handleStatusChange(job.id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="rejected">Rejected</option>
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
          marginTop: "2rem",
          padding: "0.75rem 1.2rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#205781",
          color: "#fff",
          cursor: "pointer",
          display: "block",
          maxWidth: "auto",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Go to dashboard
      </button>
    </div>
  );
}