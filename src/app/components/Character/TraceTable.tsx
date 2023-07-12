"use client";

import { DbCharacterSkillTree } from "@/bindings/DbCharacterSkillTree";
import ENDPOINT, { IMAGE_URL } from "@/server/endpoints";
import { typedFetch } from "@/server/fetchHelper";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { cn, parseSkillType } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";
import { useState } from "react";
import { DbAttributeProperty } from "@/bindings/DbAttributeProperty";
import { SimpleSkill } from "@/bindings/PatchBanner";
import { Slider } from "../ui/Slider";
import { SkillDescription } from "./SkillDescription";
import { useTheme } from "next-themes";

const DEBUG = false;

type Props = {
  characterId: number;
  wrapperSize?: number;
  maxEnergy: number;
  path:
    | "Erudition"
    | "Nihility"
    | "Destruction"
    | "Hunt"
    | "Preservation"
    | "Harmony"
    | "Abundance";
};

const TraceTable = ({
  characterId,
  wrapperSize = 480,
  path,
  maxEnergy,
}: Props) => {
  const { theme } = useTheme();
  return (
    <div
      id="trace-wrapper"
      className="relative -mx-8 h-[30rem] w-screen overflow-hidden p-2 sm:mx-0 sm:w-[30rem]"
    >
      <Image
        className={cn(
          "absolute bottom-0 left-0 right-0 top-0 -z-50 m-auto opacity-10",
          theme !== "dark" ? "invert" : ""
        )}
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
      />
    </div>
  );
};

