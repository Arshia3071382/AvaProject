import { useState } from "react";
import LanguageSelector from "../components/ui/LanguageSelector";
import TranscriptDisplay from "../components/transcript/TranscriptDisplay";
import ActionButtons from "../components/ui/ActionButtons";
import HeroSection from "../components/ui/HeroSection";
import { transcribeFromUrl, transcribeFromFile } from "../services/api";
import { addToArchive, getAudioDuration } from "../services/storage";
import { extractTranscriptData } from "../utils/extractTranscriptData";
import { useAudioRecorder } from "../hooks/useAudioRecorder";

const HomePage = () => {
  const [transcript, setTranscript] = useState("");
  const [segments, setSegments] = useState([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("fa");
  const [activeButton, setActiveButton] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { isRecording, startRecording, stopRecording, mediaRecorderRef, audioChunksRef } = useAudioRecorder();

  const handleReset = () => {
    setTranscript("");
    setSegments([]);
    setAudioUrl("");
    setActiveButton(null);
    setIsLoading(false);
    setError(null);
    setIsSuccess(false);
    if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
  };

  const processResult = async (result, audioBlob, sourceName, sourceType, fileExtension, sourceUrl = null) => {
    const { transcriptText, segmentsList, mediaLink } = extractTranscriptData(result);
    if (!transcriptText) {
      setError("Transcription completed but no text extracted.");
      return false;
    }

    const finalAudioUrl = mediaLink || (audioBlob ? URL.createObjectURL(audioBlob) : sourceUrl);
    const durationText = audioBlob ? await getAudioDuration(audioBlob) : await getAudioDuration(finalAudioUrl);

    setTranscript(transcriptText);
    setSegments(segmentsList);
    setAudioUrl(finalAudioUrl);
    setIsSuccess(true);

    addToArchive(sourceName, sourceType, fileExtension, durationText, transcriptText, segmentsList, finalAudioUrl);
    return true;
  };

  const handleStartRecordingAction = async () => {
    setError(null);
    setIsSuccess(false);
    setTranscript("");
    setSegments([]);
    setAudioUrl("");

    try {
      const { mediaRecorder } = await startRecording();
      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorderRef.current.mimeType || "audio/webm";
        const extension = mimeType.includes("ogg") ? "ogg" : "webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioFile = new File([audioBlob], `recorded_audio.${extension}`, { type: mimeType });

        setIsLoading(true);
        try {
          const result = await transcribeFromFile(audioFile, selectedLanguage);
          await processResult(result, audioBlob, `Recorded_${Date.now().toString().slice(-4)}`, "record", `.${extension}`);
        } catch (err) {
          setError("Server processing error.");
        } finally {
          setIsLoading(false);
        }
      };
    } catch (err) {
      setError("Microphone access denied.");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    setTranscript("");
    setSegments([]);
    setAudioUrl("");

    try {
      const result = await transcribeFromFile(file, selectedLanguage);
      const fileExtension = file.name.substring(file.name.lastIndexOf("."));
      await processResult(result, file, file.name, "upload", fileExtension);
    } catch (err) {
      setError("Error processing uploaded file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkSubmit = async (url) => {
    if (!url) return;

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    setTranscript("");
    setSegments([]);
    setAudioUrl("");

    try {
      const result = await transcribeFromUrl(url, selectedLanguage);
      const fileExtension = url.match(/\.[0-9a-z]+$/i)?.[0] || ".mp3";
      await processResult(result, null, url, "link", fileExtension, url);
    } catch (err) {
      setError("Error processing link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonChange = (button) => {
    setActiveButton(button);
    setError(null);
    if (button !== "record" && isRecording) stopRecording();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10" dir="rtl">
      <HeroSection />
      <div className="flex flex-col">
        <ActionButtons
          isRecording={isRecording}
          onStartRecording={handleStartRecordingAction}
          onStopRecording={stopRecording}
          onFileUpload={handleFileUpload}
          activeButton={activeButton}
          onButtonChange={handleButtonChange}
          onReset={handleReset}
        />
        <TranscriptDisplay
          selectedLanguage={selectedLanguage}
          activeButton={activeButton}
          isRecording={isRecording}
          onRecordToggle={isRecording ? stopRecording : handleStartRecordingAction}
          onLinkSubmit={handleLinkSubmit}
          isLoading={isLoading}
          transcriptText={transcript}
          segments={segments}
          audioUrl={audioUrl}
          error={error}
          isSuccess={isSuccess}
          onReset={handleReset}
          onFileUpload={handleFileUpload}
        />
      </div>
      <div className="flex justify-end mt-4 mb-6">
        <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
      </div>
    </div>
  );
};

export default HomePage;