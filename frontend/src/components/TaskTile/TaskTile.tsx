import React, { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TaskTile.css";

interface TaskTileProps {
  id: string;
  image: string;
  address: string;
  daysPosted: number;
  taskType: string;
  isBookmarked: boolean;
  view: "grid" | "list"; // Determines the tile layout
  onBookmarkToggle: (id: string) => void;
}

const TaskTile: FC<TaskTileProps> = ({
  id,
  image,
  address,
  daysPosted,
  taskType,
  isBookmarked,
  view,
  onBookmarkToggle,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // stop default link behavior
    const scrollY = window.scrollY;
    console.log("Navigating to task:", id, "ScrollY:", scrollY);

    // Navigate manually with scroll position in state
    navigate(`/hire/${id}`, {
      state: {
        from: location,
        scrollPosition: scrollY,
      },
    });
  };
  
  const TileContent = (
    <div className={`task-tile ${view === "grid" ? "grid" : "list"}`} style={{ backgroundColor: "white" }}>
      {view === "grid" ? (
        <>
          <img src={image} alt="Task" className="task-tile-image" />
          <div className="task-tile-content">
            <h3 className="task-tile-id">Job ID: {id}</h3>
            <p className="task-tile-address">{address}</p>
            <button
              className={`task-tile-bookmark ${isBookmarked ? "bookmarked" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onBookmarkToggle(id);
              }}
            >
              {isBookmarked ? "Unbookmark" : "Bookmark"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="image-wrapper w-1/3 bg-gray-200 flex items-center justify-center">
            <div className="image-square aspect-square w-full h-full flex items-center justify-center">
              <img src={image} alt="Job" className="max-w-full max-h-full object-contain" />
            </div>
          </div>

          <div className="task-tile-content flex-grow">
            <h2 className="task-tile-title">Job Title</h2>
            <h3 className="task-tile-id">Job ID: {id}</h3>
            <p className="task-tile-type">Type: {taskType}</p>
            <p className="task-tile-days">{daysPosted} days ago</p>
            <p className="task-tile-address">{address}</p>
            <button
              className={`task-tile-bookmark ${isBookmarked ? "bookmarked" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onBookmarkToggle(id);
              }}
            >
              {isBookmarked ? "Unbookmark" : "Bookmark"}
            </button>
          </div>
        </>
      )}

    </div>
  );

  return (
    <div onClick={handleClick} className="task-tile-link">
      {TileContent}
    </div>
  );
  
};

export default TaskTile;