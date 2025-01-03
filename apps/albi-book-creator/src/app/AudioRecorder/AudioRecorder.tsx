import { Mp3MediaRecorder } from 'mp3-mediarecorder';
import { useEffect, useRef, useState } from 'react';
import mp3RecorderWorker from './worker?worker';
import { db, ImageObject } from '@abc/storage';

export const AudioRecorder = ({
  imageObject,
}: {
  imageObject: ImageObject;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);
  const worker = useRef(mp3RecorderWorker());

  const handleStart = () => {
    window.navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new Mp3MediaRecorder(stream, {
          worker: worker.current,
        });

        recorderRef.current = recorder;
        recorder.ondataavailable = (event) => {
          const mp3Blob = event.data;
          const fileName = `${imageObject.name}.mp3`;
          const file = new File([mp3Blob], fileName, {
            type: mp3Blob.type,
            lastModified: Date.now(),
          });

          db.imageObjects.update(imageObject.id, { sound: file });
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
