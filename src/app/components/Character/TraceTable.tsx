"use client";

import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";
import { useTheme } from "next-themes";
import { SkillTreeConfig } from "@/bindings/SkillTreeConfig";
import { getLineTrips, traceVariants } from "./lineTrips";
import { TraceDescription } from "./TraceDescription";
import { useCharacterTrace } from "@/hooks/queries/useCharacterTrace";
import { useCharacterSkill } from "@/hooks/queries/useCharacterSkill";
import { Checkbox } from "../ui/Checkbox";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import { useCharacterMetadata } from "@/hooks/queries/useCharacterMetadata";

const DEBUG = true;

type Props = {
  characterId: number;
  wrapperSize?: number;
  // maxEnergy: number;
  // path:
  //   | "Erudition"
  //   | "Nihility"
  //   | "Destruction"
  //   | "Hunt"
  //   | "Preservation"
  //   | "Harmony"
  //   | "Abundance";
  editMode?: boolean;
  onChange?: (data: Record<number, boolean>) => void;
};

const TraceTable = ({
  characterId,
  wrapperSize = 480,
  editMode = false,
  onChange,
}: Props) => {
  const { data } = useCharacterMetadata();
  const [editModeTable, setEditModeTable] = useImmer<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    if (!!onChange) onChange(editModeTable);
  }, [editModeTable, onChange]);

  function onCheckedChange(checked: boolean, pointId: number) {
    setEditModeTable((draft) => {
      draft[pointId] = checked;
    });
  }

  if (!data) return null;

  const { avatar_base_type: path, spneed: maxEnergy } = data;

  return (
    <div
      id="trace-wrapper"
      className="relative -mx-8 h-[30rem] w-screen overflow-hidden p-2 sm:mx-0 sm:w-[30rem]"
    >
      <Image
        className="absolute bottom-0 left-0 right-0 top-0 -z-50 m-auto opacity-10 invert-0 dark:invert-0"
        src={pathUrl(path)}
        alt={path}
        quality={100}
        width={384}
        height={384}
      />

      <TraceTableInner
        characterId={characterId}
        path={path}
        wrapperSize={wrapperSize}
        maxEnergy={maxEnergy}
        editMode={editMode}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};

const TraceTableInner = ({
  characterId,
  wrapperSize = 480,
  path,
  maxEnergy,
  editMode,
  onCheckedChange,
}: Omit<Props, "onChange"> & {
  onCheckedChange: (checked: boolean, pointId: number) => void;
}) => {
  const updateLines = useXarrow();
  const { theme } = useTheme();

  const { data } = useCharacterTrace(characterId);
  const { data: skills } = useCharacterSkill(characterId);

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

  return (
    <div id="parent-wrapper" className="relative h-full w-full">
      <Xwrapper>
        {data &&
          data.map((traceNode) => (
            <div
              id={traceNode.anchor}
              key={traceNode.point_id}
              className={cn(
                traceVariants(path)({ anchor: traceNode.anchor }),
                ""
              )}
              style={{
                marginLeft: `${wrapperSize / -16}px`,
              }}
            >
              {editMode && getNodeType(traceNode) == "SMALL" && (
                <Checkbox
                  className="absolute -top-2.5 left-3"
                  id={traceNode.point_id.toString()}
                  onCheckedChange={(checked) =>
                    onCheckedChange(
                      checked == "indeterminate" ? false : checked,
                      traceNode.point_id
                    )
                  }
                />
              )}
              <Popover>
                <PopoverTrigger
                  className={iconWrapVariants({
                    variant: getNodeType(traceNode),
                  })}
                >
                  <Image
                    className={cn(
                      "rounded-full",
                      getNodeType(traceNode) !== "CORE" ? "scale-90 invert" : ""
                    )}
                    src={traceIconUrl(traceNode)}
                    alt={`${traceNode.point_id}`}
                    width={wrapperSize / 8}
                    height={wrapperSize / 8}
                    style={{
                      // disable icons at the edge getting squished
                      minWidth: `${wrapperSize / 8}px`,
                      minHeight: `${wrapperSize / 8}px`,
                    }}
                    onLoadingComplete={updateLines}
                  />
                </PopoverTrigger>
                <PopoverContent
                  className="w-screen sm:w-full"
                  style={{ maxWidth: `${wrapperSize}px` }}
                >
                  {DEBUG && traceNode.anchor}
                  <TraceDescription
                    traceType={getNodeType(traceNode)}
                    trace={traceNode}
                    skill={skills.find(
                      (e) => e.skill_id == traceNode.level_up_skill_id[0]
                    )}
                    maxEnergy={maxEnergy}
                  />
                </PopoverContent>
              </Popover>
            </div>
          ))}

        {data &&
          getLineTrips(path).map(([a, b], index) => (
            <Xarrow
              key={index}
              start={a}
              end={b}
              color={theme !== "dark" ? "black" : "white"}
              zIndex={-1}
              showHead={false}
              curveness={0}
              startAnchor={"middle"}
              endAnchor={"middle"}
              strokeWidth={2}
            />
          ))}
      </Xwrapper>
    </div>
  );
};

/**
 * get the type of each node
 * @param node
 * @returns CORE denotes the 4 center nodes (basic, skill, ult, technique)
 * SMALL denotes small nodes in the left
 * BIG denotes unique character traces
 */
export function getNodeType(node: SkillTreeConfig): "CORE" | "SMALL" | "BIG" {
  if (node.icon_path.includes("_SkillTree")) return "BIG";
  if (
    ["Normal.png", "BP.png", "Maze.png", "Passive.png", "Ultra.png"].some(
      (ends) => node.icon_path.endsWith(ends)
    )
  )
    return "CORE";
  return "SMALL";
}

export function traceIconUrl(node: SkillTreeConfig) {
  const base = `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon`;
  switch (getNodeType(node)) {
    case "CORE": {
      let path = "";
      const mapper = [
        { left: "Normal.png", right: "_basic_atk.png" },
        { left: "Passive.png", right: "_talent.png" },
        { left: "BP.png", right: "_skill.png" },
        { left: "Maze.png", right: "_technique.png" },
        { left: "Ultra.png", right: "_ultimate.png" },
      ];

      mapper.forEach(({ left, right }) => {
        if (node.icon_path.endsWith(left))
          path = `/skill/${node.avatar_id}${right}`;
      });
      return base + path;
    }
    case "SMALL": {
      const lastSlash = node.icon_path.lastIndexOf("/");
      const name = node.icon_path.slice(lastSlash);
      return `${base}/property${name}`;
    }
    case "BIG": {
      // SkillTree1.png
      return `${base}/skill/${node.avatar_id}_${node.icon_path
        .slice(-14)
        .toLowerCase()}`;
    }
  }
}

function pathUrl(path: string) {
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/path/${path}.png`;
}

export { TraceTable };
