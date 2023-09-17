import { UseFormReturn } from "react-hook-form";
import { Path } from "@/bindings/AvatarConfig";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/components/ui/Dialog";
import { Button } from "@/app/components/ui/Button";
import { useLightConeList } from "@/hooks/queries/useLightConeList";
import Image from "next/image";
import { IMAGE_URL } from "@/lib/constants";
import { Toggle } from "@/app/components/ui/Toggle";
import { useState } from "react";
import { ArmoryFormSchema } from "../schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/components/ui/Form";
import { Input } from "@/app/components/ui/Input";
import { useLightConeMetadata } from "@/hooks/queries/useLightConeMetadata";
import { EquipmentConfig } from "@/bindings/EquipmentConfig";
import { useCardConfigController } from "../../[uid]/ConfigControllerContext";

interface Props {
  form: UseFormReturn<ArmoryFormSchema>;
  path: Path | undefined;
}
export function LightConeEditorTab({ form, path }: Props) {
  const { changeData } = useCardConfigController();
  const { lightConeList } = useLightConeList();
  const { lightCone } = useLightConeMetadata(form.watch("lc.id"));

  const lcSelected = !!form.getValues("lc");

  const [open, setOpen] = useState(false);

  function onSelectLightCone(lc: EquipmentConfig) {
    form.setValue("lc", {
      id: lc.equipment_id,
      level: form.getValues("lc.level") ?? 1,
      ascension: form.getValues("lc.ascension") ?? 0,
      imposition: form.getValues("lc.imposition") ?? 1,
    });
    changeData({ type: "changeLightConeId", payload: lc.equipment_id });
    setOpen(false);
  }
  return (
    <div>
      <span>{path}</span>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Change Light Cone</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <div className="grid grid-cols-4">
            {lightConeList
              .sort(
                (a, b) =>
                  b.rarity - a.rarity ||
                  a.equipment_name.localeCompare(b.equipment_name)
              )
              .filter((e) => e.avatar_base_type === path)
              .map((lc) => (
                <Toggle
                  key={lc.equipment_id}
                  className="flex h-fit justify-between py-2"
                  onPressedChange={() => onSelectLightCone(lc)}
                >
                  <Image
                    src={`${IMAGE_URL}image/light_cone_preview/${lc.equipment_id}.png`}
                    alt={lc.equipment_name}
                    width={256}
                    height={300}
                    className="aspect-[256/300] w-16"
                  />
                  <span>{lc.equipment_name}</span>
                </Toggle>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      {lcSelected && (
        <>
          <FormField
            control={form.control}
            name="lc.level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <Input
                    className="w-16"
                    autoComplete="off"
                    type="number"
                    {...field}
                    min={1}
                    max={form.getValues("lc.ascension") * 10 + 20}
                    onChange={(e) => {
                      if (!Number.isNaN(e.currentTarget.value)) {
                        field.onChange(Number(e.currentTarget.value));
                      } else e.preventDefault();
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lc.ascension"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ascension</FormLabel>
                <FormControl>
                  <Input
                    className="w-16"
                    autoComplete="off"
                    type="number"
                    {...field}
                    min={0}
                    max={6}
                    onChange={(e) => {
                      if (!Number.isNaN(e.currentTarget.value)) {
                        field.onChange(Number(e.currentTarget.value));
                      } else e.preventDefault();
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lc.imposition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imposition</FormLabel>
                <FormControl>
                  <Input
                    className="w-16"
                    autoComplete="off"
                    type="number"
                    {...field}
                    min={1}
                    max={5}
                    onChange={(e) => {
                      if (!Number.isNaN(e.currentTarget.value)) {
                        field.onChange(Number(e.currentTarget.value));
                      } else e.preventDefault();
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      )}
      <div>{lightCone?.equipment_name}</div>
    </div>
  );
}
