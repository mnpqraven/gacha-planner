import { cn, sameDate } from "@/lib/utils";
import { useBannerList } from "@/hooks/queries/useBannerList";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import API from "@/server/typedEndpoints";
import { usePatchDateHelper } from "@/hooks/usePatchDateHelper";
import { LightConeIcon } from "@/app/lightcone-db/LightConeIcon";
import { CharacterIcon } from "@/app/character-db/CharacterIcon";
import { Skeleton } from "@/app/components/ui/Skeleton";

type Props = {
  date: Date;
};

const CalendarFooter = ({ date }: Props) => {
  const { bannerList } = useBannerList();
  const { getVersion, currentPatch } = usePatchDateHelper();

  const banner = useMemo(
    () => bannerList.find((e) => e.version == getVersion(date)),
    [bannerList, getVersion, date]
  );
  const charas = banner?.chara ?? [];
  const lcs = banner?.lc ?? [];

  const avatarQueries = useQueries({
    queries: charas.map((id) => ({
      queryKey: ["character", id],
      queryFn: async () => API.character.get(id),
      enabled: !!banner,
    })),
  });

  const lcQueries = useQueries({
    queries: lcs.map((id) => ({
      queryKey: ["lightConeMetadata", id],
      queryFn: async () => await API.lightConeMetadata.get(id),
    })),
  });

  const start = sameDate(date, currentPatch(date).startDate);

  return (
    <div className="mt-2.5 flex w-full flex-col items-center justify-center gap-2.5">
      <div id="patch-header" className="text-center">
        {start ? "Start of patch" : "Patch"} {getVersion(date)}
      </div>

      <div>Character Banner</div>

      <div className="flex gap-2.5">
        {avatarQueries.map((query, index) =>
          query.data ? (
            <CharacterIcon key={index} data={query.data} />
          ) : (
            <LoadingIcon key={index} rounded />
          )
        )}
      </div>

      <div>Light Cone Banner</div>

      <div className="flex gap-2.5">
        {lcQueries.map((query, index) =>
          query.data ? (
            <LightConeIcon key={index} data={query.data} />
          ) : (
            <LoadingIcon key={index} />
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
