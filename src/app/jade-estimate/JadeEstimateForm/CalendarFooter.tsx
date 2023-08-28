import { cn, sameDate } from "@/lib/utils";
import { useBannerList } from "@/hooks/queries/useBannerList";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import API from "@/server/typedEndpoints";
import { usePatchDateHelper } from "@/hooks/usePatchDateHelper";
import { LightConeIcon } from "@/app/lightcone-db/LightConeIcon";
import { CharacterIcon } from "@/app/character-db/CharacterIcon";
import { Skeleton } from "@/app/components/ui/Skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import { useFuturePatchDateList } from "@/hooks/queries/useFuturePatchDate";
import { ExternalLink } from "lucide-react";

type Props = {
  date: Date;
};

const CalendarFooter = ({ date }: Props) => {
  const { futurePatchDateList } = useFuturePatchDateList();
  const { bannerList } = useBannerList();
  const { getVersion, currentPatch } = usePatchDateHelper();

  const major = getVersion(date)?.slice(0, 3) ?? "";
  const versionInfo = futurePatchDateList.find((e) =>
    e.version.startsWith(major)
  );

  const banner = useMemo(
    () => bannerList.find((e) => e.version == getVersion(date)),
    [bannerList, getVersion, date]
  );
  const charas = banner?.chara ?? [null, null, null, null];
  const lcs = banner?.lc ?? [null, null, null, null];

  const avatarQueries = useQueries({
    queries: charas.map((chara) => ({
      queryKey: ["character", chara?.id],
      queryFn: async () => {
        if (chara && !!chara.id)
          return await API.character.get({ characterId: chara.id });
        else return Promise.reject();
      },
      enabled: !!banner && !!chara && !!chara.id,
    })),
  });

  const lcQueries = useQueries({
    queries: lcs.map((lc) => ({
      queryKey: ["lightConeMetadata", lc?.id],
      queryFn: async () => {
        if (lc && !!lc.id)
          return await API.lightConeMetadata.get({ lcId: lc.id });
        else return Promise.reject();
      },
      enabled: !!lc && !!lc.id,
    })),
  });

  const start = sameDate(date, currentPatch(date).startDate);

  return (
    <div className="mt-2.5 flex w-full flex-col items-center justify-center gap-2.5">
      <div id="patch-header" className="text-center">
        {start ? "Start of patch" : "Patch"} {getVersion(date)}
        {versionInfo && <br />}
        {versionInfo && versionInfo.name}
      </div>

      <div>Character Banner</div>

      <div className="flex gap-2.5">
        {avatarQueries.map((query, index) =>
          query.data ? (
            <CharacterIcon key={index} data={query.data} />
          ) : (
            <Tooltip key={index}>
              <TooltipTrigger disabled={!banner?.chara?.at(index)?.placeholder}>
                <LoadingIcon
                  key={index}
                  rounded
                  href={banner?.chara.at(index)?.href}
                />
              </TooltipTrigger>
              {!!banner?.chara?.at(index)?.placeholder && (
                <TooltipContent>
                  {banner?.chara[index]?.placeholder}
                </TooltipContent>
              )}
            </Tooltip>
          )
        )}
      </div>

      <div>Light Cone Banner</div>

      <div className="flex gap-2.5">
        {lcQueries.map((query, index) =>
          query.data ? (
            <LightConeIcon key={index} data={query.data} />
          ) : (
            <Tooltip key={index}>
              <TooltipTrigger disabled={!banner?.lc?.at(index)?.placeholder}>
                <LoadingIcon key={index} href={banner?.lc.at(index)?.href} />
              </TooltipTrigger>
              {!!banner?.lc?.at(index)?.placeholder && (
                <TooltipContent>
                  {banner?.lc[index]?.placeholder}
                </TooltipContent>
              )}
            </Tooltip>
          )
        )}
      </div>
    </div>
  );
};

const LoadingIcon = ({
  rounded = false,
  href,
}: {
  rounded?: boolean;
  href?: string;
}) => {
  if (!href)
    return (
      <Skeleton
        className={cn("h-12 w-12", rounded ? "rounded-full" : "rounded-md")}
      />
    );
  return (
    <a href={href}>
      <Skeleton
        className={cn(
          "flex h-12 w-12 items-center justify-center",
          rounded ? "rounded-full" : "rounded-md"
        )}
      >
        <ExternalLink />
      </Skeleton>
    </a>
  );
};

export { CalendarFooter };
