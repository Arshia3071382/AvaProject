import { useState } from "react";
import LanguageSelector from "../components/ui/LanguageSelector";
import HeroSection from "../components/ui/HeroSection";
import TranscriptContainer from "../components/transcript/TranscriptContainer";
import { transcribeFromUrl, transcribeFromFile } from "../services/api";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { processAudioResult } from "../utils/audioHelper";

const HomePage = () => {
  // state management
  const [transcript, setTranscript] = useState("");
  const [segments, setSegments] = useState([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("fa");
  const [activeButton, setActiveButton] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // audio hook
  const { isRecording, startRecording, stopRecording, mediaRecorderRef, audioChunksRef } = useAudioRecorder();

  // reset view
  const handleReset = () => {
    setTranscript(""); setSegments([]); setAudioUrl(""); setActiveButton(null);
    setIsLoading(false); setError(null); setIsSuccess(false);
    if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
  };

  // wrapper function
  const runTranscription = async (transcribeFn, processArgs, errorMsg) => {
    setIsLoading(true); setError(null); setIsSuccess(false);
    setTranscript(""); setSegments([]); setAudioUrl("");
    try {
      const result = await transcribeFn();
      const response = await processAudioResult(result, ...processArgs);
      if (response.success) {
        setTranscript(response.transcriptText); setSegments(response.segmentsList);
        setAudioUrl(response.finalAudioUrl); setIsSuccess(true);
      } else { setError(response.error); }
    } catch (err) { setError(errorMsg); } finally { setIsLoading(false); }
  };

  // voice record
  const handleStartRecordingAction = async () => {
    setError(null); setIsSuccess(false);
    try {
      const { mediaRecorder } = await startRecording();
      mediaRecorder.onstop = () => {
        const mime = mediaRecorderRef.current.mimeType || "audio/webm";
        const ext = mime.includes("ogg") ? "ogg" : "webm";
        const blob = new Blob(audioChunksRef.current, { type: mime });
        const file = new File([blob], `recorded_audio.${ext}`, { type: mime });
        runTranscription(() => transcribeFromFile(file, selectedLanguage), [blob, `Recorded_${Date.now().toString().slice(-4)}`, "record", `.${ext}`], "Server processing error.");
      };
    } catch (err) { setError("Microphone access denied."); }
  };

  // file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const ext = file.name.substring(file.name.lastIndexOf("."));
    runTranscription(() => transcribeFromFile(file, selectedLanguage), [file, file.name, "upload", ext], "Error processing uploaded file.");
  };

  // link submit
  const handleLinkSubmit = (url) => {
    if (!url) return;
    const ext = url.match(/\.[0-9a-z]+$/i)?.[0] || ".mp3";
    runTranscription(() => transcribeFromUrl(url, selectedLanguage), [null, url, "link", ext, url], "Error processing link.");
  };

  return (
    // main template
    <div className="max-w-4xl mx-auto px-4 mt-10" dir="rtl">
      <HeroSection />
      
      <TranscriptContainer 
        states={{ transcript, segments, audioUrl, selectedLanguage, activeButton, isLoading, error, isSuccess }}
        recorders={{ isRecording, stopRecording }}
        handlers={{ onStartRecording: handleStartRecordingAction, onFileUpload: handleFileUpload, onLinkSubmit: handleLinkSubmit, onReset: handleReset, onButtonChange: (btn) => { setActiveButton(btn); setError(null); if (btn !== "record" && isRecording) stopRecording(); } }}
      />

      <div className="flex justify-end mt-4 mb-6">
        <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
      </div>
    </div>
  );
};

export default HomePage;