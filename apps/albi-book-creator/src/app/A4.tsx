import { PropsWithChildren } from 'react';
import { useViewportSize } from './useViewportSize';
import { a4AspectRatio } from './constants';

export const A4 = ({ children }: PropsWithChildren) => {
  const viewportSize = useViewportSize();
  const { width, height } = viewportSize;

  const scale = width / height > a4AspectRatio ? height / 210 : width / 297;

  return (
    <div
      style={{
        width: 297 * scale,
        height: 210 * scale,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid black',
        background: 'white',
      }}
    >
      {children}
    </div>
  );
};
