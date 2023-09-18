"use client";

import { LANGS } from "@/lib/constants";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { relicsStructAtom } from "../_store/relic";
import { useMihomoInfo } from "../../[uid]/useMihomoInfo";
import { charStructAtom } from "../_store/character";
import { lcStructAtom } from "../_store/lightcone";
import { useEffect, useState } from "react";
import {
  mhyCharacterIds,
  selectedCharacterIndexAtom,
  setIdsAtom,
} from "./atoms";
import { useRelics } from "@/hooks/queries/useRelic";
import { MihomoRelicConfig } from "../../types";
import { RelicCategory } from "../../armory/schema";
import { RelicConfig } from "@/bindings/RelicConfig";
import { configAtom } from "../_store/main";

type Lang = (typeof LANGS)[number];
type Props =
  | {
      mode: "API";
      uid: string;
      lang: Lang | undefined;
    }
  | { mode: "ARMORY" };

/**
 * @param props - if undefined then this is a noop
 */
export function useMihomoApiUpdate(props: Props) {
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
  const setMhyCharIds = useSetAtom(mhyCharacterIds);
  const [setIds, updateSetIds] = useState<number[]>([]);
  const { data: relicsData } = useRelics(setIds);
  const updateConfig = useSetAtom(configAtom);

  useEffect(() => {
    if (!!query.data && props.mode == "API") {
      const { nickname, uid } = query.data.player;
      updateConfig({ type: "changeUser", payload: { name: nickname, uid } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mode, query.data]);

  useEffect(() => {
    if (!!query.data && props.mode == "API") {
      setMhyCharIds(query.data.characters.map((e) => e.id));

      const tempSetIds = query.data.characters
        .map((e) => e.relics.map((a) => Number(a.set_id)))
        .flat();
      updateSetIds(Array.from(new Set(tempSetIds)));

      const chara = query.data.characters[charIndex];
      setCharStruct({
        id: chara.id,
        level: chara.level,
        ascension: chara.promotion,
        eidolon: chara.rank,
        skills: Object.fromEntries(
          chara.skills.map((skill) => [skill.id, skill.level])
        ),
        trace: Object.fromEntries(
          chara.skill_trees.map((trace) => [trace.id, trace.level > 0])
        ),
      });
      if (!!chara.light_cone) {
        setLcStruct({
          id: Number(chara.light_cone.id),
          level: chara.light_cone.level,
          ascension: chara.light_cone.promotion,
          imposition: chara.light_cone.rank,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mode, query.data, charIndex]);

  useEffect(() => {
    if (!!query.data && props.mode == "API" && !!relicsData) {
      const relics = query.data.characters[charIndex].relics;
      setRelicStruct(
        relics.map(
          ({ id, level, rarity, set_id: setId, main_affix, sub_affix }) => {
            return {
              id: Number(id),
              rarity,
              setId: Number(setId),
              type: findRelicType({ id, setId, relicsData }),
              level,
              property: main_affix.type,
              subStats: sub_affix.map(
                ({ type: property, value, count: step }) => ({
                  property,
                  value,
                  step,
                })
              ),
            };
          }
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, props.mode, relicsData, charIndex]);
}

function findRelicType({
  id,
  setId,
  relicsData,
}: {
  id: string;
  setId: string;
  relicsData: RelicConfig[];
}): RelicCategory {
  const find = relicsData.find(
    (e) => e.id == Number(id) && e.set_id == Number(setId)
  );
  return !!find ? find.ttype : "HEAD";
}
