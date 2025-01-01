import React, {
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from 'react';
import { useViewportSize } from './useViewportSize';
import { a4AspectRatio } from './constants';

export interface A4Ref {
  getInitialBoundingBox: () => DOMRect | null;
}

export const A4 = forwardRef<A4Ref, PropsWithChildren>(({ children }, ref) => {
  const viewportSize = useViewportSize();
  const { width, height } = viewportSize;

  const scale = width / height > a4AspectRatio ? height / 210 : width / 297;

  const divRef = React.useRef<HTMLDivElement>(null);
  const [initialBoundingBox, setInitialBoundingBox] = useState<DOMRect | null>(
    null
  );

  useEffect(() => {
    if (divRef.current) {
      setInitialBoundingBox(divRef.current.getBoundingClientRect());
    }
  }, []);

  useImperativeHandle(ref, () => ({
    getInitialBoundingBox: () => {
      return initialBoundingBox;
    },
  }));

  return (
    <div
      ref={divRef}
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
});
