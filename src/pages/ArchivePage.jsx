import { useState, useEffect } from "react";
import { getArchive, deleteFromArchive } from "../services/storage";
import ArchiveHeader from "../components/archive/ArchiveHeader";
import ArchiveRow from "../components/archive/ArchiveRow";

const ArchivePage = () => {
  // component states
  const [archiveData, setArchiveData] = useState([]);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // load data
  useEffect(() => {
    setArchiveData(getArchive());
  }, []);

  // pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = archiveData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(archiveData.length / itemsPerPage);

  // toggle row
  const handleRowClick = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  // delete item
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

  return (
    // main container
    <div className="max-w-[1400px] w-full mx-auto px-6 mt-10 mb-16" dir="rtl">
      <h2 className="text-2xl font-bold text-[#00BA9F] mb-6 border-b pb-3 border-gray-100">
        آرشیو من
      </h2>

      {/* data table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
        <ArchiveHeader />

        <div className="divide-y divide-gray-100">
          {currentItems.map((file) => (
            <ArchiveRow 
              key={file.id}
              file={file}
              isExpanded={expandedRowId === file.id}
              onRowClick={() => handleRowClick(file.id)}
              onDelete={handleDelete}
            />
          ))}
          
          {archiveData.length === 0 && (
            <div className="p-12 text-center text-gray-400 text-sm">آرشیو خالی است.</div>
          )}
        </div>
      </div>

      {/* table pagination */}
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