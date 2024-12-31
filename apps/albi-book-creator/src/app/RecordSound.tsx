import { db } from '@abc/storage';
import { useRef, useState } from 'react';

export const RecordSound = ({ id }: { id: number }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: 'audio/wav',
      });

      const fileName = `recording_${Math.random()
        .toString(36)
        .substring(7)}.wav`;
      const file = new File([audioBlob], fileName, { type: 'audio/wav' });

      db.imageObjects.update(id, { sound: file });
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
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
