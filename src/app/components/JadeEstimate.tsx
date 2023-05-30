"use client";

import { Calendar } from "./ui/Calendar";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Switch } from "./ui/Switch";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation } from "@tanstack/react-query";
import { workerFetch } from "@/server/fetchHelper";
import { ENDPOINT } from "@/server/endpoints";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";

const formSchema = z.object({
  untilDate: z.date({
    required_error: "a date is required",
  }),
  battlePass: z.boolean(),
  railPass: z.object({
    useRailPass: z.boolean(),
    daysLeft: z.preprocess(
      (args) => (args === "" ? undefined : args),
      z.coerce.number({
        invalid_type_error: "Must be a number",
        required_error: "Required field",
      })
    ),
  }),
  level: z.preprocess(
    (args) => (args === "" ? undefined : args),
    z.coerce
      .number({
        invalid_type_error: "Must be a number",
        required_error: "Required field",
      })
      .positive()
      .max(75)
  ),
  currentRolls: z.preprocess(
    (args) => (args === "" ? undefined : args),
    z.coerce
      .number({
        invalid_type_error: "Must be a number",
        required_error: "Required field",
      })
      .nonnegative()
      .optional()
  ),
  currentJades: z.preprocess(
    (args) => (args === "" ? undefined : args),
    z.coerce
      .number({
        invalid_type_error: "Must be a number",
        required_error: "Required field",
      })
      .nonnegative()
      .optional()
  ),
});

const dateToISO = z.date().transform((e) => ({
  day: e.getDate(),
  month: e.getMonth() + 1,
  year: e.getUTCFullYear(),
}));

type Props = {
  updateAvailableRoles: (amount: number) => void;
};
export const JadeEstimate = ({ updateAvailableRoles }: Props) => {
  const [usingRailPass, setUsingRailPass] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      untilDate: new Date(),
      battlePass: false,
      railPass: {
        useRailPass: false,
        daysLeft: 30,
      },
      level: 50,
      currentRolls: 0,
    },
  });

  const debounceOnChange = useDebounce(form.handleSubmit(onSubmit), 1000);

  type Omitted = Omit<z.infer<typeof formSchema>, "untilDate">;
  type Payload = {
    untilDate: z.infer<typeof dateToISO>;
  } & Omitted;

  type BackendReturn = {
    sources: { source: string; value: number }[];
    total_jades: number;
    rolls: number;
    days: number;
  };
  const query = useMutation({
    mutationFn: async (payload: Payload) =>
      await workerFetch<Payload, BackendReturn>(ENDPOINT.jadeEstimate, {
        payload,
        method: "POST",
      }),
    onSuccess: (data) => updateAvailableRoles(data.rolls),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const untilDate = dateToISO.parse(values.untilDate);
    const { level, railPass, battlePass, currentRolls, currentJades } = values;
    const payload: Payload = {
      untilDate,
      level,
      railPass,
      battlePass,
      currentRolls,
      currentJades,
    };
    console.log(payload);
    query.mutate(payload);
  }

  useEffect(() => {
    console.log(query.data);
  }, [query.data]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          // if using debounce form submission
          // onChange={debounceOnChange}
        >
          <FormField
            control={form.control}
            name="railPass.useRailPass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rail Pass</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(e) => {
                      setUsingRailPass(e);
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormDescription>railpass description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {usingRailPass && (
            <FormField
              control={form.control}
              name="railPass.daysLeft"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days Left</FormLabel>
                  <FormControl>
                    <Input placeholder="Days Left" type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="battlePass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Battle Pass</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>battlepass description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trailblazer Level</FormLabel>
                <FormControl>
                  <Input placeholder="Level" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  You get more rewards the higher your Equilibrum level is
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Tabs defaultValue="currentRolls">
            <TabsList>
              <TabsTrigger value="currentRolls">Rolls</TabsTrigger>
              <TabsTrigger value="currentJades">Jades</TabsTrigger>
            </TabsList>
            <TabsContent value="currentRolls">
              <FormField
                control={form.control}
                name="currentRolls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current rolls</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Current rolls"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Amount of rolls you currently possess
                    </FormDescription>
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
                    <FormLabel>Current jades</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Current jades"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Amount of jades you currently possess
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
          <FormField
            control={form.control}
            name="untilDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Goal Date</FormLabel>
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
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>The date that you'll pull</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Calculate</Button>
        </form>
      </Form>
      {query.data && (
        <>
          {query.data.sources.map((e, index) => (
            <div key={index}>
              From {e.source}: {e.value}
            </div>
          ))}
          <p>
            <b>Total jades: {query.data.total_jades}</b> <br />
            <b>Total rolls: {query.data.rolls}</b>
          </p>
        </>
      )}
    </>
  );
};
