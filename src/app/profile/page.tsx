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
import { useRouter } from "next/navigation";

const schema = z.object({
  uid: z
    .string()
    .min(1, { message: "Player UID must contain at least 1 character" })
    .refine(
      (val) =>
        z.string().regex(/^\d+$/).transform(Number).safeParse(val).success,
      {
        message: "Invalid number",
      }
    ),
  lang: z.enum(LANGS),
});
type FormSchema = z.infer<typeof schema>;

export default function Profile() {
  const form = useForm<FormSchema>({
    defaultValues: { uid: "", lang: "en" },
    resolver: zodResolver(schema),
  });
  const router = useRouter();

  function onSubmit(values: FormSchema) {
    console.log(values);
    const { uid, lang } = values;
    router.push(`profile/${uid}?lang=${lang}`);
  }

  return (
    <main className="flex h-[50vh] items-start justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
          <FormField
            name="uid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UID</FormLabel>
                <FormControl>
                  <Input placeholder="enter your UID" {...field} />
                </FormControl>
                <FormMessage className="whitespace-pre-wrap" />
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

          <Button type="submit" className="w-fit self-end">
            Search
          </Button>
        </form>
      </Form>
    </main>
  );
}
