import { UseFormReturn } from "react-hook-form";
import { ArmoryFormSchema, relicCategories } from "../schema";
import { useRelicSets } from "@/hooks/queries/useRelicSetList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/components/ui/Form";
import Image from "next/image";
import { IMAGE_URL } from "@/lib/constants";

interface Props {
  form: UseFormReturn<ArmoryFormSchema>;
}
export function RelicEditorTab({ form }: Props) {
  const { data: relicSets } = useRelicSets();

  return (
    <div className="grid grid-cols-2 gap-2">
      {relicCategories.map((category, index) => (
        <div key={category} className="flex flex-col rounded-md border p-2">
          <FormField
            control={form.control}
            name={`relic.${category}.setId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{category}</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        id="wtf"
                        className="overflow-hidden text-ellipsis"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {relicSets
                      ?.filter((e) =>
                        index <= 3
                          ? e.set_skill_list.some((num) => num == 4)
                          : e.set_skill_list.every((num) => num <= 2)
                      )
                      .map((set) => (
                        <SelectItem key={set.set_id} value={String(set.set_id)}>
                          <div className="flex items-center gap-2">
                            <Image
                              src={`${IMAGE_URL}icon/relic/${set.set_id}.png`}
                              alt=""
                              height={32}
                              width={32}
                            />

                            {set.set_name}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {!!form.watch(`relic.${category}.setId`) && (
            <div className="flex">
              <Image
                src={`${IMAGE_URL}icon/relic/${form.watch(
                  `relic.${category}.setId`
                )}_${index % 4}.png`}
                alt=""
                height={128}
                width={128}
                className="h-32 w-32"
              />

              <div className="flex flex-col">
                <span>Mainstat</span>
                <span>Substat</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
