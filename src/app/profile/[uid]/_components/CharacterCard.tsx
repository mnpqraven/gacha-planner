"use client";

import { useContext, useEffect, useRef } from "react";
import { CardConfigContext } from "../ConfigController";
import Image from "next/image";
import { img } from "../../page";
import { PathIcon } from "@/app/character-db/PathIcon";
import { ElementIcon } from "@/app/character-db/ElementIcon";
import { Badge } from "@/app/components/ui/Badge";
import { SkillType } from "@/bindings/AvatarSkillConfig";
import {
  MihomoAttributeConfig,
  MihomoLightConeConfig,
  MihomoPropertyConfig,
  MihomoRelicConfig,
  MihomoResponse,
} from "../../types";
import { Element } from "@/bindings/AvatarConfig";
import { SVG, asPercentage } from "@/lib/utils";
import { ImpositionIcon } from "./ImpositionIcon";
import { Button } from "@/app/components/ui/Button";
import { exportImage } from "./exportImage";
import { CharacterInfo } from "./info_block/CharacterInfo";

const DISPLAY_SKILL_TYPES: SkillType[] = [
  "Talent",
  "Normal",
  "BPSkill",
  "Ultra",
];
interface Props {
  data: MihomoResponse;
}
function CharacterCardWrapper({ data }: Props) {
  const { currentCharacter, setPlayer } = useContext(CardConfigContext);
  const enkaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.player) setPlayer(data.player);
  }, [data.player, setPlayer]);

  if (!currentCharacter) return null;

  const { name, portrait, level, promotion, relics, preview } =
    currentCharacter;
  const {
    rank: eidolon,
    path: { name: path },
    element: { name: element },
  } = currentCharacter;
  const maxLevel = promotion * 10 + 20;

  const skills = currentCharacter.skills.filter((e) =>
    DISPLAY_SKILL_TYPES.includes(e.type)
  );

  return (
    <>
      <Button
        onClick={() => exportImage(enkaRef.current, { mode: "DOWNLOAD" })}
      >
        Export Image
      </Button>

      <div className="h-fit w-fit p-4" ref={enkaRef}>
        <div
          id="enka-container"
          className="relative grid h-[600px] w-[1496px] grid-cols-4 rounded-2xl border border-border bg-background p-3"
          style={{
            boxShadow: "0 1px 10px hsl(var(--border))",
          }}
        >
          <div
            id="left-avatar"
            className="absolute left-3 top-11 flex h-[512px] w-[374px] items-center"
            style={{
              backgroundImage: `url(${img(preview)})`,
              boxShadow: "0 0 10px 10px hsl(var(--background)) inset",
            }}
          />

          <CharacterInfo id="info-1" className="z-10" />

          <div id="skill-2">skill</div>
          <div id="wrapper" className="col-span-2 flex flex-col justify-evenly">
            <div id="relic-3">relic</div>
            <div id="stat-4">stat table</div>
          </div>

          {/*
        <div id="right-stats">
          <div>inner</div>

          <div>{name}</div>
          <div>
            {level} / {maxLevel}
          </div>
          <Badge>Eidolon {eidolon}</Badge>
          <PathIcon path={path} size={"48px"} />
          <ElementIcon element={element} size={"48px"} />

          {skills.map(({ icon, id, level: slv, type }) => (
            <div key={id} className="flex flex-col">
              <Image src={img(icon)} alt="" height={48} width={48} />
              <span>
                {slv} / {getSkillMaxLevel(type, eidolon)}
              </span>
            </div>
          ))}

          <LightConeSection data={currentCharacter.light_cone} />

          {relics.map((relic, index) => (
            <Relic data={relic} key={index} />
          ))}

          <StatTable
            element={element}
            attributes={currentCharacter.attributes}
            properties={currentCharacter.properties}
            additions={currentCharacter.additions}
          />
        </div>
*/}
        </div>
      </div>
    </>
  );
}

function getSkillMaxLevel(skillType: SkillType, eidolon: number): number {
  switch (skillType) {
    case "Normal":
      return eidolon >= 3 ? 10 : 6;
    case "BPSkill":
      return eidolon >= 3 ? 15 : 10;
    case "Ultra":
      return eidolon >= 5 ? 15 : 10;
    case "Talent":
      return eidolon >= 5 ? 15 : 10;
    case "MazeNormal":
      return 1;
    case "Maze":
      return 1;
  }
}