const TraceTableInner = ({
  characterId,
  wrapperSize = 480,
  path,
  maxEnergy,
}: Props) => {
  const updateLines = useXarrow();
  const { theme } = useTheme();
  const { data } = useQuery({
    queryKey: ["trace", characterId],
    queryFn: async () =>
      await typedFetch<undefined, { list: DbCharacterSkillTree[] }>(
        ENDPOINT.mhyTrace,
        undefined,
        characterId
      ),
  });

  const bigTraceList = useQuery({
    queryKey: ["big_trace", characterId],
    queryFn: async () =>
      await typedFetch<undefined, { list: SimpleSkill[] }>(
        ENDPOINT.mhyBigTrace,
        undefined,
        characterId
      ),
  });

  const skillDescriptions = useQuery({
    queryKey: ["skill_description"],
    queryFn: async () =>
      await typedFetch<undefined, { list: SimpleSkill[] }>(
        ENDPOINT.mhySimpleSkill,
        undefined,
        characterId
      ),
  });

  const properties = useQuery({
    queryKey: ["attribute_property"],
    queryFn: async () =>
      await typedFetch<undefined, { list: DbAttributeProperty[] }>(
        ENDPOINT.mhyAttributeProperty
      ),
  });

  const iconWrapVariants = cva(
    "flex items-center justify-center rounded-full transition duration-500 hover:ring-2 hover:ring-offset-2 ring-offset-transparent",
    {
      variants: {
        variant: {
          smallNode: "bg-zinc-300 scale-50",
          bigNode: "bg-zinc-300 scale-[.85]",
          skillNode: "bg-zinc-700 scale-75",
        },
      },
      defaultVariants: {
        variant: "skillNode",
      },
    }
  );

  function getTraceType(
    node: DbCharacterSkillTree
  ): VariantProps<typeof iconWrapVariants>["variant"] {
    if (isSmallTrace(node)) return "smallNode";
    if (isSkillNode(node)) return "skillNode";
    return "bigNode";
  }

  return (
    <div id="parent-wrapper" className="relative h-full w-full">
      <Xwrapper>
        {data &&
          skillDescriptions.data &&
          bigTraceList.data &&
          data.list.map((traceNode) => (
            <div
              id={traceNode.anchor}
              key={traceNode.id}
              className={cn(
                getTraceVariants(path)({ anchor: traceNode.anchor })
              )}
              style={{
                marginLeft: `${wrapperSize / -16}px`,
              }}
            >
              <Popover>
                <PopoverTrigger
                  className={iconWrapVariants({
                    variant: getTraceType(traceNode),
                  })}
                >
                  <Image
                    className={cn(
                      "rounded-full",
                      !isSkillNode(traceNode) ? "scale-90 invert" : ""
                    )}
                    src={IMAGE_URL + traceNode.icon}
                    alt={`${traceNode.id}`}
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
                  {!isBigTrace(traceNode) ? (
                    <TraceDescription
                      trace={traceNode}
                      propertyBucket={properties.data?.list}
                      skills={skillDescriptions.data.list}
                      maxEnergy={maxEnergy}
                    />
                  ) : (
                    <BigTraceDescription
                      data={bigTraceList.data.list.find(
                        (e) => e.id === traceNode.id
                      )}
                    />
                  )}
                </PopoverContent>
              </Popover>
            </div>
          ))}

        {data &&
          skillDescriptions.data &&
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

interface BigTraceDescriptionProps {
  data: SimpleSkill | undefined;
}
const BigTraceDescription = ({ data: bigTrace }: BigTraceDescriptionProps) => {
  if (!bigTrace) return null;

  return (
    <p className="text-justify">
      {bigTrace.description.map((descPart, index) => (
        <>
          <span key={index}>{descPart}</span>
          <span className="font-semibold text-accent-foreground">
            {bigTrace.params[0][index]}
          </span>
        </>
      ))}
    </p>
  );
};

const TraceDescription = ({
  trace,
  propertyBucket = [],
  skills,
  maxEnergy,
}: {
  trace: DbCharacterSkillTree;
  propertyBucket: DbAttributeProperty[] | undefined;
  skills: SimpleSkill[];
  maxEnergy: number;
}) => {
  const [selectedSlv, setSelectedSlv] = useState(0);
  const selectedSkill = skills.find(
    (e) => String(trace.id).slice(-2) === String(e.id).slice(-2)
  );
  if (isSmallTrace(trace)) {
    if (trace.levels.length > 0) {
      const [node] = trace.levels;
      if (node.properties.length > 0) {
        const [property] = node.properties;
        return (
          <span>
            {`${propertyBucket.find((e) => e.type === property.ttype)?.name}: ${
              property.value * 100
            } %`}
          </span>
        );
      }
    }
  }
  if (isSkillNode(trace) && selectedSkill) {
    return (
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          {selectedSkill.name} - {parseSkillType(selectedSkill.ttype)}
          {selectedSkill.ttype === "Ultra" && ` (${maxEnergy} Energy)`}
        </h3>
        {selectedSkill.params.length > 1 && (
          <div className="flex items-center">
            <span className="w-24 font-semibold">Level: {selectedSlv + 1}</span>
            <Slider
              className="py-4"
              defaultValue={[0]}
              min={0}
              max={selectedSkill.params.length - 1}
              onValueChange={(e) => setSelectedSlv(e[0])}
            />
          </div>
        )}

        <SkillDescription skill={selectedSkill} slv={selectedSlv} />
      </div>
    );
  }

  return null;
};

function isSkillNode(node: DbCharacterSkillTree): boolean {
  let emptyProperty = node.levels
    .map((e) => e.properties)
    .every((e) => e.length == 0);
  return emptyProperty && !node.icon.includes("_skilltree");
}
function isSmallTrace(node: DbCharacterSkillTree): boolean {
  let emptyProperty = node.levels
    .map((e) => e.properties)
    .every((e) => e.length != 0);
  return emptyProperty;
}
function isBigTrace(node: DbCharacterSkillTree): boolean {
  return node.icon.includes("_skilltree");
}

function getLineTrips(path: Props["path"]) {
  switch (path) {
    case "Erudition":
      return [
        ["Point03", "Point04"],
        ["Point04", "Point08"],
        ["Point08", "Point16"],
        ["Point08", "Point17"],
        ["Point03", "Point01"],
        ["Point01", "Point06"],
        ["Point06", "Point10"],
        ["Point10", "Point11"],
        ["Point10", "Point12"],
        ["Point03", "Point02"],
        ["Point02", "Point07"],
        ["Point07", "Point13"],
        ["Point13", "Point14"],
        ["Point13", "Point15"],
        ["Point03", "Point05"],
        ["Point05", "Point09"],
        ["Point05", "Point18"],
      ];
    case "Nihility":
      return [
        ["Point03", "Point04"],
        ["Point04", "Point08"],
        ["Point08", "Point16"],
        ["Point08", "Point17"],
        ["Point03", "Point01"],
        ["Point01", "Point06"],
        ["Point06", "Point10"],
        ["Point10", "Point11"],
        ["Point11", "Point12"],
        ["Point03", "Point02"],
        ["Point02", "Point07"],
        ["Point07", "Point13"],
        ["Point13", "Point14"],
        ["Point14", "Point15"],
        ["Point03", "Point05"],
        ["Point05", "Point09"],
        ["Point09", "Point18"],
      ];
    case "Destruction":
      return [
        ["Point01", "Point02"],
        ["Point03", "Point04"],
        ["Point03", "Point05"],
        ["Point04", "Point08"],
        ["Point08", "Point16"],
        ["Point16", "Point17"],
        ["Point16", "Point18"],
        ["Point05", "Point09"],
        ["Point06", "Point10"],
        ["Point10", "Point11"],
        ["Point11", "Point12"],
        ["Point06", "Point07"],
        ["Point07", "Point13"],
        ["Point13", "Point14"],
        ["Point14", "Point15"],
      ];
    case "Hunt":
      return [
        ["Point03", "Point01"],
        ["Point01", "Point12"],
        ["Point03", "Point02"],
        ["Point02", "Point15"],
        ["Point03", "Point04"],
        ["Point04", "Point08"],
        ["Point08", "Point16"],
        ["Point16", "Point17"],
        ["Point16", "Point18"],
        ["Point03", "Point05"],
        ["Point05", "Point09"],
        ["Point05", "Point06"],
        ["Point06", "Point10"],
        ["Point10", "Point11"],
        ["Point05", "Point07"],
        ["Point07", "Point13"],
        ["Point13", "Point14"],
      ];
    case "Preservation":
      return [
        ["Point03", "Point01"],
        ["Point01", "Point12"],
        ["Point03", "Point02"],
        ["Point02", "Point15"],
        ["Point03", "Point04"],
        ["Point04", "Point08"],
        ["Point08", "Point16"],
        ["Point16", "Point17"],
        ["Point16", "Point18"],
        ["Point03", "Point05"],
        ["Point05", "Point09"],
        ["Point09", "Point06"],
        ["Point06", "Point10"],
        ["Point10", "Point11"],
        ["Point09", "Point07"],
        ["Point07", "Point13"],
        ["Point13", "Point14"],
      ];
    case "Harmony":
      return [
        ["Point04", "Point08"],
        ["Point08", "Point16"],
        ["Point16", "Point17"],
        ["Point16", "Point18"],
        ["Point04", "Point01"],
        ["Point01", "Point06"],
        ["Point06", "Point10"],
        ["Point10", "Point11"],
        ["Point04", "Point02"],
        ["Point02", "Point07"],
        ["Point07", "Point13"],
        ["Point13", "Point14"],
        ["Point04", "Point03"],
        ["Point03", "Point05"],
        ["Point05", "Point09"],
        ["Point09", "Point12"],
        ["Point09", "Point15"],
      ];
    case "Abundance":
      return [
        ["Point01", "Point02"],
        ["Point03", "Point04"],
        ["Point04", "Point08"],
        ["Point08", "Point16"],
        ["Point08", "Point17"],
        ["Point03", "Point05"],
        ["Point06", "Point10"],
        ["Point10", "Point11"],
        ["Point11", "Point12"],
        ["Point07", "Point13"],
        ["Point13", "Point14"],
        ["Point14", "Point15"],
        ["Point06", "Point07"],
        ["Point18", "Point09"],
      ];
  }
}

function getTraceVariants(path: Props["path"]) {
  switch (path) {
    case "Erudition":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[46%] left-[calc(50%-17.5%)]",
            Point02: "top-[46%] left-[calc(50%+17.5%)]",
            Point03: "top-[46%] left-[calc(50%)]",
            Point04: "top-[28%] left-[calc(50%)]",
            Point05: "top-[77%] left-[calc(50%)]",
            Point06: "top-[46%] left-[calc(50%-32%)]",
            Point07: "top-[46%] left-[calc(50%+32%)]",
            Point08: "top-[8%]  left-[calc(50%)]",
            Point09: "top-[75%] left-[calc(50%-17.5%)]",
            Point10: "top-[46%] left-[calc(50%-47%)]",
            Point11: "top-[61%] left-[calc(50%-41.67%)]",
            Point12: "top-[32%] left-[calc(50%-41.67%)]",
            Point13: "top-[46%] left-[calc(50%+47%)]",
            Point14: "top-[61%] left-[calc(50%+41.67%)]",
            Point15: "top-[32%] left-[calc(50%+41.67%)]",
            Point16: "top-[12%] left-[calc(50%-20%)]",
            Point17: "top-[12%] left-[calc(50%+20%)]",
            Point18: "top-[75%] left-[calc(50%+17.5%)]",
          },
        },
      });
    case "Nihility":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[42%] left-[calc(50%-17.5%)]", //  basic
            Point02: "top-[42%] left-[calc(50%+17.5%)]", //  skill
            Point03: "top-[38%] left-[calc(50%)]", //  ult
            Point04: "top-[20%] left-[calc(50%)]", //  talent
            Point05: "top-[57%] left-[calc(50%)]", //  tech
            Point06: "top-[30%] left-[calc(50%-32%)]", //  left big
            Point07: "top-[30%] left-[calc(50%+32%)]", //  right big
            Point08: "top-[2%]  left-[calc(50%)]", //  up big
            Point09: "top-[70%] left-[calc(50%)]", //  down small 1
            Point10: "top-[43%] left-[calc(50%-43.75%)]", //  left small 1
            Point11: "top-[55%] left-[calc(50%-32%)]", //  left small 2
            Point12: "top-[67%] left-[calc(50%-17.5%)]", //  left small 3
            Point13: "top-[43%] left-[calc(50%+43.75%)]", //  right small 1
            Point14: "top-[55%] left-[calc(50%+32%)]", //  right small 2
            Point15: "top-[67%] left-[calc(50%+17.5%)]", //  right small 2
            Point16: "top-[6%]  left-[calc(50%-20%)]", //  top left small
            Point17: "top-[6%]  left-[calc(50%+20%)]", //  top right small
            Point18: "top-[85%] left-[calc(50%)]", //  down small 2
          },
        },
      });
    case "Destruction":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[47%] left-[calc(50%-17.5%)]", //  basic
            Point02: "top-[47%] left-[calc(50%+17.5%)]", //  skill
            Point03: "top-[47%] left-[calc(50%)]", //  ult
            Point04: "top-[32%] left-[calc(50%)]", //  talent
            Point05: "top-[62%] left-[calc(50%)]", //  tech
            Point06: "top-[72%] left-[calc(50%-17.5%)]", //  left small 3
            Point07: "top-[72%] left-[calc(50%+17.5%)]", //  right small 2
            Point08: "top-[15%] left-[calc(50%)]", //  up big
            Point09: "top-[80%] left-[calc(50%)]", //  down small 1
            Point10: "top-[60%] left-[calc(50%-31.67%)]", //  left small 2
            Point11: "top-[48%] left-[calc(50%-43.75%)]", //  left small 1
            Point12: "top-[35%] left-[calc(50%-31.67%)]", //  left big
            Point13: "top-[60%] left-[calc(50%+31.67%)]", //  right small 2
            Point14: "top-[48%] left-[calc(50%+43.75%)]", //  right small 1
            Point15: "top-[35%] left-[calc(50%+31.67%)]", //  right big
            Point16: "top-[2%]  left-[calc(50%)]", //  down small 2
            Point17: "top-[7%]  left-[calc(50%-20%)]", //  top left small
            Point18: "top-[7%]  left-[calc(50%+20%)]", //  top right small
          },
        },
      });
    case "Hunt":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[47%] left-[calc(50%-17.5%)]", //  basic
            Point02: "top-[47%] left-[calc(50%+17.5%)]", //  skill
            Point03: "top-[45%] left-[calc(50%)]", //  ult
            Point04: "top-[28%] left-[calc(50%)]", //  talent
            Point05: "top-[62%] left-[calc(50%)]", //  tech
            Point06: "top-[72%] left-[calc(50%-17.5%)]", //  left small 3
            Point07: "top-[72%] left-[calc(50%+17.5%)]", //  right small 2
            Point08: "top-[13%] left-[calc(50%)]", //  up big
            Point09: "top-[80%] left-[calc(50%)]", //  down small 1
            Point10: "top-[60%] left-[calc(50%-31.67%)]", //  left small 2
            Point11: "top-[48%] left-[calc(50%-43.75%)]", //  left small 1
            Point12: "top-[35%] left-[calc(50%-31.67%)]", //  left big
            Point13: "top-[60%] left-[calc(50%+31.67%)]", //  right small 2
            Point14: "top-[48%] left-[calc(50%+43.75%)]", //  right small 1
            Point15: "top-[35%] left-[calc(50%+31.67%)]", //  right big
            Point16: "top-[0%]  left-[calc(50%)]", //  down small 2
            Point17: "top-[5%]  left-[calc(50%-20%)]", //  top left small
            Point18: "top-[5%]  left-[calc(50%+20%)]", //  top right small
          },
        },
      });
    case "Preservation":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[47%] left-[calc(50%-17.5%)]", //  basic
            Point02: "top-[47%] left-[calc(50%+17.5%)]", //  skill
            Point03: "top-[46%] left-[calc(50%)]", //  ult
            Point04: "top-[30%] left-[calc(50%)]", //  talent
            Point05: "top-[62%] left-[calc(50%)]", //  tech
            Point06: "top-[72%] left-[calc(50%-23.5%)]", //  left small 3
            Point07: "top-[72%] left-[calc(50%+23.5%)]", //  right small 2
            Point08: "top-[14%] left-[calc(50%)]", //  up big
            Point09: "top-[75%] left-[calc(50%)]", //  down small 1
            Point10: "top-[60%] left-[calc(50%-37.5%)]", //  left small 2
            Point11: "top-[48%] left-[calc(50%-47.5%)]", //  left small 1
            Point12: "top-[35%] left-[calc(50%-31.67%)]", //  left big
            Point13: "top-[60%] left-[calc(50%+37.5%)]", //  right small 2
            Point14: "top-[48%] left-[calc(50%+47.5%)]", //  right small 1
            Point15: "top-[35%] left-[calc(50%+31.67%)]", //  right big
            Point16: "top-[0%]  left-[calc(50%)]", //  down small 2
            Point17: "top-[5%]  left-[calc(50%-20%)]", //  top left small
            Point18: "top-[5%]  left-[calc(50%+20%)]", //  top right small
          },
        },
      });
    case "Harmony":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[34%] left-[calc(50%-17.5%)]", //  basic
            Point02: "top-[34%] left-[calc(50%+17.5%)]", //  skill
            Point03: "top-[52%] left-[calc(50%)]", //  ult
            Point04: "top-[28%] left-[calc(50%)]", //  talent
            Point05: "top-[69%] left-[calc(50%)]", //  tech
            Point06: "top-[52%] left-[calc(50%-31.67%)]", //  left big
            Point07: "top-[52%] left-[calc(50%+36.67%)]", //  right big
            Point08: "top-[14%] left-[calc(50%)]", //  up big
            Point09: "top-[83%] left-[calc(50%)]", //  down middle small
            Point10: "top-[40%] left-[calc(50%-43.75%)]", //  left small 1
            Point11: "top-[27%] left-[calc(50%-31.67%)]", //  left small 2
            Point12: "top-[80%] left-[calc(50%-17.5%)]", //  down left small
            Point13: "top-[65%] left-[calc(50%+25.5%)]", //  right small 1
            Point14: "top-[55%] left-[calc(50%+15%)]", //  right small 2
            Point15: "top-[80%] left-[calc(50%+17.5%)]", //  down right small
            Point16: "top-[2%]  left-[calc(50%)]", //  top middle
            Point17: "top-[6%]  left-[calc(50%-20%)]", //  top right small
            Point18: "top-[6%]  left-[calc(50%+20%)]", //  top left small
          },
        },
      });
    case "Abundance":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[37%] left-[calc(50%-17.5%)]", //  basic
            Point02: "top-[37%] left-[calc(50%+17.5%)]", //  skill
            Point03: "top-[43%] left-[calc(50%)]", //  ult
            Point04: "top-[25%] left-[calc(50%)]", //  talent
            Point05: "top-[62%] left-[calc(50%)]", //  tech
            Point06: "top-[72%] left-[calc(50%+17.5%)]", //  right small 2
            Point07: "top-[72%] left-[calc(50%-17.5%)]", //  left small 3
            Point08: "top-[4%]  left-[calc(50%)]", //  up big
            Point09: "top-[82%] left-[calc(50%+10%)]", //  down small 1
            Point10: "top-[60%] left-[calc(50%+31.67%)]", //  right small 2
            Point11: "top-[48%] left-[calc(50%+43.75%)]", //  right small 1
            Point12: "top-[35%] left-[calc(50%+31.67%)]", //  right big
            Point13: "top-[60%] left-[calc(50%-31.67%)]", //  left small 2
            Point14: "top-[48%] left-[calc(50%-43.75%)]", //  left small 1
            Point15: "top-[35%] left-[calc(50%-31.67%)]", //  left big
            Point16: "top-[7%]  left-[calc(50%+20%)]", //  down small 2
            Point17: "top-[7%]  left-[calc(50%-20%)]", //  top left small
            Point18: "top-[82%] left-[calc(50%-10%)]", //  top right small
          },
        },
      });
  }
}

export { TraceTable };

function pathUrl(path: string) {
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/path/${path}.png`;
}
