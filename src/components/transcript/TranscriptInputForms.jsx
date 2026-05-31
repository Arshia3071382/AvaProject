import React, { useState } from "react";
import { FaMicrophone, FaUpload, FaLink, FaStop } from "react-icons/fa";

const TranscriptInputForms = ({ activeButton, isRecording, onRecordToggle, onFileUpload, onLinkSubmit, fileInputRef }) => {
  const [linkUrl, setLinkUrl] = useState("");

  const handleUrlSubmitAction = () => {
    if (linkUrl && onLinkSubmit) onLinkSubmit(linkUrl);
  };

  // select form
  switch (activeButton) {
    case "record":
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center py-8">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all ${isRecording ? "bg-red-100 animate-pulse shadow-md" : "bg-emerald-50 hover:bg-emerald-100 shadow-sm"}`}
            onClick={onRecordToggle}
          >
            {isRecording ? <FaStop className="text-red-600 text-3xl" /> : <FaMicrophone className="text-[#00BA9F] text-3xl" />}
          </div>
          <p className="text-gray-500 text-sm font-medium">
            {isRecording ? "در حال ضبط صدا... برای اتمام و ارسال کلیک کنید" : "برای شروع ضبط، روی آیکون میکروفون کلیک کنید"}
          </p>
        </div>
      );
    case "upload":
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center py-8">
          <div
            className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-sm transition-all"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <FaUpload className="text-white text-3xl" />
          </div>
          <input type="file" ref={fileInputRef} onChange={onFileUpload} className="hidden" accept="audio/*,video/*" />
          <p className="text-gray-500 text-sm font-medium">
            جهت بارگذاری فایل صوتی یا تصویری، روی آیکون بالا کلیک کنید.
          </p>
        </div>
      );
    case "link":
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center py-8 w-full max-w-md mx-auto mt-10">
          <div className="w-full flex items-center border border-gray-300 rounded-lg focus-within:border-[#00BA9F] overflow-hidden bg-gray-50 px-3 py-1">
            <button
              onClick={handleUrlSubmitAction}
              disabled={!linkUrl}
              className="px-5 py-2 bg-[#00BA9F] text-white rounded-md hover:bg-[#009b84] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold flex-shrink-0"
            >
              تبدیل
            </button>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com/audio.mp3"
              className="w-full px-3 py-2 bg-transparent focus:outline-none text-left font-mono text-sm"
              dir="ltr"
              onKeyDown={(e) => e.key === "Enter" && handleUrlSubmitAction()}
            />
            <FaLink className="text-white bg-red-600 rounded-full text-2xl p-1 flex-shrink-0" />
          </div>
          <p className="text-gray-600 text-sm font-medium">
            نشانی اینترنتی فایل حاوی گفتار (صوتی/تصویری) را وارد و دکمه را فشار دهید
          </p>
        </div>
      );
    default:
      return (
        <div className="text-center text-gray-400 py-14">
          <p className="text-base font-medium">متن پیاده شده آن، در اینجا ظاهر می‌شود...</p>
          <p className="text-xs mt-2 text-gray-400/80">برای شروع، یکی از گزینه‌های بالا را انتخاب کنید</p>
        </div>
      );
  }
};

export default TranscriptInputForms;