// Extract transcript text, segments and media link from API response

export const extractTranscriptData = (data) => {
  console.log("Extracting data:", data);

  if (Array.isArray(data) && data.length > 0) {
    const audioInfo = data[0];
    const mediaInfo = data[1] || {};
    const directAudioUrl = audioInfo.download_url || mediaInfo.media_url || "";

    if (audioInfo.segments && Array.isArray(audioInfo.segments)) {
      const fullText = audioInfo.segments.map((seg) => seg.text || "").join(" ");
      const extractedSegments = audioInfo.segments.map((seg) => ({
        start: seg.start || "00:00",
        end: seg.end || "00:00",
        text: seg.text ? seg.text.trim() : "[---]",
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