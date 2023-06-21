import { DbCharacterSkillTree } from "@/bindings/DbCharacterSkillTree";
import ENDPOINT, { IMAGE_URL } from "@/server/endpoints";
import { typedFetch } from "@/server/fetchHelper";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { cn, parseSkillType } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";
import { useEffect, useState } from "react";
import { DbAttributeProperty } from "@/bindings/DbAttributeProperty";
import { SimpleSkill } from "@/bindings/PatchBanner";
import { Slider } from "../ui/Slider";

type Props = {
  characterId: number;
  path:
    | "Erudition"
    | "Nihility"
    | "Destruction"
    | "Hunt"
    | "Preservation"
    | "Harmony"
    | "Abundance";
};
const TraceTable = ({ characterId, path }: Props) => {
  const updateLines = useXarrow();
  const { data } = useQuery({
    queryKey: ["trace", characterId],
    queryFn: async () =>
      await typedFetch<undefined, { list: DbCharacterSkillTree[] }>(
        ENDPOINT.mhyTrace,
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

  useEffect(() => {
    if (data) updateLines();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const iconVariants = cva("rounded-full", {
    variants: {
      variant: {
        smallNode: "bg-zinc-700 invert scale-50",
        bigNode: "bg-zinc-700 invert scale-90",
        skillNode: "bg-zinc-700 scale-75",
      },
    },
    defaultVariants: {
      variant: "smallNode",
    },
  });

  return (
    <div id="parent-wrapper" className="h-full w-full relative">
      <Xwrapper>
        {data &&
          skillDescriptions.data &&
          data.list.map((traceNode) => (
            <div
              id={traceNode.anchor}
              key={traceNode.id}
              // className={cn("Nihility", traceNode.anchor, "absolute")}
              className={cn(
                getTraceVariants(path)({ anchor: traceNode.anchor })
              )}
            >
              <Popover>
                <PopoverTrigger>
                  <Image
                    className={iconVariants({
                      variant: isSmallTrace(traceNode)
                        ? "smallNode"
                        : isSkillNode(traceNode)
                        ? "skillNode"
                        : "bigNode",
                    })}
                    src={IMAGE_URL + traceNode.icon}
                    alt={`${traceNode.id}`}
                    width={64}
                    height={64}
                  />
                </PopoverTrigger>
                <PopoverContent
                  className={cn(
                    "w-fit",
                    isSkillNode(traceNode) ? "md:w-[50vw]" : ""
                  )}
                >
                  <TraceDescription
                    trace={traceNode}
                    propertyBucket={properties.data?.list}
                    skills={skillDescriptions.data.list}
                  />
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
              color="white"
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
const TraceDescription = ({
  trace,
  propertyBucket = [],
  skills,
}: {
  trace: DbCharacterSkillTree;
  propertyBucket: DbAttributeProperty[] | undefined;
  skills: SimpleSkill[];
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
    const skillDescription = selectedSkill.description.reduce((a, b, index) => {
      if (index === 0) return a + b; // index 0 is before a
      else {
        if (!selectedSkill.params[selectedSlv])
          return a + selectedSkill.params[0][index - 1] + b;
        return a + selectedSkill.params[selectedSlv][index - 1] + b;
      }
    }, "");

    return (
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          {selectedSkill.name} - {parseSkillType(selectedSkill.ttype)} - Level{" "}
          {selectedSlv + 1}
        </h3>
        {selectedSkill.params.length > 1 && (
          <Slider
            className="py-4"
            defaultValue={[0]}
            min={0}
            max={selectedSkill.params.length - 1}
            onValueChange={(e) => setSelectedSlv(e[0])}
          />
        )}

        <p>{skillDescription}</p>
      </div>
    );
  }

  // TODO: big traces + skill

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
            Point01: "top-[46%] left-[calc(50%-32px-84px)]", //  basic
            Point02: "top-[46%] left-[calc(50%-32px+84px)]", //  skill
            Point03: "top-[46%] left-[calc(50%-32px)]", //  ult
            Point04: "top-[28%] left-[calc(50%-32px)]", //  talent
            Point05: "top-[77%] left-[calc(50%-32px)]", //  tech
            Point06: "top-[46%] left-[calc(50%-32px-152px)]", //  left big
            Point07: "top-[46%] left-[calc(50%-32px+152px)]", //  right big
            Point08: "top-[8%]  left-[calc(50%-32px)]", //  up big
            Point09: "top-[75%] left-[calc(50%-32px-84px)]", //  down small 1
            Point10: "top-[46%] left-[calc(50%-32px-226px)]", //  left small 1
            Point11: "top-[61%] left-[calc(50%-32px-200px)]", //  left small 2
            Point12: "top-[32%] left-[calc(50%-32px-200px)]", //  left small 3
            Point13: "top-[46%] left-[calc(50%-32px+226px)]", //  right small 1
            Point14: "top-[61%] left-[calc(50%-32px+200px)]", //  right small 2
            Point15: "top-[32%] left-[calc(50%-32px+200px)]", //  right small 2
            Point16: "top-[12%]  left-[calc(50%-32px-96px)]", //  top left small
            Point17: "top-[12%]  left-[calc(50%-32px+96px)]", //  top right small
            Point18: "top-[75%] left-[calc(50%-32px+84px)]", //  down small 2
          },
        },
      });
    case "Nihility":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[42%] left-[calc(50%-32px-84px)]", //  basic
            Point02: "top-[42%] left-[calc(50%-32px+84px)]", //  skill
            Point03: "top-[38%] left-[calc(50%-32px)]", //  ult
            Point04: "top-[20%] left-[calc(50%-32px)]", //  talent
            Point05: "top-[57%] left-[calc(50%-32px)]", //  tech
            Point06: "top-[30%] left-[calc(50%-32px-152px)]", //  left big
            Point07: "top-[30%] left-[calc(50%-32px+152px)]", //  right big
            Point08: "top-[2%]  left-[calc(50%-32px)]", //  up big
            Point09: "top-[70%] left-[calc(50%-32px)]", //  down small 1
            Point10: "top-[43%] left-[calc(50%-32px-210px)]", //  left small 1
            Point11: "top-[55%] left-[calc(50%-32px-152px)]", //  left small 2
            Point12: "top-[67%] left-[calc(50%-32px-84px)]", //  left small 3
            Point13: "top-[43%] left-[calc(50%-32px+210px)]", //  right small 1
            Point14: "top-[55%] left-[calc(50%-32px+152px)]", //  right small 2
            Point15: "top-[67%] left-[calc(50%-32px+84px)]", //  right small 2
            Point16: "top-[6%]  left-[calc(50%-32px-96px)]", //  top left small
            Point17: "top-[6%]  left-[calc(50%-32px+96px)]", //  top right small
            Point18: "top-[85%] left-[calc(50%-32px)]", //  down small 2
          },
        },
      });
    case "Destruction":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[47%] left-[calc(50%-32px-84px)]", //  basic
            Point02: "top-[47%] left-[calc(50%-32px+84px)]", //  skill
            Point03: "top-[47%] left-[calc(50%-32px)]", //  ult
            Point04: "top-[32%] left-[calc(50%-32px)]", //  talent
            Point05: "top-[62%] left-[calc(50%-32px)]", //  tech
            Point06: "top-[72%] left-[calc(50%-32px-84px)]", //  left small 3
            Point07: "top-[72%] left-[calc(50%-32px+84px)]", //  right small 2
            Point08: "top-[15%]  left-[calc(50%-32px)]", //  up big
            Point09: "top-[80%] left-[calc(50%-32px)]", //  down small 1
            Point10: "top-[60%] left-[calc(50%-32px-152px)]", //  left small 2
            Point11: "top-[48%] left-[calc(50%-32px-210px)]", //  left small 1
            Point12: "top-[35%] left-[calc(50%-32px-152px)]", //  left big
            Point13: "top-[60%] left-[calc(50%-32px+152px)]", //  right small 2
            Point14: "top-[48%] left-[calc(50%-32px+210px)]", //  right small 1
            Point15: "top-[35%] left-[calc(50%-32px+152px)]", //  right big
            Point16: "top-[2%] left-[calc(50%-32px)]", //  down small 2
            Point17: "top-[7%]  left-[calc(50%-32px-96px)]", //  top left small
            Point18: "top-[7%]  left-[calc(50%-32px+96px)]", //  top right small
          },
        },
      });
    case "Hunt":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[47%] left-[calc(50%-32px-84px)]", //  basic
            Point02: "top-[47%] left-[calc(50%-32px+84px)]", //  skill
            Point03: "top-[45%] left-[calc(50%-32px)]", //  ult
            Point04: "top-[28%] left-[calc(50%-32px)]", //  talent
            Point05: "top-[62%] left-[calc(50%-32px)]", //  tech
            Point06: "top-[72%] left-[calc(50%-32px-84px)]", //  left small 3
            Point07: "top-[72%] left-[calc(50%-32px+84px)]", //  right small 2
            Point08: "top-[13%]  left-[calc(50%-32px)]", //  up big
            Point09: "top-[80%] left-[calc(50%-32px)]", //  down small 1
            Point10: "top-[60%] left-[calc(50%-32px-152px)]", //  left small 2
            Point11: "top-[48%] left-[calc(50%-32px-210px)]", //  left small 1
            Point12: "top-[35%] left-[calc(50%-32px-152px)]", //  left big
            Point13: "top-[60%] left-[calc(50%-32px+152px)]", //  right small 2
            Point14: "top-[48%] left-[calc(50%-32px+210px)]", //  right small 1
            Point15: "top-[35%] left-[calc(50%-32px+152px)]", //  right big
            Point16: "top-[0%] left-[calc(50%-32px)]", //  down small 2
            Point17: "top-[5%]  left-[calc(50%-32px-96px)]", //  top left small
            Point18: "top-[5%]  left-[calc(50%-32px+96px)]", //  top right small
          },
        },
      });
    case "Preservation":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[47%] left-[calc(50%-32px-84px)]", //  basic
            Point02: "top-[47%] left-[calc(50%-32px+84px)]", //  skill
            Point03: "top-[46%] left-[calc(50%-32px)]", //  ult
            Point04: "top-[30%] left-[calc(50%-32px)]", //  talent
            Point05: "top-[62%] left-[calc(50%-32px)]", //  tech
            Point06: "top-[72%] left-[calc(50%-32px-112px)]", //  left small 3
            Point07: "top-[72%] left-[calc(50%-32px+112px)]", //  right small 2
            Point08: "top-[14%]  left-[calc(50%-32px)]", //  up big
            Point09: "top-[75%] left-[calc(50%-32px)]", //  down small 1
            Point10: "top-[60%] left-[calc(50%-32px-180px)]", //  left small 2
            Point11: "top-[48%] left-[calc(50%-32px-228px)]", //  left small 1
            Point12: "top-[35%] left-[calc(50%-32px-152px)]", //  left big
            Point13: "top-[60%] left-[calc(50%-32px+180px)]", //  right small 2
            Point14: "top-[48%] left-[calc(50%-32px+228px)]", //  right small 1
            Point15: "top-[35%] left-[calc(50%-32px+152px)]", //  right big
            Point16: "top-[0%] left-[calc(50%-32px)]", //  down small 2
            Point17: "top-[5%]  left-[calc(50%-32px-96px)]", //  top left small
            Point18: "top-[5%]  left-[calc(50%-32px+96px)]", //  top right small
          },
        },
      });
    case "Harmony":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[34%] left-[calc(50%-32px-84px)]", //  basic
            Point02: "top-[34%] left-[calc(50%-32px+84px)]", //  skill
            Point03: "top-[52%] left-[calc(50%-32px)]", //  ult
            Point04: "top-[28%] left-[calc(50%-32px)]", //  talent
            Point05: "top-[69%] left-[calc(50%-32px)]", //  tech
            Point06: "top-[52%] left-[calc(50%-32px-152px)]", //  left big
            Point07: "top-[52%] left-[calc(50%-32px+176px)]", //  right big
            Point08: "top-[14%] left-[calc(50%-32px)]", //  up big
            Point09: "top-[83%] left-[calc(50%-32px)]", //  down middle small
            Point10: "top-[40%] left-[calc(50%-32px-210px)]", //  left small 1
            Point11: "top-[27%] left-[calc(50%-32px-152px)]", //  left small 2
            Point12: "top-[80%] left-[calc(50%-32px-84px)]", //  down left small
            Point13: "top-[65%] left-[calc(50%-32px+122px)]", //  right small 1
            Point14: "top-[55%] left-[calc(50%-32px+96px)]", //  right small 2
            Point15: "top-[80%] left-[calc(50%-32px+84px)]", //  down right small
            Point16: "top-[2%]  left-[calc(50%-32px)]", //  top middle
            Point17: "top-[6%]  left-[calc(50%-32px-96px)]", //  top right small
            Point18: "top-[6%]  left-[calc(50%-32px+96px)]", //  top left small
          },
        },
      });
    case "Abundance":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[37%] left-[calc(50%-32px-84px)]", //  basic
            Point02: "top-[37%] left-[calc(50%-32px+84px)]", //  skill
            Point03: "top-[43%] left-[calc(50%-32px)]", //  ult
            Point04: "top-[25%] left-[calc(50%-32px)]", //  talent
            Point05: "top-[62%] left-[calc(50%-32px)]", //  tech
            Point06: "top-[72%] left-[calc(50%-32px+84px)]", //  right small 2
            Point07: "top-[72%] left-[calc(50%-32px-84px)]", //  left small 3
            Point08: "top-[4%]  left-[calc(50%-32px)]", //  up big
            Point09: "top-[82%] left-[calc(50%-32px+48px)]", //  down small 1
            Point10: "top-[60%] left-[calc(50%-32px+152px)]", //  right small 2
            Point11: "top-[48%] left-[calc(50%-32px+210px)]", //  right small 1
            Point12: "top-[35%] left-[calc(50%-32px+152px)]", //  right big
            Point13: "top-[60%] left-[calc(50%-32px-152px)]", //  left small 2
            Point14: "top-[48%] left-[calc(50%-32px-210px)]", //  left small 1
            Point15: "top-[35%] left-[calc(50%-32px-152px)]", //  left big
            Point16: "top-[7%]  left-[calc(50%-32px+96px)]", //  down small 2
            Point17: "top-[7%] left-[calc(50%-32px-96px)]", //  top left small
            Point18: "top-[82%] left-[calc(50%-32px-48px)]", //  top right small
          },
        },
      });
  }
}

export { TraceTable };
