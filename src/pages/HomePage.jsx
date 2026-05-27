import { useState, useRef } from "react";
import LanguageSelector from "../components/ui/LanguageSelector";
import TranscriptDisplay from "../components/transcript/TranscriptDisplay";
import ActionButtons from "../components/ui/ActionButtons";
import TimestampList from "../components/transcript/TimestampList";
import { transcribeFromUrl, transcribeFromFile } from "../services/api";

const HomePage = () => {
  const [transcript, setTranscript] = useState("");
  const [timestamps, setTimestamps] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("fa");
  const [activeButton, setActiveButton] = useState(null); // 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Recording References
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Format time (seconds to mm:ss)
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Extract transcript and segments from API response
  const extractTranscriptData = (data) => {
    console.log('API Response:', data);
    
    // اگر پاسخ به صورت آرایه‌ای از نتایج باشد
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      let transcriptText = result.transcript || result.text || "";
      let segments = [];
      
      if (result.segments && Array.isArray(result.segments)) {
        segments = result.segments.map(seg => ({
          start: formatTime(seg.start || 0),
          end: formatTime(seg.end || 0),
          text: seg.text || "",
        }));
      }
      return { transcriptText, segments };
    }
    
    // اگر پاسخ مستقیم فیلد transcript داشته باشد
    if (data.transcript) {
      let segments = [];
      if (data.segments && Array.isArray(data.segments)) {
        segments = data.segments.map(seg => ({
          start: formatTime(seg.start || 0),
          end: formatTime(seg.end || 0),
          text: seg.text || "",
        }));
      }
      return { transcriptText: data.transcript, segments };
    }
    
    return { transcriptText: "", segments: [] };
  };

  // --- سیستم ضبط صدا (بدون کتابخانه خارجی) ---
  const handleStartRecording = async () => {
    setError(null);
    setIsSuccess(false);
    setTranscript("");
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // بررسی فرمت‌های تحت پشتیبانی مرورگر به ترتیب اولویت
      let options = { mimeType: 'audio/webm' };
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/ogg' };
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorderRef.current.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        
        const extension = mimeType.includes('ogg') ? 'ogg' : 'webm';
        
        const audioFile = new File([audioBlob], `recorded_audio.${extension}`, { type: mimeType });
        
        if (audioFile.size === 0) {
          setError("صدای ضبط شده خالی است. لطفاً میکروفون را بررسی کنید.");
          return;
        }

        setIsLoading(true);
        setTranscript("در حال ارسال و تبدیل فایل صوتی...");
        
        try {
          const result = await transcribeFromFile(audioFile);
          const { transcriptText, segments } = extractTranscriptData(result);
          
          if (transcriptText) {
            setTranscript(transcriptText);
            setTimestamps(segments);
            setIsSuccess(true);
          } else {
            setError("صدا پردازش شد اما متنی استخراج نگردید.");
          }
        } catch (err) {
          console.error("خطای سرور هنگام دریافت صدای ضبط شده:", err);
          const serverMessage = err.response?.data?.detail || err.response?.data?.error || "";
          setError(`خطا در پردازش سرور: ${serverMessage || "فرمت ضبط مرورگر با سرور سازگار نیست."}`);
        } finally {
          setIsLoading(false);
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTranscript("در حال ضبط صدا... لطفاً صحبت کنید.");
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("دسترسی به میکروفون امکان‌پذیر نیست. لطفاً دسترسی مرورگر را بررسی کنید.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    setTranscript("");
    
    try {
      const result = await transcribeFromFile(file);
      const { transcriptText, segments } = extractTranscriptData(result);
      
      if (transcriptText) {
        setTranscript(transcriptText);
        setTimestamps(segments);
        setIsSuccess(true);
      } else {
        setError("تبدیل فایل ناموفق بود یا متنی یافت نشد.");
      }
    } catch (err) {
      console.error("File transcription failed:", err);
      setError("خطا در پردازش فایل. لطفا فرمت یا حجم فایل را بررسی کنید.");
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
    
    try {
      const result = await transcribeFromUrl(url);
      const { transcriptText, segments } = extractTranscriptData(result);
      
      if (transcriptText) {
        setTranscript(transcriptText);
        setTimestamps(segments);
        setIsSuccess(true);
      } else {
        setError("پاسخی حاوی متن از سرور دریافت نشد.");
      }
    } catch (err) {
      console.error("Link transcription failed:", err);
      setError("خطا در تبدیل لینک. لطفاً از صحت لینک مستقیم صوتی/تصویری مطمئن شوید.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonChange = (button) => {
    setActiveButton(button);
    setError(null);
    if (button !== 'record' && isRecording) {
      handleStopRecording();
    }
    if (button !== 'link') {
      setIsSuccess(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10" dir="rtl">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#00BA9F] mb-4">
          تبدیل گفتار به متن
        </h1>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          آوا با استفاده از هزاران ساعت گفتار با صدای افراد مختلف،
          <br />
          زبان فارسی را یاد گرفته است و می‌تواند متن گفتار شما را بنویسد.
        </p>
      </div>

      <div className="flex flex-col">
        <ActionButtons
          isRecording={isRecording}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          onFileUpload={handleFileUpload}
          activeButton={activeButton}
          onButtonChange={handleButtonChange}
        />

        <TranscriptDisplay
          activeButton={activeButton}
          isRecording={isRecording}
          onRecordToggle={isRecording ? handleStopRecording : handleStartRecording}
          onLinkSubmit={handleLinkSubmit}
          isLoading={isLoading}
          transcriptText={transcript}
          error={error}
          isSuccess={isSuccess}
        />
      </div>

      {timestamps.length > 0 && isSuccess && (
        <div className="mt-6 bg-white p-4 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
            متن زمان‌بندی شده
          </h3>
          <TimestampList timestamps={timestamps} />
        </div>
      )}


      <div className="flex justify-start mt-4 mb-6">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </div>
    </div>
  );
};

export default HomePage;