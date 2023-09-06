import { CharacterCard } from "@/app/character-db/CharacterCardWrapper";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/Form";
import { Input } from "@/app/components/ui/Input";
import { AvatarSkillConfig } from "@/bindings/AvatarSkillConfig";
import { useCharacterMetadata } from "@/hooks/queries/useCharacterMetadata";
import { img } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import Image from "next/image";
import { ArmoryFormSchema } from "../schema";

interface Props {
  characterId: number;
  form: UseFormReturn<ArmoryFormSchema>;
  skills: AvatarSkillConfig[];
}

export function CharacterEditorTab({ characterId, form, skills }: Props) {
  const { data: chara } = useCharacterMetadata(characterId);

  if (!chara || skills.length === 0) return null;

  return (
    <div className="flex gap-2">
      <CharacterCard
        className="h-fit w-48"
        imgUrl={url(chara.avatar_id)}
        avatar_base_type={chara.avatar_base_type}
        avatar_name={chara.avatar_name}
        rarity={chara.rarity}
        damage_type={chara.damage_type}
      />
      <div id="summary-info">
        Level: {form.watch("player.level")} /{" "}
        {form.watch("player.ascension") * 10 + 20}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="player.level"
            render={({ field: { ...field } }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <Input
                    className="w-16"
                    type="number"
                    autoComplete="off"
                    {...field}
                    min={1}
                    max={form.getValues("player.ascension") * 10 + 20}
                    onChange={(e) => {
                      if (!Number.isNaN(e.currentTarget.value)) {
                        field.onChange(Number(e.currentTarget.value));
                      } else e.preventDefault();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="player.ascension"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ascension</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="w-16"
                    autoComplete="off"
                    {...field}
                    min={0}
                    max={6}
                    onChange={(e) => {
                      if (!Number.isNaN(e.currentTarget.value)) {
                        field.onChange(Number(e.currentTarget.value));
                      } else e.preventDefault();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="player.eidolon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ascension</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="w-16"
                    autoComplete="off"
                    {...field}
                    min={0}
                    max={6}
                    onChange={(e) => {
                      if (!Number.isNaN(e.currentTarget.value)) {
                        field.onChange(Number(e.currentTarget.value));
                      } else e.preventDefault();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SkillEditor
          form={form}
          eidolon={form.getValues("player.eidolon")}
          skills={skills}
          characterId={characterId}
        />
      </div>
    </div>
  );
}

interface SkillEditorProps {
  form: UseFormReturn<ArmoryFormSchema>;
  eidolon: number;
  skills: AvatarSkillConfig[];
  characterId: number;
}
function SkillEditor({ form, eidolon, skills, characterId }: SkillEditorProps) {
  return (
    <>
      {skills.map((skill) => (
        <div key={skill.skill_id} className="flex gap-2">
          <Image
            src={`${getImagePath(characterId, skill)}`}
            alt={`${skill.skill_id}`}
            width={64}
            height={64}
            className="h-16 w-16"
          />

          <FormField
            control={form.control}
            // dummy number typecast
            name={`player.skills.${skill.skill_id}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{skill.skill_name}</FormLabel>
                <FormControl>
                  <Input
                    className="w-16"
                    type="number"
                    min={1}
                    max={15}
                    autoComplete="off"
                    {...field}
                    onChange={(e) => field.onChange(+e.currentTarget.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </>
  );
}

function url(id: string | number): string {
  return img(`image/character_preview/${id}.png`);
}

function getImagePath(
  characterId: number | null | undefined,
  skill: AvatarSkillConfig
): string | undefined {
  let ttype = "";
  if (skill.attack_type) {
    switch (skill.attack_type) {
      case "Normal":
        ttype = "basic_attack";
        break;
      case "BPSkill":
        ttype = "skill";
        break;
      case "Ultra":
        ttype = "ultimate";
        break;
      case "Talent":
        ttype = "talent";
        break;
      case "Maze":
        ttype = "technique";
        break;
    }
  } else {
    switch (skill.skill_type_desc) {
      case "Basic ATK":
        ttype = "basic_atk";
        break;
      case "Skill":
        ttype = "skill";
        break;
      case "Ultra":
        ttype = "ultimate";
        break;
      case "Talent":
        ttype = "talent";
        break;
      case "Technique":
        ttype = "technique";
        break;
    }
  }
  if (!characterId) return undefined;
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/skill/${characterId}_${ttype}.png`;
}
