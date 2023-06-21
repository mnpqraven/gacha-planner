import { SkillType } from "@/bindings/PatchBanner";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function* range(start: number, end: number, step: number) {
  while (start <= end) {
    yield start;
    start += step;
  }
}

export function parseSkillType(ttype: SkillType) {
  switch (ttype) {
    case "Normal":
      return "Attack";
    case "BPSkill":
      return "Skill";
    case "Ultra":
      return "Ultimate";
    case "Talent":
      return "Talent";
    case "MazeNormal":
      return "Attack";
    case "Maze":
      return "Technique";
  }
}
