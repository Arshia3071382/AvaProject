import { useState, useEffect, useRef } from "react";

export const useAudioHandler = (isSuccess, audioUrl) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

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

  const stopAndReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const seek = (targetTime) => {
    setCurrentTime(targetTime);
    if (audioRef.current) audioRef.current.currentTime = targetTime;
  };

  const changeVolume = (targetVolume) => {
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

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlayPause,
    stopAndReset,
    seek,
    changeVolume,
    toggleMute,
  };
};
