import React, { FC, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import "./SideMenu.css";

interface MenuItem {
  label: string;
  subItems?: string[];
}

interface Props {
  menuItems: MenuItem[];
  width?: string;
  backgroundColor?: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SideMenu: FC<Props> = ({
  menuItems,
  width = "300px",
  backgroundColor = "#f4f4f4",
  searchTerm,
  setSearchTerm,
}) => {
  // const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );

  const toggleCategory = (index: number) => {
    const newExpandedCategories = new Set(expandedCategories);
    if (newExpandedCategories.has(index)) {
      newExpandedCategories.delete(index);
    } else {
      newExpandedCategories.add(index);
    }
    setExpandedCategories(newExpandedCategories);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setExpandedCategories(new Set());
  };

  // Filter menu items and subitems by search term
  const filteredMenuItems = menuItems
    .map((item) => {
      // Filter subItems if present
      const filteredSubItems = item.subItems
        ? item.subItems.filter((sub) => sub.toLowerCase().includes(searchTerm.toLowerCase()))
        : undefined;
      // Check if the main label matches or any subItem matches
      if (
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (filteredSubItems && filteredSubItems.length > 0)
      ) {
        return { ...item, subItems: filteredSubItems };
      }
      return null;
    })
    .filter(Boolean) as MenuItem[];

  return (
    <div
      style={{
        width,
        backgroundColor,
        height: "auto",
        padding: "20px",
        borderRight: "1px solid #ddd",
      }}
    >
    
      {/* Search Box */}
      <div>
        <form style={{ marginBottom: "20px" }}>
          <input className="w-full p-2 border border-gray-300 rounded-md"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
                
            <button className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
            type="button"
            onClick={(e) => {
              e.preventDefault();
            }}
            >
                Search
            </button>
            
        </form>
      </div>
      

      {/* Categories */}
      <ul className="sidebar">
        {filteredMenuItems.map((item, index) => (
            <li key={index} className="sidebar-item">
            <div
                className="sidebar-category"
                onClick={() => toggleCategory(index)}
            >
                {item.label}
                {item.subItems && (
                <span className="w-5 h-5 inline-block ml-2 text-gray-500">
                    {expandedCategories.has(index) ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </span>
                )}
            </div>
            {item.subItems && expandedCategories.has(index) && (
                <ul className="sidebar-subitems">
                {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className="sidebar-subitem">
                    {subItem}
                    </li>
                ))}
                </ul>
            )}
            </li>
        ))}
        </ul>

      {/* Reset Button */}
      <div>
        <button className="mt-2 w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
            type="button"
            onClick={() => alert(`Reset all selections`)}
            >
                Reset All
        </button>
      </div>

      {/* Small space for advertisements */}
      <div style={{ marginTop: "20px", marginBottom: "50px", padding: "10px", backgroundColor: "#e0e0e0", borderRadius: "5px", height: "260px", textAlign: "center", alignContent: "center" }}>
        <p style={{ fontSize: "14px", color: "#555" }}>Space Available</p>
        <p style={{ fontSize: "12px", color: "#777" }}>for</p>
        <p style={{ fontSize: "14px", color: "#777", fontWeight:"bold" }}>Your Advertisements</p>
      </div>

    </div>
  );
};

export default SideMenu;