interface RelicProps {
  data: MihomoRelicConfig;
}
function Relic({ data }: RelicProps) {
  // NOTED: upperbound = 6
  return (
    <div className="flex">
      <Image src={img(data.icon)} alt="" width={128} height={128} />

      <div id="main" className="flex flex-col">
        Main:
        {data.main_affix?.name}
      </div>

      <div id="sub" className="flex flex-col">
        Subs:
        {data.sub_affix.map((sub, index) => (
          <div key={index}>
            {sub.name}: {sub.display} (rolled {sub.count}x)
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatTableProps {
  element: Element;
  attributes: MihomoAttributeConfig[];
  properties: MihomoPropertyConfig[];
  additions: MihomoAttributeConfig[];
}
function StatTable({
  element,
  attributes,
  properties,
  additions,
}: StatTableProps) {
  function addStat(
    attributeArray: MihomoAttributeConfig[],
    additionArray: MihomoAttributeConfig[],
    field: string,
    isPercent: boolean = false
  ): string | number {
    const inAttribute = attributeArray.find((e) => e.field == field);
    const inAddition = additionArray.find((e) => e.field == field);

    let value = 0;
    if (field == "sp_rate")
      value = 1 + (inAttribute?.value ?? 0) + (inAddition?.value ?? 0);
    else value = (inAttribute?.value ?? 0) + (inAddition?.value ?? 0);

    return isPercent ? asPercentage(value, 1) : value.toFixed(0);
  }

  return (
    <>
      {mihomoPropertyList(element).map(({ value, icon, percent }, index) => (
        <div key={index} className="flex">
          <SVG src={icon} width={32} height={32} className="text-white" />
          <div>{addStat(attributes, additions, value, percent)}</div>
        </div>
      ))}
    </>
  );
}

function mihomoPropertyList(
  element: Element
): { value: string; icon: string; percent: boolean }[] {
  const ele = {
    value: `${element.toLowerCase()}_dmg`,
    icon: `/property/Icon${
      element == "Lightning" ? "Thunder" : element
    }AddedRatio.svg`,
    percent: true,
  };
  // TODO: field for healing
  const fields = [
    { value: "hp", icon: "/property/IconMaxHP.svg", percent: false },
    { value: "atk", icon: "/property/IconAttack.svg", percent: false },
    {
      value: "def",
      icon: "/property/IconDefence.svg",
      percent: false,
    },
    { value: "spd", icon: "/property/IconSpeed.svg", percent: false },
    {
      value: "crit_rate",
      icon: "/property/IconCriticalChance.svg",
      percent: true,
    },
    {
      value: "crit_dmg",
      icon: "/property/IconCriticalDamage.svg",
      percent: true,
    },
    {
      value: "break_dmg",
      icon: "/property/IconBreakUp.svg",
      percent: true,
    },
    {
      value: "heal_rate",
      icon: "/property/IconHealRatio.svg",
      percent: true,
    },
    {
      value: "sp_rate",
      icon: "/property/IconEnergyRecovery.svg",
      percent: true,
    },
    {
      value: "effect_hit",
      icon: "/property/IconStatusProbability.svg",
      percent: true,
    },
    {
      value: "effect_res",
      icon: "/property/IconStatusResistance.svg",
      percent: true,
    },
  ];
  return [...fields, ele];
}

function SpiderChart() {}

interface LightConeSectionProps {
  data: MihomoLightConeConfig;
}
function LightConeSection({ data }: LightConeSectionProps) {
  const ratio = 902 / 1260;

  const maxLevel = data.promotion * 10 + 20;
  return (
    <div>
      <Image
        src={img(data.portrait)}
        alt=""
        width={400 * ratio}
        height={400 / ratio}
      />
      {data.name} - {data.level} / {maxLevel}
      <ImpositionIcon imposition={data.rank} />
      {data.attributes.map((attr) => (
        <div key={attr.field}>
          <Image src={img(attr.icon)} alt="" width={32} height={32} />
          {attr.display}
        </div>
      ))}
    </div>
  );
}

export { CharacterCardWrapper };
