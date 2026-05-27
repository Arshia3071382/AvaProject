import { FaUpload, FaLink } from 'react-icons/fa';

const ActionButtons = ({ 
  onFileUpload, 
  activeButton,
  onButtonChange,
  isRecording,
  onStartRecording,
  onStopRecording
}) => {

  const handleRecordClick = () => {
    if (isRecording) {
      if (onStopRecording) onStopRecording();
      if (onButtonChange) onButtonChange(null);
    } else {
      if (onStartRecording) onStartRecording();
      if (onButtonChange) onButtonChange('record');
    }
  };

  const handleUploadClick = () => {
    if (onButtonChange) onButtonChange('upload');
    document.getElementById('fileInput').click();
  };

  const handleLinkClick = () => {
    if (onButtonChange) onButtonChange('link');
  };

  const handleFileChange = (event) => {
    if (onFileUpload) {
      onFileUpload(event);
    }
  };

  const isRecordActive = activeButton === 'record' || isRecording;
  const isUploadActive = activeButton === 'upload';
  const isLinkActive = activeButton === 'link';
  const isNoButtonActive = !activeButton;

  return (
    <div className="flex flex-row-reverse justify-start my-8 mb-0 border-none gap-2">
      
      {/* دکمه ضبط صدا */}
      <button
        onClick={handleRecordClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all ${
          isRecording
            ? 'bg-red-600 text-white'
            : isRecordActive
            ? 'bg-[#00BA9F] text-white'
            : isNoButtonActive
            ? 'bg-gray-100 text-gray-500 border border-gray-200'
            : 'bg-white text-gray-500 border border-gray-200'
        }`}
      >
        <div className="flex items-center flex-row-reverse gap-2">
          {isRecording ? (
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
          ) : (
            <img 
              src={isRecordActive ? '/images/mic Icon.png' : '/images/mic Icon(1).png'} 
              alt="mic" 
              className="w-5 h-5"
              onError={(e) => { e.target.style.display = 'none'; }} // در صورت عدم وجود تصویر مخفی شود
            />
          )}
          <span>{isRecording ? 'توقف ضبط' : 'ضبط صدا'}</span>
        </div>
      </button>

      {/* دکمه بارگذاری فایل */}
      <button
        onClick={handleUploadClick}
        className={`flex flex-row-reverse items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all ${
          isUploadActive
            ? 'bg-blue-600 text-white'
            : isNoButtonActive
            ? 'bg-gray-100 text-gray-500 border border-gray-200'
            : 'bg-white text-gray-500 border border-gray-200'
        }`}
      >
        <img 
          src={isUploadActive ? '/images/upload Icon(1).png' : '/images/upload Icon.png'} 
          alt="upload" 
          className="w-5 h-5"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <span>بارگذاری فایل</span>
      </button>

      {/* دکمه لینک */}
      <button
        onClick={handleLinkClick}
        className={`flex flex-row-reverse items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all ${
          isLinkActive
            ? 'bg-purple-600 text-white'
            : isNoButtonActive
            ? 'bg-gray-100 text-gray-500 border border-gray-200'
            : 'bg-white text-gray-500 border border-gray-200'
        }`}
      >
        <img 
          src={isLinkActive ? '/images/chain Icon.png' : '/images/chain Icon(1).png'} 
          alt="link" 
          className="w-5 h-5"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <span>لینک</span>
      </button>

      <input
        id="fileInput"
        type="file"
        accept="audio/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ActionButtons;