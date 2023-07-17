"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";
import { EquipmentRanking } from "@/bindings/EquipmentRanking";
import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";
import { AxisRight } from "@visx/axis";
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { ParentSizeProvidedProps } from "@visx/responsive/lib/components/ParentSize";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { Bar, BarStackHorizontal } from "@visx/shape";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { useCallback, useMemo, useState } from "react";

type Props = {
  id: number;
};
const LightConeRanking = ({ id }: Props) => {
  const { data } = useQuery({
    queryKey: ["lightConeRanking"],
    queryFn: async () => await API.lightConeRanking.get(),
  });

  const [dataKey, setDatakey] = useState<"atk" | "def" | "hp" | "all">("all");

  const accessor = useCallback(() => {
    if (dataKey === "all") return undefined;
    return (e: EquipmentRanking) => e[dataKey][DEFAULT_INDEX];
  }, [dataKey]);

  if (!data) return <>loading</>;

  const sortedList = data.list.sort((a, b) => {
    const acc = accessor();
    const nameCmp = a.equipment_name.localeCompare(b.equipment_name);
    if (acc) return acc(b) - acc(a) || nameCmp;
    // no accessor fn passed aka All selected -> return sum
    return (
      b.atk[DEFAULT_INDEX] +
      b.def[DEFAULT_INDEX] +
      b.hp[DEFAULT_INDEX] -
      (a.atk[DEFAULT_INDEX] + a.def[DEFAULT_INDEX] + a.hp[DEFAULT_INDEX])
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stat ranking</CardTitle>
        <CardDescription>
          Pure stat ranking compared to other light cones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          onValueChange={(e) => setDatakey(e as typeof dataKey)}
          defaultValue={dataKey}
        >
          <SelectTrigger className="mb-4">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="atk">Attack</SelectItem>
            <SelectItem value="def">Defense</SelectItem>
            <SelectItem value="hp">HP</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
        <ParentSize debounceTime={10}>
          {(parent) =>
            accessor ? (
              <RankingChart
                data={sortedList}
                currentLcId={id}
                dataAccessor={accessor()}
                {...parent}
                height={sortedList.length * 40}
                promotion={DEFAULT_INDEX}
              />
            ) : null
          }
        </ParentSize>
      </CardContent>
    </Card>
  );
};

const DEFAULT_INDEX = 6;

let tooltipTimeout: number;
type TooltipData = {
  name: string;
  atk: number;
  hp: number;
  def: number;
};

interface ChartProps extends ParentSizeProvidedProps {
  data: EquipmentRanking[];
  currentLcId: number;
  dataAccessor?: (e: EquipmentRanking) => number;
  promotion: number;
}
const RankingChart = ({
  data,
  currentLcId,
  dataAccessor,
  promotion,
  height,
  width,
}: ChartProps) => {
  const xMax = width;
  const yMax = height;
  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop,
  } = useTooltip<TooltipData>();
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  // x axis: value
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [
          0,
          Math.max(...data.map(dataAccessor ?? ((e) => e.atk[promotion]))),
        ],
        range: [xMax, 0],
        round: true,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [xMax, dataAccessor]
  );

  const getEquiment = (e: EquipmentRanking) => e.equipment_name;

  // yaxis: ID
  const yScale = useMemo(
    () =>
      scaleBand<string>({
        domain: data.map(getEquiment),
        range: [0, yMax],
        round: true,
        paddingInner: 0.2,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [height, dataAccessor]
  );

  if (width < 10) return null;

  if (dataAccessor)
    return (
      <div className="relative">
        <svg width={width} height={height} ref={containerRef}>
          <Group>
            {data.map((dataPoint, index) => {
              const barHeight = yScale.bandwidth();
              const barWidth = width - xScale(dataAccessor(dataPoint));

              const barY = yScale(dataPoint.equipment_name);
              const isCurrent = dataPoint.equipment_id === currentLcId;

              return (
                <Bar
                  x={0}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={
                    isCurrent
                      ? "rgba(23, 233, 217, .5)"
                      : "rgba(190, 190, 190, .5)"
                  }
                  key={`bar-${index}`}
                  rx={6}
                  onMouseLeave={() => {
                    tooltipTimeout = window.setTimeout(() => {
                      hideTooltip();
                    }, 300);
                  }}
                  onMouseMove={(event) => {
                    if (tooltipTimeout) clearTimeout(tooltipTimeout);
                    // TooltipInPortal expects coordinates to be relative to containerRef
                    // localPoint returns coordinates relative to the nearest SVG, which
                    // is what containerRef is set to in this example.
                    const eventSvgCoords = localPoint(event);
                    const left = (barWidth * 2) / 3;
                    showTooltip({
                      tooltipData: toTooltipData(dataPoint, DEFAULT_INDEX),
                      tooltipTop: eventSvgCoords?.y,
                      tooltipLeft: left,
                    });
                  }}
                />
              );
            })}
            <AxisRight
              scale={yScale}
              numTicks={99}
              tickLabelProps={{ fontSize: 14, fontWeight: 600 }}
              hideAxisLine
              hideTicks
            />
          </Group>
        </svg>
        {tooltipOpen && tooltipData && (
          <TooltipInPortal top={tooltipTop} left={tooltipLeft}>
            <div>{tooltipData.name}</div>
            <div>HP: {tooltipData.hp.toFixed(0)}</div>
            <div>ATK: {tooltipData.atk.toFixed(0)}</div>
            <div>DEF: {tooltipData.def.toFixed(0)}</div>
          </TooltipInPortal>
        )}
      </div>
    );

  // sum graph
  const purple1 = "#6c5efb";
  const purple2 = "#c998ff";
  const purple3 = "#a44afe";

  type MultiKeys = "atk" | "def" | "hp";
  const keys: MultiKeys[] = ["hp", "atk", "def"];
  const colorScale = scaleOrdinal<MultiKeys, string>({
    domain: keys,
    range: [purple1, purple2, purple3],
  });

  const omittedIndexData = data.map((e) => {
    return {
      equipment_id: e.equipment_id,
      equipment_name: e.equipment_name,
      level: e.level[promotion],
      atk: e.atk[promotion],
      def: e.def[promotion],
      hp: e.hp[promotion],
    };
  });
  const xScaleTotal = scaleLinear<number>({
    domain: [0, Math.max(...omittedIndexData.map((e) => e.atk + e.def + e.hp))],
    range: [0, xMax],
    round: true,
  });

  return (
    <div>
      <svg width={width} height={height} ref={containerRef}>
        <Group>
          <BarStackHorizontal<(typeof omittedIndexData)[number], MultiKeys>
            data={omittedIndexData}
            keys={keys}
            y={(e) => e.equipment_name}
            xScale={xScaleTotal}
            yScale={yScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar, index) => {
                  return (
                    <rect
                      key={`barstack-horizontal-${barStack.index}-${bar.index}`}
                      x={bar.x}
                      y={bar.y}
                      rx={6}
                      width={bar.width}
                      height={bar.height}
                      fill={bar.color}
                    />
                  );
                })
              )
            }
          </BarStackHorizontal>
          <AxisRight
            scale={yScale}
            numTicks={99}
            tickLabelProps={{ fontSize: 14, fontWeight: 600 }}
            hideAxisLine
            hideTicks
          />
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft}>
          <div>{tooltipData.name}</div>
          <div>HP: {tooltipData.hp.toFixed(0)}</div>
          <div>ATK: {tooltipData.atk.toFixed(0)}</div>
          <div>DEF: {tooltipData.def.toFixed(0)}</div>
        </TooltipInPortal>
      )}
    </div>
  );
};

function toTooltipData(
  point: EquipmentRanking,
  promotionIndex: number
): TooltipData {
  const { atk, def, hp, equipment_name } = point;
  return {
    atk: atk[promotionIndex],
    def: def[promotionIndex],
    hp: hp[promotionIndex],
    name: equipment_name,
  };
}

export { LightConeRanking };
