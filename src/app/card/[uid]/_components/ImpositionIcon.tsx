import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  imposition: number;
}

const ImpositionIcon = forwardRef<HTMLDivElement, Props>(
  ({ imposition, className, ...props }, ref) => (
    <div
      className={cn(
        "aspect-square h-6 w-6 select-none rounded-full bg-background text-center font-[Cinzel] font-medium",
        imposition >= 5
          ? "bg-[#F9CC71] text-[#191919]"
          : "bg-[#191919] text-[#F9CC71]",
        className
      )}
      ref={ref}
      style={{ lineHeight: "24px" }}
      {...props}
    >
      {asRoman(imposition)}
    </div>
  )
);
ImpositionIcon.displayName = "ImpositionIcon";

export { ImpositionIcon };

function asRoman(value: number) {
  switch (value) {
    case 1:
      return "I";
    case 2:
      return "II";
    case 3:
      return "III";
    case 4:
      return "IV";
    case 5:
      return "V";
    case 6:
      return "VI";
  }
}
