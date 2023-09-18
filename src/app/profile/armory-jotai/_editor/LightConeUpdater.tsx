import { useLightConeMetadata } from "@/hooks/queries/useLightConeMetadata";
import { useAtomValue, useSetAtom } from "jotai";
import {
  lcIdAtom,
  lcImpositionAtom,
  lcLevelAtom,
  lcPromotionAtom,
  maxLevelAtom,
} from "../_store/lightcone";
import { Input } from "@/app/components/ui/Input";

export function LightConeUpdater() {
  const lcId = useAtomValue(lcIdAtom);
  const { lightCone } = useLightConeMetadata(lcId);

  return (
    <div>
      <div>{lightCone?.equipment_name}</div>

      <div className="flex flex-col gap-2">
        <LevelInput />

        <PromotionInput />

        <ImpositionInput />
      </div>
    </div>
  );
}

function LevelInput() {
  const maxLevel = useAtomValue(maxLevelAtom);
  const setLevel = useSetAtom(lcLevelAtom);

  return (
    <div className="flex items-center gap-2">
      <span>Level:</span>
      <Input
        className="w-12"
        type="number"
        autoComplete="off"
        min={1}
        max={maxLevel}
        defaultValue={1}
        onChange={(e) => setLevel(parseInt(e.target.value))}
      />
      <span>/{maxLevel}</span>
    </div>
  );
}

function PromotionInput() {
  const setAscension = useSetAtom(lcPromotionAtom);
  return (
    <div className="flex items-center gap-2">
      <span>Ascension</span>
      <Input
        className="w-12"
        type="number"
        autoComplete="off"
        min={0}
        max={6}
        defaultValue={0}
        onChange={(e) => {
          const val = parseInt(e.currentTarget.value);
          if (val >= 0 || val <= 6) setAscension(val);
        }}
      />
    </div>
  );
}

function ImpositionInput() {
  const setRank = useSetAtom(lcImpositionAtom);
  return (
    <div className="flex items-center gap-2">
      <span>Imposition</span>
      <Input
        className="w-12"
        type="number"
        autoComplete="off"
        min={1}
        max={5}
        defaultValue={1}
        onChange={(e) => {
          const val = parseInt(e.currentTarget.value);
          if (val >= 0 || val <= 6) setRank(val);
        }}
      />
    </div>
  );
}
