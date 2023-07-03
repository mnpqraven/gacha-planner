import { SimpleSkill } from "@/bindings/PatchBanner";

type SkillDescriptionProps = {
  skill: SimpleSkill;
  slv: number;
};

export const SkillDescription = ({ skill, slv }: SkillDescriptionProps) => {
  const { description } = skill;

  return (
    <p className="text-justify">
      {description.map((descPart, index) => (
        <>
          <span key={index}>{descPart}</span>
          {!skill.params[slv] ? (
            <span className="font-semibold text-accent-foreground">
              {skill.params[0] && skill.params[0][index]}
            </span>
          ) : (
            <span className="font-semibold text-accent-foreground">
              {skill.params[slv][index]}
            </span>
          )}
        </>
      ))}
    </p>
  );
};
