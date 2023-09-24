import { DottedPaths } from "@/lib/generics";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../Select";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import { FormField, FormItem, FormLabel, FormControl } from "../Form";

export interface FormSelectProps<TOptions, TForm extends object>
  extends Omit<ComponentPropsWithoutRef<typeof FormField>, "render"> {
  name: DottedPaths<TForm> extends string ? DottedPaths<TForm> : string;
  options: TOptions[];
  valueAccessor: (value: TOptions) => string;
  labelAccessor: ((value: TOptions) => ReactNode) | ReactNode;
  label?: string | ReactNode;
  placeholder?: string;
  className?: string;
}

export function FormSelect<TOptions, TForm extends object>({
  name,
  label,
  options,
  labelAccessor,
  valueAccessor,
  className,
  ...props
}: FormSelectProps<TOptions, TForm>) {
  return (
    <FormField
      name={name as string}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between space-x-2">
            {label && <FormLabel>{label}</FormLabel>}
            <Select defaultValue={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className={className}>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>

              <SelectContent position="popper">
                {options.map((item, index) => (
                  <SelectItem key={index} value={valueAccessor(item)}>
                    {typeof labelAccessor === "function"
                      ? labelAccessor(item)
                      : labelAccessor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FormItem>
      )}
      {...props}
    />
  );
}
