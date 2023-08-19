"use client";

import { useContext, useEffect } from "react";
import { CharacterInfo } from "./info_block/CharacterInfo";
import { SkillInfo } from "./skill_block/SkillInfo";
import { LightConeInfo } from "./skill_block/LightConeInfo";
import { RelicInfo } from "./relic_block/RelicInfo";
import { StatTable } from "./stat_block/StatTable";
import { SpiderChartWrapper } from "./SpiderChartWrapper";
import { useCardConfigController } from "../ConfigControllerContext";
import { img } from "@/lib/utils";
import { EidolonInfo } from "./skill_block/EidolonInfo";
import { useParams, useSearchParams } from "next/navigation";
import { useMihomoInfo } from "../_fetcher";

function CharacterCardWrapper() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") ?? "en";
  const params = useParams();
  const uid = params["uid"] as string;

  const {
    query: { data },
  } = useMihomoInfo({ uid, lang });

  const { currentCharacter, enkaRef, initResponse } = useCardConfigController();

  useEffect(() => {
    if (!!data) initResponse(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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

        <div id="block-2" className="flex flex-col gap-2">
          <div className="flex justify-evenly">
            <EidolonInfo className="w-14" />
            <LightConeInfo id="lightcone-2.1" />
          </div>

          <div className="flex justify-evenly gap-2">
            <div className="w-14" />
            <SkillInfo id="skill-2.2" />
          </div>
        </div>

        <div id="block-3" className="col-span-2 flex">
          <div className="flex grow flex-col gap-2 place-self-center">
            <SpiderChartWrapper />

            <StatTable
              id="stat-3"
              className="grid grid-cols-2"
              element={currentCharacter.element.name}
              attributes={currentCharacter.attributes}
              properties={currentCharacter.properties}
              additions={currentCharacter.additions}
            />
          </div>
          <RelicInfo id="relic-4" className="h-min place-self-center" />
        </div>
      </div>
    </div>
  );
}

export { CharacterCardWrapper };
