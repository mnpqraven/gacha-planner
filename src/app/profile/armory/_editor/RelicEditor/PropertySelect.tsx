import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";
import { Property } from "@/bindings/RelicSubAffixConfig";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import SVG from "react-inlinesvg";
import { propertyIconUrl, propertyName } from "../relicConfig";

type SelectProps = ComponentPropsWithoutRef<typeof Select>;

interface Props extends ComponentPropsWithoutRef<typeof SelectContent> {
  options: Property[];
  onValueChange: SelectProps["onValueChange"];
  itemDisabled?: (prop: Property) => boolean;
}

export const PropertySelect = forwardRef<HTMLDivElement, Props>(
  (
    { onValueChange, options, className, itemDisabled, ...props },
    ref
  ) => {
    return (
      <Select onValueChange={onValueChange}>
        <SelectTrigger className={className}>
          <SelectValue />
        </SelectTrigger>

        <SelectContent {...props} ref={ref}>
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              disabled={!itemDisabled ? false : itemDisabled(option)}
            >
              <div className="flex items-center gap-2">
                <SVG src={propertyIconUrl(option)} width={24} height={24} />

                <span>{propertyName(option)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);
PropertySelect.displayName = "PropertySelect ";
