import { DottedPaths } from "@/lib/generics";
import { Switch } from "../Switch";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import { FormField, FormItem, FormLabel, FormControl } from "../Form";

export interface FormSwitchProps<TForm extends object>
  extends Omit<ComponentPropsWithoutRef<typeof FormField>, "render"> {
  name: DottedPaths<TForm> extends string ? DottedPaths<TForm> : string;
  label?: string | ReactNode;
}

export function FormSwitch<TForm extends object>({
  name,
  label,
  ...props
}: FormSwitchProps<TForm>) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between space-x-2">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </div>
        </FormItem>
      )}
      {...props}
    />
  );
}
