"use client";

import { Button, ButtonProps } from "@/app/components/ui/Button";
import { Close } from "@radix-ui/react-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useEffect,
} from "react";
import { CardConfig, initialConfig } from "./configReducer";
import { UseFormReturn, useForm } from "react-hook-form";
import { Form } from "@/app/components/ui/Form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/Sheet";
import { useAtomValue, useSetAtom } from "jotai";
import { configAtom } from "../_store";
import { FormSelect } from "@/app/components/ui/Form/FormSelect";
import { FormSwitch } from "@/app/components/ui/Form/FormSwitch";
import { FormInput } from "@/app/components/ui/Form/FormInput";

export const ConfigController = () => {
  const changeConfig = useSetAtom(configAtom);
  const form = useForm({
    defaultValues: initialConfig,
  });

  function onSubmit(payload: CardConfig) {
    changeConfig({ type: "updateWholeConfig", payload });
  }

  return (
    <Sheet
      onOpenChange={(e) => {
        if (!e) form.handleSubmit(onSubmit)();
      }}
    >
      <Tooltip>
        <SheetTrigger asChild>
          <TooltipTrigger asChild>
            <ConfigIcon className="px-2" variant="outline" />
          </TooltipTrigger>
        </SheetTrigger>

        <TooltipContent>Configure Card</TooltipContent>
      </Tooltip>

      <ConfigControllerSheet
        side="left"
        form={form}
        onFormSubmit={onSubmit}
        showSubmit={false}
      />
    </Sheet>
  );
};

interface ConfigIconProps extends ButtonProps {}
const ConfigIcon = forwardRef<HTMLButtonElement, ConfigIconProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button className={cn("", className)} {...props} ref={ref}>
        <SlidersHorizontal />
      </Button>
    );
  }
);
ConfigIcon.displayName = "ConfigIcon";

interface ConfigControllerSheetProps
  extends ComponentPropsWithoutRef<typeof SheetContent> {
  form: UseFormReturn<CardConfig>;
  onFormSubmit: (payload: CardConfig) => void;
  showSubmit?: boolean;
}

export const ConfigControllerSheet = forwardRef<
  ElementRef<typeof SheetContent>,
  ConfigControllerSheetProps
>(({ onFormSubmit, form, showSubmit = true, ...props }, ref) => {
  const verbosityOptions = [
    { value: "none", label: "None" },
    { value: "simple", label: "Simple" },
    { value: "detailed", label: "Detailed" },
  ];
  type Options = (typeof verbosityOptions)[number];

  const { uid, name } = useAtomValue(configAtom);

  useEffect(() => {
    if (!!uid) form.setValue("uid", uid);
    if (!!name) form.setValue("name", name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, name]);

  return (
    <SheetContent ref={ref} {...props}>
      <SheetHeader className="mb-4">
        <SheetTitle>Display Setting</SheetTitle>
        <SheetDescription>
          Show or hide various elements in the character card
        </SheetDescription>
      </SheetHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <div className="flex flex-col gap-4">
            <FormSwitch<CardConfig>
              name="showPlayerInfo"
              label="Show player info"
            />
            <FormSwitch<CardConfig>
              name="showBaseUrl"
              label="Show Website URL"
            />
            <FormSelect<Options, CardConfig>
              name="hoverVerbosity"
              label="Hover info"
              options={verbosityOptions}
              valueAccessor={(item) => item.value}
              labelAccessor={(item) => item.label}
              className="w-32 gap-2"
            />
            <FormInput<CardConfig>
              name="name"
              label="Player Name"
              className="w-32"
            />
            <FormInput<CardConfig>
              name="uid"
              label="Player UID"
              className="w-32"
            />
          </div>

          {showSubmit && (
            <SheetFooter className="mt-4">
              <Close asChild>
                <Button type="submit">Save Changes</Button>
              </Close>
            </SheetFooter>
          )}
        </form>
      </Form>
    </SheetContent>
  );
});
ConfigControllerSheet.displayName = "ConfigControllerDialog";
