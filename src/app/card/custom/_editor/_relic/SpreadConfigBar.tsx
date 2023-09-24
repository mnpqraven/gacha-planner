import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import { cn } from "@/lib/utils";
import { PrimitiveAtom, useAtom } from "jotai";
import { HTMLAttributes, forwardRef } from "react";
import { RelicSubAffixConfig } from "@/bindings/RelicSubAffixConfig";
import { cva } from "class-variance-authority";
import { Button } from "@/app/components/ui/Button";
import { substatRollButtons } from "./relicConfig";

interface Props extends HTMLAttributes<HTMLDivElement> {
  atom: PrimitiveAtom<number>;
  spreadInfo: RelicSubAffixConfig;
}

const variant = cva("h-1.5 w-8 border-skewed mb-2", {
  variants: {
    status: {
      LOW: "bg-[#4f79b2]",
      MID: "bg-[#c199fd]",
      HIGH: "bg-[#ffc870]",
      ERROR: "bg-red-500",
      default: "bg-gray-600",
    },
  },
  defaultVariants: { status: "default" },
});

const SpreadConfigBar = forwardRef<HTMLDivElement, Props>(
  ({ atom, spreadInfo, className, ...props }, ref) => {
    const [ssValue, setSsValue] = useAtom(atom);

    function roll(key: "HIGH" | "MID" | "LOW" | "NONE") {
      setSsValue(getRollValue(key, spreadInfo));
    }

    return (
      <div
        ref={ref}
        className={cn(className, "flex flex-col items-center")}
        {...props}
      >
        <div
          className={variant({
            status:
              ssValue > 0 ? judgeRollValue(ssValue, spreadInfo) : "default",
          })}
        ></div>
        {substatRollButtons.map(({ key, icon, label }) => (
          <Tooltip key={key} disableHoverableContent>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="h-6 w-6 p-0"
                onClick={() => roll(key)}
              >
                {icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  }
);
SpreadConfigBar.displayName = "SpreadConfigBar";
export { SpreadConfigBar };

function judgeRollValue(
  value: number,
  spreadInfo: RelicSubAffixConfig
): "LOW" | "MID" | "HIGH" | "ERROR" {
  const lowerBound = spreadInfo.base_value;
  const upperBound =
    spreadInfo.base_value + spreadInfo.step_num * spreadInfo.step_value;

  const diffPool = upperBound - lowerBound;
  // this is supposed to never happen
  if (upperBound <= lowerBound) return "ERROR";

  const valueDiff = value - lowerBound;
  const ratio = valueDiff / diffPool;

  if (ratio < 0) return "ERROR";
  if (0 <= ratio && ratio < 0.33) return "LOW";
  if (0.33 <= ratio && ratio < 0.66) return "MID";
  return "HIGH";
}

function getRollValue(
  key: "HIGH" | "MID" | "LOW" | "NONE",
  spreadConfig: RelicSubAffixConfig
): number {
  const { base_value, step_num, step_value } = spreadConfig;
  switch (key) {
    case "HIGH":
      return base_value + step_num * step_value;
    case "MID":
      return base_value + (step_num * step_value) / 2;
    case "LOW":
      return base_value;
    case "NONE":
      return 0;
  }
}
