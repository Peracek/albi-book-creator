import { AudioOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Mp3MediaRecorder } from 'mp3-mediarecorder';
import { useRef, useState } from 'react';
import mp3RecorderWorker from './worker?worker';

type Props = {
  onRecorded: (sound: File) => void;
  areaId: number;
};
export const AudioRecorder = ({ onRecorded, areaId }: Props) => {
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
          const fileName = `${areaId}.mp3`;
          const file = new File([mp3Blob], fileName, {
            type: mp3Blob.type,
            lastModified: Date.now(),
          });

          onRecorded(file);
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

  const handleStop = () => {
    recorderRef.current.stop();
  };

  return (
    <Button
      icon={<AudioOutlined />}
      onClick={(e) => {
        e.stopPropagation();
        isRecording ? handleStop() : handleStart();
      }}
    >
      {isRecording ? 'Stop Recording' : 'Start Recording'}
    </Button>
  );
};

/**
 * FIXME: use https://www.npmjs.com/package/react-countdown-circle-timer
 */
