"use client";

import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/Form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/Popover";
import { Button } from "../../components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { Calendar } from "../../components/ui/Calendar";
import { useContext, useEffect, useState } from "react";
import { dateToISO, objToDate } from "../../components/schemas";
import { useFuturePatchDateList } from "@/hooks/queries/useFuturePatchDate";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog,
} from "../../components/ui/Command";
import equal from "fast-deep-equal/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import STORAGE from "@/server/storage";
import { useFuturePatchBannerList } from "@/hooks/queries/useFuturePatchBanner";
import { CalendarFooter } from "./CalendarFooter";
import { CurrentRollTab } from "./CurrentRollTab";
import { RailPassField } from "./RailPassField";
import { BattlePassField } from "./BattlePassField";
import { Switch } from "../../components/ui/Switch";
import { PartialMessage } from "@bufbuild/protobuf";
import {
  BattlePassType,
  EqTier,
  JadeEstimateCfg,
  Server,
} from "@grpc/jadeestimate_pb";
import { JadeEstimateFormContext } from "@/app/jade-estimate/formProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import { useToast } from "@/app/components/ui/Toast/useToast";
import { ToastAction } from "@/app/components/ui/Toast/Toast";

type Props = {
  submitButton?: boolean;
};

type FormSchema = PartialMessage<JadeEstimateCfg>;

export const defaultValues: PartialMessage<JadeEstimateCfg> = {
  server: Server.America,
  untilDate: dateToISO.parse(new Date()),
  battlePass: { battlePassType: BattlePassType.None, currentLevel: 0 },
  railPass: {
    useRailPass: false,
    daysLeft: 30,
  },
  eq: EqTier.Zero,
  moc: 0,
  mocCurrentWeekDone: true,
  currentRolls: 0,
};

