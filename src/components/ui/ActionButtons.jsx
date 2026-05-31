import React from "react";
import { FaUpload, FaLink, FaMicrophone } from "react-icons/fa";

const ActionButtons = ({ activeButton, onButtonChange, onReset }) => {
  
  const handleTabChange = (tabName) => {
    if (onReset) onReset();
    onButtonChange(tabName);
  };

  return (
    <div className="flex flex-row gap-2 mb-0 z-10" dir="rtl">
     
      <button
        onClick={() => handleTabChange("record")}
        className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-t border-x transition-all ${
          activeButton === "record"
            ? "bg-[#00BA9F] text-white border-[#00BA9F] shadow-sm" 
            : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
        }`}
      >
      
        <FaMicrophone/>
        <span>ضبط صدا</span>
      </button>

      <button
        onClick={() => handleTabChange("upload")}
        className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-t border-x transition-all ${
          activeButton === "upload"
            ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
            : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
        }`}
      >
        <FaUpload className={activeButton === "upload" ? "text-white" : "text-gray-400"} />
        <span>بارگذاری فایل</span>
      </button>

      <button
        onClick={() => handleTabChange("link")}
        className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-t border-x transition-all ${
          activeButton === "link"
            ? "bg-red-500 text-white border-red-500 shadow-sm" 
            : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
        }`}
      >
        <FaLink className={activeButton === "link" ? "text-white" : "text-gray-400"} />
        <span> لینک</span>
      </button>
    </div>
  );
};

export default ActionButtons;