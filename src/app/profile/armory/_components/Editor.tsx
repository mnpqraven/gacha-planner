"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/Accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/Tabs";
import { CharacterEditorTab } from "../_editor/CharacterEditorTab";
import { useCardConfigController } from "../../[uid]/ConfigControllerContext";
import { Button } from "@/app/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/app/components/ui/Form";
import { useCharacterSkill } from "@/hooks/queries/useCharacterSkill";
import { SkillType } from "@/bindings/AvatarSkillConfig";
import { useCharacterEidolon } from "@/hooks/queries/useCharacterEidolon";
import { useCharacterMetadata } from "@/hooks/queries/useCharacterMetadata";
import { LightConeEditorTab } from "../_editor/LightConeEditorTab";
import { useEffect } from "react";
import {
  ArmoryFormSchema,
  characterMetadataSchema,
  defaultValues,
} from "../schema";
import { RelicEditorTab } from "../_editor/RelicEditorTab";

export function ArmoryEditor() {
  const { currentCharacterId } = useCardConfigController();
  const { data: eidolons } = useCharacterEidolon(currentCharacterId);
  const { data: metadata } = useCharacterMetadata(currentCharacterId);
  const { data: skills } = useCharacterSkill(currentCharacterId);
  const sortedSkills = skills
    .filter(
      (skill) =>
        skill.attack_type !== "Normal" && skill.attack_type !== "MazeNormal"
    )
    .sort((a, b) => {
      const toInt = (ttype: SkillType | null | undefined) => {
        if (ttype === "Maze") return 4;
        if (ttype === "Ultra") return 3;
        if (ttype === "BPSkill") return 2;
        if (ttype === "Talent") return 1;
        return 0;
      };
      return toInt(a.attack_type) - toInt(b.attack_type);
    });

  let filteredSkill: { [x: string]: number } = {};
  Object.values(sortedSkills).forEach((skill) => {
    filteredSkill[`${skill.skill_id}`] = 1;
  });
  const form = useForm<ArmoryFormSchema>({
    resolver: zodResolver(characterMetadataSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!form.getValues("formConfig.mounted") && sortedSkills.length > 0) {
      let filteredSkill: { [x: string]: number } = {};
      Object.values(sortedSkills).forEach((skill) => {
        filteredSkill[`${skill.skill_id}`] = 1;
      });
      form.reset({
        ...defaultValues,
        player: {
          ...defaultValues.player,
          skills: filteredSkill,
        },
        formConfig: {
          mounted: true,
        },
      });
    }
  }, [sortedSkills, form]);

  console.log("formErrors", form.formState.errors);

  function onSubmit(values: ArmoryFormSchema) {
    console.log("onSubmit", values);
  }

  if (!currentCharacterId) return <span>no char id set</span>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="container">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Configuration</AccordionTrigger>

            <AccordionContent>
              <Tabs className="container w-full" defaultValue="chara">
                <TabsList>
                  <TabsTrigger value="chara">Character</TabsTrigger>
                  <TabsTrigger value="lc">Light Cone</TabsTrigger>
                  <TabsTrigger value="relic">Relic</TabsTrigger>
                </TabsList>
                <TabsContent value="chara">
                  <CharacterEditorTab
                    characterId={currentCharacterId}
                    skills={sortedSkills}
                    form={form}
                  />
                </TabsContent>
                <TabsContent value="lc">
                  <LightConeEditorTab
                    form={form}
                    path={metadata?.avatar_base_type}
                  />
                </TabsContent>
                <TabsContent value="relic">
                  <RelicEditorTab form={form} />
                </TabsContent>
              </Tabs>

              <div className="flex w-full justify-end gap-2 pb-2">
                <Button variant="destructive">Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}
