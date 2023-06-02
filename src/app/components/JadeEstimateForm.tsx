import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { workerFetch } from "@/server/fetchHelper";
import { ENDPOINT } from "@/server/endpoints";
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
import { dateToISO, jadeEstimateFormSchema } from "./schemas";

type Props = {
  jadeEstimateMutate: (payload: z.infer<typeof jadeEstimateFormSchema>) => void;
  submitButton?: boolean;
};

export default function JadeEstimateForm({
  jadeEstimateMutate,
  submitButton = false,
}: Props) {
  const defaultFormValues: z.infer<typeof jadeEstimateFormSchema> = {
    untilDate: dateToISO.parse(new Date()),
    battlePass: false,
    railPass: {
      useRailPass: false,
      daysLeft: 30,
    },
    level: 50,
    currentRolls: 0,
  };
  const [usingRailPass, setUsingRailPass] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const form = useForm<z.infer<typeof jadeEstimateFormSchema>>({
    resolver: zodResolver(jadeEstimateFormSchema),
    defaultValues: defaultFormValues,
  });
  const untilDateSubscription = form.watch("untilDate");

  const debounceOnChange = useDebounce(form.handleSubmit(onSubmit), 1000);

  const query = useQuery({
    queryKey: [ENDPOINT.listFuturePatchDate],
    queryFn: async () => await workerFetch(ENDPOINT.listFuturePatchDate),
  });

  // NOTE: bandaid to manually trigger date
  useEffect(() => {
    debounceOnChange(() => {});
  }, [untilDateSubscription, date]);

  function onSubmit(values: z.infer<typeof jadeEstimateFormSchema>) {
    const untilDate = dateToISO.parse(date);
    const payload: z.infer<typeof jadeEstimateFormSchema> = {
      ...values,
      untilDate,
    };
    // console.warn("onSubmit", payload);
    jadeEstimateMutate(payload);
  }

  function onSelectDatePreset(date: string) {
    // today
    if (date === "0") setDate(new Date());
    else setDate(new Date(date));
  }

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
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="flex w-auto flex-col space-y-2 p-2"
                      align="start"
                    >
                      <Select onValueChange={onSelectDatePreset}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="0">Today</SelectItem>
                          {query.data?.patches.map((e) => (
                            <SelectItem value={e.dateStart} key={e.version}>
                              {e.name} - {e.version}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(e) => {
                          setDate(e);
                          field.onChange(dateToISO.parse(e));
                        }}
                        disabled={beforeToday}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="railPass.useRailPass"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <div className="flex-1 space-y-1">
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
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          {usingRailPass && (
            <FormField
              control={form.control}
              name="railPass.daysLeft"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                      <FormLabel>Days Left</FormLabel>
                      <FormDescription>
                        You'll receive 300 jades for renewing the subscription
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Input type="number" {...field} className="w-20" />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="battlePass"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <div className="flex-1 space-y-1">
                    <FormLabel>Nameless Honor</FormLabel>
                    <FormDescription>
                      Opt-in(the premium option)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <div className="flex-1 space-y-1">
                    <FormLabel>Trailblazer Level</FormLabel>
                    <FormDescription>
                      You get more rewards the higher your Equilibrum level is
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Input type="number" {...field} className="w-20" />
                  </FormControl>
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
                          <Input className="w-20" type="number" {...field} />
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
                          <Input className="w-20" type="number" {...field} />
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
