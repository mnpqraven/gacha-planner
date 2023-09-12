import { useState } from "react";
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
  const { data } = useSubStatSpread();
  const mainStatValue = useMainStatValue({
    category,
    subscriber: form.watch(`relic.${category}.mainStat`),
  });

  function onDataUpdate(
    nextValue: number,
    substatIndex: number,
    lineIndex: number
  ) {
    setSelectedSubstats((draft) => {
      draft[lineIndex].value[substatIndex] = nextValue;
    });
  }

  function onSubstatWindowOpen(openState: boolean) {
    if (openState) return;

    console.log("should see onclose", selectedSubstats);

    form.setValue(
      `relic.${category}.subStats`,
      selectedSubstats.map(({ substat, value }) => ({
        key: substat,
        value: value.reduce((a, b) => a + b, 0),
        step: value.length,
      }))
    );
  }

  function getFirstMidroll(prop: Property): number[] {
    const find = data?.find((e) => e.property == prop);
    if (!find) return [];
    let { base_value, step_value } = find;
    if (propertyIsPercent(prop)) {
      base_value *= 100;
      step_value *= 100;
    }

    return [base_value + (find.step_num / 2) * step_value];
  }

  if (!mainStatOptions) return null;
  const fixedMainstat = mainStatOptions.options.length == 1;

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
              name={`relic.${category}.mainStat.key`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Stat</FormLabel>
                  <FormControl>
                    <PropertySelect
                      options={mainStatOptions.options}
                      onValueChange={(prop) => {
                        setSelectedMainstat(prop as Property);
                        field.onChange(prop);
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
            name={`relic.${category}.mainStat.step`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Stat Level</FormLabel>
                <FormControl>
                  <Input placeholder="+0" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          value: {mainStatValue}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {Array.from(range(0, 3)).map((line) => (
          <div className="flex items-center gap-2" key={line}>
            <PropertySelect
              className="max-w-[12rem]"
              options={subStatOptions
                .filter((e) => e.option != selectedMainstat)
                .map((e) => e.option)}
              onValueChange={(prop) =>
                setSelectedSubstats((draft) => {
                  draft[line] = {
                    substat: prop as Property,
                    value: getFirstMidroll(prop as Property),
                  };
                })
              }
              itemDisabled={(prop) =>
                selectedSubstats.map((e) => e.substat).includes(prop)
              }
            />

            <Popover onOpenChange={onSubstatWindowOpen}>
              <PopoverTrigger disabled={!selectedSubstats.at(line)} asChild>
                <Button
                  className="cursor-pointer px-2"
                  variant="outline"
                  disabled={!selectedSubstats.at(line)}
                >
                  <Pencil />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top">
                {!!data?.find(
                  (e) => e.property == selectedSubstats.at(line)?.substat
                ) && (
                  <SubstatSpreadConfig
                    property={selectedSubstats.at(line)?.substat ?? "Attack"}
                    spread={
                      data.find(
                        (e) => e.property == selectedSubstats.at(line)?.substat
                      )!
                    }
                    data={selectedSubstats[line]}
                    onDataUpdate={(nextValue, substatIndex) =>
                      onDataUpdate(nextValue, substatIndex, line)
                    }
                  />
                )}
              </PopoverContent>
            </Popover>

            <ValueDisplay value={selectedSubstats[line]} />
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
  subscriber,
}: {
  category: RelicCategory;
  subscriber: { key: string; step: number } | undefined | null;
}) {
  const { data } = useMainStatSpread();

  if (!data) return 0;

  const config = data[category].find((e) => e.property == subscriber?.key);

  if (!!config) {
    const { base_value, level_add, property } = config;
    const val = base_value + (subscriber?.step ?? 0) * level_add;

    return propertyIsPercent(property) ? asPercentage(val) : val.toFixed(2);
  }

  return 0;
}
