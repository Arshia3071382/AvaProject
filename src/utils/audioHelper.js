import { addToArchive, getAudioDuration } from "../services/storage";
import { extractTranscriptData } from "./extractTranscriptData";

// audio process
export const processAudioResult = async (result, audioBlob, sourceName, sourceType, fileExtension, sourceUrl = null) => {
  const { transcriptText, segmentsList, mediaLink } = extractTranscriptData(result);
  
  if (!transcriptText) {
    return { success: false, error: "Transcription completed but no text extracted." };
  }

  const finalAudioUrl = mediaLink || (audioBlob ? URL.createObjectURL(audioBlob) : sourceUrl);
  const durationText = audioBlob ? await getAudioDuration(audioBlob) : await getAudioDuration(finalAudioUrl);

  addToArchive(sourceName, sourceType, fileExtension, durationText, transcriptText, segmentsList, finalAudioUrl);

  return {
    success: true,
    transcriptText,
    segmentsList,
    finalAudioUrl
  };
};