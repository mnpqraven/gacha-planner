"use client";

import { Button, ButtonProps } from "@/app/components/ui/Button";
import { Close } from "@radix-ui/react-dialog";
import { Switch } from "@/app/components/ui/Switch";
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
  HTMLAttributes,
  ReactNode,
  forwardRef,
} from "react";
import { CardConfig, initialConfig } from "./configReducer";
import { UseFormReturn, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/components/ui/Form";
import { DottedPaths } from "@/lib/generics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";
import { useCardConfigController } from "./ConfigControllerContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/Sheet";

export const ConfigController = () => {
  const { changeConfig } = useCardConfigController();
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
            <FormSelect<(typeof verbosityOptions)[number], CardConfig>
              name="hoverVerbosity"
              label="Hover info"
              options={verbosityOptions}
              valueAccessor={(item) => item.value}
              labelAccessor={(item) => item.label}
              className="w-28 gap-2"
            />
            <FormSwitch<CardConfig>
              name="showBaseUrl"
              label="Show Website URL"
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

interface FormSwitchProps<TForm extends object>
  extends Omit<ComponentPropsWithoutRef<typeof FormField>, "render"> {
  name: DottedPaths<TForm> extends string ? DottedPaths<TForm> : string;
  label?: string | ReactNode;
}
function FormSwitch<TForm extends object>({
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

interface FormSelectProps<TOptions, TForm extends object>
  extends Omit<ComponentPropsWithoutRef<typeof FormField>, "render"> {
  name: DottedPaths<TForm> extends string ? DottedPaths<TForm> : string;
  options: TOptions[];
  valueAccessor: (value: TOptions) => string;
  labelAccessor: ((value: TOptions) => ReactNode) | ReactNode;
  label?: string | ReactNode;
  placeholder?: string;
  className?: string;
}
function FormSelect<TOptions, TForm extends object>({
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
