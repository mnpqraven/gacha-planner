import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const SpiderChart = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative h-[300px] w-[300px] rounded-lg border",
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="flex items-center justify-center w-full h-full">spiderChart</div>
      </div>
    );
  }
);
SpiderChart.displayName = "SpiderChart ";
