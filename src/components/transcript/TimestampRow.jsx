import React from "react";

// format time
const formatDisplayTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const TimestampRow = ({ item, startSec, endSec, isActiveSegment }) => {
  const isSilence = item.isSilence || !(item.text && String(item.text).trim().length > 0);
  const textContent = isSilence ? "[---]" : String(item.text).trim();

  return (
    // row layout
    <div className={`flex items-start gap-6 py-2 px-3 rounded-xl transition-all duration-200 ${isActiveSegment ? "bg-blue-50/60" : "hover:bg-gray-50/40"}`}>
      {/* time box */}
      <div className="flex items-center justify-between font-mono text-sm font-semibold tracking-wide flex-shrink-0 w-24 select-none" dir="ltr" style={{ lineHeight: "1.625rem" }}>
        <span className={isActiveSegment ? "text-blue-600 font-bold" : "text-blue-400/90"}>{formatDisplayTime(startSec)}</span>
        <span className="text-gray-300 mx-1">-</span>
        <span className={isActiveSegment ? "text-blue-500 font-bold" : "text-gray-400"}>{formatDisplayTime(endSec)}</span>
      </div>

      {/* text box */}
      <div className="text-base flex-1 text-right whitespace-pre-wrap transition-colors duration-200" style={{ lineHeight: "1.625rem" }}>
        {isSilence ? (
          <span className="text-gray-400 font-mono tracking-widest block animate-fade-in" dir="ltr">{textContent}</span>
        ) : isActiveSegment ? (
          <span className="text-blue-600 font-bold drop-shadow-[0_0_0.5px_rgba(37,99,235,0.15)]">{textContent}</span>
        ) : (
          <span className="text-gray-700 font-medium">{textContent}</span>
        )}
      </div>
    </div>
  );
};

export default TimestampRow;