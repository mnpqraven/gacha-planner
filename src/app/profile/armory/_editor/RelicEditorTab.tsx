import { UseFormReturn } from "react-hook-form";
import { ArmoryFormSchema, RelicCategory, relicCategories } from "../schema";
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
import { SingularRelicEditor } from "./RelicEditor/SingularRelicEditor";
import { Switch } from "@/app/components/ui/Switch";
import { useImmer } from "use-immer";
import { useCardConfigController } from "../../[uid]/ConfigControllerContext";

interface Props {
  form: UseFormReturn<ArmoryFormSchema>;
}
export function RelicEditorTab({ form }: Props) {
  const { data: relicSets } = useRelicSets();
  const { data: reducerData, changeData } = useCardConfigController();
  const openState = reducerData.relicCfg.openState;

  function updateState(
    category: (typeof relicCategories)[number],
    checked: boolean
  ) {
    if (category == "HEAD")
      form.setValue("relic.HEAD.mainStat", { property: "HPDelta", value: 0 });

    if (category == "HAND")
      form.setValue("relic.HAND.mainStat", {
        property: "AttackDelta",
        value: 0,
      });
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(openState).map(([category, open], index) =>
        open ? (
          <div key={category} className="flex flex-col rounded-md border p-2">
            <FormField
              control={form.control}
              name={`relic.${category as RelicCategory}.setId`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>{category}</FormLabel>

                    <Switch
                      checked={open}
                      onCheckedChange={(checked) => {
                        updateState(category as RelicCategory, checked);
                        changeData({
                          type: "changeRelicOpenState",
                          payload: {
                            type: category as RelicCategory,
                            open: checked,
                          },
                        });
                      }}
                    />
                  </div>
                  <Select
                    defaultValue={field.value?.toString()}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
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
                          <SelectItem
                            key={set.set_id}
                            value={String(set.set_id)}
                          >
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

            {!!form.watch(`relic.${category as RelicCategory}.setId`) && (
              <SingularRelicEditor
                imageUrl={`${IMAGE_URL}icon/relic/${form.watch(
                  `relic.${category as RelicCategory}.setId`
                )}_${index % 4}.png`}
                category={category as RelicCategory}
                form={form}
              />
            )}
          </div>
        ) : (
          <div
            key={index}
            className="flex justify-between rounded-md border p-2"
          >
            <span>{category}</span>

            <Switch
              checked={open}
              onCheckedChange={(checked) => {
                updateState(category as RelicCategory, checked);
                changeData({
                  type: "changeRelicOpenState",
                  payload: { type: category as RelicCategory, open: checked },
                });
              }}
            />
          </div>
        )
      )}
    </div>
  );
}
