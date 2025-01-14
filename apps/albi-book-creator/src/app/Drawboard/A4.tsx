import React, {
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from 'react';
import { useViewportSize } from '../useViewportSize';
import { a4AspectRatio, a4Points } from '../constants';

export interface A4Ref {
  initialScale: number;
}

export const A4 = forwardRef<
  A4Ref,
  PropsWithChildren<{ viewportScale?: number }>
>(({ children, viewportScale = 1 }, ref) => {
  const viewportSize = useViewportSize();
  const { width, height } = viewportSize;

  const scale = width / height > a4AspectRatio ? height / 210 : width / 297;

  const divRef = React.useRef<HTMLDivElement>(null);
  const [intialScale, setIntialScale] = useState<number>();

  useEffect(() => {
    if (divRef.current) {
      const bb = divRef.current.getBoundingClientRect();
      const scalePxToA4In1200Dpi = bb.width / a4Points.h;
      setIntialScale(scalePxToA4In1200Dpi);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    get initialScale() {
      return intialScale!;
    },
  }));

  return (
    <div
      ref={divRef}
      style={{
        width: 297 * scale * viewportScale,
        height: 210 * scale * viewportScale,
        position: 'relative',
        overflow: 'hidden',
        // border: '1px solid black',
        background: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Added shadow
      }}
    >
      {children}
    </div>
  );
});
