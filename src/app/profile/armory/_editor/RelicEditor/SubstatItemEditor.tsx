import { RelicSubAffixConfig } from "@/bindings/RelicSubAffixConfig";
import { cva } from "class-variance-authority";
import { HTMLAttributes, ReactNode, forwardRef } from "react";
import { substatRollButtons } from "../constant";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import { Toggle } from "@/app/components/ui/Toggle";
import { propertyIsPercent } from "../relicConfig";

interface Props extends HTMLAttributes<HTMLDivElement> {
  spread: RelicSubAffixConfig;
  value: number | undefined;
  onValueChange: (to: number) => void;
}

const variant = cva("h-1.5 w-8 border-skewed", {
  variants: {
    status: {
      LOW: "bg-[#4f79b2]",
      MID: "bg-[#c199fd]",
      HIGH: "bg-[#ffc870] ",
      default: "bg-gray-600",
    },
  },
  defaultVariants: { status: "default" },
});

export const SubstatItemEditor = forwardRef<HTMLDivElement, Props>(
  ({ spread, value, onValueChange, ...props }, ref) => {
    const { base_value, step_num, step_value, property } = spread;

    function roll(value: "HIGH" | "MID" | "LOW" | "NONE") {
      let val = 0;
      switch (value) {
        case "HIGH":
          val = base_value + step_num * step_value;
          break;
        case "MID":
          val = base_value + (step_num * step_value) / 2;
          break;
        case "LOW":
          val = base_value;
          break;
        default:
          break;
      }

      onValueChange(propertyIsPercent(property) ? val * 100 : val);
    }

    return (
      <div {...props} ref={ref}>
        <div
          className={variant({
            status:
              (value ?? 0) > 0 ? judgeRollValue(value ?? 0, spread) : "default",
          })}
        />

        {substatRollButtons.map(({ icon, label, key }) => (
          <SubstatControlIcon
            key={key}
            label={label}
            icon={icon}
            onClick={() => roll(key)}
          />
        ))}
      </div>
    );
  }
);
SubstatItemEditor.displayName = "SubstatItemEditor";

interface ControlIconProps extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: ReactNode;
}
const SubstatControlIcon = forwardRef<HTMLButtonElement, ControlIconProps>(
  ({ label, icon, ...props }, ref) => (
    <Tooltip disableHoverableContent>
      <TooltipTrigger asChild>
        <Toggle className="h-6 w-6 p-0" {...props} ref={ref}>
          {icon}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  )
);
SubstatControlIcon.displayName = "SubstatControlIcon";

function judgeRollValue(
  value: number,
  spreadInfo: RelicSubAffixConfig
): "LOW" | "MID" | "HIGH" {
  const lowerBound = spreadInfo.base_value;
  const upperBound =
    spreadInfo.base_value + spreadInfo.step_num * spreadInfo.step_value;

  const diffPool = upperBound - lowerBound;
  // this is supposed to never happen
  if (upperBound <= lowerBound) {
    return "MID";
  }
  const val = propertyIsPercent(spreadInfo.property) ? value / 100 : value;
  const valueDiff = val - lowerBound;
  const ratio = valueDiff / diffPool;
  if (ratio < 0.33) return "LOW";
  if (ratio >= 0.33 && ratio < 0.66) return "MID";
  return "HIGH";
}
