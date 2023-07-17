"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { EquipmentRanking } from "@/bindings/EquipmentRanking";
import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { ParentSizeProvidedProps } from "@visx/responsive/lib/components/ParentSize";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { useTooltip, withTooltip } from "@visx/tooltip";
import { useMemo } from "react";

const DEFAULT_INDEX = 6;

type Props = {
  id: number;
};
type TooltipData = {
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};
const LightConeRanking = ({ id }: Props) => {
  const { data } = useQuery({
    queryKey: ["lightConeRanking"],
    queryFn: async () => await API.lightConeRanking.get(),
  });

  if (!data) return <>loading</>;

  // by atk for now
  const sortedList = data.list.sort(
    (a, b) => a.atk[DEFAULT_INDEX] - b.atk[DEFAULT_INDEX]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>header</CardTitle>
        <CardDescription>description</CardDescription>
      </CardHeader>
      <CardContent>
        <ParentSize debounceTime={10}>
          {(parent) => (
            <RankingChart data={sortedList} {...parent} height={1200} />
          )}
        </ParentSize>
      </CardContent>
    </Card>
  );
};

interface ChartProps extends ParentSizeProvidedProps {
  data: EquipmentRanking[];
}
const RankingChart = ({ data, height, width }: ChartProps) => {
  const xMax = width;
  const yMax = height;
  const tooltip = useTooltip();

  // x axis: value
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [xMax, 0],
        round: true,
        domain: [0, Math.max(...data.map((e) => e.atk[DEFAULT_INDEX]))],
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [xMax]
  );

  // yaxis: ID
  const yScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, yMax],
        round: true,
        domain: data.map((e) => e.equipment_name),
        padding: 0.4,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [height]
  );

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <Group>
        {data.map((dataPoint, index) => {
          const barHeight = yScale.bandwidth();
          const barWidth = width - (xScale(dataPoint.atk[DEFAULT_INDEX]) ?? 0);

          const barY = yScale(dataPoint.equipment_name);
          const barX = xMax - barWidth

          return (
            <Bar
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="rgba(23, 233, 217, .5)"
              key={`bar-${index}`}
            />
          );
        })}
      </Group>
    </svg>
  );
};
export { LightConeRanking };
