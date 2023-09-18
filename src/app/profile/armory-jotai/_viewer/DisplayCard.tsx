"use client";

import { useCharacterMetadata } from "@/hooks/queries/useCharacterMetadata";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { armoryStructAtom, configAtom, statParseParam } from "../_store/main";
import { LANGS } from "@/lib/constants";
import { useStatParser } from "@/hooks/useStatParser";
import { CharacterInfo } from "../../[uid]/_components/info_block/CharacterInfo";
import { EidolonInfo } from "../../[uid]/_components/skill_block/EidolonInfo";
import { LightConeInfo } from "../../[uid]/_components/skill_block/LightConeInfo";
import { SkillInfo } from "../../[uid]/_components/skill_block/SkillInfo";
import { StatTable } from "../../[uid]/_components/stat_block/StatTable";
import { SpiderChartWrapper } from "../../[uid]/_components/SpiderChartWrapper";
import { RelicInfo } from "../../[uid]/_components/relic_block/RelicInfo";
import { useMihomoInfo } from "../../[uid]/useMihomoInfo";
import { charIdAtom, charLevelAtom, charStructAtom } from "../_store/character";
import { useEffect } from "react";
import { lcStructAtom } from "../_store/lightcone";
import { relicsStructAtom } from "../_store/relic";
import { useRelicSlotType } from "@/hooks/queries/useRelicSlotType";
import { useRelicSets } from "@/hooks/queries/useRelicSetList";

type Lang = (typeof LANGS)[number];
type Props =
  | {
      mode: "API";
      uid: string;
      lang: Lang | undefined;
    }
  | { mode: "ARMORY" };

const selectedCharacterIndexAtom = atom(0);
const setIdsAtom = atom(
  (get) =>
    get(relicsStructAtom)
      .map((e) => e.setId)
      .filter(Boolean) as number[]
);

export function DisplayCard(props: Props) {
  const armoryData = useAtomValue(armoryStructAtom);
  const parseParams = useAtomValue(statParseParam);
  const config = useAtomValue(configAtom);
  const parsedStats = useStatParser(parseParams);

  useMihomoApiUpdate(props);

  const { data: charMetadata } = useCharacterMetadata(armoryData.player.id);

  if (!parsedStats) return <div>parsed stats is null</div>;
  // TODO: enkaREF

  if (props.mode == "ARMORY" && !!charMetadata) {
    return (
      <div
        className="h-fit w-fit p-4"
        // ref={enkaRef}
      >
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
            level={armoryData.player.level}
            ascension={armoryData.player.ascension}
            eidolon={armoryData.player.eidolon}
          />

          <div id="block-2" className="flex justify-evenly">
            <EidolonInfo
              className="w-14"
              characterId={charMetadata.avatar_id}
              eidolon={armoryData.player.eidolon}
            />
            <div className="flex flex-col pb-2">
              {!!armoryData.lc.id && (
                <LightConeInfo
                  id="lightcone-2.1"
                  className="grow"
                  lcId={armoryData.lc.id}
                  level={armoryData.lc.level}
                  imposition={armoryData.lc.imposition}
                  ascension={armoryData.lc.ascension}
                  config={config}
                />
              )}
              <SkillInfo
                id="skill-2.2"
                characterId={charMetadata.avatar_id}
                skills={armoryData.player.skills}
                eidolon={armoryData.player.eidolon}
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
}

/**
 * @param props - if undefined then this is a noop
 */
function useMihomoApiUpdate(props: Props) {
  const { mode } = props;
  const { query } = useMihomoInfo(
    mode == "API"
      ? { uid: props.uid, lang: props.lang }
      : { uid: undefined, lang: undefined }
  );
  const setCharStruct = useSetAtom(charStructAtom);
  const setLcStruct = useSetAtom(lcStructAtom);
  const setRelicStruct = useSetAtom(relicsStructAtom);
  const charIndex = useAtomValue(selectedCharacterIndexAtom);
  const setIds = useAtomValue(setIdsAtom);
  const { data: relicSlot } = useRelicSet();

  useEffect(() => {
    if (!!query.data && props.mode == "API") {
      // map everything here
      const { player } = query.data;
      const chara = query.data.characters[charIndex];
      const relics = query.data.characters[charIndex].relics;
      setCharStruct({
        id: chara.id,
        level: chara.level,
        ascension: chara.promotion,
        eidolon: chara.rank,
        // TODO:
        skills: {},
        trace: {},
      });
      if (!!chara.light_cone) {
        setLcStruct({
          id: Number(chara.light_cone.id),
          level: chara.light_cone.level,
          ascension: chara.light_cone.promotion,
          imposition: chara.light_cone.rank,
        });
      }
      setRelicStruct(
        relics.map((relic) => {
          return {};
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);
}
