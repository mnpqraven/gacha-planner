import { useFuturePatchBannerList } from "@/hooks/queries/useFuturePatchBanner";
import { useFuturePatchDateList } from "@/hooks/queries/useFuturePatchDate";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import { CharacterTabWrapper } from "../Character/CharacterTabWrapper";

type Props = {
  date: Date | undefined;
};
const CalendarFooter = ({ date }: Props) => {
  const { futurePatchDateList } = useFuturePatchDateList();
  const { futurePatchBannerList } = useFuturePatchBannerList();

  function sameDate(a: Date, b: Date) {
    return (
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear()
    );
  }

  if (!date) return null;

  const hasDate = (e: { dateStart: string }) =>
    sameDate(new Date(e.dateStart), date);

  const start = futurePatchDateList.list.find(hasDate);
  const banner = futurePatchBannerList.list.find(hasDate);

  if (!start && !banner) return null;
  const color = banner?.characterData?.damage_type
    ? `border-${banner.characterData.damage_type?.toLowerCase()}`
    : "";

  return (
    <div className="flex w-full flex-col justify-center">
      {start && (
        <span className="text-center">Start of patch {start.version}</span>
      )}
      {banner && banner.characterData && (
        <div className="flex flex-col gap-2.5">
          <p className="whitespace-pre-wrap text-center">
            {banner.characterData.avatar_name}
          </p>
          <div className="flex gap-2.5">
            <Dialog>
              <DialogTrigger>
                <Image
                  src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/character/${banner.characterData.avatar_id}.png`}
                  alt=""
                  className={cn("h-20 w-20 rounded-full border-2", color)}
                  width={128}
                  height={128}
                />
              </DialogTrigger>
              <DialogContent className="min-h-[16rem] sm:max-w-4xl">
                {banner.characterData.avatar_id && (
                  <CharacterTabWrapper
                    characterId={banner.characterData.avatar_id}
                  />
                )}
              </DialogContent>
            </Dialog>

            <div className="flex flex-col">
              {banner.characterData.rarity} ✦{" "}
              {banner.characterData.avatar_base_type}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export { CalendarFooter };
