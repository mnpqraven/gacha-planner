import { HTMLAttributes, forwardRef, useCallback } from "react";
import SVG from "react-inlinesvg";
import { cn, img, range } from "@/lib/utils";
import { Badge } from "@/app/components/ui/Badge";
import { prettyProperty, propertyIconUrl } from "@/lib/propertyHelper";
import { cva } from "class-variance-authority";
import { RelicType } from "@/bindings/RelicConfig";
import { RelicInput } from "@/app/card/_store/relic";
import { CircleSlash, Loader2 } from "lucide-react";
import Image from "next/image";
import { PrimitiveAtom, useAtomValue } from "jotai";
import { MarkerIcon } from "./MarkerIcon";
import { calculateSpread } from "@/app/card/custom/_editor/_relic/SubstatSpreadConfig";
import { SubStatSchema } from "@/hooks/useStatParser";
import { judgeRollValue } from "@/app/card/custom/_editor/_relic/SpreadConfigBar";
import { RelicSubAffixConfig } from "@/bindings/RelicSubAffixConfig";
import { mainstatSpreadAtom, substatSpreadAtom } from "@/store/queries";

interface RelicProps extends HTMLAttributes<HTMLDivElement> {
  atom: PrimitiveAtom<RelicInput>;
}
export const RelicBox = forwardRef<HTMLDivElement, RelicProps>(
  ({ atom, className, ...props }, ref) => {
    const data = useAtomValue(atom);
    const mainstatSpread = useAtomValue(mainstatSpreadAtom);
    const substatSpread = useAtomValue(substatSpreadAtom);

    const splitSubstatValue = useCallback(
      (sub: SubStatSchema, spread: RelicSubAffixConfig) =>
        calculateSpread({ value: sub.value, spreadData: spread }),
      []
    );
    const judge = useCallback(
      (roll: number, spread: RelicSubAffixConfig) =>
        judgeRollValue(roll, spread),
      []
    );

    function cal(sub: SubStatSchema | undefined) {
      const spreadInfo = substatSpread?.find(
        (e) => e.property == sub?.property
      );
      if (!!sub && !!spreadInfo) {
        return splitSubstatValue(sub, spreadInfo).rolls.map((roll) =>
          judge(roll, spreadInfo)
        );
      }
      return [];
    }

    const promotionConfig = mainstatSpread[data.type].find(
      (e) => e.property == data.property
    );
    const mainStatValue =
      (promotionConfig?.base_value ?? 0) +
      (promotionConfig?.level_add ?? 0) * data.level;

    return (
      <div
        className={cn(
          "flex h-fit gap-1 rounded-md border p-2 shadow-md shadow-border",
          className
        )}
        ref={ref}
        {...props}
      >
        <div id="main" className="relative flex w-24 items-end justify-center">
          {!!data.setId ? (
            <Image
              className="absolute top-0 z-0 h-24 w-24"
              src={img(getUrl(data.setId, data.type))}
              alt=""
              width={96}
              height={96}
            />
          ) : (
            <CircleSlash className="absolute top-0 z-0 h-24 w-24 p-2" />
          )}
          <Badge className="absolute left-0 top-0 flex justify-center border px-1 shadow-md shadow-border">
            +{data.level}
          </Badge>
          <MarkerIcon
            className="absolute right-1.5 top-1.5"
            setId={data.setId}
          />

          {data.property && (
            <div className="z-10 flex w-full gap-1 font-bold">
              <SVG src={propertyIconUrl(data.property)} />

              {prettyProperty(data.property, mainStatValue).prettyValue}
            </div>
          )}
        </div>

        <div id="sub" className="flex flex-col gap-1">
          {data.subStats.map((sub, index) => (
            <div key={index} className="flex flex-col">
              <div key={index} className="flex justify-between gap-1">
                {!!sub ? (
                  <>
                    <SVG src={propertyIconUrl(sub.property)} />
                    {prettyProperty(sub.property, sub.value).prettyValue}
                  </>
                ) : (
                  <Loader2 className="h-6 w-6 animate-[spin_3s_linear_infinite]" />
                )}
              </div>

              <div id="substat-counter" className="flex gap-1">
                {Array.from(range(1, data.rarity + 1)).map((num, index) => (
                  <div
                    key={num}
                    className={substatVariant({
                      currentCount: num,
                      substatCount: sub?.step ?? 0,
                      // rarity: data.rarity as 3 | 4 | 5,
                      type: cal(sub).at(index) ?? "ERROR",
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
RelicBox.displayName = "Relic";

function getUrl(setId: number, type: RelicType | undefined) {
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

function substatVariant({
  substatCount,
  currentCount,
  // rarity,
  type,
}: {
  substatCount: number;
  currentCount: number;
  // rarity: 3 | 4 | 5;
  type: "LOW" | "MID" | "HIGH" | "ERROR";
}) {
  const variant = cva("h-[3px] w-4 border-skewed", {
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
      type: {
        LOW: "bg-[#4f79b2]",
        MID: "bg-[#c199fd]",
        HIGH: "bg-[#ffc870]",
        ERROR: "bg-red-500",
        NONE: "bg-gray-600",
      },
    },
    defaultVariants: { placement: "first", type: "NONE" },
  });
  return variant({
    placement: currentCount == 1 ? "first" : "notFirst",
    type: substatCount >= currentCount ? type : "NONE",
  });
}
