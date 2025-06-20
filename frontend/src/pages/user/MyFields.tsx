import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import {useAuth} from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Job {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function MyFields() {
      const [backendData, setBackendData] = useState<string>("Loading...");
      const {user} = useAuth();
    
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

      const navigate = useNavigate();

    // Example jobs. (remove this after connecting the backend)
    const jobs = [
    {
      id: "1",
      title: "Carpenter",
      description:
        "Build, install, and repair structures and fixtures made from wood and other materials.",
      imageUrl:
        "https://www.shutterstock.com/image-photo/african-american-carpenter-man-use-600nw-2251271317.jpg",
    },
    {
      id: "2",
      title: "Electrician",
      description:
        "Install, maintain, and repair electrical wiring, equipment, and fixtures.",
      imageUrl:
        "https://contractortrainingcenter.com/cdn/shop/articles/Untitled_design_1.png?v=1693506427",
    },
    {
      id: "3",
      title: "Plumber",
      description:
        "Assemble, install, and repair water, gas, and drainage systems in residential and commercial locations.",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSFLhjJYz1cK6wbhSN-QVvQKq995u4EZeO_w&s",
    },
    {
      id: "4",
      title: "Mason",
      description:
        "Build and repair structures using bricks, concrete blocks, and natural stones.",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8KIy3rm4JbY_OgkWBfeKMeVEwtmbQQiG98w&s",
    },
  ];

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
      <h2 style={{ marginTop: 0 }}>My Subscriptions</h2>

      <div
          style={{
              backgroundColor: "#F6F8D5",
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