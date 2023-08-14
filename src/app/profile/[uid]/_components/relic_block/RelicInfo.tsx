import { asPercentage, cn, img, range } from "@/lib/utils";
import { HTMLAttributes, forwardRef, useContext } from "react";
import {
  MihomoPropertyConfig,
  MihomoRelicConfig,
  MihomoRelicSetConfig,
  MihomoSubAffixInfo,
} from "@/app/profile/types";
import Image from "next/image";
import { Badge } from "@/app/components/ui/Badge";
import { CardConfigContext } from "../../ConfigControllerContext";
import SVG from "react-inlinesvg";
import { cva } from "class-variance-authority";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const RelicInfo = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    const { currentCharacter } = useContext(CardConfigContext);
    if (!currentCharacter) return null;
    // TODO: add indicator for relic_set
    const { relics, relic_sets } = currentCharacter;
    return (
      <div className={cn(className, "grid grid-cols-2 gap-2")} ref={ref} {...props}>
        {relics.map((relic, index) => (
          <Relic data={relic} key={index} setList={relic_sets} />
        ))}
      </div>
    );
  }
);
RelicInfo.displayName = "RelicInfo";

interface RelicProps {
  data: MihomoRelicConfig;
  setList: MihomoRelicSetConfig[];
}
function Relic({ data }: RelicProps) {
  // NOTED: upperbound = 6
  return (
    <div className="flex h-fit rounded-md border p-2 shadow-md shadow-border">
      <div
        id="main"
        className="relative flex w-24 items-end justify-center"
      >
        <div
          className="absolute top-0 z-0 h-24 w-24"
          style={{
            backgroundImage: `url(${img(data.icon)})`,
            backgroundSize: "cover",
          }}
        />
        <Badge className="absolute left-0 top-0 flex justify-center px-1">
          +{data.level}
        </Badge>
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
            <div key={index} className="flex gap-1">
              <SVG src={getStatUrl(sub)} />
              {sub.percent ? asPercentage(sub.value) : sub.display}
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
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
