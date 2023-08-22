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

type Props = {
  date: Date;
};

const CalendarFooter = ({ date }: Props) => {
  const { futurePatchDateList } = useFuturePatchDateList();
  const { bannerList } = useBannerList();
  const { getVersion, currentPatch } = usePatchDateHelper();

  const major = getVersion(date)?.slice(0, 3) ?? "";
  const versionInfo = futurePatchDateList.list.find((e) =>
    e.version.startsWith(major)
  );

  const banner = useMemo(
    () => bannerList.find((e) => e.version == getVersion(date)),
    [bannerList, getVersion, date]
  );
  const charas = banner?.chara ?? [];
  const lcs = banner?.lc ?? [];

  const avatarQueries = useQueries({
    queries: charas.map((id) => ({
      queryKey: ["character", id],
      queryFn: async () => API.character.get(id!),
      enabled: !!banner && !!id,
    })),
  });

  const lcQueries = useQueries({
    queries: lcs.map((id) => ({
      queryKey: ["lightConeMetadata", id],
      queryFn: async () => await API.lightConeMetadata.get(id!),
      enabled: !!id,
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
              <TooltipTrigger>
                <LoadingIcon key={index} rounded />
              </TooltipTrigger>
              {banner?.placeholderChar?.at(index) && (
                <TooltipContent>
                  {banner?.placeholderChar[index]}
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
              <TooltipTrigger>
                <LoadingIcon key={index} />
              </TooltipTrigger>
              {banner?.placeholderLc?.at(index) && (
                <TooltipContent>{banner?.placeholderLc[index]}</TooltipContent>
              )}
            </Tooltip>
          )
        )}
      </div>
    </div>
  );
};

const LoadingIcon = ({ rounded = false }: { rounded?: boolean }) => (
  <Skeleton
    className={cn("h-12 w-12", rounded ? "rounded-full" : "rounded-md")}
  />
);

export { CalendarFooter };