export default function JadeEstimateForm({ submitButton = false }: Props) {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [uncontrolledDate, setUncontrolledDate] = useState<Date>(new Date());
  const [monthController, setMonthController] = useState<Date | undefined>(
    uncontrolledDate
  );
  const [savedFormData, setSavedFormData] = useLocalStorage<
    FormSchema | undefined
  >(STORAGE.jadeEstimateForm, undefined);

  // keybinds for jumper
  const [open, setOpen] = useState(false);

  const { futurePatchDateList } = useFuturePatchDateList();
  const { futurePatchBannerList } = useFuturePatchBannerList();
  const { updateForm } = useContext(JadeEstimateFormContext);

  // FORM SETUP
  const form = useForm<JadeEstimateCfg>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const debounceOnChange = useDebounce(form.handleSubmit(onSubmit), 300);
  const untilDateSubscription = form.watch("untilDate");

  useEffect(() => {
    const { success } = schema.safeParse(savedFormData);
    if (!mounted && savedFormData && !success) {
      toast({
        title: "Outdated Local Cache",
        description:
          "The local cache seems to be outdated, this is usually due to an update to the website, if you are seeing this please either do a hard reload with Ctrl + Shift + R or click the 'Reload' button.",
        action: (
          <ToastAction
            altText="Reload"
            onClick={() => {
              setSavedFormData(defaultValues);
              form.reset(defaultValues);
            }}
          >
            Reload
          </ToastAction>
        ),
      });
      setMounted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, savedFormData]);

  useEffect(() => {
    debounceOnChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [untilDateSubscription]);

  useEffect(() => {
    if (savedFormData) {
      form.reset(savedFormData);

      {
        // update date states for calendar footer
        const updatedDate = objToDate.parse(savedFormData.untilDate);
        setUncontrolledDate(updatedDate);
        setMonthController(updatedDate);
      }
      updateForm(savedFormData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedFormData]);

  function onSubmit(values: FormSchema) {
    // NOTE: this deep check is importnant
    if (!equal(values, defaultValues) && !equal(values, savedFormData)) {
      setSavedFormData(values);
    }
  }

  function onSelectDatePreset(date: string) {
    // today
    if (date === "0") {
      let nextDate = new Date();
      setUncontrolledDate(nextDate);
      setMonthController(nextDate);
    } else {
      setUncontrolledDate(new Date(date));
      setMonthController(new Date(date));
    }
    setOpen(false);
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "c" && (e.altKey || e.metaKey)) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        onChange={debounceOnChange}
      >
        <FormField
          control={form.control}
          name="untilDate"
          render={({ field: dateField }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <FormLabel>Goal Date</FormLabel>
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  <FormDescription>The date that you'll pull</FormDescription>
                  <FormMessage />
                </div>
                <div className="flex flex-col gap-4 lg:flex-row">
                  <FormField
                    control={form.control}
                    name="server"
                    render={({ field: serverField }) => (
                      <FormItem>
                        <Select
                          onValueChange={(data) => {
                            const asInt = parseInt(data);
                            serverField.onChange(asInt);
                          }}
                          defaultValue="0"
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={String(Server.Asia)}>
                              {Server[Server.Asia]}
                            </SelectItem>
                            <SelectItem value={String(Server.America)}>
                              {Server[Server.America]}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-fit pl-3 text-left font-normal",
                            !dateField.value && "text-muted-foreground"
                          )}
                        >
                          {dateField.value ? (
                            format(objToDate.parse(dateField.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="flex w-auto flex-col space-y-2 p-2"
                      align="start"
                    >
                      <Button
                        variant={"outline"}
                        className="justify-between"
                        onClick={() => setOpen(true)}
                      >
                        <span>Jump to ...</span>
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                          <span className="text-xs">⌘/Alt + C</span>
                        </kbd>
                      </Button>
                      <CommandDialog open={open} onOpenChange={setOpen}>
                        <CommandInput placeholder="Click on a result or search..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => onSelectDatePreset("0")}
                            >
                              Today
                            </CommandItem>
                            {futurePatchDateList.list.map((e) => (
                              <CommandItem
                                key={e.version}
                                onSelect={() => onSelectDatePreset(e.dateStart)}
                              >
                                {e.name} - {new Date(e.dateStart).getUTCDate()}/
                                {new Date(e.dateStart).getUTCMonth() + 1}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </CommandDialog>

                      <Calendar
                        className="py-0"
                        mode="single"
                        selected={uncontrolledDate}
                        onSelect={(e) => {
                          if (e) {
                            setUncontrolledDate(e);
                            dateField.onChange(dateToISO.parse(e));
                          }
                        }}
                        disabled={beforeToday}
                        month={monthController}
                        onMonthChange={setMonthController}
                        modifiers={{
                          patchStart: futurePatchDateList.list.map(
                            (e) => new Date(e.dateStart)
                          ),
                          patchBanner: futurePatchBannerList.list.map(
                            (e) => new Date(e.dateStart)
                          ),
                        }}
                        modifiersStyles={{
                          patchStart: {
                            fontWeight: "bold",
                            border: "1px dashed green",
                          },
                          patchBanner: {
                            fontWeight: "bold",
                            textDecorationLine: "underline",
                            textUnderlinePosition: "under",
                          },
                        }}
                        footer={<CalendarFooter date={uncontrolledDate} />}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </FormItem>
          )}
        />
        <RailPassField form={form} />
        <BattlePassField form={form} />
        <FormField
          control={form.control}
          name="eq"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <FormLabel>Equilibrum Level</FormLabel>
                  <FormDescription>
                    You get more rewards the higher your Equilibrum level is
                  </FormDescription>
                </div>
                <Select
                  value={String(form.watch("eq"))}
                  onValueChange={(data) => {
                    const asInt = parseInt(data);
                    field.onChange(asInt);
                  }}
                  defaultValue="0"
                >
                  <FormControl>
                    <SelectTrigger className="w-fit">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={String(EqTier.Zero)}>
                      0 (TL 20-)
                    </SelectItem>
                    <SelectItem value={String(EqTier.One)}>
                      1 (TL 20+)
                    </SelectItem>
                    <SelectItem value={String(EqTier.Two)}>
                      2 (TL 30+)
                    </SelectItem>
                    <SelectItem value={String(EqTier.Three)}>
                      3 (TL 40+)
                    </SelectItem>
                    <SelectItem value={String(EqTier.Four)}>
                      4 (TL 50+)
                    </SelectItem>
                    <SelectItem value={String(EqTier.Five)}>
                      5 (TL 60+)
                    </SelectItem>
                    <SelectItem value={String(EqTier.Six)}>
                      6 (TL 65+)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="moc"
            render={({ field }) => (
              <FormItem>
                <div className="flex h-full space-x-4 rounded-md border p-4">
                  <div className="flex-1 space-y-1">
                    <FormLabel>Memory of Chaos</FormLabel>
                    <FormDescription>
                      Amount of stars you can clear in a MoC cycle
                    </FormDescription>
                  </div>
                  <Select
                    onValueChange={(e) => field.onChange(Number(e))}
                    value={String(form.watch("moc"))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-fit place-self-center">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mocStars().map((value) => (
                        <SelectItem value={String(value)} key={value}>
                          {value} ✦
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mocCurrentWeekDone"
            render={({ field }) => (
              <FormItem>
                <div className="flex h-full space-x-4 rounded-md border p-4">
                  <div className="flex-1 space-y-1">
                    <FormLabel>Current Cycle Completed</FormLabel>
                    <FormDescription>
                      Whether you have completed the current MoC cycle
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      className="place-self-center"
                      onCheckedChange={field.onChange}
                      checked={field.value}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>
        <CurrentRollTab form={form} />
        {submitButton && <Button type="submit">Calculate</Button>}
      </form>
    </Form>
  );
}

function beforeToday(date: Date): boolean {
  const b = new Date();
  b.setHours(0);
  b.setMinutes(0);
  b.setSeconds(0);
  b.setMilliseconds(0);
  return date < b;
}

function* range(start: number, end: number, step: number) {
  while (start <= end) {
    yield start;
    start += step;
  }
}
function mocStars(): number[] {
  return Array.from(range(0, 30, 3));
}
