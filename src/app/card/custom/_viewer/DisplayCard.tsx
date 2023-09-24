"use client";

import { useCharacterMetadata } from "@/hooks/queries/useCharacterMetadata";
import { useAtomValue, useSetAtom } from "jotai";
import { LANGS } from "@/lib/constants";
import { CharacterInfo } from "../../[uid]/_components/info_block/CharacterInfo";
import { EidolonInfo } from "../../[uid]/_components/skill_block/EidolonInfo";
import { LightConeInfo } from "../../[uid]/_components/skill_block/LightConeInfo";
import { SkillInfo } from "../../[uid]/_components/skill_block/SkillInfo";
import { StatTable } from "../../[uid]/_components/stat_block/StatTable";
import { SpiderChartWrapper } from "../../[uid]/_components/SpiderChartWrapper";
import { RelicInfo } from "../../[uid]/_components/relic_block/RelicInfo";
import { useMihomoApiUpdate } from "./useMihomoApiUpdate";
import { useEffect, useRef } from "react";
import { configAtom } from "../../_store/main";
import { charIdAtom, enkaRefAtom } from "../../_store";

type Lang = (typeof LANGS)[number];
export type DisplayCardProps =
  | {
      mode: "API";
      uid: string;
      lang: Lang | undefined;
    }
  | { mode: "CUSTOM" };

export function DisplayCard(props: DisplayCardProps) {
  const updateConfig = useSetAtom(configAtom);
  const charId = useAtomValue(charIdAtom);
  const { enkaRef } = useEnkaRef();
  const { data: charMetadata } = useCharacterMetadata(charId);

  useEffect(() => {
    updateConfig({ type: "changeMode", payload: props.mode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMihomoApiUpdate(props);

  if (!!charMetadata) {
    return (
      <div className="h-fit w-fit p-4" ref={enkaRef}>
        <div
          id="enka-container"
          className="grid h-[600px] w-[1496px] grid-cols-4 rounded-2xl border border-border bg-background p-3"
          style={{
            boxShadow: "0 1px 10px hsl(var(--border))",
          }}
        >
          <CharacterInfo
            id="block-1"
            className="relative z-10"
            characterId={charMetadata.avatar_id}
          />

          <div id="block-2" className="flex justify-evenly">
            <EidolonInfo
              className="w-14"
              characterId={charMetadata.avatar_id}
            />
            <div className="flex flex-col pb-2">
              <LightConeInfo id="lightcone-2.1" className="grow" />

              <SkillInfo id="skill-2.2" characterId={charMetadata.avatar_id} />
            </div>
          </div>

          <div id="block-3" className="col-span-2 flex gap-4">
            <div className="flex grow flex-col gap-2 place-self-end pb-2">
              <SpiderChartWrapper element={charMetadata.damage_type} />

              <StatTable
                id="stat-3"
                className="grid grid-cols-2 gap-x-2"
                element={charMetadata.damage_type}
              />
            </div>

            <RelicInfo id="relic-4" className="justify-end pb-2" />
          </div>
        </div>
      </div>
    );
  }
}

function useEnkaRef() {
  const enkaRef = useRef<HTMLDivElement>(null);
  const setEnkaRef = useSetAtom(enkaRefAtom);
  useEffect(() => {
    setEnkaRef(enkaRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { enkaRef };
}
