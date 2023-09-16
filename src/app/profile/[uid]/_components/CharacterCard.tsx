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
import { useCharacterMetadata } from "@/hooks/queries/useCharacterMetadata";
import { useStatParser } from "@/hooks/useStatParser";

type Lang = (typeof LANGS)[number];
interface Props {
  uid: string;
  lang: Lang | undefined;
  mode: "API" | "ARMORY";
}
function CharacterCardWrapper({ uid, lang, mode }: Props) {
  const {
    currentCharacter,
    enkaRef,
    updateParam,
    config,
    setMode,
    currentCharacterId,
    armoryFormValue,
    mihomoResponse,
    parsedStats,
  } = useCardConfigController();

  const { data: charMetadata } = useCharacterMetadata(currentCharacterId);

  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  // this executes on mount to update the context tracker
  useEffect(() => {
    updateParam(uid, lang);
  }, [uid, lang, updateParam]);

  if (!parsedStats) return null;

  if (mode == "ARMORY" && !!charMetadata) {
    const { skills, ...formValues } = armoryFormValue.player;

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
            config={config}
            {...formValues}
          />

          <div id="block-2" className="flex justify-evenly">
            <EidolonInfo
              className="w-14"
              characterId={charMetadata.avatar_id}
              eidolon={formValues.eidolon}
            />
            <div className="flex flex-col pb-2">
              {!!armoryFormValue.lc && (
                <LightConeInfo
                  id="lightcone-2.1"
                  className="grow"
                  lcId={armoryFormValue.lc.id}
                  level={armoryFormValue.lc.level}
                  imposition={armoryFormValue.lc.imposition}
                  ascension={armoryFormValue.lc.ascension}
                  config={config}
                />
              )}
              <SkillInfo
                id="skill-2.2"
                characterId={charMetadata.avatar_id}
                skills={armoryFormValue.player.skills}
                eidolon={formValues.eidolon}
              />
            </div>
          </div>

          <div id="block-3" className="col-span-2 flex gap-4">
            <div className="flex grow flex-col gap-2 place-self-end pb-2">
              <SpiderChartWrapper element={charMetadata.damage_type} />

              <StatTable
                id="stat-3"
                className="grid grid-cols-2 gap-x-2"
                element={charMetadata.damage_type}
                data={parsedStats.statTable}
                config={config}
              />
            </div>

            <RelicInfo id="relic-4" className="justify-end pb-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentCharacter || !parsedStats?.statTable) return null;

  const {
    level,
    promotion: ascension,
    rarity,
    rank: eidolon,
  } = currentCharacter;
  const data = {
    level,
    ascension,
    rarity,
    eidolon,
  };
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
          config={config}
          characterId={currentCharacter.id}
          playerData={{ uid, nickname: mihomoResponse?.player.nickname }}
          {...data}
        />

        <div id="block-2" className="flex justify-evenly">
          <EidolonInfo
            className="w-14"
            characterId={currentCharacter.id}
            eidolon={eidolon}
          />
          <div className="flex flex-col pb-2">
            {!!currentCharacter.light_cone && (
              <LightConeInfo
                id="lightcone-2.1"
                className="grow"
                lcId={currentCharacter.light_cone.id}
                config={config}
                imposition={currentCharacter.light_cone.rank}
                level={currentCharacter.light_cone.level}
                ascension={currentCharacter.light_cone.promotion}
              />
            )}
            <SkillInfo
              id="skill-2.2"
              characterId={currentCharacter.id}
              eidolon={eidolon}
              skills={Object.fromEntries(
                currentCharacter.skills.map((e) => [e.id, e.level])
              )}
            />
          </div>
        </div>

        <div id="block-3" className="col-span-2 flex gap-4">
          <div className="flex grow flex-col gap-2 place-self-end pb-2">
            <SpiderChartWrapper element={currentCharacter.element.name} />

            <StatTable
              id="stat-3"
              className="grid grid-cols-2 gap-x-2"
              data={parsedStats.statTable}
              element={currentCharacter.element.name}
              config={config}
            />
          </div>

          <RelicInfo id="relic-4" className="justify-end pb-2" />
        </div>
      </div>
    </div>
  );
}

export { CharacterCardWrapper };
