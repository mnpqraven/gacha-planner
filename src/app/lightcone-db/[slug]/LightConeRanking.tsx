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
import { withTooltip } from "@visx/tooltip";
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
const LightConeRanking = withTooltip<Props, TooltipData>(({ id }: Props) => {
  const { data } = useQuery({
    queryKey: ["lightConeRanking"],
    queryFn: async () => await API.lightConeRanking.get(),
  });

  if (!data) return "loading";

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
            <RankingChart data={sortedList} {...parent} height={400} />
          )}
        </ParentSize>
      </CardContent>
    </Card>
  );
});

interface ChartProps extends ParentSizeProvidedProps {
  data: EquipmentRanking[];
}
const RankingChart = ({ data, height, width }: ChartProps) => {
  console.log(width, height);
  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, width],
        round: true,
        domain: data.map((e) => e.equipment_id),
        padding: 0.4,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width]
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [height, 0],
        round: true,
        domain: [0, Math.max(...data.map((e) => e.atk[DEFAULT_INDEX]))],
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [height]
  );

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <Group>
        {data.map((dataPoint, index) => {
          const barWidth = xScale.bandwidth();
          const barHeight = height - yScale(dataPoint.atk[DEFAULT_INDEX]);
          const barX = xScale(dataPoint.equipment_id);
          const barY = height - barHeight;

          return (
            <Bar
              key={index}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
            />
          );
        })}
      </Group>
    </svg>
  );
};
export { LightConeRanking };
