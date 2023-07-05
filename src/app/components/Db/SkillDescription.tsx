interface SkillDescriptionProps {
  description: string[];
  /**
   * list of params
   * NOTE: this has a depth of 2 aka. listing params of all skill/superimpose
   * levels
   * */
  params: string[][];
  /**
   * Skill level for Skill or Superimpose level for LCs
   * */
  slv: number;
}

export const SkillDescription = ({
  description,
  params,
  slv,
}: SkillDescriptionProps) => {
  return (
    <p className="text-justify">
      {description.map((descPart, index) => (
        <>
          <span key={index}>{descPart}</span>
          {!params[slv] ? (
            <span className="font-semibold text-accent-foreground">
              {params[0] && params[0][index]}
            </span>
          ) : (
            <span className="font-semibold text-accent-foreground">
              {params[slv][index]}
            </span>
          )}
        </>
      ))}
    </p>
  );
};
