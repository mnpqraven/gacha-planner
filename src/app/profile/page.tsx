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
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useMihomoInfo } from "./[uid]/_fetcherQuery";
import { useToast } from "../components/ui/Toast/useToast";
import Image from "next/image";
import { img } from "@/lib/utils";

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
  const [isLoading, setIsLoading] = useState(false);
  const { mutation } = useMihomoInfo();
  const { toast } = useToast();

  async function onSubmit(values: FormSchema) {
    try {
      setIsLoading(true);
      const { uid, lang } = values;
      await mutation.mutateAsync({ uid, lang });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error encountered",
        description: err as string,
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log("mutation", mutation.data);
  }, [mutation]);

  return (
    <main className="flex flex-col items-center gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center gap-4 pt-12 md:flex-row md:items-start"
        >
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

          <Button
            type="submit"
            className="mt-4 w-fit items-center md:mt-[34px] md:self-start"
            size="sm"
          >
            Search
          </Button>
        </form>
      </Form>

      {isLoading && <Loader2 className="mr-1 animate-spin" />}
      {/* mutation.data && (
        <Button
          className="flex h-fit items-center gap-2.5"
          variant="outline"
          onClick={() => {
            if (mutation.variables) {
              const { uid, lang } = mutation.variables;
              router.push(`profile/${uid}?lang=${lang}`);
            }
          }}
        >
          <Image
            src={img(mutation.data.player.avatar.icon)}
            alt={mutation.data.player.avatar.name}
            height={64}
            width={64}
          />

          <span>{mutation.data.player.nickname}</span>
        </Button>
      )*/}
    </main>
  );
}
