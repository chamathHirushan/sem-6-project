import React, { FC } from "react";
import "./JobTile.css";

interface JobTileProps {
  id: string;
  image: string;
  address: string;
  daysPosted: number;
  jobType: string;
  isBookmarked: boolean;
  view: "portrait" | "landscape"; // Determines the tile layout
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
    <div className={`job-tile ${view}`}>
      <img src={image} alt="Job" className="job-tile-image" />
      <div className="job-tile-content">
        <h3 className="job-tile-id">Job ID: {id}</h3>
        <p className="job-tile-address">{address}</p>
        <p className="job-tile-days">{daysPosted} days ago</p>
        <p className="job-tile-type">{jobType}</p>
        <button
          className={`job-tile-bookmark ${isBookmarked ? "bookmarked" : ""}`}
          onClick={() => onBookmarkToggle(id)}
        >
          {isBookmarked ? "Unbookmark" : "Bookmark"}
        </button>
      </div>
    </div>
  );
};

export default JobTile;