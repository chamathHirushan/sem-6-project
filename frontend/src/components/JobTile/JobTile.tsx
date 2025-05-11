import React, { FC } from "react";
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
  return (
    <div className={`job-tile ${view === "grid" ? "grid" : "list"}`}>
      {view === "grid" ? (
        <>
          <img src={image} alt="Job" className="job-tile-image" />
          <div className="job-tile-content">
            <h3 className="job-tile-id">Job ID: {id}</h3>
            <p className="job-tile-address">{address}</p>
            <button
              className={`job-tile-bookmark ${isBookmarked ? "bookmarked" : ""}`}
              onClick={() => onBookmarkToggle(id)}
            >
              {isBookmarked ? "Unbookmark" : "Bookmark"}
            </button>
          </div>
        </>
      ) : (
        <>
            <div className="flex justify-start bg-gray-200 border-l-0 rounded-lg">
              <img src={image} alt="Job" className="job-tile-image" />
            </div>
          
          <div className="job-tile-content">
            <h2 className="job-tile-title">Job Title</h2>
            <h3 className="job-tile-id">Job ID: {id}</h3>
            <p className="job-tile-type">Type: {jobType}</p>
            <p className="job-tile-days">{daysPosted} days ago</p>
            <p className="job-tile-address">{address}</p>
            <button
              className={`job-tile-bookmark ${isBookmarked ? "bookmarked" : ""}`}
              onClick={() => onBookmarkToggle(id)}
            >
              {isBookmarked ? "Unbookmark" : "Bookmark"}
            </button>
          </div>
        </>
      )}

    </div>
  );
};

export default JobTile;