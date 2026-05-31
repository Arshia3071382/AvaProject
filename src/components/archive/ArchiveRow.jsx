import React from "react";
import { 
  FaTrashAlt, FaCopy, FaFileWord, FaDownload, 
  FaLink, FaFileAudio, FaMicrophone, FaChevronDown, FaChevronUp 
} from "react-icons/fa";
import TranscriptDisplay from "../transcript/TranscriptDisplay";

const ArchiveRow = ({ file, isExpanded, onRowClick, onDelete }) => {
  
  // file icons
  const renderTypeIcon = (type) => {
    const baseStyle = "w-8 h-8 rounded-full text-white flex items-center justify-center text-sm shadow-sm flex-shrink-0";
    if (type === "link") return <div className={`${baseStyle} bg-[#FF2D55]`}><FaLink /></div>;
    if (type === "upload") return <div className={`${baseStyle} bg-[#1473E6]`}><FaFileAudio /></div>;
    return <div className={`${baseStyle} bg-[#00BA9F]`}><FaMicrophone /></div>;
  };

  // copy logic
  const handleCopyText = (e, text) => {
    e.stopPropagation(); 
    navigator.clipboard.writeText(text); 
    window.alert("متن با موفقیت کپی شد");
  };

  return (
    <div className="transition-all duration-200">
      {/* row details */}
      <div 
        onClick={onRowClick}
        className={`grid grid-cols-12 px-8 py-5 text-xs md:text-sm items-center text-center cursor-pointer hover:bg-gray-50/80 transition-colors whitespace-nowrap ${isExpanded ? "bg-[#00BA9F]/5 font-medium" : ""}`}
      >
        <div className="col-span-4 flex items-center gap-4 text-right overflow-hidden">
          {renderTypeIcon(file.type)}
          <span className="text-gray-700 font-medium truncate text-right w-full block" dir="ltr">
            {file.name}
          </span>
        </div>
        <div className="col-span-2 text-gray-500 font-mono">{file.uploadDate}</div>
        <div className="col-span-1 text-gray-500 font-mono">{file.fileType}</div>
        <div className="col-span-2 text-gray-500 font-mono">{file.duration}</div>

        {/* action buttons */}
        <div className="col-span-3 flex items-center justify-center gap-5 md:gap-6 text-gray-400">
          <button 
            onClick={(e) => e.stopPropagation()} 
            className="hover:text-[#00BA9F] transition-colors relative group" 
            title={file.fileSize ? `${file.fileSize}` : "دانلود فایل صوتی"}
          >
            <FaDownload className="text-sm md:text-base" />
          </button>

          <button 
            onClick={(e) => e.stopPropagation()} 
            className="hover:text-blue-500 transition-colors" 
            title="مشاهده در ورد"
          >
            <FaFileWord className="text-sm md:text-base" />
          </button>

          <button 
            onClick={(e) => handleCopyText(e, file.transcriptText)} 
            className="hover:text-gray-600 transition-colors" 
            title="کپی متن"
          >
            <FaCopy className="text-sm md:text-base" />
          </button>
          
          <button 
            onClick={(e) => onDelete(file.id, e)} 
            className="hover:text-red-500 transition-colors" 
            title="حذف"
          >
            <FaTrashAlt className="text-sm md:text-base" />
          </button>

          <div className="text-gray-300 mr-2 flex items-center">
            {isExpanded ? <FaChevronUp className="text-xs text-[#00BA9F]" /> : <FaChevronDown className="text-xs" />}
          </div>
        </div>
      </div>

      {/* expand section */}
      {isExpanded && (
        <div className="px-8 pb-6 bg-gray-50/40 border-t border-b border-gray-100/70">
          <div className="mt-4 rounded-xl border border-gray-200/80 bg-white overflow-hidden shadow-inner">
            <TranscriptDisplay
              activeButton={file.type}
              isRecording={false}
              isLoading={false}
              isSuccess={true}
              transcriptText={file.transcriptText}
              segments={file.segments}
              audioUrl={file.audioUrl}
              selectedLanguage="fa"
              onReset={() => onRowClick()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveRow;