import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const SpiderChart = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn(className)} ref={ref} {...props}>
        spiderChart
      </div>
    );
  }
);
SpiderChart.displayName = "SpiderChart ";
