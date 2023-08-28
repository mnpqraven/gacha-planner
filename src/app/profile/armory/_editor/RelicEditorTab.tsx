import { UseFormReturn } from "react-hook-form";
import { ArmoryFormSchema } from "../schema";
import { useRelicSets } from "@/hooks/queries/useRelicSetList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";

interface Props {
  form: UseFormReturn<ArmoryFormSchema>;
}
export function RelicEditorTab({ form }: Props) {
  const { data: relicSets } = useRelicSets();

  const categoryMarker = ["HEAD", "HAND", "BODY", "FOOT", "OBJECT", "NECK"];

  return (
    <div className="grid grid-cols-3 gap-2">
      {categoryMarker.map((category, index) => (
        <div key={category} className="rounded-md border p-2">
          <Select>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {relicSets
                ?.filter((e) =>
                  index <= 3
                    ? e.set_skill_list.some((num) => num == 4)
                    : e.set_skill_list.every((num) => num <= 2)
                )
                .map((set) => (
                  <SelectItem key={set.set_id} value={String(set.set_id)}>
                    {set.set_name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {category}
        </div>
      ))}
    </div>
  );
}
