import { PrimitiveAtom, useAtom } from "jotai";
import { RelicInput } from "../../_store/relic";
import {
  relicMainstatOptions,
  subStatOptions,
} from "@/app/profile/armory/_editor/relicConfig";
import { focusAtom } from "jotai-optics";
import { PropertySelect } from "@/app/profile/armory/_editor/RelicEditor/PropertySelect";
import { Property } from "@/bindings/SkillTreeConfig";
import { img, range } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import { RelicCategory } from "@/app/profile/armory/schema";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/Popover";
import { SubstatSpreadConfig } from "./SubstatSpreadConfig";
import { useSubStatSpread } from "@/hooks/queries/useSubStatSpread";

export function RelicEditor({ atom }: { atom: PrimitiveAtom<RelicInput> }) {
  const [relic, setRelic] = useAtom(atom);
  const { type, setId, property } = relic;
  const mainStatOptions =
    relicMainstatOptions.find((e) => e.type == type)?.options ?? [];
  const { data: spreadData } = useSubStatSpread();

  const [substatsAtom] = useState(
    focusAtom(atom, (optic) => optic.prop("subStats"))
  );

  const [substats, setSubstats] = useAtom(substatsAtom);

  if (!setId) return null;

  const occupiedProperties: Property[] = !!property
    ? [property, ...substats.filter(Boolean).map((e) => e!.property)]
    : substats.filter(Boolean).map((e) => e!.property);

  function updateMainstat(property: Property) {
    // remove the occupying substat
    const subStats = substats;
    const findIndex = substats.findIndex((e) => !!e && e.property == property);
    if (findIndex !== -1) {
      subStats[findIndex] = undefined;
    }
    setRelic((relic) => ({
      ...relic,
      property,
      subStats,
    }));
  }

  function updateLevel(level: number) {
    setRelic((relic) => ({ ...relic, level }));
  }

  function onSubStatSelect(prop: Property, index: number) {
    let value = 0;
    const spreadInfo = spreadData?.find((e) => e.property == prop);
    if (!!spreadInfo) {
      const { base_value, step_num, step_value } = spreadInfo;
      value = base_value + (step_value * step_num) / 2;
    }

    setSubstats((substats) =>
      substats.map((substat, i) => {
        if (i === index) return { property: prop, step: 1, value };
        return substat;
      })
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex">
        <Image
          src={getRelicIcon(relic.type, setId)}
          alt=""
          height={128}
          width={128}
          className="h-32 w-32"
        />

        <div className="flex flex-col">
          <div>Main stat</div>
          {isMainstatEditable(type) ? (
            <PropertySelect
              options={mainStatOptions}
              onValueChange={updateMainstat}
              value={property}
            />
          ) : (
            <div>{property}</div>
          )}
        </div>

        <div>
          <div>Level</div>
          <Input
            value={relic.level}
            type="number"
            min={0}
            max={15}
            onChange={(e) => {
              if (!Number.isNaN(e.target.value))
                updateLevel(parseInt(e.target.value));
            }}
          />
        </div>
      </div>

      <div>
        {Array.from(range(0, 3)).map((index) => (
          <div key={index} className="flex">
            <PropertySelect
              className="w-48"
              options={subStatOptions.map((e) => e.option)}
              itemDisabled={(prop) => occupiedProperties.includes(prop)}
              onValueChange={(prop) => onSubStatSelect(prop, index)}
              value={substats.at(index)?.property}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Substats</Button>
              </PopoverTrigger>

              <PopoverContent side="top" asChild>
                <SubstatSpreadConfig
                  defaultValue={substats.at(index)?.value}
                  propertyType={substats.at(index)?.property}
                  setId={setId}
                />
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </div>
    </div>
  );
}

function isMainstatEditable(type: RelicCategory) {
  return type !== "HEAD" && type !== "HAND";
}

function getRelicIcon(type: RelicCategory, setId: number) {
  const suffix = () => {
    switch (type) {
      case "HEAD":
        return "_0";
      case "HAND":
        return "_1";
      case "BODY":
        return "_2";
      case "FOOT":
        return "_3";
      case "OBJECT":
        return "_0";
      case "NECK":
        return "_1";
    }
  };
  return img(`icon/relic/${setId}${suffix()}.png`);
}
