import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const TranscriptError = ({ error, onReset }) => {
  return (
    // error view
    <div className="bg-white rounded-b-xl rounded-tl-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center gap-3 text-center min-h-[300px]">
      <FaExclamationTriangle className="text-red-500 text-5xl" />
      <p className="text-red-600 font-medium">{error}</p>
      <button
        onClick={onReset}
        className="mt-2 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-lg transition-colors font-semibold"
      >
        تلاش مجدد
      </button>
    </div>
  );
};

export default TranscriptError;