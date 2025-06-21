import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import {useAuth} from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import jobIcon from "../../assets/sewa_favicon.png"

interface Job {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function MyJobs() {
  // const [jobs, setJobs] = useState<Job[]>([]);
  // const [backendMessage, setBackendMessage] = useState<string>("Loading...");
  // const { user } = useAuth();
  const navigate = useNavigate();

  // Example job list (Delete the following when connecting the backend)
  const jobs = [
    {
      id: "1",
      title: "Software Developer",
      description:
        "Join our dynamic team to build innovative web applications and solve real-world problems.",
      imageUrl:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=80&q=80",
    },
    {
      id: "2",
      title: "UI/UX Designer",
      description:
        "Craft intuitive user experiences and elegant interfaces for our growing product suite.",
      imageUrl:
        "https://bambooagile.eu/wp-content/uploads/2021/02/custom-dev-scaled-2560x1280.jpg",
    },
    {
      id: "3",
      title: "Marketing Intern",
      description:
        "Assist in creating digital marketing campaigns and analyzing engagement metrics.",
      imageUrl:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=80&q=80",
    },
    {
      id: "4",
      title: "Data Analyst",
      description:
        "Analyze data trends and generate actionable insights to improve business performance.",
      imageUrl:
        "https://bambooagile.eu/wp-content/uploads/2021/02/custom-dev-scaled-2560x1280.jpg",
    },
    {
      id: "5",
      title: "DevOps Engineer",
      description:
        "Streamline deployment pipelines and maintain infrastructure for high availability systems.",
      imageUrl:
        "https://bambooagile.eu/wp-content/uploads/2021/02/custom-dev-scaled-2560x1280.jpg",
    },
  ];

      // useEffect(() => {
      //   async function fetchData() {
      //     try {
      //       const response = await apiClient.get("/");
      //       setBackendMessage(response.message || "Jobs loaded");
      //     } catch (error) {
      //       console.error("API Error:", error);
      //       setBackendMessage("Error fetching jobs");
      //       setJobs([]);
      //     }
      //   }
      //   fetchData();
      // }, 
      // []);

// Jobs is a list of jobs which taken from the back end.. This should be a list and after getting that the page will generate for each of the jobs as a drop down.
return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background: "linear-gradient(to bottom right, #205781, #4F959D, #98D2C0, #F6F8D5)",
        color: "#205781",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#4F959D",
          borderRadius: "16px",
          padding: "2rem",
          maxWidth: "auto",
          margin: "0 auto",
          color: "white",
        }}
      >
        <h2 style={{ marginTop: 0 }}>My Jobs</h2>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "1rem",
            marginTop: "1rem",
          }}
        >
        {jobs.map((job) => (
          <div
            key={job.id}
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "12px",
              padding: "1rem",
              backgroundColor: "rgba(18, 61, 94, 0.69)",
              boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
              marginBottom: "1rem",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
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
              <p style={{ margin: 0, color: "#98D2C0" }}>{job.description}</p>
            </div>
          </div>
            ))}
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

