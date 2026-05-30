import React from "react";

const parseTimeToSeconds = (timeStr) => {
  if (!timeStr) return 0;
  const parts = timeStr.split(":").map(parseFloat);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parseFloat(timeStr) || 0;
};

const TimestampList = ({ segments, currentTime }) => {
  return (
    <div className="flex flex-col gap-2">
      {segments.map((item, index) => {
        const startSec = parseTimeToSeconds(item.start);
        const endSec = parseTimeToSeconds(item.end);
        const isActiveSegment = currentTime >= startSec && currentTime <= endSec;

        return (
          <div
            key={index}
            className={`flex flex-row items-center justify-between p-3 rounded-xl border transition-all ${
              isActiveSegment
                ? "bg-blue-50/80 border-blue-100 text-blue-600 shadow-sm"
                : "bg-gray-50/60 border-transparent text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="text-right text-sm font-medium flex-1 pl-4">
              {item.text || "[---]"}
            </div>
            <div
              className={`font-mono text-sm font-semibold tracking-wide flex gap-2 pr-2 ${
                isActiveSegment ? "text-blue-500" : "text-blue-400/80"
              }`}
              dir="ltr"
            >
              <span>{item.start ? item.start.split(".")[0] : "00:00"}</span>
              <span className="text-gray-300">-</span>
              <span>{item.end ? item.end.split(".")[0] : "00:00"}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimestampList;