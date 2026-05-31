import React from "react";
import { FaCopy, FaDownload, FaSyncAlt } from "react-icons/fa";
import TimestampList from "./TimestampList";
import AudioActionBar from "../ui/AudioActionBar";

const TranscriptResultView = ({ 
  activeTab, setActiveTab, transcriptText, allSegments, segments, 
  audioControls, onReset, handleDownload, handleCopy 
}) => {
  return (
    <div className="bg-white rounded-b-xl rounded-tl-xl shadow-sm border border-gray-200 min-h-[380px] flex flex-col transition-all overflow-hidden" dir="rtl">
      {/* head actions */}
      <div className="flex flex-row justify-between items-center px-6 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex gap-6">
          <button onClick={() => setActiveTab("simple")} className={`pb-2 text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === "simple" ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-400 hover:text-gray-600"}`}>
            <img className="w-4 h-4 md:w-5 md:h-5 object-contain mt-1" src="/images/text Icon.png" alt="text" />
            <span>متن ساده</span>
          </button>
          <button onClick={() => setActiveTab("timestamp")} className={`pb-2 text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === "timestamp" ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-400 hover:text-gray-600"}`}>
            <img className="w-3 h-3 md:w-5 md:h-5 object-contain mt-1" src="/images/time Icon.png" alt="time" />
            <span>متن زمان بندی شده</span>
          </button>
        </div>

        <div className="flex flex-row-reverse items-center gap-4">
          <button onClick={() => { audioControls.stopAndReset(); onReset(); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-[#009b84] transition-colors">
            <FaSyncAlt className="text-[10px]" />
            <span>شروع دوباره</span>
          </button>
          <div className="flex items-center gap-1">
            <button onClick={handleDownload} title="دانلود فایل" className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><FaDownload /></button>
            <button onClick={handleCopy} title="کپی متن" className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><FaCopy /></button>
          </div>
        </div>
      </div>

      {/* content box */}
      <div className="p-6 flex-1 bg-white max-h-80 overflow-y-auto">
        {activeTab === "simple" ? (
          <div className="text-gray-700 leading-relaxed text-right text-base font-medium whitespace-pre-wrap">
            {allSegments.length > 0 ? (
              allSegments.map((item, index) => {
                const isActive = audioControls.currentTime >= (item.start || 0) && audioControls.currentTime <= (item.end || 0);
                return (
                  <span key={index} className={`transition-all duration-200 inline-block rounded px-0.5 ${isActive ? "text-blue-600 font-bold bg-blue-50/40" : item.isSilence ? "text-gray-400 font-mono" : "text-gray-700"}`}>
                    {item.isSilence ? " [---] " : ` ${String(item.text).trim()} `}
                  </span>
                );
              })
            ) : transcriptText}
          </div>
        ) : (
          <TimestampList segments={segments} currentTime={audioControls.currentTime} />
        )}
      </div>

      <AudioActionBar isPlaying={audioControls.isPlaying} currentTime={audioControls.currentTime} duration={audioControls.duration} volume={audioControls.volume} isMuted={audioControls.isMuted} onTogglePlay={audioControls.togglePlayPause} onStop={audioControls.stopAndReset} onSeek={audioControls.seek} onVolumeChange={audioControls.changeVolume} onToggleMute={audioControls.toggleMute} />
    </div>
  );
};

export default TranscriptResultView;