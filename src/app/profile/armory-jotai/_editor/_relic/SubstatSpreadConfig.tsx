import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Toggle } from "@/app/components/ui/Toggle";
import { getSpreadValues } from "@/app/profile/armory/_editor/RelicEditor/SubstatSpreadConfig";
import { Property } from "@/bindings/RelicMainAffixConfig";
import { useSubStatSpread } from "@/hooks/queries/useSubStatSpread";
import { isPropertyPercent } from "@/lib/propertyHelper";
import { cn, range } from "@/lib/utils";
import { atom, useAtom, useAtomValue } from "jotai";
import { splitAtom } from "jotai/utils";
import { Check, Pencil } from "lucide-react";
import { HTMLAttributes, forwardRef, useEffect, useState } from "react";
import { SpreadConfigBar } from "./SpreadConfigBar";

interface Props extends HTMLAttributes<HTMLDivElement> {
  propertyType: Property | undefined;
  setId: number | undefined;
  defaultValue?: number;
}

/** Text representation of the substat's value */
export const valueAsStringAtom = atom({ text: "0", percent: false });
export const substatValueAtom = atom(
  (get) =>
    parseFloat(get(valueAsStringAtom).text) /
    (get(valueAsStringAtom).percent ? 100 : 1),
  (get, set, update: number) => {
    set(valueAsStringAtom, {
      text: update.toFixed(2),
      percent: get(valueAsStringAtom).percent,
    });
  }
);

const spreadRollsAtoms = atom(
  Array.from(range(0, 5)).fill(0),
  (get, set, next: number[] | ((prev: number[]) => number[])) => {
    const list = Array.isArray(next) ? next : next(get(spreadRollsAtoms));
    set(spreadRollsAtoms, list);
    // INFO: update the hidden input value when spread if changed from
    // pressing roll buttons
    const sum = list.reduce((a, b) => a + b, 0);
    const { percent } = get(valueAsStringAtom);
    set(valueAsStringAtom, {
      text: (sum * (percent ? 100 : 1)).toFixed(2),
      percent,
    });
  }
);
const spreadAtomList = splitAtom(spreadRollsAtoms);

const SubstatSpreadConfig = forwardRef<HTMLDivElement, Props>(
  ({ propertyType, setId, className, defaultValue, ...props }, ref) => {
    const { data } = useSubStatSpread();
    const [disabled, setDisabled] = useState(true);
    const spreadInfo = data?.find((e) => e.property == propertyType);
    const value = useAtomValue(substatValueAtom);
    const [valueAsString, setValueAsString] = useAtom(valueAsStringAtom);
    const [spread, setSpread] = useAtom(spreadRollsAtoms);
    const spreadAtoms = useAtomValue(spreadAtomList);

    // set initial data for the value input box
    useEffect(() => {
      if (defaultValue !== undefined && propertyType) {
        const percent = isPropertyPercent(propertyType);
        setValueAsString({
          text: (defaultValue * (percent ? 100 : 1)).toFixed(2),
          percent,
        });

        setSpread((draft) => draft.map((e, i) => (i == 0 ? defaultValue : e)));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue, propertyType]);

    if (!propertyType || !setId)
      return (
        <div ref={ref} {...props}>
          Please select a substat with the selector on the left
        </div>
      );

    if (!spreadInfo) return "spreadinfo loading...";

    /**
     * take the user input value and automatically spread to rolls
     */
    const autoCalculateSpread = (strategy: "EQUAL" | "TOPDOWN" = "TOPDOWN") => {
      console.log("autoCalculateSpread");
      let valTemp = value;
      let toUpdate: { value: number; index: number }[] = [];
      if (strategy == "TOPDOWN") {
        let index = 0;
        while (valTemp > 0) {
          const maxRoll = getSpreadValues(spreadInfo).maxRoll.value;
          toUpdate.push({
            value: valTemp >= maxRoll ? maxRoll : valTemp,
            index,
          });
          valTemp -= maxRoll;
          index++;
        }
      } else {
        let index = 0;
        while (valTemp > 0) {
          const midRoll = getSpreadValues(spreadInfo).midRoll.value;
          toUpdate.push({
            value: valTemp >= midRoll ? midRoll : valTemp,
            index,
          });
          valTemp -= midRoll;
          index++;
        }
      }
      console.log(toUpdate);
      setSpread(toUpdate.map((e) => e.value));
    };

    const { minRoll, midRoll, maxRoll } = getSpreadValues(spreadInfo);

    const spreadTable = [
      { label: "Low Roll", value: minRoll.display },
      { label: "Normal Roll", value: midRoll.display },
      { label: "High Roll", value: maxRoll.display },
    ];

    const onUserInputChange = (textValue: string) => {
      const parsed = Number(textValue);
      if (!Number.isNaN(parsed)) {
        setValueAsString(({ percent }) => ({ percent, text: textValue }));
      }
    };

    return (
      <div ref={ref} className={cn(className, "flex w-96 flex-col")} {...props}>
        <div>{propertyType}</div>
        <div id="table" className="flex gap-2 rounded-md border">
          {spreadTable.map(({ label, value }) => (
            <div className="flex grow flex-col items-center p-1" key={label}>
              <span>{label}</span>
              <span>{value} </span>
            </div>
          ))}
        </div>

        {/* spread buttons */}
        <div id="edit-row" className="flex items-center gap-2">
          {!disabled ? (
            <Input
              className="w-24"
              disabled={disabled}
              value={valueAsString.text}
              onChange={(e) => onUserInputChange(e.target.value)}
            />
          ) : (
            <div>{getSumValue(spread, isPropertyPercent(propertyType))}</div>
          )}
          {isPropertyPercent(propertyType) && "%"}
          <Toggle
            pressed={!disabled}
            className="px-2"
            onPressedChange={(e) => setDisabled(!e)}
          >
            <Pencil className="cursor-pointer" />
          </Toggle>

          {!disabled && (
            <Button
              className="bg-green-700 px-2 hover:bg-green-700/90"
              type="submit"
              onClick={() => autoCalculateSpread("TOPDOWN")}
            >
              <Check />
            </Button>
          )}
        </div>

        <div id="setters" className="flex">
          {spreadAtoms.map((atom, index) => (
            <SpreadConfigBar key={index} atom={atom} spreadInfo={spreadInfo} />
          ))}
        </div>
      </div>
    );
  }
);
SubstatSpreadConfig.displayName = "RelicSpreadConfig";

function getSumValue(numbers: number[], isPercent: boolean) {
  const sum = numbers.reduce((a, b) => a + b, 0);
  return (sum * (isPercent ? 100 : 1)).toFixed(2);
}

export { SubstatSpreadConfig };

substatValueAtom.debugLabel = "substatValueAtom";
spreadRollsAtoms.debugLabel = "spreadRollsAtoms";
spreadAtomList.debugLabel = "spreadAtomList";
