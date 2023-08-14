import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef, useContext } from "react";
import Image from "next/image";
import { img } from "@/app/profile/page";
import { ImpositionIcon } from "../ImpositionIcon";
import { CardConfigContext } from "../../ConfigControllerContext";

interface Props extends HTMLAttributes<HTMLDivElement> {
  displayStat?: boolean;
}
export const LightConeInfo = forwardRef<HTMLDivElement, Props>(
  ({ displayStat = false, className, ...props }, ref) => {
    const ratio = 902 / 1260;
    const { currentCharacter } = useContext(CardConfigContext);

    if (!currentCharacter) return null;

    const { light_cone } = currentCharacter;
    const { rank, name, level, portrait, attributes } = light_cone;
    const maxLevel = light_cone.promotion * 10 + 20;

    return (
      <div
        className={cn("flex flex-col items-center", className)}
        ref={ref}
        {...props}
      >
        <div className="flex h-[72px] gap-2">
          <ImpositionIcon imposition={rank} className="place-self-center" />

          <div className="flex flex-col">
            <div className="font-bold">{name}</div>
            <div>
              <span className="font-bold">Lv. {level}</span> / {maxLevel}
            </div>
          </div>
        </div>

        <div className="flex grow items-center">
          <Image
            src={img(portrait)}
            alt=""
            width={400 * ratio}
            height={400 / ratio}
            className="justify-self-end"
          />
        </div>
        {displayStat && (
          <div className="flex">
            {attributes.map((attr) => (
              <div key={attr.field}>
                <Image src={img(attr.icon)} alt="" width={32} height={32} />
                {attr.display}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
LightConeInfo.displayName = "LightConeInfo";
