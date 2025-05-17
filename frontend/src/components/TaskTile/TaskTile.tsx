import React, { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {ClockIcon, MapPinIcon, TagIcon, StarIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { StarIcon as SolidStarIcon, FireIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
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
  isUrgent: boolean,
  isTrending: boolean,
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
  isUrgent,
  isTrending,
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

            {/* Budget */}
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

              <div className="flex flex-col gap-1 w-20">
                <div className="flex flex-col gap-0.5 place-items-end h-10">
                  {/* Urgent icon */}
                  {isUrgent && (
                    <div className="flex items-center justify-center p-0.5">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-1" style={{ color: "red" }} />
                    </div>
                  )}

                  {/* Trending icon */}
                  {isTrending && (
                      <div className="flex items-center justify-center p-0.5 px-1">
                      <FireIcon className="w-4 h-4 mr-0.5" style={{ color: "orange" }} />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between w-full pl-3">
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
            
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-0.5">
                <h3 className="task-tile-id">Rs. {budget}</h3>

                {/* Task type */}
                <div className="flex items-center">
                  <TagIcon className="w-4 h-4 mr-1" style={{ color: "red" }} />
                  <p className="task-tile-type">{taskType}</p>
                </div>

                {/* location */}
                <div className="flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-1" style={{ color: "#055dff" }}/>
                  <p className="task-tile-address">{location}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 w-20">
                {/* Urgent icon */}
                {isUrgent && (
                  <div className="flex items-center justify-center bg-red-500 rounded-md p-0.5">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" style={{ color: "white" }} />
                    <p className="text-white text-xs">Urgent</p>
                  </div>
                )}

                {/* Trending icon */}
                {isTrending && (
                    <div className="flex items-center justify-center rounded-md border border-orange-500 p-0.5 px-1">
                    <FireIcon className="w-4 h-4 mr-0.5" style={{ color: "orange" }} />
                    <p className="text-black text-xs">Trending</p>
                  </div>
                )}
              </div>
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