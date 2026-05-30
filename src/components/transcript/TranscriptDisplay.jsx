// src/components/transcript/TranscriptDisplay.jsx
import { useState, useEffect, useRef } from "react";
import {
  FaMicrophone,
  FaUpload,
  FaLink,
  FaSpinner,
  FaExclamationTriangle,
  FaStop,
  FaCopy,
  FaDownload,
  FaSyncAlt,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";

const TranscriptDisplay = ({
  selectedLanguage,
  activeButton,
  isRecording,
  onRecordToggle,
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  const formatPlayerTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const mins = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(timeInSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const parseTimeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(":").map(parseFloat);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return parseFloat(timeStr) || 0;
  };

  useEffect(() => {
    if (isSuccess && audioUrl) {
      audioRef.current = new Audio(audioUrl);

      const audio = audioRef.current;

      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleAudioEnded = () => setIsPlaying(false);

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleAudioEnded);

      return () => {
        audio.pause();
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleAudioEnded);
      };
    }
  }, [isSuccess, audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleStopAndComplete = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    if (onReset) onReset();
  };

  const handleSeekChange = (e) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleVolumeChange = (e) => {
    const targetVolume = parseFloat(e.target.value);
    setVolume(targetVolume);
    if (audioRef.current) {
      audioRef.current.volume = targetVolume;
      audioRef.current.muted = targetVolume === 0;
    }
    setIsMuted(targetVolume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuteState = !isMuted;
    setIsMuted(nextMuteState);
    audioRef.current.muted = nextMuteState;
    if (!nextMuteState && volume === 0) {
      setVolume(0.5);
      audioRef.current.volume = 0.5;
    }
  };

  const handleUrlSubmitAction = () => {
    if (linkUrl && onLinkSubmit) {
      onLinkSubmit(linkUrl);
    }
  };

  const handleCopy = () => {
    if (!transcriptText) return;
    navigator.clipboard.writeText(transcriptText);
    alert("متن با موفقیت کپی شد.");
  };

  const handleDownload = () => {
    if (!transcriptText) return;
    const element = document.createElement("a");
    const file = new Blob([transcriptText], {
      type: "text/plain;charset=utf-8",
    });
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
        <p className="text-gray-500 text-sm">
          در حال پردازش و تبدیل گفتار به متن...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-b-xl rounded-tl-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center gap-3 text-center min-h-[300px]">
        <FaExclamationTriangle className="text-red-500 text-5xl" />
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={onReset}
          className="mt-2 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-lg transition-colors font-semibold"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (isSuccess && transcriptText) {
    return (
      <div className="bg-white rounded-b-xl rounded-tl-xl shadow-sm border border-gray-200 min-h-[380px] flex flex-col transition-all overflow-hidden" dir="rtl">
        {/* هدر باکس - تب‌ها در سمت راست، ابزارها در سمت چپ */}
        <div className="flex flex-row justify-between items-center px-6 py-3 border-b border-gray-100 bg-gray-50/50">
          {/* راست: تب‌ها */}
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("simple")}
              className={`pb-1 text-sm font-bold transition-all ${
                activeTab === "simple"
                  ? "text-gray-800 border-b-2 border-gray-800"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              متن ساده
            </button>
            <button
              onClick={() => setActiveTab("timestamp")}
              className={`pb-1 text-sm font-bold transition-all ${
                activeTab === "timestamp"
                  ? "text-gray-800 border-b-2 border-gray-800"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              بندی شده متن زمان
            </button>
          </div>

          {/* چپ: ابزارها */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                onReset();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00BA9F] text-white text-xs font-bold rounded-lg hover:bg-[#009b84] transition-colors"
            >
              <FaSyncAlt className="text-[10px]" />
              <span>شروع دوباره</span>
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                title="کپی متن"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaCopy />
              </button>
              <button
                onClick={handleDownload}
                title="دانلود فایل"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaDownload />
              </button>
            </div>
          </div>
        </div>

        {/* بدنه نمایش متون با اسکرول */}
        <div className="p-6 flex-1 bg-white max-h-80 overflow-y-auto">
          {activeTab === "simple" ? (
            <div className="text-gray-700 leading-relaxed text-right text-base whitespace-pre-wrap font-medium">
              {transcriptText}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {segments.map((item, index) => {
                const startSec = parseTimeToSeconds(item.start);
                const endSec = parseTimeToSeconds(item.end);
                const isActiveSegment =
                  currentTime >= startSec && currentTime <= endSec;

                return (
                  <div
                    key={index}
                    className={`flex flex-row items-center justify-between p-3 rounded-xl border transition-all ${
                      isActiveSegment
                        ? "bg-blue-50/80 border-blue-100 text-blue-600 shadow-sm"
                        : "bg-gray-50/60 border-transparent text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {/* محتوای متن در سمت راست هر سطر */}
                    <div className="text-right text-sm font-medium flex-1 pl-4">
                      {item.text || "[---]"}
                    </div>
                    {/* زمان‌ها در سمت چپ هر سطر مطابق عکس */}
                    <div
                      className={`font-mono text-sm font-semibold tracking-wide flex gap-2 pr-2 border-r border-transparent ${
                        isActiveSegment ? "text-blue-500" : "text-blue-400/80"
                      }`}
                      dir="ltr"
                    >
                      <span>
                        {item.start ? item.start.split(".")[0] : "00:00"}
                      </span>
                      <span className="text-gray-300"> </span>
                      <span>{item.end ? item.end.split(".")[0] : "00:00"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* پلیر صوتی کامپوننت - چیدمان کاملاً هماهنگ با تصویر دوم فیگما */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex flex-row items-center gap-4 select-none" dir="ltr">
          {/* سمت چپ: دکمه‌های کنترل (پلی/پوز و دکمه مربع استپ) */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={togglePlayPause}
              className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs hover:bg-gray-700 transition-colors"
            >
              {isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
            </button>
            
            {/* دکمه مربع برای توقف کامل مدیا */}
            <button
              onClick={handleStopAndComplete}
              className="w-8 h-8 rounded-md bg-gray-200 text-gray-700 flex items-center justify-center text-xs hover:bg-gray-300 transition-colors"
              title="توقف و بازنشانی"
            >
              <div className="w-2.5 h-2.5 bg-gray-600 rounded-sm"></div>
            </button>
          </div>

          {/* وسط: نوار پیشرفت صوتی با رنگ آکسنت آبی */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeekChange}
            className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer outline-none"
            style={{ accentColor: "#3B82F6" }}
          />

          {/* نمایش زمان سپری شده */}
          <div className="font-mono text-sm font-semibold text-gray-700 min-w-[40px] text-center">
            {formatPlayerTime(currentTime)}
          </div>

          <div className="text-gray-300">|</div>

          {/* سمت راست: تنظیم ولوم صدا با آیکون و اسلایدر خاکستری */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={toggleMute}
              className="text-gray-500 hover:text-gray-700 text-base transition-colors"
            >
              {isMuted ? <FaVolumeMute className="text-red-400" /> : <FaVolumeUp />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer outline-none"
              style={{ accentColor: "#4B5563" }}
            />
          </div>
        </div>
      </div>
    );
  }

  const renderInputForm = () => {
    switch (activeButton) {
      case "record":
        return (
          <div className="flex flex-col items-center justify-center gap-4 text-center py-8">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                isRecording
                  ? "bg-red-100 animate-pulse"
                  : "bg-emerald-50 hover:bg-emerald-100"
              }`}
              onClick={onRecordToggle}
            >
              {isRecording ? (
                <FaStop className="text-red-600 text-3xl" />
              ) : (
                <FaMicrophone className="text-[#00BA9F] text-3xl" />
              )}
            </div>
            <p className="text-gray-500 text-sm">
              {isRecording
                ? "در حال ضبط صدا... برای اتمام و ارسال کلیک کنید"
                : "برای شروع ضبط، روی آیکون میکروفون کلیک کنید"}
            </p>
          </div>
        );

      case "upload":
        return (
          <div className="flex flex-col items-center justify-center gap-4 text-center py-8">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
              <FaUpload className="text-[#00BA9F] text-3xl" />
            </div>
            <p className="text-gray-500 text-sm">
              فایل صوتی یا تصویری خود را از بخش بالا بارگذاری کنید تا متن آن
              نمایش داده شود.
            </p>
          </div>
        );

      case "link":
        return (
          <div className="flex flex-col items-center justify-center gap-4 text-center py-8 w-full max-w-md mx-auto">
            <p className="text-gray-600 text-sm">
              لینک مستقیم فایل صوتی یا تصویری را وارد کنید
            </p>
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
              <button
                onClick={handleUrlSubmitAction}
                disabled={!linkUrl}
                className="px-5 py-2 bg-[#00BA9F] text-white rounded-md hover:bg-[#009b84] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold flex-shrink-0"
              >
                تبدیل
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-400 py-14">
            <p className="text-base font-medium">
              متن پیاده شده آن، در اینجا ظاهر می‌شود...
            </p>
            <p className="text-xs mt-2 text-gray-400/80">
              برای شروع، یکی از گزینه‌های بالا را انتخاب کنید
            </p>
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