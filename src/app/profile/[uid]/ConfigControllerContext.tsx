"use client";

import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { MihomoCharacter, MihomoResponse } from "../types";
import {
  CardConfig,
  CardConfigAction,
  configReducer,
  initialConfig,
} from "./configReducer";
import { useMihomoInfo } from "./useMihomoInfo";
import { LANGS } from "@/lib/constants";
import { ArmoryFormSchema, defaultArmoryFormSchema } from "../armory/schema";
import {
  ParsedRelicSchema,
  ParsedStatRecord,
  useStatParser,
} from "@/hooks/useStatParser";
import { useRelicSlotType } from "@/hooks/queries/useRelicSlotType";

interface CardConfigContextPayload {
  currentCharacter?: MihomoCharacter;
  setCurrentCharacter: (to: MihomoCharacter) => void;

  currentCharacterId?: number; // for 'ARMORY'
  setCurrentCharacterId: (toId: number) => void; // for 'ARMORY'
  armoryFormValue: ArmoryFormSchema;
  updateArmoryFormValue: Dispatch<SetStateAction<ArmoryFormSchema>>;

  mode: "API" | "ARMORY";
  setMode: (to: "API" | "ARMORY") => void;

  enkaRef: RefObject<HTMLDivElement> | null;
  config: CardConfig;
  changeConfig: Dispatch<CardConfigAction>;
  mihomoResponse?: MihomoResponse;
  updateParam: (toUid?: string, toLang?: (typeof LANGS)[number]) => void;

  parsedStats: ParsedStatRecord | undefined;
  characterRelics: ParsedRelicSchema[];
}

export const defaultCardConfig: CardConfigContextPayload = {
  currentCharacter: undefined,
  setCurrentCharacter: () => {},

  currentCharacterId: undefined,
  setCurrentCharacterId: () => {},

  armoryFormValue: defaultArmoryFormSchema,
  updateArmoryFormValue: () => {},

  mode: "API",
  setMode: () => {},

  enkaRef: null,
  config: initialConfig,
  changeConfig: () => {},
  mihomoResponse: undefined,
  updateParam: () => {},

  parsedStats: undefined,
  characterRelics: [],
};

export const CardConfigContext =
  createContext<CardConfigContextPayload>(defaultCardConfig);

export const CardConfigProvider = ({ children }: { children: ReactNode }) => {
  const value = useCardConfigProvider();

  return (
    <CardConfigContext.Provider value={value}>
      {children}
    </CardConfigContext.Provider>
  );
};

function useCardConfigProvider(): CardConfigContextPayload {
  // for the character selector
  const [currentCharacter, setCurrentCharacter] = useState<
    MihomoCharacter | undefined
  >(undefined);
  // for image exporting
  const enkaRef = useRef<HTMLDivElement>(null);

  const [uid, setUid] = useState<string | undefined>(undefined);
  const [lang, setLang] = useState<(typeof LANGS)[number]>("en");
  const [currentCharacterId, setCurrentCharacterId] = useState<
    number | undefined
  >(undefined);
  const [mode, setMode] = useState<"API" | "ARMORY">("API");

  const { query } = useMihomoInfo({ uid, lang });

  function updateParam(toUid?: string, toLang?: (typeof LANGS)[number]) {
    if (!!toUid) setUid(toUid);
    if (!!toLang) setLang(toLang);
  }

  const [config, changeConfig] = useReducer(configReducer, initialConfig);

  const [armoryFormValue, updateArmoryFormValue] = useState(
    defaultArmoryFormSchema
  );

  const [characterStat, setCharacterStats] = useState<
    Parameters<typeof useStatParser>[0] | undefined
  >(undefined);
  const [characterRelics, setCharacterRelics] = useState<ParsedRelicSchema[]>(
    []
  );
  const parsedStats = useStatParser(characterStat);
  const [setIds, setSetIds] = useState<number[]>([]);
  const { data: relicSlotMap } = useRelicSlotType(setIds);

  useEffect(() => {}, [armoryFormValue]);

  useEffect(() => {
    if (!!currentCharacter && relicSlotMap) {
      const { light_cone, skill_trees } = currentCharacter;
      const relic: ParsedRelicSchema[] = currentCharacter.relics.map(
        ({ id, set_id, level, main_affix, sub_affix, rarity }) => ({
          id: parseInt(id),
          setId: parseInt(set_id),
          level,
          rarity,
          type: relicSlotMap[Number(id)],
          mainStat: { property: main_affix.type, value: main_affix.value },
          subStat: sub_affix.map(({ type: property, count, value }) => ({
            property,
            count,
            value,
          })),
        })
      );
      const lightCone = light_cone
        ? {
            id: parseInt(light_cone.id),
            ascension: light_cone.promotion,
            level: light_cone.level,
            imposition: light_cone.rank - 1,
          }
        : null;

      setSetIds(
        Array.from(
          new Set(currentCharacter.relics.map((e) => Number(e.set_id)))
        )
      );

      setCharacterRelics(relic);

      setCharacterStats({
        character: {
          id: currentCharacter.id,
          ascension: currentCharacter.promotion,
          level: currentCharacter.level,
        },
        lightCone,
        traceTable: Object.fromEntries(
          skill_trees.map((skill) => [skill.id, skill.level > 0])
        ),
        relic,
      });
    }
  }, [currentCharacter, relicSlotMap]);

  return {
    currentCharacter,
    setCurrentCharacter,

    currentCharacterId,
    setCurrentCharacterId,

    armoryFormValue,
    updateArmoryFormValue,

    mode,
    setMode,

    enkaRef,
    config,
    changeConfig,
    // initResponse: setMihomoResponse,
    mihomoResponse: query.data,
    updateParam,

    parsedStats,
    characterRelics,
  };
}

export function useCardConfigController() {
  const context = useContext(CardConfigContext);
  if (!context) {
    throw new Error(
      "useCardConfigContext must be used within a CardConfigContext wrapper!"
    );
  }
  return context;
}
