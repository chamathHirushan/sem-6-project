import React, { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {ClockIcon, MapPinIcon, TagIcon, StarIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid";
import "./TaskTile.css";

interface TaskTileProps {
  id: string;
  image: string;
  title: string;
  location: string;
  daysPosted: number;
  taskType: string;
  budget: string;   // budget can be a string(for negotiable services) or number
  isBookmarked: boolean;
  view: "grid" | "list"; // Determines the tile layout
  onBookmarkToggle: (id: string) => void;
}

const TaskTile: FC<TaskTileProps> = ({
  id,
  image,
  title,
  location,
  daysPosted,
  taskType,
  isBookmarked,
  budget, 
  view,
  onBookmarkToggle,
}) => {
  const pageLocation = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // stop default link behavior
    const scrollY = window.scrollY;
    console.log("Navigating to task:", id, "ScrollY:", scrollY);

    // Navigate manually with scroll position in state
    navigate(`/hire/${id}`, {
      state: {
        from: pageLocation,
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
            <div className="task-tile-title-wrapper" title={title}>
              <h3 className="task-tile-title truncate">{title}</h3>
            </div>
            <h3 className="task-tile-id">Rs. {budget}</h3>
            
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-0.5">
                {/* Task type */}
                <div className="flex items-center">
                  <TagIcon className="w-4 h-4 mr-1" style={{ color: "red" }} />
                  <p className="task-tile-type">{taskType}</p>
                </div>

                {/* Location */}
                <div className="flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-1" style={{ color: "#055dff" }} />
                  <p className="task-tile-address">{location}</p>
                </div>

                {/* Posted time */}
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <p className="task-tile-days">{daysPosted} days ago</p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {/* Chat icon */}
                <button
                  className="task-tile-chat"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate(`/chat/${id}`);
                  }}
                >
                  <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                </button>

                {/* Bookmark icon */}
                <button
                className={`task-tile-bookmark ${isBookmarked ? "bookmarked" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onBookmarkToggle(id);
                }}
                >
                {isBookmarked ? (
                  <SolidStarIcon className="w-5 h-5" />
                ) : (
                  <StarIcon className="w-5 h-5" />
                )}
                </button>
              </div>
            </div>
            
          </div>
        </>
      ) : (
        <>
          <div className="image-wrapper w-1/3 bg-gray-200 flex items-center justify-center shrink-0">
            <div className="image-square aspect-square w-full h-full flex items-center justify-center">
              <img src={image} alt="Job" className="max-w-full max-h-full object-contain" />
            </div>
          </div>

          <div className="task-tile-content flex-grow">
            <h2 className="line-clamp-2 text-neutral-700 font-medium text-lg" title={title}>{title}</h2>
            <h3 className="task-tile-id">Rs. {budget}</h3>
            <p className="task-tile-type">Type: {taskType}</p>
           
           {/* location */}
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" style={{ color: "#055dff" }}/>
              <p className="task-tile-address">{location}</p>
            </div>

            <div className="flex items-center justify-between w-full">
              <div>
                {/* Bookmark icon */}
                <button
                className={`task-tile-bookmark ${isBookmarked ? "bookmarked" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onBookmarkToggle(id);
                }}
                >
                {isBookmarked ? (
                  <SolidStarIcon className="w-5 h-5" />
                ) : (
                  <StarIcon className="w-5 h-5" />
                )}
                </button>
                
                {/* chat icon */}
                <button
                className="task-tile-chat"
                onClick={(e) => { 
                  e.stopPropagation();
                  e.preventDefault();
                  navigate(`/chat/${id}`);
                }}
                > 
                <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                </button>

              </div>
              
              
              {/* posted time */}
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1"/>
                <p className="task-tile-days">{daysPosted} days ago</p>
              </div>
            </div>
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