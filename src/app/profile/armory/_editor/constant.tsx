import { ChevronDown, ChevronUp, Minus, X } from "lucide-react";
import { ReactNode } from "react";

export const substatRollButtons: {
  label: string;
  icon: ReactNode;
  key: "HIGH" | "MID" | "LOW" | "NONE";
}[] = [
  {
    label: "High Roll",
    icon: <ChevronUp />,
    key: "HIGH",
  },
  {
    label: "Normal Roll",
    icon: <Minus />,
    key: "MID",
  },
  {
    label: "Low Roll",
    icon: <ChevronDown />,
    key: "LOW",
  },
  {
    label: "Remove Roll",
    icon: <X />,
    key: "NONE",
  },
];
