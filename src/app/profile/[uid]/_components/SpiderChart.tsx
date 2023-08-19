import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Point } from "@visx/point";
import { Line, LineRadial } from "@visx/shape";
import { rotate } from "@/lib/utils";
import SVG from "react-inlinesvg";
import { TooltipWithBounds, useTooltip } from "@visx/tooltip";
import { MouseEventHandler, ReactNode, useCallback, useMemo } from "react";
import { localPoint } from "@visx/event";
import { voronoi } from "@visx/voronoi";

export type RadarProps<T> = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  levels?: number;
  data: T[];
  valueAccessor: (data: T) => number;
  iconAccessor: (data: T) => string;
  tooltipRender?: (data: T) => ReactNode;
};

const DEGREES = 360;

const orange = "#ff9933";
const pumpkin = "#f5810c";
const silver = "#d9d9d9";
// export const background = "#FAF7E900";
const background = "#00000000";

const genAngles = (length: number) =>
  [...new Array(length + 1)].map((_, i) => ({
    angle:
      i * (DEGREES / length) + (length % 2 === 0 ? 0 : DEGREES / length / 2),
  }));

const genPoints = (length: number, radius: number) => {
  const step = (Math.PI * 2) / length;
  return [...new Array(length)].map((_, i) => ({
    x: radius * Math.sin(i * step),
    y: radius * Math.cos(i * step),
  }));
};

function genPolygonPoints<Datum>(
  dataArray: Datum[],
  scale: (n: number) => number,
  getValue: (d: Datum) => number
) {
  const step = (Math.PI * 2) / dataArray.length;
  const points: { x: number; y: number }[] = new Array(dataArray.length).fill({
    x: 0,
    y: 0,
  });
  const pointString: string = new Array(dataArray.length + 1)
    .fill("")
    .reduce((res, _, i) => {
      if (i > dataArray.length) return res;
      const xVal = scale(getValue(dataArray[i - 1])) * Math.sin(i * step);
      const yVal = scale(getValue(dataArray[i - 1])) * Math.cos(i * step);
      points[i - 1] = { x: xVal, y: yVal };
      res += `${xVal},${yVal} `;
      return res;
    });

  return { points, pointString };
}

const DEFAULT_MARGINS = { top: 0, left: 60, right: 60, bottom: 0 };

export function SpiderChart<T>({
  width,
  height,
  levels = 5,
  margin = DEFAULT_MARGINS,
  data,
  valueAccessor,
  iconAccessor,
  tooltipRender,
}: RadarProps<T>) {
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const radius = Math.min(xMax, yMax) / 2;

  const radialScale = scaleLinear<number>({
    range: [0, Math.PI * 2],
    domain: [DEGREES, 0],
  });

  const yScale = scaleLinear<number>({
    range: [0, radius],
    // NOTE: this domain uses the data's max value as edge
    // domain: [0, Math.max(...data.map(y))],
    // NOTE: this domain uses normalized value range from 0 to 1
    domain: [0, 1],
  });

  const webs = genAngles(data.length);
  const points = genPoints(data.length, radius);
  const textAnchors = rotate(-1, genPoints(data.length, radius + 20));

  const polygonPoints = genPolygonPoints(
    data,
    (d) => yScale(d) ?? 0,
    valueAccessor
  );
  const zeroPoint = new Point({ x: 0, y: 0 });

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<{ index: number }>();

  const voronoiLayout = useMemo(
    () =>
      voronoi<{ x: number; y: number }>({
        x: (d) => d.x + width / 2,
        y: (d) => d.y + height / 2 - margin.top,
        width: width,
        height: height,
      })(polygonPoints.points),
    [width, height, margin, polygonPoints.points]
  );

  const handleMouseMove: MouseEventHandler<SVGRectElement> = useCallback(
    (event) => {
      const coords = localPoint(event);
      if (!!coords?.x && coords.y) {
        const closest = voronoiLayout.find(coords.x, coords.y, width / 3);

        showTooltip({
          tooltipLeft: coords.x,
          tooltipTop: coords.y,
          tooltipData: { index: closest?.index ?? 0 },
        });
      }
    },
    [showTooltip, voronoiLayout, width]
  );

  return width < 10 ? null : (
    <>
      <svg width={width} height={height}>
        <Group top={height / 2 - margin.top} left={width / 2}>
          {[...new Array(levels)].map((_, i) => (
            <LineRadial
              key={`web-${i}`}
              data={webs}
              angle={(d) => radialScale(d.angle) ?? 0}
              radius={((i + 1) * radius) / levels}
              fill="none"
              stroke={silver}
              strokeWidth={i % 2 == 0 ? 2 : 1}
              strokeOpacity={0.6}
              strokeLinecap="round"
            />
          ))}
          {[...new Array(data.length)].map((_, i) => (
            <Line
              key={`radar-line-${i}`}
              from={zeroPoint}
              to={points[i]}
              stroke={silver}
            />
          ))}
          {data.map((item, i) => (
            // TODO: dynamic x y coords according to index
            <SVG
              key={`annotate-${i}`}
              fill="white"
              x={textAnchors[i].x - 10}
              y={textAnchors[i].y - 10}
              width={24}
              height={24}
              src={iconAccessor(item)}
            />
          ))}
          <polygon
            points={polygonPoints.pointString}
            fill={orange}
            fillOpacity={0.3}
            stroke={orange}
            strokeWidth={2}
          />
          {polygonPoints.points.map((point, i) => (
            <circle
              key={`radar-point-${i}`}
              cx={point.x}
              cy={point.y}
              r={2}
              fill={pumpkin}
            />
          ))}
        </Group>
        <rect
          fill={background}
          width={width}
          height={height}
          rx={14}
          onMouseMove={handleMouseMove}
          onMouseLeave={hideTooltip}
        />
      </svg>
      {tooltipOpen && tooltipData && !!tooltipRender && (
        <TooltipWithBounds
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
        >
          {tooltipRender(data[tooltipData.index])}
        </TooltipWithBounds>
      )}
    </>
  );
}
