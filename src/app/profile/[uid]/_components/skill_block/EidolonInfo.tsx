import { cn, img, range } from "@/lib/utils";
import { HTMLAttributes, forwardRef, useContext } from "react";
import { CardConfigContext } from "../../ConfigControllerContext";
import Image from "next/image";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const EidolonInfo = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    const { currentCharacter } = useContext(CardConfigContext);
    if (!currentCharacter) return null;
    const { rank, rank_icons } = currentCharacter;

    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 pt-[72px]",
          className
        )}
        ref={ref}
        {...props}
      >
        {Array.from(range(1, 6)).map((eid) => (
          <div key={eid}>
            <Image
              src={img(rank_icons[eid - 1])}
              alt={String(eid)}
              width={48}
              height={48}
              className={ eid <= rank ? 'opacity-100' : 'opacity-25'}
            />
          </div>
        ))}
      </div>
    );
  }
);
EidolonInfo.displayName = "EidolonInfo ";
