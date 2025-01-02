import { A4 } from '../Drawboard';
import { Dropzone } from './Dropzone';

export const Welcome = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <A4 viewportScale={0.8}>
        <Dropzone />
      </A4>
    </div>
  );
};

export default Welcome;
