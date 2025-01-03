import { db, ImageObject } from '@abc/storage';
import { useRef, useState } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';

export const RecordSound = ({ imageObject }: { imageObject: ImageObject }) => {
  const [isRecording, setIsRecording] = useState(false);

  const recorderRef = useRef(new MicRecorder({ bitRate: 128 }));

  const handleStartRecording = async () => {
    await recorderRef.current.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    const mp3Blob = recorderRef.current.stop().getMp3();

    const fileName = `${imageObject.name}.mp3`;
    const file = new File([mp3Blob], fileName, {
      type: mp3Blob.type,
      lastModified: Date.now(),
    });

    db.imageObjects.update(imageObject.id, { sound: file });
  };

  return (
    <div>
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};
