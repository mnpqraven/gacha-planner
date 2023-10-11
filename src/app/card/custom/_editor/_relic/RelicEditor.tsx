import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import { focusAtom } from "jotai-optics";
import { Property } from "@/bindings/SkillTreeConfig";
import { img } from "@/lib/utils";
import { useMemo } from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/Popover";
import { SubstatSpreadConfig } from "./SubstatSpreadConfig";
import { useSubStatSpread } from "@/hooks/queries/useSubStatSpread";
import { useToast } from "@/app/components/ui/Toast/useToast";
import { prettyProperty } from "@/lib/propertyHelper";
import { Label } from "@/app/components/ui/Label";
import { selectAtom, splitAtom } from "jotai/utils";
import { SubStatSchema } from "@/hooks/useStatParser";
import { subStatOptions } from "./relicConfig";
import { PropertySelect } from "../PropertySelect";
import { RelicType } from "@/bindings/RelicConfig";
import { RelicInput } from "@/app/card/_store/relic";
import { AlignHorizontalDistributeCenter } from "lucide-react";

export function RelicEditor({ atom }: { atom: PrimitiveAtom<RelicInput> }) {
  const setIdAtom = useMemo(
    () => selectAtom(atom, (optic) => optic.setId),
    [atom]
  );
  const propertyAtom = useMemo(
    () => selectAtom(atom, (optic) => optic.property),
    [atom]
  );
  const substatsAtom = useMemo(
    () => focusAtom(atom, (optic) => optic.prop("subStats")),
    [atom]
  );

  const relic = useAtomValue(atom);
  const setId = useAtomValue(setIdAtom);
  const property = useAtomValue(propertyAtom);
  const { data: spreadData } = useSubStatSpread();
  const { toast } = useToast();

  const [substats, setSubstats] = useAtom(substatsAtom);
  const splittedSubstatAtom = useAtomValue(splitAtom(substatsAtom));

  if (!setId || !spreadData) return null;

  const occupiedProperties: Property[] = !!property
    ? [property, ...substats.filter(Boolean).map((e) => e!.property)]
    : substats.filter(Boolean).map((e) => e!.property);

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

  function warnProperty(prop: Property | undefined) {
    if (!prop) {
      toast({
        variant: "destructive",
        description: "Please select a substat with the selector on the left",
      });
    }
  }

  return (
    <div className="flex gap-2">
      <Image
        src={getRelicIcon(relic.type, setId)}
        alt=""
        height={64}
        width={64}
        className="h-24 w-24"
      />

      <div className="grid flex-1 grid-cols-2 gap-2">
        {splittedSubstatAtom.map((ssAtom, index) => (
          <div key={index} className="flex items-center gap-2">
            <PropertySelect
              className="w-44"
              options={subStatOptions.map((e) => e.option)}
              itemDisabled={(prop) => occupiedProperties.includes(prop)}
              onValueChange={(prop) => onSubStatSelect(prop, index)}
              value={substats.at(index)?.property}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="px-2"
                  disabled={!substats.at(index)?.property}
                >
                  <AlignHorizontalDistributeCenter />
                </Button>
              </PopoverTrigger>

              <PopoverContent side="top" asChild>
                <SubstatSpreadConfig
                  atom={ssAtom}
                  spreadData={spreadData}
                  setId={setId}
                />
              </PopoverContent>
            </Popover>

            <ValueLabel atom={ssAtom} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ValueLabel({
  atom,
}: {
  atom: PrimitiveAtom<SubStatSchema | undefined>;
}) {
  const value = useAtomValue(atom);
  if (!value) return null;
  return prettyProperty(value.property, value.value).prettyValue;
}

function getRelicIcon(type: RelicType, setId: number) {
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
