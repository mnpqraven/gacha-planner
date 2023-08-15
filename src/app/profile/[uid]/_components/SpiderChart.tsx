import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef, useContext } from "react";
import { CardConfigContext } from "../ConfigControllerContext";
import { addStat, mihomoPropertyList } from "./stat_block/StatTable";
import { ParentSize } from "@visx/responsive";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const SpiderChart = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    const { currentCharacter } = useContext(CardConfigContext);
    if (!currentCharacter) return null;
    const { attributes, additions, element } = currentCharacter;
    const rawData = mihomoPropertyList(element.name).map(({ percent, value }) =>
      addStat(attributes, additions, value, percent)
    );
    console.log("rawData", rawData);

    return (
      <div
        className={cn(
          "relative h-[300px] w-[300px]",
          className
        )}
        ref={ref}
        {...props}
      >
        <ParentSize debounceTime={10}>
          {(parent) => (
            <InnerSpiderChart width={parent.width} height={parent.height} />
          )}
        </ParentSize>
      </div>
    );
  }
);

// existing fields:
// ['hp', 'atk', 'def', 'spd', 'crit_rate']

interface DataAnalyzeProps<T extends { field: string; value: number }> {
  data: T;
}
function useDataAnalyze<T extends { field: string; value: number }>({
  data,
}: DataAnalyzeProps<T>) {}

SpiderChart.displayName = "SpiderChart";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Point } from "@visx/point";
import { Line, LineRadial } from "@visx/shape";
import { Text } from "@visx/text";

const orange = "#ff9933";
const pumpkin = "#f5810c";
const silver = "#d9d9d9";
// export const background = "#FAF7E900";
const background = "#00000000";

const letterFrequency: LetterFrequency[] = [
  { letter: "a", frequency: 1 },
  { letter: "s", frequency: 2 },
  { letter: "d", frequency: 3 },
  { letter: "f", frequency: 4 },
  { letter: "e", frequency: 5 },
  { letter: "i", frequency: 6 },
  { letter: "a", frequency: 7 },
  { letter: "y", frequency: 8 },
  { letter: "z", frequency: 9 },
];
type LetterFrequency = {
  letter: string;
  frequency: number;
};
const degrees = 360;

let temp = letterFrequency;
if (temp.length > 0) {
  // rotate 1
  // temp.unshift(temp.pop()!);
  // temp.unshift(temp.pop()!);
  // temp.unshift(temp.pop()!);
  // rotate -1
  temp.push(temp.shift()!);
  temp.push(temp.shift()!);
  temp.push(temp.shift()!);
  temp.push(temp.shift()!);
  temp = temp.reverse();
}
function rotate<T>(by: number, data: T[]): T[] {
  if (data.length == 0) return data;
  if (by == 0) return data;
  if (by < 0) {
    let temp = data;
    for (let index = 0; index < by * -1; index++) {
      temp.push(temp.shift()!);
    }
    return temp;
  } else {
    let temp = data;
    for (let index = 0; index < by; index++) {
      temp.unshift(temp.pop()!);
    }
    return temp;
  }
}
// const data = rotate(0, letterFrequency);
const data = letterFrequency

const y = (d: LetterFrequency) => d.frequency;

const genAngles = (length: number) =>
  [...new Array(length + 1)].map((_, i) => ({
    angle:
      i * (degrees / length) + (length % 2 === 0 ? 0 : degrees / length / 2),
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

const defaultMargin = { top: 0, left: 0, right: 0, bottom: 60 };

export type RadarProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  levels?: number;
};

function InnerSpiderChart({
  width,
  height,
  levels = 5,
  margin = defaultMargin,
}: RadarProps) {
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const radius = Math.min(xMax, yMax) / 2;

  const radialScale = scaleLinear<number>({
    range: [0, Math.PI * 2],
    domain: [degrees, 0],
  });

  const yScale = scaleLinear<number>({
    range: [0, radius],
    domain: [0, Math.max(...data.map(y))],
  });

  const webs = genAngles(data.length);
  const points = genPoints(data.length, radius);
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
        {[...new Array(data.length)].map((text, i) => (
          // TODO: dynamic x y coords according to index
          <Text
            key={`annotate-${i}`}
            verticalAnchor="start"
            fill="white"
            x={-40}
            y={-40}
          >
            {i}
          </Text>
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
            r={4}
            fill={pumpkin}
          />
        ))}
      </Group>
    </svg>
  );
}
