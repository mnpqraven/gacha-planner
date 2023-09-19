import {
  getNodeType,
  traceIconUrl,
} from "@/app/components/Character/TraceTable";
import {
  getLineTrips,
  groupTrips,
  rootSmallTraceAnchors,
} from "@/app/components/Character/lineTrips";
import { Checkbox } from "@/app/components/ui/Checkbox";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { Toggle } from "@/app/components/ui/Toggle";
import { Path } from "@/bindings/AvatarConfig";
import { Anchor, SkillTreeConfig } from "@/bindings/SkillTreeConfig";
import { useCharacterSkill } from "@/hooks/queries/useCharacterSkill";
import { useCharacterTrace } from "@/hooks/queries/useCharacterTrace";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Image from "next/image";
import { HTMLAttributes, forwardRef, useEffect, useState } from "react";
import {
  charSkillAtom,
  charTraceAtom,
  updateCharTraceAtom,
} from "../_store/character";

const iconWrapVariants = cva(
  "flex items-center justify-center rounded-full ring-offset-transparent transition duration-500 hover:ring-2 hover:ring-offset-2",
  {
    variants: {
      variant: {
        SMALL: "scale-50 bg-zinc-300",
        BIG: "scale-[.85] bg-zinc-300",
        CORE: "scale-75 bg-zinc-700",
      },
    },
    defaultVariants: {
      variant: "CORE",
    },
  }
);

interface Props {
  characterId: number;
  path: Path;
}

export function TraceTableUpdater({ characterId, path }: Props) {
  const { data: traces } = useCharacterTrace(characterId);
  // const smallSkills = traces?.filter((trace) => getNodeType(trace) == "SMALL");
  // console.log("traces", smallSkills);
  if (!traces) return "loading...";
  const splittedTraces = groupTrips(path);

  return (
    <>
      <div className="flex flex-col">
        {splittedTraces.map((trip, index) => (
          <TripRow key={index} anchors={trip} traceInfo={traces} path={path} />
        ))}
      </div>
      {/*
       */}
    </>
  );
}

interface TripRowProps extends HTMLAttributes<HTMLDivElement> {
  anchors: Anchor[];
  traceInfo: SkillTreeConfig[];
  path: Path;
}
const TripRow = forwardRef<HTMLDivElement, TripRowProps>(
  ({ anchors, traceInfo, path, className, ...props }, ref) => {
    const traces = anchors.map((anchor) =>
      traceInfo.find((e) => e.anchor == anchor)
    );
    const [checkedMap, setCheckedMap] = useState(
      Array.from({ length: traces.length }, () => false)
    );
    const [tracedebug, updater] = useAtom(charTraceAtom);

    function updateCheckMap(checked: boolean, index: number) {
      checkedMap.forEach((_, i) => {
        const id = traces.at(i)?.point_id;
        if (!!id) {
          // console.log("data", data);
          updater((draft) => {
            draft[id] = i == index ? checked : false;
          });
        }
      });
      setCheckedMap(
        checkedMap.map((e, i) => {
          if (i == index) return checked;
          if (i > index) return false;
          return e;
        })
      );
    }

    return (
      <div className={cn(className, "flex gap-4")} {...props} ref={ref}>
        {traces.map((trace, index) => (
          <Toggle
            key={index}
            className="flex h-fit flex-col items-center gap-2 pb-2"
            pressed={checkedMap[index]}
            onPressedChange={(checked) => {
              if (!!trace && getNodeType(trace) == "SMALL")
                updateCheckMap(!!checked, index);
            }}
          >
            {trace?.point_id}
            {!!trace ? (
              <div
                key={index}
                className={iconWrapVariants({
                  variant: getNodeType(trace),
                })}
              >
                <Image
                  className={cn(
                    "rounded-full",
                    getNodeType(trace) !== "CORE" ? "scale-90 invert" : ""
                  )}
                  src={traceIconUrl(trace)}
                  alt=""
                  width={64}
                  height={64}
                />
              </div>
            ) : (
              <Skeleton key={index} className="rounded-full">
                should not happen
              </Skeleton>
            )}

            <Checkbox
              disabled={!!trace ? !isPreviousChecked(index, checkedMap) : true}
              checked={checkedMap[index]}
            />
          </Toggle>
        ))}
      </div>
    );
  }
);
TripRow.displayName = "TripRow";

// TODO:
function isPreviousChecked(
  currentIndex: number,
  checkedMap: boolean[]
): boolean {
  if (currentIndex == 0) return true;
  return checkedMap[currentIndex - 1];
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
