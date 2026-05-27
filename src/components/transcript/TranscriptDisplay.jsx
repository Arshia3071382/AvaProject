import { useState } from 'react';
import { FaMicrophone, FaUpload, FaLink, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaStop } from 'react-icons/fa';

const TranscriptDisplay = ({ 
  activeButton, 
  isRecording,
  onRecordToggle, 
  onLinkSubmit, 
  isLoading,
  transcriptText,
  error,
  isSuccess
}) => {
  const [linkUrl, setLinkUrl] = useState('');

  const handleSubmitLink = () => {
    if (linkUrl && onLinkSubmit) {
      onLinkSubmit(linkUrl);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-b-xl rounded-tl-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center gap-4 min-h-[250px]">
        <FaSpinner className="text-[#00BA9F] text-5xl animate-spin" />
        <p className="text-gray-500 text-sm">در حال پردازش و تبدیل گفتار به متن...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-b-xl rounded-tl-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center gap-3 text-center min-h-[250px]">
        <FaExclamationTriangle className="text-red-500 text-5xl" />
        <p className="text-red-600 font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-lg transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (isSuccess && transcriptText) {
    return (
      <div className="bg-white rounded-b-xl rounded-tl-xl shadow-sm border border-gray-200 p-6 min-h-[250px] flex flex-col gap-4">
        <div className="flex items-center gap-2 text-green-600 border-b border-green-100 pb-2">
          <FaCheckCircle />
          <span className="text-sm font-semibold">تبدیل با موفقیت انجام شد</span>
        </div>
        <div className="text-gray-700 leading-relaxed text-right max-h-96 overflow-y-auto text-base whitespace-pre-wrap">
          {transcriptText}
        </div>
      </div>
    );
  }

  const renderInputForm = () => {
    switch (activeButton) {
      case 'record':
        return (
          <div className="flex flex-col items-center justify-center gap-4 text-center py-6">
            <div 
              className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                isRecording ? 'bg-red-100 animate-pulse' : 'bg-emerald-50 hover:bg-emerald-100'
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
                ? 'در حال ضبط صدا... برای اتمام و ارسال کلیک کنید' 
                : 'برای شروع ضبط، روی آیکون میکروفون کلیک کنید'}
            </p>
          </div>
        );
      
      case 'upload':
        return (
          <div className="flex flex-col items-center justify-center gap-4 text-center py-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
              <FaUpload className="text-blue-600 text-3xl" />
            </div>
            <p className="text-gray-500 text-sm">
              فایل صوتی یا تصویری خود را از بخش بالا بارگذاری کنید تا متن آن نمایش داده شود.
            </p>
          </div>
        );
      
      case 'link':
        return (
          <div className="flex flex-col items-center justify-center gap-4 text-center py-6 w-full max-w-md mx-auto">
            <p className="text-gray-600 text-sm">لینک مستقیم فایل صوتی یا تصویری را وارد کنید</p>
            <div className="w-full flex items-center border border-gray-300 rounded-lg focus-within:border-[#00BA9F] overflow-hidden bg-gray-50 px-3 py-1">
              <FaLink className="text-purple-600 text-lg flex-shrink-0" />
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com/audio.mp3"
                className="w-full px-3 py-2 bg-transparent focus:outline-none text-left"
                dir="ltr"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitLink()}
              />
              <button
                onClick={handleSubmitLink}
                disabled={!linkUrl}
                className="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                تبدیل
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center text-gray-400 py-12">
            <p className="text-base">متن پیاده شده آن، در اینجا ظاهر می‌شود...</p>
            <p className="text-xs mt-2">برای شروع، یکی از گزینه‌های بالا را انتخاب کنید</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-b-xl rounded-tl-xl shadow-sm border border-gray-200 p-6 min-h-[250px] transition-all">
      {renderInputForm()}
    </div>
  );
};

export default TranscriptDisplay;