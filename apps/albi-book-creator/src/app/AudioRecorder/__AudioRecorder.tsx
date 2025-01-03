import { useState } from 'react';

export const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);

  const handleStart = () => {
    window.navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        window.mp3MediaRecorder.ondataavailable = (event) => {
          console.log('ondataavailable', event.data);
          // store reciroded data
        };
        window.mp3MediaRecorder.onstart = () => {
          console.log('onstart');
          setIsRecording(true);
        };
        window.mp3MediaRecorder.onstop = () => {
          console.log('onstop');
          setIsRecording(false);
        };

        window.mp3MediaRecorder.start();
      });
  };

  const hadnleStop = () => {
    window.mp3MediaRecorder.stop();
  };

  return (
    <div>
      <button onClick={isRecording ? hadnleStop : handleStart}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};
