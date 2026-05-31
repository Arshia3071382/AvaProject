import React from "react";
import ActionButtons from "../ui/ActionButtons";
import TranscriptDisplay from "./TranscriptDisplay";

const TranscriptContainer = ({ states, recorders, handlers }) => {
  return (
    // action layout
    <div className="flex flex-col">
      <ActionButtons
        isRecording={recorders.isRecording}
        onStartRecording={handlers.onStartRecording}
        onStopRecording={recorders.stopRecording}
        onFileUpload={handlers.onFileUpload}
        activeButton={states.activeButton}
        onButtonChange={handlers.onButtonChange}
        onReset={handlers.onReset}
      />
      <TranscriptDisplay
        selectedLanguage={states.selectedLanguage}
        activeButton={states.activeButton}
        isRecording={recorders.isRecording}
        onRecordToggle={recorders.isRecording ? recorders.stopRecording : handlers.onStartRecording}
        onLinkSubmit={handlers.onLinkSubmit}
        isLoading={states.isLoading}
        transcriptText={states.transcript}
        segments={states.segments}
        audioUrl={states.audioUrl}
        error={states.error}
        isSuccess={states.isSuccess}
        onReset={handlers.onReset}
        onFileUpload={handlers.onFileUpload}
      />
    </div>
  );
};

export default TranscriptContainer;