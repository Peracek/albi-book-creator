import { Button, List, Space } from 'antd';
import { changeDpiDataUrl } from 'changedpi';
import { useRef, useState } from 'react';
import { Freehand } from './Freehand';
import { generateOids, scale } from './generateOids';
import { showNameModal } from './showNameModal';
import { Point } from './types';
import { getSvgPathFromStroke } from './utils';

// stop tlacitko 0x0014
const STOP_BUTTON_VALUE = parseInt('0x0014', 16);

export const BookCreator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [focusedArea, setFocusedArea] = useState<string | null>(null);

  const [areas, setAreas] = useState<
    { stroke: Point[]; name: string; oidValue: number }[]
  >([]);

  const download = () => {
    const factor = 9924 / (210 * 2);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';

    areas
      .map((area) => {
        const boundingPolygon = area.stroke.map(scale(factor)) as Point[];
        const oids = generateOids(area.oidValue, boundingPolygon);
        return oids;
      })
      .flat()
      .forEach(([x, y]) => {
        ctx.fillRect(x, y, 2, 2);
      });

    const dataURL = canvas.toDataURL('image/png');
    const dataUrl1200DPI = changeDpiDataUrl(dataURL, 1200);
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = dataUrl1200DPI;
    link.click();
  };

  return (
    <Space size="middle" align="start">
      {/* <ImageCanvas /> */}
      <Freehand
        onStrokeEnd={async (stroke) => {
          const name = await showNameModal();

          setAreas((areas) => [
            ...areas,
            { stroke, name, oidValue: STOP_BUTTON_VALUE },
          ]);
        }}
      >
        {areas.map((area, i) => {
          const pathData = getSvgPathFromStroke(area.stroke as Point[]);
          const isFocused = focusedArea === area.name;
          return (
            <path
              key={i}
              d={pathData}
              id={area.name}
              style={{
                fill: isFocused ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              }}
            />
          );
        })}
      </Freehand>

      <div>
        <Space direction="vertical" size="middle">
          <List
            size="small"
            bordered
            dataSource={areas}
            renderItem={(area) => (
              <List.Item
                onMouseEnter={() => setFocusedArea(area.name)}
                onMouseLeave={() => setFocusedArea(null)}
              >
                {area.name} | 0x{area.oidValue.toString(16)}
              </List.Item>
            )}
          />
          <Button onClick={download}>Download OIDs PNG</Button>
        </Space>
      </div>
      <canvas
        ref={canvasRef}
        id="myCanvas"
        width="14028"
        height="9924"
        style={{ border: '1px solid black', display: 'none' }}
      ></canvas>
    </Space>
  );
};

export default BookCreator;
