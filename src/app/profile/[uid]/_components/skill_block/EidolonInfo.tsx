import { cn, img, range, sanitizeNewline } from "@/lib/utils";
import { Fragment, HTMLAttributes, forwardRef } from "react";
import { useCardConfigController } from "../../ConfigControllerContext";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import { useCharacterEidolon } from "@/hooks/queries/useCharacterEidolon";
import { AvatarRankConfig } from "@/bindings/AvatarRankConfig";

interface Props extends HTMLAttributes<HTMLDivElement> {
  characterId: number;
  eidolon: number;
}
export const EidolonInfo = forwardRef<HTMLDivElement, Props>(
  ({ className, characterId, eidolon, ...props }, ref) => {
    const { data: eidolons } = useCharacterEidolon(characterId);

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
          <EidolonIcon
            key={eid}
            src={img(getUrl(eid, characterId))}
            currentEidolon={eid}
            eidolonInfo={eidolons?.at(eid - 1)}
            eidolon={eidolon}
          />
        ))}
      </div>
    );
  }
);
EidolonInfo.displayName = "EidolonInfo ";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  currentEidolon: number;
  eidolon: number;
  width?: number;
  height?: number;
  eidolonInfo: AvatarRankConfig | undefined;
}
const EidolonIcon = forwardRef<HTMLDivElement, IconProps>(
  (
    {
      src,
      currentEidolon,
      eidolonInfo,
      eidolon,
      width = 48,
      height = 48,
      className,
      ...props
    },
    ref
  ) => {
    const { config } = useCardConfigController();
    const { hoverVerbosity } = config;

    return (
      <Tooltip>
        <TooltipTrigger disabled={hoverVerbosity === "none"}>
          <div className={cn("", className)} ref={ref} {...props}>
            <Image
              src={src}
              alt={String(currentEidolon)}
              width={width}
              height={height}
              className={cn(
                "invert dark:invert-0",
                currentEidolon <= eidolon ? "opacity-100" : "opacity-25"
              )}
            />
          </div>
        </TooltipTrigger>
        {hoverVerbosity === "simple" ? (
          <TooltipContent side="left">{eidolonInfo?.name}</TooltipContent>
        ) : hoverVerbosity === "detailed" ? (
          <TooltipContent
            className="w-96 py-2 text-justify text-base"
            side="left"
          >
            <p className="mb-2 text-base font-bold text-accent-foreground">
              {eidolonInfo?.name}
            </p>
            {eidolonInfo?.desc.map((descPart, index) => (
              <Fragment key={index}>
                <span className="whitespace-pre-wrap">
                  {sanitizeNewline(descPart)}
                </span>
                <span className="font-semibold text-accent-foreground">
                  {eidolonInfo.param[index]}
                </span>
              </Fragment>
            ))}
          </TooltipContent>
        ) : null}
      </Tooltip>
    );
  }
);
EidolonIcon.displayName = "EidolonIcon ";

function getUrl(rank: number, charId: number): string {
  switch (rank) {
    case 1:
      return `icon/skill/${charId}_rank1.png`;
    case 2:
      return `icon/skill/${charId}_rank2.png`;
    case 3:
      return `icon/skill/${charId}_skill.png`;
    case 4:
      return `icon/skill/${charId}_rank4.png`;
    case 5:
      return `icon/skill/${charId}_ultimate.png`;
    case 6:
      return `icon/skill/${charId}_rank6.png`;
    default:
      return "";
  }
}
