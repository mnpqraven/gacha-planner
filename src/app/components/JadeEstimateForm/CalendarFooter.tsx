import { useFuturePatchBannerList } from "@/hooks/queries/useFuturePatchBanner";
import { useFuturePatchDateList } from "@/hooks/queries/useFuturePatchDate";

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

  const start = futurePatchDateList.patches.find(hasDate);
  const banner = futurePatchBannerList.banners.find(hasDate);

  if (!start && !banner) return null;

  return (
    <ul>
      {start && <li>Start of patch {start.version}</li>}
      {banner && <li>{banner.characterName} Character Banner</li>}
    </ul>
  );
};
export { CalendarFooter };
