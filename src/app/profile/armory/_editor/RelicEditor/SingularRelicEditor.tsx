import { useState } from "react";
import { RelicCategory } from "../../schema";
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

interface Props {
  category: RelicCategory;
  imageUrl: string;
}

export function SingularRelicEditor({ category, imageUrl }: Props) {
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

  function onDataUpdate(
    nextValue: number,
    substatIndex: number,
    lineIndex: number
  ) {
    setSelectedSubstats((draft) => {
      draft[lineIndex].value[substatIndex] = nextValue;
    });
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
            <PropertySelect
              options={mainStatOptions.options}
              onValueChange={(prop) => setSelectedMainstat(prop as Property)}
            />
          )}

          <Input placeholder="+" />
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
                    value: [],
                  };
                })
              }
              itemDisabled={(prop) =>
                selectedSubstats.map((e) => e.substat).includes(prop)
              }
            />

            <Popover>
              <PopoverTrigger disabled={!selectedSubstats.at(line)}>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  disabled={!selectedSubstats.at(line)}
                >
                  Set Substat
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
    <span>{asPercentage(sum)}</span>
  ) : (
    <span>{sum.toFixed(2)}</span>
  );
}
