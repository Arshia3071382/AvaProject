// src/components/transcript/TranscriptDisplay.jsx
import { useState, useRef } from "react";
import {
  FaMicrophone, FaUpload, FaLink, FaSpinner, 
  FaExclamationTriangle, FaStop, FaCopy, FaDownload, FaSyncAlt
} from "react-icons/fa";
import { useAudioHandler } from "../../hooks/useAudioHandler";
import TimestampList from "./TimestampList";
import AudioActionBar from "../ui/AudioActionBar";

const TranscriptDisplay = ({
  selectedLanguage,
  activeButton,
  isRecording,
  onRecordToggle,
  onFileUpload, // اضافه شدن پروپ آپلود فایل به این کامپوننت
  onLinkSubmit,
  isLoading,
  transcriptText,
  error,
  isSuccess,
  onReset,
  segments = [],
  audioUrl = "",
}) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [activeTab, setActiveTab] = useState("simple");
  const fileInputRef = useRef(null);

  const audioControls = useAudioHandler(isSuccess, audioUrl);

  const handleUrlSubmitAction = () => {
    if (linkUrl && onLinkSubmit) onLinkSubmit(linkUrl);
  };

  const handleCopy = () => {
    if (!transcriptText) return;
    navigator.clipboard.writeText(transcriptText);
    alert("متن با موفقیت کپی شد.");
  };

  const handleDownload = () => {
    if (!transcriptText) return;
    const element = document.createElement("a");
    const file = new Blob([transcriptText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = "ava-transcript.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-b-xl rounded-tl-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center gap-4 min-h-[300px]">
        <FaSpinner className="text-[#00BA9F] text-5xl animate-spin" />
        <p className="text-gray-500 text-sm">در حال پردازش و تبدیل گفتار به متن...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-b-xl rounded-tl-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center gap-3 text-center min-h-[300px]">
        <FaExclamationTriangle className="text-red-500 text-5xl" />
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={onReset} className="mt-2 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-lg transition-colors font-semibold">
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (isSuccess && transcriptText) {
    return (
      <div className="bg-white rounded-b-xl rounded-tl-xl shadow-sm border border-gray-200 min-h-[380px] flex flex-col transition-all overflow-hidden" dir="rtl">
        <div className="flex flex-row justify-between items-center px-6 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex gap-6">
            <button onClick={() => setActiveTab("simple")} className={`pb-1 text-sm font-bold transition-all ${activeTab === "simple" ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-400 hover:text-gray-600"}`}>
              متن ساده
            </button>
            <button onClick={() => setActiveTab("timestamp")} className={`pb-1 text-sm font-bold transition-all ${activeTab === "timestamp" ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-400 hover:text-gray-600"}`}>
              متن زمان بندی شده
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                audioControls.stopAndReset();
                onReset();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00BA9F] text-white text-xs font-bold rounded-lg hover:bg-[#009b84] transition-colors"
            >
              <FaSyncAlt className="text-[10px]" />
              <span>شروع دوباره</span>
            </button>
            <div className="flex items-center gap-1">
              <button onClick={handleCopy} title="کپی متن" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <FaCopy />
              </button>
              <button onClick={handleDownload} title="دانلود فایل" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <FaDownload />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 bg-white max-h-80 overflow-y-auto">
          {activeTab === "simple" ? (
            <div className="text-gray-700 leading-relaxed text-right text-base whitespace-pre-wrap font-medium">
              {transcriptText}
            </div>
          ) : (
            <TimestampList segments={segments} currentTime={audioControls.currentTime} />
          )}
        </div>

        <AudioActionBar
          isPlaying={audioControls.isPlaying}
          currentTime={audioControls.currentTime}
          duration={audioControls.duration}
          volume={audioControls.volume}
          isMuted={audioControls.isMuted}
          onTogglePlay={audioControls.togglePlayPause}
          onStop={audioControls.stopAndReset}
          onSeek={audioControls.seek}
          onVolumeChange={audioControls.changeVolume}
          onToggleMute={audioControls.toggleMute}
        />
      </div>
    );
  }

  const renderInputForm = () => {
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
            {/* کلیک روی این دکمه پنجره انتخاب فایل را باز می‌کند */}
            <div 
              className="w-20 h-20 bg-emerald-50 hover:bg-emerald-100 rounded-full flex items-center justify-center cursor-pointer shadow-sm transition-all"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <FaUpload className="text-[#00BA9F] text-3xl" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onFileUpload} 
              className="hidden" 
              accept="audio/*,video/*"
            />
            <p className="text-gray-500 text-sm font-medium">جهت بارگذاری فایل صوتی یا تصویری، روی آیکون بالا کلیک کنید.</p>
          </div>
        );
      case "link":
        return (
          <div className="flex flex-col items-center justify-center gap-4 text-center py-8 w-full max-w-md mx-auto">
            <p className="text-gray-600 text-sm font-medium">لینک مستقیم فایل صوتی یا تصویری را وارد کنید</p>
            <div className="w-full flex items-center border border-gray-300 rounded-lg focus-within:border-[#00BA9F] overflow-hidden bg-gray-50 px-3 py-1">
              <FaLink className="text-[#00BA9F] text-lg flex-shrink-0" />
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com/audio.mp3"
                className="w-full px-3 py-2 bg-transparent focus:outline-none text-left font-mono text-sm"
                dir="ltr"
                onKeyDown={(e) => e.key === "Enter" && handleUrlSubmitAction()}
              />
              <button onClick={handleUrlSubmitAction} disabled={!linkUrl} className="px-5 py-2 bg-[#00BA9F] text-white rounded-md hover:bg-[#009b84] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold flex-shrink-0">
                تبدیل
              </button>
            </div>
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

  return (
    <div className="bg-white rounded-b-xl rounded-tl-xl shadow-sm border border-gray-200 min-h-[250px] transition-all">
      {renderInputForm()}
    </div>
  );
};

export default TranscriptDisplay;