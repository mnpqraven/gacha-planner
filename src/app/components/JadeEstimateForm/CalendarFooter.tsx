import { useFuturePatchBannerList } from "@/hooks/queries/useFuturePatchBanner";
import { useFuturePatchDateList } from "@/hooks/queries/useFuturePatchDate";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  const color = banner?.elementColor ? `border-[${banner.elementColor}]` : "";

  return (
    <div className="flex items-center justify-evenly">
      {banner && banner.icon && (
        <Image
          src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${banner.icon}`}
          alt={banner.characterName}
          className={cn("rounded-full w-24 h-24 border-2", color)}
          width={128}
          height={128}
        />
      )}
      <ul>
        {start && <li>Start of patch {start.version}</li>}
        {banner && <li>{banner.characterName} Banner</li>}
      </ul>
    </div>
  );
};
export { CalendarFooter };
