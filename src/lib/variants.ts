import { cva } from "class-variance-authority";

export const elementVariant = cva("", {
  variants: {
    border: {
      Fire: "border-fire",
      Ice: "border-ice",
      Wind: "border-wind",
      Lightning: "border-lightning",
      Physical: "border-physical",
      Quantum: "border-quantum",
      Imaginary: "border-imaginary",
    },
  },
});
