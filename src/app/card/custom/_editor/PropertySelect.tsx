import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";
import { Property } from "@/bindings/RelicSubAffixConfig";
import { propertyIconUrl, propertyName } from "@/lib/propertyHelper";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import SVG from "react-inlinesvg";

interface Props extends ComponentPropsWithoutRef<typeof SelectContent> {
  options: Property[];
  onValueChange: (value: Property) => void;
  itemDisabled?: (prop: Property) => boolean;
  defaultValue?: string;
  value?: string;
}

export const PropertySelect = forwardRef<HTMLDivElement, Props>(
  (
    {
      onValueChange,
      options,
      className,
      itemDisabled,
      defaultValue,
      value,
      ...props
    },
    ref
  ) => {
    return (
      <Select
        onValueChange={(e) => onValueChange(e as Property)}
        defaultValue={defaultValue}
        value={value ?? ""}
      >
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
