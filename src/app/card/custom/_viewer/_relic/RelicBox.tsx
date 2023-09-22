import { HTMLAttributes, forwardRef } from "react";
import SVG from "react-inlinesvg";
import { cn, img, range } from "@/lib/utils";
import { Badge } from "@/app/components/ui/Badge";
import { prettyProperty, propertyIconUrl } from "@/lib/propertyHelper";
import { cva } from "class-variance-authority";
import { useMainStatSpread } from "@/hooks/queries/useMainStatSpread";
import { RelicType } from "@/bindings/RelicConfig";
import { RelicInput } from "@/app/card/_store/relic";

interface RelicProps extends HTMLAttributes<HTMLDivElement> {
  data: RelicInput;
  active?: boolean;
}
export const RelicBox = forwardRef<HTMLDivElement, RelicProps>(
  ({ data, className, active, ...props }, ref) => {
    // NOTE: upperbound = 6
    // TODO: placeholder render for unknown setId
    const { data: mainstatSpread } = useMainStatSpread();

    if (!data.setId || !data.property || !mainstatSpread)
      return (
        <div
          className={cn(
            "flex h-[134px] gap-1 rounded-md border p-2 shadow-md shadow-border",
            className
          )}
          ref={ref}
          {...props}
        >
          placeholder wrapper
        </div>
      );

    const promotionConfig = mainstatSpread[data.type].find(
      (e) => e.property == data.property
    );
    const mainStatValue =
      (promotionConfig?.base_value ?? 0) +
      (promotionConfig?.level_add ?? 0) * data.level;

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
            <SVG src={propertyIconUrl(data.property)} />

            {prettyProperty(data.property, mainStatValue).prettyValue}
          </div>
        </div>

        <div id="sub" className="flex flex-col gap-1">
          {data.subStats.map((sub, index) =>
            !!sub ? (
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
            ) : (
              <div key={index}>placeholdersub</div>
            )
          )}
        </div>
      </div>
    );
  }
);
RelicBox.displayName = "Relic";

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
