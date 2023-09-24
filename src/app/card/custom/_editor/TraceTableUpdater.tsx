import {
  getNodeType,
  traceIconUrl,
} from "@/app/components/Character/TraceTable";
import { groupTrips } from "@/app/components/Character/lineTrips";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { Toggle } from "@/app/components/ui/Toggle";
import { Path } from "@/bindings/AvatarConfig";
import { Anchor, SkillTreeConfig } from "@/bindings/SkillTreeConfig";
import { useCharacterTrace } from "@/hooks/queries/useCharacterTrace";
import { asPercentage, cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { useAtomValue, useSetAtom } from "jotai";
import Image from "next/image";
import { HTMLAttributes, forwardRef } from "react";
import {
  charIdAtom,
  charTraceAtom,
  updateManyCharTraceAtom,
} from "../../_store";

const iconWrapVariants = cva(
  "flex items-center justify-center rounded-full ring-offset-transparent transition duration-500 hover:ring-2 hover:ring-offset-2",
  {
    variants: {
      variant: {
        SMALL: "scale-75 bg-zinc-300",
        BIG: "scale-100 bg-zinc-300",
        CORE: "scale-100 bg-zinc-700",
      },
    },
    defaultVariants: {
      variant: "CORE",
    },
  }
);

interface Props {
  path: Path;
}

export function TraceTableUpdater({ path }: Props) {
  const characterId = useAtomValue(charIdAtom);
  const { data: traces } = useCharacterTrace(characterId);
  if (!traces) return "loading...";
  const splittedTraces = groupTrips(path);

  return (
    <>
      <div className="flex flex-col gap-2">
        {splittedTraces.map((trip, index) => (
          <TripRow
            key={index}
            anchors={trip}
            traceInfo={traces}
            path={path}
            ascension={(index + 1) * 2}
          />
        ))}
      </div>
    </>
  );
}

interface TripRowProps extends HTMLAttributes<HTMLDivElement> {
  anchors: Anchor[];
  traceInfo: SkillTreeConfig[];
  path: Path;
  ascension: number;
}
const TripRow = forwardRef<HTMLDivElement, TripRowProps>(
  ({ anchors, traceInfo, path, ascension, className, ...props }, ref) => {
    const traces = anchors.map((anchor) =>
      traceInfo.find((e) => e.anchor == anchor)
    );
    const traceDict = useAtomValue(charTraceAtom);
    const updateMany = useSetAtom(updateManyCharTraceAtom);

    function updateCheckMap(checked: boolean, index: number) {
      const rightSideMap = traces
        .filter((e, i) => i >= index && e !== undefined)
        .map((trace, i) => ({
          id: trace?.point_id!,
          checked: i == 0 ? checked : false,
        }));
      updateMany(rightSideMap);
    }

    return (
      <div className={cn(className, "flex gap-2")} {...props} ref={ref}>
        {traces.map((trace, index) =>
          !!trace ? (
            <TraceItem
              key={index}
              index={index}
              data={trace}
              previousData={index > 0 ? traces.at(index - 1) : undefined}
              atomData={traceDict}
              onUpdateSlice={updateCheckMap}
              ascension={ascension}
            />
          ) : (
            <div key={index} className="flex flex-col items-center gap-1 p-1">
              <span>...</span>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          )
        )}
      </div>
    );
  }
);
TripRow.displayName = "TripRow";

interface ItemProps {
  index: number;
  data: SkillTreeConfig;
  previousData: SkillTreeConfig | undefined;
  atomData: Record<string | number, boolean>;
  onUpdateSlice: (checked: boolean, index: number) => void;
  ascension: number;
}
function TraceItem({
  data,
  previousData,
  atomData,
  index,
  onUpdateSlice,
  ascension,
}: ItemProps) {
  const disabled = !isPreviousChecked(previousData, atomData);
  if (getNodeType(data) !== "SMALL")
    return (
      <div className="flex flex-col items-center gap-1 p-1">
        <span>A{ascension}</span>
        <div
          className={iconWrapVariants({
            variant: getNodeType(data),
          })}
        >
          <Image
            className={cn(
              "rounded-full",
              getNodeType(data) !== "CORE" ? "invert" : ""
            )}
            src={traceIconUrl(data)}
            alt=""
            width={48}
            height={48}
          />
        </div>
      </div>
    );

  return (
    <Toggle
      className="flex h-fit flex-col items-center gap-1 p-1"
      pressed={atomData[data.point_id]}
      onPressedChange={(checked) => {
        if (getNodeType(data) == "SMALL") onUpdateSlice(checked, index);
      }}
      disabled={disabled}
    >
      {asPercentage(data.status_add_list.at(0)?.value.value)}

      <div
        className={iconWrapVariants({
          variant: getNodeType(data),
        })}
      >
        <Image
          className={cn(
            "rounded-full",
            getNodeType(data) !== "CORE" ? "invert" : ""
          )}
          src={traceIconUrl(data)}
          alt=""
          width={48}
          height={48}
        />
      </div>
    </Toggle>
  );
}

// TODO:
function isPreviousChecked(
  previousTrace: SkillTreeConfig | undefined,
  dict: Record<number | string, boolean>
) {
  // ok for first node
  if (!previousTrace) return true;
  // ok for having big parent
  if (getNodeType(previousTrace) !== "SMALL") return true;

  return dict[previousTrace.point_id];
}

// function splitTraces(traces: SkillTreeConfig[], path: Path) {
//   const anchorRoots = rootSmallTraceAnchors(path);
//   const lineTrip = getLineTrips(path);
//
//   function children(trip: Anchor[][], parent: Anchor): Anchor[] {
//     return trip.filter((pair) => pair[0] == parent).map((e) => e[1]);
//   }
//   const leavesConnect = (lineTrip: Anchor[][], root: Anchor): Anchor[] => {
//     let mutLineTrip = lineTrip;
//     let mutRoot = root;
//     const leaves = children(mutLineTrip, mutRoot);
//     while (leaves.length > 0) {
//
//     }
//     return [];
//   };
//
//   const bigRootAnchors = traces
//     .filter((e) => getNodeType(e) !== "SMALL" && anchorRoots.includes(e.anchor))
//     .map((e) => e.anchor);
//   const restAnchors = anchorRoots.filter((e) => !bigRootAnchors.includes(e));
//
//   return {
//     bigRoots: bigRootAnchors.map((bigRoot) => leavesConnect(lineTrip, bigRoot)),
//     smallRoots: restAnchors.map((smallRoot) =>
//       leavesConnect(lineTrip, smallRoot)
//     ),
//   };
// }
