import React from "react";
import { FaSpinner } from "react-icons/fa";

const TranscriptLoading = () => {
  return (
    // loading view
    <div className="bg-white rounded-b-xl rounded-tl-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center gap-4 min-h-[300px]">
      <FaSpinner className="text-[#00BA9F] text-5xl animate-spin" />
      <p className="text-gray-500 text-sm">
        در حال پردازش و تبدیل گفتار به متن...
      </p>
    </div>
  );
};

export default TranscriptLoading;