import React, { FC } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./JobTile.css";

interface JobTileProps {
  id: string;
  image: string;
  address: string;
  daysPosted: number;
  jobType: string;
  isBookmarked: boolean;
  view: "grid" | "list"; // Determines the tile layout
  onBookmarkToggle: (id: string) => void;
}

const JobTile: FC<JobTileProps> = ({
  id,
  image,
  address,
  daysPosted,
  jobType,
  isBookmarked,
  view,
  onBookmarkToggle,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // stop default link behavior
    const scrollY = window.scrollY;
    console.log("Navigating to job:", id, "ScrollY:", scrollY);

    // Navigate manually with scroll position in state
    navigate(`/work/${id}`, {
      state: {
        from: location,
        scrollPosition: scrollY,
      },
    });
  };
  
  const TileContent = (
    <div className={`job-tile ${view === "grid" ? "grid" : "list"}`} style={{ backgroundColor: "white" }}>
      {view === "grid" ? (
        <>
          <img src={image} alt="Job" className="job-tile-image" />
          <div className="job-tile-content">
            <h3 className="job-tile-id">Job ID: {id}</h3>
            <p className="job-tile-address">{address}</p>
            <button
              className={`job-tile-bookmark ${isBookmarked ? "bookmarked" : ""}`}
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

          <div className="job-tile-content flex-grow">
            <h2 className="job-tile-title">Job Title</h2>
            <h3 className="job-tile-id">Job ID: {id}</h3>
            <p className="job-tile-type">Type: {jobType}</p>
            <p className="job-tile-days">{daysPosted} days ago</p>
            <p className="job-tile-address">{address}</p>
            <button
              className={`job-tile-bookmark ${isBookmarked ? "bookmarked" : ""}`}
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
    <div onClick={handleClick} className="job-tile-link cursor-pointer">
      {TileContent}
    </div>
  );
  
};

export default JobTile;