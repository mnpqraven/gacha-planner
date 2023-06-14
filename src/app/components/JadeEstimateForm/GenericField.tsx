import ENDPOINT from "@/server/endpoints";
import { FieldPath, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FieldPath } from "react-hook-form";

import * as F from "../ui/Form";
import * as S from "../ui/Select";

type FormType = UseFormReturn<
  z.infer<(typeof ENDPOINT)["jadeEstimate"]["payload"]>
>;
type Props = {
  form: UseFormReturn<FormType>;
  fieldData: {
    label: JSX.Element;
    description: JSX.Element;
    options: { value: string; label: string }[];
  };
  formIndex: FieldPath<FormType>;
};
const BattlePassField = ({ form, fieldData, formIndex }: Props) => {
  return (
    <F.FormField
      control={form.control}
      name={formIndex}
      render={({ field }) => (
        <F.FormItem>
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <F.FormLabel>{fieldData.label}</F.FormLabel>
              <F.FormDescription>{fieldData.description}</F.FormDescription>
            </div>
            <S.Select onValueChange={field.onChange} defaultValue={field.value}>
              <F.FormControl>
                <S.SelectTrigger className="w-fit">
                  <S.SelectValue />
                </S.SelectTrigger>
              </F.FormControl>
              <S.SelectContent>
                {fieldData.opts.map(({value, label}) => (
                  <S.SelectItem value={value} key={value}>
                    {label}
                  </S.SelectItem>
                ))}
              </S.SelectContent>
            </S.Select>
            <F.FormMessage />
          </div>
        </F.FormItem>
      )}
    />
  );
};
