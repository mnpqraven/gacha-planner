import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function* range(start: number, end: number, step: number) {
  while (start <= end) {
    yield start;
    start += step;
  }
}