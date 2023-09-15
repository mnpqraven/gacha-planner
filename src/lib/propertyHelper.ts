import { Property } from "@/bindings/SkillTreeConfig";

export function isPropertyPercent(property: Property) {
  return !property.endsWith("Delta");
}

export function propertyIconUrl(property: Property) {}

export function prettyProperty(property: Property, value: number) {
  return {
    label: "",
    value: "",
  };
}
