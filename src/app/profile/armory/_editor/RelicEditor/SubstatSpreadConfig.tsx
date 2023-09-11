import { Toggle } from "@/app/components/ui/Toggle";
import { Property, RelicSubAffixConfig } from "@/bindings/RelicSubAffixConfig";
import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { propertyIsPercent, propertyName } from "../relicConfig";
import { Check, Pencil, X } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { asPercentage, range } from "@/lib/utils";
import { SubstatItemEditor } from "./SubstatItemEditor";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
  useForm,
} from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/components/ui/Form";
import { Button } from "@/app/components/ui/Button";

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

  const minValue = propertyIsPercent(property)
    ? getSpreadValues(spread).minRoll.value * 100
    : getSpreadValues(spread).minRoll.value;
  const maxValue = propertyIsPercent(property)
    ? getSpreadValues(spread).maxRoll.value * 6 * 100
    : getSpreadValues(spread).maxRoll.value * 6;

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

  const form = useForm({
    defaultValues: { value: totalSum },
    resolver: zodResolver(schema),
  });

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
      const maxRoll = propertyIsPercent(spread.property)
        ? getSpreadValues(spread).maxRoll.value * 100
        : getSpreadValues(spread).maxRoll.value;
      nextArray[i] = paste >= maxRoll ? maxRoll : paste;
      paste -= maxRoll;
      i++;
    }
    Array.from(range(0, 5)).forEach((index) => {
      onDataUpdate(nextArray.at(index) ?? 0, index);
    });
  }

  function onFormReset() {}

  // reactive form value
  useEffect(() => {
    form.setValue("value", totalSum);
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

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitDirtyValue)}
          className="flex items-center gap-2 py-2"
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="w-24"
                    // type="number"
                    // value={(dirtySum * 100).toFixed(2)}
                    {...field}
                    // onChange={(e) => {
                    //   if (isNaN(Number(e.target.value))) {
                    //     // setDirtySum(Number(e.target.value) / 100);
                    //   }
                    // }}
                    disabled={disabled}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {propertyIsPercent(property) && <span>%</span>}

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
          >
            <Check />
          </Button>

          <Button
            className="bg-destructive px-2 hover:bg-destructive/90"
            onClick={onFormReset}
            disabled={disabled}
          >
            <X />
          </Button>
        </form>
      </Form>

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
