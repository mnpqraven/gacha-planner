import { RelicInput } from "@/app/card/_store/relic";
import { Input } from "@/app/components/ui/Input";
import { cn } from "@/lib/utils";
import { PrimitiveAtom, useAtom } from "jotai";
import { focusAtom } from "jotai-optics";
import { HTMLAttributes, forwardRef, useMemo } from "react";

interface Props extends HTMLAttributes<HTMLInputElement> {
  atom: PrimitiveAtom<RelicInput>;
}

export const RelicLevel = forwardRef<HTMLInputElement, Props>(
  ({ atom, className, ...props }, ref) => {
    const levelAtom = useMemo(
      () => focusAtom(atom, (optic) => optic.prop("level")),
      [atom]
    );
    const [level, setLevel] = useAtom(levelAtom);

    return (
      <Input
        className={cn("w-12", className)}
        value={level}
        type="number"
        min={0}
        max={15}
        onChange={(e) => {
          if (!Number.isNaN(e.target.value)) setLevel(parseInt(e.target.value));
        }}
        {...props}
        ref={ref}
      />
    );
  }
);
RelicLevel.displayName = "RelicLevel";
