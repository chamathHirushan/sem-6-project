import React, { FC, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import "./SideMenu.css";

interface MenuItem {
  label: string;
  subItems?: string[];
}

interface Props {
  menuItems: MenuItem[];
  width?: string;
  backgroundColor?: string;
}

const SideMenu: FC<Props> = ({
  menuItems,
  width = "250px",
  backgroundColor = "#f4f4f4",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredMenuItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        width,
        backgroundColor,
        height: "100vh",
        padding: "20px",
        borderRight: "1px solid #ddd",
        position: "fixed",
        top: "64px",   // set to 64px to avoid overlap with the navbar
        left: 0,
        overflowY: "auto",
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
            onClick={() => alert(`Searching for: ${searchTerm}`)}
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
                <span>
                    {expandedCategories.has(index) ? <FaAngleDown /> : <FaAngleUp />}
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


    </div>
  );
};

export default SideMenu;