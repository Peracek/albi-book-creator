import { useEffect, useRef, useState } from 'react';
import type { Point } from '@abc/shared';
import { useObjectUrl } from '../../../hooks';
import { a4Points } from '../../../constants';

type Props = {
  pageImage: Blob;
  stroke: Point[];
  size?: number;
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
      console.log('Image loaded:', { width: img.width, height: img.height });
      console.log('A4 points:', a4Points);
      console.log('Original stroke:', stroke);

      // The image has objectFit: contain within A4 dimensions
      // This means ONE uniform scale factor maintains aspect ratio
      const a4AspectRatio = a4Points.h / a4Points.v; // 14028/9924 = ~1.414 (landscape)
      const imgAspectRatio = img.width / img.height;

      let displaySize, offsetX, offsetY;

      if (imgAspectRatio > a4AspectRatio) {
        // Image is wider - fits to A4 width
        displaySize = a4Points.h;
        offsetX = 0;
        offsetY = (a4Points.v - displaySize / imgAspectRatio) / 2;
      } else {
        // Image is taller or square - fits to A4 height
        displaySize = a4Points.v;
        offsetX = (a4Points.h - displaySize * imgAspectRatio) / 2;
        offsetY = 0;
      }

      // ONE uniform scale factor
      const scale = imgAspectRatio > a4AspectRatio ? img.width / displaySize : img.height / displaySize;

      console.log('Transform params:', { displaySize, offsetX, offsetY, scale });

      const scaledStroke = stroke.map((p) => ({
        x: (p[0] - offsetX) * scale,
        y: (p[1] - offsetY) * scale,
      }));

      console.log('Scaled stroke:', scaledStroke);

      // Find bounding box of the scaled stroke and clamp to image bounds
      const xs = scaledStroke.map((p) => Math.max(0, Math.min(img.width, p.x)));
      const ys = scaledStroke.map((p) => Math.max(0, Math.min(img.height, p.y)));
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const width = maxX - minX;
      const height = maxY - minY;

      console.log('Bounding box:', { minX, maxX, minY, maxY, width, height });

      // Create a temporary canvas for cropping
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // Clip to the polygon shape (clamp coordinates to image bounds)
      tempCtx.beginPath();
      scaledStroke.forEach((point, i) => {
        const clampedX = Math.max(0, Math.min(img.width, point.x));
        const clampedY = Math.max(0, Math.min(img.height, point.y));
        const x = clampedX - minX ;
        const y = clampedY - minY  ;
        if (i === 0) {
          tempCtx.moveTo(x, y);
        } else {
          tempCtx.lineTo(x, y);
        }
      });
      tempCtx.closePath();
      tempCtx.clip();

      // Draw the cropped portion
      tempCtx.drawImage(img, -minX, -minY);

      // Scale to preview size
      canvas.width = size;
      canvas.height = size;

      // Calculate scaling to fit within the preview size while maintaining aspect ratio
      const previewScale = Math.min(size / width, size / height);
      const scaledWidth = width * previewScale;
      const scaledHeight = height * previewScale;
      const previewOffsetX = (size - scaledWidth) / 2;
      const previewOffsetY = (size - scaledHeight) / 2;

      // Clear and draw scaled preview
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(tempCanvas, previewOffsetX, previewOffsetY, scaledWidth, scaledHeight);

      // Convert to data URL for display
      const dataUrl = canvas.toDataURL();
      console.log('Preview generated, dataUrl length:', dataUrl.length);
      setPreviewUrl(dataUrl);
    };

    img.onerror = (error) => {
      console.error('Image failed to load:', error);
    };

    img.src = imageUrl;
  }, [imageUrl, stroke, size]);

  console.log('AreaPreview render:', { hasImageUrl: !!imageUrl, strokeLength: stroke.length, previewUrlLength: previewUrl.length });

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
