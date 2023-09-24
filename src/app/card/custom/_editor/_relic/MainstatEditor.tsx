import { RelicInput } from "@/app/card/_store/relic";
import { PrimitiveAtom, useAtomValue, useSetAtom } from "jotai";
import { PropertySelect } from "../PropertySelect";
import { relicMainstatOptions } from "./relicConfig";
import { Property } from "@/bindings/RelicMainAffixConfig";
import { propertyIconUrl, propertyName } from "@/lib/propertyHelper";
import SVG from "react-inlinesvg";
import { RelicType } from "@/bindings/RelicConfig";
import { useMemo } from "react";
import { focusAtom } from "jotai-optics";
import { selectAtom } from "jotai/utils";

interface Props {
  atom: PrimitiveAtom<RelicInput>;
}
export function MainstatEditor({ atom }: Props) {
  const setMainstat = useSetAtom(
    useMemo(() => focusAtom(atom, (o) => o.prop("property")), [atom])
  );
  const setSubstats = useSetAtom(
    useMemo(() => focusAtom(atom, (o) => o.prop("subStats")), [atom])
  );
  const type = useAtomValue(
    useMemo(() => selectAtom(atom, (o) => o.type), [atom])
  );
  const property = useAtomValue(
    useMemo(() => selectAtom(atom, (o) => o.property), [atom])
  );

  const mainStatOptions =
    relicMainstatOptions.find((e) => e.type == type)?.options ?? [];

  function updateMainstat(prop: Property) {
    setMainstat(prop);
    setSubstats((prev) =>
      prev.map((substat) => {
        if (substat?.property == prop) return undefined;
        return substat;
      })
    );
  }

  if (isMainstatEditable(type))
    return (
      <PropertySelect
        className="w-48"
        options={mainStatOptions}
        onValueChange={updateMainstat}
        value={property}
      />
    );
  else if (!!property)
    return (
      <div className="flex h-full w-48 items-center gap-2 rounded-md border px-3 py-2">
        <SVG src={propertyIconUrl(property)} width={24} height={24} />
        {propertyName(property)}
      </div>
    );
  return null;
}

function isMainstatEditable(type: RelicType) {
  return type !== "HEAD" && type !== "HAND";
}
