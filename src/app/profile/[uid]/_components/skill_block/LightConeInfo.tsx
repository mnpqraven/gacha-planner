import { cn, img } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import Image from "next/image";
import { ImpositionIcon } from "../ImpositionIcon";
import { useCardConfigController } from "../../ConfigControllerContext";

interface Props extends HTMLAttributes<HTMLDivElement> {
  displayStat?: boolean;
}
export const LightConeInfo = forwardRef<HTMLDivElement, Props>(
  ({ displayStat = false, className, ...props }, ref) => {
    const ratio = 902 / 1260;
    const { currentCharacter } = useCardConfigController();

    if (!currentCharacter) return null;

    const { light_cone } = currentCharacter;
    const { rank, name, level, portrait, attributes } = light_cone;
    const maxLevel = light_cone.promotion * 10 + 20;

    return (
      <div
        className={cn("flex flex-grow-0 flex-col items-center", className)}
        ref={ref}
        {...props}
      >
        <div className="flex h-[72px] flex-col items-center">
          <span className="font-bold">{name}</span>

          <span className="flex">
            <span className="font-bold">Lv. {level}</span> / {maxLevel}
            <ImpositionIcon imposition={rank} className="ml-2.5" />
          </span>

          {displayStat && (
            <div className="flex">
              {attributes.map((attr) => (
                <div key={attr.field} className="flex items-center">
                  <Image src={img(attr.icon)} alt="" width={32} height={32} />
                  {attr.display}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex grow items-center">
          <Image
            src={img(portrait)}
            alt=""
            width={350 * ratio}
            height={350}
            className="justify-self-end shadow-xl shadow-border"
          />
        </div>
      </div>
    );
  }
);
LightConeInfo.displayName = "LightConeInfo";
