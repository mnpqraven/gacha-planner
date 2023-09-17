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

interface Props extends HTMLAttributes<HTMLDivElement> {
  propertyType: Property | undefined;
  setId: number | undefined;
  defaultValue?: number;
}

const defaultValueAtom = atom(0);
const spreadRollsAtoms = atom(Array.from(range(0, 5)).fill(0));
const spreadAtomList = splitAtom(spreadRollsAtoms);

defaultValueAtom.debugLabel = "defaultValueAtom";
spreadRollsAtoms.debugLabel = "spreadRollsAtoms";
spreadAtomList.debugLabel = "spreadAtomList";

const SubstatSpreadConfig = forwardRef<HTMLDivElement, Props>(
  ({ propertyType, setId, className, defaultValue, ...props }, ref) => {
    const { data } = useSubStatSpread();
    const [disabled, setDisabled] = useState(true);
    const spreadInfo = data?.find((e) => e.property == propertyType);
    const [value, setValue] = useAtom(defaultValueAtom);
    const [spread, setSpread] = useAtom(spreadRollsAtoms);
    const spreadAtoms = useAtomValue(spreadAtomList);

    useEffect(() => {
      if (defaultValue !== undefined) {
        setValue(defaultValue);
        setSpread((draft) => draft.map((e, i) => (i == 0 ? defaultValue : e)));
      }
    }, [defaultValue, setSpread, setValue]);

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
      console.log("fn");
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

    const onUserInputChange = (value: string) => {
      const parsed = parseInt(value);
      if (parsed) {
        setValue(isPropertyPercent(propertyType) ? parsed / 100 : parsed);
      }
    };

    const processedDefaultValue = isPropertyPercent(propertyType)
      ? (Number(value) * 100).toFixed(2)
      : value?.toFixed(2);
    console.log(processedDefaultValue);

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
          <Input
            className="w-24"
            disabled={disabled}
            value={processedDefaultValue}
            onChange={(e) => onUserInputChange(e.target.value)}
          />
          {isPropertyPercent(propertyType) && "%"}
          <Toggle
            pressed={!disabled}
            className="px-2"
            onPressedChange={(e) => setDisabled(!e)}
          >
            <Pencil className="cursor-pointer" />
          </Toggle>

          <Button
            className="bg-green-700 px-2 hover:bg-green-700/90"
            type="submit"
            disabled={disabled}
            onClick={() => autoCalculateSpread("TOPDOWN")}
          >
            <Check />
          </Button>
        </div>

        <div id="setters">
          {spreadAtoms.map((atom) => (
            <div key={`${atom}`}></div>
          ))}
        </div>
      </div>
    );
  }
);
SubstatSpreadConfig.displayName = "RelicSpreadConfig";
export { SubstatSpreadConfig };
