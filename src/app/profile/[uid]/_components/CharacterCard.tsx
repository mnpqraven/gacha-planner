"use client";

import { useContext, useEffect } from "react";
import { img } from "../../page";
import { MihomoResponse } from "../../types";
import { CharacterInfo } from "./info_block/CharacterInfo";
import { SkillInfo } from "./skill_block/SkillInfo";
import { LightConeInfo } from "./skill_block/LightConeInfo";
import { RelicInfo } from "./relic_block/RelicInfo";
import { StatTable } from "./stat_block/StatTable";
import { SpiderChart } from "./SpiderChart";
import { CardConfigContext } from "../ConfigControllerContext";

interface Props {
  data: MihomoResponse;
}
function CharacterCardWrapper({ data }: Props) {
  const { currentCharacter, setPlayer, enkaRef } =
    useContext(CardConfigContext);

  useEffect(() => {
    if (data.player) setPlayer(data.player);
  }, [data.player, setPlayer]);

  if (!currentCharacter) return null;

  const { preview } = currentCharacter;

  return (
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
          className="absolute top-11 flex h-[512px] w-[374px] items-center"
          style={{
            backgroundImage: `url(${img(preview)})`,
            boxShadow: "0 0 10px 10px hsl(var(--background)) inset",
          }}
        ></div>

        <CharacterInfo id="block-1" className="z-10" />

        <div id="block-2" className="flex gap-2">
          <LightConeInfo id="lightcone-2.1" />
          <SkillInfo id="skill-2.2" />
        </div>

        <div id="block-3" className="col-span-2 flex h-fit">
          <div className="flex grow flex-col">
            <SpiderChart />

            <StatTable
              id="stat-3"
              element={currentCharacter.element.name}
              attributes={currentCharacter.attributes}
              properties={currentCharacter.properties}
              additions={currentCharacter.additions}
            />
          </div>
          <RelicInfo id="relic-4" className="h-min" />
        </div>
      </div>
    </div>
  );
}

export { CharacterCardWrapper };
