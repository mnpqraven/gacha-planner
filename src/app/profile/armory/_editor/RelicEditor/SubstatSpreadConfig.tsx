import { Toggle } from "@/app/components/ui/Toggle";
import { Property, RelicSubAffixConfig } from "@/bindings/RelicSubAffixConfig";
import { useState } from "react";
import { propertyIsPercent, propertyName } from "../relicConfig";
import { Pencil } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { asPercentage, range } from "@/lib/utils";
import { SubstatItemEditor } from "./SubstatItemEditor";

interface Props {
  property: Property;
  spread: RelicSubAffixConfig;
  data: {
    substat: Property;
    value: number[];
  };
  onDataUpdate: (nextValue: number, substatIndex: number) => void;
}

export function SubstatSpreadConfig({
  property,
  spread,
  data,
  onDataUpdate,
}: Props) {
  const [disabled, setDisabled] = useState(true);

  const totalSum = data.value.reduce((a, b) => a + b, 0);

  return (
    <div>
      <p>
        <span>{propertyName(property)}: </span>
        {getSpreadValues(spread).minRoll.display} /{" "}
        {getSpreadValues(spread).midRoll.display} /{" "}
        {getSpreadValues(spread).maxRoll.display}
      </p>
      <div className="flex items-center gap-2 py-2">
        {false && (
          <Toggle pressed={!disabled} className="px-2">
            <Pencil
              className="cursor-pointer"
              onClick={() => setDisabled(!disabled)}
            />
          </Toggle>
        )}

        <Input
          className="w-24"
          type="number"
          value={(totalSum * 100).toFixed(2)}
          disabled={disabled}
        />

        {propertyIsPercent(property) && <span>%</span>}
      </div>
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

function getSpreadValues({
  step_value,
  step_num,
  base_value,
  property,
}: RelicSubAffixConfig) {
  const isPercent = propertyIsPercent(property);

  const minRoll = base_value;
  const midRoll = base_value + (step_value * step_num) / 2;
  const maxRoll = base_value + step_value * step_num;

  return {
    minRoll: {
      value: minRoll,
      display: isPercent ? asPercentage(minRoll) : minRoll.toFixed(2),
    },
    midRoll: {
      value: midRoll,
      display: isPercent ? asPercentage(midRoll) : midRoll.toFixed(2),
    },
    maxRoll: {
      value: maxRoll,
      display: isPercent ? asPercentage(maxRoll) : maxRoll.toFixed(2),
    },
  };
}
