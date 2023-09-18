"use client";

import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
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
import {
  ArmoryFormSchema,
  RelicCategory,
  defaultArmoryFormSchema,
} from "../armory/schema";
import {
  ParsedRelicSchema,
  ParsedStatRecord,
  StatParserConstructor,
  useStatParser,
} from "@/hooks/useStatParser";
import { useRelicSlotType } from "@/hooks/queries/useRelicSlotType";
import {
  CardData,
  CardDataAction,
  dataReducer,
  initialCardData,
} from "./dataReducer";

interface CardConfigContextPayload {
  currentCharacter?: MihomoCharacter;
  setCurrentCharacter: (to: MihomoCharacter) => void;

  armoryFormValue: ArmoryFormSchema;
  updateArmoryFormValue: Dispatch<SetStateAction<ArmoryFormSchema>>;

  mode: "API" | "ARMORY";
  setMode: (to: "API" | "ARMORY") => void;

  enkaRef: RefObject<HTMLDivElement> | null;
  config: CardConfig;
  changeConfig: Dispatch<CardConfigAction>;
  data: CardData;
  changeData: Dispatch<CardDataAction>;
  mihomoResponse?: MihomoResponse;
  updateParam: (toUid?: string, toLang?: (typeof LANGS)[number]) => void;

  parsedStats: ParsedStatRecord | undefined;
  characterRelics: ParsedRelicSchema[];
}

export const defaultCardConfig: CardConfigContextPayload = {
  currentCharacter: undefined,
  setCurrentCharacter: () => {},

  armoryFormValue: defaultArmoryFormSchema,
  updateArmoryFormValue: () => {},

  mode: "API",
  setMode: () => {},

  enkaRef: null,
  config: initialConfig,
  changeConfig: () => {},
  data: initialCardData,
  changeData: () => {},
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
  const [mode, setMode] = useState<"API" | "ARMORY">("API");

  const { query } = useMihomoInfo({ uid, lang });

  function updateParam(toUid?: string, toLang?: (typeof LANGS)[number]) {
    if (!!toUid) setUid(toUid);
    if (!!toLang) setLang(toLang);
  }

  const [config, changeConfig] = useReducer(configReducer, initialConfig);
  const [data, changeData] = useReducer(dataReducer, initialCardData);

  const [armoryFormValue, updateArmoryFormValue] = useState(
    defaultArmoryFormSchema
  );

  const [parserConstructor, setParserConstructor] = useState<
    StatParserConstructor | undefined
  >(undefined);
  const [characterRelics, setCharacterRelics] = useState<ParsedRelicSchema[]>(
    []
  );
  const parsedStats = useStatParser(parserConstructor);
  const [setIds, setSetIds] = useState<number[]>([]);
  const { data: relicSlotMap } = useRelicSlotType(setIds);

  useEffect(() => {
    const { player, lc, relic } = armoryFormValue;
    if (!!data.characterId && !!lc && !!lc.id) {
      const relics: ParsedRelicSchema[] = !relic
        ? []
        : Object.entries(relic)
            .map(([type, data]) => ({
              id: Number(data.id),
              rarity: data.rarity,
              setId: data.setId,
              type: type as RelicCategory,
              level: data.level,
              property: data.mainStat.property,
              subStats: data.subStats,
            }))
            .sort((a, b) => byRelicType(a.type, b.type));

      setCharacterRelics(relics);

      setParserConstructor({
        character: {
          id: data.characterId,
          ascension: player.ascension,
          level: player.level,
        },
        traceTable: player.trace,
        lightCone: lc,
        relic: relics,
      });
    }
  }, [armoryFormValue, data.characterId]);

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
          property: main_affix.type,
          subStats: sub_affix.map(({ type: property, count: step, value }) => ({
            property,
            step,
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

      setParserConstructor({
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

  const returnData = useMemo(
    () => ({
      currentCharacter,
      setCurrentCharacter,

      armoryFormValue,
      updateArmoryFormValue,

      mode,
      setMode,

      enkaRef,

      config,
      changeConfig,

      data,
      changeData,
      // initResponse: setMihomoResponse,
      mihomoResponse: query.data,
      updateParam,

      parsedStats,
      characterRelics,
    }),
    [
      armoryFormValue,
      characterRelics,
      config,
      currentCharacter,
      data,
      mode,
      parsedStats,
      query.data,
    ]
  );
  return returnData;
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

function byRelicType(a: RelicCategory, b: RelicCategory) {
  const getValue = (x: RelicCategory) => {
    switch (x) {
      case "HEAD":
        return 1;
      case "HAND":
        return 2;
      case "BODY":
        return 3;
      case "FOOT":
        return 4;
      case "OBJECT":
        return 5;
      case "NECK":
        return 6;
    }
  };
  return getValue(a) - getValue(b);
}
