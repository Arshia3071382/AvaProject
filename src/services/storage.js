const STORAGE_KEY = 'harf_audio_archive';

// ۱. دریافت تمام آرشیو از فایل JSON مرورگر
export const getArchive = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// ۲. اضافه کردن یک ویس جدید به همراه پارامتر داینامیک حجم فایل (fileSize)
export const addToArchive = (name, type, fileType, duration, transcriptText, segments = [], audioUrl = "", fileSize = null) => {
  const archive = getArchive();
  
  // ساختن شیء جدید منطبق بر ساختار جدول شما
  const newItem = {
    id: Date.now(), // شناسه یکتا بر اساس زمان
    name: name || "فایل بدون نام",
    type: type, // 'link' یا 'upload' یا 'record'
    fileType: fileType || ".mp3",
    uploadDate: new Date().toLocaleDateString('fa-IR'), // ذخیره تاریخ شمسی روز
    duration: duration || "00:00",
    audioUrl: audioUrl,
    transcriptText: transcriptText,
    segments: segments,
    fileSize: fileSize // ذخیره حجم فایل (مثلاً: "3.18 مگابایت")
  };

  // اضافه کردن به ابتدای لیست آرشیو
  const updatedArchive = [newItem, ...archive];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedArchive));
  return updatedArchive;
};

export const deleteFromArchive = (id) => {
  const archive = getArchive();
  const updatedArchive = archive.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedArchive));
  return updatedArchive;
};

export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "00:00";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num) => String(num).padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
};

export const getAudioDuration = (audioSource) => {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = typeof audioSource === 'string' ? audioSource : URL.createObjectURL(audioSource);
    
    audio.addEventListener('loadedmetadata', () => {
      resolve(formatDuration(audio.duration));
    });

    audio.addEventListener('error', () => {
      resolve("00:00"); 
    });
  });
};