import { ParameterizedDescription } from "@/bindings/SkillTreeConfig";
import { Fragment } from "react";

type SkillDescriptionProps = {
  skillDesc: ParameterizedDescription;
  paramList: string[][] | string[];
  slv: number;
};

export const SkillDescription = ({
  skillDesc,
  paramList,
  slv,
}: SkillDescriptionProps) => {
  // for depth of 2, flatten once
  const currentParam = Array.isArray(paramList[0]) ? paramList[slv] : paramList;

  return (
    <p className="text-justify">
      {skillDesc.map((descPart, index) => (
        <Fragment key={index}>
          <span>{descPart}</span>
          <span className="font-semibold text-accent-foreground">
            {currentParam[index]}
          </span>
        </Fragment>
      ))}
    </p>
  );
};
