import React from "react";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const formatPlayerTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds)) return "00:00";
  const mins = Math.floor(timeInSeconds / 60).toString().padStart(2, "0");
  const secs = Math.floor(timeInSeconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const AudioActionBar = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onTogglePlay,
  onStop,
  onSeek,
  onVolumeChange,
  onToggleMute,
}) => {
  
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex flex-row items-center gap-4 select-none" dir="ltr">
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onTogglePlay}
          className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs hover:bg-gray-700 transition-colors"
        >
          {isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
        </button>
        <button
          onClick={onStop}
          className="w-8 h-8 rounded-md bg-gray-200 text-gray-700 flex items-center justify-center text-xs hover:bg-gray-300 transition-colors"
          title="توقف"
        >
          <div className="w-2.5 h-2.5 bg-gray-600 rounded-sm"></div>
        </button>
      </div>

      
      <input
        type="range"
        min={0}
        max={duration || 100}
        value={currentTime}
        step="0.01" 
        onChange={(e) => onSeek(parseFloat(e.target.value))}
        className="flex-1 h-1 rounded-lg appearance-none cursor-pointer outline-none transition-all duration-100 ease-linear"
        style={{
          background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${progressPercent}%, #E5E7EB ${progressPercent}%, #E5E7EB 100%)`,
        }}
      />

      <div className="font-mono text-sm font-semibold text-gray-700 min-w-[40px] text-center">
        {formatPlayerTime(currentTime)}
      </div>

      <div className="text-gray-300">|</div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={onToggleMute} className="text-gray-500 hover:text-gray-700 text-base transition-colors">
          {isMuted ? <FaVolumeMute className="text-red-400" /> : <FaVolumeUp />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={isMuted ? 0 : volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-16 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer outline-none"
          style={{ accentColor: "#4B5563" }}
        />
      </div>
    </div>
  );
};

export default AudioActionBar;