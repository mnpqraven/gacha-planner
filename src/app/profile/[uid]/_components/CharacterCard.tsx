"use client";

import { useEffect } from "react";
import { CharacterInfo } from "./info_block/CharacterInfo";
import { SkillInfo } from "./skill_block/SkillInfo";
import { LightConeInfo } from "./skill_block/LightConeInfo";
import { RelicInfo } from "./relic_block/RelicInfo";
import { StatTable } from "./stat_block/StatTable";
import { SpiderChartWrapper } from "./SpiderChartWrapper";
import { useCardConfigController } from "../ConfigControllerContext";
import { EidolonInfo } from "./skill_block/EidolonInfo";
import { LANGS } from "@/lib/constants";

type Lang = (typeof LANGS)[number];
interface Props {
  uid: string;
  lang: Lang | undefined;
  mode: "API" | "ARMORY";
}
function CharacterCardWrapper({ uid, lang }: Props) {
  const { currentCharacter, enkaRef, updateParam, mihomoResponse, config } =
    useCardConfigController();

  // this executes on mount to update the context tracker
  useEffect(() => {
    updateParam(uid, lang);
  }, [uid, lang, updateParam]);

  if (!currentCharacter) return null;

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
          characterData={currentCharacter}
          playerData={mihomoResponse?.player}
          config={config}
        />

        <div id="block-2" className="flex justify-evenly">
          <EidolonInfo
            className="w-14"
            characterId={currentCharacter.id}
            characterData={currentCharacter}
          />
          <div className="flex flex-col pb-2">
            <LightConeInfo
              id="lightcone-2.1"
              className="grow"
              lcId={currentCharacter.light_cone.id}
              characterData={currentCharacter}
              config={config}
            />
            <SkillInfo id="skill-2.2" characterData={currentCharacter} />
          </div>
        </div>

        <div id="block-3" className="col-span-2 flex gap-4">
          <div className="flex grow flex-col gap-2 place-self-end pb-2">
            <SpiderChartWrapper characterData={currentCharacter} />

            <StatTable
              id="stat-3"
              className="grid grid-cols-2 gap-x-2"
              element={currentCharacter.element.name}
              attributes={currentCharacter.attributes}
              properties={currentCharacter.properties}
              additions={currentCharacter.additions}
              config={config}
            />
          </div>

          <RelicInfo
            id="relic-4"
            className="justify-end pb-2"
            characterData={currentCharacter}
            config={config}
          />
        </div>
      </div>
    </div>
  );
}

export { CharacterCardWrapper };
