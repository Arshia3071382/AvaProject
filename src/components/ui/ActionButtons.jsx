// src/components/ui/ActionButtons.jsx
import React from "react";
import { FaMicrophone, FaUpload, FaLink } from "react-icons/fa";

const ActionButtons = ({ activeButton, onButtonChange, onReset }) => {
  
  const handleTabChange = (tabName) => {
    // ۱. ابتدا تمام داده‌ها، متن‌ها و صوت قبلی پاکسازی می‌شوند
    if (onReset) onReset();
    // ۲. سپس منوی جدید باز می‌شود
    onButtonChange(tabName);
  };

  return (
    <div className="flex flex-row gap-2 mb-0 z-10" dir="rtl">
      <button
        onClick={() => handleTabChange("record")}
        className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-t border-x transition-all ${
          activeButton === "record"
            ? "bg-white text-gray-800 border-gray-200 shadow-sm"
            : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
        }`}
      >
        <FaMicrophone />
        <span>ضبط صدا</span>
      </button>

      <button
        onClick={() => handleTabChange("upload")}
        className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-t border-x transition-all ${
          activeButton === "upload"
            ? "bg-white text-gray-800 border-gray-200 shadow-sm"
            : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
        }`}
      >
        <FaUpload />
        <span>بارگذاری فایل</span>
      </button>

      <button
        onClick={() => handleTabChange("link")}
        className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-t border-x transition-all ${
          activeButton === "link"
            ? "bg-white text-gray-800 border-gray-200 shadow-sm"
            : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
        }`}
      >
        <FaLink />
        <span>وارد کردن لینک</span>
      </button>
    </div>
  );
};

export default ActionButtons;