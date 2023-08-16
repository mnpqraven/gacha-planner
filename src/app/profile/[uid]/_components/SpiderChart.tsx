import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Point } from "@visx/point";
import { Line, LineRadial } from "@visx/shape";
import { Text } from "@visx/text";
import { rotate } from "@/lib/utils";
import SVG from "react-inlinesvg";
import { Field, propertyPath } from "./SpiderChartWrapper";

export type RadarProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  levels?: number;
  data: { field: Field; value: number }[];
};

const DEGREES = 360;

const orange = "#ff9933";
const pumpkin = "#f5810c";
const silver = "#d9d9d9";
// export const background = "#FAF7E900";
const background = "#00000000";

const letterFrequency: LetterFrequency[] = [
  { letter: "a", frequency: 1 },
  { letter: "b", frequency: 2 },
  { letter: "c", frequency: 3 },
  { letter: "d", frequency: 4 },
  { letter: "e", frequency: 5 },
  { letter: "f", frequency: 6 },
  { letter: "g", frequency: 7 },
  { letter: "h", frequency: 8 },
  { letter: "i", frequency: 9 },
];
type LetterFrequency = {
  letter: string;
  frequency: number;
};

const data = rotate(-5, letterFrequency.reverse());

const y = (d: { field: string; value: number }) => d.value;

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
const defaultMargin = { top: 0, left: 60, right: 60, bottom: 0 };

export function SpiderChart({
  width,
  height,
  levels = 5,
  margin = defaultMargin,
  data,
}: RadarProps) {
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const radius = Math.min(xMax, yMax) / 2;

  const radialScale = scaleLinear<number>({
    range: [0, Math.PI * 2],
    domain: [DEGREES, 0],
  });

  const yScale = scaleLinear<number>({
    range: [0, radius],
    domain: [0, Math.max(...data.map(y))],
  });

  const webs = genAngles(data.length);
  const points = genPoints(data.length, radius);
  const textAnchors = rotate(-1, genPoints(data.length, radius + 20));

  const polygonPoints = genPolygonPoints(data, (d) => yScale(d) ?? 0, y);
  const zeroPoint = new Point({ x: 0, y: 0 });
  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect fill={background} width={width} height={height} rx={14} />
      <Group top={height / 2 - margin.top} left={width / 2}>
        {[...new Array(levels)].map((_, i) => (
          <LineRadial
            key={`web-${i}`}
            data={webs}
            angle={(d) => radialScale(d.angle) ?? 0}
            radius={((i + 1) * radius) / levels}
            fill="none"
            stroke={silver}
            strokeWidth={i == 2 ? 3 : 2}
            strokeOpacity={i == 2 ? 1 : 0.8}
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
        {/* data.map((text, i) => (
          // TODO: dynamic x y coords according to index
          <Text
            key={`annotate-${i}`}
            verticalAnchor="middle"
            fill="white"
            x={textAnchors[i].x - 5}
            y={textAnchors[i].y}
          >
            {text.field}
          </Text>
        )) */}
        {data.map((text, i) => (
          // TODO: dynamic x y coords according to index
          <SVG
            key={`annotate-${i}`}
            fill="white"
            x={textAnchors[i].x - 10}
            y={textAnchors[i].y - 10}
            width={24}
            height={24}
            src={propertyPath(text.field)}
          />
        ))}
        <polygon
          points={polygonPoints.pointString}
          fill={orange}
          fillOpacity={0.3}
          stroke={orange}
          strokeWidth={1}
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
    </svg>
  );
}
