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
  const color = banner?.characterData.element
    ? `border-${banner.characterData.element?.name.toLowerCase()}`
    : "";

  return (
    <div className="flex items-center justify-evenly">
      {banner && banner.characterData.icon && (
        <Dialog>
          <DialogTrigger>
            <Image
              src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${banner.characterData.icon}`}
              alt={banner.characterData.characterName ?? ""}
              className={cn("h-20 w-20 rounded-full border-2", color)}
              width={128}
              height={128}
            />
          </DialogTrigger>
          <DialogContent className="min-h-[16rem] sm:max-w-4xl">
            {banner.characterData.characterId && (
              <CharacterTabWrapper data={banner.characterData} characterId={banner.characterData.characterId} />
            )}
          </DialogContent>
        </Dialog>
      )}
      <ul>
        {start && <li>Start of patch {start.version}</li>}
        {banner && (
          <>
            <li>{banner.characterData.characterName} Banner</li>
            <li>Click to view</li>
          </>
        )}
      </ul>
    </div>
  );
};
export { CalendarFooter };
