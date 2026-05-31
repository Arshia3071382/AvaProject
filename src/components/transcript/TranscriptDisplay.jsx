import { useState, useRef, useMemo } from "react";
import { useAudioHandler } from "../../hooks/useAudioHandler";
import TranscriptLoading from "./TranscriptLoading";
import TranscriptError from "./TranscriptError";
import TranscriptInputForms from "./TranscriptInputForms";
import TranscriptResultView from "./TranscriptResultView";


const parseTimeToSeconds = (timeInput) => {
  if (!timeInput) return 0;
  if (typeof timeInput === "number") return timeInput;
  const parts = String(timeInput).trim().split(":").map(parseFloat);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
};

const TranscriptDisplay = ({
  activeButton, isRecording, onRecordToggle, onFileUpload, onLinkSubmit, 
  isLoading, transcriptText, error, isSuccess, onReset, segments = [], audioUrl = ""
}) => {
  const [activeTab, setActiveTab] = useState("simple");
  const fileInputRef = useRef(null);
  const audioControls = useAudioHandler(isSuccess, audioUrl);

  
  const getBorderColorClass = () => {
    switch (activeButton) {
      case "record":
        return "border-[#00BA9F]"; 
      case "upload":
        return "border-blue-600"; 
      case "link":
        return "border-red-600"; 
      default:
        return "border-gray-200"; 
    }
  };

  // inject silence
  const allSegments = useMemo(() => {
    if (!segments || segments.length === 0) return [];
    const sorted = [...segments].sort((a, b) => parseTimeToSeconds(a.start) - parseTimeToSeconds(b.start));
    const result = [];
    
    if (parseTimeToSeconds(sorted[0].start) > 0.5) {
      result.push({ start: 0, end: parseTimeToSeconds(sorted[0].start), text: "[---]", isSilence: true });
    }
    for (let i = 0; i < sorted.length; i++) {
      const cur = { start: parseTimeToSeconds(sorted[i].start), end: parseTimeToSeconds(sorted[i].end), text: sorted[i].text };
      result.push(cur);
      if (i < sorted.length - 1) {
        const nextStart = parseTimeToSeconds(sorted[i + 1].start);
        if (nextStart - cur.end > 0.8) result.push({ start: cur.end, end: nextStart, text: "[---]", isSilence: true });
      }
    }
    return result;
  }, [segments]);

  if (isLoading) return <TranscriptLoading />;
  if (error) return <TranscriptError error={error} onReset={onReset} />;

  if (isSuccess && transcriptText) {
    return (
      <TranscriptResultView 
        activeTab={activeTab} setActiveTab={setActiveTab} transcriptText={transcriptText} 
        allSegments={allSegments} segments={segments} audioControls={audioControls} onReset={onReset}
        handleDownload={() => {
          const el = document.createElement("a");
          el.href = URL.createObjectURL(new Blob([transcriptText], { type: "text/plain;charset=utf-8" }));
          el.download = "ava-transcript.txt"; document.body.appendChild(el); el.click(); el.remove();
        }}
        handleCopy={() => { navigator.clipboard.writeText(transcriptText); alert("متن با موفقیت کپی شد."); }}
      />
    );
  }

  return (
    
    <div className={`bg-white rounded-b-xl rounded-tl-xl shadow-sm border-2 ${getBorderColorClass()} min-h-[250px] transition-all duration-300`}>
      <TranscriptInputForms activeButton={activeButton} isRecording={isRecording} onRecordToggle={onRecordToggle} onFileUpload={onFileUpload} onLinkSubmit={onLinkSubmit} fileInputRef={fileInputRef} />
    </div>
  );
};

export default TranscriptDisplay;