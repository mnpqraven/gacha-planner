"use client";

import { Button, ButtonProps } from "@/app/components/ui/Button";
import { Close } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/Dialog";
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
  ReactNode,
  forwardRef,
} from "react";
import { CardConfig, initialConfig } from "./configReducer";
import { useForm } from "react-hook-form";
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

interface Props extends ButtonProps {}
export const ConfigController = forwardRef<HTMLButtonElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className={cn("px-2", className)} ref={ref} {...props}>
            <SlidersHorizontal />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Configure Card</TooltipContent>
      </Tooltip>
    );
  }
);
ConfigController.displayName = "ConfigController";

export const ConfigControllerDialog = forwardRef<
  ElementRef<typeof DialogContent>,
  ComponentPropsWithoutRef<typeof DialogContent>
>(({ ...props }, ref) => {
  const form = useForm({
    defaultValues: initialConfig,
  });
  const { changeConfig } = useCardConfigController();

  const verbosityOptions = [
    { value: "none", label: "None" },
    { value: "simple", label: "Simple" },
    { value: "detailed", label: "Detailed" },
  ];

  function onSubmit(payload: CardConfig) {
    changeConfig({ type: "updateWholeConfig", payload });
  }

  return (
    <DialogContent ref={ref} {...props}>
      <DialogHeader>
        <DialogTitle>Display Setting</DialogTitle>
        <DialogDescription>
          Show or hide various elements in the character card
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 items-center gap-4">
            <FormSwitch<CardConfig>
              name="showPlayerInfo"
              label="Show player info"
            />
            <FormSwitch<CardConfig>
              name="showStatName"
              label="Show stat name"
            />
            <FormSwitch<CardConfig>
              name="statTableConfig.showEmptyStat"
              label="Show empty stat"
            />
            <FormSelect<(typeof verbosityOptions)[number], CardConfig>
              name="hoverVerbosity"
              label="Hover info"
              options={verbosityOptions}
              valueAccessor={(item) => item.value}
              labelAccessor={(item) => item.label}
              className="w-28 gap-2"
            />
          </div>

          <DialogFooter className="mt-4">
            <Close asChild>
              <Button type="submit">Save Changes</Button>
            </Close>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
});
ConfigControllerDialog.displayName = "ConfigControllerDialog";

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
