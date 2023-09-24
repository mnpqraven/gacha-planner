import { DottedPaths } from "@/lib/generics";
import { Input, InputProps } from "../Input";
import { ReactNode } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../Form";

export interface FormInputProps<TForm extends object> extends InputProps {
  name: DottedPaths<TForm> extends string ? DottedPaths<TForm> : string;
  label?: string | ReactNode;
}
export function FormInput<TForm extends object>({
  name,
  label,
  ...props
}: FormInputProps<TForm>) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between space-x-2">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input {...props} {...field} />
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  );
}
