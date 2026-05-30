// src/pages/HomePage.jsx
import { useState, useRef } from "react";
import LanguageSelector from "../components/ui/LanguageSelector";
import TranscriptDisplay from "../components/transcript/TranscriptDisplay";
import ActionButtons from "../components/ui/ActionButtons";
import { transcribeFromUrl, transcribeFromFile } from "../services/api";

const HomePage = () => {
  const [transcript, setTranscript] = useState("");
  const [segments, setSegments] = useState([]); // اضافه شدن آرایه سگمنت‌های دریافتی واقعی سرور
  const [audioUrl, setAudioUrl] = useState(""); // ذخیره سازی لوکال لینک مدیا برای استفاده در پلیر صوتی
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("fa");
  const [activeButton, setActiveButton] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleReset = () => {
    setTranscript("");
    setSegments([]);
    setAudioUrl("");
    setIsRecording(false);
    setActiveButton(null);
    setIsLoading(false);
    setError(null);
    setIsSuccess(false);
    audioChunksRef.current = [];
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  // استخراج ساختارمند همزمان متن، سگمنت‌ها و فایل‌های صوتی دریافتی
  const extractTranscriptData = (data) => {
    console.log("استخراج داده کامل:", data);
    if (Array.isArray(data) && data.length > 0) {
      const audioInfo = data[0];
      const mediaInfo = data[1] || {};

      // دریافت لینک دانلود فایل صوتی (ترجیحاً نسخه توکن‌دار، در غیر این صورت فیلد مدیا آدرس)
      const directAudioUrl =
        audioInfo.download_url || mediaInfo.media_url || "";

      if (audioInfo.segments && Array.isArray(audioInfo.segments)) {
        // ۱. ساخت متن یکپارچه ساده
        const fullText = audioInfo.segments
          .map((seg) => seg.text || "")
          .join(" ");

        // ۲. نرمال‌سازی سگمنت‌های ورودی سرور
        const extractedSegments = audioInfo.segments.map((seg) => ({
          start: seg.start || "00:00",
          end: seg.end || "00:00",
          text: seg.text ? seg.text.trim() : "[---]", // اگر ثانیه‌ای خالی بود علامت سکوت درج شود
        }));

        return {
          transcriptText: fullText,
          segmentsList: extractedSegments,
          mediaLink: directAudioUrl,
        };
      }
    }
    return { transcriptText: "", segmentsList: [], mediaLink: "" };
  };

  const handleStartRecording = async () => {
    setError(null);
    setIsSuccess(false);
    setTranscript("");
    setSegments([]);
    setAudioUrl("");
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let options = { mimeType: "audio/webm" };
      if (!MediaRecorder.isTypeSupported("audio/webm")) {
        options = { mimeType: "audio/ogg" };
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorderRef.current.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const extension = mimeType.includes("ogg") ? "ogg" : "webm";
        const audioFile = new File([audioBlob], `recorded_audio.${extension}`, {
          type: mimeType,
        });

        setIsLoading(true);

        try {
          const result = await transcribeFromFile(audioFile);
          const { transcriptText, segmentsList, mediaLink } =
            extractTranscriptData(result);

          if (transcriptText) {
            setTranscript(transcriptText);
            setSegments(segmentsList);
            // اگر سرور لینک معتبری نداده بود، آبجکت موقت مرورگر را به عنوان بک‌آپ ست کن
            setAudioUrl(mediaLink || URL.createObjectURL(audioBlob));
            setIsSuccess(true);
          } else {
            setError("تبدیل صدا انجام شد، اما متنی استخراج نشد.");
          }
        } catch (err) {
          setError("خطا در پردازش سرور روشن.");
        } finally {
          setIsLoading(false);
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("دسترسی به میکروفون امکان‌پذیر نیست.");
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
    setSegments([]);
    setAudioUrl("");

    try {
      const result = await transcribeFromFile(file);
      const { transcriptText, segmentsList, mediaLink } =
        extractTranscriptData(result);

      if (transcriptText) {
        setTranscript(transcriptText);
        setSegments(segmentsList);
        setAudioUrl(mediaLink || URL.createObjectURL(file)); // ست کردن آدرس صوتی محلی یا آنلاین فایل ارسالی
        setIsSuccess(true);
      } else {
        setError("تبدیل فایل انجام شد، اما متنی استخراج نشد.");
      }
    } catch (err) {
      setError("خطا در پردازش فایل آپلود شده.");
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
      const result = await transcribeFromUrl(url);
      const { transcriptText, segmentsList, mediaLink } =
        extractTranscriptData(result);

      if (transcriptText) {
        setTranscript(transcriptText);
        setSegments(segmentsList);
        setAudioUrl(mediaLink || url); // از آدرس لینک ارسالی کاربر جهت بارگذاری در پلیر استفاده کن
        setIsSuccess(true);
      } else {
        setError("تبدیل لینک انجام شد، اما متنی یافت نشد.");
      }
    } catch (err) {
      setError("خطا در تبدیل لینک ارسالی.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonChange = (button) => {
    setActiveButton(button);
    setError(null);
    if (button !== "record" && isRecording) {
      handleStopRecording();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10" dir="rtl">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#00BA9F] mb-4">
          تبدیل گفتار به متن
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          آوا با استفاده از هزاران ساعت گفتار با صدای افراد مختلف، زبان فارسی را
          یاد گرفته است.
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
        selectedLanguage={selectedLanguage}
          activeButton={activeButton}
          isRecording={isRecording}
          onRecordToggle={
            isRecording ? handleStopRecording : handleStartRecording
          }
          onLinkSubmit={handleLinkSubmit}
          isLoading={isLoading}
          transcriptText={transcript}
          segments={segments} // فرستادن لیست تکه‌های صوتی
          audioUrl={audioUrl} // فرستادن لینک استریم صوت برای پلیر
          error={error}
          isSuccess={isSuccess}
          onReset={handleReset}
        />
      </div>

      <div className="flex justify-end mt-4 mb-6">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </div>
    </div>
  );
};

export default HomePage;
