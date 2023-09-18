import { cn, img, range } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import { Badge } from "@/app/components/ui/Badge";
import SVG from "react-inlinesvg";
import { cva } from "class-variance-authority";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import { CardConfig } from "../../configReducer";
import { ParsedRelicSchema } from "@/hooks/useStatParser";
import { RelicCategory } from "@/app/profile/armory/schema";
import { prettyProperty, propertyIconUrl } from "@/lib/propertyHelper";
import { useRelicSetBonuses } from "@/hooks/queries/useRelicSetBonus";
import { useRelicSets } from "@/hooks/queries/useRelicSetList";
import { SkillDescription } from "@/app/components/Db/SkillDescription";
import { useAtomValue } from "jotai";
import { relicsStructAtom } from "@/app/profile/armory-jotai/_store/relic";
import { configAtom } from "@/app/profile/armory-jotai/_store/main";
import { RelicJotai } from "@/app/profile/armory-jotai/_viewer/_relic/Relic";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const RelicInfo = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    const config = useAtomValue(configAtom);
    const characterRelics = useAtomValue(relicsStructAtom);
    // TODO: resolve type conflict
    // rendering null values for setIds, showing placeholder images

    return (
      <div
        className={cn("flex flex-col gap-2", className)}
        ref={ref}
        {...props}
      >
        {config.showBaseUrl && (
          <span className="flex-1 self-end text-muted-foreground">
            hsr.othi.dev/profile
          </span>
        )}

        <div className={cn("grid grid-cols-2 gap-2 place-self-center")}>
          {characterRelics.map((relic, index) => (
            <RelicJotai
              data={relic}
              key={index}
              active={isActive(relic.setId, characterRelics)}
            />
          ))}
        </div>

        {/* <SetInfo relics={characterRelics} config={config} /> */}
      </div>
    );
  }
);
RelicInfo.displayName = "RelicInfo";

