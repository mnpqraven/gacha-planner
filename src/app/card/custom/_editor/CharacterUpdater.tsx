import { atom, useAtom, useAtomValue } from "jotai";
import {
  charEidAtom,
  charIdAtom,
  charLevelAtom,
  charPromotionAtom,
  charSkillAtom,
  maxLevelAtom,
} from "../../_store/character";
import { Input } from "@/app/components/ui/Input";
import { useCharacterSkill } from "@/hooks/queries/useCharacterSkill";
import { AvatarSkillConfig, SkillType } from "@/bindings/AvatarSkillConfig";
import { cn, getImagePath } from "@/lib/utils";
import Image from "next/image";
import { getSkillMaxLevel } from "../../[uid]/_components/skill_block/SkillInfo";
import { HTMLAttributes, forwardRef, useEffect, useMemo } from "react";
import { Label } from "@/app/components/ui/Label";
import { Badge } from "@/app/components/ui/Badge";

const skillTypeMap = [
  { skillTypeDesc: "Basic ATK", label: "Basic" },
  { skillTypeDesc: "Talent", label: "Talent" },
  { skillTypeDesc: "Skill", label: "Skill" },
  { skillTypeDesc: "Ultimate", label: "Ult" },
];

export function CharacterUpdater() {
  const charId = useAtomValue(charIdAtom);
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
  const maxLevel = useAtomValue(
    useMemo(() => atom((get) => get(charPromotionAtom) * 10 + 20), [])
  );

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="level">Level</Label>
          <LevelInput id="level" />
          <span>/{maxLevel}</span>
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

      <div className="flex flex-col gap-2">
        {skillTypeMap.map(({ skillTypeDesc, label }) => (
          <SkillSection
            charId={charId}
            key={skillTypeDesc}
            label={label}
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
>(({ className, ...props }, ref) => {
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
      ref={ref}
    />
  );
});
LevelInput.displayName = "LevelInput";

const PromotionInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
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
      ref={ref}
    />
  );
});
PromotionInput.displayName = "PromotionInput";

const EidolonInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [eidolon, setEidolon] = useAtom(charEidAtom);
  return (
    <Input
      className={cn("w-12", className)}
      type="number"
      autoComplete="off"
      min={0}
      max={6}
      value={eidolon}
      onChange={(e) => {
        const val = parseInt(e.currentTarget.value);
        if (val >= 0 || val <= 6) setEidolon(val);
      }}
      {...props}
      ref={ref}
    />
  );
});
EidolonInput.displayName = "EidolonInput";

function SkillSection({
  charId,
  data,
  label,
}: {
  charId: number | undefined;
  data: AvatarSkillConfig[];
  label: string;
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
    <div className="h-20">
      {!!data[0] && (
        <div className="flex gap-2">
          <Image
            src={`${getImagePath(charId, data[0])}`}
            alt={`${data[0].skill_id}`}
            width={64}
            height={64}
            className="h-16 w-16"
          />
          <div className="flex flex-col gap-2">
            <Badge className="w-fit">{label}</Badge>
            <SkillInput id={data[0].skill_id} maxLv={maxLv} />
          </div>
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
