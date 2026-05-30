
import { useState, useEffect } from "react";
import { 
  FaTrashAlt, FaCopy, FaFileWord, FaDownload, 
  FaLink, FaFileAudio, FaMicrophone, FaChevronDown, FaChevronUp 
} from "react-icons/fa";
import TranscriptDisplay from "../components/transcript/TranscriptDisplay";
import { getArchive, deleteFromArchive } from "../services/storage";

const ArchivePage = () => {
  const [archiveData, setArchiveData] = useState([]);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setArchiveData(getArchive());
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = archiveData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(archiveData.length / itemsPerPage);

  const handleRowClick = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation(); 
    if (window.confirm("آیا از حذف این فایل صوتی مطمئن هستید؟")) {
      const updated = deleteFromArchive(id);
      setArchiveData(updated);
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const renderTypeIcon = (type) => {
    const baseStyle = "w-8 h-8 rounded-full text-white flex items-center justify-center text-sm shadow-sm flex-shrink-0";
    if (type === "link") return <div className={`${baseStyle} bg-[#FF2D55]`}><FaLink /></div>;
    if (type === "upload") return <div className={`${baseStyle} bg-[#1473E6]`}><FaFileAudio /></div>;
    return <div className={`${baseStyle} bg-[#00BA9F]`}><FaMicrophone /></div>;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10 mb-16" dir="rtl">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-100">
        آرشیو فایل‌های صوتی واقعی
      </h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 px-6 py-4 text-xs md:text-sm font-bold text-gray-500 border-b border-gray-100 text-center">
          <div className="col-span-5 text-right pr-12">نام فایل</div>
          <div className="col-span-2">تاریخ بارگذاری</div>
          <div className="col-span-1">نوع فایل</div>
          <div className="col-span-1">مدت زمان</div>
          <div className="col-span-3">عملیات</div>
        </div>

        <div className="divide-y divide-gray-100">
          {currentItems.map((file) => {
            const isExpanded = expandedRowId === file.id;
            return (
              <div key={file.id} className="transition-all duration-200">
                <div 
                  onClick={() => handleRowClick(file.id)}
                  className={`grid grid-cols-12 px-6 py-4 text-xs md:text-sm items-center text-center cursor-pointer hover:bg-gray-50/70 transition-colors ${isExpanded ? "bg-[#00BA9F]/5 font-medium" : ""}`}
                >
                  <div className="col-span-5 flex items-center gap-4 text-right overflow-hidden">
                    {renderTypeIcon(file.type)}
                    <span className="text-gray-700 font-medium truncate text-left md:text-right w-full block" dir="ltr">
                      {file.name}
                    </span>
                  </div>
                  <div className="col-span-2 text-gray-500 font-mono">{file.uploadDate}</div>
                  <div className="col-span-1 text-gray-500 font-mono">{file.fileType}</div>
                  <div className="col-span-1 text-gray-500 font-mono">{file.duration}</div>

                  <div className="col-span-3 flex items-center justify-center gap-3 md:gap-4 text-gray-400">
                    <button onClick={(e) => handleDelete(file.id, e)} className="hover:text-red-500 transition-colors" title="حذف"><FaTrashAlt className="text-sm md:text-base" /></button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        navigator.clipboard.writeText(file.transcriptText); 
                        window.alert("متن کپی شد");
                      }} 
                      className="hover:text-gray-600 transition-colors" 
                      title="کپی متن"
                    >
                      <FaCopy className="text-sm md:text-base" />
                    </button>
                    <button onClick={(e) => e.stopPropagation()} className="hover:text-blue-500 transition-colors" title="مشاهده در ورد"><FaFileWord className="text-sm md:text-base" /></button>
                    <button onClick={(e) => e.stopPropagation()} className="hover:text-[#00BA9F] transition-colors" title="دانلود فایل صوتی"><FaDownload className="text-sm md:text-base" /></button>
                    <div className="text-gray-300 ml-1">
                      {isExpanded ? <FaChevronUp className="text-xs text-[#00BA9F]" /> : <FaChevronDown className="text-xs" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 bg-gray-50/50 border-t border-b border-gray-100/70">
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
                        onReset={() => setExpandedRowId(null)}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {archiveData.length === 0 && (
            <div className="p-12 text-center text-gray-400 text-sm">آرشیو خالی است.</div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 text-xs md:text-sm text-gray-500 font-mono" dir="ltr">
          <button 
            disabled={currentPage === 1}
            onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); setExpandedRowId(null); }}
            className={`px-2 py-1 rounded ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}`}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => { setCurrentPage(i + 1); setExpandedRowId(null); }}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${i + 1 === currentPage ? "bg-[#00BA9F] text-white" : "hover:bg-gray-100 text-gray-600"}`}
            >
              {i + 1}
            </button>
          ))}
          <button 
            disabled={currentPage === totalPages}
            onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); setExpandedRowId(null); }}
            className={`px-2 py-1 rounded ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}`}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default ArchivePage;