interface SetInfoProps extends HTMLAttributes<HTMLButtonElement> {
  relics: ParsedRelicSchema[];
  config: CardConfig;
}
const SetInfo = forwardRef<HTMLButtonElement, SetInfoProps>(
  ({ relics, config, className, ...props }, ref) => {
    const { hoverVerbosity } = config;
    const { data: relicBonuses } = useRelicSetBonuses();
    const { data: relicSets } = useRelicSets();

    if (!relicBonuses || !relicSets) return null;

    const activeSets = relicBonuses.filter((e) =>
      relics.map((a) => a.setId).includes(e.set_id)
    );

    let setSummary: { setId: number; num: number; name: string | undefined }[] =
      [];
    activeSets.forEach(({ set_id }) => {
      const currentNum = relics.filter((e) => e.setId == set_id).length;
      const find = relicBonuses.find((e) => e.set_id == set_id);
      if (!!find) {
        const validIndexed = find.require_num.filter(
          (num) => num <= currentNum
        );
        if (validIndexed.length) {
          setSummary.push({
            setId: set_id,
            num: Math.max(...validIndexed),
            name: relicSets.find((e) => e.set_id == set_id)?.set_name,
          });
        }
      }
    });

    return (
      <div className="gap-2 rounded-md border p-2 shadow-md shadow-border">
        <Tooltip>
          <TooltipTrigger
            className={cn("flex flex-col", className)}
            ref={ref}
            disabled={hoverVerbosity === "none"}
            {...props}
          >
            {setSummary.sort(bySetId).map(({ name, num }, index) => (
              <div key={index} className="flex items-center gap-2">
                <MarkerIcon className="inline-block align-middle" />

                <span className="font-semibold text-green-600">{num}pc</span>

                <span className="ml-2">{name}</span>
              </div>
            ))}
          </TooltipTrigger>
          {hoverVerbosity !== "none" && (
            <TooltipContent
              side="top"
              sideOffset={25}
              className="flex w-96 flex-col gap-3 py-2 text-justify text-base"
            >
              {activeSets.sort(bySetId).map((set, index) =>
                canShow(set.set_id, relics) ? (
                  <div className="flex flex-col" key={index}>
                    <p className="text-base font-bold text-accent-foreground">
                      {relicSets.find((e) => e.set_id == set.set_id)?.set_name}
                    </p>

                    {set.require_num.map((pc, index) =>
                      canShow(set.set_id, relics, pc) ? (
                        <div key={index}>
                          <span className="text-green-600">{pc}pc</span>:
                          <SkillDescription
                            skillDesc={set.skill_desc[index]}
                            paramList={set.ability_param_list}
                            slv={0}
                          />
                        </div>
                      ) : null
                    )}
                  </div>
                ) : null
              )}
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    );
  }
);
SetInfo.displayName = "SetInfo ";

interface RelicProps extends HTMLAttributes<HTMLDivElement> {
  data: ParsedRelicSchema;
  active?: boolean;
}
const Relic = forwardRef<HTMLDivElement, RelicProps>(
  ({ data, className, active, ...props }, ref) => {
    // NOTED: upperbound = 6
    const { mainStat } = data;
    return (
      <div
        className={cn(
          "flex h-[134px] gap-1 rounded-md border p-2 shadow-md shadow-border",
          className
        )}
        ref={ref}
        {...props}
      >
        <div id="main" className="relative flex w-24 items-end justify-center">
          <div
            className="absolute top-0 z-0 h-24 w-24"
            style={{
              backgroundImage: `url(${img(getUrl(data.setId, data.type))})`,
              backgroundSize: "cover",
            }}
          />
          <Badge className="absolute left-0 top-0 flex justify-center border px-1 shadow-md shadow-border">
            +{data.level}
          </Badge>
          {active && <MarkerIcon className="absolute right-1.5 top-1.5" />}

          <div className="z-10 flex w-full gap-1 font-bold">
            <SVG src={propertyIconUrl(mainStat.property)} />

            {prettyProperty(mainStat.property, mainStat.value).prettyValue}
          </div>
        </div>

        <div id="sub" className="flex flex-col gap-1">
          {data.subStats.map((sub, index) => (
            <div key={index} className="flex flex-col">
              <div key={index} className="flex justify-between gap-1">
                <SVG src={propertyIconUrl(sub.property)} />
                {prettyProperty(sub.property, sub.value).prettyValue}
              </div>

              <div id="substat-counter" className="flex gap-1">
                {Array.from(range(1, data.rarity + 1)).map((num) => (
                  <div
                    key={num}
                    className={substatVariant({
                      currentCount: num,
                      substatCount: sub.step,
                      rarity: data.rarity as 3 | 4 | 5,
                    })}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
Relic.displayName = "Relic";

const MarkerIcon = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      className={cn("h-2 w-2 rounded-full bg-green-600", className)}
      style={{
        boxShadow: "0 0 5px 1px rgb(22 163 74)",
      }}
      ref={ref}
      {...props}
    />
  )
);
MarkerIcon.displayName = "MarkerIcon";

function substatVariant({
  substatCount,
  currentCount,
  rarity,
}: {
  substatCount: number;
  currentCount: number;
  rarity: 3 | 4 | 5;
}) {
  const variant = cva("h-[2px] w-4 border-skewed", {
    variants: {
      placement: {
        first: "",
        notFirst: "-ml-1",
      },
      level: {
        reached3: "bg-[#4f79b2]",
        reached4: "bg-[#c199fd]",
        reached5: "bg-[#ffc870]",
        notReached: "bg-gray-600",
      },
    },
    defaultVariants: { placement: "first", level: "notReached" },
  });
  return variant({
    placement: currentCount == 1 ? "first" : "notFirst",
    level: substatCount >= currentCount ? `reached${rarity}` : "notReached",
  });
}

function getUrl(setId: number, type: RelicCategory | undefined) {
  let suffix: string | undefined = undefined;
  switch (type) {
    case "HEAD":
      suffix = "_0";
      break;
    case "HAND":
      suffix = "_1";
      break;
    case "BODY":
      suffix = "_2";
      break;
    case "FOOT":
      suffix = "_3";
      break;
    case "OBJECT":
      suffix = "_0";
      break;
    case "NECK":
      suffix = "_1";
      break;
    default:
      break;
  }
  return `icon/relic/${setId}${suffix}.png`;
}

function isActive<T extends { setId: number }>(
  currentSetId: number,
  relics: T[]
) {
  const count = relics.filter((e) => e.setId == currentSetId).length;
  return count >= 2;
}

function bySetId<T extends { setId?: number; set_id?: number }>(a: T, b: T) {
  return (a.setId ?? a.set_id ?? 0) - (b.setId ?? b.set_id ?? 0);
}

function canShow(
  setId: number,
  relics: ParsedRelicSchema[],
  requireNum: number = 2
) {
  return relics.filter((e) => e.setId == setId).length >= requireNum;
}
