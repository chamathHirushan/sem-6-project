import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import jobImage from "../../assets/get-a-job-with-no-experience.png";

export default function ServiceView() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount

    console.log("Opened JobView. Came from:", location.state?.from);
    console.log("Stored scroll position:", location.state?.scrollPosition);

  }, []);
  
  const handleBack = () => {
    const from = location.state?.from || { pathname: "/hire" };
    const scrollPosition = location.state?.scrollPosition || 0;
  
    navigate(from.pathname + from.search, {
      state: {
        scrollPosition,
      },
    });
  };
  

  const task = {
    id: serviceId,
    title: "Senior Developer",
    address: "123 Main St, New York, NY",
    daysPosted: 5,
    taskType: "Full-Time",
    description: "We're looking for an experienced developer...",
    responsibilities: [
      "Write clean, scalable code",
      "Collaborate with cross-functional teams",
      "Mentor junior developers",
    ],
    image: jobImage,
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button onClick={handleBack} style={{ marginBottom: "20px" }}>
        ← Back
      </button>

      <img src={task.image} alt="Job" className="w-full h-64 object-contain bg-gray-100 mb-6" />
      <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
      <p className="text-gray-600 mb-1">Job ID: {task.id}</p>
      <p className="text-gray-600 mb-1">Address: {task.address}</p>
      <p className="text-gray-600 mb-1">Posted {task.daysPosted} days ago</p>
      <p className="text-gray-600 mb-4">Type: {task.taskType}</p>
      <h2 className="text-xl font-semibold mb-2">Job Description</h2>
      <p className="mb-4">{task.description}</p>
      <h2 className="text-xl font-semibold mb-2">Responsibilities</h2>
      <ul className="list-disc pl-6">
        {task.responsibilities.map((item, idx) => (
          <li key={idx} className="mb-1">{item}</li>
        ))}
      </ul>
    </div>
  );
}
