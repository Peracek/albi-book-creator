import { Mp3MediaRecorder } from 'mp3-mediarecorder';
import { useEffect, useRef, useState } from 'react';
// import mp3RecorderWorker from './worker?worker';

export const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);
  // const worker = useRef(mp3RecorderWorker());

  const handleStart = () => {
    window.navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = (recorderRef.current = recorder);
        recorder.ondataavailable = (event) => {
          console.log('ondataavailable', event.data);
          // store reciroded data
        };
        recorder.onstart = () => {
          console.log('onstart');
          setIsRecording(true);
        };
        recorder.onstop = () => {
          console.log('onstop');
          setIsRecording(false);
        };

        recorder.start();
      });
  };

  const hadnleStop = () => {
    recorderRef.current.stop();
  };

  return (
    <div>
      <button onClick={isRecording ? hadnleStop : handleStart}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};
