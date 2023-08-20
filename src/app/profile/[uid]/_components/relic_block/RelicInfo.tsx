import { asPercentage, cn, img, range } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import {
  MihomoPropertyConfig,
  MihomoRelicConfig,
  MihomoRelicSetConfig,
  MihomoSubAffixInfo,
} from "@/app/profile/types";
import { Badge } from "@/app/components/ui/Badge";
import { useCardConfigController } from "../../ConfigControllerContext";
import SVG from "react-inlinesvg";
import { cva } from "class-variance-authority";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const RelicInfo = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    const { currentCharacter } = useCardConfigController();

    if (!currentCharacter) return null;
    const { relics, relic_sets } = currentCharacter;

    const uniqueSets = getHighestRelicSets(relic_sets);
    const isActive = (relic: MihomoRelicConfig) =>
      uniqueSets.map((e) => e.id).includes(relic.set_id);

    return (
      <div
        className={cn("flex flex-col gap-2", className)}
        ref={ref}
        {...props}
      >
        <div className={cn("grid grid-cols-2 gap-2 place-self-center")}>
          {relics.map((relic, index) => (
            <Relic
              data={relic}
              key={index}
              setList={relic_sets}
              active={isActive(relic)}
            />
          ))}
        </div>

        <div className="gap-2 rounded-md border p-2 shadow-md shadow-border">
          {uniqueSets.map((relicSet, index) => (
            <div key={index} className="flex items-center">
              <MarkerIcon className="inline-block align-middle" />

              <span className="font-semibold text-green-600 ml-2">
                {relicSet.num}pc
              </span>

              <span className="ml-4">{relicSet.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
RelicInfo.displayName = "RelicInfo";

interface RelicProps extends HTMLAttributes<HTMLDivElement> {
  data: MihomoRelicConfig;
  setList: MihomoRelicSetConfig[];
  active: boolean;
}
const Relic = forwardRef<HTMLDivElement, RelicProps>(
  ({ data, className, setList, active, ...props }, ref) => {
    // NOTED: upperbound = 6
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
              backgroundImage: `url(${img(data.icon)})`,
              backgroundSize: "cover",
            }}
          />
          <Badge className="absolute left-0 top-0 flex justify-center border px-1 shadow-md shadow-border">
            +{data.level}
          </Badge>
          {active && <MarkerIcon className="absolute right-1.5 top-1.5" />}

          <div className="z-10 flex w-full gap-1 font-bold">
            <SVG src={getStatUrl(data.main_affix)} />

            {data.main_affix?.percent
              ? asPercentage(data.main_affix.value)
              : data.main_affix?.display}
          </div>
        </div>

        <div id="sub" className="flex flex-col gap-1">
          {data.sub_affix.map((sub, index) => (
            <div key={index} className="flex flex-col">
              <div key={index} className="flex justify-between gap-1">
                <SVG src={getStatUrl(sub)} />
                {sub.percent ? asPercentage(sub.value) : sub.value.toFixed(1)}
              </div>

              <div id="substat-counter" className="flex gap-1">
                {Array.from(range(1, data.rarity + 1, 1)).map((num) => (
                  <div
                    key={num}
                    className={substatVariant({
                      currentCount: num,
                      substatCount: sub.count,
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

function getHighestRelicSets(sets: MihomoRelicSetConfig[]) {
  // const uniqueIds = new Set(sets.map((set) => set.id));
  const res: { [setId: string]: MihomoRelicSetConfig } = {};

  // let highCount: { setId: string; count: number }[] = [];
  sets.forEach((set) => {
    // not in res yet, direct append
    if (!res[set.id]) {
      res[set.id] = set;
      // already in res, compare, only append if this count is higher
    } else {
      if (res[set.id].num < set.num) {
        res[set.id] = set;
      }
    }
  });
  return Object.values(res);
}

function getStatUrl(
  stat: MihomoPropertyConfig | MihomoSubAffixInfo | undefined
): string {
  if (!stat) return "";
  const trimmed = stat.icon.replace("icon", "").replace("png", "svg");
  return trimmed;
}

function substatVariant({
  substatCount,
  currentCount,
  rarity,
}: {
  substatCount: number;
  currentCount: number;
  rarity: 3 | 4 | 5;
}) {
  const variant = cva("border-skewed h-[2px] w-4", {
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
