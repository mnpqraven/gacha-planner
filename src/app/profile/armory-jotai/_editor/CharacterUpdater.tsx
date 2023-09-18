import { useAtomValue, useSetAtom } from "jotai";
import {
  charEidAtom,
  charIdAtom,
  charLevelAtom,
  charPromotionAtom,
  charSkillAtom,
  maxLevelAtom,
} from "../_store/character";
import { Input } from "@/app/components/ui/Input";
import { useCharacterMetadata } from "@/hooks/queries/useCharacterMetadata";
import { useCharacterSkill } from "@/hooks/queries/useCharacterSkill";
import { AvatarSkillConfig, SkillType } from "@/bindings/AvatarSkillConfig";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import { getSkillMaxLevel } from "../../[uid]/_components/skill_block/SkillInfo";
import { useEffect, useMemo } from "react";

export function CharacterUpdater() {
  const charId = useAtomValue(charIdAtom);
  const { data: metadata } = useCharacterMetadata(charId);
  const { data: skills } = useCharacterSkill(charId);
  const sortedSkills = skills
    .filter(
      ({ attack_type }) =>
        attack_type !== "MazeNormal" && attack_type !== "Maze"
    )
    .filter(({ skill_tag }) => skill_tag !== "Cancel")
    .sort((a, b) => {
      const toInt = (ttype: SkillType | null | undefined, typeDesc: string) => {
        if (ttype === "Maze") return 4;
        if (ttype === "Ultra") return 3;
        if (ttype === "BPSkill") return 2;
        if (ttype === "Talent" || typeDesc === "Talent") return 1;
        return 0;
      };
      return (
        toInt(a.attack_type, a.skill_type_desc) -
        toInt(b.attack_type, b.skill_type_desc)
      );
    });

  if (!metadata) return "Loading character metadata...";
  if (!skills) return "Loading character skills...";

  return (
    <div>
      <div>{metadata.avatar_name}</div>
      <div className="flex flex-col gap-2">
        <LevelInput />

        <PromotionInput />

        <EidolonInput />

        {["Basic ATK", "Talent", "Skill", "Ultimate"].map((skillTypeDesc) => (
          <SkillSection
            charId={charId}
            key={skillTypeDesc}
            data={sortedSkills.filter(
              (e) => e.skill_type_desc == skillTypeDesc
            )}
          />
        ))}
      </div>
    </div>
  );
}

function LevelInput() {
  const maxLevel = useAtomValue(maxLevelAtom);
  const setLevel = useSetAtom(charLevelAtom);

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
  const setAscension = useSetAtom(charPromotionAtom);
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

function EidolonInput() {
  const setEidolon = useSetAtom(charEidAtom);
  return (
    <div className="flex items-center gap-2">
      <span>Eidolon</span>
      <Input
        className="w-12"
        type="number"
        autoComplete="off"
        min={0}
        max={6}
        defaultValue={0}
        onChange={(e) => {
          const val = parseInt(e.currentTarget.value);
          if (val >= 0 || val <= 6) setEidolon(val);
        }}
      />
    </div>
  );
}

function SkillSection({
  charId,
  data,
}: {
  charId: number | undefined;
  data: AvatarSkillConfig[];
}) {
  const eidolon = useAtomValue(charEidAtom);
  const maxLv = useMemo(
    () =>
      !!data[0]
        ? getSkillMaxLevel(
            data[0].attack_type,
            data[0].skill_type_desc,
            eidolon
          )
        : 10,
    [data, eidolon]
  );

  return (
    <div>
      {data.map((skill) => (
        <div key={skill.skill_id} className="flex flex-col">
          {skill.skill_name} - {skill.skill_type_desc}
        </div>
      ))}
      {!!data[0] && (
        <div className="flex">
          <Image
            src={`${getImagePath(charId, data[0])}`}
            alt={`${data[0].skill_id}`}
            width={64}
            height={64}
            className="h-16 w-16"
          />
          <SkillInput id={data[0].skill_id} maxLv={maxLv} />
        </div>
      )}
    </div>
  );
}

function SkillInput({ id, maxLv }: { id: number; maxLv: number }) {
  const setCharSkill = useSetAtom(charSkillAtom);
  useEffect(() => {
    updateSkill(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateSkill(to: number) {
    setCharSkill((draft) => {
      draft[id] = to;
      draft = draft;
    });
  }

  return (
    <div className="flex">
      <Input
        type="number"
        min={1}
        max={maxLv}
        defaultValue="1"
        onChange={(e) => {
          if (parseInt(e.target.value)) {
            const asInt = parseInt(e.target.value);
            updateSkill(asInt);
          }
        }}
      />
      <span> / {maxLv}</span>
    </div>
  );
}
