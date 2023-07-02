import { SimpleSkill } from "@/bindings/PatchBanner";

type SkillDescriptionProps = {
  skill: SimpleSkill;
  slv: number;
};

export const SkillDescription = ({ skill, slv }: SkillDescriptionProps) => {
  const { description } = skill;

  return (
    <p>
      {description.map((descPart, index) => (
        <>
          <span key={index}>{descPart}</span>
          {!skill.params[slv] ? (
            <span className="font-semibold text-yellow-300">
              {skill.params[0] && skill.params[0][index]}
            </span>
          ) : (
            <span className="font-semibold text-yellow-300">
              {skill.params[slv][index]}
            </span>
          )}
        </>
      ))}
    </p>
  );
};