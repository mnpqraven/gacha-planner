import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
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
} from "../components/ui/Form";
import { Switch } from "../components/ui/Switch";
import { Input } from "../components/ui/Input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/Popover";
import { Button } from "../components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Calendar } from "../components/ui/Calendar";
import { useEffect, useState } from "react";
import { dateToISO } from "./schemas";
import { placeholderTableData } from "./tableData";
import { Separator } from "./ui/Separator";
import { useFuturePatchDateList } from "@/hooks/queries/useFuturePatchDate";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog,
  CommandSeparator,
  CommandShortcut,
} from "./ui/Command";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type Props = {
  submitButton?: boolean;
  updateTable: (to: z.infer<typeof ENDPOINT.jadeEstimate.response>) => void;
};

type FormSchema = z.infer<typeof ENDPOINT.jadeEstimate.payload>;
type BPType = FormSchema["battlePass"]["battlePassType"];

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
  currentRolls: 0,
};

export default function JadeEstimateForm({
  updateTable,
  submitButton = false,
}: Props) {
  const [usingRailPass, setUsingRailPass] = useState(false);

  const [usingBP, setUsingBP] = useState<BPType>("None");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [monthController, setMonthController] = useState<Date | undefined>(
    date
  );
  const { futurePatchDateList } = useFuturePatchDateList();
  const patchStartDays = futurePatchDateList.patches.map(
    ({ dateStart }) => new Date(dateStart)
  );

  // form setup
  const form = useForm<FormSchema>({
    resolver: zodResolver(ENDPOINT.jadeEstimate.payload),
    defaultValues: defaultFormValues,
  });

  const debounceOnChange = useDebounce(form.handleSubmit(onSubmit), 300);
  const untilDateSubscription = form.watch("untilDate");

  // NOTE: bandaid to manually trigger date
  useEffect(() => {
    debounceOnChange(null);
  }, [untilDateSubscription]);

  const { data, mutate } = useMutation({
    mutationKey: ["jadeEstimate"],
    mutationFn: async (payload: FormSchema) =>
      await workerFetch(ENDPOINT.jadeEstimate, {
        payload,
        method: "POST",
      }),
  });

  useEffect(() => {
    if (data) updateTable(data);
  }, [data]);

  function getFooterInfo(date: Date | undefined): string | undefined {
    if (date) {
      const find = futurePatchDateList.patches.find((e) => {
        const left = new Date(e.dateStart);
        return (
          left.getDate() === date.getDate() &&
          left.getMonth() === date.getMonth() &&
          left.getFullYear() === date.getFullYear()
        );
      });
      if (find) {
        return `Start of patch ${find.version}`;
      }
    }
    return undefined;
  }

  function onSubmit(values: FormSchema) {
    const payload: FormSchema = { ...values };
    console.log("onSubmit", payload);
    mutate(payload);
  }

  function onSelectDatePreset(date: string) {
    // today
    if (date === "0") {
      let nextDate = new Date();
      setDate(nextDate);
      setMonthController(nextDate);
    } else {
      setDate(new Date(date));
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
      if (e.key === "k" && (e.altKey || e.metaKey)) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          onChange={debounceOnChange}
        >
          <FormField
            control={form.control}
            name="untilDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <div className="flex-1 space-y-1">
                    <FormLabel>Goal Date</FormLabel>
                    <FormDescription>The date that you'll pull</FormDescription>
                    <FormMessage />
                  </div>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <FormField
                      control={form.control}
                      name="server"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {date ? (
                              format(date, "PPP")
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
                            <span className="text-xs">⌘/Alt + K</span>
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
                              {futurePatchDateList.patches.map((e) => (
                                <CommandItem
                                  key={e.version}
                                  onSelect={() =>
                                    onSelectDatePreset(e.dateStart)
                                  }
                                >
                                  {e.name} -{" "}
                                  {new Date(e.dateStart).getUTCDate()}/
                                  {new Date(e.dateStart).getUTCMonth() + 1}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </CommandDialog>

                        <Calendar
                          className="py-0"
                          mode="single"
                          selected={date}
                          onSelect={(e) => {
                            setDate(e);
                            if (e) field.onChange(dateToISO.parse(e));
                            else field.onChange(undefined);
                          }}
                          disabled={beforeToday}
                          month={monthController}
                          onMonthChange={setMonthController}
                          modifiers={{ patchStart: patchStartDays }}
                          modifiersStyles={{
                            patchStart: { border: "2px solid white" },
                          }}
                          footer={getFooterInfo(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </FormItem>
            )}
          />
          <div className="rounded-md border p-4">
            <FormField
              control={form.control}
              name="railPass.useRailPass"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <FormLabel>Rail Pass</FormLabel>
                      <FormDescription>Opt-in</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(e) => {
                          setUsingRailPass(e);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {usingRailPass && (
              <>
                <Separator className="my-4" />
                <FormField
                  control={form.control}
                  name="railPass.daysLeft"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <div className="flex-1">
                          <FormLabel>Days Left</FormLabel>
                          <FormDescription>
                            You'll receive 300 jades for renewing the
                            subscription
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Input type="number" {...field} className="w-20" />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <div className="rounded-md border p-4">
            <FormField
              control={form.control}
              name="battlePass.battlePassType"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <div className="flex-1 space-y-1">
                      <FormLabel>Nameless Honor</FormLabel>
                      <FormDescription>
                        If not selecting F2P, this assumes you've received the
                        current patch's first time purchase rewards and those
                        won't be calculated.
                      </FormDescription>
                    </div>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                        setUsingBP(e as unknown as NonNullable<typeof usingBP>);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-fit">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="None">F2P</SelectItem>
                        <SelectItem value="Basic">Nameless Glory</SelectItem>
                        <SelectItem value="Premium">Nameless Medal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            {usingBP !== "None" && (
              <>
                <Separator className="my-4" />
                <FormField
                  control={form.control}
                  name="battlePass.currentLevel"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <div className="flex items-center">
                        <div className="flex-1 space-y-1">
                          <FormLabel>Current Nameless Honor Level</FormLabel>
                          <FormDescription>
                            This assumes you level up by 10 every Monday.
                            <br />
                            If you select 'Nameless Medal' then keep in mind you
                            also get 10 levels for free, please update the level
                            accordingly.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Input
                            className="w-20"
                            type="number"
                            min={0}
                            onKeyDown={preventMinus}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
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
                          {value}*
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div className="flex items-center space-x-4 rounded-md border p-4">
            <Tabs defaultValue="currentRolls" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="currentRolls" className="w-full">
                  Rolls
                </TabsTrigger>
                <TabsTrigger value="currentJades" className="w-full">
                  Jades
                </TabsTrigger>
              </TabsList>
              <TabsContent value="currentRolls">
                <FormField
                  control={form.control}
                  name="currentRolls"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex">
                        <div className="flex-1 space-y-1">
                          <FormLabel>Current rolls</FormLabel>
                          <FormDescription>
                            Amount of rolls you currently possess
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Input
                            className="w-20"
                            type="number"
                            min={0}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="currentJades">
                <FormField
                  control={form.control}
                  name="currentJades"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex">
                        <div className="flex-1 space-y-1">
                          <FormLabel>Current jades</FormLabel>
                          <FormDescription>
                            Amount of jades you currently possess
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Input
                            className="w-20"
                            type="number"
                            min={0}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </div>
          {submitButton && <Button type="submit">Calculate</Button>}
        </form>
      </Form>
    </>
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

function mocStars(): number[] {
  function* range(start: number, end: number, step: number) {
    while (start <= end) {
      yield start;
      start += step;
    }
  }
  return Array.from(range(0, 30, 3));
}
