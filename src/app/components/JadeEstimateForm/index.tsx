import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { workerFetch } from "@/server/fetchHelper";
import ENDPOINT from "@/server/endpoints";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Button } from "../ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Calendar } from "../ui/Calendar";
import { useEffect, useState } from "react";
import { dateToISO, objToDate } from "../schemas";
import { useFuturePatchDateList } from "@/hooks/queries/useFuturePatchDate";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog,
} from "../ui/Command";
import equal from "fast-deep-equal/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import STORAGE from "@/server/storage";
import { useFuturePatchBannerList } from "@/hooks/queries/useFuturePatchBanner";
import { CalendarFooter } from "./CalendarFooter";
import { CurrentRollTab } from "./CurrentRollTab";
import { RailPassField } from "./RailPassField";
import { BattlePassField } from "./BattlePassField";
import { Switch } from "../ui/Switch";

type Props = {
  submitButton?: boolean;
  updateTable: (to: z.infer<typeof ENDPOINT.jadeEstimate.response>) => void;
};

type FormSchema = z.infer<(typeof ENDPOINT)["jadeEstimate"]["payload"]>;

export const defaultFormValues: FormSchema = {
  server: "America",
  untilDate: dateToISO.parse(new Date()),
  battlePass: { battlePassType: "None", currentLevel: 0 },
  railPass: {
    useRailPass: false,
    daysLeft: 30,
  },
  eq: "Zero",
  moc: 0,
  mocCurrentWeekDone: true,
  currentRolls: 0,
};

export default function JadeEstimateForm({
  updateTable,
  submitButton = false,
}: Props) {
  const [uncontrolledDate, setUncontrolledDate] = useState<Date | undefined>(
    new Date()
  );
  const [monthController, setMonthController] = useState<Date | undefined>(
    uncontrolledDate
  );
  const [savedFormData, setSavedFormData] = useLocalStorage<
    FormSchema | undefined
  >(STORAGE.jadeEstimateForm, undefined);
  const [uncontrolledQueryPayload, setUncontrolledQueryPayload] =
    useState(defaultFormValues);

  const { futurePatchDateList } = useFuturePatchDateList();
  const { futurePatchBannerList } = useFuturePatchBannerList();

  // FORM SETUP
  const form = useForm<FormSchema>({
    resolver: zodResolver(ENDPOINT.jadeEstimate.payload),
    defaultValues: defaultFormValues,
  });
  const debounceOnChange = useDebounce(form.handleSubmit(onSubmit), 300);
  const untilDateSubscription = form.watch("untilDate");

  const { data } = useQuery({
    queryKey: ["jadeEstimate", uncontrolledQueryPayload],
    queryFn: async () =>
      await workerFetch(ENDPOINT.jadeEstimate, {
        payload: uncontrolledQueryPayload,
        method: "POST",
      }),
  });

  useEffect(() => {
    debounceOnChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [untilDateSubscription]);

  useEffect(() => {
    if (savedFormData) {
      form.reset(savedFormData);
      const updatedDate = objToDate.parse(savedFormData.untilDate);
      setUncontrolledDate(updatedDate);
      setMonthController(updatedDate);
      setUncontrolledQueryPayload(savedFormData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedFormData]);

  useEffect(() => {
    if (data) updateTable(data);
  }, [data, updateTable]);

  function onSubmit(values: FormSchema) {
    if (!equal(values, defaultFormValues)) {
      // console.log("onSubmit", values);
      // NOTE: this deep check is importnant
      if (!equal(savedFormData, values)) setSavedFormData(values);
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

  function preventMinus(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === "Minus") e.preventDefault();
  }

  // keybinds for jumper
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "c" && (e.altKey || e.metaKey)) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const eqField = {
    label: "Equilibrum Level",
    description: "You get more rewards the higher your Equilibrum level is",
    options: [
      { value: "Zero", label: "0 (TL 20-)" },
      { value: "One", label: "1 (TL 20+)" },
      { value: "Two", label: "2 (TL 30+)" },
      { value: "Three", label: "3 (TL 40+)" },
      { value: "Four", label: "4 (TL 50+)" },
      { value: "Five", label: "5 (TL 60+)" },
      { value: "Six", label: "6 (TL 65+)" },
    ],
  };
  const mocField = {
    label: "Memory of Chaos",
    description: "Amount of stars you can clear in a MoC cycle",
    options: mocStars(),
  };

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
                          onValueChange={serverField.onChange}
                          value={String(form.watch("server"))}
                          defaultValue={serverField.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Asia">Asia</SelectItem>
                            <SelectItem value="America">America</SelectItem>
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
                  onValueChange={field.onChange}
                  value={String(form.watch("eq"))}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-fit">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Zero">0 (TL 20-)</SelectItem>
                    <SelectItem value="One">1 (TL 20+)</SelectItem>
                    <SelectItem value="Two">2 (TL 30+)</SelectItem>
                    <SelectItem value="Three">3 (TL 40+)</SelectItem>
                    <SelectItem value="Four">4 (TL 50+)</SelectItem>
                    <SelectItem value="Five">5 (TL 60+)</SelectItem>
                    <SelectItem value="Six">6 (TL 65+)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="moc"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <div className="flex-1 space-y-1">
                    <FormLabel>Memory of Chaos</FormLabel>
                    <FormDescription>
                      Amount of stars you can clear in a MoC cycle
                    </FormDescription>
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    value={String(form.watch("moc"))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-fit">
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
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <div className="flex-1 space-y-1">
                    <FormLabel>Current Cycle Completed</FormLabel>
                    <FormDescription>
                      Whether you have completed the current MoC cycle
                    </FormDescription>
                  </div>
                  <Switch
                    onCheckedChange={field.onChange}
                    checked={field.value}
                  />
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
