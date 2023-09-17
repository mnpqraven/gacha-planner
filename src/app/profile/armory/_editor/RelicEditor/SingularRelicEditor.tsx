import { useEffect, useState } from "react";
import { ArmoryFormSchema, RelicCategory } from "../../schema";
import {
  propertyIsPercent,
  propertyName,
  relicMainstatOptions,
  subStatOptions,
} from "../relicConfig";
import Image from "next/image";
import { useSubStatSpread } from "@/hooks/queries/useSubStatSpread";
import { useImmer } from "use-immer";
import { Property } from "@/bindings/RelicSubAffixConfig";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/Popover";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { asPercentage, range } from "@/lib/utils";
import { SubstatSpreadConfig } from "./SubstatSpreadConfig";
import { PropertySelect } from "./PropertySelect";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/components/ui/Form";
import { useMainStatSpread } from "@/hooks/queries/useMainStatSpread";
import { Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";

interface Props {
  category: RelicCategory;
  imageUrl: string;
  form: UseFormReturn<ArmoryFormSchema>;
}

export function SingularRelicEditor({ category, imageUrl, form }: Props) {
  const mainStatOptions = relicMainstatOptions.find((e) => e.type == category);
  const [selectedMainstat, setSelectedMainstat] = useState<
    Property | undefined
  >(
    mainStatOptions?.options.length == 1
      ? mainStatOptions.options[0]
      : undefined
  );
  const [selectedSubstats, setSelectedSubstats] = useImmer<
    { substat: Property; value: number[] }[]
  >([]);
  const { data: subStatSpread } = useSubStatSpread();
  const mainStatSubscriber = form.watch(`relic.${category}.mainStat`);
  const mainStatValue = useMainStatValue({
    category,
    property: mainStatSubscriber?.property,
    level: form.watch(`relic.${category}.level`),
  });

  function onDataUpdate(
    nextValue: number,
    substatIndex: number,
    lineIndex: number
  ) {
    setSelectedSubstats((draft) => {
      draft[lineIndex].value[substatIndex] = nextValue;
    });
    form.setValue(`relic.${category}.subStats.${lineIndex}.value`, nextValue);
  }

  function onDataReplace(values: number[], index: number) {
    values.forEach((value, index) => {
      form.setValue(`relic.${category}.subStats.${index}.value`, value);
    });
    setSelectedSubstats((draft) => {
      draft[index].value = values;
    });
  }

  function onSubstatWindowOpen(openState: boolean) {
    if (openState) return;

    form.setValue(
      `relic.${category}.subStats`,
      selectedSubstats.map(({ substat, value }) => ({
        property: substat,
        value: value.reduce((a, b) => a + b, 0),
        step: value.length,
      }))
    );
  }

  function getFirstMidroll(prop: Property): number[] {
    const find = subStatSpread?.find((e) => e.property == prop);
    if (!find) return [];
    let { base_value, step_value } = find;

    return [base_value + (find.step_num / 2) * step_value];
  }

  function onMainStatSelect(property: Property) {
    setSelectedMainstat(property);
  }

  function onSubStatSelect(prop: Property, index: number) {
    const defaultValue = subStatSpread?.find((e) => e.property == prop);
    let value = 0;
    if (!!defaultValue) {
      const { base_value, step_num, step_value } = defaultValue;
      value = base_value + (step_value * step_num) / 2;
    }
    setSelectedSubstats((draft) => {
      draft[index] = {
        substat: prop,
        value: getFirstMidroll(prop as Property),
      };
      form.setValue(`relic.${category}.subStats.${index}`, {
        property: prop,
        value,
        step: 1,
      });
    });
  }

  useEffect(() => {
    // set default value
    form.setValue(`relic.${category}.subStats`, []);
    form.setValue(`relic.${category}.rarity`, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mainStatOptions || !subStatSpread) return null;
  const fixedMainstat = mainStatOptions.options.length == 1;

  console.log('render')
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex gap-2">
        <div className="flex w-48 items-center justify-center">
          <Image
            src={imageUrl}
            alt=""
            height={128}
            width={128}
            className="h-32 w-32"
          />
        </div>

        <div className="flex flex-col">
          {fixedMainstat ? (
            <span>{propertyName(mainStatOptions.options[0])}</span>
          ) : (
            <FormField
              control={form.control}
              name={`relic.${category}.mainStat.property`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Stat</FormLabel>
                  <FormControl>
                    <PropertySelect
                      options={mainStatOptions.options}
                      onValueChange={(property) => {
                        onMainStatSelect(property as Property);
                        field.onChange(property);
                      }}
                      defaultValue={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name={`relic.${category}.level`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Stat Level</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+0"
                    type="number"
                    {...field}
                    min={0}
                    max={15}
                    defaultValue="0"
                    onChange={(e) => {
                      if (!Number.isNaN(e.currentTarget.value)) {
                        field.onChange(Number(e.currentTarget.value));
                        form.setValue(
                          `relic.${category}.mainStat.value`,
                          mainStatValue.value
                        );
                      } else e.preventDefault();
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          value: {mainStatValue.prettyValue}
          <FormField
            control={form.control}
            name={`relic.${category}.rarity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rarity</FormLabel>
                <Select
                  defaultValue="5"
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper">
                    {[3, 4, 5].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {Array.from(range(0, 3)).map((index) => (
          <div className="flex items-center gap-2" key={index}>
            <FormField
              control={form.control}
              name={`relic.${category}.subStats.${index}.property`}
              render={({ field }) => (
                <FormItem className="w-[12rem]">
                  <FormControl>
                    <PropertySelect
                      options={subStatOptions
                        .filter((e) => e.option != selectedMainstat)
                        .map((e) => e.option)}
                      onValueChange={(prop) =>
                        onSubStatSelect(prop as Property, index)
                      }
                      defaultValue={field.value}
                      itemDisabled={(prop) =>
                        selectedSubstats.map((e) => e.substat).includes(prop)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Popover onOpenChange={onSubstatWindowOpen}>
              <PopoverTrigger disabled={!selectedSubstats.at(index)} asChild>
                <Button
                  className="cursor-pointer px-2"
                  variant="outline"
                  disabled={!selectedSubstats.at(index)}
                >
                  <Pencil />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top">
                {!!subStatSpread.find(
                  (e) => e.property == selectedSubstats.at(index)?.substat
                ) && (
                  <SubstatSpreadConfig
                    property={selectedSubstats.at(index)?.substat ?? "Attack"}
                    spread={
                      subStatSpread.find(
                        (e) => e.property == selectedSubstats.at(index)?.substat
                      )!
                    }
                    data={selectedSubstats[index]}
                    onDataUpdate={(nextValue, substatIndex) =>
                      onDataUpdate(nextValue, substatIndex, index)
                    }
                    onDataReplace={(values) => onDataReplace(values, index)}
                  />
                )}
              </PopoverContent>
            </Popover>

            <ValueDisplay value={selectedSubstats[index]} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ValueDisplay({
  value,
}: {
  value: { substat: Property; value: number[] } | undefined;
}) {
  if (!value) return null;

  const sum = value.value.reduce((a, b) => a + b, 0);

  return propertyIsPercent(value.substat) ? (
    <span>{asPercentage(sum / 100)}</span>
  ) : (
    <span>{sum.toFixed(2)}</span>
  );
}

function useMainStatValue({
  category,
  property,
  level,
}: {
  category: RelicCategory;
  property: Property | undefined;
  level: number;
}) {
  const { data } = useMainStatSpread();

  if (!data) return { value: 0, prettyValue: 0 };

  const config = data[category].find((e) => e.property == property);

  if (!!config) {
    const { base_value, level_add, property } = config;
    const val = base_value + level * level_add;

    return {
      value: val,
      prettyValue: propertyIsPercent(property)
        ? asPercentage(val)
        : val.toFixed(2),
    };
  }

  return { value: 0, prettyValue: 0 };
}
