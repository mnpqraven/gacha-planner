import { SkillType } from "@/bindings/AvatarSkillConfig";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function* range(start: number, end: number, step: number = 1) {
  while (start <= end) {
    yield start;
    start += step;
  }
}

export function parseSkillType(
  skillType: SkillType | undefined | null,
  fallbackSkillDesc: string
) {
  if (skillType)
    switch (skillType) {
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
  else
    switch (fallbackSkillDesc) {
      case "Basic ATK":
        return "Attack";
      case "Skill":
        return "BPSkill";
      case "Ultra":
        return "Ultimate";
      case "Talent":
        return "Talent";
      case "Technique":
        return "Technique";
    }
  return "";
}

export function sanitizeNewline(data?: string) {
  if (!data) return "";
  return data.replaceAll("\\n", "\n");
}

/**
 * This function removes trailing zeroes if it's a whole number (eg. 18.00)
 * Otherwise a float percent with n decimals is returned
 * @param fixed amount of decimals, defaults to 2
 * undefined number will return '0 %'
 */
export function asPercentage(data: number | undefined, fixed?: number): string {
  if (!data) return "0 %";
  else {
    return Number(`${(data * 100).toFixed(fixed ?? 2)}`).toString() + " %";
  }
}

/**
 * If 2 Javascript Date objects has the same date, ignoring its hours,
 * minutes and seconds
 */
export function sameDate(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

const IMG_REPO = "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master";
export const img = (suffix: string) =>
  suffix.startsWith("/") ? IMG_REPO + suffix : IMG_REPO + "/" + suffix;

/**
 * this function rotates your array and shift the elements around
 * @param by number of rotations, positive number is clockwise (left shift),
 * negative number is ccw (right shift)
 * @param data any abitrary array, if the array is empty then it's directly
 * returned
 * @returns rotated array
 */
export function rotate<T>(by: number, data: T[]): T[] {
  if (data.length == 0) return data;
  if (by == 0) return data;
  if (by < 0) {
    let temp = data;
    for (let index = 0; index < by * -1; index++) {
      temp.push(temp.shift()!);
    }
    return temp;
  } else {
    let temp = data;
    for (let index = 0; index < by; index++) {
      temp.unshift(temp.pop()!);
    }
    return temp;
  }
}

export function keepPreviousData<T>(data: T | undefined): T | undefined {
  return data;
}
