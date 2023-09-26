import { dateToISO, objToDate } from "@/app/components/schemas";
import { PartialMessage } from "@bufbuild/protobuf";
import {
  BattlePassType,
  EqTier,
  JadeEstimateCfg,
  Server,
} from "@grpc/jadeestimate_pb";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type FormSchema = PartialMessage<JadeEstimateCfg>;

export const defaultValues: FormSchema = {
  server: Server.America,
  untilDate: dateToISO.parse(new Date()),
  battlePass: { battlePassType: BattlePassType.None, currentLevel: 0 },
  railPass: {
    useRailPass: false,
    daysLeft: 30,
  },
  eq: EqTier.Zero,
  moc: 0,
  mocCurrentWeekDone: true,
  currentRolls: 0,
};

export const estimateFormAtom = atomWithStorage(
  "jadeEstimateForm",
  defaultValues
);

export const selectedCalendarDateAtom = atom(
  (get) => objToDate.parse(get(estimateFormAtom).untilDate),
  (get, set, date: Date) => {
    const prev = get(estimateFormAtom);
    set(estimateFormAtom, { ...prev, untilDate: dateToISO.parse(date) });
  }
);

export const selectedMonthAtom = atom(new Date());
