import { useEffect, useRef, useState } from 'react';
import type { Point } from '@abc/shared';
import { useObjectUrl } from '../../../hooks';
import { a4Points } from '../../../constants';

type Props = {
  pageImage: Blob;
  stroke: Point[];
  size?: number;
};

type ImageLayout = {
  displaySize: number;
  offsetX: number;
  offsetY: number;
  scale: number;
};

type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
};

type ImagePoint = {
  x: number;
  y: number;
};

const calculateImageLayout = (
  img: HTMLImageElement,
  a4Dimensions: { h: number; v: number }
): ImageLayout => {
  const a4AspectRatio = a4Dimensions.h / a4Dimensions.v;
  const imgAspectRatio = img.width / img.height;

  let displaySize: number;
  let offsetX: number;
  let offsetY: number;

  if (imgAspectRatio > a4AspectRatio) {
    // Image is wider - fits to A4 width
    displaySize = a4Dimensions.h;
    offsetX = 0;
    offsetY = (a4Dimensions.v - displaySize / imgAspectRatio) / 2;
  } else {
    // Image is taller or square - fits to A4 height
    displaySize = a4Dimensions.v;
    offsetX = (a4Dimensions.h - displaySize * imgAspectRatio) / 2;
    offsetY = 0;
  }

  const scale =
    imgAspectRatio > a4AspectRatio
      ? img.width / displaySize
      : img.height / displaySize;

  return { displaySize, offsetX, offsetY, scale };
};

const transformStrokeToImageCoordinates = (
  stroke: Point[],
  layout: ImageLayout
): ImagePoint[] => {
  return stroke.map((p) => ({
    x: (p[0] - layout.offsetX) * layout.scale,
    y: (p[1] - layout.offsetY) * layout.scale,
  }));
};

const calculateBoundingBox = (
  scaledStroke: ImagePoint[],
  img: HTMLImageElement
): Bounds => {
  const xs = scaledStroke.map((p) => Math.max(0, Math.min(img.width, p.x)));
  const ys = scaledStroke.map((p) => Math.max(0, Math.min(img.height, p.y)));
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX;
  const height = maxY - minY;

  return { minX, maxX, minY, maxY, width, height };
};

const createClippedCanvas = (
  img: HTMLImageElement,
  scaledStroke: ImagePoint[],
  bounds: Bounds
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = bounds.width;
  canvas.height = bounds.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2d context');

  // Clip to the polygon shape
  ctx.beginPath();
  scaledStroke.forEach((point, i) => {
    const clampedX = Math.max(0, Math.min(img.width, point.x));
    const clampedY = Math.max(0, Math.min(img.height, point.y));
    const x = clampedX - bounds.minX;
    const y = clampedY - bounds.minY;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.closePath();
  ctx.clip();

  // Draw the cropped portion
  ctx.drawImage(img, -bounds.minX, -bounds.minY);

  return canvas;
};

const generatePreviewCanvas = (
  targetCanvas: HTMLCanvasElement,
  targetCtx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  bounds: Bounds,
  previewSize: number
): string => {
  targetCanvas.width = previewSize;
  targetCanvas.height = previewSize;

  // Calculate scaling to fit within the preview size while maintaining aspect ratio
  const previewScale = Math.min(
    previewSize / bounds.width,
    previewSize / bounds.height
  );
  const scaledWidth = bounds.width * previewScale;
  const scaledHeight = bounds.height * previewScale;
  const previewOffsetX = (previewSize - scaledWidth) / 2;
  const previewOffsetY = (previewSize - scaledHeight) / 2;

  // Clear and draw scaled preview
  targetCtx.fillStyle = '#f0f0f0';
  targetCtx.fillRect(0, 0, previewSize, previewSize);
  targetCtx.drawImage(
    sourceCanvas,
    previewOffsetX,
    previewOffsetY,
    scaledWidth,
    scaledHeight
  );

  return targetCanvas.toDataURL();
};

export const AreaPreview = ({ pageImage, stroke, size = 64 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const imageUrl = useObjectUrl(pageImage);

  useEffect(() => {
    if (!imageUrl || !canvasRef.current || stroke.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const layout = calculateImageLayout(img, a4Points);
      const imageStroke = transformStrokeToImageCoordinates(stroke, layout);
      const bounds = calculateBoundingBox(imageStroke, img);
      const clippedCanvas = createClippedCanvas(img, imageStroke, bounds);
      const dataUrl = generatePreviewCanvas(canvas, ctx, clippedCanvas, bounds, size);
      setPreviewUrl(dataUrl);
    };

    img.onerror = (error) => {
      console.error('Image failed to load:', error);
    };

    img.src = imageUrl;
  }, [imageUrl, stroke, size]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Area preview"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      ) : null}
    </>
  );
};
