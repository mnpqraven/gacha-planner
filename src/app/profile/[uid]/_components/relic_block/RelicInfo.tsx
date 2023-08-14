import { SVG, cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef, useContext } from "react";
import {
  MihomoPropertyConfig,
  MihomoRelicConfig,
  MihomoRelicSetConfig,
  MihomoSubAffixInfo,
} from "@/app/profile/types";
import Image from "next/image";
import { img } from "@/app/profile/page";
import { Badge } from "@/app/components/ui/Badge";
import { CardConfigContext } from "../../ConfigControllerContext";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const RelicInfo = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    const { currentCharacter } = useContext(CardConfigContext);
    if (!currentCharacter) return null;
    // TODO: add indicator for relic_set
    const { relics, relic_sets } = currentCharacter;
    return (
      <div className={cn(className, "grid grid-cols-2")} ref={ref} {...props}>
        {relics.map((relic, index) => (
          <Relic data={relic} key={index} setList={relic_sets} />
        ))}
      </div>
    );
  }
);
RelicInfo.displayName = "RelicInfo";

interface RelicProps {
  data: MihomoRelicConfig;
  setList: MihomoRelicSetConfig[];
}
function Relic({ data }: RelicProps) {
  // NOTED: upperbound = 6
  return (
    <div className="flex h-fit rounded-md border">
      <Image
        src={img(data.icon)}
        alt=""
        width={64}
        height={64}
        className="h-16 w-16"
      />

      <div id="main" className="flex flex-col">
        <Badge>{data.level}</Badge>
        {data.main_affix?.display}
        <SVG src={getStatUrl(data.main_affix)} />
      </div>

      <div id="sub" className="flex flex-col">
        {data.sub_affix.map((sub, index) => (
          <div key={index} className="flex">
            <SVG src={getStatUrl(sub)} />
            {sub.display} ({sub.count}x)
          </div>
        ))}
      </div>
    </div>
  );
}

function getStatUrl(
  stat: MihomoPropertyConfig | MihomoSubAffixInfo | undefined
): string {
  if (!stat) return "";
  const trimmed = stat.icon.replace("icon", "").replace("png", "svg");
  return trimmed;
}
