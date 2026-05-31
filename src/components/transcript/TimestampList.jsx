import React, { useMemo } from "react";
import TimestampRow from "./TimestampRow";

// parse time
const parseTimeToSeconds = (timeInput) => {
  if (timeInput === undefined || timeInput === null) return 0;
  if (typeof timeInput === "number") return timeInput;
  const timeStr = String(timeInput).trim();
  if (!timeStr) return 0;
  if (timeStr.includes(":")) {
    const parts = timeStr.split(":").map(parseFloat);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
  }
  return parseFloat(timeStr) || 0;
};

const TimestampList = ({ segments = [], currentTime = 0 }) => {
  
  // calculate segments
  const processedSegments = useMemo(() => {
    if (!segments || segments.length === 0) return [];
    const sorted = [...segments].sort((a, b) => parseTimeToSeconds(a.start) - parseTimeToSeconds(b.start));
    const result = [];
    
    const firstStart = parseTimeToSeconds(sorted[0].start);
    if (firstStart > 0.5) {
      result.push({ start: 0, end: firstStart, text: "[---]", isSilence: true });
    }
    
    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      const currentEnd = parseTimeToSeconds(current.end);
      result.push(current);
      
      if (i < sorted.length - 1) {
        const nextStart = parseTimeToSeconds(sorted[i + 1].start);
        if (nextStart - currentEnd > 0.8) {
          result.push({ start: currentEnd, end: nextStart, text: "[---]", isSilence: true });
        }
      }
    }
    return result;
  }, [segments]);

  return (
    // main list
    <div className="flex flex-col gap-3 w-full" dir="rtl">
      {processedSegments.map((item, index) => (
        <TimestampRow
          key={index}
          item={item}
          startSec={parseTimeToSeconds(item.start)}
          endSec={parseTimeToSeconds(item.end)}
          isActiveSegment={currentTime >= parseTimeToSeconds(item.start) && currentTime <= parseTimeToSeconds(item.end)}
        />
      ))}

      {/* empty state */}
      {processedSegments.length === 0 && (
        <div className="text-center text-gray-400 text-sm py-8">بخش زمان‌بندی اطلاعاتی ندارد.</div>
      )}
    </div>
  );
};

export default TimestampList;