import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Toggle } from "@/app/components/ui/Toggle";
import { Property } from "@/bindings/RelicMainAffixConfig";
import { isPropertyPercent } from "@/lib/propertyHelper";
import { asPercentage, cn, range } from "@/lib/utils";
import { PrimitiveAtom, atom, useAtomValue } from "jotai";
import { splitAtom } from "jotai/utils";
import { Check, Pencil } from "lucide-react";
import {
  HTMLAttributes,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SpreadConfigBar } from "./SpreadConfigBar";
import { SubStatSchema } from "@/hooks/useStatParser";
import { RelicSubAffixConfig } from "@/bindings/RelicSubAffixConfig";

interface Props extends HTMLAttributes<HTMLDivElement> {
  atom: PrimitiveAtom<SubStatSchema | undefined>;
  setId: number | undefined;
  spreadData: RelicSubAffixConfig[];
}

/** Text representation of the substat's value */
// const valueAsStringAtom = atom({ text: "0", percent: false });
// const substatValueAtom = atom(
//   (get) =>
//     parseFloat(get(valueAsStringAtom).text) /
//     (get(valueAsStringAtom).percent ? 100 : 1),
//   (get, set, update: number) => {
//     set(valueAsStringAtom, {
//       text: update.toFixed(2),
//       percent: get(valueAsStringAtom).percent,
//     });
//     set(substatValueAtom, update);
//   }
// );

// const spreadRollsAtoms = atom(
//   Array.from(range(0, 5)).fill(0),
//   (get, set, next: number[] | ((prev: number[]) => number[])) => {
//     const list = Array.isArray(next) ? next : next(get(spreadRollsAtoms));
//     set(spreadRollsAtoms, list);
//     // INFO: update the hidden input value when spread if changed from
//     // pressing roll buttons
//     const sum = list.reduce((a, b) => a + b, 0);
//     const { percent } = get(valueAsStringAtom);
//     set(valueAsStringAtom, {
//       text: (sum * (percent ? 100 : 1)).toFixed(2),
//       percent,
//     });
//   }
// );

// const spreadAtomList = splitAtom(spreadRollsAtoms);

const SubstatSpreadConfig = forwardRef<HTMLDivElement, Props>(
  ({ atom: atomm, spreadData, setId, className, ...props }, ref) => {
    // const spreadAtoms = useAtomValue(spreadAtomList);
    // INFO: separate atom for every child item
    // const [valueLocalAtom] = useState(substatValueAtom);
    // const [valueAsStringLocalAtom] = useState(valueAsStringAtom)
    // const [spreadLocalAtom] = useState(spreadRollsAtoms);

    // should only set this in 2 spots, once on input checkbox, once on roll buttons
    const value = useAtomValue(atomm);
    const spreadInfo = spreadData?.find((e) => e.property == value?.property);
    const expensiveCalc = useMemo(
      () =>
        calculateSpread({
          strategy: "TOPDOWN",
          spreadData: spreadInfo!,
          value: value?.value,
        }),
      [spreadInfo, value?.value]
    );
    const [spreadLocalAtom] = useState(
      atom(expensiveCalc, (get, set, next: number[]) => {
        set(spreadLocalAtom, next);
        const got = get(atomm);
        if (!!got) {
          set(atomm, {
            property: got.property,
            step: next.filter((e) => e > 0).length,
            value: next.reduce((a, b) => a + b, 0),
          });
        }
      })
    );
    const [spreadSplittedLocalAtom] = useState(splitAtom(spreadLocalAtom));
    const readOnlySpread = useAtomValue(spreadLocalAtom);
    const spreadAtoms = useAtomValue(spreadSplittedLocalAtom);
    // const [valueAsString, setValueAsString] = useAtom(valueAsStringLocalAtom);
    // const [spread, setSpread] = useAtom(spreadLocalAtom);
    const [valueAsString, setValueAsString] = useState({
      text: getDefaultTextValue(value?.value, value?.property),
      percent: false,
    });
    console.log("render");

    const [disabled, setDisabled] = useState(true);

    // set initial data for the value input box
    useEffect(() => {
      if (!!value && value.property) {
        console.log("firstrender");
        const percent = isPropertyPercent(value.property);
        setValueAsString({
          text: (value.value * (percent ? 100 : 1)).toFixed(2),
          percent,
        });

        // setSpread((draft) => draft.map((e, i) => (i == 0 ? defaultValue : e)));
      }

      return () => {
        // if (!!propertyType) {
        //   const value = spread.reduce((a, b) => a + b, 0);
        //   const step = spread.filter((e) => e > 0).length;
        //   console.log("debug spread", spread, "value and step", value, step);
        //   setParentA({
        //     property: propertyType,
        //     value: spread.reduce((a, b) => a + b, 0),
        //     step: spread.filter((e) => e > 0).length,
        //   });
        // }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    if (!spreadInfo || !value?.property || !setId || !value) return null;

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
            <div>
              {getSumValue(readOnlySpread, isPropertyPercent(value.property))}
            </div>
          )}
          {isPropertyPercent(value.property) && "%"}
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
              // onClick={() => calculateSpread("TOPDOWN")}
            >
              <Check />
            </Button>
          )}
        </div>

        <div id="setters" className="flex justify-center">
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

// substatValueAtom.debugLabel = "substatValueRelicAtom";
// spreadRollsAtoms.debugLabel = "spreadRollsRelicAtoms";
// spreadAtomList.debugLabel = "spreadRelicAtomList";

function getDefaultTextValue(
  value: number | undefined,
  prop: Property | undefined
) {
  if (!value || !prop) return "";
  if (isPropertyPercent(prop)) return (value * 100).toFixed(2);
  return value.toFixed(2);
}

/**
 * take the substat value and return the corresponding spread values
 */
function calculateSpread({
  strategy,
  value,
  spreadData,
}: {
  strategy: "EQUAL" | "TOPDOWN";
  value: number | undefined;
  spreadData: RelicSubAffixConfig;
}) {
  console.log("autoCalculateSpread");
  if (!value) return Array.from(range(0, 5)).fill(0);
  let toUpdate: number[] = [];
  if (strategy == "TOPDOWN") {
    while (value > 0) {
      const maxRoll = getSpreadValues(spreadData).maxRoll.value;
      toUpdate.push(value >= maxRoll ? maxRoll : value);
      value -= maxRoll;
    }
  } else {
    while (value > 0) {
      const midRoll = getSpreadValues(spreadData).midRoll.value;
      toUpdate.push(value >= midRoll ? midRoll : value);
      value -= midRoll;
    }
  }
  console.log("toUpdate", toUpdate);
  return Array.from(range(0, 5)).map((i) => toUpdate.at(i) ?? 0);
}

function getSpreadValues({
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
