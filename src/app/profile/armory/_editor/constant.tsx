import { ChevronDown, ChevronUp, Minus, X } from "lucide-react";
import { ReactNode } from "react";

export const substatRollButtons: {
  label: string;
  icon: ReactNode;
  key: "HIGH" | "MID" | "LOW" | "NONE";
}[] = [
  {
    label: "High key",
    icon: <ChevronUp />,
    key: "HIGH",
  },
  {
    label: "Normal key",
    icon: <Minus />,
    key: "MID",
  },
  {
    label: "Low key",
    icon: <ChevronDown />,
    key: "LOW",
  },
  {
    label: "Remove key",
    icon: <X />,
    key: "NONE",
  },
];
