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
  const color = banner?.element
    ? `border-${banner.characterData.element?.name.toLowerCase()}`
    : "";

  return (
    <div className="flex items-center justify-evenly">
      {banner && banner.characterData.icon && (
        <Dialog>
          <DialogTrigger>
            <Image
              src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${banner.characterData.icon}`}
              alt={banner.characterData.character_name ?? ""}
              className={cn("rounded-full w-20 h-20 border-2", color)}
              width={128}
              height={128}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl min-h-[16rem]">
            {banner.characterData.character_id && (
              <CharacterTabWrapper
                skills={banner.characterData.skills}
                characterId={banner.characterData.character_id}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
      <ul>
        {start && <li>Start of patch {start.version}</li>}
        {banner && (
          <>
            <li>{banner.characterData.character_name} Banner</li>
            <li>Click to view</li>
          </>
        )}
      </ul>
    </div>
  );
};
export { CalendarFooter };
