// Custom hook for archive storage operations
import { addToArchive } from "../services/storage";

export const useArchiveStorage = () => {
  const saveToArchive = async (
    name,
    type,
    fileExtension,
    duration,
    transcriptText,
    segmentsList,
    audioUrl
  ) => {
    addToArchive(
      name,
      type,
      fileExtension,
      duration,
      transcriptText,
      segmentsList,
      audioUrl
    );
  };

  return { saveToArchive };
};