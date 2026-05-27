import { FaPlay } from 'react-icons/fa';

const TimestampList = ({ timestamps }) => {
  const handlePlaySegment = (startTime) => {
    console.log('Play from:', startTime);
  };

  if (!timestamps || timestamps.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <div className="space-y-3">
        {timestamps.map((segment, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <button
              onClick={() => handlePlaySegment(segment.start)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaPlay />
            </button>
            
            <span className="text-sm text-gray-500 font-mono min-w-[80px]">
              {segment.start} - {segment.end}
            </span>
            
            <span className="text-gray-700 flex-1">
              {segment.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimestampList;