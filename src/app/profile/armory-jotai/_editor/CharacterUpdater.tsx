import { useAtom, useAtomValue, useSetAtom } from "jotai";
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
import { cn, getImagePath } from "@/lib/utils";
import Image from "next/image";
import { getSkillMaxLevel } from "../../[uid]/_components/skill_block/SkillInfo";
import { HTMLAttributes, forwardRef, useEffect, useMemo } from "react";
import { Label } from "@/app/components/ui/Label";

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
    <div className="flex gap-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="level">Level</Label>
          <LevelInput id="level" />
        </div>

        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="promotion">Ascension</Label>
          <PromotionInput id="promotion" />
        </div>

        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="eidolon">Eidolon</Label>
          <EidolonInput id="eidolon" />
        </div>
      </div>

      <div className="flex flex-col">
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

const LevelInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(({ className, ...props }) => {
  const maxLevel = useAtomValue(maxLevelAtom);
  const [level, setLevel] = useAtom(charLevelAtom);

  {
    /* <span>/{maxLevel}</span> */
  }
  return (
    <Input
      className={cn("w-12", className)}
      type="number"
      autoComplete="off"
      min={1}
      max={maxLevel}
      value={level}
      onChange={(e) => setLevel(parseInt(e.target.value))}
      {...props}
    />
  );
});
LevelInput.displayName = "LevelInput";

const PromotionInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(({ className, ...props }) => {
  const [ascension, setAscension] = useAtom(charPromotionAtom);
  return (
    <Input
      className={cn("w-12", className)}
      type="number"
      autoComplete="off"
      min={0}
      max={6}
      value={ascension}
      onChange={(e) => {
        const val = parseInt(e.currentTarget.value);
        if (val >= 0 || val <= 6) setAscension(val);
      }}
      {...props}
    />
  );
});
PromotionInput.displayName = "PromotionInput";

const EidolonInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(() => {
  const [eidolon, setEidolon] = useAtom(charEidAtom);
  return (
    <Input
      className="w-12"
      type="number"
      autoComplete="off"
      min={0}
      max={6}
      value={eidolon}
      onChange={(e) => {
        const val = parseInt(e.currentTarget.value);
        if (val >= 0 || val <= 6) setEidolon(val);
      }}
    />
  );
});
EidolonInput.displayName = "EidolonInput";

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
  const [charSkill, setCharSkill] = useAtom(charSkillAtom);
  useEffect(() => {
    if (!charSkill[id]) updateSkill(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateSkill(to: number) {
    setCharSkill((draft) => {
      draft[id] = to;
      draft = draft;
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        className="w-12"
        type="number"
        min={1}
        max={maxLv}
        value={charSkill[id]}
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
