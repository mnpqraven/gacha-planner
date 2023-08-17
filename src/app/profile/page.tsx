"use client";

import { useForm } from "react-hook-form";
import { Input } from "../components/ui/Input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/Form";
import { LANG, LANGS } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Loader2 } from "lucide-react";
import { useMihomoInfo } from "./[uid]/_fetcher";
import { useEffect, useState } from "react";
import { PlayerCard } from "./PlayerCard";
import { useRouter } from "next/navigation";

const schema = z.object({
  uid: z
    .string()
    .min(1, { message: "Player UID must contain at least 1 character" })
    .refine(
      (val) =>
        z.string().regex(/^\d+$/).transform(Number).safeParse(val).success,
      { message: "Invalid number" }
    ),
  lang: z.enum(LANGS),
});
type FormSchema = z.infer<typeof schema>;

const defaultValues: FormSchema = { uid: "", lang: "en" };

export default function Profile() {
  const form = useForm<FormSchema>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const [prof, setProf] = useState(defaultValues);
  const { query } = useMihomoInfo(prof);

  function onSubmit(values: FormSchema) {
    setProf(values);
  }

  const router = useRouter();
  useEffect(() => {
    if (!!query.data) {
      const url = `/profile/${prof.uid}?lang=${prof.lang}`;
      router.prefetch(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return (
    <main className="flex flex-col items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex h-32 flex-col items-center justify-center gap-4 md:flex-row md:items-start"
        >
          <FormField
            name="uid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your UID..."
                    className="w-56"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="w-56 whitespace-pre-wrap" />
              </FormItem>
            )}
          />

          <FormField
            name="lang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
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
                    {Object.entries(LANG).map(([lang, label]) => (
                      <SelectItem key={lang} value={lang}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-4 w-fit items-center md:mt-[34px] md:self-start"
            size="sm"
          >
            Search
          </Button>
        </form>
      </Form>

      {query.isInitialLoading && <Loader2 className="mr-1 animate-spin" />}
      {query.data && <PlayerCard data={query.data} {...prof} />}
    </main>
  );
}
