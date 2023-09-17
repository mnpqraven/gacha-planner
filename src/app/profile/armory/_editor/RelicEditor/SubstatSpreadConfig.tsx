import { Toggle } from "@/app/components/ui/Toggle";
import { Property, RelicSubAffixConfig } from "@/bindings/RelicSubAffixConfig";
import { useEffect, useState } from "react";
import { propertyName } from "../relicConfig";
import { Check, Pencil, X } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { asPercentage, range } from "@/lib/utils";
import { SubstatItemEditor } from "./SubstatItemEditor";
import * as z from "zod";
import { Button } from "@/app/components/ui/Button";
import { isPropertyPercent } from "@/lib/propertyHelper";

interface Props {
  property: Property;
  spread: RelicSubAffixConfig;
  data: {
    substat: Property;
    value: number[];
  };
  onDataUpdate: (nextValue: number, substatIndex: number) => void;
  onDataReplace: (values: number[]) => void;
}

export function SubstatSpreadConfig({
  property,
  spread,
  data,
  onDataUpdate,
  onDataReplace,
}: Props) {
  const [disabled, setDisabled] = useState(true);
  const totalSum = data.value.reduce((a, b) => a + b, 0);
  const [makeShiftValue, setMakeshiftValue] = useState<string>(`${totalSum}`);
  const makeShiftValueI = isPropertyPercent(property)
    ? Number(makeShiftValue)
    : Number(makeShiftValue) * 100;

  const minValue = getSpreadValues(spread).minRoll.value;
  const maxValue = getSpreadValues(spread).maxRoll.value * 6;

  const schema = z.object({
    value: z
      .number()
      .min(minValue, {
        message: `Value must be greater than ${minValue.toFixed(2)} %`,
      })
      .max(maxValue, {
        message: `Value must be less than ${maxValue.toFixed(2)} %`,
      })
      .or(z.string())
      .pipe(
        z.coerce
          .number()
          .min(minValue, {
            message: `Value must be greater than ${minValue.toFixed(2)} %`,
          })
          .max(maxValue, {
            message: `Value must be less than ${maxValue.toFixed(2)} %`,
          })
      ),
  });

  /**
   * take the user input value and automatically spread to rolls
   */
  function autoCalculateSpread(strategy: "EQUAL" | "TOPDOWN" = "TOPDOWN") {
    let value = isPropertyPercent(property)
      ? makeShiftValueI / 100
      : makeShiftValueI;
    let toUpdate: { value: number; index: number }[] = [];
    if (strategy == "TOPDOWN") {
      let index = 0;
      while (value > 0) {
        const maxRoll = getSpreadValues(spread).maxRoll.value;
        toUpdate.push({ value: value >= maxRoll ? maxRoll : value, index });
        value -= maxRoll;
        index++;
      }
    } else {
      let index = 0;
      while (value > 0) {
        const midRoll = getSpreadValues(spread).midRoll.value;
        toUpdate.push({ value: value >= midRoll ? midRoll : value, index });
        value -= midRoll;
        index++;
      }
    }
    onDataReplace(toUpdate.map((e) => e.value));
  }

  /**
   * update the spread array in according to the updated value
   * */
  function onSubmitDirtyValue({ value }: { value: number }) {
    // NOTE: values in data is sub 1 percent values (0-1)
    // values for totalSum and form value is normal percentage (0-100 %)
    console.log("onSubmitDirtyValue", value);
    console.log("previous filled data", data, totalSum);
    let nextArray: number[] = [];

    let paste = value;
    let i = 0;
    // transform new array
    while (paste >= 0) {
      const maxRoll = getSpreadValues(spread).maxRoll.value;
      nextArray[i] = paste >= maxRoll ? maxRoll : paste;
      paste -= maxRoll;
      i++;
    }
    Array.from(range(0, 5)).forEach((index) => {
      onDataUpdate(nextArray.at(index) ?? 0, index);
    });
  }

  function onFormReset() {}

  function onUpdateInput(value: string) {
    setMakeshiftValue(value);
  }

  // reactive form value
  useEffect(() => {
    let denom = isPropertyPercent(property) ? 100 : 1;
    setMakeshiftValue((totalSum * denom).toFixed(2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSum]);

  return (
    <div>
      <p>
        <span>{propertyName(property)}: </span>
        {getSpreadValues(spread).minRoll.display} /{" "}
        {getSpreadValues(spread).midRoll.display} /{" "}
        {getSpreadValues(spread).maxRoll.display}
      </p>

      <Input
        className="w-24"
        value={makeShiftValue}
        onChange={(e) => onUpdateInput(e.currentTarget.value)}
        disabled={disabled}
      />

      {isPropertyPercent(property) && <span>%</span>}

      <Toggle pressed={!disabled} className="px-2">
        <Pencil
          className="cursor-pointer"
          onClick={() => setDisabled(!disabled)}
        />
      </Toggle>

      <Button
        className="bg-green-700 px-2 hover:bg-green-700/90"
        type="submit"
        disabled={disabled}
        onClick={() => autoCalculateSpread("TOPDOWN")}
      >
        <Check />
      </Button>

      {/* <Button
        className="bg-destructive px-2 hover:bg-destructive/90"
        onClick={onFormReset}
        disabled={disabled}
      >
        <X />
      </Button> */}

      <div id="bars" className="flex justify-center gap-1">
        {Array.from(range(0, 5)).map((index) => (
          <SubstatItemEditor
            key={index}
            className="flex flex-col items-center gap-1"
            spread={spread}
            value={data.value.at(index)}
            onValueChange={(to) => onDataUpdate(to, index)}
          />
        ))}
      </div>
    </div>
  );
}

export function getSpreadValues({
  step_value,
  step_num,
  base_value,
  property,
}: RelicSubAffixConfig) {
  const minRoll = base_value;
  const midRoll = base_value + (step_value * step_num) / 2;
  const maxRoll = base_value + step_value * step_num;

  const withPercent = (val: number) =>
    isPropertyPercent(property) ? asPercentage(val) : val.toFixed(2);

  return {
    minRoll: { value: minRoll, display: withPercent(minRoll) },
    midRoll: { value: midRoll, display: withPercent(midRoll) },
    maxRoll: { value: maxRoll, display: withPercent(maxRoll) },
  };
}
